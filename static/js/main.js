//   ---   CHANGING BETWEEN REGISTRATION AND LOGIN   ---   //

const container = document.querySelector(".container"),
signUp = document.querySelector(".signup-link"),
login = document.querySelector(".login-link");

document.addEventListener('DOMContentLoaded', () => {
    const pwShowHide = document.querySelectorAll('.showHidePw');

    // Toggles each password field when eye is clicked
    pwShowHide.forEach(eyeIcon => {
        eyeIcon.addEventListener('click', () => {
            console.log('Eye icon clicked');

            let pwField;
            const targetId = eyeIcon.getAttribute('data-target');

            if (targetId === 'password-signup') {
                pwField = document.getElementById('password-signup');
            } else if (targetId === 'confirm-password-signup') {
                pwField = document.getElementById('confirm-password-signup');
            } else if (targetId === 'password-login') {
                pwField = document.getElementById('password-login');
            }

            if (!pwField) {
                console.log('Password field not found');
                return;
            }

            // Toggle the type attribute of the password field between text and password
            if (pwField.type === 'password') {
                pwField.type = 'text';
                eyeIcon.classList.replace('ri-eye-off-line', 'ri-eye-line'); // Toggle eye icon
                console.log('Password shown');
            } else {
                pwField.type = 'password';
                eyeIcon.classList.replace('ri-eye-line', 'ri-eye-off-line'); // Toggle eye icon
                console.log('Password hidden');
            }
        });
    });
});


// Redirect to homepage upon successfuly login
document.addEventListener("DOMContentLoaded", () => {
   const loginButton = document.querySelector(".login .button input[type='button']");
   const emailFields = document.querySelectorAll(".login input[type='text'][placeholder=' ']");
   const passwordFields = document.querySelectorAll(".login input[type='password'][placeholder=' ']");


   loginButton.addEventListener("click", () => {
       // Clear previous error messages
       document.querySelectorAll('.error-message').forEach(error => {
           error.textContent = '';
       });


       // Define errors array
       let errors = [];


       emailFields.forEach(emailField => {
           if (emailField.value.trim() === "") {
               errors.push({ field: 'login-email', message: 'Please enter your email.' });
           }
       });


       passwordFields.forEach(passwordField => {
           if (passwordField.value.trim() === "") {
               errors.push({ field: 'login-password', message: 'Please enter your password.'});
           }
       });


       // If there are no errors so far, proceed with AJAX request
       if (errors.length === 0) {
           const formData = new FormData();
           emailFields.forEach(emailField => {
               formData.append('email', emailField.value.trim());
           });
           passwordFields.forEach(passwordField => {
               formData.append('password', passwordField.value.trim());
           });


           fetch('/login', {
               method: 'POST',
               body: formData
           })
           .then(response => response.json())
           .then(data => {
               if (data.success) {
                   // Login successful, redirect to homepage 
                   window.location.href = '/home'; 
               } else {
                   // Login failed, display error message
                   document.getElementById('login-error').textContent = data.message;
                   errors.push({ field: 'login', message: 'Invalid email address and/or password.'});
               }
           })
           .catch(error => {
               console.error('Error:', error);
           });
       } else {
           // Display all error messages
           errors.forEach(error => {
               document.getElementById(`${error.field}-error`).textContent = error.message;
           });
       }
   });
});


// Upon successful registration redirect to login section
document.addEventListener("DOMContentLoaded", () => {
    const registerButton = document.querySelector(".signup .button input[type='button']");
    const nameField = document.getElementById("name-signup");
    const emailField = document.getElementById("email-signup");
    const passwordField = document.getElementById("password-signup");
    const confirmPasswordField = document.getElementById("confirm-password-signup");
    const errorMessages = document.querySelectorAll('.error-message');

    registerButton.addEventListener("click", () => {
        // Clear previous error messages
        errorMessages.forEach(error => {
            error.textContent = '';
        });

        // Define errors array
        let errors = [];

        // Check if fields are empty
        if (nameField.value.trim() === "") {
            errors.push({ field: 'name', message: 'Please enter your name.' });
        }
        if (emailField.value.trim() === "") {
            errors.push({ field: 'signup-email', message: 'Please enter your email.' });
        }
        if (passwordField.value.trim() === "") {
            errors.push({ field: 'signup-password', message: 'Please enter your password.' });
        }
        if (confirmPasswordField.value.trim() === "") {
            errors.push({ field: 'confirm-password', message: 'Please confirm your password.' });
        }

        // Check if passwords match
        if (passwordField.value !== confirmPasswordField.value) {
            errors.push({ field: 'confirm-password', message: 'Passwords do not match.' });
        }

        // If there are no errors, proceed with registration
        if (errors.length === 0) {
            const formData = new FormData();
            formData.append('name', nameField.value.trim());
            formData.append('email', emailField.value.trim());
            formData.append('password', passwordField.value.trim());

            fetch('/register', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Registration successful, redirect to login page
                    document.getElementById("registration").reset(); // Reset registration form to be empty
                    document.querySelector(".login-link").click(); 
                } else {
                    // Registration failed, display error message
                    document.getElementById('registration-error').textContent = data.message;
                    errors.push({ field: 'register', message: 'Email already registered'});
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        } else {
            // Display all error messages
            errors.forEach(error => {
                document.getElementById(`${error.field}-error`).textContent = error.message;
            });
        }
    });
});

// code to switch between register and login pages
signUp.addEventListener("click", ()=> {
    container.classList.add("active");
    document.getElementById("log-in").reset();
 });
 login.addEventListener("click", ()=> {
    container.classList.remove("active");
    document.getElementById("registration").reset();
 });
 
 
