# Restructured `signup.html` File

## **Target Structure**
public/
├── scripts/
│   ├── components/
│   │   ├── popup-manager.js        # All popup related logic ✅
│   │   ├── email-form.js          # Email form stage management
│   │   ├── otp-form.js           # OTP verification stage management
│   │   └── password-form.js       # Password setup stage management
│   ├── utils/
│   │   └── form-utils.js          # Common utilities (button states, transitions)
│   ├── api/
│   │   └── signup-api.js          # API integration logic
│   └── signup.js                  # Main flow orchestration
├── signup.html                    # Initial content + script imports
└── ... (other existing files)

## **JavaScript Module Responsibilities**

1. popup-manager.js: ✅
   - Student age verification popup
   - Parent redirect popup
   - Underage warning popup

2. email-form.js:
   - Email input validation
   - Continue button state
   - Email verification API call
   - Transition to OTP stage

3. otp-form.js:
   - OTP input handling
   - Input focus management
   - OTP validation
   - Verify button state
   - Transition to password stage

4. password-form.js:
   - Password requirements validation
   - Password confirmation
   - Full name input
   - Account creation
   - Final submission

5. form-utils.js:
   - Common button state updates

## **Progress**
- ✅ Completed popup-manager.js implementation
  - Successfully extracted all popup-related functionality
  - Implemented age verification flow
  - Added parent signup redirect
  - Added underage warning popup
  - Properly integrated with main signup flow

Next steps:
1. Extract form management logic (form-manager.js)
2. Move validation logic to its own module (validation.js)
