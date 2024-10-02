function setActiveNavIcon(currentPage) {
    const icons = document.querySelectorAll('.nav-icon');
    icons.forEach(icon => {
        if (icon.dataset.page === currentPage) {
            icon.classList.add('relative', 'w-16', 'h-16', 'border-2', 'rounded-xl', 'border-blue-500','flex', 'items-center','justify-center');
            icon.classList.remove('bg-white');            
            icon.classList.add('bg-blue-500', 'rounded-xl', 'flex', 'items-center', 'justify-center');
            icon.querySelector('svg').classList.add('text-white', 'fill="none"');
            icon.querySelector('svg').classList.remove('text-gray-500', 'stroke="currentColor"');
        } else {
            icon.classList.remove('w-16', 'h-16', 'border-2', 'border-blue-500', 'bg-blue-500');
            icon.classList.add('w-14', 'h-14', 'bg-white');
            icon.querySelector('svg').classList.remove('text-white');
            icon.querySelector('svg').classList.add('text-gray-500');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname;
    const navIcons = document.querySelectorAll('.nav-icon');

    navIcons.forEach(icon => {
        if (icon.href.includes(currentPath)) {
            icon.classList.add('selected'); // This class should apply the blue background
        }
    });
});

// Make setActiveNavIcon available globally
window.setNavbarActive = setActiveNavIcon;

function navbarComponent() {
    return {
        isLearningMode: false,
        init() {
            // Determine if we're on the learning mode page
            this.isLearningMode = window.location.pathname.includes('learning_mode.html');
        }
    }
}

// No need for the Alpine.data call here