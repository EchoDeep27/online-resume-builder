const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('form-wrapper');
let logo = document.getElementsByClassName("logo")[0]
let logoText = document.getElementsByClassName("logo-text")[0]

signUpButton.addEventListener('click', () => {
	container.classList.add("right-panel-active");
    logo.style.color = "gold"
    logoText.style.color = "white"
});

signInButton.addEventListener('click', () => {
	container.classList.remove("right-panel-active");
    logo.style.color = "var(--secondary-color)";
    logoText.style.color = "var(--highlight-color)";
});   