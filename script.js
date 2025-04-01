// Проверка доступности localStorage
let localStorageAvailable = true;
try {
    localStorage.setItem("test", "test");
    localStorage.removeItem("test");
} catch (e) {
    console.error("localStorage не доступен: ", e);
    localStorageAvailable = false;
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

// Загрузка статистики из localStorage, если доступно
if (localStorageAvailable && localStorage.getItem("gameStats")) {
    try {
        stats = JSON.parse(localStorage.getItem("gameStats"));
        updateScore();
        updateHistory();
    } catch (e) {
        console.error("Ошибка при загрузке статистики: ", e);
        alert("Ошибка при загрузке статистики: " + e.message);
    }
}

function updateScore() {
    if (scoreDisplay) {
        scoreDisplay.textContent = `${stats.playerScore}:${stats.computerScore}`;
    } else {
        alert("Ошибка: scoreDisplay не найден");
    }
}

function updateHistory() {
    if (!historyList) {
        alert("Ошибка: historyList не найден");
        return;
    }
    historyList.innerHTML = "";
    stats.history.forEach((game, index) => {
        const li = document.createElement("li");
        const parts = game.split(", ");
        const playerPart = parts[0].split(": ")[1];
        const computerPart = parts[1].split(": ")[1].split(" - ")[0];
        const resultPart = game.split(" - ")[1];

        const gameText = document.createTextNode(`Игра ${index + 1}: Вы: `);
        const playerChoice = document.createElement("strong");
        playerChoice.textContent = playerPart;
        const separator = document.createTextNode(", Компьютер: ");
        const computerChoice = document.createElement("strong");
        computerChoice.textContent = computerPart;
        const resultText = document.createTextNode(` - ${resultPart}`);

        li.appendChild(gameText);
        li.appendChild(playerChoice);
        li.appendChild(separator);
        li.appendChild(computerChoice);
        li.appendChild(resultText);
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
    try {
        const computerChoice = getComputerChoice();
        const result = determineWinner(playerChoice, computerChoice);

        if (resultDisplay) {
            resultDisplay.innerHTML = "";
            const playerText = document.createTextNode("Вы выбрали ");
            const playerChoiceElement = document.createElement("strong");
            playerChoiceElement.textContent = playerChoice;
            const separator = document.createTextNode(", компьютер выбрал ");
            const computerChoiceElement = document.createElement("strong");
            computerChoiceElement.textContent = computerChoice;
            const resultText = document.createTextNode(`. ${result}`);

            resultDisplay.appendChild(playerText);
            resultDisplay.appendChild(playerChoiceElement);
            resultDisplay.appendChild(separator);
            resultDisplay.appendChild(computerChoiceElement);
            resultDisplay.appendChild(resultText);
        } else {
            alert("Ошибка: resultDisplay не найден");
        }

        stats.history.push(`Вы: ${playerChoice}, Компьютер: ${computerChoice} - ${result}`);
        updateHistory();

        if (localStorageAvailable) {
            try {
                localStorage.setItem("gameStats", JSON.stringify(stats));
            } catch (e) {
                console.error("Не удалось сохранить статистику в localStorage: ", e);
                alert("Не удалось сохранить статистику: " + e.message);
            }
        }
    } catch (e) {
        console.error("Ошибка в playGame: ", e);
        alert("Ошибка в playGame: " + e.message);
    }
}

// Проверяем, что кнопки существуют, и добавляем обработчики
if (buttons && buttons.length > 0) {
    buttons.forEach(button => {
        button.addEventListener("touchstart", (e) => {
            e.preventDefault();
            alert("Событие touchstart сработало для кнопки: " + button.id);
            const playerChoice = button.id;
            playGame(playerChoice);
        });
        button.addEventListener("click", () => {
            alert("Событие click сработало для кнопки: " + button.id);
            const playerChoice = button.id;
            playGame(playerChoice);
        });
        button.addEventListener("mousedown", () => {
            alert("Событие mousedown сработало для кнопки: " + button.id);
            const playerChoice = button.id;
            playGame(playerChoice);
        });
    });
} else {
    alert("Ошибка: кнопки игры не найдены");
}

// Проверяем, что кнопка сброса существует, и добавляем обработчики
if (resetButton) {
    resetButton.addEventListener("touchstart", (e) => {
        e.preventDefault();
        alert("Событие touchstart сработало для кнопки сброса");
        stats = {
            playerScore: 0,
            computerScore: 0,
            history: []
        };
        if (localStorageAvailable) {
            try {
                localStorage.setItem("gameStats", JSON.stringify(stats));
            } catch (e) {
                console.error("Не удалось сохранить статистику в localStorage: ", e);
                alert("Не удалось сохранить статистику: " + e.message);
            }
        }
        updateScore();
        updateHistory();
        if (resultDisplay) resultDisplay.textContent = "";
    });

    resetButton.addEventListener("click", () => {
        alert("Событие click сработало для кнопки сброса");
        stats = {
            playerScore: 0,
            computerScore: 0,
            history: []
        };
        if (localStorageAvailable) {
            try {
                localStorage.setItem("gameStats", JSON.stringify(stats));
            } catch (e) {
                console.error("Не удалось сохранить статистику в localStorage: ", e);
                alert("Не удалось сохранить статистику: " + e.message);
            }
        }
        updateScore();
        updateHistory();
        if (resultDisplay) resultDisplay.textContent = "";
    });

    resetButton.addEventListener("mousedown", () => {
        alert("Событие mousedown сработало для кнопки сброса");
        stats = {
            playerScore: 0,
            computerScore: 0,
            history: []
        };
        if (localStorageAvailable) {
            try {
                localStorage.setItem("gameStats", JSON.stringify(stats));
            } catch (e) {
                console.error("Не удалось сохранить статистику в localStorage: ", e);
                alert("Не удалось сохранить статистику: " + e.message);
            }
        }
        updateScore();
        updateHistory();
        if (resultDisplay) resultDisplay.textContent = "";
    });
} else {
    alert("Ошибка: кнопка сброса не найдена");
}
