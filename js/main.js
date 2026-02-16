function getCartFromStorage() {
    try {
        const cart = localStorage.getItem("cart");
        return cart ? JSON.parse(cart) : [];
    } catch (error) {
        console.error("Error reading cart from localStorage:", error);
        return [];
    }
}
function saveCartToStorage(cart) {
    try {
        localStorage.setItem("cart", JSON.stringify(cart));
        return true;
    } catch (error) {
        console.error("Error saving cart to localStorage:", error);
        return false;
    }
}
function clearCartStorage() {
    try {
        localStorage.removeItem("cart");
        return true;
    } catch (error) {
        console.error("Error clearing cart from localStorage:", error);
        return false;
    }
}
function formatDate(date) {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}
function formatDateTime(date) {
    const d = new Date(date);
    return d.toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

// Cart Calculations

function calculateCartTotal(cart) {
    return cart.reduce((total, item) => {
        return total + item.price * item.quantity;
    }, 0);
}

function calculateCartItemsCount(cart) {
    return cart.reduce((count, item) => {
        return count + item.quantity;
    }, 0);
}

// Validation Functions

function validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

function validatePhone(phone) {
    const phonePattern = /^(010|011|012|015)\d{8}$/;
    return phonePattern.test(phone);
}

function validateRequired(value, minLength = 1) {
    return value.trim().length >= minLength;
}

// Notification Functions

function showNotification(message, type = "success", duration = 3000) {
    // Create notification element
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === "success" ? "check-circle" : type === "error" ? "exclamation-circle" : "info-circle"}"></i>
        <span>${message}</span>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add("show");
    }, 10);
    setTimeout(() => {
        notification.classList.remove("show");
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, duration);
}

// Random Functions

function generateRandomId() {
    return Math.random().toString(36).substr(2, 9);
}

function generateOrderNumber() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `ORD-${timestamp}-${random}`;
}



document.addEventListener("DOMContentLoaded", function () {
    updateNavbar();
});

function updateNavbar() {
    const navActions = document.querySelector(".nav-actions");

    if (!navActions) return;

    if (isLoggedIn()) {
        const user = getCurrentUser();

        // Replace login button with user menu
        const existingBtn = navActions.querySelector(".btn-primary");
        if (existingBtn && existingBtn.textContent.includes("Sign Up")) {
            existingBtn.remove();

            // Create user menu
            const userMenu = document.createElement("div");
            userMenu.className = "user-menu";
            userMenu.innerHTML = `
                <button class="user-menu-btn">
                    <i class="fas fa-user-circle"></i>
                    <span>${user.username.split(" ")[0]}</span>
                    <i class="fas fa-chevron-down"></i>
                </button>
                <div class="user-dropdown">
                    <a href="#" class="dropdown-item">
                        <i class="fas fa-user"></i>
                        My account
                    </a>
                    <a href="#" class="dropdown-item">
                        <i class="fas fa-shopping-bag"></i>
                        My Orders
                    </a>
                    <a href="#" class="dropdown-item">
                        <i class="fas fa-heart"></i>
                        Favorites
                    </a>
                    <div class="dropdown-divider"></div>
                    <a href="#" class="dropdown-item" onclick="logout(); return false;">
                        <i class="fas fa-sign-out-alt"></i>
                        Logout
                    </a>
                </div>
            `;

            navActions.appendChild(userMenu);

            // Toggle dropdown
            const menuBtn = userMenu.querySelector(".user-menu-btn");
            const dropdown = userMenu.querySelector(".user-dropdown");

            menuBtn.addEventListener("click", function (e) {
                e.stopPropagation();
                dropdown.classList.toggle("show");
            });

            // Close dropdown when clicking outside
            document.addEventListener("click", function () {
                dropdown.classList.remove("show");
            });
        }
    }
}
