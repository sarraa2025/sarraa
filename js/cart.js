// cart.js - Shopping cart and order management functionality

document.addEventListener("DOMContentLoaded", function() {
    // Update cart count initially
    updateCartCount();

    // Load cart items on cart page
    const cartItemsContainer = document.getElementById("cartItems");
    if (cartItemsContainer) {
        loadCartItems();
    }

    // Load order summary and handle checkout form on checkout page
    const checkoutForm = document.getElementById("checkout-form");
    if (checkoutForm) {
        loadCheckoutSummary();
        checkoutForm.addEventListener("submit", handlePlaceOrder);
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
        // Pre-fill user info if logged in
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (currentUser) {
            document.getElementById("first-name").value = currentUser.firstName || "";
            document.getElementById("last-name").value = currentUser.lastName || "";
            document.getElementById("email").value = currentUser.email || "";
            document.getElementById("phone").value = currentUser.phone || "";
        }
    }

    // Listen for global settings updates to refresh summaries
    document.addEventListener('sarraaSettingsUpdated', function(event) {
        console.log('Global settings updated, reloading relevant summary...');
        if (document.getElementById("cartItems")) {
            loadCartItems(); // Reload cart summary
        }
        if (document.getElementById("checkout-form")) {
            loadCheckoutSummary(); // Reload checkout summary
        }
    });
});

// Helper to get currency symbol (duplicated from global-settings.js for robustness)
function getCurrencySymbol(currencyCode) {
    switch (currencyCode) {
        case 'EGP': return 'ج.م';
        case 'USD': return '$';
        case 'SAR': return 'ر.س';
        case 'AED': return 'د.إ';
        default: return currencyCode; // Fallback to code if unknown
    }
}

// Helper function to get current shipping settings
function getShippingSettings() {
    const settings = JSON.parse(localStorage.getItem('shippingSettings')) || {};
    return {
        cost: settings.cost !== undefined ? parseFloat(settings.cost) : 50,
        freeThreshold: settings.freeThreshold !== undefined ? parseFloat(settings.freeThreshold) : 500,
        enableFree: settings.enableFree !== undefined ? settings.enableFree : true,
    };
}

// Helper function to calculate shipping cost
function calculateShippingCost(subtotal) {
    if (subtotal <= 0) return 0; // No shipping cost for empty cart

    const settings = getShippingSettings();
    if (settings.enableFree && subtotal >= settings.freeThreshold) {
        return 0; // Free shipping threshold met
    }
    return settings.cost; // Default shipping cost
}

// Add to cart function
function addToCart(productId, quantity = 1) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItemIndex = cart.findIndex(item => item.productId === productId);

    if (existingItemIndex !== -1) {
        cart[existingItemIndex].quantity += quantity;
        if (cart[existingItemIndex].quantity > 10) {
            cart[existingItemIndex].quantity = 10;
            alert("الحد الأقصى للكمية هو 10.");
        }
    } else {
        cart.push({ productId: productId, quantity: quantity });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    alert("تمت إضافة المنتج إلى سلة التسوق بنجاح!");
}
window.addToCart = addToCart;

// Update cart count in header
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelectorAll(".cart-count").forEach(el => {
        el.textContent = cartCount;
    });
}

