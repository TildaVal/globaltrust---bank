const form = document.getElementById("loginForm");
const popup = document.getElementById("loginPopup");
const forgotLink = document.getElementById("forgotLink");
const forgotPopup = document.getElementById("forgotPopup");
const forgotForm = document.getElementById("forgotForm");
const resetPopup = document.getElementById("resetPopup");

//Login submission
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  loginPopup.style.display = "flex";
  loginForm.reset();
});

function closeLoginPopup() {
  popup.style.display = "none";
  window.location.href = "account.html"; //Redirect to user account
}

//Forgot password popup
forgotLink.addEventListener("click", (e) => {
  e.preventDefault();
  forgotPopup.style.display = "flex";
});

function closeForgotPopup() {
  forgotPopup.style.display = "none";
}

//Reset email submission
forgotForm.addEventListener("submit", (e) => {
  e.preventDefault();
  forgotPopup.style.display = "none";
  resetPopup.style.display = "flex";
  forgotForm.reset();
});

function closeResetPopup() {
  resetPopup.style.display = "none";
}

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const response = await fetch("http://localhost:5000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (response.ok) {
    alert("Login successful!");
    console.log("User:", data);
  } else {
    alert(data.message || "Login failed");
  }
});
