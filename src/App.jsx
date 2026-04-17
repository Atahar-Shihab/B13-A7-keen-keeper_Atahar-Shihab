import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { TimelineProvider } from "./context/TimelineContext";

// Page imports
import Home from "./pages/Home";
import FriendDetails from "./pages/FriendDetails";
import Timeline from "./pages/Timeline";
import Stats from "./pages/Stats";
import NotFound from "./pages/NotFound";

// Component imports
import Navbar from "./components/Navbar";
import Footer from "./components/Footer"; // ✅ Added Footer import

function App() {
  return (
    <TimelineProvider>
      <BrowserRouter>
        {/* Added flex flex-col to ensure the footer is pushed to the bottom */}
        <div className="min-h-screen bg-base-200 flex flex-col">
          <Navbar />
          
          {/* Added flex-grow so the main content takes up the available space */}
          <main className="container mx-auto p-4 flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/friend/:id" element={<FriendDetails />} />
              <Route path="/timeline" element={<Timeline />} />
              <Route path="/stats" element={<Stats />} />
              
              {/* 404 Catch-all Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          {/* ✅ Correctly placed self-closing Footer component */}
          <Footer />

          <Toaster position="bottom-right" />
        </div>
      </BrowserRouter>
    </TimelineProvider>
  );
}

export default App;