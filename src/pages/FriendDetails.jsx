import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TimelineContext } from "../context/TimelineContext";
import toast from "react-hot-toast";
import { Phone, MessageSquare, Video, Clock, Archive, Trash2 } from "lucide-react";

const FriendDetails = () => {
  const { id } = useParams(); // Get the ID from the URL
  const navigate = useNavigate();
  const { addInteraction } = useContext(TimelineContext);
  
  const [friend, setFriend] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch the specific friend based on the URL parameter
  useEffect(() => {
    fetch('/friends.json')
      .then(res => res.json())
      .then(data => {
        const foundFriend = data.find(f => f.id === parseInt(id));
        if (!foundFriend) {
          navigate('/404'); // Redirect if ID doesn't exist
        } else {
          setFriend(foundFriend);
        }
        setLoading(false);
      });
  }, [id, navigate]);

  if (loading) return <div className="text-center py-12"><span className="loading loading-spinner loading-lg"></span></div>;
  if (!friend) return null;

  const handleInteraction = (type) => {
    addInteraction(type, friend.name);
    toast.success(`Logged a ${type} with ${friend.name}!`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      {/* LEFT COLUMN: Info Card */}
      <div className="md:col-span-1 flex flex-col gap-4">
        <div className="card bg-base-100 shadow-xl border border-base-200">
          <figure className="px-10 pt-10">
            <img src={friend.picture} alt={friend.name} className="rounded-full w-32 h-32 object-cover ring ring-primary ring-offset-base-100 ring-offset-2" />
          </figure>
          <div className="card-body items-center text-center">
            <h2 className="card-title text-2xl">{friend.name}</h2>
            <p className="text-gray-500">{friend.email}</p>
            
            <div className={`badge badge-lg mt-2 ${
              friend.status === 'overdue' ? 'badge-error text-white' : 
              friend.status === 'almost due' ? 'badge-warning' : 'badge-success text-white'
            }`}>
              {friend.status}
            </div>

            <div className="flex flex-wrap gap-2 justify-center mt-3">
              {friend.tags.map(tag => (
                <span key={tag} className="badge badge-outline">{tag}</span>
              ))}
            </div>
            
            <p className="mt-4 italic text-sm">"{friend.bio}"</p>

            <div className="divider"></div>

            {/* Mock Action Buttons */}
            <div className="w-full flex flex-col gap-2">
              <button className="btn btn-outline btn-sm"><Clock size={16}/> Snooze 2 Weeks</button>
              <button className="btn btn-outline btn-warning btn-sm"><Archive size={16}/> Archive</button>
              <button className="btn btn-outline btn-error btn-sm"><Trash2 size={16}/> Delete</button>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="md:col-span-2 flex flex-col gap-6">
        
        {/* 1. Stats Cards (3 cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="stat bg-base-100 shadow rounded-xl border border-base-200 text-center">
            <div className="stat-title">Days Since Contact</div>
            <div className="stat-value text-primary">{friend.days_since_contact}</div>
          </div>
          <div className="stat bg-base-100 shadow rounded-xl border border-base-200 text-center">
            <div className="stat-title">Goal (Days)</div>
            <div className="stat-value">{friend.goal}</div>
          </div>
          <div className="stat bg-base-100 shadow rounded-xl border border-base-200 text-center">
            <div className="stat-title">Next Due</div>
            <div className="stat-value text-sm mt-2">{friend.next_due_date}</div>
          </div>
        </div>

        {/* 2. Relationship Goal Card */}
        <div className="card bg-base-100 shadow-md border border-base-200">
          <div className="card-body flex-row justify-between items-center">
            <div>
              <h3 className="font-bold text-lg">Relationship Goal</h3>
              <p className="text-gray-500 text-sm">Keep in touch every {friend.goal} days</p>
            </div>
            <button className="btn btn-ghost btn-sm">Edit</button>
          </div>
        </div>

        {/* 3. Quick Check-In Card */}
        <div className="card bg-base-100 shadow-md border border-base-200">
          <div className="card-body">
            <h3 className="font-bold text-lg mb-2">Quick Check-In</h3>
            <div className="flex gap-2">
              <button onClick={() => handleInteraction('Call')} className="btn btn-primary flex-1">
                <Phone size={18}/> Call
              </button>
              <button onClick={() => handleInteraction('Text')} className="btn btn-secondary flex-1">
                <MessageSquare size={18}/> Text
              </button>
              <button onClick={() => handleInteraction('Video')} className="btn btn-accent flex-1">
                <Video size={18}/> Video
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FriendDetails;