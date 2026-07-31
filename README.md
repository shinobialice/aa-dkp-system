# 🏆 AA DKP System

A comprehensive **Dragon Kill Points (DKP)** system for managing guild raids, loot distribution, and member activities in MMORPG environments.


---

## 📋 Overview

This system provides a full suite of tools for guild leaders and officers:

- Track attendance and participation
- Manage fair loot distribution
- Calculate and assign DKP
- Handle treasury and salary payouts
- Schedule and manage raids/events

---

## ✨ Features

### 🎯 Core DKP Management
- **Automatic DKP Calculation** based on raid attendance
- **Fair Loot Distribution** using queue & bidding mechanics
- **Member Profiles** with history and activity tracking
- **Event Scheduling** with an integrated calendar

### 📊 Analytics & Reporting
- **Guild Activity Insights**
- **Monthly DKP & Attendance Reports**
- **Treasury and Salary Overview**
- **Performance Statistics** per player & per raid

### 🔐 Authentication & Security
- **VK OAuth Integration**
- **Role-Based Permissions** (Member / Officer / Admin)
- **Token-Based Auth**
- **Multi-Account Linking**

### 💰 Financial System
- **Guild Treasury Dashboard**
- **Automated Salary Bonuses**
- **Expense and Income Logging**
- **Performance-Based Reward Bonuses**

---

## 🛠️ Technology Stack

### Frontend
- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Radix UI**
- **React Hook Form**
- **Recharts**

### Backend
- **Next.js Server Actions / API Routes**
- **Supabase Auth & Database**
- **PostgreSQL**

### Integrations
- **VK OAuth SDK**
- **FullCalendar**
- **OCR-based Screenshot Parsing**
- **Mobile-Ready Responsive UI**

---

## 🚀 Getting Started

### Requirements
- Node.js 18+
- `pnpm`
- Supabase project
- VK application credentials

### Installation

```bash
git clone https://github.com/shinobialice/aa-dkp-system.git
cd aa-dkp-system
pnpm install
