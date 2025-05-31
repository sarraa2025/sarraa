// profile.js - Handles profile page functionality including recent orders display and management

document.addEventListener("DOMContentLoaded", function() {
    // 1. Check if user is logged in (using localStorage)
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    
    if (!currentUser) {
        // Not logged in, redirect to login page
        window.location.href = "login.html";
        return; // Stop script execution for this page
    }
    
    // 2. User is logged in, populate profile data
    populateProfileData(currentUser);
    
    // 3. Load recent orders
    loadRecentOrders(currentUser.id);
    
    // 4. Add event listener for profile form submission
    const profileForm = document.getElementById("profile-form");
    if (profileForm) {
        profileForm.addEventListener("submit", handleProfileUpdate);
    }

    // 5. Add event listener for logout links on this page
    const logoutLinks = document.querySelectorAll(".logout-link");
    logoutLinks.forEach(link => {
        link.addEventListener("click", handleLogout); // handleLogout is defined in auth.js
    });

    // 6. Update cart count (function from cart.js)
    if (typeof updateCartCount === "function") {
        updateCartCount();
    }
});

function populateProfileData(user) {
    // Populate sidebar
    const userFullNameElement = document.querySelector(".user-full-name");
    const userEmailElement = document.querySelector(".user-email");
    if (userFullNameElement) userFullNameElement.textContent = user.name || "اسم المستخدم";
    if (userEmailElement) userEmailElement.textContent = user.email || "";

    // Populate form fields (use specific IDs)
    const firstNameInput = document.getElementById("profile-first-name");
    const lastNameInput = document.getElementById("profile-last-name");
    const emailInput = document.getElementById("profile-email");
    const phoneInput = document.getElementById("profile-phone");

    // Split name into first and last if possible
    const nameParts = user.name ? user.name.split(" ") : ["", ""];
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ");

    if (firstNameInput) firstNameInput.value = firstName;
    if (lastNameInput) lastNameInput.value = lastName;
    if (emailInput) emailInput.value = user.email || "";
    if (phoneInput) phoneInput.value = user.phone || ""; // Assuming phone might be stored
}

function handleProfileUpdate(event) {
    event.preventDefault();
    
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
        alert("حدث خطأ. يرجى تسجيل الدخول مرة أخرى.");
        window.location.href = "login.html";
        return;
    }

    // Get updated data from form
    const updatedFirstName = document.getElementById("profile-first-name").value;
    const updatedLastName = document.getElementById("profile-last-name").value;
    const updatedPhone = document.getElementById("profile-phone").value;
    const updatedName = `${updatedFirstName} ${updatedLastName}`.trim();

    // Find the user in the main users list
    let users = JSON.parse(localStorage.getItem("users")) || [];
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    
    if (userIndex !== -1) {
        // Update user data
        users[userIndex].name = updatedName;
        users[userIndex].phone = updatedPhone;
        
        // Update localStorage
        localStorage.setItem("users", JSON.stringify(users));
        
        // Update current user
        currentUser.name = updatedName;
        currentUser.phone = updatedPhone;
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
        
        // Show success message
        alert("تم تحديث البيانات بنجاح!");
        
        // Refresh profile data display
        populateProfileData(currentUser);
    } else {
        alert("حدث خطأ في تحديث البيانات. يرجى المحاولة مرة أخرى.");
    }
}

