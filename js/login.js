
// Define the API Gateway URL
   // Replace with your actual API URL
    const apiUrl = process.env.USER_API_URL;
    
    function getUserIdFromToken(token) {
    try {
        // Decode the JWT token
        const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decoding JWT token
        
        // Extract userId from the decoded token
        const userId = decodedToken.userId; // Assuming userId is stored in the token payload
        
        return userId;
    } catch (error) {
        console.error('Error decoding token:', error);
        return null; // Return null if unable to decode token or extract userId
    }
}
        // Function to handle login form submission
document.getElementById('loginFormContent').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission
    
    // Get form data
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    // Construct request data
    const requestData = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    };
    
    // Make API request
    fetch(apiUrl + '/login', requestData)
        .then(response => {
            if (response.status === 200) {
                // Handle successful login
                return response.json(); // Parse response body as JSON
            } else {
                // Handle login failure
                throw new Error('Login failed');
            }
        })
        .then(data => {
            const token = data.token;
            const userId = getUserIdFromToken(token);

            // Save the user ID to local storage
            localStorage.setItem('userId', userId);

            // Save the token to local storage
            localStorage.setItem('token', token);
            // Redirect to the home page or perform other actions
            window.location.href = 'index.html';
        })
        .catch(error => {
            // Handle login failure or other errors
            console.error('Error:', error);
            alert('Login failed. Please try again.');
        });
});


        // Function to handle signup form submission
        document.getElementById('signupFormContent').addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent form submission
            
            // Get form data
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('signupConfirmPassword').value;

            // Check if passwords match
            if (password !== confirmPassword) {
                alert('Passwords do not match.');
                return;
            }

            // Check if password meets minimum length requirement
            if (password.length < 8) {
                document.getElementById('passwordError').style.display = 'block';
                return;
            } else {
                document.getElementById('passwordError').style.display = 'none';
            }

            // Construct request data
            const requestData = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            };
            
            // Make API request
            fetch(apiUrl + '/signup', requestData)
                .then(response => {
                    if (response.ok) {
                        // Handle successful signup
                        alert('Sign up successful!');
                        loginForm.classList.remove('hidden');
                        signupForm.classList.add('hidden');
                    } else if (response.status === 400) {
                        // Handle user already exists
                        alert('User already exists. Please try a different email.');
                    } else {
                        // Handle signup failure
                        alert('Sign up failed. Please try again.');
                    }
                })
                .catch(error => {
                    // Handle network errors
                    console.error('Error:', error);
                    alert('An error occurred. Please try again later.');
                });
        });
        const loginForm = document.getElementById('loginForm');
        const signupForm = document.getElementById('signupForm');
        const signupLink = document.getElementById('signupLink');
        const loginLink = document.getElementById('loginLink');

        signupLink.addEventListener('click', function() {
            loginForm.classList.add('hidden');
            signupForm.classList.remove('hidden');
        });

        loginLink.addEventListener('click', function() {
            loginForm.classList.remove('hidden');
            signupForm.classList.add('hidden');
        });

// Get the header title element
const headerTitle = document.getElementById('headerTitle');

// Add event listener to the header title
headerTitle.addEventListener('click', function() {
    console.log('Header title clicked'); // Log a message to the console
    // Navigate to index.html
    window.location.href = 'index.html';
});