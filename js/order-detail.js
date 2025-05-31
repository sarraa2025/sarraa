// order-detail.js - Handles order detail page functionality

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    
    // Get order ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('id');
    
    if (!orderId) {
        window.location.href = 'profile.html';
        return;
    }
    
    // Load order details
    loadOrderDetails(orderId, currentUser.id);
    
    // Update cart count
    if (typeof updateCartCount === "function") {
        updateCartCount();
    }
});

function loadOrderDetails(orderId, userId) {
    // Get all orders from localStorage
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    
    // Find the specific order
    const order = orders.find(o => o.id === orderId);
    
    // Verify order exists and belongs to current user
    if (!order || order.userId !== userId) {
        alert("لم يتم العثور على الطلب!");
        window.location.href = 'profile.html';
        return;
    }
    
    // Update order ID in UI
    document.querySelector('.order-id').textContent = `#${order.id}`;
    
    // Format date
    const orderDate = new Date(order.date);
    const formattedDate = orderDate.toLocaleDateString('ar-EG');
    document.querySelector('.order-date').textContent = formattedDate;
    
    // Update order status in UI
    document.querySelector('.order-status').innerHTML = `
        <span class="badge bg-${getStatusBadgeColor(order.status)}">
            ${getStatusText(order.status)}
        </span>
    `;
    
    // Update progress steps based on order status
    updateProgressSteps(order.status);
    
    // Update order items
    const orderItemsContainer = document.querySelector('.order-items');
    if (orderItemsContainer) {
        orderItemsContainer.innerHTML = '';
        
        order.items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'order-item d-flex align-items-center mb-3 pb-3 border-bottom';
            
            // Get product image if available
            const products = JSON.parse(localStorage.getItem("products")) || [];
            const product = products.find(p => p.id === item.productId);
            const productImage = product ? product.image || 'images/product-placeholder.jpg' : 'images/product-placeholder.jpg';
            
            itemElement.innerHTML = `
                <div class="flex-shrink-0 me-3">
                    <img src="${productImage}" alt="${item.name}" class="img-fluid rounded" style="width: 60px; height: 60px; object-fit: cover;">
                </div>
                <div class="flex-grow-1">
                    <h6 class="mb-1">${item.name}</h6>
                    <div class="text-muted small">الكمية: ${item.quantity}</div>
                </div>
                <div class="text-end">
                    <div class="fw-bold">${(item.price * item.quantity).toFixed(2)} ج.م</div>
                    <div class="text-muted small">${item.price.toFixed(2)} ج.م × ${item.quantity}</div>
                </div>
            `;
            
            orderItemsContainer.appendChild(itemElement);
        });
    }
    
    // Update order summary
    document.querySelector('.order-subtotal').textContent = `${order.subtotal.toFixed(2)} ج.م`;
    document.querySelector('.order-shipping').textContent = `${order.shipping.toFixed(2)} ج.م`;
    document.querySelector('.order-total').textContent = `${order.total.toFixed(2)} ج.م`;
    
    // Update shipping details
    document.querySelector('.shipping-name').textContent = `${order.shippingInfo.firstName} ${order.shippingInfo.lastName}`;
    document.querySelector('.shipping-address').textContent = order.shippingInfo.address;
    document.querySelector('.shipping-city').textContent = order.shippingInfo.city;
    document.querySelector('.shipping-governorate').textContent = order.shippingInfo.governorate;
    document.querySelector('.shipping-phone').textContent = order.shippingInfo.phone;
    document.querySelector('.shipping-email').textContent = order.shippingInfo.email;
    
    // Update payment method
    document.querySelector('.payment-method').textContent = order.paymentMethod === 'cash' ? 'الدفع عند الاستلام' : 'بطاقة ائتمان';
    
    // Add edit button if order is still pending
    if (order.status === 'pending') {
        const actionsContainer = document.createElement('div');
        actionsContainer.className = 'mt-4 d-flex justify-content-between';
        actionsContainer.innerHTML = `
            <button class="btn btn-outline-secondary edit-order-btn">
                <i class="fas fa-edit me-1"></i> تعديل الطلب
            </button>
            <button class="btn btn-outline-danger delete-order-btn">
                <i class="fas fa-trash me-1"></i> حذف الطلب
            </button>
        `;
        
        // Append to shipping details card
        const shippingCard = document.querySelector('.shipping-details').closest('.card-body');
        shippingCard.appendChild(actionsContainer);
        
        // Add event listeners
        document.querySelector('.edit-order-btn').addEventListener('click', function() {
            editOrder(order.id);
        });
        
        document.querySelector('.delete-order-btn').addEventListener('click', function() {
            deleteOrder(order.id);
        });
    }
}

function updateProgressSteps(status) {
    const progressSteps = document.querySelectorAll('#progress-steps .step');
    
    // Reset all steps
    progressSteps.forEach(step => step.classList.remove('active'));
    
    // Set active steps based on status
    progressSteps[0].classList.add('active'); // Order placed is always active
    
    if (status === 'processing') {
        progressSteps[1].classList.add('active');
    } else if (status === 'shipped') {
        progressSteps[1].classList.add('active');
        progressSteps[2].classList.add('active');
    } else if (status === 'delivered') {
        progressSteps[1].classList.add('active');
        progressSteps[2].classList.add('active');
        progressSteps[3].classList.add('active');
    }
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

function editOrder(orderId) {
    // Store order ID in sessionStorage for checkout page to use
    sessionStorage.setItem("editOrderId", orderId);
    window.location.href = "checkout.html";
}

function deleteOrder(orderId) {
    // Confirm deletion
    if (!confirm("هل أنت متأكد من رغبتك في حذف هذا الطلب؟")) {
        return;
    }
    
    // Get orders from localStorage
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    const orderIndex = orders.findIndex(order => order.id === orderId);
    
    if (orderIndex === -1) {
        alert("لم يتم العثور على الطلب!");
        return;
    }
    
    // Remove the order
    orders.splice(orderIndex, 1);
    
    // Save updated orders back to localStorage
    localStorage.setItem("orders", JSON.stringify(orders));
    
    // Show success message and redirect to profile
    alert("تم حذف الطلب بنجاح!");
    window.location.href = "profile.html";
}
