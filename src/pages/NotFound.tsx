import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Home, Search, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-lg">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="mb-8"
          >
            <div className="relative inline-block">
              <span className="text-[120px] sm:text-[160px] font-extrabold text-gradient leading-none">404</span>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-32 h-3 bg-gradient-to-r from-blue-200/0 via-blue-200 to-blue-200/0 rounded-full blur-sm" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold mb-3">Page not found</h2>
            <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
              The page <code className="px-2 py-0.5 rounded bg-slate-100 text-sm text-blue-600 border border-slate-200">{location.pathname}</code> doesn't exist or has been moved.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="flex flex-wrap gap-3 justify-center"
          >
            <Link to="/">
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md gap-2">
                <Home className="w-4 h-4" />
                Go Home
              </Button>
            </Link>
            <Link to="/exchange">
              <Button variant="outline" className="gap-2 hover:bg-blue-50 hover:border-blue-200">
                <Search className="w-4 h-4" />
                Exchange
              </Button>
            </Link>
            <Link to="/rooms">
              <Button variant="outline" className="gap-2 hover:bg-blue-50 hover:border-blue-200">
                <Home className="w-4 h-4" />
                Rooms
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
