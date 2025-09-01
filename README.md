# 🧥 Fashion Oracle

Fashion Oracle is an AI-powered fashion recommendation and generation system.  
It analyzes user features (like skin tone, hair color, face shape, etc.) and suggests or generates matching outfits.  

---

## 🚀 Features
- Outfit recommendation system  
- Upper wear, lower wear, and full dress generation  
- Virtual try-on integration  
- Detectron2 + PyTorch based models  
- Django + React full-stack setup  

---

## 📂 Project Structure
Fashion-Oracle/
│── backend/ # Django backend
│── frontend/ # React frontend
│── models/ # Pre-trained or custom-trained models
│── requirements.txt
│── Dockerfile
│── README.md


---

## 🔗 Model Weights

Pre-trained models can be downloaded here:  
👉 [Google Drive Link](https://drive.google.com/your-model-link-here)

After downloading, place the files inside the `models/` folder.

---

## ⚙️ Installation

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/ahm3d-khanzada/Fashion-Oracle.git
cd Fashion-Oracle
```
### 2️⃣ Setup Python Environment
```bash
python3 -m venv venv
source venv/bin/activate   # On Linux/Mac
venv\Scripts\activate      # On Windows
pip install -r requirements.txt
```
### 3️⃣ Run Backend (Django)
```bash
python manage.py runserver
```
### 4️⃣ Run Frontend (React)
```bash
cd frontend
npm install
npm start
```


## 👨‍💻 Author

Developed by Ahmed Khanzada ✨
For queries, reach out via GitHub Issues.