// Load cart items on cart.html
function loadCartItems() {
    const cartItemsContainer = document.getElementById("cartItems");
    const cartSummaryContainer = document.getElementById("cartSummary");
    const emptyCartMessage = document.querySelector(".empty-cart");
    const cartItemsTable = document.querySelector(".cart-items-table");

    if (!cartItemsContainer || !cartSummaryContainer) return;

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const products = JSON.parse(localStorage.getItem("products")) || [];
    const storeSettings = JSON.parse(localStorage.getItem('storeSettings')) || {};
    const currencySymbol = getCurrencySymbol(storeSettings.currency || 'EGP');

    if (cart.length === 0) {
        if (emptyCartMessage) emptyCartMessage.classList.remove("d-none");
        if (cartItemsTable) cartItemsTable.classList.add("d-none");
        cartSummaryContainer.innerHTML = `
            <div class="card-body">
                <h4 class="mb-4">ملخص الطلب</h4>
                <p class="text-center text-muted">لا توجد منتجات في سلة التسوق</p>
                <div class="text-center mt-3">
                    <a href="products.html" class="btn btn-primary">متابعة التسوق</a>
                </div>
            </div>
        `;
        return;
    }

    if (emptyCartMessage) emptyCartMessage.classList.add("d-none");
    if (cartItemsTable) cartItemsTable.classList.remove("d-none");

    let cartItemsData = [];
    let subtotal = 0;

    cart.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (product) {
            const itemTotal = product.price * item.quantity;
            subtotal += itemTotal;
            cartItemsData.push({
                id: product.id,
                name: product.name,
                brand: product.brand || "غير محدد",
                price: product.price,
                quantity: item.quantity,
                image: product.image || "images/product-placeholder.jpg",
                total: itemTotal
            });
        }
    });

    cartItemsContainer.innerHTML = "";
    cartItemsData.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>
                <div class="d-flex align-items-center">
                    <img src="${item.image}" alt="${item.name}" class="img-fluid rounded me-3" style="width: 60px; height: 60px; object-fit: cover;">
                    <div>
                        <h6 class="mb-0">${item.name}</h6>
                        <small class="text-muted">${item.brand}</small>
                    </div>
                </div>
            </td>
            <td>${item.price.toFixed(2)} ${currencySymbol}</td>
            <td>
                <div class="input-group input-group-sm" style="width: 120px;">
                    <button class="btn btn-outline-secondary decrease-quantity" type="button" data-id="${item.id}">-</button>
                    <input type="number" class="form-control text-center cart-quantity-input" value="${item.quantity}" min="1" max="10" data-id="${item.id}" aria-label="Quantity">
                    <button class="btn btn-outline-secondary increase-quantity" type="button" data-id="${item.id}">+</button>
                </div>
            </td>
            <td class="fw-bold">${item.total.toFixed(2)} ${currencySymbol}</td>
            <td>
                <button class="btn btn-sm btn-outline-danger remove-cart-item" data-id="${item.id}" title="إزالة">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        cartItemsContainer.appendChild(row);
    });

    attachCartActionListeners();

    const shipping = calculateShippingCost(subtotal);
    const discount = 0; // Placeholder for discount logic
    const total = subtotal + shipping - discount;

    cartSummaryContainer.innerHTML = `
        <div class="card-body">
            <h4 class="mb-4">ملخص الطلب</h4>
            <div class="d-flex justify-content-between mb-2">
                <span>إجمالي المنتجات</span>
                <span class="fw-bold">${subtotal.toFixed(2)} ${currencySymbol}</span>
            </div>
            <div class="d-flex justify-content-between mb-2">
                <span>الشحن</span>
                <span class="fw-bold">${shipping > 0 ? shipping.toFixed(2) + ' ' + currencySymbol : 'مجاني'}</span>
            </div>
            ${discount > 0 ? `
            <div class="d-flex justify-content-between mb-2 text-success">
                <span>الخصم</span>
                <span class="fw-bold">-${discount.toFixed(2)} ${currencySymbol}</span>
            </div>` : ""}
            <hr>
            <div class="d-flex justify-content-between fw-bold fs-5 mb-3">
                <span>الإجمالي</span>
                <span>${total.toFixed(2)} ${currencySymbol}</span>
            </div>
            <div class="mb-4">
                <label for="coupon" class="form-label">كود الخصم</label>
                <div class="input-group mb-3">
                    <input type="text" class="form-control" id="coupon" placeholder="أدخل كود الخصم">
                    <button class="btn btn-outline-primary" type="button" id="applyCoupon">تطبيق</button>
                </div>
            </div>
            <div class="d-grid gap-2">
                <button id="checkoutBtn" class="btn btn-primary btn-lg">إتمام الشراء</button>
                <a href="products.html" class="btn btn-outline-secondary">متابعة التسوق</a>
            </div>
        </div>
    `;

    const checkoutBtn = document.getElementById("checkoutBtn");
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", proceedToCheckout);
    }
    const applyCouponBtn = document.getElementById("applyCoupon");
    if (applyCouponBtn) {
        applyCouponBtn.addEventListener("click", applyCoupon);
    }
}

// Apply coupon code (placeholder)
function applyCoupon() {
    alert("وظيفة كود الخصم قيد الإنشاء.");
}

// Attach listeners for cart actions
function attachCartActionListeners() {
    document.querySelectorAll(".decrease-quantity").forEach(button => {
        button.addEventListener("click", function() {
            updateCartItemQuantity(parseInt(this.getAttribute("data-id")), -1);
        });
    });
    document.querySelectorAll(".increase-quantity").forEach(button => {
        button.addEventListener("click", function() {
            updateCartItemQuantity(parseInt(this.getAttribute("data-id")), 1);
        });
    });
    document.querySelectorAll(".cart-quantity-input").forEach(input => {
        input.addEventListener("change", function() {
            let quantity = parseInt(this.value);
            if (isNaN(quantity) || quantity < 1) quantity = 1;
            updateCartItemQuantity(parseInt(this.getAttribute("data-id")), 0, quantity);
        });
    });
    document.querySelectorAll(".remove-cart-item").forEach(button => {
        button.addEventListener("click", function() {
            removeCartItem(parseInt(this.getAttribute("data-id")));
        });
    });
}

