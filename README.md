# Finance Manager

A modern, simple finance management application built with FastAPI (Backend) and React (Frontend).

## Features

- **Dashboard**: View monthly income, expenses, and balance at a glance.
- **Transactions**: Add income and expense transactions with categories and descriptions.
- **Monthly Reports**: Visual breakdown of finances.
- **Download**: Export monthly reports as CSV files.
- **Responsive Design**: Built with Tailwind CSS for a clean, mobile-friendly UI.

## Tech Stack

- **Backend**: Python, FastAPI, SQLAlchemy, SQLite, Pandas
- **Frontend**: React, Vite, Tailwind CSS, Recharts, Axios

## Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/vvronline/Finance-manager.git
cd Finance-manager
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Create a virtual environment (optional but recommended):

```bash
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start the backend server:

```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`.

### 3. Frontend Setup

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The application will be running at `http://localhost:5173`.

## Usage

1.  Open your browser and go to `http://localhost:5173`.
2.  Use the "Add Transaction" form to log your income and expenses.
3.  View your transaction history in the list below.
4.  Check the dashboard cards for your current month's financial summary.
5.  Click "Download Report" to save your monthly data as a CSV file.

## License

This project is licensed under the MIT License.
