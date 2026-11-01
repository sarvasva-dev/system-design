# System Design: Interactive Distributed Architecture Visualizer 🏛️

[![Live Demo](https://img.shields.io/badge/Live%20Demo-system--design-0070f3?style=for-the-badge&logo=vercel&logoColor=white)](https://system-design-wheat.vercel.app)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](#)
[![Tailwind](https://img.shields.io/badge/Tailwind-v4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](#)
[![AI Powered](https://img.shields.io/badge/AI%20Tutor-Gemini%202.4-orange?style=for-the-badge)](#)

An interactive architectural visualizer and reference repository for modern distributed systems engineering. Designed to make high-scale architectural trade-offs tangible through animated request flows, interactive node failures, state replication simulations, and intelligent AI tutoring.

---

## 🏗️ Architecture Blueprints Included

- 🌐 **Global URL Shortener**: Hash-based key generation, Base62 encoding, Redis caching tiers, and multi-region database sharding.
- 🚕 **Real-Time Ride-Hailing Backend**: Geospatial indexing (H3 / S2 / Geohash), driver-passenger WebSocket matching, and idempotency locks.
- 🎬 **Scalable Video Streaming Pipeline**: Chunked transcoding, adaptive bitrate streaming (HLS/DASH), and geo-distributed CDN caching.
- 💬 **High-Concurrency Chat Architecture**: Distributed WebSocket gateways, message broker queues (Kafka/RabbitMQ), and Cassandra event stores.
- 🛡️ **Distributed Rate Limiting Engine**: Sliding window counter algorithms, token buckets, and distributed Redis synchronization.

---

## ⚡ Core Features

- 🔄 **Animated Request Flow Simulator**: Step through client requests across API Gateways, Load Balancers, Redis Caches, and Database Replicas.
- 🧠 **AI Architecture Mentor**: Dynamic explanation of CAP theorem implications, latency vs. throughput trade-offs, and failure mode mitigations powered by Gemini AI.
- 🎨 **Fluid Motion UI**: Silky smooth 60fps canvas animations built with React 19 and Framer Motion (`motion`).

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Motion, Lucide Icons
- **AI Engine**: Google Gemini API (`@google/genai`)
- **Server**: TypeScript Express (`tsx`), Esbuild
- **Deployment**: Vercel CDN

---

## 🚀 Local Setup

```bash
git clone https://github.com/sarvasva-dev/system-design.git
cd system-design

bun install
bun run dev
```

---

## 👨‍💻 Author

**Sarthak Srivastava**  
- Portfolio: [sarthakml.in](https://sarthakml.in)  
- GitHub: [@sarvasva-dev](https://github.com/sarvasva-dev)
