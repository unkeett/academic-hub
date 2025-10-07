# Full-Stack Academic Hub

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white) ![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white) ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

Academic Hub is a modern, all-in-one dashboard designed to help students and self-learners organize their studies, track progress, and manage goals in a beautiful and intuitive interface. This is a full-stack MERN (MongoDB, Express, React, Node.js) application.

---

## Project Overview

This project is built with a modern architecture, separating the client-side and server-side logic into two distinct parts within this repository:

-   **/frontend:** A responsive and interactive user interface built with React.
-   **/backend:** A robust RESTful API built with Node.js and Express, connected to a MongoDB database.

The two parts communicate via API requests, creating a powerful and scalable application.

`[Frontend (React)] <--- (API Requests) ---> [Backend (Node.js/Express)] <--- (Database Queries) ---> [MongoDB]`

---

## Features ✨

-   **Interactive Dashboard:** A visually appealing "glassmorphism" design with interactive hover effects and smooth animations.
-   **Full CRUD Functionality:** Create, Read, Update, and Delete subjects, weekly goals, and ideas seamlessly.
-   **Dynamic YouTube Tutorial Tracking:**
    -   Simply paste a YouTube video URL to add a new tutorial.
    -   The application automatically fetches the video's title, channel name, and duration using the YouTube Data API.
    -   Track your viewing progress with a visual progress bar and status updates (`Not Started`, `In Progress`, `Completed`).
-   **Persistent Data Storage:** All data is reliably stored in a MongoDB database, so your progress is always saved.
-   **Fully Responsive:** Designed to work beautifully on desktop, tablet, and mobile devices.
-   **Contributors List:** A dedicated file to officially acknowledge and display all project contributors. **(NEW!)**

---

## Tech Stack

### Frontend 💻

-   **Library:** [React.js](https://reactjs.org/)
-   **State Management:** React Hooks (`useState`, `useEffect`)
-   **Styling:** Custom CSS with CSS Variables for a modern, maintainable design system.
-   **HTTP Client:** Native `fetch` API for communicating with the backend.

### Backend ⚙️

-   **Runtime:** [Node.js](https://nodejs.org/)
-   **Framework:** [Express.js](https://expressjs.com/)
-   **Database:** [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/) ODM for data modeling.
-   **External API Client:** [Axios](https://axios-http.com/) for making requests to the YouTube Data API.
-   **Environment Variables:** [Dotenv](https://www.npmjs.com/package/dotenv) for managing secret keys.

---

## Getting Started: Running the Project Locally

To get the full application running on your local machine, you will need to start both the backend server and the frontend development server in separate terminals.

### Prerequisites ✅

-   [Git](https://git-scm.com/)
-   [Node.js](https://nodejs.org/en/download/) (v16 or higher recommended)
-   [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally, or a connection string from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
-   A **YouTube Data API Key** from the [Google Cloud Console](https://console.cloud.google.com/).

### Installation & Setup 🛠️

1.  **Clone the repository:**
    ```sh
    git clone [[https://github.com/unkeett/academic-hub.git](https://github.com/unkeett/academic-hub.git)]
    cd academic-hub
    ```

2.  **Set up the Backend:**
    -   Navigate into the backend directory:
        ```sh
        cd backend
        ```
    -   Install dependencies:
        ```sh
        npm install
        ```
    -   Create a **`.env`** file in the `/backend` folder and add your secret keys:
        ```env
        # Your MongoDB connection string (local or from Atlas)
        MONGO_URI=mongodb://localhost:27017/academicHubDb

        # Your YouTube Data API v3 Key
        YOUTUBE_API_KEY=AIzaSy...
        ```
    -   In its own terminal, start the backend server:
        ```sh
        node server.js
        ```
    -   Keep this terminal running. The server will be live at `http://localhost:5000`.

3.  **Set up the Frontend:**
    -   Open a **new, separate terminal window**.
    -   Navigate into the frontend directory from the project root:
        ```sh
        cd frontend
        ```
    -   Install dependencies:
        ```sh
        npm install
        ```
    -   Start the React development server:
        ```sh
        npm start
        ```
    -   Keep this second terminal running. Your application should open automatically at `http://localhost:3000`.

You should now have the full-stack application running and connected locally!

---

## 🤝 Contributing

We love contributions from everyone! 💖

### 🚩 Before You Start

⭐ **First, star the repository** — show some love to the project!
🍴 Then, fork it and start contributing 🚀

### Steps to Contribute 🧑‍💻

1. **Star** this repository ⭐
2. **Fork** the repo
3. Create a feature branch
   ```bash
   git checkout -b feature-xyz
   ```
4. Make your changes (e.g., bug fixes, new features).
5. **Add your name to the Contributors List:**
    - Open the **`contributors.json`** file in the project root.
    - Add a new JSON object for yourself, ensuring to fill out all four fields: `name`, `github`, `role`, and `avatar`.
    ```json
    {
      "name": "YOUR NAME",
      "github": "YOUR GITHUB URL",
      "role": "Contributor",
      "avatar": "YOUR GITHUB AVATAR URL"
    }
    ```
6. Commit your changes
   ```bash
   git commit -m "feat: add new xyz and update contributors list"
   ```
7. Push to your fork
   ```bash
   git push origin feature-xyz
   ```
8. Open a Pull Request 🚀

📌 Please read our [CONTRIBUTING.md](CONTRIBUTING.md) and [CODE\_OF\_CONDUCT.md](CODE\_OF\_CONDUCT.md) before contributing.

---

## 🎯 GSSoC'25 Contribution 🌟

This project proudly participates in **GirlScript Summer of Code '25**!

We welcome contributions from all GSSoC participants. Your accepted pull requests will count towards your GSSoC journey! 🎉

* Submit 6 PRs to win official swag 🎉

---

    👤 **Main Maintainer**

**Ankit kumar singh** – Creator & Maintainer 🚀

🔗 Connect With Me
[🔗 Follow on GitHub](https://github.com/unkeett) | [Connect on LinkedIn](https://www.linkedin.com/in/unkeet/)
---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## ⭐ Support

If you like this project:

* ⭐ Star the repo
* 🍴 Fork it
* 📢 Share it with friends

<p align="center">
  Made with ❤️ by <a href="https://github.com/unkeett">unkeett</a> & Contributors
</p>