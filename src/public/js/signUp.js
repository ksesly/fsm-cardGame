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
			id: i.toLowerCase() + '-input',
		};
		Object.keys(attributes).forEach((attr) => {
			if (attributes[attr] === 'login' && inputField === 'Login') inputField.setAttribute('type', 'text');
			else inputField.setAttribute(attr, attributes[attr]);
		});
		divField.appendChild(labelForField);
		divField.appendChild(inputField);
		if (i === 'Login') {
			const errorField = divField.appendChild(document.createElement('span'));
			errorField.className = 'error-field';
			errorField.id = 'error-login';
			errorField.textContent = '';
		} else if (i === 'Password') {
			const errorField = divField.appendChild(document.createElement('span'));
			errorField.className = 'error-field';
			errorField.id = 'error-password';
			errorField.textContent = '';
		}
		signUpDiv.appendChild(divField);
	});

	const signUpButton = document.createElement('button');
	signUpButton.setAttribute('type', 'submit');
	signUpButton.className = 'sign-up-button';
	signUpButton.textContent = 'sign up';
	signUpDiv.appendChild(signUpButton);

	const signInLink = document.createElement('a');
	signInLink.setAttribute('href', '/api/v1/users/login');
	signInLink.textContent = 'already sign up?';

	signUpDiv.appendChild(signInLink);
}

createSignUp();

const loginInput = document.getElementById('login-input');
const loginError = document.getElementById('error-login');

loginInput.addEventListener('input', (event) => {
	const inputValue = event.target.value;
	if (inputValue.includes('@')) {
		loginError.textContent = 'cannot contain "@"';
		event.preventDefault();
	} else {
		loginError.textContent = '';
	}
});

const passwordInput = document.getElementById('password-input');
const passwordError = document.getElementById('error-password');

passwordInput.addEventListener('input', (event) => {
	const inputValue = event.target.value;
	if ((inputValue.length > 0 && inputValue.length < 3) || inputValue.length > 10) {
		passwordError.textContent = '3 < password < 10';
		event.preventDefault();
	} else passwordError.textContent = '';
});

const registerForm = document.querySelector('.sign-up-form');

registerForm.addEventListener('submit', async (action) => {
	action.preventDefault();

	try {
		const formData = new FormData(registerForm);

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
