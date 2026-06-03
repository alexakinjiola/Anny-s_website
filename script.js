3. JavaScript (script.js)
Use this for simple enhancements, like sticky headers or hover effects.

JavaScript
// Simple scroll effect for Navbar
window.addEventListener('scroll', () => {
    const nav = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        nav.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
    } else {
        nav.style.backgroundColor = 'transparent';
    }
});