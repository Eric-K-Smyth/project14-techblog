// JavaScript for Delete Button
document.addEventListener('DOMContentLoaded', () => {
  // Add an event listener to the document for delete button clicks
  document.addEventListener('click', async (event) => {
      if (event.target.classList.contains('delete-btn')) {
          const postId = event.target.getAttribute('data-post-id');

          try {
              // Send an AJAX request to the delete route for the specific post
              const response = await fetch(`/dashboard/delete/${postId}`, {
                  method: 'GET',
              });

              if (response.ok) {
                  // If the post is deleted successfully, remove it from the dashboard without refreshing
                  event.target.closest('.post-item').remove();
              } else {
                  console.error('Failed to delete post');
              }
          } catch (err) {
              console.error(err);
          }
      }
  });
});

  