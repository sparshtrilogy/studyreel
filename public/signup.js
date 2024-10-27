// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBZuRv2rDZJN_jr8t984vNGqAThyk1AHus",
  authDomain: "studyreel-21716.firebaseapp.com",
  projectId: "studyreel-21716",
  storageBucket: "studyreel-21716.appspot.com",
  messagingSenderId: "101544454160",
  appId: "1:101544454160:web:60aee6fd05272b4ad7c295",
  measurementId: "G-DPM5S4NJ9Z"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
console.log('Firebase initialized:', firebase.apps.length > 0);
const auth = firebase.auth();

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signupForm');
  const messageElement = document.getElementById('message');
  const errorElement = document.getElementById('error');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    messageElement.textContent = '';
    errorElement.textContent = '';

    if (password !== confirmPassword) {
      errorElement.textContent = 'Passwords do not match';
      return;
    }

    console.log('Attempting to sign up...');
    try {
      // Sign up the user
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      await userCredential.user.updateProfile({
        displayName: fullName
      });
      await userCredential.user.sendEmailVerification();
      messageElement.textContent = 'Account created. Please check your email for verification.';
      console.log('Sign up successful:', userCredential);
      
      // Redirect to login page after successful signup
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 3000); // Redirect after 3 seconds
    } catch (signUpError) {
      console.error('Sign-up error:', signUpError.code, signUpError.message);
      errorElement.textContent = signUpError.message;
    }
  });

  // Google Sign Up
  const googleSignUpButton = document.querySelector('button:nth-of-type(1)');
  googleSignUpButton.addEventListener('click', async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
      const result = await auth.signInWithPopup(provider);
      console.log('Google sign up successful:', result.user);
      // Handle successful Google sign up (e.g., redirect to welcome page)
    } catch (error) {
      console.error('Google sign up error:', error);
      errorElement.textContent = error.message;
    }
  });

  // Apple Sign Up (placeholder - actual implementation requires Apple Developer account)
  const appleSignUpButton = document.querySelector('button:nth-of-type(2)');
  appleSignUpButton.addEventListener('click', () => {
    alert('Apple sign up not implemented yet');
  });
});