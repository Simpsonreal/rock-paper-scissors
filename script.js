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
        // Разбиваем строку на части: "Вы: scissors, Компьютер: paper - Вы выиграли!"
        const parts = game.split(", ");
        const playerPart = parts[0].split(": ")[1]; // "scissors"
        const computerPart = parts[1].split(": ")[1].split(" - ")[0]; // "paper"
        const resultPart = game.split(" - ")[1]; // "Вы выиграли!"
        li.innerHTML = `Игра ${index + 1}: Вы: <strong>${playerPart}</strong>, Компьютер: <strong>${computerPart}</strong> - ${resultPart}`;
        historyList.appendChild(li);
    });
}

function getComputerChoice() {
    const randomIndex = Math.floor(Math.random() * choices.length);
    return choices[randomIndex];
}

function determineWinner(playerChoice, computerChoice) {
    if (playerChoice === computerChoice) {
        return "Ничья!";
    }
    if (
        (playerChoice === "rock" && computerChoice === "scissors") ||
        (playerChoice === "scissors" && computerChoice === "paper") ||
        (playerChoice === "paper" && computerChoice === "rock")
    ) {
        stats.playerScore++;
        updateScore();
        return "Вы выиграли!";
    }
    stats.computerScore++;
    updateScore();
    return "Компьютер выиграл!";
}

function playGame(playerChoice) {
    const computerChoice = getComputerChoice();
    const result = determineWinner(playerChoice, computerChoice);
    resultDisplay.innerHTML = `Вы выбрали <strong>${playerChoice}</strong>, компьютер выбрал <strong>${computerChoice}</strong>. ${result}`;
    
    // Добавляем результат в историю
    stats.history.push(`Вы: ${playerChoice}, Компьютер: ${computerChoice} - ${result}`);
    updateHistory();
    
    // Сохраняем статистику в localStorage
    localStorage.setItem("gameStats", JSON.stringify(stats));
}

buttons.forEach(button => {
    button.addEventListener("click", () => {
        const playerChoice = button.id;
        playGame(playerChoice);
    });
});

resetButton.addEventListener("click", () => {
    stats = {
        playerScore: 0,
        computerScore: 0,
        history: []
    };
    localStorage.setItem("gameStats", JSON.stringify(stats));
    updateScore();
    updateHistory();
    resultDisplay.textContent = "";
});
