
🍯 HoneyChain — Frontend
HoneyChain is a modern web-based platform designed to support honey traceability and management through a connected digital workflow.

This repository contains the frontend application of HoneyChain. The frontend provides the user interface for authentication, honey-chain management, dashboard monitoring, farm and hive management, batch tracking, history, fraud/authenticity checks, blockchain-related records, and honey passport information.

The frontend is built with React, Vite, Tailwind CSS, React Router, Lucide React, and Three.js / React Three Fiber.

📌 Project Overview
The HoneyChain frontend provides a responsive interface for users to interact with the HoneyChain platform.

Public Interface
Home page

About page

Login

Registration

Theme switching

HoneyChain branding and visual presentation

Dashboard Interface
After authentication, users can access the dashboard and manage HoneyChain data through different sections:

Dashboard overview

Farm management

Hive management

Batch management

Alerts and history

Training resources

Fraud/authenticity information

Blockchain records

Honey passport information

User profile

Logout

✨ Features
🌐 Public Website
Home
The Home page introduces the HoneyChain platform with a dedicated visual presentation and honey-themed interface.

About
Provides information about the HoneyChain platform and its purpose.

Authentication
The frontend provides:

User login

User registration

Authentication state handling

Protected dashboard access

Logout functionality

📊 Dashboard
The authenticated dashboard provides a centralized interface for managing and monitoring HoneyChain information.

Dashboard Overview
The dashboard provides an overview of available platform information including:

Farms

Hives

Alerts

Honey-related statistics

Yield information

Quick actions

The dashboard layout is responsive and adapts to different screen sizes.

🌱 Farm Management
The Farms section allows authenticated users to work with farm information.

The interface supports:

Viewing farms

Creating farms

Viewing farm details

Viewing associated hives

Viewing farm information

Yield estimation interface

🐝 Hive Management
The Hives section provides functionality for managing beehives associated with farms.

The interface supports:

Viewing hives

Creating hives

Selecting an associated farm

Selecting hive type

Viewing hive information

Viewing hive details

📦 Batch Management
The Batches section provides an interface for managing honey batches.

The frontend supports:

Viewing batches

Filtering batches by farm

Creating batches

Viewing batch details

Displaying batch information

Working with batch-related records

The interface includes responsive desktop and mobile layouts.

🚨 Alerts & History
The dashboard provides alert and history interfaces for monitoring platform activity.

The history interface separates information into:

Open alerts

Resolved alerts

Farm-related alerts

Hive-related alerts

All alerts

Alerts can be reviewed through the dashboard interface.

📚 Training
HoneyChain includes a training section containing learning materials related to the platform and honey management workflow.

🛡️ Fraud & Authenticity
The frontend contains an authenticity/fraud-related dashboard section.

This section provides an interface for displaying:

Batch authenticity information

Risk indicators

Quantity information

Chain-related information

Authenticity status

⛓️ Blockchain
The Blockchain section provides a visual representation of the honey traceability process.

The interface represents different stages of the chain, including:

Farm Origin

Hive Information

Honey Collection

Processing

Distribution

On-Chain Record

The interface visually distinguishes completed and pending stages.

🪪 Honey Passport
The Honey Passport section provides a detailed view for honey batch/passport information.

It is designed to present traceability information in a structured format.

🎨 UI & Design
HoneyChain uses a custom visual design focused on:

Honey-inspired gold colors

Dark and light themes

Minimal interfaces

Responsive layouts

Card-based dashboard sections

Clear status indicators

Lucide icons

Honey-themed visual elements

Interactive dashboard components

The interface uses Tailwind CSS for styling.

🌗 Theme Support
HoneyChain supports both:

Light mode

Dark mode

The theme can be switched through the application's theme controls.

The interface uses custom HoneyChain colors including gold, black, cream, muted gray, orange, and yellow tones.

🧩 Technology Stack
Technology	Purpose
React	Frontend UI development
Vite	Development server and build tool
Tailwind CSS	Styling and responsive UI
React Router	Application routing
Lucide React	UI icons
Three.js	3D graphics
React Three Fiber	React integration for Three.js
React Three Drei	Three.js helper components
ESLint	Code quality and linting
🏗️ Frontend Architecture
The frontend follows a component-based React architecture.

frontend/
│
├── public/
│
├── src/
│   │
│   ├── assets/
│   ├── components/
│   ├── context/
│   ├── pages/
│   ├── services/
│   ├── App.jsx
│   └── main.jsx
│
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
└── vite.config.js
📂 Source Structure
src/assets/
Contains frontend assets used by the application, including HoneyChain visual resources.

src/components/
Contains reusable React components used throughout the application.

Examples include:

