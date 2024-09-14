document.addEventListener('DOMContentLoaded', function () {
    const redirectDelayTime = 1500
    let signUpButton = document.getElementById('signUp');
    let signInButton = document.getElementById('signIn');
    let container = document.getElementById('form-wrapper');
    let logo = document.getElementsByClassName("logo")[0]

    let signupForm = document.getElementById('signup-form');
    let signinForm = document.getElementById('signin-form');
    
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

    if (signupForm) {
        signupForm.addEventListener('submit', signup);
    }
    if (signinForm) {

        signinForm.addEventListener('submit', signin);
    }


    async function signup(event) {
        event.preventDefault();

        let name = document.getElementById('signup-name').value;
        let email = document.getElementById('signup-email').value;
        let password = document.getElementById('signup-password').value;
        let confirmPassword = document.getElementById('signup-confirm-password').value;

        let { isValid, message } = validateSignupForm(name, email, password, confirmPassword);
        if (!isValid) {
            showInformBox(message);
            return;
        }

        let signupData = { name, email, password };
        console.log(signupData)
        let response = await sendPostRequest('/signup', signupData);

        if (response.ok) {
            showInformBox('Sign up successful');
            setTimeout(function () {
                window.location.href = '/';
            }, redirectDelayTime);
        } else {
            let errorData = await response.json();
            showInformBox(errorData.error);
        }
    }



    async function signin(event) {
        event.preventDefault();

        let email = document.getElementById('signin-email').value;
        let password = document.getElementById('signin-password').value;

        let { isValid, message } = validateSigninForm(email, password);
        if (!isValid) {
            showInformBox(message);
            return;
        }

        let signinData = { email, password };
        let response = await sendPostRequest('/signin', signinData);

        if (response.ok) {
            showInformBox('Sign in successful');
            setTimeout(function () {
                window.location.href = '/';
            }, redirectDelayTime);
        } else {
            let errorData = await response.json();
            showInformBox(errorData.error);
        }
    }

    function validateSignupForm(name, email, password, confirmPassword) {

        if (!name || name.length < 5) {
            return { isValid: false, message: "Name must be at least 5 characters long." };
        }

        if (!email || !validateEmail(email)) {
            return { isValid: false, message: "Invalid email address" };
        }

        if (!password || password.length < 8) {
            return { isValid: false, message: "Password must be at least 8 characters long." };
        }

        if (password !== confirmPassword) {
            return { isValid: false, message: 'Passwords do not match.' };
        }

        return { isValid: true, message: 'success' };
    }


    function validateSigninForm(email, password) {

        if (!email || !validateEmail(email)) {
            return { isValid: false, message: "Invalid email address" };
        }

        if (!password || password.length < 8) {
            return { isValid: false, message: "Password must be at least 8 characters long." };
        }

        return { isValid: true, message: 'success' };;
    }

    // Validating email format
    function validateEmail(email) {
        let re = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
        return re.test(email.toLowerCase());
    }


    async function sendPostRequest(url, data) {
        return await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
    }

});
