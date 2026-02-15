
const menuItems = [
    // Pizza
    {
        id: 1,
        name: "Margherita Pizza",
        category: "pizza",
        price: 120,
        image: "images/menu-items/pizza1.jpg",
        description:
            "Classic Italian pizza with mozzarella cheese, fresh tomatoes, and basil",
        rating: 4.5,
        popular: true,
        isNew: false,
    },
    {
        id: 2,
        name: "Pepperoni Pizza",
        category: "pizza",
        price: 150,
        image: "images/menu-items/pizza1.jpg",
        description: "Pizza with smoked meat, cheese, and hot peppers",
        rating: 4.7,
        popular: true,
        isNew: false,
    },
    {
        id: 3,
        name: "Vegetable Pizza",
        category: "pizza",
        price: 110,
        image: "images/menu-items/pizza1.jpg",
        description: "Healthy pizza with a variety of fresh vegetables",
        rating: 4.2,
        popular: false,
        isNew: false,
    },
    {
        id: 4,
        name: "Meat Pizza",
        category: "pizza",
        price: 160,
        image: "images/menu-items/pizza1.jpg",
        description: "Pizza with ground beef and vegetables",
        rating: 4.6,
        popular: true,
        isNew: false,
    },
    {
        id: 5,
        name: "BBQ Chicken Pizza",
        category: "pizza",
        price: 145,
        image: "images/menu-items/1.jpg",
        description: "Pizza with chicken and delicious BBQ sauce",
        rating: 4.8,
        popular: true,
        isNew: true,
    },

    // Burger
    {
        id: 6,
        name: "Classic Burger",
        category: "burger",
        price: 85,
        image: "images/menu-items/burger1.jpg",
        description: "Premium beef burger with lettuce, tomato, and special sauce",
        rating: 4.4,
        popular: true,
        isNew: false,
    },
    {
        id: 7,
        name: "Cheese Burger",
        category: "burger",
        price: 95,
        image: "images/menu-items/burger1.jpg",
        description: "Beef burger with melted cheddar cheese",
        rating: 4.6,
        popular: true,
        isNew: false,
    },
    {
        id: 8,
        name: "Crispy Chicken Burger",
        category: "burger",
        price: 80,
        image: "images/menu-items/burger1.jpg",
        description: "Crispy chicken burger with mayo and lettuce",
        rating: 4.3,
        popular: false,
        isNew: false,
    },
    {
        id: 9,
        name: "Double Burger",
        category: "burger",
        price: 130,
        image: "images/menu-items/burger1.jpg",
        description: "Double beef and cheese burger for big appetites",
        rating: 4.7,
        popular: true,
        isNew: false,
    },
    {
        id: 10,
        name: "Mushroom Burger",
        category: "burger",
        price: 100,
        image: "images/menu-items/burger1.jpg",
        description: "Burger with fresh mushrooms and special sauce",
        rating: 4.5,
        popular: false,
        isNew: true,
    },

    // Chicken
    {
        id: 11,
        name: "Grilled Chicken",
        category: "chicken",
        price: 95,
        image: "images/menu-items/chicken1.jpg",
        description: "Grilled chicken breasts with garlic and herbs sauce",
        rating: 5.0,
        popular: true,
        isNew: false,
    },
    {
        id: 12,
        name: "Crispy Chicken",
        category: "chicken",
        price: 90,
        image: "images/menu-items/chicken1.jpg",
        description: "Crispy chicken pieces with BBQ sauce",
        rating: 4.6,
        popular: true,
        isNew: false,
    },
    {
        id: 13,
        name: "Spicy Chicken Wings",
        category: "chicken",
        price: 85,
        image: "images/menu-items/chicken1.jpg",
        description: "Spicy and crispy chicken wings",
        rating: 4.7,
        popular: true,
        isNew: false,
    },
    {
        id: 14,
        name: "Chicken Curry",
        category: "chicken",
        price: 100,
        image: "images/menu-items/chicken1.jpg",
        description: "Chicken marinated in curry with rice",
        rating: 4.4,
        popular: false,
        isNew: false,
    },
    {
        id: 15,
        name: "Chicken Strips",
        category: "chicken",
        price: 75,
        image: "images/menu-items/chicken1.jpg",
        description: "Crispy chicken strips with assorted sauces",
        rating: 4.5,
        popular: true,
        isNew: true,
    },

    // Desserts
    {
        id: 16,
        name: "Chocolate Brownie",
        category: "desserts",
        price: 45,
        image: "images/menu-items/dessert1.jpg",
        description: "Warm brownie with melted chocolate",
        rating: 4.9,
        popular: true,
        isNew: false,
    },
    {
        id: 17,
        name: "Cheesecake",
        category: "desserts",
        price: 55,
        image: "images/menu-items/dessert1.jpg",
        description: "Creamy cheesecake with berries",
        rating: 4.8,
        popular: true,
        isNew: false,
    },
    {
        id: 18,
        name: "Ice Cream",
        category: "desserts",
        price: 35,
        image: "images/menu-items/dessert1.jpg",
        description: "Ice cream with different flavors",
        rating: 4.6,
        popular: false,
        isNew: false,
    },
    {
        id: 19,
        name: "Kunafa with Cream",
        category: "desserts",
        price: 50,
        image: "images/menu-items/dessert1.jpg",
        description: "Hot Kunafa with cream and honey",
        rating: 4.7,
        popular: true,
        isNew: false,
    },
    {
        id: 20,
        name: "Strawberry Cake",
        category: "desserts",
        price: 60,
        image: "images/menu-items/dessert1.jpg",
        description: "Layered cake with fresh strawberries",
        rating: 4.5,
        popular: false,
        isNew: true,
    },

    // Drinks
    {
        id: 21,
        name: "Fresh Orange Juice",
        category: "drinks",
        price: 25,
        image: "images/menu-items/drink1.jpg",
        description: "100% natural orange juice",
        rating: 4.6,
        popular: true,
        isNew: false,
    },
    {
        id: 22,
        name: "Lemonade",
        category: "drinks",
        price: 20,
        image: "images/menu-items/drink1.jpg",
        description: "Refreshing lemonade with mint",
        rating: 4.4,
        popular: false,
        isNew: false,
    },
    {
        id: 23,
        name: "Vanilla Milkshake",
        category: "drinks",
        price: 40,
        image: "images/menu-items/drink1.jpg",
        description: "Creamy vanilla milkshake",
        rating: 4.7,
        popular: true,
        isNew: false,
    },
    {
        id: 24,
        name: "Mojito",
        category: "drinks",
        price: 35,
        image: "images/menu-items/drink1.jpg",
        description: "Refreshing mojito with mint and lime",
        rating: 4.5,
        popular: false,
        isNew: true,
    },
    {
        id: 25,
        name: "Espresso Coffee",
        category: "drinks",
        price: 30,
        image: "images/menu-items/drink1.jpg",
        description: "Original Italian espresso coffee",
        rating: 4.8,
        popular: true,
        isNew: false,
    },
];


