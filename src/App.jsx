import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { TimelineProvider } from "./context/TimelineContext";

// Placeholder imports for pages you will create
import Home from "./pages/Home";
import FriendDetails from "./pages/FriendDetails";
import Timeline from "./pages/Timeline";
import Stats from "./pages/Stats";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";

function App() {
  return (
 
    <TimelineProvider>
      
      <BrowserRouter>
        <div className="min-h-screen bg-base-200">
          <Navbar />
          <main className="container mx-auto p-4">
            <Routes>
             
              <Route path="/" element={<Home />} />
              <Route path="/friend/:id" element={<FriendDetails />} />
              <Route path="/timeline" element={<Timeline />} />
              <Route path="/stats" element={<Stats />} />
          
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          <Toaster position="bottom-right" />
        </div>
      </BrowserRouter>
    </TimelineProvider>
  );
}

export default App;