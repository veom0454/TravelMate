import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, TrendingUp, Home, MessageSquare, User, Shield, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { notificationService } from "@/lib/services/notificationService";
import { messageService } from "@/lib/services/messageService";

const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/exchange", label: "Exchange", icon: TrendingUp },
  { href: "/rooms", label: "Rooms", icon: Home },
  { href: "/messages", label: "Messages", icon: MessageSquare },
];

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, profile } = useAuth();
  const location = useLocation();
  const [unreadNotifs, setUnreadNotifs] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    if (!user) return;

    const unsubNotifs = notificationService.subscribeToNotifications(user.uid, (notifs) => {
      setUnreadNotifs(notifs.filter(n => !n.isRead).length);
    });

    const unsubMessages = messageService.subscribeToConversations(user.uid, (convs) => {
      const total = convs.reduce((sum, c) => sum + (c.unreadCount?.[user.uid] || 0), 0);
      setUnreadMessages(total);
    });

    return () => {
      unsubNotifs();
      unsubMessages();
    };
  }, [user]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 glass-effect">
      <div className="section-container flex h-16 items-center justify-between">
        <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg glow-primary group-hover:scale-105 transition-transform">
            <span className="text-white font-bold text-sm">T</span>
          </div>
          <span className="font-semibold text-lg hidden sm:block text-foreground">TravelMate</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`relative px-3 py-2 rounded-md text-sm font-medium transition-all ${isActive(link.href)
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}
            >
              {link.label}
              {link.href === "/messages" && unreadMessages > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] flex items-center justify-center font-bold">
                  {unreadMessages > 9 ? "9+" : unreadMessages}
                </span>
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link to="/dashboard" className="relative p-2 rounded-lg hover:bg-secondary transition-colors">
                <Bell className="w-5 h-5 text-muted-foreground" />
                {unreadNotifs > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-gradient-to-r from-red-500 to-rose-500 text-white text-[10px] flex items-center justify-center font-bold">
                    {unreadNotifs > 9 ? "9+" : unreadNotifs}
                  </span>
                )}
              </Link>
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg badge-success">
                <Shield className="w-3.5 h-3.5" />
                <span className="text-sm font-medium">{profile?.trustScore || 50}%</span>
              </div>
              <Link to="/profile">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-sm font-medium text-blue-600 border border-blue-200 hover:border-blue-400 transition-all hover:scale-105">
                  {profile?.photoURL ? (
                    <img src={profile.photoURL} alt="" className="w-full h-full rounded-full" />
                  ) : (
                    profile?.displayName?.charAt(0) || user.email?.charAt(0) || "U"
                  )}
                </div>
              </Link>
            </>
          ) : (
            <>
              <Link to="/auth">
                <Button variant="ghost" size="sm">Log in</Button>
              </Link>
              <Link to="/auth?mode=signup">
                <Button size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md">Get Started</Button>
              </Link>
            </>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-secondary"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-white">
          <div className="section-container py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${isActive(link.href)
                    ? "bg-blue-50 text-blue-700"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </div>
                {link.href === "/messages" && unreadMessages > 0 && (
                  <span className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] flex items-center justify-center font-bold">
                    {unreadMessages}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
