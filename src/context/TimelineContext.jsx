import { createContext, useState } from "react";


export const TimelineContext = createContext();


export const TimelineProvider = ({ children }) => {
  
  const [timeline, setTimeline] = useState([]);


  const addInteraction = (type, friendName) => {
    const newEntry = {
      id: Date.now(), 
      date: new Date().toLocaleDateString(), 
      type: type, 
      title: `${type} with ${friendName}`
    };

    setTimeline([newEntry, ...timeline]);
  };


  return (
    <TimelineContext.Provider value={{ timeline, addInteraction }}>
      {children}
    </TimelineContext.Provider>
  );
};