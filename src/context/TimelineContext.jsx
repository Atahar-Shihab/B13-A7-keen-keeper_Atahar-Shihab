/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from "react";
import { toast } from "react-toastify"; // Or react-hot-toast, depending on what you installed

export const TimelineContext = createContext();

export const TimelineProvider = ({ children }) => {
  const [timeline, setTimeline] = useState([]);

  const addInteraction = (type, friendName) => {
    const newEntry = {
      id: Date.now(),
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric", month: "short", day: "numeric",
        hour: "2-digit", minute: "2-digit"
      }),
      type: type,
      title: `${type} with ${friendName}`,
    };
    
    setTimeline([newEntry, ...timeline]);
    toast.success(`${type} interaction added for ${friendName}!`);
  };

  return (
    <TimelineContext.Provider value={{ timeline, addInteraction }}>
      {children}
    </TimelineContext.Provider>
  );
};
