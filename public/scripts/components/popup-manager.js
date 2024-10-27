class PopupManager {
    constructor() {
        // Remove initializeEventListeners from constructor
    }

    // Remove initializeEventListeners method since we're handling clicks in signup.html

    createPopupContainer() {
        const popup = document.createElement('div');
        popup.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        return popup;
    }

    showAgeVerificationPopup(onConfirm) {
        const popup = this.createPopupContainer();
        const content = `
            <div class="bg-white rounded-[20px] p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div class="flex justify-end">
                    <button id="closePopup" class="text-gray-500 hover:text-gray-700 bg-gray-100 rounded-full p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div id="popupLogo" data-component="Logo" class="mx-auto mb-4 h-12"></div>
                <h1 class="mb-4 text-center">Are you 13 years old or older?</h1>
                <p class="text-gray-600 text-center mb-8 font-archivo text-xl font-normal text-black text-opacity-55">You're about to start an amazing learning adventure. StudyReel is here to make learning fun, exciting, and just for you!</p>
                <div class="flex space-x-4">
                    <button id="yesButton" class="flex-1 bg-[#3D75EA] text-white py-3 px-4 rounded-[16px] hover:bg-[#3D75EA]/90 font-archivo text-2xl font-semibold">Yes, I'm 13 or older</button>
                    <button id="noButton" class="flex-1 bg-[#F7F7F7] text-black py-3 px-4 rounded-[16px] hover:bg-[#F7F7F7]/90 font-archivo text-2xl font-semibold">No, I'm under 13</button>
                </div>
            </div>
        `;
        
        popup.innerHTML = content;
        document.body.appendChild(popup);

        // Keep this one as it has a Logo component
        if (typeof window.renderComponents === 'function') {
            setTimeout(window.renderComponents, 100);
        }

        this.attachPopupEventListeners(popup, onConfirm);  // Pass onConfirm to event listeners
    }

    showParentRedirectPopup() {
        const popup = this.createPopupContainer();
        const content = `
            <div class="bg-white rounded-[20px] p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto relative">
                <div class="flex justify-end mb-4">
                    <button id="closePopup" class="text-gray-500 hover:text-gray-700 bg-gray-100 rounded-full p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <img src="assets/popup_signup_gotoweb.png" alt="Dashboard Preview" class="w-full mb-8 rounded-lg">
                <h1 class="text-3xl font-bold mb-4 text-center">Visit website to signup</h1>
                <p class="text-gray-600 text-center mb-8 font-archivo text-xl font-normal text-black text-opacity-55">To access our specialized parent features, please create your account on our website</p>
                <a href="https://studyreel.com" target="_blank" rel="noopener noreferrer" class="w-full bg-[#3D75EA] text-white py-4 px-6 rounded-[16px] hover:bg-[#3D75EA]/90 font-archivo text-2xl font-semibold flex items-center justify-center">
                    Visit website
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 ml-2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                    </svg>
                </a>
            </div>
        `;
        
        popup.innerHTML = content;
        document.body.appendChild(popup);

        this.attachPopupEventListeners(popup);
    }

    showUnderagePopup() {
        const popup = this.createPopupContainer();
        const content = `
            <div class="bg-white rounded-[20px] p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div class="flex justify-end">
                    <button id="closePopup" class="text-gray-500 hover:text-gray-700 bg-gray-100 rounded-full p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div data-component="Logo" class="mx-auto mb-4 h-12"></div>
                <h1 class="text-3xl font-bold mb-4 text-center">Oops! You're not old enough</h1>
                <p class="text-gray-600 text-center mb-8 font-archivo text-xl font-normal text-black text-opacity-55">You need parent or guardian permission to use StudyReel. Please ask a parent or guardian to sign up.</p>
                <button id="backToSignup" class="w-full bg-[#F7F7F7] text-black py-4 px-6 rounded-[16px] hover:bg-[#F7F7F7]/90 font-archivo text-2xl font-semibold flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 mr-2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to signup
                </button>
            </div>
        `;
        
        popup.innerHTML = content;
        document.body.appendChild(popup);

        // Keep this one as it has a Logo component
        if (typeof window.renderComponents === 'function') {
            setTimeout(window.renderComponents, 100);
        }

        this.attachPopupEventListeners(popup);
    }

    attachPopupEventListeners(popup, onConfirm) {
        const closeBtn = popup.querySelector('#closePopup');
        const yesBtn = popup.querySelector('#yesButton');
        const noBtn = popup.querySelector('#noButton');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closePopup(popup));
        }

        if (yesBtn) {
            yesBtn.addEventListener('click', () => {
                this.closePopup(popup);
                this.onAgeVerified(onConfirm);
            });
        }

        if (noBtn) {
            noBtn.addEventListener('click', () => {
                this.closePopup(popup);
                this.showUnderagePopup();
            });
        }

        popup.addEventListener('click', (event) => {
            if (event.target === popup) {
                this.closePopup(popup);
            }
        });
    }

    closePopup(popup) {
        if (popup && popup.parentNode) {
            popup.parentNode.removeChild(popup);
        }
    }

    onAgeVerified(onConfirm) {
        // Show the signup form
        const initialContent = document.getElementById('initialContent');
        const signupForm = document.getElementById('signupForm');
        const termsText = document.getElementById('termsText');
        const signupTitle = document.getElementById('signupTitle');

        if (initialContent) initialContent.classList.add('hidden');
        if (signupForm) signupForm.classList.remove('hidden');
        if (termsText) termsText.classList.remove('hidden');
        if (signupTitle) signupTitle.textContent = 'Sign up';

        // Initialize email validation if the function exists
        if (typeof initializeEmailValidation === 'function') {
            initializeEmailValidation();
        }

        onConfirm();
    }
}

// Initialize on load
window.popupManager = new PopupManager();
