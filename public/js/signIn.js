function createSignIn() {
	const mySignIn = document.querySelector('.sign-in');
	const signInForm = mySignIn.appendChild(document.createElement('form'));
	signInForm.setAttribute('action', 'http://127.0.0.1:3000/api/v1/users/login');
	signInForm.setAttribute('method', 'POST');
	signInForm.className = 'sign-in-form';
	const signInLabel = signInForm.appendChild(document.createElement('div'));
	signInLabel.textContent = 'sign in';
	signInLabel.className = 'sign-in-lable';
	const signInDiv = signInForm.appendChild(document.createElement('div'));
	signInDiv.className = 'sign-in-div';
	const signInArray = ['Login or Email', 'Password'];
	signInArray.forEach((i) => {
		const divField = document.createElement('div');
		divField.className = 'div-input-field';
		const labelForField = document.createElement('label');
		labelForField.textContent = i;
		const inputField = document.createElement('input');
		const attributes = {
			name: i.toLowerCase(),
			type: i.toLowerCase(),
			class: 'input-field',
			id: i.toLowerCase() + '-input',
		};
		Object.keys(attributes).forEach((attr) => {
			if (attributes[attr] === 'login or email')
				inputField.setAttribute('name', 'login');
			else inputField.setAttribute(attr, attributes[attr]);
		});

		divField.appendChild(labelForField);
		divField.appendChild(inputField);
		if (i === 'Password'){
			const errorField =  divField.appendChild(
				document.createElement('span'));
			errorField.className = 'error-field';
			errorField.id = 'error-password';
			errorField.textContent = '';
		}
		signInDiv.appendChild(divField);
	});

	const signInButton = document.createElement('button');
	signInButton.setAttribute('type', 'submit');
	signInButton.className = 'sign-in-button';
	signInButton.textContent = 'sign in';
	signInDiv.appendChild(signInButton);

	const signUpLink = document.createElement('a');
	signUpLink.setAttribute('href', './signUp.html');
	signUpLink.textContent = 'do not have an account?';

	signInDiv.appendChild(signUpLink);
}

createSignIn();


const passwordInput = document.getElementById('password-input');
const passwordError = document.getElementById('error-password');

passwordInput.addEventListener('input', (event) => {
	const inputValue = event.target.value;
	if ((inputValue.length > 0 && inputValue.length < 3) || inputValue.length > 10) {
		passwordError.textContent = '3 < password < 10';
		event.preventDefault();
	}
	else 
		passwordError.textContent = '';
});