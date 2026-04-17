import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TimelineContext } from "../context/TimelineContext";
import { Clock, Archive, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const FriendDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addInteraction } = useContext(TimelineContext);
  const [friend, setFriend] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/friends.json")
      .then((res) => res.json())
      .then((data) => {
        const foundFriend = data.find((f) => f.id === parseInt(id));
        if (!foundFriend) navigate("*");
        else setFriend(foundFriend);
        setLoading(false);
      });
  }, [id, navigate]);

  if (loading) return <div className="text-center py-20 font-bold text-gray-600 text-xl">Loading details...</div>;
  if (!friend) return null;

  const getBadgeStyle = (status) => {
    if (status === "overdue") return "bg-red-100 text-red-700";
    if (status === "almost due") return "bg-yellow-100 text-yellow-700";
    return "bg-green-100 text-green-700";
  };

  const handleInteraction = (type) => {
    addInteraction(type, friend.name);
    toast.success(`Logged a ${type} with ${friend.name}!`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
      {/* LEFT COLUMN */}
      <div className="md:col-span-1 space-y-4">
        {/* Profile Card */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center">
          <img src={friend.picture} alt={friend.name} className="w-28 h-28 rounded-full mx-auto mb-4 object-cover" />
          <h2 className="text-2xl font-extrabold text-black">{friend.name}</h2>
          <p className="text-gray-500 text-sm mb-4">{friend.email}</p>
          
          <span className={`inline-block px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6 ${getBadgeStyle(friend.status)}`}>
            {friend.status}
          </span>
          
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {friend.tags.map((tag, i) => (
              <span key={i} className="bg-gray-100 text-gray-600 text-xs px-3 py-1.5 rounded-full font-medium">{tag}</span>
            ))}
          </div>
          
          <p className="text-gray-500 italic text-sm">"{friend.bio}"</p>
        </div>

        {/* Action Buttons */}
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-3">
          <button className="flex items-center gap-3 text-gray-700 hover:bg-gray-50 border border-gray-100 p-3 rounded-xl w-full text-left font-semibold transition-colors">
            <Clock size={18} className="text-gray-500" /> Snooze 2 Weeks
          </button>
          <button className="flex items-center gap-3 text-gray-700 hover:bg-gray-50 border border-gray-100 p-3 rounded-xl w-full text-left font-semibold transition-colors">
            <Archive size={18} className="text-gray-500" /> Archive
          </button>
          <button className="flex items-center gap-3 text-red-600 hover:bg-red-50 border border-red-100 p-3 rounded-xl w-full text-left font-semibold transition-colors">
            <Trash2 size={18} className="text-red-500" /> Delete
          </button>
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="md:col-span-2 space-y-4">
        
        {/* Top 3 Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 text-center flex flex-col justify-center">
            <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest mb-2">Days Since Contact</p>
            <p className="text-3xl font-extrabold text-black">{friend.days_since_contact}</p>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 text-center flex flex-col justify-center">
            <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest mb-2">Goal (Days)</p>
            <p className="text-3xl font-extrabold text-black">{friend.goal}</p>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 text-center flex flex-col justify-center">
            <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest mb-2">Next Due</p>
            <p className="text-xl font-extrabold text-black mt-1">{friend.next_due_date}</p>
          </div>
        </div>

        {/* Relationship Goal Card */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-row justify-between items-center">
          <div>
            <h3 className="font-extrabold text-lg text-black">Relationship Goal</h3>
            <p className="text-gray-500 text-sm mt-1">Keep in touch every {friend.goal} days</p>
          </div>
          <button className="border border-gray-200 text-black px-6 py-2 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
            Edit
          </button>
        </div>

        {/* Quick Check-In Card */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="font-extrabold text-lg text-black mb-4">Quick Check-In</h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={() => handleInteraction("Call")} className="flex-1 bg-white border border-gray-200 hover:bg-gray-50 py-3.5 rounded-2xl flex justify-center items-center gap-2 font-bold text-black transition-colors">
              <img src="/assets/call.png" alt="Call" className="w-5 h-5" /> Call
            </button>
            <button onClick={() => handleInteraction("Text")} className="flex-1 bg-white border border-gray-200 hover:bg-gray-50 py-3.5 rounded-2xl flex justify-center items-center gap-2 font-bold text-black transition-colors">
              <img src="/assets/text.png" alt="Text" className="w-5 h-5" /> Text
            </button>
            <button onClick={() => handleInteraction("Video")} className="flex-1 bg-white border border-gray-200 hover:bg-gray-50 py-3.5 rounded-2xl flex justify-center items-center gap-2 font-bold text-black transition-colors">
              <img src="/assets/video.png" alt="Video" className="w-5 h-5" /> Video
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendDetails;