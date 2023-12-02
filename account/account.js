document.getElementById('accountForm').addEventListener('submit', function (event) {
    event.preventDefault();

    // Collect form data
    var formData = new FormData(this);

    // Send data using AJAX (you might want to use a library like Axios or Fetch API)
    // Example using Fetch API:
    fetch('/create-account-url', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        // Handle the response (e.g., show success message)
        console.log(data);
        alert('Account created successfully!');
    })
    .catch(error => {
        console.error('Error:', error);
        // Handle the error (e.g., show error message)
        alert('Error creating account. Please try again.');
    });
});
