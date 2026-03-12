# 🎮 PUBG POP Marketplace

> **Developed by [DREAM.DEVX](https://www.instagram.com/dream.devx?igsh=ZDdsOXM2emMyM2Ux)**

A premium, high-performance marketplace platform for PUBG Popularity packages. Built with cutting-edge technologies to provide a seamless buying experience and a powerful administrative control center.

---
## 🌐 Live Demo

**Website:** [https://pubg-pop-market.vercel.app](https://pubg-pop-market.vercel.app)

- Admin: `admin` / `tahir123`
## ✨ Features

### 💎 User Experience
- **Modern UI/UX**: Dark-themed, gaming-inspired aesthetic with premium animations (Framer Motion).
- **Package Selection**: Browse and purchase various popularity packages tailored for PUBG players.
- **Direct WhatsApp Contact**: Integrated floating WhatsApp button for instant support.
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop viewing.

### 🔐 Administrative Suite (Admin Ahmad Malik)
- **Order Management**: Real-time tracking and verification of customer purchases.
- **Payment Verification**: Dedicated "Payment Proof" viewer with smart scaling for proof images.
- **Secure Access**: Protected admin routes using NextAuth.js.
- **Status Control**: Effortlessly confirm or reject orders with automated status updates.

---

## 🚀 Technical Stack

- **Core**: [Next.js 16 (App Router)](https://nextjs.org/)
- **UI/UX**: [React 19](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/)
- **State & Animation**: [Framer Motion](https://www.framer.com/motion/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🛠️ Installation & Setup

Follow these steps to get your local development environment running:

### 1. Prerequisites
- **Node.js**: Version 18.x or higher
- **npm**: Version 9.x or higher
- **MongoDB**: A running MongoDB instance (Local or Atlas)

### 2. Clone the Repository
```bash
git clone <your-repo-url>
cd pubg-popularity-market
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Environment Configuration
Create a `.env.local` file in the root directory and add the following variables:

```env
# MongoDB Connection
MONGODB_URI=your_mongodb_connection_string

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret_string

# Admin Configuration
ADMIN_PASSWORD=your_secure_admin_password
```

---

## 💻 Running the Project

### Development Mode
To start the development server with Hot Module Replacement (HMR):
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### Production Build
To create an optimized production build:
```bash
npm run build
npm start
```

---

## 🛡️ Administrative Access

Access the admin dashboard at `/dashboard` (or the configured admin path).
- **Admin**: Ahmad Malik
- **Developer**: DREAM.DEVX

---

## 🤝 Support

For any inquiries or technical support, please reach out via:
- **Instagram**: [dream.devx](https://www.instagram.com/dream.devx?igsh=ZDdsOXM2emMyM2Ux)

---

© 2026 **DREAM.DEVX** • ALL RIGHTS RESERVED
