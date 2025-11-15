#include <iostream>
#include <iomanip>
#include <limits>
#include <string>
#include <vector>
#include <cctype>

using namespace std;

// ------------------ Account model ------------------

struct Account {
    string username;
    string pin;      // 4-digit PIN as string
    double balance;  // in SEK
};

// ------------------ Helper functions ------------------

// Trim newline etc. after using operator>>
void clearLine() {
    cin.ignore(numeric_limits<streamsize>::max(), '\n');
}

// Read a non-empty line from cin
string readLine(const string& prompt) {
    cout << prompt;
    string s;
    getline(cin, s);
    return s;
}

// Validate and read a 4-digit PIN
string readPin(const string& prompt) {
    while (true) {
        string pin = readLine(prompt);

        if (pin.size() != 4) {
            cout << "PIN must be exactly 4 digits.\n";
            continue;
        }
        bool ok = true;
        for (char c : pin) {
            if (!isdigit(static_cast<unsigned char>(c))) {
                ok = false;
                break;
            }
        }
        if (!ok) {
            cout << "PIN must contain digits only.\n";
            continue;
        }
        return pin;
    }
}

// Read a positive money amount (like your previous getValidAmount)
double readAmount(const string& prompt) {
    while (true) {
        cout << prompt;
        string input;
        getline(cin, input);

        if (input.empty()) {
            cout << "Amount cannot be empty.\n";
            continue;
        }

        bool valid = true;
        int dotCount = 0;

        for (char c : input) {
            if (c == '.') {
                dotCount++;
                if (dotCount > 1) {
                    valid = false;
                    break;
                }
            } else if (!isdigit(static_cast<unsigned char>(c))) {
                valid = false;
                break;
            }
        }

        if (!valid) {
            cout << "Invalid amount, use digits and at most one dot.\n";
            continue;
        }

        try {
            double value = stod(input);
            if (value <= 0) {
                cout << "Amount must be positive.\n";
                continue;
            }
            return value;
        } catch (...) {
            cout << "Invalid amount format.\n";
        }
    }
}

// ------------------ Account storage ------------------

int findAccountIndex(const vector<Account>& accounts,
                     const string& username) {
    for (size_t i = 0; i < accounts.size(); ++i) {
        if (accounts[i].username == username) return static_cast<int>(i);
    }
    return -1;
}

// ------------------ Menus ------------------

void showWelcomeMenu() {
    cout << "\n=========== ATM Console Demo ==========\n";
    cout << "1) Register new account\n";
    cout << "2) Login\n";
    cout << "0) Exit\n";
    cout << "---------------------------------------\n";
    cout << "> ";
}

void showAtmMenu(const Account& acc) {
    cout << "\n----------- ATM for " << acc.username << " -----------\n";
    cout << "1) Show balance\n";
    cout << "2) Deposit\n";
    cout << "3) Withdraw\n";
    cout << "4) Logout\n";
    cout << "---------------------------------------\n";
    cout << "> ";
}

// ------------------ ATM operations ------------------

void showBalance(const Account& acc) {
    cout << fixed << setprecision(2);
    cout << "Current balance: " << acc.balance << " SEK\n";
}

void deposit(Account& acc) {
    double amount = readAmount("Enter amount to deposit (SEK): ");
    acc.balance += amount;
    cout << "Deposited " << amount << " SEK.\n";
    showBalance(acc);
}

void withdraw(Account& acc) {
    if (acc.balance <= 0) {
        cout << "Insufficient funds.\n";
        return;
    }

    double amount = readAmount("Enter amount to withdraw (SEK): ");
    if (amount > acc.balance) {
        cout << "Insufficient funds. You only have "
             << fixed << setprecision(2) << acc.balance << " SEK.\n";
        return;
    }

    acc.balance -= amount;
    cout << "Withdrew " << amount << " SEK.\n";
    showBalance(acc);
}

// Logged-in session
void atmSession(Account& acc) {
    while (true) {
        showAtmMenu(acc);
        int choice;
        if (!(cin >> choice)) {
            cin.clear();
            clearLine();
            cout << "Please enter a number.\n";
            continue;
        }
        clearLine();

        switch (choice) {
            case 1:
                showBalance(acc);
                break;
            case 2:
                deposit(acc);
                break;
            case 3:
                withdraw(acc);
                break;
            case 4:
                cout << "Logging out...\n";
                return;
            default:
                cout << "Invalid choice (1-4).\n";
        }
    }
}

// ------------------ Main ------------------

int main() {
    cout << fixed << setprecision(2);

    vector<Account> accounts;

    // Demo default user, similar to frontend:
    accounts.push_back(Account{ "user", "1234", 1500.0 });

    while (true) {
        showWelcomeMenu();
        int choice;
        if (!(cin >> choice)) {
            cin.clear();
            clearLine();
            cout << "Please enter a number.\n";
            continue;
        }
        clearLine();

        if (choice == 0) {
            cout << "Goodbye!\n";
            break;
        }

        if (choice == 1) {
            // Register
            string username = readLine("Choose username: ");
            if (username.empty()) {
                cout << "Username cannot be empty.\n";
                continue;
            }
            if (findAccountIndex(accounts, username) != -1) {
                cout << "Username already taken.\n";
                continue;
            }

            string pin = readPin("Choose a 4-digit PIN: ");
            double initial = readAmount("Initial deposit (SEK): ");

            accounts.push_back(Account{ username, pin, initial });
            cout << "Account created for '" << username << "'.\n";

        } else if (choice == 2) {
            // Login
            string username = readLine("Username: ");
            string pin = readPin("PIN: ");

            int idx = findAccountIndex(accounts, username);
            if (idx == -1 || accounts[idx].pin != pin) {
                cout << "Wrong username or PIN.\n";
                continue;
            }

            cout << "Welcome, " << accounts[idx].username << "!\n";
            atmSession(accounts[idx]);

        } else {
            cout << "Invalid choice. Use 0, 1, or 2.\n";
        }
    }

    return 0;
}