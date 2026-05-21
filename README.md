# VendorHub 🛒
> Hyperlocal Multi-Vendor E-Commerce Platform — Built for DevFusion Hackathon 2.0

🌐 **Live Demo: https://thevendorhub.vercel.app/**

VendorHub connects local sellers with buyers in their community. Sellers list products, manage orders and earnings. Buyers get a smooth shopping experience with AI-powered search and recommendations.

---

## ✨ Features

### 🛍️ Buyer
- Browse products with **AI fuzzy search** (finds "laptop bag" even if you type "labtop beg")
- **AI recommendations** based on your past orders
- Cart, checkout with sandbox payment
- Order tracking: Placed → Confirmed → Shipped → Delivered
- Reviews and star ratings

### 🏪 Seller
- Register as vendor (admin approval required)
- Add/edit/delete products with images, price, stock, category
- Manage incoming orders (Confirm → Ship)
- Earnings dashboard with low stock alerts ⚠️

### 🔧 Admin
- Approve or reject vendor registrations
- Platform analytics: sellers, products, pending approvals

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| Auth | JWT |
| AI Search | Fuse.js |
| Payments | Sandbox checkout |

---

## ⚙️ Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/dhairyakk1/VendorHub.git
cd VendorHub
```

### 2. Backend setup
```bash
cd backend
npm install
```

Create `backend/.env`:
```
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_secret_key
```

```bash
npm run dev
```

### 3. Frontend setup
```bash
cd frontend
npm install
npm run dev
```

Visit http://localhost:3000

---

## 👥 Test Accounts

| Role | How to create |
|---|---|
| Buyer | Register normally, select Buyer |
| Seller | Register normally, select Seller — wait for admin approval |
| Admin | Register, then set `role: "admin"` in MongoDB Atlas |

---

## 🔌 Key API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/register | Register |
| POST | /api/auth/login | Login |
| GET | /api/products | List products |
| POST | /api/products | Create product |
| GET | /api/orders/my-orders | Buyer orders |
| GET | /api/orders/seller-orders | Seller orders |
| PUT | /api/orders/:id/status | Update status |
| GET | /api/recommendations | AI recommendations |

---

Built with ❤️ for DevFusion Hackathon 2.0
By Team Morgan&Prado
