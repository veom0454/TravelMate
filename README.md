# 🧳 TravelMate

**TravelMate** - The trusted platform for Indian students in London. Peer-to-peer INR ⇄ GBP currency exchange and verified roommate discovery — zero paperwork required.

## ✨ Features

- 💱 **Currency Exchange**: Peer-to-peer INR ⇄ GBP exchange at real rates
- 🏠 **Roommate Discovery**: Find verified accommodation from fellow Indian students
- 💬 **Real-time Messaging**: Connect with exchange partners and room providers
- 🛡️ **Trust System**: Behavior-based trust scores, no document uploads needed
- 🔐 **Secure Authentication**: Email/password and Google Sign-In
- 📱 **Responsive Design**: Works seamlessly on all devices

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Firebase project (see [FIREBASE_SETUP.md](./FIREBASE_SETUP.md))

### Installation

```bash
# Clone the repository
git clone https://github.com/Aditya060806/TravelMate.git

# Navigate to project directory
cd TravelMate

# Install dependencies
npm install

# Create .env file with Firebase credentials
# See .env.example for template

# Start development server
npm run dev
```

The app will be available at `http://localhost:8080`

## 📚 Documentation

- [Firebase Setup Guide](./FIREBASE_SETUP.md) - Complete Firebase configuration
- [Quick Start Guide](./QUICK_START.md) - Fast setup instructions
- [Vercel Deployment](./VERCEL_DEPLOYMENT.md) - Deploy to Vercel
- [Firestore Indexes](./CREATE_FIRESTORE_INDEXES.md) - Database index setup
- [Google Sign-In Fix](./GOOGLE_SIGNIN_FIX.md) - Troubleshooting guide

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Routing**: React Router v6
- **Backend**: Firebase (Auth, Firestore, Storage)
- **State Management**: React Query (TanStack Query)
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod

## 📦 Project Structure

```
src/
├── components/     # Reusable UI components
├── contexts/       # React contexts (Auth)
├── hooks/          # Custom React hooks
├── lib/            # Utilities and Firebase config
│   └── services/   # Firebase service layer
├── pages/          # Page components
└── main.tsx        # App entry point
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌐 Deployment

### Vercel (Recommended)

See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for detailed instructions.

1. Push code to GitHub
2. Import project in Vercel
3. Add Firebase environment variables
4. Deploy!

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is private and proprietary.

## 🙏 Acknowledgments

Built with ❤️ for the Indian student community in London.

---

**TravelMate** - Exchange money. Find your nest. 🏠💱
