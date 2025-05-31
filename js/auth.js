// auth.js - Authentication functionality for Sarraa e-commerce platform

document.addEventListener("DOMContentLoaded", function() {
    // Initialize users if not exists
    if (!localStorage.getItem("users")) {
        const initialUsers = [
            {
                id: 1,
                firstName: "مشرف",
                lastName: "النظام",
                name: "مشرف النظام",
                email: "admin@sarraa.com",
                password: "admin123", // Use a more secure hashing method in a real application
                isAdmin: true,
                registrationDate: new Date().toISOString(),
                status: "active"
            },
            {
                id: 2,
                firstName: "مستخدم",
                lastName: "تجريبي",
                name: "مستخدم تجريبي",
                email: "user@example.com",
                password: "user123",
                isAdmin: false,
                registrationDate: new Date().toISOString(),
                status: "active"
            }
        ];
        localStorage.setItem("users", JSON.stringify(initialUsers));
    }

    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    updateNavigation(currentUser);

    // Add event listeners for login/logout forms
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", handleLogin);
    }

    const registerForm = document.getElementById("register-form");
    if (registerForm) {
        registerForm.addEventListener("submit", handleRegister);
    }

    // Add password visibility toggle functionality
    const togglePasswordButtons = document.querySelectorAll(".toggle-password");
    togglePasswordButtons.forEach(button => {
        button.addEventListener("click", function() {
            const passwordInput = this.closest(".input-group").querySelector("input[type=\'password\'], input[type=\'text\']");
            if (passwordInput) {
                const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
                passwordInput.setAttribute("type", type);
                const icon = this.querySelector("i");
                if (icon) {
                    icon.classList.toggle("fa-eye");
                    icon.classList.toggle("fa-eye-slash");
                }
            }
        });
    });

    // Add logout listener to any logout links present on the page initially or added dynamically
    // This needs to be robust enough to catch links added by updateNavigation
    document.body.addEventListener("click", function(event) {
        if (event.target.matches(".logout-link") || event.target.closest(".logout-link")) {
            handleLogout(event);
        }
    });
});

// Update navigation based on user login status
function updateNavigation(user) {
    const authLinksDiv = document.querySelector(".auth-links"); // Container for button style links
    const userDropdown = document.getElementById("userDropdown"); // Button that triggers the dropdown
    const userDropdownMenu = document.querySelector(".dropdown-menu[aria-labelledby=\'userDropdown\']"); // The dropdown menu itself
    const navItems = document.querySelector(".navbar-nav.me-auto"); // Target the main nav items for admin link

    // --- Handle Main Navbar Admin Link --- 
    const existingAdminNavLink = navItems?.querySelector(".nav-link[href=\'admin-dashboard.html\']");
    if (user && user.isAdmin) {
        // Add admin link to main nav if it doesn't exist
        if (navItems && !existingAdminNavLink) {
            const adminItem = document.createElement("li");
            adminItem.className = "nav-item";
            adminItem.innerHTML = `<a class="nav-link" href="admin-dashboard.html">لوحة التحكم</a>`;
            const aboutUsLink = navItems.querySelector("a[href=\'about.html\']");
            if (aboutUsLink) {
                 navItems.insertBefore(adminItem, aboutUsLink.closest(".nav-item"));
            } else {
                 navItems.appendChild(adminItem); // Append if needed
            }
        }
    } else {
        // Remove admin link from main nav if user is not admin or not logged in
        if (existingAdminNavLink) {
            existingAdminNavLink.closest(".nav-item").remove();
        }
    }

    // --- Handle Auth Links/Dropdown --- 
    if (user) {
        // User is logged in
        if (userDropdown && userDropdownMenu) {
            // Update Dropdown Style
            userDropdown.querySelector(".user-name").textContent = user.name || `${user.firstName} ${user.lastName}` || "حسابي";
            userDropdown.style.display = ""; // Ensure dropdown button is visible
            if(authLinksDiv) authLinksDiv.innerHTML = ""; // Clear button style if dropdown exists

            // Check if admin link exists in dropdown
            const adminDropdownLink = userDropdownMenu.querySelector("a[href=\'admin-dashboard.html\']");

            if (user.isAdmin) {
                // Add admin link to dropdown if it doesn't exist
                if (!adminDropdownLink) {
                    const adminLi = document.createElement("li");
                    adminLi.innerHTML = `<a class="dropdown-item" href="admin-dashboard.html">لوحة التحكم</a>`;
                    // Insert before profile link
                    const profileLink = userDropdownMenu.querySelector("a[href=\'profile.html\']");
                    if (profileLink) {
                        userDropdownMenu.insertBefore(adminLi, profileLink.parentElement);
                    } else {
                         userDropdownMenu.insertBefore(adminLi, userDropdownMenu.firstChild); // Insert at top if profile not found
                    }
                }
            } else {
                // Remove admin link from dropdown if user is not admin
                if (adminDropdownLink) {
                    adminDropdownLink.parentElement.remove();
                }
            }
            // Ensure other links like profile, orders, logout are present
            // (Assuming they are static in the HTML or added elsewhere if needed)
            // Ensure logout link has the correct class
             const logoutDropdownLink = userDropdownMenu.querySelector("a[href=\'#\']"); // Find logout link
             if(logoutDropdownLink && !logoutDropdownLink.classList.contains('logout-link')){
                 logoutDropdownLink.classList.add('logout-link');
             }

        } else if (authLinksDiv) {
            // Update Button Style
            const displayName = user.name || `${user.firstName} ${user.lastName}` || "الملف الشخصي";
            authLinksDiv.innerHTML = `
                <a href="profile.html" class="btn btn-outline-primary me-2">${displayName}</a>
                <a href="#" class="btn btn-primary logout-link">تسجيل الخروج</a>
            `;
            if(userDropdown) userDropdown.style.display = "none"; // Hide dropdown if button style exists
        }
    } else {
        // User is logged out
        if (userDropdown && userDropdownMenu) {
            // Reset Dropdown Style to default (or hide it)
            // Depending on design, you might hide the dropdown or show login/register inside it
            // For simplicity, let's hide the dropdown button if authLinksDiv exists for login/register
             if(authLinksDiv) {
                 userDropdown.style.display = "none"; 
                 // Ensure authLinksDiv shows login/register
                 authLinksDiv.innerHTML = `
                    <a href="login.html" class="btn btn-outline-primary me-2">تسجيل الدخول</a>
                    <a href="register.html" class="btn btn-primary">إنشاء حساب</a>
                 `;
             } else {
                 // If only dropdown exists, modify it for logged-out state (e.g., show login/register)
                 userDropdown.querySelector(".user-name").textContent = "حسابي";
                 userDropdownMenu.innerHTML = `
                    <li><a class="dropdown-item" href="login.html">تسجيل الدخول</a></li>
                    <li><a class="dropdown-item" href="register.html">إنشاء حساب</a></li>
                 `;
             }

        } else if (authLinksDiv) {
            // Reset Button Style
            authLinksDiv.innerHTML = `
                <a href="login.html" class="btn btn-outline-primary me-2">تسجيل الدخول</a>
                <a href="register.html" class="btn btn-primary">إنشاء حساب</a>
            `;
             if(userDropdown) userDropdown.style.display = "none"; // Hide dropdown if button style exists
        }
    }
}

