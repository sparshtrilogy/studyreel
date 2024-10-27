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

    // Function to finalize signup with profile data
    async finalizeSignup(email, fullName, grade) {
        try {
            const response = await fetch(`${API_BASE_URL}/update-profile`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    email,
                    fullName,
                    grade: parseInt(grade, 10)  // Ensure grade is an integer
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create profile');
            }

            // Store email in local storage
            this.storeUserEmail(email);
            return true;
        } catch (error) {
            console.error('Failed to create profile:', error);
            throw error;
        }
    }
};
