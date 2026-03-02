import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Home, MessageSquare, Shield, Bell, Star, MapPin, RefreshCw, Plus, ArrowDown, Clock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { useLiveRate } from "@/hooks/useLiveRate";
import { roomService, RoomListing } from "@/lib/services/roomService";
import { notificationService, Notification } from "@/lib/services/notificationService";
import { exchangeService, ExchangeOffer } from "@/lib/services/exchangeService";
import { formatDistanceToNow } from "date-fns";

const fadeInUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

const SkeletonCard = () => (
  <div className="card-base p-5 space-y-3 animate-skeleton-pulse">
    <div className="h-4 bg-muted rounded w-2/3" />
    <div className="h-8 bg-muted rounded w-1/2" />
    <div className="h-3 bg-muted rounded w-full" />
  </div>
);

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

const formatIndian = (num: number): string => {
  const str = num.toString();
  const x = str.split('.');
  let lastThree = x[0].substring(x[0].length - 3);
  const otherNumbers = x[0].substring(0, x[0].length - 3);
  if (otherNumbers !== '') lastThree = ',' + lastThree;
  return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree + (x[1] ? '.' + x[1] : '');
};

const Dashboard = () => {
  const { user, profile } = useAuth();
  const { rate, loading: rateLoading, lastUpdated, refresh: refreshRate } = useLiveRate();
  const [inrAmount, setInrAmount] = useState("25000");
  const gbpAmount = inrAmount ? (parseFloat(inrAmount.replace(/,/g, '')) / rate).toFixed(2) : "0.00";

  const [recentRooms, setRecentRooms] = useState<RoomListing[]>([]);
  const [roomsLoading, setRoomsLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notifLoading, setNotifLoading] = useState(true);
  const [myOffers, setMyOffers] = useState<ExchangeOffer[]>([]);
  const [offersLoading, setOffersLoading] = useState(true);

  useEffect(() => {
    const unsubRooms = roomService.subscribeToListings((listings) => {
      setRecentRooms(listings.slice(0, 3));
      setRoomsLoading(false);
    });
    return () => unsubRooms();
  }, []);

  useEffect(() => {
    if (!user) return;
    const unsubNotifs = notificationService.subscribeToNotifications(user.uid, (notifs) => {
      setNotifications(notifs.slice(0, 5));
      setNotifLoading(false);
    });
    const unsubOffers = exchangeService.subscribeToOffers((offers) => {
      setMyOffers(offers.filter(o => o.userId === user.uid).slice(0, 3));
      setOffersLoading(false);
    });
    return () => { unsubNotifs(); unsubOffers(); };
  }, [user]);

  const quickActions = [
    { icon: TrendingUp, label: "New Exchange", to: "/exchange", color: "from-blue-500 to-blue-600" },
    { icon: Home, label: "List Room", to: "/rooms", color: "from-indigo-500 to-indigo-600" },
    { icon: MessageSquare, label: "Messages", to: "/messages", color: "from-violet-500 to-violet-600" },
    { icon: Star, label: "My Profile", to: "/profile", color: "from-amber-500 to-amber-600" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="section-container pt-24 pb-12">
        <motion.div {...fadeInUp} transition={{ duration: 0.4 }} className="mb-8 relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 p-8 text-white">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24" />
          <div className="relative z-10">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-white/70 text-sm mb-1">{getGreeting()}</p>
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">{profile?.displayName || user?.displayName || "Student"}</h1>
                <div className="flex items-center gap-3 text-white/80 text-sm">
                  <span className="flex items-center gap-1.5">
                    <Shield className="w-4 h-4" />
                    Trust: {profile?.trustScore || 50}%
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Star className="w-4 h-4" />
                    {profile?.role || "Student"}
                  </span>
                </div>
              </div>
              <div className="text-right hidden sm:block">
                <div className="text-white/60 text-xs mb-1">Live Rate</div>
                <div className="text-2xl font-bold">₹{rate.toFixed(2)}</div>
                <div className="text-white/50 text-xs mt-1">per £1</div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div {...fadeInUp} transition={{ delay: 0.1 }} className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {quickActions.map((action, i) => (
            <Link key={i} to={action.to}>
              <div className="card-hover p-4 flex items-center gap-3 group">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                  <action.icon className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium text-sm">{action.label}</span>
              </div>
            </Link>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          <motion.div {...fadeInUp} transition={{ delay: 0.15 }} className="lg:col-span-1 space-y-6">
            <div className="card-base p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-500" />
                  Quick Convert
                </h3>
                <button onClick={refreshRate} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors" disabled={rateLoading}>
                  <RefreshCw className={`w-3 h-3 ${rateLoading ? 'animate-spin' : ''}`} />
                  {lastUpdated ? formatDistanceToNow(lastUpdated, { addSuffix: true }) : 'Refresh'}
                </button>
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-blue-50/50 border border-blue-100/50">
                  <label className="text-xs text-muted-foreground mb-1 block">You Send</label>
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      value={formatIndian(parseFloat(inrAmount.replace(/,/g, '')) || 0)}
                      onChange={(e) => setInrAmount(e.target.value.replace(/[^0-9]/g, ''))}
                      className="bg-transparent text-xl font-semibold text-foreground outline-none w-full"
                    />
                    <span className="text-sm font-medium text-muted-foreground shrink-0">🇮🇳 INR</span>
                  </div>
                </div>

                <div className="flex justify-center">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center shadow">
                    <ArrowDown className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-emerald-50/50 border border-emerald-100/50">
                  <label className="text-xs text-muted-foreground mb-1 block">You Receive</label>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-semibold text-foreground">£{gbpAmount}</span>
                    <span className="text-sm font-medium text-muted-foreground shrink-0">🇬🇧 GBP</span>
                  </div>
                </div>
              </div>

              <Link to="/exchange" className="block mt-4">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md" size="sm">
                  Find Exchange Partners
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </Link>
            </div>

            {!offersLoading && myOffers.length > 0 && (
              <div className="card-base p-6">
                <h3 className="font-semibold text-sm flex items-center gap-2 mb-4">
                  <Zap className="w-4 h-4 text-amber-500" />
                  My Active Offers
                </h3>
                <div className="space-y-3">
                  {myOffers.map((offer) => (
                    <div key={offer.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                      <div>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded ${offer.type === 'sell' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'}`}>
                          {offer.type === 'sell' ? 'Selling' : 'Buying'}
                        </span>
                        <div className="font-semibold mt-1">₹{formatIndian(offer.amount)}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">@ ₹{offer.rate}/£</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{formatDistanceToNow(offer.createdAt as Date, { addSuffix: true })}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          <motion.div {...fadeInUp} transition={{ delay: 0.2 }} className="lg:col-span-2 space-y-6">
            <div className="card-base p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <Home className="w-4 h-4 text-indigo-500" />
                  Recent Rooms
                </h3>
                <Link to="/rooms" className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                  View all <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              {roomsLoading ? (
                <div className="grid gap-3">
                  {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
                </div>
              ) : recentRooms.length === 0 ? (
                <div className="text-center py-8">
                  <Home className="w-10 h-10 mx-auto mb-3 text-muted-foreground/30" />
                  <p className="text-sm text-muted-foreground mb-3">No rooms listed yet</p>
                  <Link to="/rooms">
                    <Button size="sm" variant="outline" className="hover:bg-blue-50">
                      <Plus className="w-3.5 h-3.5 mr-1" />
                      List a Room
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="grid gap-3">
                  {recentRooms.map((room) => (
                    <Link key={room.id} to="/rooms" className="block">
                      <div className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-blue-200 hover:bg-blue-50/30 transition-all group">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center border border-indigo-100">
                            <MapPin className="w-5 h-5 text-indigo-500" />
                          </div>
                          <div>
                            <div className="font-medium text-sm group-hover:text-blue-600 transition-colors">{room.area}</div>
                            <div className="text-xs text-muted-foreground flex items-center gap-2">
                              <span>{room.type}</span>
                              <span>•</span>
                              <span>{room.gender}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg">£{room.rent}</div>
                          <div className="text-xs text-muted-foreground">/month</div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="card-base p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <Bell className="w-4 h-4 text-amber-500" />
                  Notifications
                </h3>
                {notifications.length > 0 && (
                  <span className="text-xs text-muted-foreground">{notifications.length} recent</span>
                )}
              </div>

              {notifLoading ? (
                <div className="space-y-3">
                  {[1, 2].map(i => <SkeletonCard key={i} />)}
                </div>
              ) : notifications.length === 0 ? (
                <div className="text-center py-8">
                  <Bell className="w-10 h-10 mx-auto mb-3 text-muted-foreground/30" />
                  <p className="text-sm text-muted-foreground">No notifications yet</p>
                  <p className="text-xs text-muted-foreground mt-1">You'll be notified about new matches and messages</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {notifications.map((notif) => (
                    <div key={notif.id} className={`p-3 rounded-lg border transition-colors ${notif.isRead ? 'bg-white border-border' : 'bg-blue-50/50 border-blue-100'}`}>
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${notif.isRead ? 'bg-slate-300' : 'bg-blue-500'}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{notif.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{notif.text}</p>
                          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDistanceToNow(notif.createdAt as Date, { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
