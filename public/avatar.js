// import { OpenAIClient, ClaudeAIClient } from 'alpha-ai-avatar-sdk-js';

const AVATAR_CLIENT = new Avatar.AvatarClient({ 
    apiKey: 'Hy781mdjalfi1990d',
    conversational: true
});

// Check if OpenAIClient is available directly or as a property of Avatar
const OpenAIClient = Avatar.OpenAIClient || Avatar.AvatarClient.OpenAIClient;
const ClaudeAIClient = Avatar.ClaudeAIClient || Avatar.AvatarClient.ClaudeAIClient;

const openai = new OpenAIClient({
    apiKey: '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',

});

const claude = new ClaudeAIClient({
    apiKey: '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',
});

let currentAvatarId;
let avatarInitialized = false;

const avatarDisplay = document.getElementById('avatar-display');
const chatInput = document.getElementById('chat-input');
const speakButton = document.getElementById('speak-button');
const avatarContainer = document.getElementById('avatar-container');
const interactionPrompt = document.getElementById('interaction-prompt');
const chatContainer = document.getElementById('chat-container');

document.addEventListener('DOMContentLoaded', async () => {
    // ... existing code ...

    avatarSelector = document.getElementById('avatar-selector');
    avatarOptions = document.getElementById('avatar-options');
    const avatarContainer = document.getElementById('avatar-container');
    const closeButton = document.querySelector('.close-button');

    if (avatarContainer) {
        avatarContainer.addEventListener('click', () => {
            if (avatarSelector) {
                avatarSelector.classList.remove('hidden');
                loadAvatars();
            } else {
                console.error('Avatar selector element not found');
            }
        });
    } else {
        console.error('Avatar container element not found');
    }

    if (closeButton) {
        closeButton.addEventListener('click', () => {
            if (avatarSelector) {
                avatarSelector.classList.add('hidden');
            }
        });
    } else {
        console.error('Close button element not found');
    }

    // Close the modal if clicking outside of it
    avatarSelector.addEventListener('click', (event) => {
        if (event.target === avatarSelector) {
            avatarSelector.classList.add('hidden');
        }
    });

    // ... rest of the existing code ...
});

let avatarSelector;
let avatarOptions;

avatarContainer.addEventListener('click', () => {
    avatarSelector.classList.remove('hidden');
    loadAvatars();
});

const closeButton = document.querySelector('.close-button');
closeButton.addEventListener('click', () => {
    avatarSelector.classList.add('hidden');
});

async function loadAvatars() {
    avatarOptions.innerHTML = ''; // Clear previous content

    try {
        const avatars = await AVATAR_CLIENT.getAvatars();

        avatars.forEach(avatar => {
            const avatarOption = document.createElement('div');
            avatarOption.className = 'flex flex-col items-center p-2 cursor-pointer transition transform hover:scale-105';

            const avatarImage = document.createElement('img');
            avatarImage.src = avatar.thumbnail || 'placeholder.png';
            avatarImage.alt = avatar.name;
            avatarImage.className = 'w-20 h-20 rounded-full object-cover mb-2';
            avatarOption.appendChild(avatarImage);

            const avatarLabel = document.createElement('span');
            avatarLabel.textContent = avatar.name;
            avatarLabel.className = 'text-sm text-center';
            avatarOption.appendChild(avatarLabel);

            avatarOption.addEventListener('click', () => selectAvatar(avatar.id));

            avatarOptions.appendChild(avatarOption);
        });
    } catch (error) {
        console.error('Error loading avatars:', error);
    }
}

async function selectAvatar(avatarId) {
    try {
        await AVATAR_CLIENT.switchAvatar(avatarId);
        currentAvatarId = avatarId;
        avatarSelector.classList.add('hidden');
    } catch (error) {
        console.error('Error switching avatar:', error);
    }
}

