// Global Variables
const DELIVERY_FEE = 30;
let currentDiscount = 0;
let appliedCoupon = null;

// Coupon Codes
const coupons = {
    WELCOME10: { discount: 10, type: "percentage" }, // 10% discount
    SAVE20: { discount: 20, type: "fixed" }, // 20 EGP discount
    FIRSTORDER: { discount: 15, type: "percentage" }, // 15% discount
    FREE50: { discount: 50, type: "fixed" }, // 50 EGP discount
};

// DOM Elements
const cartItems = document.getElementById("cartItems");
const emptyCart = document.getElementById("emptyCart");
const cartContent = document.getElementById("cartContent");
const itemsCount = document.getElementById("itemsCount");
const subtotal = document.getElementById("subtotal");
const deliveryFee = document.getElementById("deliveryFee");
const discountAmount = document.getElementById("discountAmount");
const discountRow = document.getElementById("discountRow");
const totalPrice = document.getElementById("totalPrice");
const couponInput = document.getElementById("couponInput");
const couponMessage = document.getElementById("couponMessage");

// Initialize Page

document.addEventListener("DOMContentLoaded", function () {
    updateNavbar()
    displayCart();
    updateCartCount();
});

// Display Cart Items

function displayCart() {
    const cart = getCart();

    if (cart.length === 0) {
        emptyCart.style.display = "flex";
        cartContent.style.display = "none";
        return;
    }

    emptyCart.style.display = "none";
    cartContent.style.display = "block";

    renderCartItems(cart);
    updateOrderSummary();
}

// Render Cart Items HTML

function renderCartItems(cart) {
    itemsCount.textContent = cart.length;

    cartItems.innerHTML = cart
        .map(
            (item) => `
        <div class="cart-item" data-id="${item.id}">
            <div class="item-image">
                <img src="${item.image}" alt="${item.name}" onerror="this.src='images/placeholder.jpg'">
            </div>
            <div class="item-details">
                <div class="item-header">
                    <h3 class="item-name">${item.name}</h3>
                    <button class="btn-remove" onclick="removeFromCart(${item.id})" title="Remove">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="item-price">
                    Price: <span class="price-value">${item.price} EGP</span>
                </div>
                <div class="item-footer">
                    <div class="quantity-control">
                        <button class="qty-btn" onclick="decreaseQuantity(${item.id})" ${item.quantity <= 1 ? "disabled" : ""}>
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="quantity-value">${item.quantity}</span>
                        <button class="qty-btn" onclick="increaseQuantity(${item.id})">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <div class="item-total">
                        ${item.price * item.quantity} EGP
                    </div>
                </div>
            </div>
        </div>
    `,
        )
        .join("");
}

// Update Order Summary

function updateOrderSummary() {
    const cart = getCart();

    // Calculate subtotal
    const subtotalAmount = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
    );

    // Calculate discount
    let discountValue = 0;
    if (appliedCoupon) {
        const coupon = coupons[appliedCoupon];
        if (coupon.type === "percentage") {
            discountValue = (subtotalAmount * coupon.discount) / 100;
        } else {
            discountValue = coupon.discount;
        }
    }
    currentDiscount = discountValue;

    // Calculate total
    const total = subtotalAmount + DELIVERY_FEE - discountValue;

    // Update UI
    subtotal.textContent = `${subtotalAmount} EG`;
    deliveryFee.textContent = `${DELIVERY_FEE} EG`;

    if (discountValue > 0) {
        discountRow.style.display = "flex";
        discountAmount.textContent = `- ${discountValue.toFixed(2)} EG`;
    } else {
        discountRow.style.display = "none";
    }

    totalPrice.textContent = `${total.toFixed(2)} EG`;
}

// Cart Operations

function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}
function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}
function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    const cartCountElement = document.querySelector(".cart-count");
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
    }
}
function increaseQuantity(itemId) {
    const cart = getCart();
    const item = cart.find((i) => i.id === itemId);

    if (item) {
        item.quantity += 1;
        saveCart(cart);
        displayCart();
        updateCartCount();
        showToast("Quantity Updated");
    }
}
function decreaseQuantity(itemId) {
    const cart = getCart();
    const item = cart.find((i) => i.id === itemId);

    if (item && item.quantity > 1) {
        item.quantity -= 1;
        saveCart(cart);
        displayCart();
        updateCartCount();
        showToast("Quantity Updated");
    }
}
function removeFromCart(itemId) {
    if (!confirm("Do you sure to Delete this Item?")) {
        return;
    }

    let cart = getCart();
    cart = cart.filter((i) => i.id !== itemId);
    saveCart(cart);
    displayCart();
    updateCartCount();
    showToast("Product removed from cart", "error");
}
function clearCart() {
    if (!confirm("Are you sure remove cart completely?")) {
        return;
    }

    localStorage.removeItem("cart");
    appliedCoupon = null;
    displayCart();
    updateCartCount();
    showToast("Cart remove completely", "error");
}

// Coupon Functions

function applyCoupon() {
    const code = couponInput.value.trim().toUpperCase();

    if (!code) {
        showCouponMessage("Please enter a discount code", "error");
        return;
    }

    if (!coupons[code]) {
        showCouponMessage("Invalid discount code", "error");
        return;
    }

    if (appliedCoupon === code) {
        showCouponMessage("This code has already been applied", "error");
        return;
    }

    appliedCoupon = code;
    const coupon = coupons[code];

    let message = "";
    if (coupon.type === "percentage") {
        message = `Discount of ${coupon.discount}% applied`;
    } else {
        message = `Discount of ${coupon.discount} EGP applied`;
    }
    showCouponMessage(message, "success");
    updateOrderSummary();
    couponInput.value = "";
}
function showCouponMessage(message, type) {
    couponMessage.textContent = message;
    couponMessage.className = `coupon-message ${type}`;

    setTimeout(() => {
        couponMessage.textContent = "";
        couponMessage.className = "coupon-message";
    }, 3000);
}

// Checkout

function goToCheckout() {
    const cart = getCart();

    if (cart.length === 0) {
        showToast("Cart is empty!", "error");
        return;
    }

    // Save order summary to localStorage
    const orderSummary = {
        items: cart,
        subtotal: parseFloat(subtotal.textContent),
        deliveryFee: DELIVERY_FEE,
        discount: currentDiscount,
        coupon: appliedCoupon,
        total: parseFloat(totalPrice.textContent),
    };

    localStorage.setItem("orderSummary", JSON.stringify(orderSummary));

    // Redirect to checkout
    window.location.href = "checkout.html";
}

// Toast Notification


function showToast(message, type = "success") {
    const toast = document.getElementById("toast");
    const toastMessage = document.getElementById("toastMessage");

    // Set message
    toastMessage.textContent = message;

    // Set color based on type
    if (type === "error") {
        toast.style.backgroundColor = "var(--danger-color)";
    } else {
        toast.style.backgroundColor = "var(--success-color)";
    }

    // Show toast
    toast.classList.add("show");

    // Hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}
