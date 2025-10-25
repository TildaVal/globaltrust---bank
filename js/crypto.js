/*console.log("Crypto-Banking.js is linked correctly!");
// Simulated crypto trade execution
document.getElementById("tradeForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const action = document.getElementById("cryptoAction").value;
  const crypto = document.getElementById("cryptoType").value;
  const amount = document.getElementById("amount").value;
  const currency = document.getElementById("currency").value;

  document.getElementById(
    "tradeResult"
  ).innerText = `✅ Successfully placed a ${action.toUpperCase()} order of ${amount} ${crypto} in ${currency}.`;
  this.reset();
});

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const wallet = await getWallet(); // calling the backend API

    // Update wallet balance in your dashboard
    document.getElementById(
      "wallet-balance"
    ).textContent = `$${wallet.balance.toLocaleString()}`;

    // Populate recent transactions
    const tbody = document.getElementById("transaction-body");
    tbody.innerHTML = ""; // clear any demo rows

    wallet.transactions.forEach((tx) => {
      const row = document.createElement("tr");
      row.innerHTML = `
          <td>${tx.date}</td>
          <td>${tx.type}</td>
          <td>${tx.coin}</td>
          <td>${tx.amount}</td>
          <td>${tx.status}</td>
        `;
      tbody.appendChild(row);
    });
  } catch (err) {
    console.error("Error loading wallet:", err);
    alert("Could not load wallet data. Please try again later.");
  }
});*/
let walletBalance = 0;
const txTable = document.getElementById("txTable");
const balanceEl = document.getElementById("walletBalance");

function openPopup(id) {
  document.getElementById(id).style.display = "flex";
}

function closePopup(id) {
  document.getElementById(id).style.display = "none";
}

function confirmTrade(type) {
  let amount = 0;
  if (type === "buy") {
    amount = +document.getElementById("buyAmount").value;
    walletBalance += amount;
    closePopup("buyPopup");
  } else if (type === "sell") {
    amount = +document.getElementById("sellAmount").value;
    walletBalance -= amount;
    closePopup("sellPopup");
  } else if (type === "withdraw") {
    amount = +document.getElementById("withdrawAmount").value;
    walletBalance -= amount;
    closePopup("withdrawPopup");
  } else if (type === "invest") {
    amount = +document.getElementById("investAmount").value;
    walletBalance -= amount;
    closePopup("investPopup");
  }

  if (isNaN(amount) || amount <= 0)
    return alert("Please enter a valid amount.");

  balanceEl.textContent = `₦${walletBalance.toLocaleString()}`;

  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${new Date().toLocaleString()}</td>
    <td>${type.toUpperCase()}</td>
    <td>₦${amount.toLocaleString()}</td>
    <td>✅ Success</td>
  `;
  txTable.prepend(row);
}
fetch("http://localhost:5000/api/wallet/balance", {
  headers: { Authorization: `Bearer ${userToken}` },
})
  .then((res) => res.json())
  .then((data) => {
    document.getElementById("wallet-balance").innerText = `₦${data.balance}`;
  });

// ===== LIVE CRYPTO PRICE UPDATES =====
async function loadCryptoPrices() {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether&vs_currencies=usd"
    );
    const data = await res.json();

    document.getElementById(
      "btcPrice"
    ).textContent = `$${data.bitcoin.usd.toLocaleString()}`;
    document.getElementById(
      "ethPrice"
    ).textContent = `$${data.ethereum.usd.toLocaleString()}`;
    document.getElementById(
      "usdtPrice"
    ).textContent = `$${data.tether.usd.toLocaleString()}`;
  } catch (error) {
    console.error("Error fetching crypto prices:", error);
  }
}

// Refresh prices every 30 seconds
loadCryptoPrices();
setInterval(loadCryptoPrices, 30000);
