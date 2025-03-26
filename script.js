const choices = ["rock", "scissors", "paper"];
const buttons = document.querySelectorAll("#game button");
const result = document.getElementById("result");

buttons.forEach(button => {
    button.addEventListener("click", () => {
        const playerChoice = button.id;
        const computerChoice = choices[Math.floor(Math.random() * 3)];
        const winner = determineWinner(playerChoice, computerChoice);
        result.textContent = `Ты выбрал: ${playerChoice}. Компьютер выбрал: ${computerChoice}. ${winner}`;
    });
});

function determineWinner(player, computer) {
    if (player === computer) return "Ничья!";
    if (
        (player === "rock" && computer === "scissors") ||
        (player === "scissors" && computer === "paper") ||
        (player === "paper" && computer === "rock")
    ) return "Ты выиграл!";
    return "Компьютер выиграл!";
}