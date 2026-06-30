# 🛒 Shopping-Ekart

A full-stack e-commerce web application where users can browse products, manage a cart, pay securely online, and track orders — while admins manage the product catalog and view sales analytics.

**Live:** https://shopping-ekart.vercel.app

---

## 📖 What This Project Does

Shopping-Ekart is a MERN-based online shopping platform (similar in spirit to a small Flipkart/Amazon). It supports:

- User registration with email OTP verification
- Secure login/logout with JWT-based authentication
- Forgot password flow with OTP verification
- Product browsing (public) and product management (admin only)
- Shopping cart (add, update quantity, remove)
- Order placement with real online payments via Razorpay
- Order history for users, and full order + sales visibility for admins
- Image uploads (product images, profile pictures) stored on Cloudinary
- An AI-assisted feature powered by Google Gemini

---

## 🧱 Tech Stack

### Backend
| Tool | Purpose |
|---|---|
| Node.js + Express 5 | REST API server |
| MongoDB + Mongoose | Database & schema modeling |
| JWT (jsonwebtoken) | Authentication (login sessions) |
| bcryptjs | Password hashing |
| Multer | Handling file uploads from forms |
| Cloudinary | Cloud storage for images |
| Razorpay | Payment gateway integration |
| Nodemailer | Sending OTP / verification emails |
| Google Generative AI (Gemini) | AI-assisted feature |
| crypto-js | Extra data encryption utilities |
| dotenv | Environment variable management |

### Frontend
| Tool | Purpose |
|---|---|
| React 19 + Vite | UI framework & build tool |
| Redux Toolkit + Redux Persist | Global state management (cart, auth, etc.) that survives page refresh |
| React Router | Client-side routing |
| Tailwind CSS + Radix UI | Styling & accessible UI components |
| Axios | API requests to the backend |
| GSAP, React Three Fiber/Drei, Three.js | Animations and 3D/visual effects |
| Sonner | Toast notifications |

---

## 🏗️ Architecture

The backend follows a clean **MVC-style REST API** pattern:

```
Backend/
├── server.js              # Express app entry point
├── database/db.js         # MongoDB connection
├── routes/                # API endpoint definitions
│   ├── UserRoute.js
│   ├── ProductRoute.js
│   ├── CartRoute.js
│   └── OrderRoute.js
├── controllers/           # Business logic for each route
│   ├── userController.js
│   ├── productController.js
│   ├── cartController.js
│   ├── orderController.js
│   └── aiController.js
├── models/                # Mongoose schemas
│   ├── userModel.js
│   ├── productModel.js
│   ├── cartModel.js
│   └── orderModel.js
└── middleware/
    ├── isAuthenticated.js # JWT verification + role (admin) checks
    └── multer.js          # File upload handling

Frontend/Ekart/
└── src/
    ├── components/        # Reusable UI components (Radix-based)
    ├── pages/              # Route-level pages
    ├── store/              # Redux slices (auth, cart, etc.)
    └── App.jsx
```

**Request flow:** React (Axios) → Express route → middleware (auth/admin/upload check) → controller (logic) → Mongoose model → MongoDB → JSON response → Redux store updates → UI re-renders.

---

## 🔌 API Reference

Base URL: `/api/v1`

### 👤 User (`/user`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/register` | ❌ | Register a new account |
| POST | `/verify` | ❌ | Verify account via OTP |
| POST | `/reverify` | ❌ | Resend verification token |
| POST | `/login` | ❌ | Login, returns JWT |
| POST | `/logout` | ✅ | Logout current user |
| POST | `/forget-password` | ❌ | Start forgot-password flow |
| POST | `/verify-otp/:email` | ❌ | Verify OTP for password reset |
| POST | `/change-password/:email` | ❌ | Set new password |
| GET | `/all-user` | ✅ Admin | List all users |
| GET | `/get-user/:userId` | ❌ | Get a single user's profile |
| PUT | `/update/:id` | ✅ | Update profile (supports image upload) |
| POST | `/ai` | ❌ | AI-assisted feature (Gemini) |

### 📦 Product (`/product`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/add` | ✅ Admin | Add new product (multiple images) |
| GET | `/getallproducts` | ❌ | List all products |
| PUT | `/update/:productId` | ✅ Admin | Update a product |
| DELETE | `/delete/:productId` | ✅ Admin | Delete a product |

