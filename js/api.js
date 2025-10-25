// js/api.js
const API_BASE_URL = "http://localhost:5000"; //Your backend base URL

// ========== AUTH ==========

// Login user
async function LoginUser(email, password) {
    const response = await fetch(`${API_BASE_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });
    return response.json();
}

// Signup user
async function signupUser(name, email, password) {
    const response = await fetch(`s{API_BASE_URL}/api/users/signup`, {
        method: "POST",
        headers: {"Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
    });
    return response.json();
}

// ==========CRYPTO ==========
//Get crypto prices
async function getCryptoPrices() {
    const response = await fetch(`${API_BASE_URL}/api/crypto/prices`);
    return response.json();
}

//Buy Crypto
async function buyCrypto(amount, coinType) {
    const response = await fetch(`${API_BASE_URL}/api/crypto/buy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({amount, coinType})
    });
    return response.json();
}

//Sell crypto
async function sellCrypto(amount, coinType) {
    const response = await fetch(`${API_BASE_URL}/api/crypto/sell`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({amount, coinType})
    });
    return response.json();
}

// View wallet
async function getWallet() {
    const response = await fetch(`${API_BASE_URL}/api/crypto/wallet`, {
        method: "GET",
        headers: { "Content-Type": "application/json"}
    });

    if (!response.ok) {
        throw new Error("Failed to load wallet data");
    }
    return response.json();
}