// Update cart item quantity
function updateCartItemQuantity(productId, change, absoluteQuantity) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const itemIndex = cart.findIndex(item => item.productId === productId);

    if (itemIndex !== -1) {
        if (absoluteQuantity !== undefined) {
            cart[itemIndex].quantity = Math.max(1, absoluteQuantity);
        } else {
            cart[itemIndex].quantity += change;
        }

        if (cart[itemIndex].quantity < 1) {
            cart.splice(itemIndex, 1);
        } else if (cart[itemIndex].quantity > 10) {
            cart[itemIndex].quantity = 10;
            alert("الحد الأقصى للكمية هو 10.");
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        loadCartItems();
        updateCartCount();
    }
}

// Remove cart item
function removeCartItem(productId) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const updatedCart = cart.filter(item => item.productId !== productId);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    loadCartItems();
    updateCartCount();
}

// Proceed to checkout page
function proceedToCheckout() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
        alert("سلة التسوق فارغة. لا يمكنك المتابعة إلى الدفع.");
        return;
    }
    if (!currentUser) {
        alert("يرجى تسجيل الدخول أولاً لإتمام الطلب.");
        sessionStorage.setItem("redirectAfterLogin", "checkout.html");
        window.location.href = "login.html";
        return;
    }
    window.location.href = "checkout.html";
}

// Load order summary on checkout.html
function loadCheckoutSummary() {
    const orderSummaryContainer = document.querySelector(".order-summary .order-items");
    const subtotalElement = document.querySelector(".cart-subtotal");
    const shippingElement = document.querySelector(".cart-shipping");
    const totalElement = document.querySelector(".cart-total");

    if (!orderSummaryContainer || !subtotalElement || !shippingElement || !totalElement) return;

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const products = JSON.parse(localStorage.getItem("products")) || [];
    const storeSettings = JSON.parse(localStorage.getItem('storeSettings')) || {};
    const currencySymbol = getCurrencySymbol(storeSettings.currency || 'EGP');

    if (cart.length === 0) {
        alert("سلة التسوق فارغة!");
        window.location.href = "cart.html";
        return;
    }

    orderSummaryContainer.innerHTML = "";
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
                    <div class="text-muted small">${item.quantity} × ${product.price.toFixed(2)} ${currencySymbol}</div>
                </div>
                <span>${itemTotal.toFixed(2)} ${currencySymbol}</span>
            `;
            orderSummaryContainer.appendChild(itemDiv);
        }
    });

    const shipping = calculateShippingCost(subtotal);
    const total = subtotal + shipping;

    subtotalElement.textContent = `${subtotal.toFixed(2)} ${currencySymbol}`;
    shippingElement.textContent = `${shipping > 0 ? shipping.toFixed(2) + ' ' + currencySymbol : 'مجاني'}`;
    totalElement.textContent = `${total.toFixed(2)} ${currencySymbol}`;
}

// Handle place order form submission
function handlePlaceOrder(event) {
    event.preventDefault();

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
        alert("حدث خطأ: المستخدم غير مسجل الدخول.");
        window.location.href = "login.html";
        return;
    }

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) {
        alert("سلة التسوق فارغة.");
        return;
    }

    const products = JSON.parse(localStorage.getItem("products")) || [];
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

    const finalShippingCost = calculateShippingCost(subtotal);
    const finalTotal = subtotal + finalShippingCost;

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

    const paymentMethod = document.querySelector("input[name=\"payment-method\"]:checked").value;
    if (paymentMethod === "card") {
        const cardName = document.getElementById("card-name").value.trim();
        const cardNumber = document.getElementById("card-number").value.trim();
        const expiryDate = document.getElementById("expiry-date").value.trim();
        const cvv = document.getElementById("cvv").value.trim();
        if (!cardName || !cardNumber || !expiryDate || !cvv) {
            alert("يرجى ملء جميع تفاصيل بطاقة الائتمان.");
            return;
        }
        if (!/^[\d\s]{13,19}$/.test(cardNumber) || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate) || !/^\d{3,4}$/.test(cvv)) {
             alert("يرجى إدخال تفاصيل بطاقة ائتمان صالحة.");
             return;
        }
    }

    const notes = document.getElementById("order-notes").value.trim();

    if (!document.getElementById("terms-agree").checked) {
        alert("يجب الموافقة على الشروط والأحكام.");
        return;
    }

    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    const newOrderId = `SR-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const newOrder = {
        id: newOrderId,
        userId: currentUser.id,
        date: new Date().toISOString(),
        items: orderItems,
        subtotal: subtotal,
        shipping: finalShippingCost,
        total: finalTotal,
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
        status: "pending"
    };

    orders.push(newOrder);
    localStorage.setItem("orders", JSON.stringify(orders));
    localStorage.setItem("cart", JSON.stringify([]));
    localStorage.setItem("latestOrderId", newOrderId);
    window.location.href = "profile.html";
}

