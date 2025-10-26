const transferForm = document.getElementById("transferForm");
const transferPopup = document.getElementById("transferPopup");
const historyTable = document.getElementById("historyTable");

transferForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const amount = transferForm.querySelector('input[type="number"]').value;
  const name = transferForm.querySelector(
    'input[placeholder="Recipient name"]'
  ).value;
  const country = transferForm.querySelector("select").value;
});
transferForm.addEventListener("submit", (e) => {
  e.preventDefault();
  transferPopup.style.display = "flex";
  transferForm.reset();
});

function closeTransferPopup() {
  transferPopup.style.display = "none";
}
