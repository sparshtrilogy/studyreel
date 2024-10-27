const AVATAR_CLIENT = new Avatar.AvatarClient({ 
    apiKey: 'Hy781mdjalfi1990d',
    conversational: true
});

async function loadAvatars() {
    const avatarOptionsContainer = document.getElementById('avatar-options');
    avatarOptionsContainer.innerHTML = ''; // Clear existing avatars
    
    try {
        const avatars = await AVATAR_CLIENT.getAvatars();
        
        avatars.forEach(avatar => {
            // Create avatar option element with initial styles
            const avatarOption = document.createElement('div');
            avatarOption.className = 'flex flex-col items-center p-2 rounded-lg cursor-pointer transition-all duration-200 ease-in-out';
            avatarOption.style.backgroundColor = 'white'; // Set initial background
            avatarOption.style.border = '2px solid transparent'; // Set initial border
            avatarOption.setAttribute('data-avatar', avatar.id);
            avatarOption.onclick = () => selectAvatar(avatarOption);
            
            // Create and set up thumbnail image
            const avatarImage = document.createElement('img');
            avatarImage.src = avatar.thumbnail;
            avatarImage.alt = avatar.name;
            avatarImage.className = 'w-[60px] h-[60px] rounded-full mb-1';
            
            // Create and set up name label
            const avatarLabel = document.createElement('span');
            avatarLabel.textContent = avatar.name;
            avatarLabel.className = 'avatar-caption font-archivo text-black text-opacity-55 whitespace-normal text-center w-fit';
            
            // Append elements
            avatarOption.appendChild(avatarImage);
            avatarOption.appendChild(avatarLabel);
            avatarOptionsContainer.appendChild(avatarOption);
        });

        // Select the first avatar by default
        const firstAvatar = avatarOptionsContainer.firstChild;
        if (firstAvatar) {
            selectAvatar(firstAvatar);
        }
    } catch (error) {
        console.error('Error loading avatars:', error);
    }
}

// Modified selectAvatar function to work with dynamic avatars
async function selectAvatar(element) {
    try {
        // Remove selected class from all avatars
        document.querySelectorAll('#avatar-options > div').forEach(avatar => {
            avatar.classList.remove('avatar-selected');
            avatar.querySelector('.avatar-caption').classList.remove('text-[#3D75EA]');
        });
        
        // Add selected class to clicked avatar
        element.classList.add('avatar-selected');
        element.querySelector('.avatar-caption').classList.add('text-[#3D75EA]');
        
        // Store the selected avatar ID
        const selectedAvatarId = element.getAttribute('data-avatar');
        console.log('Selected avatar ID:', selectedAvatarId);
        
        // Only try to switch avatar if AVATAR_CLIENT is initialized and selectedAvatarId exists
        if (AVATAR_CLIENT && selectedAvatarId) {
            await AVATAR_CLIENT.switchAvatar(selectedAvatarId);
        }
    } catch (error) {
        // Log error but don't throw it since the UI update should still work
        console.warn('Error switching avatar:', error);
    }
}

// Initialize avatars when the page loads
document.addEventListener('DOMContentLoaded', () => {
    loadAvatars();
});
