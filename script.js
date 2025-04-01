// Проверка доступности localStorage
try {
    localStorage.setItem("test", "test");
    localStorage.removeItem("test");
} catch (e) {
    console.error("localStorage не доступен: ", e);
    alert("Ошибка: localStorage не доступен. Статистика может не сохраняться.");
}

const choices = ["rock", "paper", "scissors"];
const buttons = document.querySelectorAll("#game button");
const resultDisplay = document.getElementById("result");
const historyList = document.getElementById("history-list");
const resetButton = document.getElementById("reset");
const scoreDisplay = document.getElementById("score");

let stats = {
    playerScore: 0,
    computerScore: 0,
    history: []
};

// Загрузка статистики из localStorage
if (localStorage.getItem("gameStats")) {
    stats = JSON.parse(localStorage.getItem("gameStats"));
    updateScore();
    updateHistory();
}

function updateScore() {
    scoreDisplay.textContent = `${stats.playerScore}:${stats.computerScore}`;
}

function updateHistory() {
    historyList.innerHTML = "";
    stats.history.forEach((game, index) => {
        const li = document.createElement("li");
        const parts = game.split(", ");
        const playerPart = parts[0].split(": ")[1];
        const computerPart = parts[1].split(": ")[1].split(" - ")[0];
        const resultPart = game.split(" - ")[1];
        li.innerHTML = `Игра ${index + 1}: Вы: <strong>${playerPart}</strong>, Компьютер: <strong>${computerPart}</strong> - ${resultPart}`;
        historyList.appendChild(li);
    });
}

function getComputerChoice() {
    const
