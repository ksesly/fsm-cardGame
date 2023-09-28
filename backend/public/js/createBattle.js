function createBattle() {
    const myCreationBattle = document.querySelector('.create-battle');
    const div = myCreationBattle.appendChild(
        document.createElement('div')
    );
    div.className = "div-button";
    const readyButton = div.appendChild(
        document.createElement('button')
    );
    readyButton.className = "ready-button";
    readyButton.textContent = "im ready";
    const cancelButton = div.appendChild(
        document.createElement('button')
    );
    cancelButton.className = "cancel-button";
    cancelButton.textContent = "nonono, cancel";
}

createBattle();