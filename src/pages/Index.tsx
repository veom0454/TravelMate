import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Users, Home, MessageSquare, MapPin, Check, TrendingUp, Star, Zap, UserCheck, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useLiveRate } from "@/hooks/useLiveRate";
import { roomService, RoomListing } from "@/lib/services/roomService";
import { statsService, PlatformStats } from "@/lib/services/statsService";
import { useAuth } from "@/contexts/AuthContext";

const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const HeroSection = () => {
  const { user } = useAuth();

  return (
    <section className="pt-32 pb-20 relative overflow-hidden">
      <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-blue-100/40 to-transparent rounded-full -mr-64 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-gradient-to-tr from-indigo-100/30 to-transparent rounded-full -ml-32 pointer-events-none" />

      <div className="section-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium">Trusted by Indian students across London</span>
          </motion.div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-[1.1] text-foreground">
            Exchange money. <br />
            <span className="text-gradient">Find your nest.</span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-xl mb-8 leading-relaxed">
            The platform built for Indian students in London. Peer-to-peer INR ⇄ GBP exchange and verified roommate discovery — zero paperwork.
          </p>

          <div className="flex flex-wrap gap-3 mb-12">
            <Link to={user ? "/exchange" : "/auth?mode=signup"}>
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all glow-primary h-12 px-8">
                Start Exchanging
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to={user ? "/rooms" : "/auth?mode=signup"}>
              <Button variant="outline" size="lg" className="border-2 hover:bg-blue-50 hover:border-blue-300 transition-all h-12 px-8">Find Roommates</Button>
            </Link>
          </div>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            {["No fees", "Real-time rates", "Verified students"].map((item, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-500" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const StatsSection = () => {
  const [stats, setStats] = useState<PlatformStats | null>(null);

  useEffect(() => {
    statsService.getPlatformStats().then(setStats);
  }, []);

  const displayStats = [
    { value: stats ? `${stats.totalExchanges}` : "—", label: "Total Exchanges", gradient: "text-gradient" },
    { value: stats ? `${stats.activeListings}` : "—", label: "Active Listings", gradient: "text-gradient-success" },
    { value: stats ? `${stats.totalUsers}` : "—", label: "Registered Users", gradient: "text-gradient-warm" },
  ];

  return (
    <div className="section-container pb-12">
      <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto">
        {displayStats.map((stat, i) => (
          <motion.div
            key={i}
            {...fadeInUp}
            transition={{ delay: 0.1 + i * 0.1 }}
            className="card-base p-5 text-center"
          >
            <div className={`text-3xl font-bold ${stat.gradient}`}>{stat.value}</div>
            <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const HowItWorksSection = () => {
  const steps = [
    { icon: UserCheck, title: "Sign Up", desc: "Create your free account in under 30 seconds — email or Google.", color: "from-blue-500 to-blue-600", num: "01" },
    { icon: TrendingUp, title: "Post or Browse", desc: "List your exchange offer or room, or browse existing listings.", color: "from-indigo-500 to-indigo-600", num: "02" },
    { icon: MessageSquare, title: "Connect & Chat", desc: "Message verified students directly. No middlemen.", color: "from-violet-500 to-violet-600", num: "03" },
    { icon: Shield, title: "Build Trust", desc: "Complete exchanges and earn reviews to boost your trust score.", color: "from-emerald-500 to-emerald-600", num: "04" },
  ];

  return (
    <section className="py-20 border-t border-border">
      <div className="section-container">
        <motion.div {...fadeInUp} className="text-center max-w-2xl mx-auto mb-14">
          <span className="badge-info mb-4 inline-flex">How It Works</span>
          <h2 className="text-3xl font-bold mb-4">Four simple steps to get started</h2>
          <p className="text-muted-foreground">No documents. No verification delays. Start in minutes.</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              {...fadeInUp}
              transition={{ delay: i * 0.12 }}
              className="card-hover p-6 text-center group"
            >
              <div className="relative mb-5">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} mx-auto flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <step.icon className="w-6 h-6 text-white" />
                </div>
                <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white border-2 border-border text-xs font-bold flex items-center justify-center text-muted-foreground">{step.num}</span>
              </div>
              <h3 className="font-semibold mb-2 text-lg">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ExchangePreview = () => {
  const { rate } = useLiveRate();
  const [inrAmount, setInrAmount] = useState("50000");
  const gbpAmount = inrAmount ? (parseFloat(inrAmount.replace(/,/g, '')) / rate).toFixed(2) : "0.00";

  const formatIndian = (num: string) => {
    const n = num.replace(/,/g, '');
    if (!n) return '';
    const x = n.split('.');
    let lastThree = x[0].substring(x[0].length - 3);
    const otherNumbers = x[0].substring(0, x[0].length - 3);
    if (otherNumbers !== '') lastThree = ',' + lastThree;
    return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
  };

  return (
    <section className="py-20 border-t border-border">
      <div className="section-container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div {...fadeInUp}>
            <span className="badge-success mb-4 inline-flex">Live Rates</span>
            <h2 className="text-3xl font-bold mb-4">Exchange at real rates</h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Skip the bank fees. Connect directly with other students for peer-to-peer currency exchange at live market rates.
            </p>

            <div className="space-y-4">
              {[
                "Live INR ⇄ GBP rates from global markets",
                "Save 3-5% compared to bank transfers",
                "Community-verified exchange partners",
              ].map((item, i) => (
                <motion.div key={i} {...fadeInUp} transition={{ delay: 0.2 + i * 0.1 }} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-200 shrink-0">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <span className="text-sm text-foreground">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div {...fadeInUp} transition={{ delay: 0.15 }} className="card-base p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-blue-50 to-transparent rounded-full -mr-20 -mt-20" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm text-muted-foreground">Live Rate</span>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold">₹{rate.toFixed(2)}</span>
                  <span className="badge-info">Live</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100/50">
                  <label className="text-xs text-muted-foreground mb-2 block">You Send</label>
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      value={formatIndian(inrAmount)}
                      onChange={(e) => setInrAmount(e.target.value.replace(/[^0-9]/g, ''))}
                      className="bg-transparent text-2xl font-semibold text-foreground outline-none w-full"
                    />
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-border shrink-0">
                      <span>🇮🇳</span>
                      <span className="text-sm font-medium">INR</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
                    <ArrowDown className="w-5 h-5 text-white" />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100/50">
                  <label className="text-xs text-muted-foreground mb-2 block">You Receive</label>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-semibold text-foreground">£{gbpAmount}</span>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-border shrink-0">
                      <span>🇬🇧</span>
                      <span className="text-sm font-medium">GBP</span>
                    </div>
                  </div>
                </div>
              </div>

              <Link to="/exchange" className="block mt-6">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all h-11">
                  Find Exchange Partners
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const RoomsPreview = () => {
  const [rooms, setRooms] = useState<RoomListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    roomService.getActiveListings().then((listings) => {
      setRooms(listings.slice(0, 3));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <section className="py-20 border-t border-border">
      <div className="section-container">
        <motion.div {...fadeInUp} className="flex items-end justify-between mb-10">
          <div>
            <span className="badge-warning mb-4 inline-flex">Rooms</span>
            <h2 className="text-3xl font-bold mb-2">Rooms by Indians, for Indians</h2>
            <p className="text-muted-foreground">Verified listings from fellow students. No brokers.</p>
          </div>
          <Link to="/rooms" className="hidden sm:flex">
            <Button variant="outline" className="hover:bg-blue-50 hover:border-blue-200">View All</Button>
          </Link>
        </motion.div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="card-base p-5 animate-skeleton-pulse">
                <div className="space-y-3">
                  <div className="h-4 bg-muted rounded w-1/3" />
                  <div className="h-8 bg-muted rounded w-1/2" />
                  <div className="h-3 bg-muted rounded w-2/3" />
                  <div className="flex gap-2">
                    <div className="h-6 bg-muted rounded w-20" />
                    <div className="h-6 bg-muted rounded w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : rooms.length === 0 ? (
          <div className="text-center py-12 card-base">
            <Home className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
            <p className="text-muted-foreground">No rooms listed yet. Be the first to list!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rooms.map((room, i) => (
              <motion.div
                key={room.id || i}
                {...fadeInUp}
                transition={{ delay: i * 0.1 }}
                className="card-hover p-5"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-1.5 text-muted-foreground text-sm mb-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {room.area}
                    </div>
                    <div className="text-2xl font-bold text-gradient">£{room.rent}<span className="text-sm text-muted-foreground font-normal">/mo</span></div>
                  </div>
                  <span className="badge-success">
                    <Shield className="w-3 h-3" />
                    {room.userTrustScore}%
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <Home className="w-3.5 h-3.5" />
                  <span>{room.type}</span>
                  <span>•</span>
                  <span>{room.gender}</span>
                </div>

                {room.tags && room.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {room.tags.slice(0, 2).map((tag, j) => (
                      <span key={j} className="px-2 py-1 rounded-md bg-slate-50 text-xs text-slate-600 border border-slate-200">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <Link to="/rooms">
                  <Button variant="outline" size="sm" className="w-full hover:bg-blue-50 hover:border-blue-200 transition-all">
                    <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
                    View Details
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-6 sm:hidden">
          <Link to="/rooms">
            <Button variant="outline" className="w-full">View All Rooms</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

const TestimonialsSection = () => {
  const testimonials = [
    { name: "Priya S.", university: "UCL", text: "TravelMate saved me £200 on my first exchange. The rates are so much better than Wise or banks!", rating: 5 },
    { name: "Rahul M.", university: "King's College", text: "Found my flatmate in Shoreditch within 2 days. The trust system actually works — felt completely safe.", rating: 5 },
    { name: "Anika P.", university: "Imperial", text: "The real-time rates and instant messaging make exchanging so easy. Best platform for Indian students!", rating: 5 },
  ];

  return (
    <section className="py-20 border-t border-border bg-gradient-to-b from-blue-50/30 to-transparent">
      <div className="section-container">
        <motion.div {...fadeInUp} className="text-center max-w-2xl mx-auto mb-14">
          <span className="badge-info mb-4 inline-flex">Testimonials</span>
          <h2 className="text-3xl font-bold mb-4">Loved by students</h2>
          <p className="text-muted-foreground">Hear from Indian students who use TravelMate every day.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              {...fadeInUp}
              transition={{ delay: i * 0.12 }}
              className="card-base p-6 relative"
            >
              <div className="absolute top-4 right-4 flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-foreground mb-6 leading-relaxed pr-16">"{t.text}"</p>
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-sm font-semibold text-blue-600 border border-blue-200">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div className="font-medium text-sm">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.university}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const TrustSection = () => {
  const features = [
    { icon: Shield, title: "No Documents", desc: "Zero paperwork. We verify through behavior, not bureaucracy.", color: "from-blue-500 to-blue-600" },
    { icon: Star, title: "Review System", desc: "Rate and review every exchange. Build your reputation.", color: "from-amber-500 to-amber-600" },
    { icon: Zap, title: "Instant Chat", desc: "Message verified students directly. No middlemen.", color: "from-violet-500 to-violet-600" },
    { icon: TrendingUp, title: "Smart Trust", desc: "5-factor algorithm calculates trust from real behavior.", color: "from-emerald-500 to-emerald-600" },
  ];

  return (
    <section className="py-20 border-t border-border">
      <div className="section-container">
        <motion.div {...fadeInUp} className="text-center max-w-2xl mx-auto mb-14">
          <span className="badge-success mb-4 inline-flex">Trust & Safety</span>
          <h2 className="text-3xl font-bold mb-4">Trust without paperwork</h2>
          <p className="text-muted-foreground">We verify you through behavior, not bureaucracy. No passport uploads. No visa checks.</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              {...fadeInUp}
              transition={{ delay: i * 0.1 }}
              className="card-hover p-6 text-center group"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.color} mx-auto mb-5 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <f.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CTASection = () => {
  return (
    <section className="py-20 border-t border-border">
      <div className="section-container">
        <motion.div {...fadeInUp} className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 p-10 sm:p-14 text-center text-white">
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -mr-36 -mt-36" />
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-white/5 rounded-full -ml-28 -mb-28" />
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-white/70 mb-8 max-w-md mx-auto">
              Join Indian students who've found their exchange partners and roommates on TravelMate.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link to="/auth?mode=signup">
                <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 shadow-xl h-12 px-8 font-semibold">
                  Create Free Account
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/exchange">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 h-12 px-8">
                  Browse Exchanges
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <HowItWorksSection />
      <ExchangePreview />
      <RoomsPreview />
      <TestimonialsSection />
      <TrustSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
