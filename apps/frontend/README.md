# OpenFile

**OpenFile** is a secure and ecnrypted file reciever/sharing service. with help of openfile you can generate a link and  share to any anonymous person and that person can send you files anonymously.

---

## Features

* Files gets encrypted before sending.
* Upload and download files securely
* Pagination for efficient file browsing
*  Fast decryption in-browser (no server-side decryption)
* Token-based access for shared links
* Built with modern stack: React, TailwindCSS, Bun, Prisma, and PostgreSQL

---

## Tech Stack

* **Frontend:** React, TailwindCSS, React Router
* **Backend:** Bun, Prisma, PostgreSQL , Redis
* **Encryption:** Web Crypto API (AES-GCM)
* **Deployment:** Frontend on Vercel, Backend on Render

---

##  Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/pradeepbgs/openfile-frontend.git
cd openfile-frontend
```

### 2. Set up the Backend

```bash
bun install
cp .env.example .env
# update .env with your database and JWT secrets
bun dev
```

---

##  Security Design

* Files are encrypted **in the browser** before being uploaded.
* The encryption key and IV are included in the URL hash (not sent to the server).
* Even the server can't decrypt user files.

---


## Feedback / Support

If you encounter bugs, have suggestions, or want to contribute:

* Open an issue
* Submit a pull request
* Or reach out via email/DM

---

## Donate us
* Buy me a coffee 
     https://buymeacoffee.com/pradeepsahu


## ❤️ Acknowledgements

* Inspired by services like Firefox Send & Wormhole
* Thanks to open-source libraries and contributors

---

## 📜 License

MIT License © 2025 Pradeep Sahu
