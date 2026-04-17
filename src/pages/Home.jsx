import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserPlus } from "lucide-react";

const Home = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  // Line-by-line explanation for your viva:
  // 1. useEffect runs once when the Home component mounts (because of the [] dependency array).
  // 2. We fetch the mock data from the public folder.
  // 3. Once the data arrives, we save it to the 'friends' state and set 'loading' to false.
  useEffect(() => {
    fetch('/friends.json')
      .then(res => res.json())
      .then(data => {
        setFriends(data);
        setLoading(false);
      })
      .catch(err => console.error("Failed to fetch friends:", err));
  }, []);

  return (
    <div>
      {/* Banner Section */}
      <div className="text-center py-10 bg-base-200 rounded-xl mb-8">
        <h1 className="text-4xl font-bold mb-4">Keep Your Friendships Alive</h1>
        <p className="mb-6 text-gray-600">Track check-ins, set goals, and never lose touch.</p>
        <button className="btn btn-primary">
          <UserPlus size={18} /> Add a Friend
        </button>
      </div>

      <h2 className="text-2xl font-bold mb-6">Your Friends</h2>

      {/* Conditional Rendering: Show loader OR the grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {friends.map((friend) => (
            <div key={friend.id} className="card bg-base-100 shadow-xl border border-base-200">
              <figure className="px-4 pt-4">
                <img src={friend.picture} alt={friend.name} className="rounded-full w-24 h-24 object-cover" />
              </figure>
              <div className="card-body items-center text-center">
                <h2 className="card-title">{friend.name}</h2>
                <p className="text-sm text-gray-500">Last contact: {friend.days_since_contact} days ago</p>
                
                {/* Dynamic Status Color badge */}
                <div className={`badge ${
                  friend.status === 'overdue' ? 'badge-error text-white' : 
                  friend.status === 'almost due' ? 'badge-warning' : 'badge-success text-white'
                }`}>
                  {friend.status}
                </div>
                
                <div className="card-actions mt-4 w-full">
                  <Link to={`/friend/${friend.id}`} className="btn btn-outline btn-primary w-full">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;