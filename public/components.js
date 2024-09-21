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

function renderLogo() {
  return `
    <div class="flex items-center justify-center mb-8">
      <div class="flex items-center">
        <div class="mr-3">
          <img src="/assets/studyreel.svg" alt="StudyReel" class="w-10 h-10 object-contain">
        </div>
        <div>
          <h2 class="logo-title">StudyReel</h2>
          <p class="logo-subtitle">Smart Coaching, faster learning</p>
        </div>
      </div>
    </div>
  `;
}

function renderH1(text) {
  return `<h1 class="h1-standard">${text}</h1>`;
}

// Update the renderComponents function to include the new Logo component
function renderComponents() {
  console.log('renderComponents called');
  const componentPlaceholders = document.querySelectorAll('[data-component]');
  console.log('Found components:', componentPlaceholders.length);
  componentPlaceholders.forEach(placeholder => {
    const componentName = placeholder.getAttribute('data-component');
    const props = JSON.parse(placeholder.getAttribute('data-props') || '{}');
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
      case 'Logo':
        renderedHTML = renderLogo();
        break;
      case 'H1':
        renderedHTML = renderH1(props.text);
        break;
    }

    placeholder.outerHTML = renderedHTML;
  });
}

// Expose renderComponents globally
window.renderComponents = renderComponents;

// New function to initialize components
function initComponents() {
  console.log('initComponents called');
  renderComponents();
}

// Expose initComponents globally
window.initComponents = initComponents;

// Call initComponents when the DOM is loaded
document.addEventListener('DOMContentLoaded', initComponents);

document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.absolute.top-7 > div');
    let currentSlide = 0;
    const slideDuration = 5000; // 5 seconds
    let animationFrameId;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.style.opacity = i === index ? '1' : '0';
        });
        updateIndicators(index);
    }

    function updateIndicators(activeIndex) {
        indicators.forEach((indicator, i) => {
            if (i < activeIndex) {
                indicator.style.background = 'white'; // Fully filled
            } else if (i === activeIndex) {
                indicator.style.background = `linear-gradient(to right, white 0%, white 0%, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.2) 100%)`;
            } else {
                indicator.style.background = 'rgba(255,255,255,0.2)'; // Empty
            }
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    function updateIndicatorFill() {
        const indicator = indicators[currentSlide];
        let fillPercentage = 0;
        const startTime = Date.now();

        function animate() {
            const elapsedTime = Date.now() - startTime;
            fillPercentage = (elapsedTime / slideDuration) * 100;
            
            if (fillPercentage <= 100) {
                indicator.style.background = `linear-gradient(to right, white 0%, white ${fillPercentage}%, rgba(255,255,255,0.2) ${fillPercentage}%, rgba(255,255,255,0.2) 100%)`;
                animationFrameId = requestAnimationFrame(animate);
            } else {
                nextSlide();
                updateIndicatorFill();
            }
        }

        cancelAnimationFrame(animationFrameId);
        animate();
    }

    // Add click event listeners to indicators
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
            cancelAnimationFrame(animationFrameId);
            updateIndicatorFill();
        });
    });

    showSlide(currentSlide);
    updateIndicatorFill();
});