// Get references to the form and input elements
const newPostForm = document.querySelector('#new-post-form');
const titleInput = document.querySelector('#post-title');
const contentInput = document.querySelector('#post-content');

// Function to handle form submission
const createNewPost = async (event) => {
  event.preventDefault();

  // Get the values from the input fields
  const title = titleInput.value.trim();
  const content = contentInput.value.trim();

  if (title && content) {
    // Send a POST request to create a new blog post
    const response = await fetch('/api/posts', {
      method: 'POST',
      body: JSON.stringify({ title, content }),
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

// Add an event listener to the form for submission
newPostForm.addEventListener('submit', createNewPost);
