import { useContext, useState } from "react";
import { TimelineContext } from "../context/TimelineContext";
import { Phone, MessageSquare, Video } from "lucide-react";

const Timeline = () => {
  const { timeline } = useContext(TimelineContext);
  const [filter, setFilter] = useState("All");

  const getIconDetails = (type) => {
    if (type === "Call") return { icon: <Phone size={20} className="text-green-600" />, bg: "bg-green-100" };
    if (type === "Text") return { icon: <MessageSquare size={20} className="text-blue-600" />, bg: "bg-blue-100" };
    return { icon: <Video size={20} className="text-purple-600" />, bg: "bg-purple-100" };
  };

  const filteredTimeline = filter === "All" ? timeline : timeline.filter(item => item.type === filter);

  return (
    <div className="max-w-3xl mx-auto py-6">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900">Timeline</h1>
        
        <select 
          className="border border-gray-200 bg-white text-gray-700 rounded-xl px-5 py-2.5 font-semibold shadow-sm outline-none focus:ring-2 focus:ring-[#4F46E5]"
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All Interactions</option>
          <option value="Call">Calls Only</option>
          <option value="Text">Texts Only</option>
          <option value="Video">Video Calls Only</option>
        </select>
      </div>

      {timeline.length === 0 ? (
        <div className="bg-white text-gray-500 p-10 rounded-3xl text-center border border-gray-100 shadow-sm font-medium">No interactions logged yet. Go to a friend's profile to check in!</div>
      ) : (
        <div className="flex flex-col gap-5">
          {filteredTimeline.map((item) => {
            const { icon, bg } = getIconDetails(item.type);
            return (
              <div key={item.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-row items-center gap-6">
                <div className={`p-4 rounded-full ${bg}`}>
                  {icon}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-400 font-medium mt-1">{item.date}</p>
                </div>
              </div>
            )
          })}
          {filteredTimeline.length === 0 && (
            <div className="text-center py-10 text-gray-500 font-medium">No entries match this filter.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Timeline;