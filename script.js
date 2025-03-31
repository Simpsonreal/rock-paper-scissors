document.addEventListener("DOMContentLoaded", () => {
    let stats = JSON.parse(localStorage.getItem('gameStats')) || {
        playerScore: 0,
        computerScore: 0,
        games: []
    };

    const choices = ["rock", "scissors", "paper"];
    const buttons = document.querySelectorAll("#game button");
    const result = document.getElementById("result");
    const historyList = document.getElementById("history-list");
    const resetButton = document.getElementById("reset");
    const scoreDisplay = document.getElementById("score");

    const updateScore = () => {
        scoreDisplay.textContent = `Счет: ${stats.playerScore}:${stats.computerScore}`;
    };

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            const playerChoice = button.id;
            const computerChoice = choices[Math.floor(Math.random() * 3)];
            const winner = determineWinner(playerChoice, computerChoice);

            console.log('Игрок выбрал:', playerChoice);
            console.log('Компьютер выбрал:', computerChoice);
            console.log('Результат:', winner);

            stats.games.push({ playerChoice, computerChoice, result: winner });
            if (winner === "Ты выиграл!") stats.playerScore++;
            if (winner === "Компьютер выиграл!") stats.computerScore++;

            if (stats.games.length > 5) stats.games.shift();

            localStorage.setItem('gameStats', JSON.stringify(stats));

            result.textContent = `Ты выбрал: ${playerChoice}. Компьютер выбрал: ${computerChoice}. ${winner}`;
            updateScore();

            updateHistory();
        });
    });

    resetButton.addEventListener("click", () => {
        stats = {
            playerScore: 0,
            computerScore: 0,
            games: []
        };
        localStorage.setItem('gameStats', JSON.stringify(stats));
        result.textContent = "Статистика сброшена!";
        updateScore();
        updateHistory();
    });

    function updateHistory() {
        historyList.innerHTML = '';
        stats.games.forEach(game => {
            const li = document.createElement('li');
            li.textContent = `Ты: ${game.playerChoice}, Компьютер: ${game.computerChoice}, Результат: ${game.result}`;
            historyList.appendChild(li);
        });
    }

    updateHistory();
    updateScore();

    function determineWinner(player, computer) {
        if (player === computer) {
            return "Ничья!";
        }
        if (
            (player === "rock" && computer === "scissors") ||
            (player === "scissors" && computer === "paper") ||
            (player === "paper" && computer === "rock")
        ) {
            return "Ты выиграл!";
        }
        return "Компьютер выиграл!";
    }
});
