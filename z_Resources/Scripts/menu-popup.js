var mobileMenu = document.getElementById('mobile');
var mobileIcon = document.querySelector('nav img')
var mobileIconActive = document.querySelector('img#pink')

function toggleMenu() {
    // Toggle the menu display
    const isMenuVisible = mobileMenu.style.display === 'block';

    mobileMenu.style.display = isMenuVisible ? 'none' : 'block';
    mobileIcon.style.display = isMenuVisible ? 'block' : 'none';
    mobileIconActive.style.display = isMenuVisible ? 'none' : 'block';
}

// Add event listeners to both icons
mobileIcon.addEventListener('click', toggleMenu);
mobileIconActive.addEventListener('click', toggleMenu);

