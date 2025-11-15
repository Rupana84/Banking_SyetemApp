// ----- helpers for localStorage accounts -----

const STORAGE_KEY = "atm_demo_accounts";
const CURRENT_USER_KEY = "atm_demo_current_user";

function loadAccounts() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function saveAccounts(accounts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
}

function setCurrentUser(username) {
  if (!username) {
    localStorage.removeItem(CURRENT_USER_KEY);
  } else {
    localStorage.setItem(CURRENT_USER_KEY, username);
  }
}

function getCurrentUser() {
  return localStorage.getItem(CURRENT_USER_KEY);
}

// init demo account if none exists
(function ensureDemoAccount() {
  const accounts = loadAccounts();
  if (!accounts["demo"]) {
    accounts["demo"] = { pin: "1234", balance: 1500 };
    saveAccounts(accounts);
  }
})();

// ----- DOM refs -----

const authCard = document.getElementById("auth-card");
const atmCard = document.getElementById("atm-card");

const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const loginError = document.getElementById("login-error");
const registerError = document.getElementById("register-error");

const loginUsername = document.getElementById("login-username");
const loginPin = document.getElementById("login-pin");
const regUsername = document.getElementById("reg-username");
const regPin = document.getElementById("reg-pin");
const regBalance = document.getElementById("reg-balance");

const tabButtons = document.querySelectorAll(".tab-button");

const userNameSpan = document.getElementById("user-name");
const balanceSpan = document.getElementById("balance-amount");

const logoutBtn = document.getElementById("logout-btn");
const showBtn = document.getElementById("show-btn");
const depositBtn = document.getElementById("deposit-btn");
const withdrawBtn = document.getElementById("withdraw-btn");
const amountInput = document.getElementById("amount-input");
const atmError = document.getElementById("atm-error");
const atmSuccess = document.getElementById("atm-success");

// ----- UI switching -----

function showATM(username) {
  userNameSpan.textContent = username;
  updateBalanceDisplay(username);
  authCard.classList.add("hidden");
  atmCard.classList.remove("hidden");
  atmError.textContent = "";
  atmSuccess.textContent = "";
}

function showAuth() {
  authCard.classList.remove("hidden");
  atmCard.classList.add("hidden");
}

// Tabs (login/register)
tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    tabButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const tab = btn.dataset.tab;
    if (tab === "login") {
      loginForm.classList.remove("hidden");
      registerForm.classList.add("hidden");
    } else {
      loginForm.classList.add("hidden");
      registerForm.classList.remove("hidden");
    }
  });
});

// ----- load session if exists -----

const existingUser = getCurrentUser();
if (existingUser && loadAccounts()[existingUser]) {
  showATM(existingUser);
} else {
  showAuth();
}

// ----- login -----

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  loginError.textContent = "";

  const username = loginUsername.value.trim();
  const pin = loginPin.value.trim();

  const accounts = loadAccounts();
  const acc = accounts[username];

  if (!acc || acc.pin !== pin) {
    loginError.textContent = "Wrong username or PIN.";
    return;
  }

  setCurrentUser(username);
  showATM(username);
});

// ----- register -----

registerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  registerError.textContent = "";

  const username = regUsername.value.trim();
  const pin = regPin.value.trim();
  const startBalance = parseFloat(regBalance.value || "0");

  if (!username || !pin) {
    registerError.textContent = "Username and PIN are required.";
    return;
  }
  if (pin.length !== 4 || !/^\d+$/.test(pin)) {
    registerError.textContent = "PIN must be 4 digits.";
    return;
  }

  const accounts = loadAccounts();
  if (accounts[username]) {
    registerError.textContent = "Username is already taken.";
    return;
  }

  accounts[username] = {
    pin,
    balance: isNaN(startBalance) ? 0 : Math.max(0, startBalance),
  };
  saveAccounts(accounts);

  // auto login
  setCurrentUser(username);
  showATM(username);
});

// ----- ATM logic -----

function updateBalanceDisplay(username) {
  const accounts = loadAccounts();
  const acc = accounts[username];
  if (!acc) return;
  balanceSpan.textContent = acc.balance.toFixed(2);
}

function parseAmountFromInput() {
  atmError.textContent = "";
  atmSuccess.textContent = "";

  const raw = amountInput.value.trim();
  if (!raw) {
    atmError.textContent = "Please enter an amount first.";
    return null;
  }

  const amount = Number(raw);
  if (!Number.isFinite(amount) || amount <= 0) {
    atmError.textContent = "Amount must be a positive number.";
    return null;
  }
  return amount;
}

// show balance (just refresh)
showBtn.addEventListener("click", () => {
  const user = getCurrentUser();
  if (!user) return;
  updateBalanceDisplay(user);
  atmSuccess.textContent = "Balance updated.";
});

// deposit
depositBtn.addEventListener("click", () => {
  const user = getCurrentUser();
  if (!user) return;

  const amount = parseAmountFromInput();
  if (amount === null) return;

  const accounts = loadAccounts();
  accounts[user].balance += amount;
  saveAccounts(accounts);

  updateBalanceDisplay(user);
  atmSuccess.textContent = `Deposited ${amount.toFixed(2)} SEK.`;
  amountInput.value = "";
});

// withdraw
withdrawBtn.addEventListener("click", () => {
  const user = getCurrentUser();
  if (!user) return;

  const amount = parseAmountFromInput();
  if (amount === null) return;

  const accounts = loadAccounts();
  const acc = accounts[user];

  if (amount > acc.balance) {
    atmError.textContent = "Insufficient balance.";
    return;
  }

  acc.balance -= amount;
  saveAccounts(accounts);

  updateBalanceDisplay(user);
  atmSuccess.textContent = `Withdrew ${amount.toFixed(2)} SEK.`;
  amountInput.value = "";
});

// logout
logoutBtn.addEventListener("click", () => {
  setCurrentUser(null);
  showAuth();
});