async function initializeAvatar() {
    if (avatarInitialized) return;
    avatarInitialized = true;

    const videoElement = document.createElement('video');
    videoElement.autoplay = true;
    videoElement.playsInline = true;
    videoElement.muted = true;
    videoElement.style.width = '100%';
    videoElement.style.height = '100%';
    avatarDisplay.innerHTML = ''; // Clear any existing avatar
    avatarDisplay.appendChild(videoElement);

    const audioElement = document.createElement('audio');
    audioElement.style.display = 'none';
    audioElement.autoplay = true;
    document.body.appendChild(audioElement);

    await AVATAR_CLIENT.init({ videoElement }, audioElement);
    
    if (!currentAvatarId) {
        const avatars = await AVATAR_CLIENT.getAvatars();
        currentAvatarId = avatars[0].id;
    }
    
    await AVATAR_CLIENT.connect(currentAvatarId);

    AVATAR_CLIENT.addEventListener('transcription', handleTranscript);
    AVATAR_CLIENT.addEventListener('audio', handleAudio);
    AVATAR_CLIENT.addEventListener('error', handleError);
}

function addMessage(content, isUser = false) {
    console.log('addMessage called with content:', content, 'isUser:', isUser);
    
    const messageDiv = document.createElement('div');
    messageDiv.className = isUser ? 'flex justify-end mb-4' : 'flex mb-4';
    
    const innerDiv = document.createElement('div');
    innerDiv.className = isUser ? 'bg-[#38D7D3] text-white rounded-lg p-3 max-w-3/4 shadow' : 'bg-white rounded-lg p-3 max-w-3/4 shadow';
    
    const paragraph = document.createElement('p');
    paragraph.className = 'text-sm';
    paragraph.textContent = content;
    
    innerDiv.appendChild(paragraph);
    messageDiv.appendChild(innerDiv);
    chatContainer.appendChild(messageDiv);
    
    // Scroll to the bottom of the chat container
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

async function sendMessage() {
    const text = chatInput.value.trim();
    console.log('sendMessage called with text:', text);
    if (text) {
        addMessage(text, true);
        chatInput.value = '';
        
        console.log('Sending message to LLM:', text);
        
        // Choose which LLM to use (you can modify this logic as needed)
        const useClaude = true; // Set to false to use OpenAI instead
        
        let response;
        if (useClaude) {
            const claudeResponse = await claude.getCompletions(
                'claude-3-opus-20240229',
                [{ role: 'user', content: text }]
            );
            response = claudeResponse.content[0].text;
        } else {
            const openAIResponse = await openai.getCompletions(
                'alpha-avatar-gpt-4o',
                [{ role: 'user', content: text }]
            );
            response = openAIResponse;
        }
        
        console.log('Received LLM response:', response);
        
        // Add the LLM response to the chat interface
        addMessage(response, false);
        
        await AVATAR_CLIENT.say(response);
        console.log('Avatar speaking LLM response');
    }
}

function handleTranscript(transcript) {
    console.log('Received text response:', transcript);
    addMessage(transcript, 'avatar');
}

function handleAudio(audioChunk) {
    console.log('Received audio chunk');
    // Audio playback is handled automatically by the SDK
}

function handleError(error) {
    console.error('Error:', error);
}

function resumeAudioContext() {
    if (AVATAR_CLIENT.audioContext && AVATAR_CLIENT.audioContext.state === 'suspended') {
        AVATAR_CLIENT.audioContext.resume();
    }
}

function onFirstUserInteraction() {
    if (!avatarInitialized) {
        initializeAvatar();
    }
    resumeAudioContext();

    interactionPrompt.style.display = 'none';

    document.removeEventListener('click', onFirstUserInteraction);
    document.removeEventListener('keydown', onFirstUserInteraction);
}

// Event listeners
speakButton.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        console.log('Enter key pressed, calling sendMessage');
        sendMessage();
    }
});

document.addEventListener('click', onFirstUserInteraction);
document.addEventListener('keydown', onFirstUserInteraction);
