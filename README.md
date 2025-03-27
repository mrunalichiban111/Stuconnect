# This guide will help you set up the project locally.

## Prerequisites

Before you begin, ensure you have the following installed:
- Git
- Node.js (recommended version 18.x or later)
- npm (Node Package Manager)
- A GitHub account

## 1. Fork the Repository

1. Navigate to the project repository on GitHub
2. Click the "Fork" button in the top-right corner of the page
   - This creates a copy of the repository in your GitHub account
3. Choose your personal account as the destination for the fork

## 2. Clone Your Forked Repository

```bash
# Replace <your-username> with your GitHub username
git clone https://github.com/<your-username>/stuconnect.git

# Navigate to the project directory
cd stuconnect
```

## 3. Backend Setup

### 3.1 Environment Configuration

Navigate to the backend directory:

```bash
cd backend
```

Create a `.env` file with the following content:

```env
MONGODB_URI=
DB_NAME=
PORT=
CORS_ORIGIN=

ACCESS_TOKEN_SECRET=
ACCESS_TOKEN_EXPIRY=
REFRESH_TOKEN_SECRET=
REFRESH_TOKEN_EXPIRY=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=   
CLOUDINARY_API_SECRET= 

LIVEKIT_URL=
LIVEKIT_API_KEY=
LIVEKIT_API_SECRET=

PINECONE_API_KEY=
HUGGINGFACEHUB_API_KEY=
PINECONE_INDEX=test
```

> **Note:** Go to https://docs.google.com/document/d/1GPEOXWV55sHhedJVsLoCnUTZYE9Y_oQbZ2PV_hatIw8/edit?usp=sharing for .env file.

### 3.2 Install Backend Dependencies

```bash
# Install required npm packages
npm install
```

## 4. Frontend Setup

### 4.1 Environment Configuration

Navigate to the frontend directory:

```bash
cd ../frontend
```

Create a `.env` file with the following content:

```env
VITE_BACKEND_URL=
VITE_LIVEKIT_URL=
VITE_OPENAI_API_KEY=
```

> **Note:** Go to https://docs.google.com/document/d/1GPEOXWV55sHhedJVsLoCnUTZYE9Y_oQbZ2PV_hatIw8/edit?usp=sharing for .env file.

### 4.2 Install Frontend Dependencies

```bash
# Install required npm packages
npm install
```

## 5. Running the Application

### 5.1 Start Backend Server

```bash
# From the backend directory
cd backend
npm run build
npm run start
```

### 5.2 Start Frontend Development Server

```bash
# From the frontend directory
cd ../frontend
npm run dev
```

## 6. Accessing the Application

- Backend will typically run on `http://localhost:8000`
- Frontend will typically run on `http://localhost:5173`
- Register using email and password 
- Create a new server using top left button

## 7. Contributing

1. Create a new branch for your feature
   ```bash
   git checkout -b feature/your-roll-no
   ```
2. Make your changes
3. Commit your changes
   ```bash
   git commit -m "Description of your changes"
   ```
4. Push to your fork
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a Pull Request from your fork to the original repository

