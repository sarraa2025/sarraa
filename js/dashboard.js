// dashboard.js - Admin dashboard main functionality

document.addEventListener("DOMContentLoaded", function() {
    // Check if user is admin
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser || !currentUser.isAdmin) {
        // Redirect non-admins
        // window.location.href = "login.html"; // Already handled by inline script in HTML
        return;
    }

    // Initialize dashboard data if needed
    initializeDataIfNeeded();

    // Load dashboard data
    loadDashboardData();
});

// Initialize sample data if localStorage is empty
function initializeDataIfNeeded() {
    // Check if products exist, if not, add sample data
    if (!localStorage.getItem("products")) {
        const sampleProducts = [
            { id: 1, name: "كريم مرطب فاخر", category: "cat1", price: 150, oldPrice: 180, stock: 50, brand: "ماركة ألف", image: "images/product1.jpg", description: "كريم غني لترطيب عميق للبشرة الجافة.", featured: true, rating: 4.5, reviews: 25, inStock: true },
            { id: 2, name: "سيروم فيتامين سي", category: "cat2", price: 220, oldPrice: null, stock: 30, brand: "ماركة باء", image: "images/product2.jpg", description: "سيروم لتفتيح البشرة ومقاومة علامات التقدم في السن.", featured: true, rating: 4.8, reviews: 40, inStock: true },
            { id: 3, name: "غسول وجه منعش", category: "cat1", price: 80, oldPrice: null, stock: 100, brand: "ماركة جيم", image: "images/product3.jpg", description: "غسول يومي لتنظيف البشرة بلطف.", featured: false, rating: 4.2, reviews: 15, inStock: true },
            { id: 4, name: "ماسك الطين النقي", category: "cat3", price: 120, oldPrice: null, stock: 0, brand: "ماركة ألف", image: "images/product4.jpg", description: "ماسك لتنقية المسام وإزالة الشوائب.", featured: false, rating: 4.0, reviews: 10, inStock: false }
        ];
        localStorage.setItem("products", JSON.stringify(sampleProducts));
        console.log("Initialized sample products.");
    }

    // Check if categories exist, if not, add sample data
    if (!localStorage.getItem("categories")) {
        const sampleCategories = [
            { id: "cat1", name: "العناية بالبشرة", description: "منتجات العناية بالوجه والجسم", image: "images/category1.jpg", featured: true },
            { id: "cat2", name: "مكافحة الشيخوخة", description: "منتجات لتقليل التجاعيد وعلامات التقدم في السن", image: "images/category2.jpg", featured: true },
            { id: "cat3", name: "العناية بالشعر", description: "شامبو وبلسم ومنتجات تصفيف الشعر", image: "images/category3.jpg", featured: false }
        ];
        localStorage.setItem("categories", JSON.stringify(sampleCategories));
        console.log("Initialized sample categories.");
    }

    // Check if users exist, if not, add sample admin and user
    if (!localStorage.getItem("users")) {
        const sampleUsers = [
            { id: 1, firstName: "مشرف", lastName: "النظام", email: "admin@sarraa.com", password: "admin123", isAdmin: true, registrationDate: new Date().toISOString(), status: "active" },
            { id: 2, firstName: "مستخدم", lastName: "تجريبي", email: "user@example.com", password: "user123", isAdmin: false, registrationDate: new Date().toISOString(), status: "active" }
        ];
        localStorage.setItem("users", JSON.stringify(sampleUsers));
        console.log("Initialized sample users.");
    }

    // Check if orders exist, if not, add sample data
    if (!localStorage.getItem("orders")) {
        const sampleOrders = [
            {
                id: "SR-1700000000000-123", userId: 2, date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
                items: [{ productId: 1, name: "كريم مرطب فاخر", price: 150, quantity: 1 }],
                subtotal: 150, shipping: 50, total: 200,
                shippingInfo: { firstName: "مستخدم", lastName: "تجريبي", email: "user@example.com", phone: "0123456789", address: "123 شارع المثال", city: "القاهرة", governorate: "القاهرة", postalCode: "11511" },
                paymentMethod: "cash", notes: "", status: "delivered"
            },
            {
                id: "SR-1700000050000-456", userId: 2, date: new Date().toISOString(), // Today
                items: [{ productId: 2, name: "سيروم فيتامين سي", price: 220, quantity: 2 }, { productId: 3, name: "غسول وجه منعش", price: 80, quantity: 1 }],
                subtotal: 520, shipping: 50, total: 570,
                shippingInfo: { firstName: "مستخدم", lastName: "تجريبي", email: "user@example.com", phone: "0123456789", address: "123 شارع المثال", city: "القاهرة", governorate: "القاهرة", postalCode: "11511" },
                paymentMethod: "card", notes: "يرجى الاتصال قبل الوصول", status: "shipped"
            }
        ];
        localStorage.setItem("orders", JSON.stringify(sampleOrders));
        console.log("Initialized sample orders.");
    }
}

