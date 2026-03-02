import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowLeft, Check, Shield, TrendingUp, Home, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

type AuthMode = "login" | "signup" | "forgot";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn, signUp, signInWithGoogle, resetPassword } = useAuth();

  const initialMode = searchParams.get("mode") === "signup" ? "signup" : "login";
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student" as "student" | "provider",
  });

  const passwordStrength = (password: string) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const strength = passwordStrength(form.password);
  const strengthLabels = ["Weak", "Fair", "Good", "Strong"];
  const strengthColors = ["bg-red-400", "bg-amber-400", "bg-blue-400", "bg-emerald-400"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "login") {
        await signIn(form.email, form.password);
        toast({ title: "Welcome back!", description: "Redirecting to dashboard..." });
        navigate("/dashboard");
      } else if (mode === "signup") {
        await signUp(form.email, form.password, form.name, form.role);
        toast({ title: "Account created!", description: "Please check your email to verify." });
        navigate("/dashboard");
      } else {
        await resetPassword(form.email);
        toast({ title: "Reset link sent", description: "Check your email for instructions." });
        setMode("login");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle(form.role);
      toast({ title: "Welcome!", description: "Signed in with Google" });
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Google sign-in failed",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <div className="w-full lg:w-1/2 flex flex-col">
        <div className="p-6">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-sm"
          >
            <div className="mb-8">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center mb-4 shadow-lg glow-primary">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <h1 className="text-2xl font-bold mb-2">
                {mode === "login" && "Welcome back"}
                {mode === "signup" && "Create your account"}
                {mode === "forgot" && "Reset password"}
              </h1>
              <p className="text-muted-foreground text-sm">
                {mode === "login" && "Enter your credentials to access your account"}
                {mode === "signup" && "Start exchanging and find your perfect roommate"}
                {mode === "forgot" && "Enter your email to receive a reset link"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "signup" && (
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Full Name</label>
                  <Input
                    type="text"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
              )}

              <div>
                <label className="text-sm font-medium mb-1.5 block">Email</label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>

              {mode !== "forgot" && (
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Password</label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {mode === "signup" && form.password && (
                    <div className="mt-3">
                      <div className="flex gap-1 mb-1.5">
                        {[0, 1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className={`h-1.5 flex-1 rounded-full transition-colors ${i < strength ? strengthColors[strength - 1] : "bg-slate-200"
                              }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {strength > 0 ? strengthLabels[strength - 1] : "Enter a password"}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {mode === "signup" && (
                <div>
                  <label className="text-sm font-medium mb-2 block">I am a</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: "student", label: "Student", desc: "Looking for rooms & exchange" },
                      { value: "provider", label: "Room Provider", desc: "Listing accommodation" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setForm({ ...form, role: option.value as "student" | "provider" })}
                        className={`p-3 rounded-lg border text-left transition-all ${form.role === option.value
                            ? "border-blue-400 bg-blue-50 shadow-sm"
                            : "border-border hover:border-blue-200 hover:bg-blue-50/30"
                          }`}
                      >
                        <div className="font-medium text-sm">{option.label}</div>
                        <div className="text-xs text-muted-foreground">{option.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {mode === "login" && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setMode("forgot")}
                    className="text-sm text-primary hover:text-primary/80 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md" disabled={loading}>
                {loading ? "Please wait..." : (
                  <>
                    {mode === "login" && "Sign in"}
                    {mode === "signup" && "Create account"}
                    {mode === "forgot" && "Send reset link"}
                  </>
                )}
              </Button>

              {mode !== "forgot" && (
                <>
                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="bg-background px-2 text-muted-foreground">or continue with</span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full hover:bg-blue-50 hover:border-blue-200 transition-all"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                  >
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Google
                  </Button>
                </>
              )}
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              {mode === "login" && (
                <>
                  Don't have an account?{" "}
                  <button onClick={() => setMode("signup")} className="text-primary hover:text-primary/80 font-medium">
                    Sign up
                  </button>
                </>
              )}
              {mode === "signup" && (
                <>
                  Already have an account?{" "}
                  <button onClick={() => setMode("login")} className="text-primary hover:text-primary/80 font-medium">
                    Sign in
                  </button>
                </>
              )}
              {mode === "forgot" && (
                <button onClick={() => setMode("login")} className="text-primary hover:text-primary/80 font-medium">
                  Back to sign in
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full -ml-36 -mb-36" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/5 rounded-full" />

        <div className="relative z-10 max-w-md text-white">
          <div className="w-16 h-16 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center mb-8 border border-white/20">
            <span className="font-bold text-2xl">T</span>
          </div>
          <h2 className="text-3xl font-bold mb-4">Join the community</h2>
          <p className="text-white/70 mb-8 leading-relaxed">
            TravelMate connects Indian students in London for peer-to-peer currency exchange and trusted roommate discovery.
          </p>
          <div className="space-y-4">
            {[
              { icon: Shield, text: "No document uploads required" },
              { icon: Users, text: "Behavior-based trust system" },
              { icon: TrendingUp, text: "Real-time exchange rates" },
              { icon: Home, text: "Verified student community" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                  <item.icon className="w-4 h-4" />
                </div>
                <span className="text-sm">{item.text}</span>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 flex items-center gap-4">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-8 h-8 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center text-xs font-medium">
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <span className="text-sm text-white/70">Trusted by students across London</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
