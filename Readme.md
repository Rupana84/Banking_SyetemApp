#  Banking System App  
A simple but modern **ATM Simulation** built with:

-  **Frontend**: HTML, CSS, JavaScript (localStorage-based accounts)
-  **Backend Simulation (Console)**: C++ version of the ATM logic
-  Login, logout, register, deposit, withdraw, and balance check (all stored locally)

This project demonstrates **OOP, input validation, UI design, and basic authentication logic** for learning and portfolio use.

---

##  Project Structure

Banking_SyetemApp/
│
├── frontend/          # Web-based ATM with UI
│   ├── index.html
│   ├── style.css
│   └── app.js
│
├── cpp-atm/           # C++ console ATM application
│   └── main.cpp
│
└── README.md          # Documentation

---

#  Frontend (HTML/CSS/JS)

The frontend provides a clean, modern interface for:

### ✔ Register  
Create a new user stored in localStorage.

### ✔ Login  
Login using your saved username & password.

### ✔ Deposit  
Add money to your balance (validated input, UI modal).

### ✔ Withdraw  
Safely withdraw money, preventing overdraft.

### ✔ Show Balance  
Real-time UI update.

### ✔ Logout  
Returns to login page and clears session.

---

##  Run the Frontend

You can run it with:

### Option 1: Live Server (VS Code)
1. Install the **Live Server** extension  
2. Right-click `index.html` → **Open with Live Server**

### Option 2: Simple HTTP server (terminal)
cd frontend

python3 -m http.server 5500

Open:http://localhost:5500

---

#  C++ ATM Console Application

The `main.cpp` in `cpp-atm/` implements the same logic but in **C++**, demonstrating:

### ✔ Functions  
- showBalance()  
- deposit()  
- withdraw()  
- getValidAmount()  

### ✔ Input validation  
Prevents letters, symbols, invalid numbers.

### ✔ Loop-based ATM menu  
Interactive terminal program.

---

## ▶ Run the C++ Version

### macOS / Linux / Windows (MinGW):

g++ main.cpp -o atm
./atm

CLion users can simply open the folder and run using the IDE.

---

#  Features Compared

| Feature        | Frontend (JS) | C++ Console |
|----------------|---------------|--------------|
| Login/Register | ✔ Yes         | ✔ Yes (simplified) |
| Local storage  | ✔ Yes         | ✔ Yes (in-memory) |
| Deposit        | ✔ Yes         | ✔ Yes |
| Withdraw       | ✔ Yes         | ✔ Yes |
| UI/HTML        | ✔ Yes         | ❌ |
| Error handling | ✔ Modern UI   | ✔ Console messages |

---

#  Purpose of This Project

This application was built to demonstrate:

-  Full-stack thinking (UI + logic)
-  Clean architecture (two implementations)
-  Input validation techniques
-  Local storage / in-memory storage
-  Frontend design and UX
-  Classic console programming (C++)

It serves as a strong portfolio item showing both **frontend** and **backend logic** using two different languages.

---

#  Screenshots

![Image 2025-11-15 at 23 34](https://github.com/user-attachments/assets/7c35a0cd-bca0-44bf-9140-f122c8410ab8)


![Image 2025-11-15 at 23 37](https://github.com/user-attachments/assets/7300d6f7-b14d-46e4-a68e-7f9a231213f6)



---

#  License  
This project is free to use for learning and portfolio purposes.

---

#  Author  
**Gurpreet Singh Rupana**  
Software Developer — Sweden  
GitHub: https://github.com/Rupana84  

---

#  Contributions  
Pull requests are welcome.
