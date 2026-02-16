// ==================== //
// Mock API using XMLHttpRequest
// ==================== //

// Mock API Base URL (simulation)
const API_BASE_URL = "/api"; // In reality, we will use localStorage

// Simulate API delay
const API_DELAY = 1500; // 1.5 seconds

// ==================== //
// Helper: Simulate XMLHttpRequest
// ==================== //

function makeRequest(method, endpoint, data, callback) {
    // Create XMLHttpRequest object
    const xhr = new XMLHttpRequest();

    // Simulate API endpoint
    const url = API_BASE_URL + endpoint;

    // Configure request
    xhr.open(method, url, true);
    xhr.setRequestHeader("Content-Type", "application/json");

    // Handle response
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            // Simulate network delay
            setTimeout(() => {
                if (xhr.status === 200) {
                    const response = JSON.parse(xhr.responseText);
                    callback(null, response);
                } else {
                    const error = JSON.parse(xhr.responseText);
                    callback(error, null);
                }
            }, API_DELAY);
        }
    };

    // Handle errors
    xhr.onerror = function () {
        callback({ message: "Connection error occurred" }, null);
    };

    // Send request
    if (data) {
        // Simulate server response
        simulateServerResponse(method, endpoint, data, xhr);
    } else {
        simulateServerResponse(method, endpoint, null, xhr);
    }
}

// ==================== //
// Simulate Server Response
// ==================== //

function simulateServerResponse(method, endpoint, data, xhr) {
    // Simulate server response

    if (endpoint === "/auth/signup") {
        handleSignupAPI(data, xhr);
    } else if (endpoint === "/auth/login") {
        handleLoginAPI(data, xhr);
    } else if (endpoint === "/auth/logout") {
        handleLogoutAPI(xhr);
    } else if (endpoint === "/user/profile") {
        handleGetProfileAPI(xhr);
    } else {
        // Not found
        const response = JSON.stringify({
            success: false,
            message: "Endpoint not found",
        });
        Object.defineProperty(xhr, "status", { value: 404, writable: true });
        Object.defineProperty(xhr, "responseText", {
            value: response,
            writable: true,
        });
        Object.defineProperty(xhr, "readyState", { value: 4, writable: true });
        xhr.onreadystatechange();
    }
}

// ==================== //
// API Handlers
// ==================== //

function handleSignupAPI(data, xhr) {
    // Get existing users
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Check if email already exists
    const existingUser = users.find((u) => u.email === data.email);

    if (existingUser) {
        // Email already exists
        const response = JSON.stringify({
            success: false,
            message: "Email is already in use",
        });
        Object.defineProperty(xhr, "status", { value: 400, writable: true });
        Object.defineProperty(xhr, "responseText", {
            value: response,
            writable: true,
        });
    } else {
        // Create new user
        const newUser = {
            id: generateUserId(),
            name: data.name,
            email: data.email,
            phone: data.phone,
            password: data.password, // In reality, this should be encrypted
            createdAt: new Date().toISOString(),
        };

        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));

        // Create session
        const session = {
            userId: newUser.id,
            email: newUser.email,
            name: newUser.name,
            token: generateToken(),
        };
        localStorage.setItem("session", JSON.stringify(session));

        const response = JSON.stringify({
            success: true,
            message: "Account created successfully",
            data: {
                user: {
                    id: newUser.id,
                    name: newUser.name,
                    email: newUser.email,
                    phone: newUser.phone,
                },
                token: session.token,
            },
        });
        Object.defineProperty(xhr, "status", { value: 200, writable: true });
        Object.defineProperty(xhr, "responseText", {
            value: response,
            writable: true,
        });
    }

    Object.defineProperty(xhr, "readyState", { value: 4, writable: true });
    xhr.onreadystatechange();
}

function handleLoginAPI(data, xhr) {
    // Get existing users
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Find user
    const user = users.find(
        (u) => u.email === data.email && u.password === data.password,
    );

    if (!user) {
        // Invalid credentials
        const response = JSON.stringify({
            success: false,
            message: "Email or password is incorrect",
        });
        Object.defineProperty(xhr, "status", { value: 401, writable: true });
        Object.defineProperty(xhr, "responseText", {
            value: response,
            writable: true,
        });
    } else {
        // Create session
        const session = {
            userId: user.id,
            email: user.email,
            name: user.name,
            token: generateToken(),
        };
        localStorage.setItem("session", JSON.stringify(session));

        const response = JSON.stringify({
            success: true,
            message: "Login successful",
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                },
                token: session.token,
            },
        });
        Object.defineProperty(xhr, "status", { value: 200, writable: true });
        Object.defineProperty(xhr, "responseText", {
            value: response,
            writable: true,
        });
    }

    Object.defineProperty(xhr, "readyState", { value: 4, writable: true });
    xhr.onreadystatechange();
}

function handleLogoutAPI(xhr) {
    localStorage.removeItem("session");

    const response = JSON.stringify({
        success: true,
        message: "Logout successful",
    });
    Object.defineProperty(xhr, "status", { value: 200, writable: true });
    Object.defineProperty(xhr, "responseText", {
        value: response,
        writable: true,
    });
    Object.defineProperty(xhr, "readyState", { value: 4, writable: true });
    xhr.onreadystatechange();
}

function handleGetProfileAPI(xhr) {
    const session = JSON.parse(localStorage.getItem("session"));

    if (!session) {
        const response = JSON.stringify({
            success: false,
            message: "Not logged in",
        });
        Object.defineProperty(xhr, "status", { value: 401, writable: true });
        Object.defineProperty(xhr, "responseText", {
            value: response,
            writable: true,
        });
    } else {
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const user = users.find((u) => u.id === session.userId);

        if (!user) {
            const response = JSON.stringify({
                success: false,
                message: "User not found",
            });
            Object.defineProperty(xhr, "status", {
                value: 404,
                writable: true,
            });
            Object.defineProperty(xhr, "responseText", {
                value: response,
                writable: true,
            });
        } else {
            const response = JSON.stringify({
                success: true,
                data: {
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        phone: user.phone,
                    },
                },
            });
            Object.defineProperty(xhr, "status", {
                value: 200,
                writable: true,
            });
            Object.defineProperty(xhr, "responseText", {
                value: response,
                writable: true,
            });
        }
    }

    Object.defineProperty(xhr, "readyState", { value: 4, writable: true });
    xhr.onreadystatechange();
}

// ==================== //
// Helper Functions
// ==================== //

function generateUserId() {
    return "user_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
}

function generateToken() {
    return (
        "token_" + Date.now() + "_" + Math.random().toString(36).substr(2, 16)
    );
}

// ==================== //
// Check if user is logged in
// ==================== //

function isLoggedIn() {
    const session = localStorage.getItem("session");
    return session !== null;
}

function getCurrentUser() {
    const session = localStorage.getItem("session");
    return session ? JSON.parse(session) : null;
}

function logout() {
    makeRequest("POST", "/auth/logout", null, function (error, response) {
        if (!error && response.success) {
            window.location.href = "index.html";
        }
    });
}
