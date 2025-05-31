// checkout.js - Handles checkout page functionality including order editing

document.addEventListener("DOMContentLoaded", function() {
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    
    // Check if we're editing an existing order
    const editOrderId = sessionStorage.getItem("editOrderId");
    
    if (editOrderId) {
        // We're in edit mode - load the order data
        loadOrderForEditing(editOrderId);
    } else {
        // Normal checkout flow - load cart summary
        loadCheckoutSummary();
    }
    
    // Add listener to show/hide credit card details
    const paymentMethodRadios = document.querySelectorAll("input[name=\"payment-method\"]");
    paymentMethodRadios.forEach(radio => {
        radio.addEventListener("change", function() {
            const cardDetails = document.getElementById("card-details");
            if (this.value === "card") {
                cardDetails.classList.remove("d-none");
            } else {
                cardDetails.classList.add("d-none");
            }
        });
    });
    
    // Add event listener for checkout form submission
    const checkoutForm = document.getElementById("checkout-form");
    if (checkoutForm) {
        checkoutForm.addEventListener("submit", function(event) {
            event.preventDefault();
            if (editOrderId) {
                handleUpdateOrder(editOrderId);
            } else {
                handlePlaceOrder();
            }
        });
    }
    
    // Update cart count
    if (typeof updateCartCount === "function") {
        updateCartCount();
    }
    
    // Update page title if in edit mode
    if (editOrderId) {
        document.querySelector('.section-title').textContent = "تعديل الطلب";
        document.querySelector('button[type="submit"]').textContent = "حفظ التعديلات";
    }
});

function loadOrderForEditing(orderId) {
    // Get all orders from localStorage
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    
    // Find the specific order
    const order = orders.find(o => o.id === orderId);
    
    // Verify order exists
    if (!order) {
        alert("لم يتم العثور على الطلب!");
        window.location.href = 'profile.html';
        return;
    }
    
    // Pre-fill shipping information
    document.getElementById("first-name").value = order.shippingInfo.firstName || "";
    document.getElementById("last-name").value = order.shippingInfo.lastName || "";
    document.getElementById("email").value = order.shippingInfo.email || "";
    document.getElementById("phone").value = order.shippingInfo.phone || "";
    document.getElementById("address").value = order.shippingInfo.address || "";
    document.getElementById("city").value = order.shippingInfo.city || "";
    
    // Set governorate dropdown
    const governorateSelect = document.getElementById("governorate");
    if (governorateSelect) {
        for (let i = 0; i < governorateSelect.options.length; i++) {
            if (governorateSelect.options[i].value === order.shippingInfo.governorate) {
                governorateSelect.selectedIndex = i;
                break;
            }
        }
    }
    
    document.getElementById("postal-code").value = order.shippingInfo.postalCode || "";
    
    // Set payment method
    const cashRadio = document.getElementById("cash-on-delivery");
    const cardRadio = document.getElementById("credit-card");
    
    if (order.paymentMethod === "card") {
        cardRadio.checked = true;
        document.getElementById("card-details").classList.remove("d-none");
    } else {
        cashRadio.checked = true;
    }
    
    // Set order notes
    document.getElementById("order-notes").value = order.notes || "";
    
    // Load order items in summary
    const orderSummaryContainer = document.querySelector(".order-summary .order-items");
    if (orderSummaryContainer) {
        orderSummaryContainer.innerHTML = "";
        
        order.items.forEach(item => {
            const itemTotal = item.price * item.quantity;
            
            const itemDiv = document.createElement("div");
            itemDiv.classList.add("order-item", "d-flex", "justify-content-between", "align-items-center", "mb-2");
            itemDiv.innerHTML = `
                <div>
                    <span class="fw-bold">${item.name}</span>
                    <div class="text-muted small">${item.quantity} × ${item.price.toFixed(2)} ج.م</div>
                </div>
                <span>${itemTotal.toFixed(2)} ج.م</span>
            `;
            orderSummaryContainer.appendChild(itemDiv);
        });
    }
    
    // Update order totals
    document.querySelector(".cart-subtotal").textContent = `${order.subtotal.toFixed(2)} ج.م`;
    document.querySelector(".cart-shipping").textContent = `${order.shipping.toFixed(2)} ج.م`;
    document.querySelector(".cart-total").textContent = `${order.total.toFixed(2)} ج.م`;
}

