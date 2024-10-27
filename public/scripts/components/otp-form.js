class OTPForm {
    constructor() {
        this.initialize();
    }

    initialize() {
        this.verificationForm = document.getElementById('verificationForm');
        this.otpInputs = Array.from(document.querySelectorAll('.verification-input'));
        this.verifyButton = document.getElementById('verifyButton');
        this.resendLink = this.verificationForm.querySelector('a[href="#"]');
        this.userEmailSpan = document.getElementById('userEmail');
        
        this.initializeInputHandlers();
        this.initializeResendHandler();
        
        // Add this line
        this.verifyButton.addEventListener('click', () => this.verifyOTP());
    }

    initializeInputHandlers() {
        this.otpInputs.forEach((input, index) => {
            // Handle input
            input.addEventListener('input', (e) => {
                const value = e.target.value;
                
                // Only allow numbers
                if (!/^\d*$/.test(value)) {
                    input.value = '';
                    return;
                }

                // Auto-advance to next input
                if (value && index < this.otpInputs.length - 1) {
                    this.otpInputs[index + 1].focus();
                }

                this.updateVerifyButtonState();
            });

            // Handle backspace
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && !input.value && index > 0) {
                    this.otpInputs[index - 1].focus();
                }
            });

            // Handle paste
            input.addEventListener('paste', (e) => {
                e.preventDefault();
                const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
                
                pastedData.split('').forEach((digit, i) => {
                    if (i < this.otpInputs.length) {
                        this.otpInputs[i].value = digit;
                    }
                });

                this.updateVerifyButtonState();
            });

            // Add enter key support
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !this.verifyButton.disabled) {
                    e.preventDefault();
                    this.verifyOTP();
                }
            });
        });
    }

    initializeResendHandler() {
        this.resendLink.addEventListener('click', async (e) => {
            e.preventDefault();
            const email = this.userEmailSpan.textContent;
            
            try {
                this.resendLink.textContent = 'Sending...';
                const success = await window.SignupAPI.validateEmailAndSendOTP(email);
                
                if (success) {
                    this.resendLink.textContent = 'Code sent!';
                    setTimeout(() => {
                        this.resendLink.textContent = 'Resend Code';
                    }, 3000);
                } else {
                    throw new Error('Failed to resend OTP');
                }
            } catch (error) {
                console.error('Error resending OTP:', error);
                alert('Failed to resend code. Please try again.');
                this.resendLink.textContent = 'Resend Code';
            }
        });
    }

    updateVerifyButtonState() {
        const isComplete = this.otpInputs.every(input => input.value.length === 1);
        const buttonComponent = document.querySelector('[data-component="SecondaryButton"]');
        
        if (buttonComponent) {
            const props = JSON.parse(buttonComponent.getAttribute('data-props') || '{}');
            props.isActive = isComplete;
            buttonComponent.setAttribute('data-props', JSON.stringify(props));
            window.renderComponents();
        }
    }

    getOTPValue() {
        return this.otpInputs.map(input => input.value).join('');
    }

    async verifyOTP() {
        const otp = this.getOTPValue();
        const email = this.userEmailSpan.textContent;

        try {
            // Clear any existing error message
            this.clearErrorMessage();
            
            const success = await window.SignupAPI.validateOTP(email, otp);
            
            if (success) {
                // Hide verification form and show password setup
                this.verificationForm.classList.add('hidden');
                document.getElementById('setPassword').classList.remove('hidden');
                window.profileForm.show();  // Add this line to properly show the profile form
            } else {
                // Show error message below button
                this.showErrorMessage('Invalid verification code. Please try again.');
                // Clear inputs and focus first one
                this.otpInputs.forEach(input => input.value = '');
                this.otpInputs[0].focus();
                this.updateVerifyButtonState();
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            this.showErrorMessage('Failed to verify code. Please try again.');
        }
    }

    showErrorMessage(message) {
        let errorDiv = this.verificationForm.querySelector('.error-message');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.style.color = 'red';
            errorDiv.style.marginTop = '10px';
            errorDiv.style.textAlign = 'center';
            this.verifyButton.parentNode.insertBefore(errorDiv, this.verifyButton.nextSibling);
        }
        errorDiv.textContent = message;
    }

    clearErrorMessage() {
        const errorDiv = this.verificationForm.querySelector('.error-message');
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    show(email) {
        // Reset form state
        this.otpInputs.forEach(input => input.value = '');
        this.updateVerifyButtonState();
        
        // Update email display
        if (this.userEmailSpan) {
            this.userEmailSpan.textContent = email;
        }
        
        // Show form
        this.verificationForm.classList.remove('hidden');
        
        // Focus first input with a small delay to ensure DOM is ready
        setTimeout(() => this.otpInputs[0].focus(), 100);
    }
}

// Initialize and expose globally
window.otpForm = new OTPForm();
