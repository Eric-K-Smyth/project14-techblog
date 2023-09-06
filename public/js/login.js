const loginFormHandler = async (event) => {
  event.preventDefault();

  // Collect values from the login form
  const username = document.querySelector('#username-login').value.trim();
  const password = document.querySelector('#password-login').value.trim();

  console.log('Username:', username); // debugging
  console.log('Password:', password); // debugging

  if (username && password) {
    // Send a POST request to the API endpoint for login
    const response = await fetch('/api/user/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
        // If successful, retrieve user information from the response
        const { user } = await response.json();

        // Store user information in session storage
        sessionStorage.setItem('userId', user.id);
        sessionStorage.setItem('username', user.username);
      
      // If successful, redirect the browser to the dashboard page
      document.location.replace('/dashboard');
    } else {
      alert(response.statusText);
    }
  }
};

const signupFormHandler = async (event) => {
  event.preventDefault();

  // Collect values from the signup form
  const nameInput = document.querySelector('#name-signup');
  const passwordInput = document.querySelector('#password-signup');

  if (nameInput && passwordInput) {
    const name = nameInput.value.trim();
    const password = passwordInput.value.trim();

    if (name && password) {
      const response = await fetch('/api/user', {
        method: 'POST',
        body: JSON.stringify({ username: name, password }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        document.location.replace('/');
      } else {
        alert(response.statusText);
      }
    } else {
      alert('Please fill out all fields.');
    }
  } else {
    alert('Form elements not found.');
  }
};


document
  .querySelector('.login-form')
  .addEventListener('submit', loginFormHandler);

document
  .querySelector('.signup-form')
  .addEventListener('submit', signupFormHandler);