function handleUpdateOrder(orderId) {
    // Get all orders from localStorage
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    
    // Find the order index
    const orderIndex = orders.findIndex(o => o.id === orderId);
    
    if (orderIndex === -1) {
        alert("لم يتم العثور على الطلب!");
        return;
    }
    
    // Get the original order
    const originalOrder = orders[orderIndex];
    
    // Get updated shipping info
    const firstName = document.getElementById("first-name").value.trim();
    const lastName = document.getElementById("last-name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const address = document.getElementById("address").value.trim();
    const city = document.getElementById("city").value.trim();
    const governorate = document.getElementById("governorate").value;
    const postalCode = document.getElementById("postal-code").value.trim();
    
    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !address || !city || !governorate) {
        alert("يرجى ملء جميع حقول معلومات الشحن المطلوبة.");
        return;
    }
    
    // Get payment method
    const paymentMethod = document.querySelector("input[name=\"payment-method\"]:checked").value;
    
    // Validate credit card details if needed
    if (paymentMethod === "card") {
        const cardName = document.getElementById("card-name").value.trim();
        const cardNumber = document.getElementById("card-number").value.trim();
        const expiryDate = document.getElementById("expiry-date").value.trim();
        const cvv = document.getElementById("cvv").value.trim();
        
        if (!cardName || !cardNumber || !expiryDate || !cvv) {
            alert("يرجى ملء جميع تفاصيل بطاقة الائتمان.");
            return;
        }
    }
    
    // Get order notes
    const notes = document.getElementById("order-notes").value.trim();
    
    // Check terms agreement
    if (!document.getElementById("terms-agree").checked) {
        alert("يجب الموافقة على الشروط والأحكام.");
        return;
    }
    
    // Update the order
    orders[orderIndex] = {
        ...originalOrder,
        shippingInfo: {
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone,
            address: address,
            city: city,
            governorate: governorate,
            postalCode: postalCode
        },
        paymentMethod: paymentMethod,
        notes: notes,
        updatedAt: new Date().toISOString()
    };
    
    // Save updated orders back to localStorage
    localStorage.setItem("orders", JSON.stringify(orders));
    
    // Clear the edit order ID
    sessionStorage.removeItem("editOrderId");
    
    // Show success message
    alert("تم تحديث الطلب بنجاح!");
    
    // Redirect to profile page
    window.location.href = "profile.html";
}

function loadCheckoutSummary() {
    const orderSummaryContainer = document.querySelector(".order-summary .order-items");
    const subtotalElement = document.querySelector(".cart-subtotal");
    const shippingElement = document.querySelector(".cart-shipping");
    const totalElement = document.querySelector(".cart-total");

    if (!orderSummaryContainer || !subtotalElement || !shippingElement || !totalElement) return;

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const products = JSON.parse(localStorage.getItem("products")) || [];
    
    // Only check for empty cart in normal checkout mode, not when editing an order
    // Check if we're in edit mode by looking for editOrderId in sessionStorage
    const editOrderId = sessionStorage.getItem("editOrderId");
    if (cart.length === 0 && !editOrderId) {
        // Redirect back to cart or show message if cart is empty (only in normal checkout)
        alert("سلة التسوق فارغة!");
        window.location.href = "cart.html";
        return;
    }

    orderSummaryContainer.innerHTML = ""; // Clear previous items
    let subtotal = 0;

    cart.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (product) {
            const itemTotal = product.price * item.quantity;
            subtotal += itemTotal;
            
            const itemDiv = document.createElement("div");
            itemDiv.classList.add("order-item", "d-flex", "justify-content-between", "align-items-center", "mb-2");
            itemDiv.innerHTML = `
                <div>
                    <span class="fw-bold">${product.name}</span>
                    <div class="text-muted small">${item.quantity} × ${product.price.toFixed(2)} ج.م</div>
                </div>
                <span>${itemTotal.toFixed(2)} ج.م</span>
            `;
            orderSummaryContainer.appendChild(itemDiv);
        }
    });

    const shipping = 50; // Example fixed shipping
    const total = subtotal + shipping;

    subtotalElement.textContent = `${subtotal.toFixed(2)} ج.م`;
    shippingElement.textContent = `${shipping.toFixed(2)} ج.م`;
    totalElement.textContent = `${total.toFixed(2)} ج.م`;
}

