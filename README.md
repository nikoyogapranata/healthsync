# HealthSync

<div align="center">
  <h1 align="center">HealthSync</h1>
  <p align="center">
    A modern, all-in-one healthcare management platform.
    <br />
    <a href="https://healthsync-7.vercel.app/"><strong>View Live Demo »</strong></a>
  </p>
  <br />
</div>

<div align="center">

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/iforyouyeah1627-gmailcoms-projects/v0-health-sync)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.io/)

</div>

---

## 📖 Table of Contents

* [📍 Overview](#-overview)
* [✨ Features](#-features)
* [🛠️ Tech Stack](#-tech-stack)
* [🚀 Local Development Setup](#-local-development-setup)
* [🤝 Contributing](#-contributing)

---

## 📍 Overview

**HealthSync** is a comprehensive web application designed to streamline healthcare management for patients, doctors, and administrators. It serves as a centralized hub for managing appointments, patient queues, and electronic health records (EHR).

This project was initially generated using **[v0.dev](https://v0.dev)** and is automatically kept in sync with the Vercel deployment. You can continue building the UI on v0 or work on the full application logic locally.

### Quick Links

* **Live Deployment:** **[v0-health-sync.vercel.app](https://v0-health-sync.vercel.app/)**
* **Build on v0.dev:** **[v0.dev/chat/projects/WfKQOXUkYuE](https://v0.dev/chat/projects/WfKQOXUkYuE)**

---

## ✨ Features

* ✅ **Role-Based Dashboards:** Unique, tailored interfaces for Patients, Doctors, and Administrators.
* ✅ **Secure Authentication:** Robust user login and registration powered by Supabase Auth.
* ✅ **Appointment Management:** Intuitive system for patients to book, view, and manage appointments.
* ✅ **Live Queue System:** Real-time queue management for admins and doctors to monitor patient flow.
* ✅ **Electronic Health Records (EHR):** A complete system for creating, viewing, and managing patient medical records securely.
* ✅ **Integrated AI Assistant:** A helpful chatbot to answer user queries and guide them through the platform.

---

## 🛠️ Tech Stack

* **Framework:** Next.js
* **Language:** TypeScript
* **Backend & Database:** Supabase
* **Styling:** Tailwind CSS
* **UI Components:** shadcn/ui
* **Package Manager:** pnpm

---

## 🚀 Local Development Setup

To run and edit the project on your local machine, follow these steps.

### Prerequisites

Make sure you have the following installed:
* **Node.js**: `v18.0` or newer.
* **pnpm**: See [pnpm.io/installation](https://pnpm.io/installation) for instructions.

### Installation

1.  **Clone the Repository**
    ```sh
    git clone [https://github.com/nikoyogapranata/healthsync.git](https://github.com/nikoyogapranata/healthsync.git)
    cd healthsync
    ```

2.  **Install Dependencies**
    ```sh
    pnpm install
    ```

3.  **Set Up Supabase**
    * Create a project at **[database.new](https://database.new)**.
    * In your Supabase dashboard, go to `Project Settings > API`.
    * Create a file named `.env.local` in the root of your project.
    * Copy your project URL and `anon` key into the `.env.local` file.

    ```env
    # Found in Supabase Project Settings > API
    NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
    NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
    ```

4.  **Set Up the Database Schema**
    * Go to the **SQL Editor** in your Supabase dashboard.
    * Run the SQL files from the `/scripts` directory in this project to set up the necessary tables and policies.

### Running the App

* **To run the development server:**
    ```sh
    pnpm dev
    ```
    Open your browser and visit **[http://localhost:3000](http://localhost:3000)**.

---

## 🤝 Contributing

Contributions are welcome! If you have a suggestion or fix, please fork the repo and create a pull request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request
