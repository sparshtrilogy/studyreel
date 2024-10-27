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
            
            const data = await response.json();
            
            if (response.ok) {
                return {
                    success: true,
                    userType: data.user.user_metadata.user_type,
                    userId: data.user.id
                };
            } else {
                return {
                    success: false,
                    errorMessage: data.message || 'Verification failed'
                };
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            return {
                success: false,
                errorMessage: 'Error verifying OTP'
            };
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
    },

    // Add this new function to the SignupAPI object
    async updateUserType(userId, userType) {
        try {
            const response = await fetch(`${API_BASE_URL}/update-user-type`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, userType }),
            });
            
            if (response.ok) {
                // Update local storage
                localStorage.setItem('userType', 'existing');
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error updating user type:', error);
            return false;
        }
    }
};
