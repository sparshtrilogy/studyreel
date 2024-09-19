function renderInput(inputType, placeholder) {
  return `<input
    type="${inputType}"
    placeholder="${placeholder}"
    class="w-full px-4 py-3 rounded-full bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 font-archivo font-medium text-14 text-black-45 placeholder-black-45"
  />`;
}

function renderButton(bgColor, textColor, hoverBgColor, icon, buttonText) {
  return `<button class="w-full ${bgColor} ${textColor} py-3 rounded-full font-medium ${hoverBgColor} transition-colors flex items-center justify-center gap-2">
    ${icon ? `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">${icon}</svg>` : ''}
    ${buttonText}
  </button>`;
}

function renderSocialButton(icon, buttonText) {
  return `
    <button class="w-full bg-white hover:bg-[#F4F2FA] border border-[#EAE8F0] py-3 px-4 rounded-2xl flex items-center justify-center gap-2 transition-colors">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24">
        ${icon}
      </svg>
      <span class="font-archivo font-semibold text-14 text-black">${buttonText}</span>
    </button>
  `;
}

function renderSecondaryButton(text, iconPath, customClass = '') {
  const defaultClass = "w-full py-3 px-4 rounded-2xl font-archivo font-bold transition-colors flex items-center justify-center gap-2";
  const buttonClass = customClass || "bg-[#C7C5CC] text-white text-16 hover:bg-[#B8B6BD]";
  
  return `
    <button class="${defaultClass} ${buttonClass}">
      ${iconPath ? `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">${iconPath}</svg>` : ''}
      ${text}
    </button>
  `;
}

// Function to replace component placeholders with actual HTML
function renderComponents() {
  const componentPlaceholders = document.querySelectorAll('[data-component]');
  componentPlaceholders.forEach(placeholder => {
    const componentName = placeholder.getAttribute('data-component');
    const props = JSON.parse(placeholder.getAttribute('data-props'));
    let renderedHTML = '';

    switch (componentName) {
      case 'Input':
        renderedHTML = renderInput(props.inputType, props.placeholder);
        break;
      case 'Button':
        renderedHTML = renderButton(props.bgColor, props.textColor, props.hoverBgColor, props.icon, props.buttonText);
        break;
      case 'SocialButton':
        renderedHTML = renderSocialButton(props.icon, props.buttonText);
        break;
      case 'SecondaryButton':
        renderedHTML = renderSecondaryButton(props.text, props['icon-path'], props.customClass);
        break;
    }

    placeholder.outerHTML = renderedHTML;
  });
}

// Call renderComponents when the DOM is loaded
document.addEventListener('DOMContentLoaded', renderComponents);