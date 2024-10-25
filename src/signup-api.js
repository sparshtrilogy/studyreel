// Base URL for the API
const API_BASE_URL = 'http://localhost:3000';

// Function to send OTP
async function sendOTP(email) {
    try {
        const response = await fetch(`${API_BASE_URL}/send-otp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        if (!response.ok) {
            throw new Error('Failed to send OTP');
        }

        return await response.json();
    } catch (error) {
        console.error('Error sending OTP:', error);
        throw error;
    }
}

// Function to verify OTP
async function verifyOTP(email, otp) {
    try {
        const response = await fetch(`${API_BASE_URL}/verify-otp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, otp }),
        });

        if (!response.ok) {
            throw new Error('Failed to verify OTP');
        }

        return await response.json();
    } catch (error) {
        console.error('Error verifying OTP:', error);
        throw error;
    }
}

// Function to update display name
async function updateDisplayName(email, displayName) {
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

// Wrapper function for email validation and OTP sending
async function validateEmailAndSendOTP(email) {
    if (validateEmail(email)) {
        try {
            await sendOTP(email);
            return true;
        } catch (error) {
            console.error('Failed to send OTP:', error);
            return false;
        }
    }
    return false;
}

// Wrapper function for OTP verification
async function validateOTP(email, otp) {
    try {
        await verifyOTP(email, otp);
        return true;
    } catch (error) {
        console.error('Failed to verify OTP:', error);
        return false;
    }
}

// Wrapper function for updating display name
async function finalizeSignup(email, displayName) {
    try {
        await updateDisplayName(email, displayName);
        return true;
    } catch (error) {
        console.error('Failed to update display name:', error);
        return false;
    }
}

// Email validation function (moved from signup.html)
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}
