import { useContext } from "react";
import { TimelineContext } from "../context/TimelineContext";
import toast from "react-hot-toast";

const QuickCheckInCard = ({ friend }) => {

  const { addInteraction } = useContext(TimelineContext);


  const handleInteraction = (type) => {

    addInteraction(type, friend.name);
    
    toast.success(`Logged ${type} with ${friend.name}!`);
  };

  return (
    <div className="card bg-base-100 shadow-xl p-4">
      <h3 className="font-bold mb-4">Quick Check-In</h3>
      <div className="flex gap-2">
        <button 
          onClick={() => handleInteraction('Call')} 
          className="btn btn-primary flex-1">
          Call
        </button>
        <button 
          onClick={() => handleInteraction('Text')} 
          className="btn btn-secondary flex-1">
          Text
        </button>
        <button 
          onClick={() => handleInteraction('Video')} 
          className="btn btn-accent flex-1">
          Video
        </button>
      </div>
    </div>
  );
};