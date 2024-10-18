document.addEventListener('DOMContentLoaded', () => {
    const highscoreListElement = document.getElementById('highscoreList');
    const highscoreList = JSON.parse(localStorage.getItem('highscoreList')) || [];

    if (highscoreList.length > 0) {
        highscoreList.forEach((entry, index) => {
            const listItem = document.createElement('li');
            listItem.textContent = `#${index + 1}: ${entry.name} - ${entry.score} points`;
            highscoreListElement.appendChild(listItem);
        });
    } else {
        highscoreListElement.textContent = 'No highscores yet!';
    }
});
