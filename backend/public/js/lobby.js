function createLobby() {
    const myLobby = document.querySelector('.lobby');
    const lobbyNavigation = myLobby.appendChild(document.createElement("div"));
    lobbyNavigation.className = "lobby-navigation";
    const navButtonArray = ["Start", "Tutorial", "Settings", "Exit"];
    navButtonArray.forEach(i => {
        const navDivButton = lobbyNavigation.appendChild(
            document.createElement("div")
        );
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

const buttons = [...document.getElementsByTagName('button')];
buttons.forEach(i => {
    i.addEventListener("click", () => {
        if (i.id === "start-button")
            location.replace("./createBattle.html");
        else if (i.id === "tutorial-button")
            location.replace("./tutorial.html");
        else if (i.id === "settings-button")
            location.replace("./settings.html");
        else if (i.id === "exit-button")
            location.replace("./exit.html");
    })
})
