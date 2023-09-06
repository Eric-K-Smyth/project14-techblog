document.addEventListener('DOMContentLoaded', async () => {
    // Get references to the form and input elements
    const commentForm = document.querySelector('#comment-form');
    const commentBodyInput = document.querySelector('#commentBody');
    const commentsSection = document.querySelector('.comments');
    const commentsList = commentsSection ? commentsSection.querySelector('ul') : null;

    // Function to format the date as "MM/DD/YYYY"
const formatDate = (date) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(date).toLocaleDateString(undefined, options);
};
    // Function to update the comment section
const updateComments = (comments) => {
    if (commentsList) {
        commentsList.innerHTML = ''; // Clear the existing comments

        if (comments.length) {
            comments.forEach((comment) => {
                const commentItem = document.createElement('li');
                commentItem.innerHTML = `
                    <p>${comment.body}</p>
                    <p>Comment by: ${comment.User.username}</p>
                    <p>Date: ${formatDate(comment.createdAt)}</p> 
                    `;
                commentsList.appendChild(commentItem);
            });
        } else {
            commentsList.innerHTML = '<p>No comments yet.</p>';
        }
    }
};

    // Function to fetch and display comments
    const fetchAndDisplayComments = async () => {
        const postId = window.location.pathname.split('/').pop();

        // Fetch comments for the current post
        const commentsResponse = await fetch(`/comment/${postId}`);
        if (commentsResponse.ok) {
            const commentsData = await commentsResponse.json();
            updateComments(commentsData);
        }
    };

    // Fetch and display comments when the page loads
    await fetchAndDisplayComments();

    // Function to handle comment submission
    const createComment = async (event) => {
        event.preventDefault();

        // Get the values from the comment input field
        const commentBody = commentBodyInput.value.trim();

        if (commentBody) {
            const postId = window.location.pathname.split('/').pop();
            console.log('postId:', postId); // Add this line for debugging

            // Set the action attribute of the form dynamically
            commentForm.action = `/comment/${postId}`;

            // Send a POST request to create a new comment
            const response = await fetch(commentForm.action, {
                method: 'POST',
                body: JSON.stringify({ body: commentBody }),
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.ok) {
                // If the comment is created successfully, fetch and update the comments
                await fetchAndDisplayComments();

                // Clear the comment input field
                commentBodyInput.value = '';
            } else {
                alert('Failed to add a comment');
            }
        }
    };

    // Add an event listener to the comment form for submission
    commentForm.addEventListener('submit', createComment);
});
