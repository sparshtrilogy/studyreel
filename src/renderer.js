const { ipcRenderer } = require('electron');

// Remove or comment out the Cursor-related code
// const Cursor = require('cursor');
// ... (remove all Cursor-related code)

console.log('Renderer script loaded');

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM content loaded');
  const loginForm = document.querySelector('form');
  if (loginForm) {
    console.log('Login form found');
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.querySelector('input[type="email"]').value;
      const password = document.querySelector('input[type="password"]').value;
      
      console.log('Login attempted:', email, password);
      
      // For now, let's simulate a successful login
      window.location.href = '../public/index.html';
    });
  } else {
    console.log('Login form not found');
    console.log('Current HTML:', document.body.innerHTML);
  }
});

console.log('Renderer script loaded');