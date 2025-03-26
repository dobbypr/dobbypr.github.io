// js/blog.js

document.addEventListener('DOMContentLoaded', () => {
    const blogPostsContainer = document.getElementById('blog-posts');

    if (!blogPostsContainer) {
        console.error("Blog posts container not found!");
        return;
    }

    fetch('blog_data.json') // Fetch the JSON data file
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(posts => {
            blogPostsContainer.innerHTML = ''; // Clear the loading message

            if (!posts || posts.length === 0) {
                blogPostsContainer.innerHTML = '<p class="no-posts">NO TRANSMISSIONS FOUND.</p>';
                return;
            }

            // Sort posts by date if needed (assuming newest first in JSON is sufficient for now)
            // posts.sort((a, b) => new Date(b.date) - new Date(a.date)); // Uncomment if dates are consistently formatted like YYYY-MM-DD

            posts.forEach(post => {
                const postElement = document.createElement('div');
                postElement.classList.add('blog-post-card');

                // Construct the inner HTML for the card using data from the JSON
                postElement.innerHTML = `
                    <h3>${post.title}</h3>
                    <div class="post-date">${post.date}</div>
                    <p class="post-summary">${post.summary}</p>
                    <a href="${post.file}" class="read-more">READ TRANSMISSION</a>
                `;
                // Consider adding tags here if you want them on the summary card
                // <div class="post-tags">${post.tags.map(tag => `<span>${tag}</span>`).join(' ')}</div>

                blogPostsContainer.appendChild(postElement);
            });
        })
        .catch(error => {
            console.error('Error loading blog posts:', error);
            blogPostsContainer.innerHTML = '<p class="error-text">ERROR LOADING TRANSMISSIONS. THE MACHINE IS SILENT.</p>';
        });
});