### 🛒 Cart (`/cart`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | ✅ | Get current user's cart |
| POST | `/add` | ✅ | Add item to cart |
| PUT | `/update` | ✅ | Update item quantity |
| DELETE | `/remove` | ✅ | Remove item from cart |

### 💳 Orders (`/orders`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/create-order` | ✅ | Create a Razorpay order |
| POST | `/verify` | ✅ | Verify Razorpay payment signature |
| GET | `/my-order` | ✅ | Get logged-in user's orders |
| GET | `/user-order/:userId` | ✅ | Get orders for a specific user |
| GET | `/all` | ✅ Admin | Get all orders |
| GET | `/sales` | ✅ Admin | Sales analytics data |

---

## 🗃️ Database Schemas

**User** — firstName, lastName, email (unique), password (hashed), role (`user`/`admin`), profile pic + Cloudinary public ID, isVerified, isLoggedIn, OTP + OTP expiry, address/city/zipCode/phoneNo, timestamps.

**Product** — userId (creator/admin ref), productName, productDesc, productImg (array of `{url, public_id}` for Cloudinary), productPrice, category, brand, timestamps.

**Cart** — userId (ref), items (array of `{productId, quantity, price}`), totalPrice, timestamps.

**Order** — user (ref), products (array of `{productId, quantity}`), amount, tax, shipping, currency (default INR), status (`Pending`/`Paid`/`Failed`), Razorpay fields (`razorpayOrderId`, `razorpayPaymentId`, `razorpaySignature`), timestamps.

---

## 🔐 Authentication & Authorization

- JWT issued on login/registration verification.
- `isAuthenticated` middleware verifies the JWT on protected routes.
- `isAdmine` middleware additionally checks `role === "admin"` for admin-only routes (product management, viewing all users/orders, sales data) — this is **role-based access control (RBAC)**.
- Passwords are hashed with bcryptjs before being stored — plaintext passwords are never saved.
- Email OTP verification is required both at registration and for password resets.

---

## 💳 Payment Flow (Razorpay)

1. Frontend calls `POST /orders/create-order` → backend creates a Razorpay order and an `Order` document with status `Pending`.
2. Razorpay's checkout UI opens on the frontend for the user to pay.
3. After payment, frontend sends payment details to `POST /orders/verify`.
4. Backend verifies the Razorpay signature server-side (never trusts the frontend alone) and updates the order status to `Paid` or `Failed`.

This two-step "create then verify" pattern prevents a user from spoofing a successful payment.

---

## 🖼️ Image Upload Flow

1. User selects a file in the frontend form (product image / profile picture).
2. **Multer** middleware parses the multipart form data on the backend.
3. The file is converted to a data URI and uploaded to **Cloudinary**.
4. Only the returned Cloudinary `url` and `public_id` are saved in MongoDB — the server itself never stores image files, keeping the backend lightweight and scalable.

---

## 🤖 AI Feature

The `/user/ai` endpoint integrates **Google Gemini** (`@google/generative-ai`) to power an AI-assisted feature within the app (e.g., shopping assistant / smart suggestions — see `aiController.js` for exact logic).

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Cloudinary account
- Razorpay account
- Google Gemini API key

### Backend
```bash
cd Backend
npm install
```

Create `Backend/.env`:
```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
GEMINI_API_KEY=...
SMTP_EMAIL=...
SMTP_PASSWORD=...
```

```bash
npm run dev   # starts with nodemon
```

### Frontend
```bash
cd Frontend/Ekart
npm install
npm run dev
```

Frontend runs on Vite's default dev server; backend runs on `PORT` from `.env` (default 3000).

---

## 🛡️ Security Practices Used

- Passwords hashed with bcryptjs (never stored in plain text)
- JWT-based stateless authentication
- Role-based access control for admin routes
- Server-side payment signature verification (Razorpay)
- CORS restricted to the deployed frontend origin
- File uploads validated and routed through Multer before reaching Cloudinary

---

## 📌 Quick Mental Model (for interviews / future you)

> User logs in → gets JWT → adds products to cart (saved in MongoDB, persisted in Redux on frontend) → checks out → backend creates a Razorpay order → user pays → backend verifies payment signature → order status updated to Paid → user sees it in their order history → admin can view all orders and sales data.

---

## 📄 License
MIT
