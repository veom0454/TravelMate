import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { z } from 'zod';

const signUpSchema = z.object({
  displayName: z.string().min(2, 'Name must be at least 2 characters').max(50),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  role: z.enum(['student', 'provider'])
});

const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

type AuthMode = 'signin' | 'signup' | 'forgot' | 'success';

export const AuthForm: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    role: 'student' as UserRole
  });
  
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  
  const { signUp, signIn, signInWithGoogle, resetPassword } = useAuth();
  const navigate = useNavigate();

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];

  const validateField = (name: string, value: string) => {
    try {
      if (mode === 'signup') {
        const partial = { ...formData, [name]: value };
        signUpSchema.pick({ [name]: true } as any).parse({ [name]: value });
      } else if (mode === 'signin') {
        signInSchema.pick({ [name]: true } as any).parse({ [name]: value });
      }
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    } catch (err) {
      if (err instanceof z.ZodError) {
        setFieldErrors(prev => ({ ...prev, [name]: err.errors[0]?.message || '' }));
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === 'signup') {
        signUpSchema.parse(formData);
        await signUp(formData.email, formData.password, formData.displayName, formData.role);
        setSuccessMessage('Account created! Please check your email to verify your account.');
        setMode('success');
      } else if (mode === 'signin') {
        signInSchema.parse({ email: formData.email, password: formData.password });
        await signIn(formData.email, formData.password);
        navigate('/dashboard');
      } else if (mode === 'forgot') {
        await resetPassword(formData.email);
        setSuccessMessage('Password reset email sent! Check your inbox.');
        setMode('success');
      }
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0]?.message || 'Validation error');
      } else if (err?.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please sign in instead.');
      } else if (err?.code === 'auth/invalid-credential') {
        setError('Invalid email or password.');
      } else if (err?.code === 'auth/user-not-found') {
        setError('No account found with this email.');
      } else if (err?.code === 'auth/wrong-password') {
        setError('Incorrect password.');
      } else {
        setError(err?.message || 'An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithGoogle(formData.role);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  if (mode === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-6"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-accent-blue to-accent-violet flex items-center justify-center"
        >
          <CheckCircle2 className="w-10 h-10 text-white" />
        </motion.div>
        <h2 className="text-2xl font-semibold text-foreground">Success!</h2>
        <p className="text-muted-foreground">{successMessage}</p>
        <Button
          onClick={() => setMode('signin')}
          className="w-full bg-gradient-to-r from-accent-blue to-accent-violet"
        >
          Back to Sign In
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-accent-blue via-accent-violet to-accent-pink bg-clip-text text-transparent">
          NestExchange
        </h1>
        <p className="text-muted-foreground mt-2">
          {mode === 'signin' && 'Welcome back'}
          {mode === 'signup' && 'Create your account'}
          {mode === 'forgot' && 'Reset your password'}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-red-400"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'signup' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
          >
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                name="displayName"
                placeholder="Full name"
                value={formData.displayName}
                onChange={handleChange}
                className="pl-10"
              />
            </div>
            {fieldErrors.displayName && (
              <p className="text-red-400 text-xs mt-1">{fieldErrors.displayName}</p>
            )}
          </motion.div>
        )}

        {mode !== 'forgot' && mode === 'signup' && (
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">I am a</label>
            <div className="grid grid-cols-2 gap-3">
              {(['student', 'provider'] as const).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, role }))}
                  className={`p-3 rounded-lg border transition-all ${
                    formData.role === role
                      ? 'border-accent-blue bg-accent-blue/10 text-accent-blue'
                      : 'border-border bg-surface hover:border-accent-blue/50'
                  }`}
                >
                  <span className="capitalize">{role === 'provider' ? 'Room Provider' : role}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              name="email"
              type="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              className="pl-10"
            />
          </div>
          {fieldErrors.email && (
            <p className="text-red-400 text-xs mt-1">{fieldErrors.email}</p>
          )}
        </div>

        {mode !== 'forgot' && (
          <div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="pl-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {fieldErrors.password && (
              <p className="text-red-400 text-xs mt-1">{fieldErrors.password}</p>
            )}
            
            {mode === 'signup' && formData.password && (
              <div className="mt-2 space-y-1">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        i < passwordStrength ? strengthColors[passwordStrength - 1] : 'bg-border'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Password strength: {strengthLabels[passwordStrength - 1] || 'Too weak'}
                </p>
              </div>
            )}
          </div>
        )}

        {mode === 'signin' && (
          <div className="text-right">
            <button
              type="button"
              onClick={() => setMode('forgot')}
              className="text-sm text-accent-blue hover:text-accent-violet transition-colors"
            >
              Forgot password?
            </button>
          </div>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-accent-blue to-accent-violet hover:opacity-90 transition-opacity"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              {mode === 'signin' && 'Sign In'}
              {mode === 'signup' && 'Create Account'}
              {mode === 'forgot' && 'Send Reset Link'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>

        {mode !== 'forgot' && (
          <>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>
          </>
        )}
      </form>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        {mode === 'signin' && (
          <>
            Don't have an account?{' '}
            <button
              onClick={() => setMode('signup')}
              className="text-accent-blue hover:text-accent-violet transition-colors"
            >
              Sign up
            </button>
          </>
        )}
        {mode === 'signup' && (
          <>
            Already have an account?{' '}
            <button
              onClick={() => setMode('signin')}
              className="text-accent-blue hover:text-accent-violet transition-colors"
            >
              Sign in
            </button>
          </>
        )}
        {mode === 'forgot' && (
          <button
            onClick={() => setMode('signin')}
            className="text-accent-blue hover:text-accent-violet transition-colors"
          >
            Back to sign in
          </button>
        )}
      </div>
    </motion.div>
  );
};
