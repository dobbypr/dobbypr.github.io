# ULTRALAYER

A chaotic, retro-styled personal website inspired by ULTRAKILL's aesthetic with a blood-red-on-black color scheme, interactive effects, and a dynamic blog.

![ULTRALAYER Screenshot](https://placeholder-for-screenshot.com) <!-- Consider adding a real screenshot -->

## Description

ULTRALAYER is a tribute to both old-school web design and the indie FPS game ULTRAKILL. The site features:

-   Retro-styled UI elements with a dark, blood-red theme.
-   Interactive blood splatter effects on click.
-   Pulsing text and neon flicker animations.
-   Scrolling marquee text banners.
-   A dynamic blog system that automatically lists posts from a central data file.
-   Themed pages for Music, Sins, and Blog content.
-   Terminal Mode: An alternate green-on-black CRT aesthetic toggle.
-   Parallax background effects.
-   Responsive layout for different screen sizes.

## Live Demo

Visit the live site: [ULTRALAYER](https://dobbypr.github.io) <!-- Update if this URL is correct -->

## Installation

To run this project locally:

1.  Clone the repository
    ```bash
    git clone https://github.com/dobbypr/dobbypr.github.io.git
    ```
2.  Navigate to the project folder
    ```bash
    cd dobbypr.github.io
    ```
3.  Open `index.html` in your browser.

No build steps or external dependencies required!

## Project Structure

```
dobbypr.github.io/
├── index.html # Main landing page
├── music.html # Music showcase page
├── sins.html # Sins showcase page
├── blog.html # Main blog listing page (dynamically populated)
├── css/
│ ├── base.css # Core styles, variables, fonts
│ ├── animations.css # Keyframe animations
│ ├── components.css # Reusable component styles (header, nav, cards, etc.)
│ ├── interactive.css # Styles for loading screen, toggles, etc.
│ ├── terminal-mode.css # Styles activated by terminal mode toggle
│ └── pages/ # Page-specific styles
│ ├── home.css
│ ├── music.css
│ ├── sins.css
│ └── blog.css # Styles for blog list and individual posts
├── js/
│ ├── core.js # Core site functionality (if any)
│ ├── audio.js # Audio handling (if any)
│ ├── effects.js # Blood splatter, parallax, etc.
│ ├── terminal.js # Terminal mode toggle logic
│ └── blog.js # Fetches blog_data.json and builds blog.html listing
├── images/ # Site images (favicon, backgrounds, icons)
│ └── favicon.png
├── posts/ # Folder containing individual blog post HTML files
│ └── first-post.html
│ └── (more posts)...
├── blog_data.json # JSON file listing all blog posts for dynamic loading
├── fonts/ # Font files
├── README.md # This documentation file
└── GOALS.MD # Project goals/task list
└── LICENSE # Project license file (Recommended)
```


## Key Features

-   **ULTRAKILL Aesthetic**: Blood-red on black, pixel grid, retro fonts.
-   **Dynamic Blog**: `blog.html` automatically lists posts defined in `blog_data.json`. New posts only require creating an HTML file in `/posts` and adding an entry to the JSON.
-   **Interactive Effects**: Click-to-splatter blood, pulsing/glitching text, hover effects.
-   **Terminal Mode**: Switch between the default blood-red theme and a green-on-black CRT look.
-   **Parallax Background**: Subtle depth effect on scroll.
-   **Loading Screen**: Thematic loading animation on first visit (session-based).
-   **Responsive Design**: Adapts to various screen sizes.

## Blog Workflow

1.  **Create Post HTML**: Copy an existing file in the `/posts` directory (e.g., `posts/first-post.html`) and rename it (e.g., `posts/new-entry.html`). Edit the content, title, date, and tags within this new file. **Do not change the relative `../` paths** for CSS/JS/navigation.
2.  **Update `blog_data.json`**: Open `blog_data.json` in the root folder. Add a new JSON object for your post at the beginning of the array. Fill in the `title`, `date`, `summary`, `file` (e.g., `"posts/new-entry.html"`), and `tags`. Ensure correct JSON syntax (double quotes, commas between objects).
3.  **Test**: View `blog.html` to see the new listing and click the link to verify the post page.

## Credits

-   Inspired by the aesthetic of [ULTRAKILL](https://store.steampowered.com/app/1229490/ULTRAKILL/) by Arsi "Hakita" Patala.
-   Font: Droid Serif Pro WGL Bold (or similar).
-   Built with vanilla HTML, CSS, and JavaScript.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. (If you don't have a LICENSE file, you should add one, e.g., by copying the MIT License text into a file named `LICENSE`).
