# 🌆 Sheher-e-Hyderabad

A smart travel and exploration platform for Hyderabad — helping users discover food, places, shopping, events, and generate personalized trip itineraries.

🔗 **Live Demo:** https://sheher-e-hyderabad-5mxf.vercel.app/

---

## 🚀 Features

### 🧭 Explore Hyderabad

* 🍽 Food & Drinks
* 📍 Places to Visit
* 🛍 Shopping
* 🎭 Entertainment
* 🎉 Events

---

### 🧠 Smart Trip Planner

* Generate personalized itineraries

* Based on:

  * Budget 💰
  * Number of days 📅
  * User interests 🎯

* Intelligent logic:

  * Area-based clustering (reduces travel time)
  * Distance filtering (~4km radius)
  * Weighted random selection (balanced variety)
  * Unique place tracking (no repetition)

---

### 👤 Authentication System

* User registration & login
* Tourist / Local selection
* Profile management

---

### 📌 Dashboard

* Save generated itineraries
* View & manage plans
* Update profile

---

## 🏗️ Project Structure

```
src/
 ├── pages/          # Application pages
 ├── components/     # Reusable UI components
 ├── services/       # Business logic (Trip Planner)
 ├── db/             # API / database logic
 ├── context/        # Auth & global state
 ├── types/          # TypeScript types
```

### ✨ Key Highlight

Trip planner logic is separated into:

src/services/tripPlannerService.ts

Includes:

* itinerary generation
* Haversine distance calculation
* preference filtering
* clustering logic
* plan saving

---

## 🛠 Tech Stack

* **Frontend:** React + TypeScript
* **Build Tool:** Vite
* **Styling:** Tailwind CSS
* **UI:** shadcn/ui
* **Backend / DB:** Supabase
* **Deployment:** Vercel

---

## ⚙️ Setup & Installation

### Prerequisites

* Node.js ≥ 18
* npm ≥ 9

---

### Run Locally

```bash
# Clone repo
git clone https://github.com/thussain98490/Sheher-e-Hyderabad.git

# Navigate
cd Sheher-e-Hyderabad

# Install dependencies
npm install

# Run project
npm run dev
```

---

## 🔐 Environment Variables

Create a `.env` file:

```env
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
```

---

## 📸 Screenshots

> Add screenshots of:

* Home Page
* Trip Planner
* Dashboard

---

## 🚀 Future Improvements

* 📍 Map integration
* 🤖 AI-based itinerary generation
* ❤️ Favorites system
* 📊 Filters & sorting
* 🖼 Image recommendations

---

## 👨‍💻 Author

**Taher Hussain**
GitHub: https://github.com/thussain98490

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!
