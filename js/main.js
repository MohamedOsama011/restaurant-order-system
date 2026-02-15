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

// Scroll Functions

function scrollToTop(smooth = true) {
    window.scrollTo({
        top: 0,
        behavior: smooth ? "smooth" : "auto",
    });
}

function scrollToElement(elementId, offset = 0) {
    const element = document.getElementById(elementId);
    if (element) {
        const top = element.offsetTop - offset;
        window.scrollTo({
            top: top,
            behavior: "smooth",
        });
    }
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

// Debounce Function

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

