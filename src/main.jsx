import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { TimelineProvider } from './context/TimelineContext.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TimelineProvider>
      <App />
      <ToastContainer position="top-right" />
    </TimelineProvider>
  </React.StrictMode>,
)