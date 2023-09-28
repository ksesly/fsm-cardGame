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
	signInButton.disabled = true;
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
const signInButton = document.querySelector('.sign-in-button');

passwordInput.addEventListener('input', (event) => {
	const inputValue = event.target.value;
	if ((inputValue.length > 0 && inputValue.length < 3) || inputValue.length > 10) {
		passwordError.textContent = '3 < password < 10';
		event.preventDefault();
		signInButton.disabled = true;
	}
	else {
		passwordError.textContent = '';
		signInButton.disabled = false;
	}
});

const loginForm = document.querySelector('.sign-in-form');

loginForm.addEventListener('submit', async (action) => {
	action.preventDefault();

	try {
		const formData = new FormData(loginForm);

		const res = await fetch('/api/v1/users/register', {
			method: 'POST',
			body: JSON.stringify({
				login: formData.get('login'),
				email: formData.get('email'),
				password: formData.get('password'),
			}),
			headers: new Headers({
				'Content-Type': 'application/json; charset=UTF-8',
			}),
		});

		const data = await res.json();
		console.log(data);
		if (data.status === 'success') {
			const expirationDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
			document.cookie = `authorization=Bearer ${data.token}; expires=${expirationDate.toUTCString()};path=/`;
			window.location.href = '/lobby';
		}
	} catch (error) {

		console.error('Error:', error);
	}
});
