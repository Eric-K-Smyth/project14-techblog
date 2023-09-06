// Get references to the form and input elements
const newPostForm = document.querySelector('#new-post-form');
const titleInput = document.querySelector('#post-title');
const contentInput = document.querySelector('#post-content');
const userId = sessionStorage.getItem('userId');
// Function to handle form submission
const createNewPost = async (event) => {
  event.preventDefault();
  console.log('newPostForm:', newPostForm);
  console.log('titleInput:', titleInput);
  console.log('contentInput:', contentInput);
  // Get the values from the input fields
  const title = titleInput.value.trim();
  const body = contentInput.value.trim();

  if (title && body) {
  
    // Send a POST request to create a new blog post with the userId included
    const response = await fetch('/api/posts', {
      method: 'POST',
      body: JSON.stringify({ title, body, userId }), // Include userId in the request body
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      // If the post is created successfully, redirect to the dashboard
      document.location.replace('/dashboard');
    } else {
      alert('Failed to create a new blog post');
    }
  }
};
console.log('newPostForm:', newPostForm);
console.log('titleInput:', titleInput);
console.log('contentInput:', contentInput);
// Add an event listener to the form for submission
newPostForm.addEventListener('submit', createNewPost);

