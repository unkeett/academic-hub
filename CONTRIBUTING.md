# 🤝 Contributing Guide
Thank you for your interest in improving Academic Hub! Your help is valued — whether you contribute code, documentation, designs, or ideas. This guide explains how to get started, what we expect from contributors, and how to make your first PR successful.

## 🧭 Quick overview
Fork the repo, create a branch, make small focused changes, and open a PR.

See GOOD_FIRST_ISSUES.md for bite-sized tasks.

Read our CODE_OF_CONDUCT.md and follow it.

## 🍴 How to contribute (step-by-step)
1) Fork the repository
Click the Fork button in the top-right of the repository page.

2) Clone your fork
Bash

# HTTPS
git clone https://github.com/unkeett/academic-hub.git
cd academic-hub

# or SSH
git clone git@github.com:unkeett/academic-hub.git
cd academic-hub
3) Create a feature branch
Always create a branch for your work:

Bash

git checkout -b feat/short-description
# or
git checkout -b fix/short-description
4) Make changes and commit
Keep changes focused (one feature/fix per PR).

Follow the existing code style.

Use sensible commit messages (imperative tense):

Bash

git add .
git commit -m "feat(notes): add search functionality"
5) Test locally
Run the project locally to ensure nothing broke:

Bash
cd frontend
npm run start
cd backend
node server.js

6) Push your branch and open a PR
Bash

git push -u origin feat/short-description
Go to GitHub → your fork → Compare & pull request → pick the upstream main as the base and write a clear description.

## 🚀 Getting Started
Follow these steps to set up and run the project on your local machine.

1. Backend Server
The backend is a Node.js/Express API that connects to MongoDB.
Navigate to the backend directory:

cd backend
Install dependencies:
pnpm install      # or npm install

Create environment file: Create a new file named .env in the /backend directory. Add your secret keys as shown below. This file should not be committed to Git.

Code snippet

# backend/.env
MONGO_URI=<yourmongodburl>
YOUTUBE_API_KEY=YOUR_YOUTUBE_API_KEY_HERE

Start the dev server:
node server.js
The API will now be running at http://localhost:5000.

2. Frontend Application
The frontend is a React application created with Create React App.
Navigate to the frontend directory:

cd frontend
Install dependencies:

pnpm install      # or npm install
Start the dev server:
pnpm start        # or npm start
The application will open in your browser at http://localhost:3000.

## 4️⃣ Additional Notes for Forkers

MongoDB: Either install locally or use Atlas. Make sure MONGO_URI in .env points to the right DB.

YouTube API: Required for tutorial tracking; add YOUTUBE_API_KEY in .env.

Ports: Backend defaults to 5000, frontend defaults to 3000.

## ✅ Pull request checklist (what we expect in a good PR)
[ ] PR has a clear title and description explaining why the change is needed.

[ ] Changes are small and focused.

[ ] Code compiles and runs without errors.

[ ] Added or updated documentation when applicable.

[ ] All tests (if any) pass locally.

[ ] No sensitive information (API keys, passwords) committed.

## 💡 What you can work on (ideas & good first issues)
Add a new resource (e.g., a link, a PDF, or notes) to an existing subject.

Improve the UI for displaying course materials.

Fix a typo in the documentation or a resource description.

Implement a search or filter functionality for resources.

Improve landing page accessibility (ARIA, alt text).

Check GOOD_FIRST_ISSUES.md for more specific tasks with file pointers.

## 🧾 Issue & PR templates (examples)
Issue template (short)

Title: [bug|feature] Short description

## Describe the bug / feature
Steps to reproduce / expected behavior

## Environment
- OS:
- Browser:
- Node:

## Additional context
PR template

Markdown

## What does this PR do?
Short description of changes.

## Motivation
Why is this change needed?

## How to test
Steps to verify the change.

## Checklist
- [ ] I followed the contributing guide
- [ ] Tests added (if applicable)
- [ ] Documentation updated

Start dev server: pnpm dev (or npm run dev).

If you prefer Docker or have a local database, include instructions in README.md.

🧑‍⚖️ Code style & commit conventions
Use TypeScript for new code where possible.

Keep formatting consistent (Prettier recommended).

Commit messages: use conventional-ish format e.g. feat:, fix:, docs:.

👩‍🏫 Reviewing process & maintainers
Maintainers will review PRs and request changes if needed.

Be responsive to review comments — small changes help fast merges.

If maintainers agree a PR is valid but cannot merge, they may tag it hacktoberfest-accepted.

🛡 Security & sensitive data
Never add secrets, passwords, or private keys to the repo.

If you discover a security issue, contact the maintainers privately (see SECURITY.md if present).

📬 Contact & support
Open an issue for help or discussion.

Join repository Discussions (if enabled) for broader conversation.

Thanks for contributing to Academic Hub — your work helps the whole community grow! 🚀
