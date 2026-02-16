

document.addEventListener('DOMContentLoaded', function() {
    // Setup tab switching
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const tab = this.dataset.tab;
            switchTab(tab);
        });
    });
    
    // Redirect if already logged in
    if (isLoggedIn()) {
        window.location.href = 'index.html';
    }
    
    // Update cart count
    updateCartCount();
});

function switchTab(tab) {
    // Update tab buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        if (btn.dataset.tab === tab) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Update forms
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (tab === 'login') {
        loginForm.classList.add('active');
        signupForm.classList.remove('active');
    } else {
        signupForm.classList.add('active');
        loginForm.classList.remove('active');
    }
    
    // Clear errors
    clearFormErrors();
}


function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = input.parentElement.querySelector('.toggle-password');
    const icon = button.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}


function handleLogin(event) {
    event.preventDefault();
    
    // Clear previous errors
    clearFormErrors();
    
    // Get form data
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    // Simple validation
    if (!email || !password) {
        showNotification('Please fill all fields', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showFieldError('loginEmail', 'Invalid email format');
        return;
    }
    
    // Show loading
    const submitBtn = document.querySelector('#loginFormElement button[type="submit"]');
    setButtonLoading(submitBtn, true);
    
    // Call API
    apiLogin(email, password, function(response) {
        setButtonLoading(submitBtn, false);
        
        if (response.success) {
            showNotification(response.message, 'success');
            
            // Redirect after delay
            setTimeout(() => {
                const urlParams = new URLSearchParams(window.location.search);
                const redirect = urlParams.get('redirect') || 'index.html';
                window.location.href = redirect;
            }, 1500);
        } else {
            showNotification(response.message, 'error');
            showFieldError('loginPassword', response.message);
        }
    });
}


function handleSignup(event) {
    event.preventDefault();
    
    // Clear previous errors
    clearFormErrors();
    
    // Get form data
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const phone = document.getElementById('signupPhone').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    const terms = document.querySelector('#signupFormElement input[name="terms"]').checked;
    
    // Validation
    let isValid = true;
    
    if (name.length < 3) {
        showFieldError('signupName', 'Name must be at least 3 characters');
        isValid = false;
    }
    
    if (!isValidEmail(email)) {
        showFieldError('signupEmail', 'Invalid email format');
        isValid = false;
    }
    
    // ReqRes.in requires @reqres.in email
    if (!email.endsWith('@reqres.in')) {
        showFieldError('signupEmail', 'For testing, use email ending with @reqres.in (e.g., test@reqres.in)');
        isValid = false;
    }
    
    if (!isValidPhone(phone)) {
        showFieldError('signupPhone', 'Invalid phone number (e.g., 01012345678)');
        isValid = false;
    }
    
    if (password.length < 6) {
        showFieldError('signupPassword', 'Password must be at least 6 characters');
        isValid = false;
    }
    
    if (password !== confirmPassword) {
        showFieldError('signupConfirmPassword', 'Passwords do not match');
        isValid = false;
    }
    
    if (!terms) {
        showNotification('Please accept terms and conditions', 'error');
        isValid = false;
    }
    
    if (!isValid) return;
    
    // Show loading
    const submitBtn = document.querySelector('#signupFormElement button[type="submit"]');
    setButtonLoading(submitBtn, true);
    
    // Call API
    apiSignup(name, email, password, function(response) {
        setButtonLoading(submitBtn, false);
        
        if (response.success) {
            showNotification(response.message, 'success');
            
            // Redirect after delay
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        } else {
            showNotification(response.message, 'error');
            showFieldError('signupEmail', response.message);
        }
    });
}


// Validation Helpers

function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

function isValidPhone(phone) {
    const phonePattern = /^(010|011|012|015)\d{8}$/;
    return phonePattern.test(phone);
}

function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const formGroup = field.closest('.form-group');
    const errorMessage = formGroup.querySelector('.error-message');
    
    formGroup.classList.add('error');
    errorMessage.textContent = message;
    
    // Remove error on input
    field.addEventListener('input', function() {
        formGroup.classList.remove('error');
        errorMessage.textContent = '';
    }, { once: true });
}

function clearFormErrors() {
    document.querySelectorAll('.form-group.error').forEach(group => {
        group.classList.remove('error');
        group.querySelector('.error-message').textContent = '';
    });
}


function setButtonLoading(button, loading) {
    const btnText = button.querySelector('.btn-text');
    const btnLoader = button.querySelector('.btn-loader');
    
    if (loading) {
        button.classList.add('loading');
        button.disabled = true;
        btnText.style.opacity = '0';
        btnLoader.style.display = 'block';
    } else {
        button.classList.remove('loading');
        button.disabled = false;
        btnText.style.opacity = '1';
        btnLoader.style.display = 'none';
    }
}


function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
    }
}
