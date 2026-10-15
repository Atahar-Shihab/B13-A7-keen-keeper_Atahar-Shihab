export type CircleTier =
  | 'Inner Circle'
  | 'Close Friends'
  | 'Key Network'
  | 'Acquaintances';

export type HealthStatus = 'Thriving' | 'Steady' | 'Drifting' | 'Overdue';

export type ChannelType = 'Call' | 'Text' | 'Video' | 'In-Person';

export type InteractionDepth = 'Deep Talk' | 'Catch-Up' | 'Quick Sync';

export type VaultCategory = 'Milestone' | 'Gift Idea' | 'Note';

export interface VaultItem {
  id: string;
  category: VaultCategory;
  title: string;
  description: string;
  date?: string;
  createdAt: string;
}

export interface ActionItem {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
  createdAt: string;
}

export interface Interaction {
  id: string;
  friendId: string;
  date: string; // ISO 8601 string or YYYY-MM-DD
  channel: ChannelType;
  depth: InteractionDepth;
  notes: string;
  topics?: string[];
  createdAt: string;
}

export type PersonaCategory = 'personal' | 'career';

export interface Friend {
  id: string;
  name: string;
  avatar: string;
  email: string;
  phone?: string;
  location?: string;
  company?: string;
  role?: string;
  category: PersonaCategory;
  linkedinUrl?: string;
  roleOrContext?: string;
  companyOrOrg?: string;
  snoozeUntil?: string; // ISO string if check-in snoozed
  circleTier: CircleTier;
  tags: string[];
  bio: string;
  customCadenceDays?: number; // Overrides tier default cadence if specified
  lastContactDate: string; // ISO string
  healthScore: number; // 0-100 calculated
  status: HealthStatus;
  vault: VaultItem[];
  actionItems: ActionItem[];
  createdAt: string;
}

export interface HealthCalculationResult {
  score: number;
  status: HealthStatus;
  daysSinceContact: number;
  targetCadence: number;
  channelWeight: number;
  nextRecommendedDate: string;
  isAttentionNeeded: boolean;
}

export interface NetworkKPIs {
  totalFriends: number;
  averageHealth: number;
  thrivingCount: number;
  steadyCount: number;
  driftingCount: number;
  overdueCount: number;
  needsAttentionCount: number;
  weeklyStreak: number;
  totalInteractions: number;
  monthlyInteractions: number;
}

export interface WeeklyMomentumPoint {
  week: string; // e.g., "Week 1", "Sep 12"
  interactions: number;
  deepTalks: number;
  quickSyncs: number;
}

export interface ChannelMixPoint {
  channel: ChannelType;
  count: number;
  percentage: number;
}

export interface TierHealthPoint {
  tier: CircleTier;
  avgScore: number;
  benchmark: number;
  contactCount: number;
}

export interface AICopilotBriefing {
  summary: string[];
  openCommitments: string[];
  suggestedTopics: string[];
  generatedAt: string;
  source: 'gemini' | 'synthesizer';
}

export interface AICopilotIcebreakers {
  casual: string;
  warmReconnect: string;
  milestoneFollowUp: string;
  generatedAt: string;
  source: 'gemini' | 'synthesizer';
}

export type SortField = 'healthAsc' | 'healthDesc' | 'lastContact' | 'name' | 'tier';

export interface FriendFilterCriteria {
  searchQuery: string;
  categoryFilter?: PersonaCategory | 'All';
  tierFilter: CircleTier | 'All';
  statusFilter: HealthStatus | 'All';
  tagFilter: string | 'All';
  sortBy: SortField;
}

export interface ReconnectSprintDrafts {
  casual: string;
  warm: string;
  professional: string;
}

export interface ReconnectSprintCandidate {
  friend: Friend;
  suggestedAction: string;
  draftMessages: ReconnectSprintDrafts;
  urgency: 'high' | 'medium' | 'low';
}

export interface TimelineFilterCriteria {
  friendId: string | 'All';
  channel: ChannelType | 'All';
  depth: InteractionDepth | 'All';
  dateRange: '7d' | '30d' | '90d' | 'all';
  searchQuery: string;
}