function handlePlaceOrder() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
        alert("حدث خطأ: المستخدم غير مسجل الدخول.");
        window.location.href = "login.html";
        return;
    }

    // Check if we're in edit mode - we shouldn't be checking cart in edit mode
    const editOrderId = sessionStorage.getItem("editOrderId");
    if (editOrderId) {
        console.warn("handlePlaceOrder called in edit mode - this should not happen");
        return;
    }

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) {
        alert("سلة التسوق فارغة.");
        return;
    }

    const products = JSON.parse(localStorage.getItem("products")) || [];
    
    // --- Gather Order Items & Calculate Totals ---
    let orderItems = [];
    let subtotal = 0;
    cart.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (product) {
            subtotal += product.price * item.quantity;
            orderItems.push({
                productId: product.id,
                name: product.name,
                price: product.price,
                quantity: item.quantity
            });
        }
    });

    const shipping = 50; // Example fixed shipping
    const total = subtotal + shipping;

    // --- Gather Shipping Info ---
    const firstName = document.getElementById("first-name").value.trim();
    const lastName = document.getElementById("last-name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const address = document.getElementById("address").value.trim();
    const city = document.getElementById("city").value.trim();
    const governorate = document.getElementById("governorate").value;
    const postalCode = document.getElementById("postal-code").value.trim();

    if (!firstName || !lastName || !email || !phone || !address || !city || !governorate) {
        alert("يرجى ملء جميع حقول معلومات الشحن المطلوبة.");
        return;
    }

    // --- Gather Payment Info ---
    const paymentMethod = document.querySelector("input[name=\"payment-method\"]:checked").value;
    // Add validation for credit card details if paymentMethod is 'card'
    if (paymentMethod === "card") {
        const cardName = document.getElementById("card-name").value.trim();
        const cardNumber = document.getElementById("card-number").value.trim();
        const expiryDate = document.getElementById("expiry-date").value.trim();
        const cvv = document.getElementById("cvv").value.trim();
        if (!cardName || !cardNumber || !expiryDate || !cvv) {
            alert("يرجى ملء جميع تفاصيل بطاقة الائتمان.");
            return;
        }
        // Basic validation (more robust validation needed for production)
        if (!/^[\d\s]{13,19}$/.test(cardNumber) || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate) || !/^\d{3,4}$/.test(cvv)) {
             alert("يرجى إدخال تفاصيل بطاقة ائتمان صالحة.");
             return;
        }
    }

    // --- Gather Order Notes ---
    const notes = document.getElementById("order-notes").value.trim();

    // --- Check Terms Agreement ---
    if (!document.getElementById("terms-agree").checked) {
        alert("يجب الموافقة على الشروط والأحكام.");
        return;
    }

    // --- Create Order Object ---
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    const newOrderId = `SR-${Date.now()}-${Math.floor(Math.random() * 1000)}`; // More unique ID

    const newOrder = {
        id: newOrderId,
        userId: currentUser.id,
        date: new Date().toISOString(),
        items: orderItems,
        subtotal: subtotal,
        shipping: shipping,
        total: total,
        shippingInfo: {
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone,
            address: address,
            city: city,
            governorate: governorate,
            postalCode: postalCode
        },
        paymentMethod: paymentMethod,
        notes: notes,
        status: "pending" // Initial status
    };

    // --- Save Order ---
    orders.push(newOrder);
    localStorage.setItem("orders", JSON.stringify(orders));

    // --- Clear Cart ---
    localStorage.setItem("cart", JSON.stringify([]));

    // --- Save the latest order ID to localStorage for profile page ---
    localStorage.setItem("latestOrderId", newOrderId);
    
    // --- Redirect to Profile Page ---
    window.location.href = "profile.html";
}
