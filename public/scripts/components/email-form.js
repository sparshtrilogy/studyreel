class EmailForm {
    constructor() {
        this.initialize();
    }

    initialize() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeElements());
        } else {
            this.initializeElements();
        }
    }

    initializeElements() {
        // Get all required elements
        this.initialContent = document.getElementById('initialContent');
        this.signupForm = document.getElementById('signupForm');
        this.termsText = document.getElementById('termsText');
        this.signupTitle = document.getElementById('signupTitle');
        this.emailInput = document.getElementById('emailInput');
        this.continueButton = document.getElementById('continueButton');
        
        // Validate all elements are found
        const requiredElements = [
            this.initialContent, this.signupForm, this.termsText, 
            this.signupTitle, this.emailInput, this.continueButton
        ];
        
        if (requiredElements.some(element => !element)) {
            console.error('EmailForm: Some required elements were not found');
            return;
        }

        this.initializeValidation();
    }

    initializeValidation() {
        // Add debounce to avoid too frequent validation
        let debounceTimeout;
        
        this.emailInput.addEventListener('input', (e) => {
            clearTimeout(debounceTimeout);
            debounceTimeout = setTimeout(() => {
                const email = e.target.value.trim();
                const isValid = this.validateEmail(email);
                this.updateButtonState(isValid);
            }, 150); // Debounce time in ms
        });

        // Fix enter key support
        this.emailInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !this.continueButton.disabled) {
                e.preventDefault();
                this.handleContinue();
            }
        });

        this.continueButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.handleContinue();
        });
    }

    validateEmail(email) {
        return window.SignupAPI.validateEmail(email);
    }

    updateButtonState(isValid) {
        const activeClasses = ['bg-[#3D75EA]', 'hover:bg-[#3D75EA]/90', 'cursor-pointer'];
        const inactiveClasses = ['bg-[#C7C5CC]', 'cursor-not-allowed'];
        
        if (isValid) {
            inactiveClasses.forEach(c => this.continueButton.classList.remove(c));
            activeClasses.forEach(c => this.continueButton.classList.add(c));
        } else {
            activeClasses.forEach(c => this.continueButton.classList.remove(c));
            inactiveClasses.forEach(c => this.continueButton.classList.add(c));
        }
        
        this.continueButton.disabled = !isValid;
    }

    show() {
        // Reset form state when showing
        this.emailInput.value = '';
        this.updateButtonState(false);
        
        this.initialContent.classList.add('hidden');
        this.signupForm.classList.remove('hidden');
        this.termsText.classList.remove('hidden');
        this.signupTitle.textContent = 'Sign up';
        
        // Focus email input for better UX
        setTimeout(() => this.emailInput.focus(), 100);
    }

    async handleContinue() {
        const email = this.emailInput.value.trim();
        if (!this.validateEmail(email)) return;

        try {
            // Update button state to loading
            this.continueButton.disabled = true;
            this.continueButton.textContent = 'Sending...';
            
            // Call the API to send OTP
            const success = await window.SignupAPI.validateEmailAndSendOTP(email);
            
            if (success) {
                // Store email for later use
                window.SignupAPI.storeUserEmail(email);
                
                // Show verification form and hide signup form
                this.signupForm.classList.add('hidden');
                const verificationForm = document.getElementById('verificationForm');
                if (verificationForm) {
                    // Update email display
                    const userEmailSpan = document.getElementById('userEmail');
                    if (userEmailSpan) {
                        userEmailSpan.textContent = email;
                    }
                    verificationForm.classList.remove('hidden');
                } else {
                    console.error('Verification form not found');
                }
            }
        } catch (error) {
            console.error('Error sending OTP:', error);
            alert('Failed to send verification code. Please try again.');
        } finally {
            // Reset button state if there was an error
            if (this.continueButton.textContent === 'Sending...') {
                this.continueButton.textContent = 'Continue with email';
                this.updateButtonState(true);
            }
        }
    }
}

// Initialize and expose globally
window.emailForm = new EmailForm();
