function createSignUp() {
	const mySignUp = document.querySelector('.signUp');
	const signUpForm = mySignUp.appendChild(document.createElement('form'));
	signUpForm.setAttribute('action', 'http://127.0.0.1:3000/api/v1/users/register');
	signUpForm.setAttribute('method', 'POST');
	signUpForm.className = 'sign-up-form';
	const signUpLabel = signUpForm.appendChild(document.createElement('div'));
	signUpLabel.textContent = 'sign up';
	signUpLabel.className = 'sign-up-lable';
	const signUpDiv = signUpForm.appendChild(document.createElement('div'));
	signUpDiv.className = 'sign-up-div';
	const signUpArray = ['Login', 'Email', 'Password'];
	signUpArray.forEach((i) => {
		const divField = document.createElement('div');
		divField.className = 'div-input-field';
		const labelForField = document.createElement('label');
		labelForField.textContent = i;
		const inputField = document.createElement('input');
		const attributes = {
			name: i.toLowerCase(),
			type: i.toLowerCase(),
			class: 'input-field',
			id: i.toLowerCase() + '-button',
		};
		Object.keys(attributes).forEach((attr) => {
			if (attributes[attr] === 'login' && inputField === 'Login') inputField.setAttribute('type', 'text');
			else inputField.setAttribute(attr, attributes[attr]);
		});
		divField.appendChild(labelForField);
		divField.appendChild(inputField);
		signUpDiv.appendChild(divField);
	});

	const signUpButton = document.createElement('button');
	signUpButton.setAttribute('type', 'submit');
	signUpButton.className = 'sign-up-button';
	signUpButton.textContent = 'sign up';
	signUpDiv.appendChild(signUpButton);

	const signInLink = document.createElement('a');
	signInLink.setAttribute('href', './signIn.html');
	signInLink.textContent = 'already sign up?';

	signUpDiv.appendChild(signInLink);
}

createSignUp();

// const buttons = [...document.getElementsByTagName('button')];
// buttons.forEach(i => {
//     i.addEventListener("click", () => {
//         if (i.id === "start-button")
//             location.replace("./createBattle.html");
//         else if (i.id === "tutorial-button")
//             location.replace("./tutorial.html");
//         else if (i.id === "settings-button")
//             location.replace("./settings.html");
//         else if (i.id === "exit-button")
//             location.replace("./exit.html");

//     })
// })
