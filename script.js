let playerScore = 0;
let computerScore = 0;

const choices = ["rock", "scissors", "paper"];
const buttons = document.querySelectorAll("#game button");
const result = document.getElementById("result");

buttons.forEach(button => {
    button.addEventListener("click", async () => {
        const playerChoice = button.id;
        const computerChoice = choices[Math.floor(Math.random() * 3)];
        const winner = determineWinner(playerChoice, computerChoice);

        console.log('Игрок выбрал:', playerChoice);
        console.log('Компьютер выбрал:', computerChoice);
        console.log('Результат:', winner);

        try {
            console.log('Отправка запроса на сервер...');
            const response = await fetch('https://89b7-46-199-231-63.ngrok-free.app/game', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ playerChoice, computerChoice, result: winner })
            });
            console.log('Ответ от сервера:', response);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Данные от сервера:', data);
            result.textContent = `Ты выбрал: ${playerChoice}. Компьютер выбрал: ${computerChoice}. ${winner} Счет: ${data.stats.playerScore}:${data.stats.computerScore}`;
        } catch (error) {
            console.error('Ошибка при отправке запроса:', error);
            result.textContent = `Ошибка: ${error.message}`;
        }
    });
});

function determineWinner(player, computer) {
    if (player === computer) {
        return "Ничья!";
    }
    if (
        (player === "rock" && computer === "scissors") ||
        (player === "scissors" && computer === "paper") ||
        (player === "paper" && computer === "rock")
    ) {
        playerScore++;
        return "Ты выиграл!";
    }
    computerScore++;
    return "Компьютер выиграл!";
}