// Handle login form submission
function handleLogin(event) {
    event.preventDefault();
    
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    
    if (!emailInput || !passwordInput) {
        console.error("Login form elements not found");
        alert("حدث خطأ في نموذج تسجيل الدخول. يرجى المحاولة مرة أخرى.");
        return;
    }

    const email = emailInput.value;
    const password = passwordInput.value;
    
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Ensure user has all required fields
        if (!user.registrationDate) {
            user.registrationDate = new Date().toISOString();
        }
        if (!user.firstName && !user.lastName && user.name) {
            const nameParts = user.name.split(' ');
            user.firstName = nameParts[0] || "مستخدم";
            user.lastName = nameParts.slice(1).join(' ') || "النظام";
        }
        if (!user.status) {
            user.status = "active";
        }
        
        // Update user in localStorage
        const userIndex = users.findIndex(u => u.id === user.id);
        if (userIndex !== -1) {
            users[userIndex] = user;
            localStorage.setItem("users", JSON.stringify(users));
        }
        
        localStorage.setItem("currentUser", JSON.stringify(user));
        // Update navigation immediately before redirecting
        updateNavigation(user);
        // Redirect based on role
        if (user.isAdmin) {
            window.location.href = "admin-dashboard.html"; // Redirect admin to dashboard
        } else {
            window.location.href = "index.html"; // Redirect regular user to homepage
        }
    } else {
        alert("البريد الإلكتروني أو كلمة المرور غير صحيحة");
    }
}

// Handle register form submission
function handleRegister(event) {
    event.preventDefault();
    
    const firstNameInput = document.getElementById("first-name");
    const lastNameInput = document.getElementById("last-name");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirm-password");
    const termsCheckbox = document.getElementById("terms");

    if (!firstNameInput || !lastNameInput || !emailInput || !passwordInput || !confirmPasswordInput || !termsCheckbox) {
        console.error("Registration form elements not found");
        alert("حدث خطأ في نموذج التسجيل. يرجى التأكد من ملء جميع الحقول.");
        return;
    }

    const firstName = firstNameInput.value;
    const lastName = lastNameInput.value;
    const name = `${firstName} ${lastName}`.trim();
    const email = emailInput.value;
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (!termsCheckbox.checked) {
        alert("يجب الموافقة على الشروط والأحكام وسياسة الخصوصية.");
        return;
    }
    
    if (password !== confirmPassword) {
        alert("كلمة المرور وتأكيد كلمة المرور غير متطابقين");
        return;
    }

    if (password.length < 8) {
        alert("يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل.");
        return;
    }
    
    const users = JSON.parse(localStorage.getItem("users")) || [];
    
    if (users.some(u => u.email === email)) {
        alert("البريد الإلكتروني مستخدم بالفعل");
        return;
    }
    
    const newUser = {
        // Use timestamp or a better method for unique IDs in a real app
        id: Date.now(), 
        firstName,
        lastName,
        name,
        email,
        password, // Store hashed password in real app
        isAdmin: users.length === 0, // First user is admin by default
        registrationDate: new Date().toISOString(),
        status: "active"
    };
    
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(newUser));
    
    // Update navigation immediately before redirecting
    updateNavigation(newUser);
    window.location.href = "index.html"; // Redirect new user to homepage
}

// Handle logout
function handleLogout(event) {
    if (event) event.preventDefault();
    localStorage.removeItem("currentUser");
    // Update navigation immediately to reflect logout state
    updateNavigation(null);
    // Redirect to login page after logout
    // Avoid redirect loop if already on login.html
    if (window.location.pathname !== "/login.html") {
       window.location.href = "login.html"; // Changed from index.html
    }
}
