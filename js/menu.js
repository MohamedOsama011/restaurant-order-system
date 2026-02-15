let currentCategory = "all";
let currentSort = "default";
let currentFilter = null;
let searchQuery = "";

const menuGrid = document.getElementById("menuGrid");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const categoryButtons = document.querySelectorAll(".filter-btn");
const filterTags = document.querySelectorAll(".filter-tag");
const resultCount = document.getElementById("resultCount");
const noResults = document.getElementById("noResults");
const toast = document.getElementById("toast");

document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get("category");

    if (categoryParam) {
        currentCategory = categoryParam;
        updateCategoryButtons();
    }
    displayMenuItems();
    updateCartCount();
});

function displayMenuItems() {
    let items = getAllItems();
    if (currentCategory !== "all") {
        items = getItemsByCategory(currentCategory);
    }
    if (currentFilter === "popular") {
        items = items.filter((item) => item.popular);
    } else if (currentFilter === "new") {
        items = items.filter((item) => item.isNew);
    }

    if (searchQuery) {
        items = items.filter(
            (item) =>
                item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.description
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()),
        );
    }

    items = sortItems(items, currentSort);

    resultCount.textContent = items.length;

    if (items.length === 0) {
        menuGrid.style.display = "none";
        noResults.style.display = "block";
    } else {
        menuGrid.style.display = "grid";
        noResults.style.display = "none";
        renderMenuItems(items);
    }
}

function renderMenuItems(items) {
    menuGrid.innerHTML = items
        .map(
            (item) => `
        <div class="food-card" data-id="${item.id}">
            <div class="food-image">
                <img src="${item.image}" alt="${item.name}" onerror="this.src='images/placeholder.jpg'">
                
                <div class="badges-container">
                    ${item.popular ? '<span class="badge badge-popular">Most popular</span>' : ""}
                    ${item.isNew ? '<span class="badge badge-new">New</span>' : ""}
                </div>

            </div>

            <div class="food-details">
                <h3>${item.name}</h3>
                <p class="food-description">${item.description}</p>
                <div class="food-rating">
                    ${generateStars(item.rating)}
                    <span>(${item.rating})</span>
                </div>
                <div class="food-footer">
                    <span class="food-price">${item.price} EGP</span>
                    <button class="btn btn-primary add-to-cart-btn" onclick="addToCart(${item.id})">
                        <i class="fas fa-shopping-cart"></i>
                        Add to card
                    </button>
                </div>
            </div>
        </div>
    `,
        )
        .join("");
}

function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    let stars = "";

    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }

    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }

    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }

    return stars;
}

function addToCart(itemId) {
    const item = getItemById(itemId);

    if (!item) return;

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItem = cart.find((cartItem) => cartItem.id === itemId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
            quantity: 1,
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartCount();

    showToast(`Added ${item.name} to the cart!`);
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    const cartCountElement = document.querySelector(".cart-count");
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
    }
}

function showToast(message) {
    const toastMessage = document.getElementById("toastMessage");
    toastMessage.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

categoryButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
        currentCategory = this.dataset.category;

        categoryButtons.forEach((b) => b.classList.remove("active"));
        this.classList.add("active");

        displayMenuItems();
    });
});

searchInput.addEventListener("input", function () {
    searchQuery = this.value.trim();
    displayMenuItems();
});

sortSelect.addEventListener("change", function () {
    currentSort = this.value;
    displayMenuItems();
});

filterTags.forEach((tag) => {
    tag.addEventListener("click", function () {
        const filterType = this.dataset.filter;

        if (currentFilter === filterType) {
            currentFilter = null;
            this.classList.remove("active");
        } else {
            currentFilter = filterType;
            filterTags.forEach((t) => t.classList.remove("active"));
            this.classList.add("active");
        }

        displayMenuItems();
    });
});

function updateCategoryButtons() {
    categoryButtons.forEach((btn) => {
        if (btn.dataset.category === currentCategory) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });
}
