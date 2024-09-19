const backButton = document.createElement('button');
backButton.id = 'backButton';
backButton.innerHTML = '&#8592; Back';
backButton.onclick = () => window.history.back();

document.body.appendChild(backButton);