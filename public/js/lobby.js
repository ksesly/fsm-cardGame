function createLobby() {
    const myLobby = document.querySelector('.lobby');
    const lobbyNavigation = myLobby.appendChild(document.createElement("div"));
    lobbyNavigation.className = "lobby-navigation";
    const navButtonArray = ["Start", "Tutorial", "Settings", "Exit"];
    navButtonArray.forEach(i => {
        const navDivButton = lobbyNavigation.appendChild(
            document.createElement("div")
        );
        // navDivButton
        navDivButton.className = "nav-div-button";
        const button = document.createElement("button");
        button.id = i.toLowerCase() + "-button";
        button.setAttribute("type", "submit");
        button.setAttribute("class", "nav-buttons");
        button.textContent = i;
        navDivButton.appendChild(button);
    });
    
}

createLobby();