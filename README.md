# 👔 MODERN. — Luxury Men's Wear & Sartorial Atelier

A luxury men's fashion e-commerce web application inspired by contemporary luxury houses and high-fashion retail platforms. Built with **React 19**, **TypeScript**, **Tailwind CSS v4**, **Express**, and **Google Gemini AI**.

---

## ✨ Features Overview

### 🛍️ 1. Sophisticated Storefront & Catalog
* **Dynamic Catalog**: Browse 24+ menswear categories including bespoke Italian wool suits, French Normandy linen shirts, Japanese selvedge denim, Goodyear-welted shoes, cashmere knitwear, and royal silk ethnic wear.
* **Faceted Filtering & Sorting**: Filter by category, fit (Tailored, Slim, Relaxed, Oversized), fabric, price range, in-stock availability, and customer ratings.
* **Rich Product Cards**: Interactive color shade switchers, quick-add size selectors, stock status badges, discount calculations, and one-click wishlist toggling.
* **Interactive Lookbook & Hotspots**: Editorial capsule collections with clickable hotspot pins revealing individual styled garments and accessories.
* **Quick View & Garment Comparison**: Inspect high-resolution garment imagery, sizing specifications, and side-by-side product comparison matrix.
* **Flash Sale Vault Event**: Real-time 24-hour countdown timer with discounted limited-edition pieces.

---

### 🤖 2. Gemini AI Fashion Stylist Concierge
* **Interactive AI Sartorial Assistant**: Powered by `@google/genai` (Gemini 2.5 Flash), offering personalized outfit advice for black-tie galas, business casual settings, destination weddings, and casual weekend wear.
* **Direct Garment Recommendations**: Recommends matching catalog pieces with one-click direct shopping links.

---

### 💳 3. Multi-Step Checkout & Invoicing
* **3-Step Acquisition Wizard**: Shipping destination, payment method selection, and real-time order review.
* **Flexible Payment Gateway Simulation**: Support for Credit/Debit Cards, Stripe, UPI / Instant NetBanking, Razorpay, Cash on Delivery (COD), and Atelier Store Credits.
* **Promo Code Engine**: Real-time coupon application (e.g., `WELCOME15`, `VIP20`, `SUMMER10`) with automatic discount calculation.
* **Instant Tax Invoices**: Downloadable PDF-styled VAT/sales tax invoices with breakdown of subtotal, express delivery, and taxes.

---

### 📦 4. Consignment Logistics Tracker
* **Real-time 5-Stage Milestones**: Visual tracking progress from Milan Fulfillment Atelier → Customs Clearance → Air Freight Departure → Local Courier → Doorstep Delivery.
* **Interactive Consignment Search**: Track any order by tracking ID or order reference.

---

### 👥 5. Role-Based Access Control (RBAC) Dashboards

Switch between 3 distinct user roles seamlessly using the top navigation switcher:

#### 👑 Super Admin Dashboard
* **Revenue Analytics**: Interactive revenue velocity and monthly order volume charts built with Recharts.
* **Product Catalog CMS**: Add new inventory, update pricing, toggle featured flags, and manage SKU variants.
* **Inventory Control & Restock**: Real-time stock level monitoring with instant restock modal.
* **VIP Coupon Generator**: Issue and manage promotional discount codes.

#### 🏭 Store Manager Fulfillment Floor
* **Dispatch & QC Queue**: Review incoming orders, update shipping statuses, and inspect garment quality.
* **Optical SKU/Barcode Scanner Simulator**: Rapid barcode verification for order fulfillment.
* **Daily Courier Manifest**: Generate and print courier shipment manifests.

#### 👤 Private Client Customer Dashboard
* **Bespoke Measurement Profile**: Save neck, chest, waist, and inseam measurements for automated size recommendations.
* **Order History & Consignment Archive**: View previous orders, invoice receipts, and live delivery status.
* **Saved Residences**: Multi-address manager for quick checkout.
* **Atelier Store Credit Vault**: Balance tracker with instant digital gift card redemption.
* **Master Tailor Ticket Desk**: Direct concierge support system for alterations, fittings, and care instructions.

---

### 🌐 6. Global Utility & UX
* **Multi-Currency Converter**: Real-time currency conversions across **USD ($)**, **EUR (€)**, **GBP (£)**, and **INR (₹)**.
* **Dark / Light Theme**: Full theme switching with automatic system detection.
* **Notification Feed**: Live order and promotional notifications with unread counts.
* **Mini-Cart Drawer**: Slide-over quick bag drawer with promo code input and free shipping progress tracker.

---

## 🛠️ Tech Stack

* **Frontend Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
* **Build Tool**: [Vite 6](https://vitejs.dev/) + [ESBuild](https://esbuild.github.io/)
* **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with `@tailwindcss/vite`
* **Icons**: [Lucide React](https://lucide.dev/)
* **Animations**: [Motion](https://motion.dev/) (Framer Motion v12) + [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
* **Data Visualization**: [Recharts](https://recharts.org/)
* **Backend Server**: [Express](https://expressjs.com/) (Node.js runtime)
* **AI Integration**: [@google/genai](https://www.npmjs.com/package/@google/genai) (Google Gemini API)

---

## 📁 Project Structure
