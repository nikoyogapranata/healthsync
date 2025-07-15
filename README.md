<br/>
<div align="center">
  <img src="./public/illustrations/logo.png" alt="Logo" width="120" height="120">

  <h1 align="center">HealthSync</h1>

  <p align="center">
    A modern, all-in-one healthcare management platform.
    <br />
    <a href="#-about-the-project"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="#">View Demo</a>
    ·
    <a href="#">Report Bug</a>
    ·
    <a href="#">Request Feature</a>
  </p>
</div>

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![PNPM](https://img.shields.io/badge/pnpm-F69220?style=for-the-badge&logo=pnpm&logoColor=white)

</div>

---

## 📖 Table of Contents

* [📍 About The Project](#-about-the-project)
* [✨ Features](#-features)
* [🚀 Getting Started](#-getting-started)
  * [Prerequisites](#-prerequisites)
  * [Installation & Setup](#-installation--setup)
* [🏃 Usage](#-usage)
* [📁 Project Structure](#-project-structure)
* [🤝 Contributing](#-contributing)
* [📄 License](#-license)
* [📧 Contact](#-contact)

---

## 📍 About The Project

**HealthSync** is a comprehensive web application designed to streamline healthcare management for patients, doctors, and administrators. It serves as a centralized hub for managing appointments, patient queues, and electronic health records (EHR), all powered by a modern, scalable tech stack.

### Built With

* [![Next.js][Next.js]][Next-url]
* [![React][React.js]][React-url]
* [![Supabase][Supabase]][Supabase-url]
* [![TailwindCSS][TailwindCSS]][TailwindCSS-url]
* [![TypeScript][TypeScript]][TypeScript-url]

---

## ✨ Features

* ✅ **Role-Based Dashboards:** Unique, tailored interfaces for Patients, Doctors, and Administrators.
* ✅ **Secure Authentication:** Robust user login and registration powered by Supabase Auth.
* ✅ **Appointment Management:** Intuitive system for patients to book, view, and manage appointments.
* ✅ **Live Queue System:** Real-time queue management for admins and doctors to monitor patient flow.
* ✅ **Electronic Health Records (EHR):** A complete system for creating, viewing, and managing patient medical records securely.
* ✅ **Integrated AI Assistant:** A helpful chatbot to answer user queries and guide them through the platform.
* ✅ **Comprehensive Admin Panels:** Powerful tools for managing doctors, hospital settings, user roles, and more.
* ✅ **Responsive Design:** Fully responsive and accessible on all devices, from mobile to desktop.

---

## 🚀 Getting Started

Follow these instructions to get a local copy up and running for development and testing.

### ✅ Prerequisites

Make sure you have the following software installed on your machine:
* **Node.js**: `v18.0` or newer. [Download here](https://nodejs.org/).
* **pnpm**: Follow the instructions at [pnpm.io/installation](https://pnpm.io/installation).

### ✅ Installation & Setup

1.  **Clone the Repository**
    ```sh
    git clone [https://github.com/your-username/healthsync.git](https://github.com/your-username/healthsync.git)
    cd healthsync
    ```

2.  **Install Dependencies**
    ```sh
    pnpm install
    ```

3.  **Set Up Supabase**
    * If you don't have one, create a new project at **[database.new](https://database.new)**.
    * Navigate to `Project Settings > API` in your Supabase dashboard.
    * Create a new file named `.env.local` in the root of your project.
    * Copy your API URL and `anon` key into the `.env.local` file as shown below.

    | Variable                    | Description                                       | Where to Find                                |
    | --------------------------- | ------------------------------------------------- | -------------------------------------------- |
    | `NEXT_PUBLIC_SUPABASE_URL`  | Your project's unique API URL.                    | Supabase Dashboard: `Settings > API > URL`   |
    | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | The public-facing anonymous key for your project. | Supabase Dashboard: `Settings > API > Project API Keys` |

    Your `.env.local` file should look like this:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=https_://xxxxxx.supabase.co
    NEXT_PUBLIC_SUPABASE_ANON_KEY=eyxxxxxx...
    ```

4.  **Set Up the Database Schema**
    * Navigate to the **SQL Editor** in your Supabase project dashboard.
    * Open and run the SQL files located in the `/scripts` directory of this project. Execute them one by one to set up the necessary tables, functions, and row-level security policies.

---

## 🏃 Usage

Once the setup is complete, you can run the application.

* **To run the development server:**
    ```sh
    pnpm dev
    ```
    Open your browser and visit **[http://localhost:3000](http://localhost:3000)**.

* **To build the application for production:**
    ```sh
    pnpm build
    ```

* **To run the production build locally:**
    ```sh
    pnpm start
    ```

---

## 📁 Project Structure

Here is a high-level overview of the project's directory structure: