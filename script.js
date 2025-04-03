// Инициализация TON Connect (для получения адреса игрока)
const tonConnect = new TonConnectSDK.TonConnect({
    manifestUrl: 'https://simpsonreal.github.io/rock-paper-scissors/tonconnect-manifest.json'
});

// Проверка доступности localStorage
let localStorageAvailable = true;
try {
    localStorage.setItem("test", "test");
    localStorage.removeItem("test");
} catch (e) {
    console.error("localStorage не доступен: ", e);
    localStorageAvailable = false;
}

// Очищаем localStorage при старте, чтобы избежать проблем с повреждёнными данными
if (localStorageAvailable) {
    try {
        localStorage.removeItem("gameStats");
    } catch (e) {
        console.error("Не удалось очистить localStorage: ", e);
    }
}

const choices = ["rock", "paper", "scissors"];
const buttons = document.querySelectorAll("#game button");
const resultDisplay = document.getElementById("result");
const historyList = document.getElementById("history-list");
const resetButton = document.getElementById("reset");
const scoreDisplay = document.getElementById("score");
const betScreen = document.getElementById("bet-screen");
const gameScreen = document.getElementById("game");
const placeBetButton = document.getElementById("placeBet");
const checkPaymentButton = document.getElementById("checkPayment");

let stats = {
    playerScore: 0,
    computerScore: 0,
    history: []
};
let currentInvoiceId = null; // Для хранения ID счёта

// Загрузка статистики из localStorage, если доступно
if (localStorageAvailable && localStorage.getItem("gameStats")) {
    try {
        stats = JSON.parse(localStorage.getItem("gameStats"));
        if (!stats.history || !Array.isArray(stats.history)) {
            stats.history = [];
        }
        updateScore();
        updateHistory();
    } catch (e) {
        console.error("Ошибка при загрузке статистики: ", e);
        stats = {
            playerScore: 0,
            computerScore: 0,
            history: []
        };
    }
}

// Показываем экран ставок при загрузке
betScreen.style.display = "flex";

function updateScore() {
    if (scoreDisplay) {
        scoreDisplay.textContent = `${stats.playerScore}:${stats.computerScore}`;
    } else {
        console.error("scoreDisplay не найден");
    }
}

function updateHistory() {
    if (!historyList) {
        console.error("historyList не найден");
        return;
    }
    historyList.innerHTML = "";
    if (!stats.history || !Array.isArray(stats.history)) {
        stats.history = [];
    }
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
        return "Вы выиграли! Награда: 0.015 TON";
    }
    stats.computerScore++;
    updateScore();
    return "Компьютер выиграл! Вы потеряли ставку.";
}

// Функция для создания счёта через @CryptoBot
async function createInvoice() {
    try {
        const response = await fetch('https://твой_сервер/create-invoice', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                amount: 0.01, // 0.01 TON
                asset: 'TON',
                description: 'Ставка на игру Камень-Ножницы-Бумага'
            })
        });
        const data = await response.json();
        if (data.success) {
            currentInvoiceId = data.invoiceId;
            resultDisplay.textContent = `Счёт создан! Оплати через @CryptoBot: ${data.payUrl}`;
            return true;
        } else {
            resultDisplay.textContent = 'Не удалось создать счёт. Попробуй снова.';
            return false;
        }
    } catch (e) {
        console.error("Ошибка при создании счёта:", e);
        resultDisplay.textContent = 'Ошибка при создании счёта. Попробуй снова.';
        return false;
    }
}

// Функция для проверки оплаты
async function checkPayment() {
    if (!currentInvoiceId) {
        resultDisplay.textContent = 'Сначала создай счёт!';
        return false;
    }
    try {
        const response = await fetch('https://твой_сервер/check-invoice', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ invoiceId: currentInvoiceId })
        });
        const data = await response.json();
        if (data.status === 'paid') {
            resultDisplay.textContent = 'Оплата подтверждена! Сделай свой выбор.';
            betScreen.style.display = "none";
            gameScreen.style.display = "flex";
            return true;
        } else {
            resultDisplay.textContent = 'Оплата ещё не подтверждена. Попробуй снова через несколько секунд.';
            return false;
        }
    } catch (e) {
        console.error("Ошибка при проверке оплаты:", e);
        resultDisplay.textContent = 'Ошибка при проверке оплаты. Попробуй снова.';
        return false;
    }
}

