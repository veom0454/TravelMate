import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Search, Star, Shield, Clock, TrendingUp, MessageSquare, Bookmark, BookmarkCheck, Plus, Loader2, Trash2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/layout/Navbar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { exchangeService, ExchangeOffer } from "@/lib/services/exchangeService";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { useLiveRate } from "@/hooks/useLiveRate";

const formatIndian = (num: number): string => {
  const str = Math.round(num).toString();
  let lastThree = str.substring(str.length - 3);
  const otherNumbers = str.substring(0, str.length - 3);
  if (otherNumbers !== '') lastThree = ',' + lastThree;
  return otherNumbers.replace(/\B(?=(?:\d{2})+(?!\d))/g, ',') + lastThree;
};

const Exchange = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { rate, loading: rateLoading, lastUpdated, refresh: refreshRate } = useLiveRate();
  const [inrAmount, setInrAmount] = useState("50000");
  const [filter, setFilter] = useState<"all" | "buy" | "sell">("all");
  const [search, setSearch] = useState("");
  const [savedOffers, setSavedOffers] = useState<string[]>([]);
  const [offers, setOffers] = useState<ExchangeOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newOffer, setNewOffer] = useState({
    type: "sell" as "buy" | "sell",
    amount: "",
    rate: "",
  });

  const gbpAmount = inrAmount ? (parseFloat(inrAmount.replace(/,/g, '')) / rate).toFixed(2) : "0.00";

  useEffect(() => {
    if (!user) return;

    const unsubscribe = exchangeService.subscribeToOffers((updatedOffers) => {
      setOffers(updatedOffers);
      setLoading(false);
    }, filter === "all" ? undefined : { type: filter });

    return () => unsubscribe();
  }, [user, filter]);

  useEffect(() => {
    setNewOffer(prev => ({ ...prev, rate: rate.toFixed(2) }));
  }, [rate]);

  const filteredOffers = offers.filter(offer => {
    const matchesSearch = offer.userDisplayName.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  const toggleSaved = (id: string) => {
    setSavedOffers(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleCreateOffer = async () => {
    if (!user || !profile) {
      toast({ title: "Please sign in", variant: "destructive" });
      return;
    }

    if (!newOffer.amount || !newOffer.rate) {
      toast({ title: "Please fill all fields", variant: "destructive" });
      return;
    }

    setCreating(true);
    try {
      await exchangeService.createOffer({
        userId: user.uid,
        userDisplayName: profile.displayName,
        userAvatar: profile.photoURL,
        userTrustScore: profile.trustScore,
        type: newOffer.type,
        amount: parseFloat(newOffer.amount),
        rate: parseFloat(newOffer.rate),
        status: "active",
        completedTrades: profile.completedExchanges || 0,
      });
      toast({ title: "Offer created successfully!" });
      setCreateDialogOpen(false);
      setNewOffer({ type: "sell", amount: "", rate: rate.toFixed(2) });
    } catch (error: any) {
      toast({ title: "Error creating offer", description: error.message, variant: "destructive" });
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteOffer = async (offerId: string) => {
    try {
      await exchangeService.deleteOffer(offerId);
      toast({ title: "Offer deleted" });
    } catch (error: any) {
      toast({ title: "Error deleting offer", description: error.message, variant: "destructive" });
    }
  };

  const handleContact = (offer: ExchangeOffer) => {
    if (!user) {
      navigate("/auth");
      return;
    }
    navigate(`/messages?userId=${offer.userId}`);
  };

  const getTimeAgo = (date: Date) => {
    try {
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return "recently";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20 pb-12">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-2xl font-bold mb-2">Currency Exchange</h1>
            <p className="text-muted-foreground">Find the best rates from trusted students</p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="card-base p-5 sticky top-24">
                <div className="flex items-center justify-between mb-5">
                  <span className="text-sm text-muted-foreground">Live Rate</span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold">₹{rate.toFixed(2)}</span>
                    <button onClick={refreshRate} className="p-1 rounded hover:bg-secondary transition-colors">
                      <RefreshCw className={`w-3.5 h-3.5 text-muted-foreground ${rateLoading ? 'animate-spin' : ''}`} />
                    </button>
                    <span className="badge-info">
                      Live
                    </span>
                  </div>
                </div>

                {lastUpdated && (
                  <p className="text-xs text-muted-foreground mb-4">
                    Updated {getTimeAgo(lastUpdated)}
                  </p>
                )}

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100/50">
                    <label className="text-xs text-muted-foreground mb-2 block">You Send</label>
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={formatIndian(parseFloat(inrAmount.replace(/,/g, '')) || 0)}
                        onChange={(e) => setInrAmount(e.target.value.replace(/[^0-9]/g, ''))}
                        className="bg-transparent text-xl font-semibold text-foreground outline-none w-full"
                      />
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-border shrink-0">
                        <span>🇮🇳</span>
                        <span className="text-sm font-medium">INR</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
                      <ArrowRight className="w-4 h-4 text-white rotate-90" />
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100/50">
                    <label className="text-xs text-muted-foreground mb-2 block">You Receive</label>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-semibold text-emerald-700">£{gbpAmount}</span>
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-border shrink-0">
                        <span>🇬🇧</span>
                        <span className="text-sm font-medium">GBP</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full mt-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Exchange Offer
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Exchange Offer</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Type</Label>
                        <Select value={newOffer.type} onValueChange={(v: "buy" | "sell") => setNewOffer({ ...newOffer, type: v })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sell">Selling INR</SelectItem>
                            <SelectItem value="buy">Buying INR</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Amount (INR)</Label>
                        <Input
                          type="number"
                          placeholder="50000"
                          value={newOffer.amount}
                          onChange={(e) => setNewOffer({ ...newOffer, amount: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Rate (₹ per £)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder={rate.toFixed(2)}
                          value={newOffer.rate}
                          onChange={(e) => setNewOffer({ ...newOffer, rate: e.target.value })}
                        />
                      </div>
                      <Button onClick={handleCreateOffer} disabled={creating} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                        {creating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                        Create Offer
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="flex flex-col sm:flex-row gap-3 mb-5">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name..."
                    className="pl-10"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  {(["all", "buy", "sell"] as const).map((f) => (
                    <Button
                      key={f}
                      variant={filter === f ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilter(f)}
                      className={filter === f ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white" : ""}
                    >
                      {f === "all" ? "All" : f === "buy" ? "Buying INR" : "Selling INR"}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                {loading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="card-base p-4 animate-skeleton-pulse">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-muted" />
                            <div className="space-y-1.5">
                              <div className="h-4 bg-muted rounded w-32" />
                              <div className="h-3 bg-muted rounded w-24" />
                            </div>
                          </div>
                          <div className="space-y-1.5 text-right">
                            <div className="h-4 bg-muted rounded w-16" />
                            <div className="h-5 bg-muted rounded w-20" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filteredOffers.length === 0 ? (
                  <div className="text-center py-12 card-base">
                    <TrendingUp className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
                    <p className="text-muted-foreground">No offers found matching your criteria</p>
                    {user && (
                      <Button
                        className="mt-4"
                        onClick={() => setCreateDialogOpen(true)}
                        variant="outline"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Create First Offer
                      </Button>
                    )}
                  </div>
                ) : (
                  filteredOffers.map((offer, i) => (
                    <motion.div
                      key={offer.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="card-hover p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-sm font-medium text-blue-600 border border-blue-200">
                            {offer.userAvatar ? (
                              <img src={offer.userAvatar} alt="" className="w-full h-full rounded-full" />
                            ) : (
                              offer.userDisplayName?.charAt(0) || "U"
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{offer.userDisplayName}</span>
                              <span className="badge-success text-xs">
                                <Shield className="w-3 h-3" />
                                {offer.userTrustScore}%
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                              <span className="flex items-center gap-1">
                                <Star className="w-3 h-3" />
                                {offer.completedTrades || 0} trades
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {getTimeAgo(offer.createdAt as Date)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className={`text-xs font-medium px-2 py-0.5 rounded-md mb-1 border ${offer.type === "sell"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-blue-50 text-blue-700 border-blue-200"
                            }`}>
                            {offer.type === "sell" ? "Selling INR" : "Buying INR"}
                          </div>
                          <div className="font-semibold">₹{formatIndian(offer.amount)}</div>
                          <div className="text-xs text-muted-foreground">@ ₹{offer.rate}/£</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                        {offer.userId !== user?.uid ? (
                          <>
                            <Button
                              size="sm"
                              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                              onClick={() => handleContact(offer)}
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              Contact
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => offer.id && toggleSaved(offer.id)}
                            >
                              {offer.id && savedOffers.includes(offer.id) ? (
                                <BookmarkCheck className="w-4 h-4 text-blue-600" />
                              ) : (
                                <Bookmark className="w-4 h-4" />
                              )}
                            </Button>
                          </>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors"
                            onClick={() => offer.id && handleDeleteOffer(offer.id)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete Offer
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Exchange;
