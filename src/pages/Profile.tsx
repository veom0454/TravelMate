import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Mail, Shield, Star, MessageSquare, Edit2, Camera, LogOut, Award, TrendingUp, Loader2, Calendar, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Navbar } from "@/components/layout/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { reviewService, Review } from "@/lib/services/reviewService";
import { trustScoreService, TrustBreakdown } from "@/lib/services/trustScoreService";
import { formatDistanceToNow, format } from "date-fns";

const Profile = () => {
  const { user, profile, logout, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: profile?.displayName || "",
    bio: profile?.bio || "",
    university: profile?.university || "",
  });
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [avgRating, setAvgRating] = useState(0);
  const [trustBreakdown, setTrustBreakdown] = useState<TrustBreakdown | null>(null);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = reviewService.subscribeToReviews(user.uid, (fetchedReviews) => {
      setReviews(fetchedReviews);
      setReviewsLoading(false);
      if (fetchedReviews.length > 0) {
        const total = fetchedReviews.reduce((sum, r) => sum + r.rating, 0);
        setAvgRating(total / fetchedReviews.length);
      }
    });

    trustScoreService.calculateTrustScore(user.uid)
      .then(setTrustBreakdown)
      .catch(() => { });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (profile) {
      setFormData({
        displayName: profile.displayName || "",
        bio: profile.bio || "",
        university: profile.university || "",
      });
    }
  }, [profile]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      toast({ title: "Error logging out", variant: "destructive" });
    }
  };

  const handleSave = async () => {
    try {
      await updateUserProfile(formData);
      setIsEditing(false);
      toast({ title: "Profile updated!" });
      if (user) {
        trustScoreService.updateUserTrustScore(user.uid).catch(() => { });
      }
    } catch (error) {
      toast({ title: "Error updating profile", variant: "destructive" });
    }
  };

  const trustFactors = trustBreakdown ? [
    { label: "Profile", value: trustBreakdown.profileCompleteness, max: 20, color: "bg-blue-500" },
    { label: "Email", value: trustBreakdown.emailVerified, max: 15, color: "bg-emerald-500" },
    { label: "Exchanges", value: trustBreakdown.completedExchanges, max: 25, color: "bg-indigo-500" },
    { label: "Reviews", value: trustBreakdown.reviewScore, max: 25, color: "bg-amber-500" },
    { label: "Account Age", value: trustBreakdown.accountAge, max: 15, color: "bg-violet-500" },
  ] : [];

  const stats = [
    { label: "Trust Score", value: `${trustBreakdown?.total || profile?.trustScore || 50}%`, icon: Shield, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200" },
    { label: "Exchanges", value: profile?.completedExchanges || 0, icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
    { label: "Reviews", value: reviews.length, icon: Star, color: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
    { label: "Avg. Rating", value: avgRating > 0 ? avgRating.toFixed(1) : "—", icon: Award, color: "text-violet-600", bg: "bg-violet-50 border-violet-200" },
  ];

  const getTimeAgo = (date: Date) => {
    try {
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return "recently";
    }
  };

  const memberSince = profile?.createdAt
    ? format(profile.createdAt instanceof Date ? profile.createdAt : new Date(), "MMMM yyyy")
    : "Recently joined";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-12">
        <div className="section-container max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-base p-6 mb-6 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-blue-50 to-transparent rounded-full -mr-24 -mt-24" />
            <div className="relative z-10 flex flex-col sm:flex-row items-start gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center border-2 border-blue-200 shadow-lg">
                  {profile?.photoURL ? (
                    <img src={profile.photoURL} alt="" className="w-full h-full rounded-2xl object-cover" />
                  ) : (
                    <span className="text-3xl font-bold text-blue-600">
                      {profile?.displayName?.charAt(0) || user?.email?.charAt(0) || "U"}
                    </span>
                  )}
                </div>
                <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md hover:scale-110 transition-transform">
                  <Camera className="w-4 h-4 text-white" />
                </button>
              </div>

              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-3">
                    <Input placeholder="Display Name" value={formData.displayName} onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))} />
                    <Input placeholder="University" value={formData.university} onChange={(e) => setFormData(prev => ({ ...prev, university: e.target.value }))} />
                    <Textarea placeholder="Bio" value={formData.bio} onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))} rows={3} />
                    <div className="flex gap-2">
                      <Button onClick={handleSave} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">Save</Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3 mb-1">
                      <h1 className="text-xl font-bold">{profile?.displayName || "User"}</h1>
                      {profile?.isVerified && (
                        <span className="badge-success">
                          <CheckCircle className="w-3 h-3" />
                          Verified
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-medium capitalize border border-blue-200">
                        {profile?.role || "Student"}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm mb-1 flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5" />
                      {user?.email}
                    </p>
                    {profile?.university && (
                      <p className="text-muted-foreground text-sm mb-1">{profile.university}</p>
                    )}
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5 mb-3">
                      <Calendar className="w-3 h-3" />
                      Member since {memberSince}
                    </p>
                    {profile?.bio && <p className="text-sm text-foreground mb-4 leading-relaxed">{profile.bio}</p>}
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => setIsEditing(true)} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                        <Edit2 className="w-3.5 h-3.5 mr-1.5" />
                        Edit Profile
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleLogout} className="hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors">
                        <LogOut className="w-3.5 h-3.5 mr-1.5" />
                        Logout
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="card-base p-4 text-center"
              >
                <div className={`w-10 h-10 rounded-xl ${stat.bg} mx-auto mb-2 flex items-center justify-center border`}>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <div className="text-xl font-bold">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            {trustBreakdown && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="card-base p-5"
              >
                <h2 className="font-semibold mb-4 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-500" />
                  Trust Score Breakdown
                </h2>
                <div className="space-y-3">
                  {trustFactors.map((factor) => (
                    <div key={factor.label}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-muted-foreground">{factor.label}</span>
                        <span className="font-medium">{factor.value}/{factor.max}</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${factor.color} transition-all duration-700`}
                          style={{ width: `${(factor.value / factor.max) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Score</span>
                  <span className="text-2xl font-bold text-gradient">{trustBreakdown.total}%</span>
                </div>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card-base p-5"
            >
              <h2 className="font-semibold mb-4 flex items-center gap-2">
                <Award className="w-4 h-4 text-blue-600" />
                Trust Badges
              </h2>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { name: "Email Verified", earned: user?.emailVerified, icon: "✉️" },
                  { name: "First Exchange", earned: (profile?.completedExchanges || 0) >= 1, icon: "🔄" },
                  { name: "5 Exchanges", earned: (profile?.completedExchanges || 0) >= 5, icon: "⚡" },
                  { name: "Trusted Member", earned: (profile?.trustScore || 0) >= 80, icon: "🛡️" },
                  { name: "First Review", earned: reviews.length >= 1, icon: "⭐" },
                  { name: "Profile Complete", earned: !!(profile?.bio && profile?.university), icon: "👤" },
                ].map((badge) => (
                  <div
                    key={badge.name}
                    className={`p-3 rounded-xl text-sm border flex items-center gap-2.5 transition-all ${badge.earned
                      ? "bg-blue-50 text-blue-700 border-blue-200 shadow-sm"
                      : "bg-slate-50 text-slate-400 border-slate-200 opacity-60"
                      }`}
                  >
                    <span className="text-lg">{badge.icon}</span>
                    <span className="font-medium text-xs">{badge.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card-base p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-600" />
                Reviews ({reviews.length})
              </h2>
              {avgRating > 0 && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-semibold text-sm text-amber-700">{avgRating.toFixed(1)}</span>
                </div>
              )}
            </div>

            {reviewsLoading ? (
              <div className="space-y-4">
                {[1, 2].map(i => (
                  <div key={i} className="pb-4 border-b border-border last:border-0 last:pb-0 animate-skeleton-pulse">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-muted" />
                      <div className="h-3 bg-muted rounded w-24" />
                    </div>
                    <div className="h-3 bg-muted rounded w-full" />
                    <div className="h-3 bg-muted rounded w-2/3 mt-1" />
                  </div>
                ))}
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-10">
                <Star className="w-10 h-10 mx-auto mb-3 text-muted-foreground/20" />
                <p className="text-sm text-muted-foreground">No reviews yet</p>
                <p className="text-xs text-muted-foreground mt-1">Reviews from other users will appear here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="pb-4 border-b border-border last:border-0 last:pb-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-xs font-semibold text-blue-600 border border-blue-200">
                          {review.reviewerAvatar ? (
                            <img src={review.reviewerAvatar} alt="" className="w-full h-full rounded-xl object-cover" />
                          ) : (
                            review.reviewerName?.charAt(0) || "U"
                          )}
                        </div>
                        <div>
                          <span className="font-medium text-sm">{review.reviewerName}</span>
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: review.rating }).map((_, j) => (
                              <Star key={j} className="w-3 h-3 fill-amber-400 text-amber-400" />
                            ))}
                            {Array.from({ length: 5 - review.rating }).map((_, j) => (
                              <Star key={j} className="w-3 h-3 text-slate-200" />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">{getTimeAgo(review.createdAt as Date)}</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed ml-[46px]">{review.text}</p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
