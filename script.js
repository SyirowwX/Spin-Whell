const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const spinBtn = document.getElementById("spinBtn");
const nameInput = document.getElementById("nameInput");
const addNameBtn = document.getElementById("addNameBtn");
const nameList = document.getElementById("nameList");
const removeWinnerCheckbox = document.getElementById("removeWinner");

const winSound = document.getElementById("winSound");
const popup = document.getElementById("winnerPopup");
const winnerName = document.getElementById("winnerName");
const closePopup = document.getElementById("closePopup");

let names = ["Nama 1", "Nama 2", "Nama 3"];
let colors = ["#FF5733", "#33FF57", "#3357FF", "#FFC300", "#8E44AD", "#FF33A1"];
let startAngle = 0;
let arc;
let spinTimeout = null;
let spinAngleStart = 10;
let spinTime = 0;
let spinTimeTotal = 0;

addNameBtn.addEventListener("click", () => {
    const name = nameInput.value.trim();
    if (name) {
        names.push(name);
        renderNameList();
        nameInput.value = "";
        drawWheel();
    }
});

function renderNameList() {
    nameList.innerHTML = "";
    names.forEach((name, index) => {
        const li = document.createElement("li");
        li.textContent = name;
        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Hapus";
        removeBtn.classList.add("remove-btn");
        removeBtn.addEventListener("click", () => {
            names.splice(index, 1);
            renderNameList();
            drawWheel();
        });
        li.appendChild(removeBtn);
        nameList.appendChild(li);
    });
}

function drawWheel() {
    arc = Math.PI / (names.length / 2);
    ctx.clearRect(0, 0, 300, 300);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.font = "14px Arial";
    
    for (let i = 0; i < names.length; i++) {
        const angle = startAngle + i * arc;
        ctx.fillStyle = colors[i % colors.length];
        ctx.beginPath();
        ctx.moveTo(150, 150);
        ctx.arc(150, 150, 150, angle, angle + arc, false);
        ctx.lineTo(150, 150);
        ctx.fill();
        ctx.save();
        ctx.translate(150 + Math.cos(angle + arc / 2) * 100, 150 + Math.sin(angle + arc / 2) * 100);
        ctx.rotate(angle + arc / 2);
        ctx.fillStyle = "white";
        ctx.fillText(names[i], -ctx.measureText(names[i]).width / 2, 0);
        ctx.restore();
    }
}

function rotateWheel() {
    spinTime += 30;
    if (spinTime >= spinTimeTotal) {
        stopRotateWheel();
        return;
    }
    const spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
    startAngle += (spinAngle * Math.PI) / 180;
    drawWheel();
    spinTimeout = setTimeout(rotateWheel, 30);
}

function stopRotateWheel() {
    const degrees = (startAngle * 180) / Math.PI + 90;
    const arcd = (arc * 180) / Math.PI;
    const index = Math.floor((360 - (degrees % 360)) / arcd);
    const winner = names[index];

    winSound.play();

    winnerName.textContent = winner;
    popup.style.display = "flex";

    if (removeWinnerCheckbox.checked) {
        names.splice(index, 1);
    }
    renderNameList();
    drawWheel();
}

function easeOut(t, b, c, d) {
    t /= d;
    t--;
    return c * Math.sqrt(1 - t * t) + b;
}

spinBtn.addEventListener("click", function () {
    if (names.length === 0) {
        alert("Tambahkan minimal satu nama!");
        return;
    }
    spinAngleStart = Math.random() * 45 + 65; // lebih cepat
    spinTime = 0;
    spinTimeTotal = Math.random() * 7000 + 9000; // putar lebih lama
    rotateWheel();
});

closePopup.addEventListener("click", () => {
    popup.style.display = "none";
});

renderNameList();
drawWheel();
const toggleDarkModeBtn = document.getElementById("toggleDarkMode");

// Cek mode sebelumnya
if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark-mode");
    toggleDarkModeBtn.textContent = "☀ Light Mode";
}

toggleDarkModeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    if (document.body.classList.contains("dark-mode")) {
        toggleDarkModeBtn.textContent = "☀ Light Mode";
        localStorage.setItem("darkMode", "enabled");
    } else {
        toggleDarkModeBtn.textContent = "🌙 Dark Mode";
        localStorage.setItem("darkMode", "disabled");
    }
});