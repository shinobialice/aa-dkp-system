# 🏆 AA DKP System

A comprehensive **Dragon Kill Points (DKP)** system for managing guild raids, loot distribution, and member activities in MMORPG games.

## 📋 Overview

This DKP system provides a complete solution for guild management, allowing raid leaders and guild officers to:

- Track member attendance and participation
- Manage loot distribution fairly
- Calculate and distribute DKP points
- Monitor guild finances and salaries
- Schedule raids and events

## ✨ Features

### 🎯 Core DKP Management

- **Point Tracking**: Automatic DKP calculation based on raid attendance
- **Loot Distribution**: Fair loot queue system with bidding mechanics
- **Member Management**: Comprehensive user profiles with activity tracking
- **Raid Scheduling**: Calendar integration for raid planning

### 📊 Analytics & Reporting

- **Guild Statistics**: Performance metrics and attendance analytics
- **Monthly Reports**: Detailed activity summaries
- **Financial Tracking**: Guild fund management and salary distribution
- **Activity Monitoring**: Individual and guild-wide performance insights

### 🔐 Authentication & Security

- **VK Integration**: Social login through VKontakte
- **Role-based Access**: Different permission levels for officers and members
- **Session Management**: Secure token-based authentication
- **Account Linking**: Connect multiple social accounts

### 💰 Financial System

- **Guild Treasury**: Track income and expenses
- **Salary System**: Automated bonus distribution
- **Expense Management**: Monitor guild expenditures
- **Bonus Calculations**: Performance-based rewards

## 🛠️ Technology Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Radix UI** - Accessible component primitives
- **React Hook Form** - Form management
- **Recharts** - Data visualization

### Backend

- **Next.js API Routes** - Server-side functionality
- **Supabase** - Database and authentication
- **PostgreSQL** - Relational database

### Features & Integrations

- **VK SDK** - VKontakte social authentication
- **FullCalendar** - Event scheduling
- **OCR Upload** - Image text recognition
- **Responsive Design** - Mobile and desktop support

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm package manager
- Supabase account
- VK App credentials (for authentication)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/shinobialice/aa-dkp-system.git
   cd aa-dkp-system
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Environment Setup**
   Create a `.env.local` file:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   NEXT_PUBLIC_VK_CLIENT_ID=your_vk_client_id
   VK_CLIENT_ID=your_vk_client_id
   ```

4. **Run the development server**

   ```bash
   pnpm dev
   ```

5. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (default-layout)/  # Main application layout
│   ├── (login-layout)/    # Authentication layout
│   └── api/               # API routes
├── actions/               # Server actions
├── components/            # Reusable components
├── hooks/                 # Custom React hooks
├── shared/                # Shared utilities and UI
├── types/                 # TypeScript definitions
├── utils/                 # Helper functions
└── widgets/               # Feature-specific components
    ├── calendar/          # Event scheduling
    ├── Loot/             # Loot management
    ├── login/            # Authentication
    ├── MembersTable/     # Member management
    └── statCharts/       # Analytics
```

## 🎮 How It Works

### DKP System Basics

1. **Earning Points**: Members earn DKP by attending raids and participating in guild activities
2. **Spending Points**: DKP is spent on loot through a bidding/queue system
3. **Fair Distribution**: The system ensures fair loot distribution based on contribution
4. **Attendance Tracking**: Automatic attendance recording for raids and events

### Loot Management

- **Queue System**: Items are distributed based on DKP and priority queues
- **Bidding Mechanics**: Members can bid DKP for desired items
- **Item Quality**: Different point values for different item tiers
- **Distribution History**: Complete audit trail of all loot distributions

### Guild Administration

- **Officer Tools**: Advanced management features for guild leadership
- **Financial Overview**: Track guild income, expenses, and member salaries
- **Performance Metrics**: Analyze member and guild performance
- **Event Planning**: Schedule and manage raids and activities

## 📄 License

This project is private and proprietary to the AA guild.

---

**Built with ❤️ for the AA Guild Community**
