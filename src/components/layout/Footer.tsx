import { Link } from "react-router-dom";
import { TrendingUp, Home, MessageSquare, Shield } from "lucide-react";

export const Footer = () => {
    return (
        <footer className="border-t border-border bg-white">
            <div className="section-container py-12">
                <div className="grid md:grid-cols-4 gap-8">
                    <div className="md:col-span-1">
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
                                <span className="text-white font-bold text-sm">T</span>
                            </div>
                            <span className="font-semibold text-lg">TravelMate</span>
                        </Link>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            The trusted platform for Indian students in London. Peer-to-peer currency exchange and verified roommate discovery.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold text-sm mb-4 text-foreground">Platform</h4>
                        <ul className="space-y-2.5">
                            {[
                                { to: "/exchange", label: "Currency Exchange", icon: TrendingUp },
                                { to: "/rooms", label: "Find Rooms", icon: Home },
                                { to: "/messages", label: "Messages", icon: MessageSquare },
                            ].map(link => (
                                <li key={link.to}>
                                    <Link to={link.to} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                                        <link.icon className="w-3.5 h-3.5" />
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-sm mb-4 text-foreground">Trust & Safety</h4>
                        <ul className="space-y-2.5">
                            {["Behavior-based Trust", "No Document Uploads", "Verified Community", "Secure Messaging"].map(item => (
                                <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Shield className="w-3.5 h-3.5 text-emerald-500" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-sm mb-4 text-foreground">Get Started</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                            Join fellow Indian students already using TravelMate for safer, cheaper exchanges.
                        </p>
                        <Link
                            to="/auth?mode=signup"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md"
                        >
                            Create Free Account
                        </Link>
                    </div>
                </div>

                <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-muted-foreground">
                        © {new Date().getFullYear()} TravelMate. Built for Indian students in London.
                    </p>
                    <div className="flex items-center gap-4">
                        <span className="text-xs text-muted-foreground">INR ⇄ GBP</span>
                        <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Rooms</span>
                        <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Trust</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
