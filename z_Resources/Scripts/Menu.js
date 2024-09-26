var mobileMenu = document.getElementById('mobile'); // mobile div
var mobileIcon = document.querySelector('nav img'); // white icon
var mobileIconActive = document.querySelector('img#pink'); // pink icon

const toggleMenu = () => {
    // Check if menu is visible
    const isMenuVisible = mobileMenu.style.display === 'block';

    // Toggle menu visibility
    mobileMenu.style.display = isMenuVisible ? 'none' : 'block';

    // Toggle icon visibility (show one, hide the other)
    mobileIcon.style.display = isMenuVisible ? 'block' : 'none';
    mobileIconActive.style.display = isMenuVisible ? 'none' : 'block';
}

// Add event listeners to both icons
mobileIcon.addEventListener('click', toggleMenu);
mobileIconActive.addEventListener('click', toggleMenu);


// Handle condition on menu and icons are open while window is resized
window.addEventListener('resize', () => {
    if(window.innerWidth >= 750) {
        mobileMenu.style.display = 'none';
        mobileIcon.style.display = 'none';
        mobileIconActive.style.display = 'none';
    } else {
        // Keep the  white icon is visible on smaller screens
        if (mobileMenu.style.display !== 'block') {
            mobileIcon.style.display = 'block';
            mobileIconActive.style.display = 'none';
        }
    }
});