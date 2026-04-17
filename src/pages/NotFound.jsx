import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-6xl font-bold text-error mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-6">Oops! Page not found.</h2>
      <p className="text-gray-500 mb-8">The route you are looking for doesn't exist.</p>
      <Link to="/" className="btn btn-primary">Go Back Home</Link>
    </div>
  );
};

export default NotFound;