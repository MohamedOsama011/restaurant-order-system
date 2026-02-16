// ==================== //
// Auth Page JavaScript
// ==================== //

// ==================== //
// Tab Switching
// ==================== //

document.addEventListener("DOMContentLoaded", function () {
    // Tab buttons
    const tabButtons = document.querySelectorAll(".tab-btn");

    tabButtons.forEach((btn) => {
        btn.addEventListener("click", function () {
            const tab = this.dataset.tab;
            switchTab(tab);
        });
    });

    // Check if user is already logged in
    if (isLoggedIn()) {
        window.location.href = "index.html";
    }

    // Update cart count
    updateCartCount();
});

function switchTab(tab) {
    // Update tab buttons
    const tabButtons = document.querySelectorAll(".tab-btn");
    tabButtons.forEach((btn) => {
        if (btn.dataset.tab === tab) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });

    // Update form containers
    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");

    if (tab === "login") {
        loginForm.classList.add("active");
        signupForm.classList.remove("active");
    } else {
        signupForm.classList.add("active");
        loginForm.classList.remove("active");
    }

    // Clear forms
    clearFormErrors();
}

// ==================== //
// Toggle Password Visibility
// ==================== //

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = input.parentElement.querySelector(".toggle-password");
    const icon = button.querySelector("i");

    if (input.type === "password") {
        input.type = "text";
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
    } else {
        input.type = "password";
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
    }
}

// ==================== //
// Handle Login
// ==================== //

function handleLogin(event) {
    event.preventDefault();

    // Clear previous errors
    clearFormErrors();

    // Get form data
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;
    const remember = document.querySelector(
        '#loginFormElement input[name="remember"]',
    ).checked;

    // Validate
    let isValid = true;

    if (!validateEmail(email)) {
        showFieldError("loginEmail", "Please enter a valid email address");
        isValid = false;
    }

    if (password.length < 6) {
        showFieldError(
            "loginPassword",
            "Password must be at least 6 characters",
        );
        isValid = false;
    }

    if (!isValid) return;

    // Show loading
    const submitBtn = document.querySelector(
        '#loginFormElement button[type="submit"]',
    );
    setButtonLoading(submitBtn, true);

    // Prepare data
    const loginData = {
        email: email,
        password: password,
    };

    // Make API request using XMLHttpRequest
    makeRequest("POST", "/auth/login", loginData, function (error, response) {
        setButtonLoading(submitBtn, false);

        if (error) {
            // Show error
            showNotification(
                error.message || "An error occurred during login",
                "error",
            );
            showFieldError("loginPassword", error.message);
        } else if (response.success) {
            // Success
            showNotification(response.message || "Login successful", "success");

            // Save remember me preference
            if (remember) {
                localStorage.setItem("rememberMe", "true");
            }

            // Redirect after delay
            setTimeout(() => {
                // Check if there's a redirect URL
                const urlParams = new URLSearchParams(window.location.search);
                const redirect = urlParams.get("redirect") || "index.html";
                window.location.href = redirect;
            }, 1500);
        }
    });
}

// ==================== //
// Handle Signup
// ==================== //

function handleSignup(event) {
    event.preventDefault();

    // Clear previous errors
    clearFormErrors();

    // Get form data
    const name = document.getElementById("signupName").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const phone = document.getElementById("signupPhone").value.trim();
    const password = document.getElementById("signupPassword").value;
    const confirmPassword = document.getElementById(
        "signupConfirmPassword",
    ).value;
    const terms = document.querySelector(
        '#signupFormElement input[name="terms"]',
    ).checked;

    // Validate
    let isValid = true;

    if (name.length < 3) {
        showFieldError("signupName", "Name must be at least 3 characters");
        isValid = false;
    }

    if (!validateEmail(email)) {
        showFieldError("signupEmail", "Please enter a valid email address");
        isValid = false;
    }

    if (!validatePhone(phone)) {
        showFieldError(
            "signupPhone",
            "Please enter a valid phone number (e.g., 01012345678)",
        );
        isValid = false;
    }

    if (password.length < 8) {
        showFieldError(
            "signupPassword",
            "Password must be at least 8 characters",
        );
        isValid = false;
    }

    if (password !== confirmPassword) {
        showFieldError("signupConfirmPassword", "Passwords do not match");
        isValid = false;
    }

    if (!terms) {
        showNotification("You must agree to the Terms and Conditions", "error");
        isValid = false;
    }

    if (!isValid) return;

    // Show loading
    const submitBtn = document.querySelector(
        '#signupFormElement button[type="submit"]',
    );
    setButtonLoading(submitBtn, true);

    // Prepare data
    const signupData = {
        name: name,
        email: email,
        phone: phone,
        password: password,
    };

    // Make API request using XMLHttpRequest
    makeRequest("POST", "/auth/signup", signupData, function (error, response) {
        setButtonLoading(submitBtn, false);

        if (error) {
            // Show error
            showNotification(
                error.message || "An error occurred during account creation",
                "error",
            );
            if (error.message && error.message.includes("email")) {
                showFieldError("signupEmail", error.message);
            }
        } else if (response.success) {
            // Success
            showNotification(
                response.message || "Account created successfully",
                "success",
            );

            // Redirect after delay
            setTimeout(() => {
                window.location.href = "index.html";
            }, 1500);
        }
    });
}

// ==================== //
// Form Validation Helpers
// ==================== //

function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const formGroup = field.closest(".form-group");
    const errorMessage = formGroup.querySelector(".error-message");

    formGroup.classList.add("error");
    errorMessage.textContent = message;

    // Remove error on input
    field.addEventListener(
        "input",
        function () {
            formGroup.classList.remove("error");
            errorMessage.textContent = "";
        },
        { once: true },
    );
}

function clearFormErrors() {
    document.querySelectorAll(".form-group.error").forEach((group) => {
        group.classList.remove("error");
        group.querySelector(".error-message").textContent = "";
    });
}

// ==================== //
// Button Loading State
// ==================== //

function setButtonLoading(button, loading) {
    const btnText = button.querySelector(".btn-text");
    const btnLoader = button.querySelector(".btn-loader");

    if (loading) {
        button.classList.add("loading");
        button.disabled = true;
        btnText.style.opacity = "0";
        btnLoader.style.display = "block";
    } else {
        button.classList.remove("loading");
        button.disabled = false;
        btnText.style.opacity = "1";
        btnLoader.style.display = "none";
    }
}

// ==================== //
// Update Cart Count
// ==================== //

function updateCartCount() {
    const cart = getCartFromStorage();
    const totalItems = calculateCartItemsCount(cart);

    const cartCountElement = document.querySelector(".cart-count");
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
    }
}
