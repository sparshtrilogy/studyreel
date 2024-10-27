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
        this.clearErrorMessage();  // Add this line
        
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
            this.clearErrorMessage();
            this.continueButton.disabled = true;
            this.continueButton.textContent = 'Sending...';
            
            const success = await window.SignupAPI.validateEmailAndSendOTP(email);
            
            if (success) {
                window.SignupAPI.storeUserEmail(email);
                this.signupForm.classList.add('hidden');
                // Use the OTP form's show method directly
                window.otpForm.show(email);
            } else {
                this.showErrorMessage('Failed to send verification code. Please try again.');
            }
        } catch (error) {
            console.error('Error sending OTP:', error);
            this.showErrorMessage('Failed to send verification code. Please try again.');
        } finally {
            if (this.continueButton.textContent === 'Sending...') {
                this.continueButton.textContent = 'Continue with email';
                this.updateButtonState(true);
            }
        }
    }

    // Add these helper methods
    showErrorMessage(message) {
        let errorDiv = this.signupForm.querySelector('.error-message');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.style.color = 'red';
            errorDiv.style.marginTop = '10px';
            errorDiv.style.textAlign = 'center';
            this.continueButton.parentNode.insertBefore(errorDiv, this.continueButton.nextSibling);
        }
        errorDiv.textContent = message;
    }

    clearErrorMessage() {
        const errorDiv = this.signupForm.querySelector('.error-message');
        if (errorDiv) {
            errorDiv.remove();
        }
    }
}

// Initialize and expose globally
window.emailForm = new EmailForm();
