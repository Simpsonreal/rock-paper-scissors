// Переменные для счета
let playerScore = 0;
let computerScore = 0;

// Массив возможных выборов
const choices = ["rock", "scissors", "paper"];
const buttons = document.querySelectorAll("#game button");
const result = document.getElementById("result");

// Обработчик кликов по кнопкам
buttons.forEach(button => {
    button.addEventListener("click", () => {
        const playerChoice = button.id;
        const computerChoice = choices[Math.floor(Math.random() * 3)];
        const winner = determineWinner(playerChoice, computerChoice);
        
        // Обновляем текст результата с учетом счета
        result.textContent = `Ты выбрал: ${playerChoice}. Компьютер выбрал: ${computerChoice}. ${winner} Счет: ${playerScore}:${computerScore}`;
    });
});

// Функция определения победителя и обновления счета
function determineWinner(player, computer) {
    if (player === computer) {
        return "Ничья!";
    }
    if (
        (player === "rock" && computer === "scissors") ||
        (player === "scissors" && computer === "paper") ||
        (player === "paper" && computer === "rock")
    ) {
        playerScore++; // Увеличиваем счет игрока
        return "Ты выиграл!";
    }
    computerScore++; // Увеличиваем счет компьютера
    return "Компьютер выиграл!";
}