// Base URL for the API
const API_BASE_URL = 'http://localhost:3000';

// Create a global object to hold our API functions
window.SignupAPI = {
    // Email validation function
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    },

    // Function to send OTP
    async validateEmailAndSendOTP(email) {
        try {
            const response = await fetch(`${API_BASE_URL}/send-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });
            return response.ok;
        } catch (error) {
            console.error('Error sending OTP:', error);
            return false;
        }
    },

    // Function to verify OTP
    async validateOTP(email, otp) {
        try {
            const response = await fetch(`${API_BASE_URL}/verify-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, otp }),
            });
            return response.ok;
        } catch (error) {
            console.error('Error verifying OTP:', error);
            return false;
        }
    },

    // Function to store user email
    storeUserEmail(email) {
        localStorage.setItem('userEmail', email);
    },

    // Function to finalize signup
    async finalizeSignup(email, displayName) {
        try {
            await this.updateDisplayName(email, displayName);
            this.storeUserEmail(email);
            return true;
        } catch (error) {
            console.error('Failed to update display name:', error);
            return false;
        }
    },

    // Function to update display name
    async updateDisplayName(email, displayName) {
        try {
            const response = await fetch(`${API_BASE_URL}/update-display-name`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, displayName }),
            });

            if (!response.ok) {
                throw new Error('Failed to update display name');
            }

            return await response.json();
        } catch (error) {
            console.error('Error updating display name:', error);
            throw error;
        }
    }
};