Layout components

Dashboard UI components

Honey visual components

Forms

Cards

Status components

Modal/detail components

src/context/
Contains React context used for shared application state, including theme-related functionality.

src/pages/
Contains the main application pages and dashboard sections.

Home
About
Login
Register
Dashboard
Farms
Hives
Batches
History
Training
Fraud
Blockchain
Passport
src/services/
Contains frontend service functions responsible for communicating with application APIs and handling frontend service logic.

Examples include authentication and dashboard-related service operations.

🔐 Authentication Flow
The frontend provides an authentication-based dashboard workflow.

User
  │
  ▼
Login / Register
  │
  ▼
Authentication
  │
  ▼
Authenticated Dashboard
  │
  ├── Farms
  ├── Hives
  ├── Batches
  ├── History
  ├── Fraud
  ├── Blockchain
  └── Passport
The authenticated dashboard also provides profile information and logout functionality.

🔌 API Integration
The frontend communicates with the HoneyChain backend through service functions.

React Frontend
      │
      │ HTTP Requests
      ▼
HoneyChain Backend
      │
      ├── Database
      ├── ML Services
      └── Other Platform Services
The frontend is responsible primarily for:

User interaction

Data presentation

Form submission

Dashboard navigation

API request handling

Loading/error states

Responsive UI

Backend and machine-learning processing are maintained separately from this frontend project.

📱 Responsive Design
The frontend is designed to work across different screen sizes.

Responsive layouts are used for:

Navigation

Dashboard cards

Forms

Farm lists

Hive lists

Batch lists

Alerts

Detail views

Dashboard sidebar

🚀 Getting Started
Prerequisites
Make sure the following are installed:

Node.js

npm

Git

Verify your installation:

node --version
npm --version
📥 Installation
Clone the repository:

git clone https://github.com/Sandipsen877/honey_chain_project.git
Navigate to the frontend:

cd honey_chain_project/frontend
Install dependencies:

npm install
▶️ Run the Development Server
Start the Vite development server:

npm run dev
Vite will provide a local development URL in the terminal.

Open that URL in your browser.

🏗️ Production Build
Create a production build:

npm run build
The production files will be generated in:

frontend/dist/
🔍 Preview Production Build
After building the project:

npm run preview
🧹 Linting
Run ESLint:

npm run lint
📦 Available Scripts
Command	Description
npm run dev	Start Vite development server
npm run build	Create production build
npm run lint	Run ESLint
npm run preview	Preview production build
🌐 Deployment
The frontend is a Vite-based React application and can be deployed to modern frontend hosting platforms such as Vercel.

For a production deployment:

npm install
npm run build
Then deploy the generated Vite application using the selected hosting provider.

🔗 Project Structure
HoneyChain is organized as a multi-service project:

honey_chain_project/
│
├── frontend/
│   └── React + Vite frontend
│
├── backend/
│   └── Backend/API services
│
├── honey_yield_ML/
│   └── Honey yield machine-learning component
│
└── ml_service/
    └── Machine-learning service
The frontend is responsible for the application's presentation and interaction layer.

🧠 Frontend Responsibilities
User Interface
     │
     ├── Authentication
     ├── Navigation
     ├── Dashboard
     ├── Forms
     ├── Data Display
     ├── Status Indicators
     ├── User Profile
     └── API Communication
Processing and backend operations are handled by the corresponding services outside the frontend.

🛠️ Development Workflow
1. Clone Repository
       ↓
2. Navigate to frontend
       ↓
3. Install Dependencies
       ↓
4. Configure Required Environment
       ↓
5. Start Vite Development Server
       ↓
6. Develop React Components
       ↓
7. Test Dashboard/API Integration
       ↓
8. Run ESLint
       ↓
9. Create Production Build
       ↓
10. Deploy
📸 Screenshots
Add application screenshots here.

Suggested screenshots:

screenshots/
├── home.png
├── about.png
├── login.png
├── register.png
├── dashboard.png
├── farms.png
├── hives.png
├── batches.png
└── passport.png
Example:

## Screenshots

### Home

![HoneyChain Home](screenshots/home.png)

### Dashboard

![HoneyChain Dashboard](screenshots/dashboard.png)

### Farm Management

![Farm Management](screenshots/farms.png)
🔮 Future Improvements
Potential future improvements may include:

Further dashboard analytics

Additional traceability visualizations

Improved data visualization

Improved mobile interactions

Additional blockchain integrations

More advanced yield insights

👨‍💻 Project
HoneyChain

Smart honey traceability and management platform.

Repository:https://github.com/Sandipsen877/honey_chain_project

📄 License

This project is currently maintained as part of the HoneyChain project repository.