// Load dashboard data and update cards
function loadDashboardData() {
    const products = JSON.parse(localStorage.getItem("products")) || [];
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const categories = JSON.parse(localStorage.getItem("categories")) || []; // Load categories

    // Calculate metrics
    const totalProducts = products.length;
    const totalOrders = orders.length;
    const totalUsers = users.length; // Calculate total users
    const totalCategories = categories.length; // Calculate category count

    // Update dashboard cards using class selectors
    const totalProductsElement = document.querySelector(".product-count");
    const totalOrdersElement = document.querySelector(".order-count");
    const activeUsersElement = document.querySelector(".user-count"); // Use class selector for users
    const totalCategoriesElement = document.querySelector(".category-count"); // Use class selector for categories

    // Update text content
    if (totalProductsElement) totalProductsElement.textContent = totalProducts;
    if (totalOrdersElement) totalOrdersElement.textContent = totalOrders;
    if (activeUsersElement) activeUsersElement.textContent = totalUsers; // Update user count element
    if (totalCategoriesElement) totalCategoriesElement.textContent = totalCategories; // Update category count element

    // Load recent orders (optional) - Element not found in HTML, commenting out call
    // loadRecentOrders(orders);

    // Load top products (optional) - Element not found in HTML, commenting out call
    // loadTopProducts(products, orders);
}

// Helper function to get status badge (ensure it's available if needed, e.g., for recent orders if added later)
function getOrderStatusBadge(status) {
    switch (status) {
        case "pending":
            return `<span class="badge bg-warning text-dark">قيد المعالجة</span>`;
        case "shipped":
            return `<span class="badge bg-info text-dark">تم الشحن</span>`;
        case "delivered":
            return `<span class="badge bg-success">تم التوصيل</span>`;
        case "cancelled":
            return `<span class="badge bg-danger">ملغي</span>`;
        default:
            return `<span class="badge bg-secondary">غير معروف</span>`;
    }
}

// Load recent orders into the dashboard table (Definition kept for future use)
function loadRecentOrders(orders) {
    const recentOrdersTable = document.getElementById("recent-orders-table");
    if (!recentOrdersTable) {
        console.warn("Element with ID 'recent-orders-table' not found for recent orders.");
        return;
    }

    const recentOrders = orders.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
    recentOrdersTable.innerHTML = "";

    if (recentOrders.length === 0) {
        recentOrdersTable.innerHTML = `<tr><td colspan="4" class="text-center">لا توجد طلبات حديثة.</td></tr>`;
        return;
    }

    recentOrders.forEach(order => {
        const row = document.createElement("tr");
        const customerName = `${order.shippingInfo.firstName} ${order.shippingInfo.lastName}`;
        const statusBadge = getOrderStatusBadge(order.status);
        row.innerHTML = `
            <td>#${order.id}</td>
            <td>${customerName}</td>
            <td>${order.total.toFixed(2)} ج.م</td>
            <td>${statusBadge}</td>
        `;
        recentOrdersTable.appendChild(row);
    });
}

// Load top selling products (Definition kept for future use)
function loadTopProducts(products, orders) {
    const topProductsList = document.getElementById("top-products-list");
    if (!topProductsList) {
        console.warn("Element with ID 'top-products-list' not found for top products.");
        return;
    }

    // Basic placeholder: Show first 5 products
    const topProducts = products.slice(0, 5);
    topProductsList.innerHTML = "";

    if (topProducts.length === 0) {
        topProductsList.innerHTML = `<li class="list-group-item">لا توجد منتجات لعرضها.</li>`;
        return;
    }

    topProducts.forEach(product => {
        const listItem = document.createElement("li");
        listItem.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
        listItem.innerHTML = `
            ${product.name}
            <span class="badge bg-primary rounded-pill">${product.stock !== undefined ? product.stock : "N/A"}</span>
        `;
        topProductsList.appendChild(listItem);
    });
}