function loadRecentOrders(userId) {
    const recentOrdersContainer = document.getElementById("recent-orders");
    if (!recentOrdersContainer) return;

    // Get all orders from localStorage
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    
    // Filter orders for current user and sort by date (newest first)
    const userOrders = orders
        .filter(order => order.userId === userId)
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    // Check if there's a latest order ID from a recent order completion
    const latestOrderId = localStorage.getItem("latestOrderId");
    
    // If no orders found
    if (userOrders.length === 0) {
        recentOrdersContainer.innerHTML = `
            <div class="text-center text-muted">
                <p>لا توجد طلبات سابقة.</p>
                <a href="products.html" class="btn btn-primary mt-2">تسوق الآن</a>
            </div>
        `;
        return;
    }

    // Display up to 3 most recent orders
    const recentOrders = userOrders.slice(0, 3);
    
    // Create HTML for recent orders
    let ordersHTML = `
        <div class="table-responsive">
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th>رقم الطلب</th>
                        <th>التاريخ</th>
                        <th>الحالة</th>
                        <th>الإجمالي</th>
                        <th>الإجراءات</th>
                    </tr>
                </thead>
                <tbody>
    `;

    recentOrders.forEach(order => {
        // Format date
        const orderDate = new Date(order.date);
        const formattedDate = orderDate.toLocaleDateString('ar-EG');
        
        // Determine if this is the latest order (for highlighting)
        const isLatestOrder = order.id === latestOrderId;
        const rowClass = isLatestOrder ? 'table-primary' : '';
        
        // Determine if order can be edited/canceled based on status
        // Only pending orders can be edited or canceled
        const canModify = order.status === "pending";
        
        ordersHTML += `
            <tr class="${rowClass}">
                <td>${order.id}</td>
                <td>${formattedDate}</td>
                <td>
                    <span class="badge bg-${getStatusBadgeColor(order.status)}">
                        ${getStatusText(order.status)}
                    </span>
                </td>
                <td>${order.total.toFixed(2)} ج.م</td>
                <td>
                    <div class="btn-group btn-group-sm">
                        <a href="order-detail.html?id=${order.id}" class="btn btn-outline-primary">
                            <i class="fas fa-eye"></i> عرض
                        </a>
                        ${canModify ? `
                        <button class="btn btn-outline-secondary edit-order" data-id="${order.id}">
                            <i class="fas fa-edit"></i> تعديل
                        </button>
                        <button class="btn btn-outline-danger cancel-order" data-id="${order.id}">
                            <i class="fas fa-times"></i> إلغاء
                        </button>
                        ` : ''}
                    </div>
                </td>
            </tr>
        `;
    });

    ordersHTML += `
                </tbody>
            </table>
        </div>
    `;

    // Update the container
    recentOrdersContainer.innerHTML = ordersHTML;
    
    // Clear the latest order ID after displaying it
    if (latestOrderId) {
        localStorage.removeItem("latestOrderId");
    }
    
    // Add event listeners for edit and cancel buttons
    attachOrderActionListeners();
}

function getStatusBadgeColor(status) {
    switch (status) {
        case "pending": return "warning";
        case "processing": return "info";
        case "shipped": return "primary";
        case "delivered": return "success";
        case "cancelled": return "danger";
        default: return "secondary";
    }
}

function getStatusText(status) {
    switch (status) {
        case "pending": return "قيد الانتظار";
        case "processing": return "قيد المعالجة";
        case "shipped": return "تم الشحن";
        case "delivered": return "تم التسليم";
        case "cancelled": return "ملغي";
        default: return "غير معروف";
    }
}

function attachOrderActionListeners() {
    // Add event listeners for edit buttons
    document.querySelectorAll(".edit-order").forEach(button => {
        button.addEventListener("click", function() {
            const orderId = this.getAttribute("data-id");
            editOrder(orderId);
        });
    });
    
    // Add event listeners for cancel buttons
    document.querySelectorAll(".cancel-order").forEach(button => {
        button.addEventListener("click", function() {
            const orderId = this.getAttribute("data-id");
            cancelOrder(orderId);
        });
    });
}

function editOrder(orderId) {
    // Get the order from localStorage
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    const orderIndex = orders.findIndex(order => order.id === orderId);
    
    if (orderIndex === -1) {
        alert("لم يتم العثور على الطلب!");
        return;
    }
    
    // Redirect to edit order page (which is the checkout page with pre-filled data)
    // We'll store the order ID in sessionStorage to indicate we're editing
    sessionStorage.setItem("editOrderId", orderId);
    window.location.href = "checkout.html";
}

function cancelOrder(orderId) {
    // Confirm deletion
    if (!confirm("هل أنت متأكد من رغبتك في حذف هذا الطلب؟")) {
        return;
    }
    
    // Get the order from localStorage
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    const orderIndex = orders.findIndex(order => order.id === orderId);
    
    if (orderIndex === -1) {
        alert("لم يتم العثور على الطلب!");
        return;
    }
    
    // Remove the order completely (not just changing status)
    orders.splice(orderIndex, 1);
    
    // Save updated orders back to localStorage
    localStorage.setItem("orders", JSON.stringify(orders));
    
    // Reload recent orders to reflect the change
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser) {
        loadRecentOrders(currentUser.id);
    }
    
    // Show success message
    alert("تم حذف الطلب بنجاح!");
}
