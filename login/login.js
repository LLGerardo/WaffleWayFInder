document.querySelector('form').addEventListener('submit', function (event) {
    // Add your validation logic here
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    if (!username || !password) {
        alert('Please enter both username and password');
        event.preventDefault(); // Prevent the form from submitting
    }
});
var passwordInput = document.getElementById('password');
var togglePassword = document.getElementById('toggle-password');

togglePassword.addEventListener('click', function () {
    passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
});
document.querySelector('form').addEventListener('submit', function (event) {
    event.preventDefault();

    // Collect form data
    var formData = new FormData(this);

    // Send data using AJAX (you might want to use a library like Axios or Fetch API)
    // Example using Fetch API:
    fetch('/login-url', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        // Handle the response
        console.log(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
});
