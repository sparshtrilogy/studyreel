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

// Expose the function globally
window.setNavbarActive = setActiveNavIcon;

// Create a global Alpine store for navbar apps
document.addEventListener('alpine:init', () => {
    Alpine.store('navbarApps', {
        apps: [],
        init() {
            const storedApps = localStorage.getItem('userApps');
            if (storedApps) {
                this.apps = JSON.parse(storedApps);
            }
        }
    });
});

function setNavbarActive(activeItem) {
    // Existing code for setting active nav item

    // Refresh app icons when navbar is updated
    if (Alpine.store('navbarApps')) {
        Alpine.store('navbarApps').init();
    }
}