const categories = [
    {
        id: 1,
        name: "Pizza",
        nameEn: "pizza",
        icon: "fa-pizza-slice",
        count: 5,
    },
    {
        id: 2,
        name: "Burger",
        nameEn: "burger",
        icon: "fa-burger",
        count: 5,
    },
    {
        id: 3,
        name: "Chicken",
        nameEn: "chicken",
        icon: "fa-drumstick-bite",
        count: 5,
    },
    {
        id: 4,
        name: "Desserts",
        nameEn: "desserts",
        icon: "fa-ice-cream",
        count: 5,
    },
    {
        id: 5,
        name: "Drinks",
        nameEn: "drinks",
        icon: "fa-glass-water",
        count: 5,
    },
];


// Get all items
function getAllItems() {
    return menuItems;
}

// Get items by category
function getItemsByCategory(category) {
    return menuItems.filter((item) => item.category === category);
}

// Get popular items
function getPopularItems() {
    return menuItems.filter((item) => item.popular);
}

// Get new items
function getNewItems() {
    return menuItems.filter((item) => item.isNew);
}

// Get item by ID
function getItemById(id) {
    return menuItems.find((item) => item.id === parseInt(id));
}

// Search items
function searchItems(query) {
    query = query.toLowerCase();
    return menuItems.filter(
        (item) =>
            item.name.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query),
    );
}

// Filter by price range
function filterByPrice(minPrice, maxPrice) {
    return menuItems.filter(
        (item) => item.price >= minPrice && item.price <= maxPrice,
    );
}

// Sort items
function sortItems(items, sortBy) {
    const sortedItems = [...items];

    switch (sortBy) {
        case "price-asc":
            return sortedItems.sort((a, b) => a.price - b.price);
        case "price-desc":
            return sortedItems.sort((a, b) => b.price - a.price);
        case "rating":
            return sortedItems.sort((a, b) => b.rating - a.rating);
        case "name":
            return sortedItems.sort((a, b) =>
                a.name.localeCompare(b.name, "en"),
            );
        default:
            return sortedItems;
    }
}

// Get categories
function getCategories() {
    return categories;
}

// Get category by name
function getCategoryByName(nameEn) {
    return categories.find((cat) => cat.nameEn === nameEn);
}