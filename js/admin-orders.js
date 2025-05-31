// admin-orders.js - Admin dashboard order management functionality

document.addEventListener("DOMContentLoaded", function() {
    // Check if user is admin
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser || !currentUser.isAdmin) {
        window.location.href = "index.html";
        return;
    }

    // Load orders in admin dashboard
    loadAdminOrders();

    // Add event listener for filter status dropdown
    const filterStatus = document.getElementById("filter-status");
    if (filterStatus) {
        filterStatus.addEventListener("change", () => loadAdminOrders(filterStatus.value));
    }

    // Add event listener for update status button in modal
    const updateStatusBtn = document.getElementById("update-status");
    if (updateStatusBtn) {
        updateStatusBtn.addEventListener("click", handleUpdateOrderStatus);
    }

    // Add event listener for print order button (placeholder)
    const printOrderBtn = document.getElementById("print-order");
    if (printOrderBtn) {
        printOrderBtn.addEventListener("click", () => {
            alert("ميزة طباعة الطلب قيد التطوير.");
            // Add actual print logic here if needed
        });
    }
});

// Load orders in admin dashboard
function loadAdminOrders(filterStatus = "") {
    const ordersList = document.getElementById("orders-list");
    if (!ordersList) return;

    let orders = JSON.parse(localStorage.getItem("orders")) || [];

    // Filter orders by status
    if (filterStatus) {
        orders = orders.filter(order => order.status === filterStatus);
    }

    // Sort orders by date (newest first)
    orders.sort((a, b) => new Date(b.date) - new Date(a.date));

    ordersList.innerHTML = ""; // Clear existing list

    if (orders.length === 0) {
        ordersList.innerHTML = `<tr><td colspan="6" class="text-center">لا توجد طلبات لعرضها.</td></tr>`;
        return;
    }

    orders.forEach(order => {
        const row = document.createElement("tr");
        const orderDate = new Date(order.date).toLocaleDateString("ar-EG");
        const customerName = `${order.shippingInfo.firstName} ${order.shippingInfo.lastName}`;
        const statusBadge = getOrderStatusBadge(order.status);

        row.innerHTML = `
            <td>#${order.id}</td>
            <td>${customerName}</td>
            <td>${orderDate}</td>
            <td>${order.total.toFixed(2)} ج.م</td>
            <td>${statusBadge}</td>
            <td>
                <button class="btn btn-sm btn-info view-order" data-id="${order.id}" data-bs-toggle="modal" data-bs-target="#orderDetailsModal">
                    <i class="fas fa-eye"></i> عرض
                </button>
            </td>
        `;
        
        ordersList.appendChild(row);
    });
    
    // Add event listeners for view buttons after rendering
    attachOrderActionListeners();
    // Note: Pagination logic is missing and needs implementation if required.
}

// Get bootstrap badge for order status
function getOrderStatusBadge(status) {
    switch (status) {
        case "pending":
            return ".<span class=\"badge bg-warning text-dark\">قيد المعالجة</span>";
        case "shipped":
            return ".<span class=\"badge bg-info text-dark\">تم الشحن</span>";
        case "delivered":
            return ".<span class=\"badge bg-success\">تم التوصيل</span>";
        case "cancelled":
            return ".<span class=\"badge bg-danger\">ملغي</span>";
        default:
            return ".<span class=\"badge bg-secondary\">غير معروف</span>";
    }
}

// Attach event listeners for view buttons
function attachOrderActionListeners() {
    const viewButtons = document.querySelectorAll(".view-order");
    
    viewButtons.forEach(button => {
        button.addEventListener("click", function() {
            const orderId = this.getAttribute("data-id");
            populateOrderDetailsModal(orderId);
        });
    });
}

// Populate order details modal with data
function populateOrderDetailsModal(orderId) {
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    const order = orders.find(o => o.id === orderId);

    if (!order) return;

    // Store current order ID in the modal for update function
    const modal = document.getElementById("orderDetailsModal");
    modal.dataset.currentOrderId = orderId;

    // Populate modal fields
    modal.querySelector(".order-id").textContent = `#${order.id}`;
    modal.querySelector(".customer-name").textContent = `${order.shippingInfo.firstName} ${order.shippingInfo.lastName}`;
    modal.querySelector(".customer-email").textContent = order.shippingInfo.email;
    modal.querySelector(".customer-phone").textContent = order.shippingInfo.phone;
    modal.querySelector(".shipping-address").textContent = order.shippingInfo.address;
    modal.querySelector(".shipping-city").textContent = order.shippingInfo.city;
    modal.querySelector(".shipping-governorate").textContent = order.shippingInfo.governorate;
    modal.querySelector(".order-number").textContent = `#${order.id}`;
    modal.querySelector(".order-date").textContent = new Date(order.date).toLocaleString("ar-EG");
    modal.querySelector(".payment-method").textContent = order.paymentMethod === "cash" ? "الدفع عند الاستلام" : "بطاقة ائتمان";
    modal.querySelector("#order-status").value = order.status;
    modal.querySelector(".order-notes").textContent = order.notes || "لا يوجد";

    // Populate order items table
    const itemsTableBody = modal.querySelector("#order-items");
    itemsTableBody.innerHTML = "";
    order.items.forEach(item => {
        const itemRow = document.createElement("tr");
        itemRow.innerHTML = `
            <td>${item.name}</td>
            <td>${item.price.toFixed(2)} ج.م</td>
            <td>${item.quantity}</td>
            <td>${(item.price * item.quantity).toFixed(2)} ج.م</td>
        `;
        itemsTableBody.appendChild(itemRow);
    });

    // Populate totals
    modal.querySelector(".order-subtotal").textContent = `${order.subtotal.toFixed(2)} ج.م`;
    modal.querySelector(".order-shipping").textContent = `${order.shipping.toFixed(2)} ج.م`;
    modal.querySelector(".order-total").textContent = `${order.total.toFixed(2)} ج.م`;
}

// Handle update order status
function handleUpdateOrderStatus() {
    const modal = document.getElementById("orderDetailsModal");
    const orderIdToUpdate = modal.dataset.currentOrderId;
    const newStatus = modal.querySelector("#order-status").value;

    if (!orderIdToUpdate) return;

    let orders = JSON.parse(localStorage.getItem("orders")) || [];
    const orderIndex = orders.findIndex(o => o.id === orderIdToUpdate);

    if (orderIndex === -1) {
        alert("لم يتم العثور على الطلب.");
        return;
    }

    orders[orderIndex].status = newStatus;
    localStorage.setItem("orders", JSON.stringify(orders));

    // Reload orders list in the background
    loadAdminOrders(document.getElementById("filter-status").value);

    // Update status badge in the modal (optional, but good UX)
    // const statusBadgeContainer = modal.querySelector(".status-badge-container"); // Assuming you add a container
    // if (statusBadgeContainer) {
    //     statusBadgeContainer.innerHTML = getOrderStatusBadge(newStatus);
    // }

    alert("تم تحديث حالة الطلب بنجاح.");
    // Optionally close the modal or keep it open
    // const orderDetailsModal = bootstrap.Modal.getInstance(modal);
    // orderDetailsModal.hide();
}

