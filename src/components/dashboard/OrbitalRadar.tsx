import React, { useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import {
  MessageSquare,
  Sparkles,
  ExternalLink,
  Clock,
  Send,
  Calendar,
  X,
  Phone,
  Mail,
} from 'lucide-react';
import { Friend, CircleTier, HealthStatus, PersonaCategory } from '../../types';
import { useFriends } from '../../context/FriendContext';
import { getDaysElapsed } from '../../lib/relationshipEngine';
import { HealthRing } from '../ui/HealthRing';
import { launchOutreach } from '../../lib/outreachLauncher';
import { toast } from 'sonner';

interface OrbitalRadarProps {
  friends: Friend[];
  activePersona?: PersonaCategory | 'all';
}

interface OrbitTierConfig {
  tier: CircleTier;
  radius: number;
  label: string;
  cadence: string;
}

const ORBIT_CONFIGS: OrbitTierConfig[] = [
  { tier: 'Inner Circle', radius: 105, label: 'Inner Circle', cadence: '7d cadence' },
  { tier: 'Close Friends', radius: 185, label: 'Close Friends', cadence: '14d cadence' },
  { tier: 'Key Network', radius: 265, label: 'Key Network', cadence: '30d cadence' },
  { tier: 'Acquaintances', radius: 345, label: 'Acquaintances', cadence: '90d cadence' },
];

const STATUS_COLORS: Record<HealthStatus, { hex: string; glow: string }> = {
  Thriving: { hex: '#10b981', glow: 'rgba(16, 185, 129, 0.4)' },
  Steady: { hex: '#3b82f6', glow: 'rgba(59, 130, 246, 0.4)' },
  Drifting: { hex: '#f59e0b', glow: 'rgba(245, 158, 11, 0.5)' },
  Overdue: { hex: '#ef4444', glow: 'rgba(239, 68, 68, 0.6)' },
};

export const OrbitalRadar: React.FC<OrbitalRadarProps> = ({ friends, activePersona = 'all' }) => {
  const navigate = useNavigate();
  const { openCommandPalette } = useFriends();
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Filter friends according to active persona
  const filteredFriends = useMemo(() => {
    if (activePersona === 'all') return friends;
    return friends.filter((f) => f.category === activePersona);
  }, [friends, activePersona]);

  // Compute node coordinates along concentric orbit rings
  const positionedNodes = useMemo(() => {
    return ORBIT_CONFIGS.flatMap((config, configIndex) => {
      const tierFriends = filteredFriends.filter((f) => f.circleTier === config.tier);
      const totalInTier = tierFriends.length;
      if (totalInTier === 0) return [];

      // Stagger base rotation angle per orbit so nodes don't line up in a straight spoke
      const angleOffset = (configIndex * Math.PI) / 4;

      return tierFriends.map((friend, idx) => {
        const angle = angleOffset + (2 * Math.PI * idx) / totalInTier;
        const x = Math.round(config.radius * Math.cos(angle));
        const y = Math.round(config.radius * Math.sin(angle));
        return {
          friend,
          x,
          y,
          radius: config.radius,
          tier: config.tier,
        };
      });
    });
  }, [filteredFriends]);

  // GSAP entrance animation on mount / persona switch
  useGSAP(
    () => {
      if (!svgRef.current) return;

      const rings = svgRef.current.querySelectorAll('.orbit-ring');
      const nodes = svgRef.current.querySelectorAll('.radar-node');
      const center = svgRef.current.querySelector('.center-nucleus');

      gsap.fromTo(
        rings,
        { scale: 0.3, opacity: 0, transformOrigin: 'center center' },
        { scale: 1, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power2.out' }
      );

      gsap.fromTo(
        center,
        { scale: 0, opacity: 0, transformOrigin: 'center center' },
        { scale: 1, opacity: 1, duration: 0.7, ease: 'back.out(1.7)', delay: 0.2 }
      );

      gsap.fromTo(
        nodes,
        { scale: 0, opacity: 0, transformOrigin: 'center center' },
        {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          stagger: 0.04,
          ease: 'back.out(1.5)',
          delay: 0.35,
        }
      );
    },
    { dependencies: [activePersona, positionedNodes.length], scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-3xl bg-gradient-to-b from-slate-900 via-[#0B0D17] to-slate-950 border border-slate-800/80 p-4 sm:p-8 overflow-hidden shadow-2xl text-white select-none"
    >
      {/* Background ambient solar flares */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] bg-purple-500/10 rounded-full blur-[60px] pointer-events-none" />

      {/* Header bar with legend */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs uppercase font-mono tracking-widest text-indigo-400">
              Live Solar Orbit
            </span>
          </div>
          <h3 className="text-xl font-bold tracking-tight text-white mt-0.5">
            Orbital Relationship Radar
          </h3>
          <p className="text-xs text-slate-400">
            Concentric cadence rings visualize decay velocity. Pulsing beacons indicate drifting contacts.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 bg-slate-800/60 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-700/60 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-slate-300">Thriving</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-slate-300">Steady</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-slate-300">Drifting</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span className="text-slate-300">Overdue</span>
          </div>
        </div>
      </div>

      {/* SVG Solar System Canvas */}
      <div className="relative w-full max-w-[760px] mx-auto aspect-square flex items-center justify-center">
        <svg
          ref={svgRef}
          viewBox="-400 -400 800 800"
          className="w-full h-full overflow-visible"
        >
          <defs>
            {/* Center Nucleus Glow */}
            <radialGradient id="nucleusGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#6366F1" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#4338CA" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#1E1B4B" stopOpacity="0" />
            </radialGradient>

            {/* Reusable clip paths for contact avatars */}
            {positionedNodes.map(({ friend }) => (
              <clipPath key={`clip-${friend.id}`} id={`avatar-clip-${friend.id}`}>
                <circle cx="0" cy="0" r="16" />
              </clipPath>
            ))}
          </defs>

          {/* Concentric Orbit Rings */}
          {ORBIT_CONFIGS.map((config) => (
            <g key={`orbit-${config.tier}`} className="orbit-ring">
              <circle
                cx="0"
                cy="0"
                r={config.radius}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeDasharray="4 6"
                className="text-slate-800/80 transition-colors"
              />
              {/* Ring Label along the top-vertical axis */}
              <g transform={`translate(0, ${-config.radius})`}>
                <rect
                  x="-42"
                  y="-10"
                  width="84"
                  height="18"
                  rx="9"
                  fill="#0F172A"
                  stroke="#334155"
                  strokeWidth="0.8"
                />
                <text
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-slate-400 text-[9px] font-mono font-medium tracking-tight"
                >
                  {config.label}
                </text>
              </g>
            </g>
          ))}

          {/* Center Nucleus: "YOU" */}
          <g className="center-nucleus cursor-pointer">
            <circle cx="0" cy="0" r="42" fill="url(#nucleusGlow)" />
            <circle
              cx="0"
              cy="0"
              r="22"
              fill="#1E1B4B"
              stroke="#6366F1"
              strokeWidth="2"
              className="shadow-lg shadow-indigo-500/50"
            />
            <text
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-white font-bold text-[10px] tracking-wider"
            >
              YOU
            </text>
          </g>

          {/* Contact Nodes */}
          {positionedNodes.map(({ friend, x, y }) => {
            const statusConfig = STATUS_COLORS[friend.status] || STATUS_COLORS.Steady;
            const isSelected = selectedFriend?.id === friend.id;
            const isAlerting = friend.status === 'Overdue' || friend.status === 'Drifting';

            return (
              <g
                key={`node-${friend.id}`}
                transform={`translate(${x}, ${y})`}
                className="radar-node cursor-pointer group"
                onClick={() => setSelectedFriend(friend)}
              >
                {/* Pulsing Beacon Ring for Drifting/Overdue contacts */}
                {isAlerting && (
                  <circle
                    cx="0"
                    cy="0"
                    r="24"
                    fill="none"
                    stroke={statusConfig.hex}
                    strokeWidth="1.5"
                    opacity="0.6"
                    className="animate-ping"
                    style={{ animationDuration: friend.status === 'Overdue' ? '1.8s' : '2.8s' }}
                  />
                )}

                {/* Selected Halo Ring */}
                {isSelected && (
                  <circle
                    cx="0"
                    cy="0"
                    r="26"
                    fill="none"
                    stroke="#818CF8"
                    strokeWidth="2"
                    strokeDasharray="3 3"
                    className="animate-spin"
                    style={{ animationDuration: '6s' }}
                  />
                )}

                {/* Background disc */}
                <circle cx="0" cy="0" r="18" fill="#090A0F" />

                {/* Avatar Image */}
                <image
                  href={friend.avatar}
                  x="-16"
                  y="-16"
                  width="32"
                  height="32"
                  preserveAspectRatio="xMidYMid slice"
                  clipPath={`url(#avatar-clip-${friend.id})`}
                />

                {/* Health Status Outer Ring */}
                <circle
                  cx="0"
                  cy="0"
                  r="17"
                  fill="none"
                  stroke={statusConfig.hex}
                  strokeWidth="2.5"
                  className="transition-transform group-hover:scale-110"
                />

                {/* Health Badge Score indicator */}
                <g transform="translate(11, -11)">
                  <circle cx="0" cy="0" r="8" fill={statusConfig.hex} />
                  <text
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-slate-950 font-bold text-[8px]"
                  >
                    {friend.healthScore}
                  </text>
                </g>

                {/* Contact Name pill below node */}
                <g transform="translate(0, 26)">
                  <rect
                    x="-34"
                    y="-8"
                    width="68"
                    height="16"
                    rx="8"
                    fill="#0F172A"
                    stroke={isSelected ? '#818CF8' : '#1E293B'}
                    strokeWidth="1"
                    className="group-hover:stroke-indigo-400 transition-colors"
                  />
                  <text
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-slate-200 text-[9px] font-medium tracking-tight truncate"
                  >
                    {friend.name.split(' ')[0]}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>

        {/* Floating Glassmorphic Inspector Drawer for Selected Contact */}
        {selectedFriend && (
          <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 w-[calc(100%-1rem)] sm:w-80 bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-4 shadow-2xl z-30 animate-in fade-in slide-in-from-bottom-4 duration-200">
            {/* Close button */}
            <button
              onClick={() => setSelectedFriend(null)}
              className="absolute top-3 right-3 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              aria-label="Close inspector"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Profile Brief */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={selectedFriend.avatar}
                  alt={selectedFriend.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500/60"
                />
                <span
                  className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-slate-900"
                  style={{ backgroundColor: STATUS_COLORS[selectedFriend.status].hex }}
                />
              </div>

              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-bold text-white truncate flex items-center gap-1.5">
                  {selectedFriend.name}
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded-full font-semibold uppercase ${
                      selectedFriend.category === 'career'
                        ? 'bg-purple-950 text-purple-300 border border-purple-800/60'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                    }`}
                  >
                    {selectedFriend.category === 'career' ? 'Career' : 'Personal'}
                  </span>
                </h4>
                <p className="text-xs text-slate-400 truncate">
                  {selectedFriend.roleOrContext || selectedFriend.companyOrOrg || selectedFriend.circleTier}
                </p>
              </div>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-2 gap-2 my-3 p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <div className="flex items-center gap-2">
                <HealthRing score={selectedFriend.healthScore} size={36} strokeWidth={3.5} showScore={false} />
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-mono">Health</div>
                  <div className="text-xs font-bold text-white">
                    {selectedFriend.healthScore}% • {selectedFriend.status}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 border-l border-slate-700/60 pl-2.5">
                <Clock className="w-4 h-4 text-slate-400" />
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-mono">Last Seen</div>
                  <div className="text-xs font-bold text-white">
                    {getDaysElapsed(selectedFriend.lastContactDate)}d ago
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2 mt-2">
              <button
                onClick={() => {
                  openCommandPalette(selectedFriend.id);
                  setSelectedFriend(null);
                }}
                className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-colors shadow-sm"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Log Catch-Up</span>
              </button>

              <button
                onClick={() => navigate(`/friend/${selectedFriend.id}`)}
                className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-colors border border-slate-700/80"
              >
                <span>Full Profile</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Outreach Row */}
            <div className="flex items-center justify-between gap-1.5 mt-2 pt-2 border-t border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Outreach:</span>
              <div className="flex items-center gap-1">
                {selectedFriend.phone && (
                  <button
                    onClick={() => {
                      launchOutreach('whatsapp', {
                        name: selectedFriend.name,
                        phone: selectedFriend.phone,
                        messageText: `Hey ${selectedFriend.name.split(' ')[0]}! Long time no talk, how have you been?`,
                      });
                    }}
                    className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] flex items-center gap-1"
                    title="Open WhatsApp"
                  >
                    <Phone className="w-3 h-3" />
                    <span>WhatsApp</span>
                  </button>
                )}
                {selectedFriend.email && (
                  <button
                    onClick={() => {
                      launchOutreach('email', {
                        name: selectedFriend.name,
                        email: selectedFriend.email,
                        subject: `Catch-up with ${selectedFriend.name}`,
                        messageText: `Hi ${selectedFriend.name},\n\nJust thinking about our recent projects and wanted to see how everything is going!\n\nBest,`,
                      });
                    }}
                    className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[11px] flex items-center gap-1"
                    title="Send Email"
                  >
                    <Mail className="w-3 h-3" />
                    <span>Email</span>
                  </button>
                )}
                {selectedFriend.linkedinUrl && (
                  <button
                    onClick={() => {
                      launchOutreach('linkedin', {
                        name: selectedFriend.name,
                        linkedinUrl: selectedFriend.linkedinUrl,
                      });
                    }}
                    className="p-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 text-[11px] flex items-center gap-1"
                    title="Open LinkedIn"
                  >
                    <Send className="w-3 h-3" />
                    <span>LinkedIn</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
