## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone <repository-url>
cd <repository-folder>
```

---

## 🖥️ Frontend Setup

1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```

2. Install the required dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The React app will be available at [http://localhost:3000](http://localhost:3000).

---

## 🖥️ Backend Setup

1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m virtualenv --python=python3.11 hireenv
   ```

3. Activate the virtual environment:
   - On Windows:
     ```bash
     .\hireenv\Scripts\activate
     ```
   - On macOS/Linux:
     ```bash
     source hireenv/bin/activate
     ```

4. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Run the FastAPI server:
   ```bash
   uvicorn app:app --reload
   ```

The backend will be available at [http://localhost:8000](http://localhost:8000).

---

## 📂 Project Structure

- **frontend**: Contains the React application for the user interface.
- **backend**: Contains the FastAPI application for the backend logic.

---
