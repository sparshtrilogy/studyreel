const AVATAR_CLIENT = new Avatar.AvatarClient({ 
    apiKey: 'Hy781mdjalfi1990d',
    conversational: true
});
let currentAvatarId;
let avatarInitialized = false;

const avatarDisplay = document.getElementById('avatar-display');
const chatInput = document.getElementById('chat-input');
const speakButton = document.getElementById('speak-button');
const avatarContainer = document.getElementById('avatar-container');
const interactionPrompt = document.getElementById('interaction-prompt');
const chatContainer = document.getElementById('chat-container');

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
        await AVATAR_CLIENT.say(text);
        console.log('Message sent to LLM');
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
    console.log('Keypress event fired', e.key);
    if (e.key === 'Enter') {
        console.log('Enter key pressed, calling sendMessage');
        sendMessage();
    }
});

document.addEventListener('click', onFirstUserInteraction);
document.addEventListener('keydown', onFirstUserInteraction);

// Initialize the app
// The avatar will be initialized after the first user interaction
