import { useContext, useState } from "react";
import { TimelineContext } from "../context/TimelineContext";
import { Phone, MessageSquare, Video } from "lucide-react";

const Timeline = () => {
  const { timeline } = useContext(TimelineContext);
  const [filter, setFilter] = useState("All");

  // Helper function to render the correct icon based on interaction type
  const getIcon = (type) => {
    if (type === "Call") return <Phone className="text-primary" size={20} />;
    if (type === "Text") return <MessageSquare className="text-secondary" size={20} />;
    if (type === "Video") return <Video className="text-accent" size={20} />;
  };

  // Filter the timeline array based on the dropdown selection
  const filteredTimeline = filter === "All" 
    ? timeline 
    : timeline.filter(item => item.type === filter);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Timeline</h1>
        
        {/* Challenge 2: Timeline Filter */}
        <select 
          className="select select-bordered w-full max-w-xs" 
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
        <div className="alert bg-base-200">No interactions logged yet. Go to a friend's profile to check in!</div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredTimeline.map((item) => (
            <div key={item.id} className="card bg-base-100 shadow-sm border border-base-200">
              <div className="card-body flex-row items-center gap-4 py-4">
                <div className="p-3 bg-base-200 rounded-full">
                  {getIcon(item.type)}
                </div>
                <div>
                  <h3 className="font-bold">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.date}</p>
                </div>
              </div>
            </div>
          ))}
          {filteredTimeline.length === 0 && (
             <div className="text-center py-8 text-gray-500">No entries match this filter.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Timeline;