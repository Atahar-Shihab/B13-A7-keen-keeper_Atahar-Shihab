import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

const Home = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/friends.json")
      .then((res) => res.json())
      .then((data) => {
        setFriends(data);
        setLoading(false);
      });
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case "overdue": return "bg-red-100 text-red-700";
      case "almost due": return "bg-yellow-100 text-yellow-700";
      case "on-track": return "bg-green-100 text-green-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) return <div className="text-center py-20 text-xl font-bold text-gray-600">Loading...</div>;

  const overdueCount = friends.filter(f => f.status === 'overdue').length;
  const onTrackCount = friends.filter(f => f.status === 'on-track').length;

  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="bg-[#F8F9FA] rounded-[2rem] p-8 md:p-16 relative mb-28 border border-gray-200">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 max-w-6xl mx-auto">
          
          {/* Left Text Side */}
          <div className="flex-1 text-center md:text-left z-10">
            <h1 className="text-4xl md:text-6xl font-extrabold text-black mb-4 tracking-tight leading-[1.1]">
              Keep Your Friendships <br className="hidden md:block"/> Alive
            </h1>
            <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto md:mx-0">
              Nurture the connections that matter most to you.
            </p>
            <button className="bg-black hover:bg-gray-800 text-white px-8 py-3.5 rounded-full font-semibold flex items-center gap-2 mx-auto md:mx-0 transition-all shadow-lg">
              <Plus size={20} /> Add a Friend
            </button>
          </div>

          {/* Right Image Side */}
          <div className="flex-1 flex justify-center md:justify-end">
            <img 
              src="/assets/hero.png" 
              alt="Friends connecting" 
              className="w-full max-w-md object-contain"
            />
          </div>
        </div>

        {/* Floating Summary Cards */}
        <div className="absolute -bottom-12 left-0 right-0 max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {label: "Total Friends", val: friends.length}, 
              {label: "Overdue", val: overdueCount}, 
              {label: "On Track", val: onTrackCount}, 
              {label: "This Week", val: 1}
            ].map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
                <span className="text-gray-500 text-sm font-medium mb-1">{stat.label}</span>
                <span className="text-3xl font-extrabold text-black">{stat.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Friends Grid */}
      <div className="mt-8 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-black">Your Friends</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {friends.map((friend) => (
            <Link to={`/friend/${friend.id}`} key={friend.id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden flex flex-col group">
              {/* Top Colored Bar */}
              <div className={`w-full py-2 text-[10px] font-bold uppercase tracking-widest text-center ${getStatusStyle(friend.status)}`}>
                {friend.status}
              </div>
              
              <div className="p-6 flex flex-col items-center text-center flex-grow">
                <img src={friend.picture} alt={friend.name} className="w-20 h-20 rounded-full object-cover mb-4 group-hover:scale-105 transition-transform" />
                <h3 className="text-lg font-extrabold text-black">{friend.name}</h3>
                <p className="text-sm text-gray-500 mb-5">Contacted {friend.days_since_contact} days ago</p>
                
                <div className="flex flex-wrap justify-center gap-2 mt-auto">
                  {friend.tags.map((tag, i) => (
                    <span key={i} className="bg-gray-100 text-gray-600 text-xs px-3 py-1.5 rounded-full font-medium">{tag}</span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;