
function toggleDarkMode() {
  document.body.classList.toggle("dark");
  const btn = document.getElementById("darkToggle");
  btn.textContent = document.body.classList.contains("dark") ? "☀️ Light Mode" : "🌙 Dark Mode";
}

function switchTab(tabId) {
  document.querySelectorAll(".calculator").forEach(c => c.classList.add("hidden"));
  document.getElementById(tabId + "Tab").classList.remove("hidden");
  document.querySelectorAll(".tabs button").forEach(b => b.classList.remove("active"));
  document.querySelectorAll(".tabs button").forEach(btn => {
    if (btn.textContent.includes(tabId === 'basic' ? "Basic" : tabId === 'emi' ? "EMI" : "Crypto"))
      btn.classList.add("active");
  });
}

// Basic calculator functions
function appendToDisplay(value) {
  document.getElementById("display").value += value;
}

function clearDisplay() {
  document.getElementById("display").value = "";
}

function calculate() {
  try {
    const expr = document.getElementById("display").value;
    const result = eval(expr);
    document.getElementById("display").value = result;
    addToHistory(expr + " = " + result);
  } catch {
    document.getElementById("display").value = "Error";
  }
}

function addToHistory(entry) {
  const list = document.getElementById("historyList");
  const item = document.createElement("li");
  item.textContent = entry;
  list.prepend(item);
}

function clearHistory() {
  document.getElementById("historyList").innerHTML = "";
}

function startVoice() {
  if (!('webkitSpeechRecognition' in window)) {
    alert("Voice input not supported.");
    return;
  }
  const recognition = new webkitSpeechRecognition();
  recognition.lang = "en-US";
  recognition.onresult = function(event) {
    let spoken = event.results[0][0].transcript;
    spoken = spoken.replace(/plus/gi, "+").replace(/minus/gi, "-")
                   .replace(/times|multiplied by/gi, "*").replace(/divided by/gi, "/");
    document.getElementById("display").value = spoken;
    if (spoken.includes("=")) calculate();
  };
  recognition.start();
}

// EMI Calculator
function calculateEMI() {
  const P = parseFloat(document.getElementById("loanAmount").value);
  const r = parseFloat(document.getElementById("interestRate").value) / 12 / 100;
  const n = parseFloat(document.getElementById("loanTerm").value) * 12;
  if (isNaN(P) || isNaN(r) || isNaN(n)) return;
  const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const total = emi * n;
  const interest = total - P;
  document.getElementById("emi").textContent = emi.toFixed(2);
  document.getElementById("interest").textContent = interest.toFixed(2);
  document.getElementById("total").textContent = total.toFixed(2);
  document.getElementById("emiResult").style.display = "block";
}

// Crypto Calculator
function convertCrypto() {
  const amount = parseFloat(document.getElementById("cryptoAmount").value);
  const type = document.getElementById("cryptoType").value;
  const currency = document.getElementById("currency").value;

  const rates = {
    BTC: { INR: 5000000, USD: 60000 },
    ETH: { INR: 300000, USD: 3500 }
  };

  const value = amount * rates[type][currency];
  document.getElementById("convertedValue").textContent = (currency === "INR" ? "₹" : "$") + value.toFixed(2);
}
