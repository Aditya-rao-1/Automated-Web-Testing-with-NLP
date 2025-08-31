# 🚗 Car Rental Automation Tool
![App Screenshot](https://drive.google.com/uc?export=view&id=1DVj7emQXZzttHwcWsYFyenKlYPND1aZv)

---
![Screenshot](https://drive.google.com/uc?export=view&id=1kmdlJrymZyiBslEU-OPGmAI990l_2Adh)


A **full-stack testing assistant** that lets you automate testing of a car rental demo website with **natural language commands** like:

- “Search for BMW cars”  
- “Fill booking form for Van from Aug 1 to Aug 7”  
- “Check SUV pricing”  
- “Test contact links”  
- Dashboard with natural language input:
  
---
Behind the scenes, it uses:  
- 🧠 **Ollama (LLM)** to translate user prompts → structured JSON test instructions  
- 🎭 **Playwright** to drive a browser and execute actions  
- 🖼️ **Pillow** for screenshot resizing & encoding  
- ⚡ **Flask + React** for backend + frontend dashboard  

---

## 📸 Screenshots of outputs



- Parsed model output & instructions:
  
  ![App Screenshot](https://drive.google.com/uc?export=view&id=12EhbIIoP6ph0cr8iE1rsI8hwllwRLO-W)

- Booking form filled automatically:
  
  ![App Screenshot](https://drive.google.com/uc?export=view&id=1rUahIszSUaLiuX3XmmLJvEO6wtx2V9C5)

---

## 🗂 Project Structure

```

.
├── backend/
│   ├── .env                 # Environment variables
│   ├── app.py               # Flask backend (API + Playwright automation)
│   └── requirements.txt     # Python dependencies
│
└── frontend/
├── public/              # Static assets
└── src/
├── components/      # Reusable UI components
├── constants/
├── pages/
│   ├── Home.jsx
│   └── WebTester.jsx
├── sections/
├── App.jsx
├── index.css
└── main.jsx

````

---

## ⚙️ Setup Instructions

### 1. Backend (Flask + Playwright)

```bash
cd backend
python -m venv venv
venv\Scripts\activate

pip install -r requirements.txt
````

Install Playwright browsers:

```bash
playwright install
```

Create `.env` file:

```ini
OLLAMA_MODEL=tinyllama
HEADLESS=false
TARGET_URL=https://automationdemo.vercel.app/
HISTORY_LIMIT=50
```

Run backend:

```bash
python app.py
```

Backend runs on [http://localhost:5000](http://localhost:5000).

---

### 2. Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on [http://localhost:5173](http://localhost:5173).

---

## 🚀 Usage

1. Open the frontend dashboard.
2. Type any **natural language command** like:

   * `search for BMW car`
   * `fill booking form for Van`
   * `check SUV pricing`
3. The backend:

   * Calls **Ollama** to parse intent → JSON
   * Uses **Playwright** to run browser automation
   * Captures **screenshots** of results
4. Watch results, raw model output, parsed actions, and screenshots in the UI.

---

## 🔧 Features

* ✅ Natural language → JSON instructions
* ✅ Automated browser testing with screenshots
* ✅ View parsed vs raw LLM output
* ✅ Quick-actions for common tests
* ✅ History of previous automation runs
* ✅ Direct custom form filler

---

## 📦 Tech Stack

* **Frontend**: React + Vite + Tailwind + Lucide Icons
* **Backend**: Flask + Playwright + Pillow
* **AI/LLM**: Ollama (tinyllama by default)
* **Other**: Flask-CORS, Subprocess JSON parsing

---

## 🛠 Example Commands

* 🔍 `search for BMW car`
* 📋 `fill booking form for Van`
* 💰 `check SUV pricing`
* 🚙 `check luxury car details`
* 📞 `test contact links`
* ✅ `submit booking`
* 🔄 `reset form`
* ⚠️ `validate empty form`

---


## 🧑‍💻 Author

**Adithya rao**  
[GitHub](https://github.com/Aditya-rao-1) • [LinkedIn](https://www.linkedin.com/in/aditya-rao-7044a3317/) • [Portfolio](https://adi-portfolio-beta.vercel.app/) 


