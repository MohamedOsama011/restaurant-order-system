const checkoutForm = document.getElementById("checkoutForm");
const orderItems = document.getElementById("orderItems");
const summarySubtotal = document.getElementById("summarySubtotal");
const summaryDelivery = document.getElementById("summaryDelivery");
const summaryDiscount = document.getElementById("summaryDiscount");
const summaryDiscountRow = document.getElementById("summaryDiscountRow");
const summaryTotal = document.getElementById("summaryTotal");
const loadingOverlay = document.getElementById("loadingOverlay");
const scheduledTime = document.getElementById("scheduledTime");

const deliveryTimeRadios = document.querySelectorAll(
    'input[name="deliveryTime"]',
);

document.addEventListener("DOMContentLoaded", function () {
    if (!isLoggedIn()) {
        alert('يجب تسجيل الدخول أولاً');
        window.location.href = 'auth.html?redirect=checkout.html';
        return;
    }
    const orderSummary = JSON.parse(localStorage.getItem("orderSummary"));

    if (!orderSummary || orderSummary.items.length === 0) {
        alert("Cart is empty!");
        window.location.href = "cart.html";
        return;
    }

    displayOrderSummary(orderSummary);

    updateCartCount();

    setMinimumDeliveryDate();

    addEventListeners();
});

function displayOrderSummary(orderSummary) {
    orderItems.innerHTML = orderSummary.items
        .map(
            (item) => `
        <div class="order-item">
            <div class="order-item-image">
                <img src="${item.image}" alt="${item.name}" onerror="this.src='images/placeholder.jpg'">
            </div>
            <div class="order-item-details">
                <div class="order-item-name">${item.name}</div>
                <div class="order-item-quantity">Quantity: ${item.quantity}</div>
            </div>
            <div class="order-item-price">${item.price * item.quantity} EG</div>
        </div>
    `,
        )
        .join("");

    // Update summary values
    summarySubtotal.textContent = `${orderSummary.subtotal} EG`;
    summaryDelivery.textContent = `${orderSummary.deliveryFee} EG`;

    if (orderSummary.discount > 0) {
        summaryDiscountRow.style.display = "flex";
        summaryDiscount.textContent = `- ${orderSummary.discount.toFixed(2)} EG`;
    }

    summaryTotal.textContent = `${orderSummary.total.toFixed(2)} EG`;
}

// ==================== //
// Event Listeners
// ==================== //

function addEventListeners() {
    // Delivery time change
    deliveryTimeRadios.forEach((radio) => {
        radio.addEventListener("change", function () {
            if (this.value === "scheduled") {
                scheduledTime.style.display = "block";
            } else {
                scheduledTime.style.display = "none";
            }
        });
    });
}

// ==================== //
// Set Minimum Delivery Date
// ==================== //

function setMinimumDeliveryDate() {
    const deliveryDateInput = document.getElementById("deliveryDate");
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const minDate = tomorrow.toISOString().split("T")[0];
    deliveryDateInput.setAttribute("min", minDate);
    deliveryDateInput.value = minDate;
}

// ==================== //
// Form Validation
// ==================== //

function validateForm() {
    let isValid = true;

    // Clear previous errors
    document.querySelectorAll(".form-group").forEach((group) => {
        group.classList.remove("error");
        const errorElement = group.querySelector(".error-message");
        if (errorElement) {
            errorElement.textContent = "";
        }
    });

    // Full Name
    const fullName = document.getElementById("fullName");
    if (fullName.value.trim().length < 3) {
        showError(
            fullName,
            "Please enter a valid full name (at least 3 characters)",
        );
        isValid = false;
    }

    const phone = document.getElementById("phone");
    const phonePattern = /^(010|011|012|015)\d{8}$/;
    if (!phonePattern.test(phone.value.trim())) {
        showError(phone, "Please enter a valid Egyptian phone number");
        isValid = false;
    }

    const email = document.getElementById("email");
    if (email.value.trim() !== "") {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email.value.trim())) {
            showError(email, "Please enter a valid email address");
            isValid = false;
        }
    }

    const address = document.getElementById("address");
    if (address.value.trim().length < 10) {
        showError(
            address,
            "Please enter a valid address (at least 10 characters)",
        );
        isValid = false;
    }

    const building = document.getElementById("building");
    if (building.value.trim() === "") {
        showError(building, "Please enter a valid building number");
        isValid = false;
    }

    const deliveryTime = document.querySelector(
        'input[name="deliveryTime"]:checked',
    ).value;
    if (deliveryTime === "scheduled") {
        const deliveryDate = document.getElementById("deliveryDate");
        const deliveryTimeSlot = document.getElementById("deliveryTimeSlot");

        if (deliveryDate.value === "") {
            showError(deliveryDate, "Please select a delivery date");
            isValid = false;
        }

        if (deliveryTimeSlot.value === "") {
            showError(deliveryTimeSlot, "Please select a delivery time slot");
            isValid = false;
        }
    }

    return isValid;
}

function showError(input, message) {
    const formGroup = input.closest(".form-group");
    formGroup.classList.add("error");
    formGroup.querySelector(".error-message").textContent = message;

    // Scroll to first error
    if (document.querySelector(".form-group.error") === formGroup) {
        formGroup.scrollIntoView({ behavior: "smooth", block: "center" });
    }
}

function submitOrder() {
    if (!validateForm()) {
        return;
    }

    loadingOverlay.classList.add("show");

    const formData = {
        personalInfo: {
            fullName: document.getElementById("fullName").value.trim(),
            phone: document.getElementById("phone").value.trim(),
            email: document.getElementById("email").value.trim(),
        },
        address: {
            street: document.getElementById("address").value.trim(),
            building: document.getElementById("building").value.trim(),
            floor: document.getElementById("floor").value.trim(),
            apartment: document.getElementById("apartment").value.trim(),
        },
        deliveryTime: {
            type: document.querySelector('input[name="deliveryTime"]:checked')
                .value,
            date: document.getElementById("deliveryDate").value,
            timeSlot: document.getElementById("deliveryTimeSlot").value,
        },
        paymentMethod: document.querySelector(
            'input[name="paymentMethod"]:checked',
        ).value,
        notes: document.getElementById("notes").value.trim(),
        orderSummary: JSON.parse(localStorage.getItem("orderSummary")),
    };

    const orderNumber = generateOrderNumber();

    const order = {
        orderNumber: orderNumber,
        orderData: formData,
        orderDate: new Date().toISOString(),
        status: "pending",
    };

    localStorage.setItem("currentOrder", JSON.stringify(order));

    console.log("Order saved:", order);

    setTimeout(() => {
        localStorage.removeItem("cart");
        localStorage.removeItem("orderSummary");

        loadingOverlay.classList.remove("show");

        window.location.href = `confirmation.html?order=${orderNumber}`;
    }, 2000);
}

function generateOrderNumber() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `ORD-${timestamp}-${random}`;
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    const cartCountElement = document.querySelector(".cart-count");
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
    }
}
