// renderer.js
// import { initializeApp } from 'firebase/app';
// import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';


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
  const form = document.getElementById('authForm');
  const messageElement = document.getElementById('message');
  const errorElement = document.getElementById('error');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    messageElement.textContent = '';
    errorElement.textContent = '';

    console.log('Attempting to log in...');
    try {
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      console.log('Login successful:', userCredential);
      messageElement.textContent = 'Login successful!';
      // Redirect to main app page or perform other post-login actions
      // window.location.href = '../public/index.html';
    } catch (loginError) {
      console.error('Login error:', loginError.code, loginError.message);
      errorElement.textContent = loginError.message;
    }
  });

  // Google Sign In
  const googleSignInButton = document.querySelector('button:nth-of-type(1)');
  googleSignInButton.addEventListener('click', async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
      const result = await auth.signInWithPopup(provider);
      console.log('Google sign in successful:', result.user);
      // Handle successful Google sign in (e.g., redirect to main app page)
    } catch (error) {
      console.error('Google sign in error:', error);
      errorElement.textContent = error.message;
    }
  });

  // Apple Sign In (placeholder)
  const appleSignInButton = document.querySelector('button:nth-of-type(2)');
  appleSignInButton.addEventListener('click', () => {
    alert('Apple sign in not implemented yet');
  });
});