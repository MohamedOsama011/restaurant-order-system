
// API Configuration

const API_BASE_URL = 'https://dummyjson.com';

// Make XMLHttpRequest

function makeRequest(method, endpoint, data, callback) {
    const xhr = new XMLHttpRequest();
    const url = API_BASE_URL + endpoint;
    
    console.log(`Making ${method} request to: ${url}`);
    
    xhr.open(method, url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status >= 200 && xhr.status < 300) {
                const response = JSON.parse(xhr.responseText);
                console.log('Success:', response);
                callback(null, response);
            } else {
                try {
                    const error = JSON.parse(xhr.responseText);
                    console.log('Error:', error);
                    callback(error, null);
                } catch (e) {
                    callback({ message: 'Request failed' }, null);
                }
            }
        }
    };
    
    xhr.onerror = function() {
        console.error('Network error');
        callback({ message: 'Network error occurred' }, null);
    };
    
    if (data) {
        xhr.send(JSON.stringify(data));
    } else {
        xhr.send();
    }
}

// Login API

function apiLogin(email, password, callback) {
    // DummyJSON uses username instead of email
    const data = {
        username: email.split('@')[0], // Use part before @ as username
        password: password
    };
    
    makeRequest('POST', '/auth/login', data, function(error, response) {
        if (error) {
            callback({ success: false, message: 'Invalid username or password' });
        } else {
            // Save user data
            const user = {
                id: response.id,
                username: response.username,
                email: response.email,
                firstName: response.firstName,
                lastName: response.lastName,
                token: response.token
            };
            
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('token', response.token);
            
            callback({ success: true, message: 'Login successful', user: user });
        }
    });
}


// Signup API (Simulated)

function apiSignup(name, email, password, callback) {
    // DummyJSON doesn't have real signup, so we'll simulate it
    // In real app, this would be a real API call
    
    // Simulate API delay
    setTimeout(() => {
        // Save user data locally
        const user = {
            id: Date.now(),
            username: email.split('@')[0],
            email: email,
            firstName: name.split(' ')[0],
            lastName: name.split(' ')[1] || '',
            token: 'dummy_token_' + Date.now()
        };
        
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', user.token);
        
        callback({ success: true, message: 'Account created successfully', user: user });
    }, 1000);
}


// Helper Functions


function isLoggedIn() {
    return localStorage.getItem('token') !== null;
}

function getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}

function logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = 'auth.html';
}

function getAuthToken() {
    return localStorage.getItem('token');
}

