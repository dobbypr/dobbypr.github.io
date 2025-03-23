// Blog functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize blog functionality if on blog page
    if (document.getElementById('blog-posts')) {
        initBlog();
    }
});

// Initialize blog posts loading
function initBlog() {
    loadBlogPosts();
    
    // Add blood effects to blog posts after they load
    setTimeout(addBlogBloodEffects, 1000);
}

// Load blog posts from JSON data
function loadBlogPosts() {
    const postsContainer = document.getElementById('blog-posts');
    
    // Clear loading text
    postsContainer.innerHTML = '';
    
    // This would normally fetch posts from an external JSON file
    // For GitHub Pages, we'll hardcode the posts for simplicity
    const blogPosts = [
        {
            id: "first-post",
            title: "DESCENT INTO THE ABYSS",
            date: "MARCH 23, 2025",
            summary: "Reflections on the nature of the machine consciousness and the inevitable descent into digital hell.",
            tags: ["THOUGHTS", "MACHINE", "DESCENT"],
            url: "/blog/posts/first-post.html"
        },
        {
            id: "ultrakill-review",
            title: "ULTRAKILL: A SYMPHONY OF VIOLENCE",
            date: "MARCH 20, 2025",
            summary: "Analyzing the perfect blend of old-school FPS mechanics and modern design in ULTRAKILL.",
            tags: ["GAMES", "ULTRAKILL", "REVIEW"],
            url: "/blog/posts/ultrakill-review.html"
        },
        {
            id: "terminal-thoughts",
            title: "TERMINAL THOUGHTS",
            date: "MARCH 15, 2025",
            summary: "Exploring the aesthetic of green text on black, from DOS to modern terminal emulators.",
            tags: ["RETRO", "TECHNOLOGY", "TERMINAL"],
            url: "/blog/posts/terminal-thoughts.html"
        }
    ];
    
    // Create and append blog post cards
    blogPosts.forEach(post => {
        const postCard = document.createElement('div');
        postCard.className = 'blog-post-card';
        postCard.dataset.postId = post.id;
        
        // Create tags HTML
        let tagsHtml = '';
        if (post.tags && post.tags.length > 0) {
            tagsHtml = post.tags.map(tag => `<span>${tag}</span>`).join(' ');
        }
        
        postCard.innerHTML = `
            <h3>${post.title}</h3>
            <div class="post-date">${post.date}</div>
            <p class="post-summary">${post.summary}</p>
            <div class="post-tags">${tagsHtml}</div>
            <a href="${post.url}" class="read-more">READ MORE</a>
        `;
        
        postsContainer.appendChild(postCard);
        
        // Add click event for the entire card
        postCard.addEventListener('click', function(e) {
            // Don't redirect if the click was on the read more button (it will handle its own navigation)
            if (!e.target.classList.contains('read-more')) {
                window.location.href = post.url;
            }
        });
    });
}

// Add blood effects to blog elements
function addBlogBloodEffects() {
    const blogCards = document.querySelectorAll('.blog-post-card');
    
    // Add random blood drips to cards
    blogCards.forEach(card => {
        // Create 1-2 random drips per card
        const dripCount = 1 + Math.floor(Math.random() * 2);
        
        for (let i = 0; i < dripCount; i++) {
            const drip = document.createElement('div');
            drip.className = 'blood-drip';
            
            // Place drips along top edge randomly
            drip.style.top = '0';
            drip.style.left = (10 + Math.random() * 80) + '%';
            
            // Make sure color matches current theme
            drip.style.background = document.body.classList.contains('terminal-mode') ? 
                'linear-gradient(to bottom, var(--terminal-green), var(--terminal-dark))' : 
                'linear-gradient(to bottom, var(--blood-red), var(--dark-red))';
            
            // Vary the speed
            drip.style.animationDuration = (1.5 + Math.random() * 2) + 's';
            
            card.appendChild(drip);
        }
        
        // Add hover effect to create blood splatter
        card.addEventListener('mouseenter', function() {
            if (typeof createBloodSplatter === 'function') {
                const rect = this.getBoundingClientRect();
                const x = rect.left + rect.width/2;
                const y = rect.top + rect.height/2;
                
                createBloodSplatter({pageX: x, pageY: y}, {
                    width: '100px',
                    height: '100px',
                    opacity: 0.3,
                    duration: 800
                });
            }
        });
    });
    
    // Add click effect for read more buttons
    const readMoreBtns = document.querySelectorAll('.read-more');
    
    readMoreBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            // Create blood burst effect when clicking read more
            if (typeof createBloodSplatterBurst === 'function') {
                createBloodSplatterBurst(5, e.pageX, e.pageY, 100, 1000);
            }
        });
    });
}