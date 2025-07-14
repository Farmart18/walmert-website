# Walmart Finalized Batches Notification App

This project is a React + TypeScript + Vite web application for managing and displaying finalized crop batches and notifications, using Supabase as the backend.

## Features
- **User Authentication** (via Supabase)
- **Notification System**: Post, view, and delete notifications
- **Finalized Batches Display**: Fetches and displays finalized batches from Supabase in card format
- **Material UI** for modern, responsive design

## Getting Started

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd walmert-website
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Variables
Create a `.env` file in the root directory with the following variables:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```
You can find these in your [Supabase project settings](https://app.supabase.com/).

### 4. Run the Development Server
```bash
npm run dev
# or
yarn dev
```
Visit [http://localhost:5173](http://localhost:5173) to view the app.

### 5. Build for Production
```bash
npm run build
# or
yarn build
```

## Supabase Table Structure

### `batch` Table
| Column           | Type      | Description                |
|------------------|-----------|----------------------------|
| id               | uuid      | Primary key                |
| crop_type        | text      | Crop type                  |
| variety          | text      | Crop variety               |
| sowing_date      | date      | Sowing date                |
| notes            | text      | Notes                      |
| is_finalized     | bool      | Whether batch is finalized |
| blockchain_hash  | text      | Blockchain hash            |
| farmer_id        | uuid      | Farmer reference           |
| created_at       | timestamptz | Creation timestamp      |

Only batches with `is_finalized = true` are shown on the home screen as cards.

## Project Structure
- `src/components/BatchCard.tsx`: Displays a finalized batch as a card
- `src/App.tsx`: Main app logic, fetches notifications and batches
- `src/components/Notification*`: Notification UI components