function playGame(playerChoice) {
    try {
        const computerChoice = getComputerChoice();
        const result = determineWinner(playerChoice, computerChoice);
        const playerAddress = tonConnect.wallet?.account?.address; // Адрес кошелька игрока

        // Отправка результата на сервер для обработки награды
        fetch('https://твой_сервер/game-result', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                playerAddress,
                result: result.includes('Вы выиграли') ? 'win' : 'lose',
                gameId: currentInvoiceId
            })
        })
        .then(response => response.json())
        .then(data => {
            resultDisplay.innerHTML = "";
            const playerText = document.createTextNode("Вы выбрали ");
            const playerChoiceElement = document.createElement("strong");
            playerChoiceElement.textContent = playerChoice;
            const separator = document.createTextNode(", компьютер выбрал ");
            const computerChoiceElement = document.createElement("strong");
            computerChoiceElement.textContent = computerChoice;
            const resultText = document.createTextNode(`. ${result} ${data.message}`);

            resultDisplay.appendChild(playerText);
            resultDisplay.appendChild(playerChoiceElement);
            resultDisplay.appendChild(separator);
            resultDisplay.appendChild(computerChoiceElement);
            resultDisplay.appendChild(resultText);
        })
        .catch(e => {
            console.error('Ошибка при отправке результата:', e);
            resultDisplay.textContent = result + ' Ошибка при обработке награды.';
        });

        if (!stats.history || !Array.isArray(stats.history)) {
            stats.history = [];
        }
        stats.history.push(`Вы: ${playerChoice}, Компьютер: ${computerChoice} - ${result}`);
        updateHistory();

        if (localStorageAvailable) {
            try {
                localStorage.setItem("gameStats", JSON.stringify(stats));
            } catch (e) {
                console.error("Не удалось сохранить статистику в localStorage: ", e);
            }
        }

        // После игры возвращаем экран ставок
        gameScreen.style.display = "none";
        betScreen.style.display = "flex";
        currentInvoiceId = null; // Сбрасываем ID счёта
    } catch (e) {
        console.error("Ошибка в playGame: ", e);
    }
}

// Обработчик кнопки "Создать счёт"
placeBetButton.addEventListener("click", async () => {
    await createInvoice();
});

// Обработчик кнопки "Проверить оплату"
checkPaymentButton.addEventListener("click", async () => {
    await checkPayment();
});

// Проверяем, что кнопки существуют, и добавляем обработчики
if (buttons && buttons.length > 0) {
    buttons.forEach(button => {
        button.addEventListener("touchstart", (e) => {
            e.preventDefault();
            const playerChoice = button.id;
            playGame(playerChoice);
        });
        button.addEventListener("click", () => {
            const playerChoice = button.id;
            playGame(playerChoice);
        });
        button.addEventListener("mousedown", () => {
            const playerChoice = button.id;
            playGame(playerChoice);
        });
    });
} else {
    console.error("Кнопки игры не найдены");
}

// Проверяем, что кнопка сброса существует, и добавляем обработчики
if (resetButton) {
    resetButton.addEventListener("touchstart", (e) => {
        e.preventDefault();
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
            }
        }
        updateScore();
        updateHistory();
        if (resultDisplay) resultDisplay.textContent = "";
    });

    resetButton.addEventListener("click", () => {
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
            }
        }
        updateScore();
        updateHistory();
        if (resultDisplay) resultDisplay.textContent = "";
    });

    resetButton.addEventListener("mousedown", () => {
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
            }
        }
        updateScore();
        updateHistory();
        if (resultDisplay) resultDisplay.textContent = "";
    });
} else {
    console.error("Кнопка сброса не найдена");
}
