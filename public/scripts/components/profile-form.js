class ProfileForm {
    constructor() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        this.fullNameInput = document.getElementById('fullNameInput');
        this.gradeSelect = document.getElementById('gradeSelect');
        this.continueButton = document.getElementById('continueProfile');
        this.setPasswordForm = document.getElementById('setPassword');
        
        // Add event listeners
        this.gradeSelect.addEventListener('change', () => this.checkForm());
        this.continueButton.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent immediate navigation
            this.handleSubmit();
        });
        
        // Add name input validation
        this.fullNameInput.addEventListener('input', () => this.checkForm());
        
        // Add enter key support
        this.fullNameInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !this.continueButton.disabled) {
                e.preventDefault();
                this.handleSubmit();
            }
        });
        
        this.gradeSelect.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !this.continueButton.disabled) {
                e.preventDefault();
                this.handleSubmit();
            }
        });
    }

    show() {
        console.log('ProfileForm show() called'); // Add this line
        // Reset form state
        this.fullNameInput.value = '';
        this.gradeSelect.value = '';
        
        // Show form
        this.setPasswordForm.classList.remove('hidden');
        
        // Focus name input
        setTimeout(() => this.fullNameInput.focus(), 100);
    }

    checkForm() {
        // Check both name and grade are filled
        const isComplete = this.gradeSelect.value && this.fullNameInput.value.trim();
        
        // Directly update button state without using components
        if (this.continueButton) {
            if (isComplete) {
                this.continueButton.classList.remove('bg-[#C7C5CC]', 'cursor-not-allowed');
                this.continueButton.classList.add('bg-[#3D75EA]', 'cursor-pointer');
                this.continueButton.disabled = false;
            } else {
                this.continueButton.classList.add('bg-[#C7C5CC]', 'cursor-not-allowed');
                this.continueButton.classList.remove('bg-[#3D75EA]', 'cursor-pointer');
                this.continueButton.disabled = true;
            }
        }
    }

    async handleSubmit() {
        const name = this.fullNameInput.value;
        const grade = this.gradeSelect.value;
        
        console.log('Submitting name:', name); // Debug log
        
        try {
            const email = localStorage.getItem('userEmail');
            await window.SignupAPI.finalizeSignup(email, name, grade);
            window.location.href = '../public/onboarding.html';
        } catch (error) {
            console.error('Profile creation failed:', error);
        }
    }
}

window.profileForm = new ProfileForm();
