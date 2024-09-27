function loadAppsFromLocalStorage() {
    console.log("loadAppsFromLocalStorage function called");
    const savedApps = JSON.parse(localStorage.getItem('navbarApps')) || [];
    console.log("Saved apps:", savedApps);
    const appIconsContainer = document.getElementById('appIcons');
    
    if (!appIconsContainer) {
        console.warn("App icons container not found. This might be normal if you're on a page without the navbar.");
        return;
    }

    savedApps.forEach(app => {
        console.log("Adding app:", app.name);
        const newAppIcon = document.createElement('div');
        newAppIcon.className = 'nav-icon w-14 h-14 bg-white rounded-xl flex items-center justify-center';
        newAppIcon.setAttribute('data-app-name', app.name);
        newAppIcon.innerHTML = `
            <img src="${app.icon}" class="w-14 h-14 rounded-xl" alt="${app.name} Icon">
        `;
        appIconsContainer.appendChild(newAppIcon);
    });
    console.log("Finished loading apps from local storage");
}

function addAppToNavbar(button) {
    console.log("addAppToNavbar function called");
    
    const appName = button.getAttribute('data-app-name');
    const appIcon = button.getAttribute('data-app-icon');
    const appIconsContainer = document.getElementById('appIcons');
    
    console.log("App Name:", appName);
    console.log("App Icon:", appIcon);
    console.log("App Icons Container:", appIconsContainer);

    // Check if the app is already in the navbar
    const existingApp = appIconsContainer.querySelector(`[data-app-name="${appName}"]`);
    console.log("Existing App:", existingApp);

    if (existingApp) {
        console.log("App already exists in navbar");
        alert('This app is already in your navbar.');
        return;
    }

    // Create the new app icon element
    const newAppIcon = document.createElement('div');
    newAppIcon.className = 'nav-icon w-14 h-14 bg-white rounded-xl flex items-center justify-center';
    newAppIcon.setAttribute('data-app-name', appName);
    newAppIcon.innerHTML = `
        <img src="${appIcon}" class="w-14 h-14 rounded-xl" alt="${appName} Icon">
    `;

    // Add the new app icon to the navbar
    appIconsContainer.appendChild(newAppIcon);
    console.log("New app icon added:", newAppIcon);

    // Optional: Disable the "Get App" button or change its text
    button.textContent = 'Added';
    button.disabled = true;
}
