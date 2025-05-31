document.addEventListener('DOMContentLoaded', function() {
    // Load existing settings and populate forms
    loadSettings();

    // Add event listeners to save buttons
    const storeSettingsForm = document.getElementById('store-settings-form');
    if (storeSettingsForm) {
        storeSettingsForm.addEventListener('submit', saveStoreSettings);
    }

    const shippingSettingsForm = document.getElementById('shipping-settings-form');
    if (shippingSettingsForm) {
        shippingSettingsForm.addEventListener('submit', saveShippingSettings);
    }

    const paymentSettingsForm = document.getElementById('payment-settings-form');
    if (paymentSettingsForm) {
        paymentSettingsForm.addEventListener('submit', savePaymentSettings);
    }

    const socialSettingsForm = document.getElementById('social-settings-form');
    if (socialSettingsForm) {
        socialSettingsForm.addEventListener('submit', saveSocialSettings);
    }

    // Toggle payment gateway settings visibility based on checkbox
    const enableCardPaymentCheckbox = document.getElementById('enable-card-payment');
    const cardPaymentSettingsDiv = document.querySelector('.card-payment-settings');
    if (enableCardPaymentCheckbox && cardPaymentSettingsDiv) {
        const togglePaymentSettings = () => {
            cardPaymentSettingsDiv.style.display = enableCardPaymentCheckbox.checked ? 'block' : 'none';
        };
        enableCardPaymentCheckbox.addEventListener('change', togglePaymentSettings);
        // Initial check
        togglePaymentSettings(); 
    }
});

function loadSettings() {
    // Load Store Settings
    const storeSettings = JSON.parse(localStorage.getItem('storeSettings')) || {};
    document.getElementById('store-name').value = storeSettings.name || 'سرَّاء للتجميل والعناية';
    document.getElementById('store-email').value = storeSettings.email || 'info@sarraa.com';
    document.getElementById('store-phone').value = storeSettings.phone || '+20 123 456 7890';
    document.getElementById('store-currency').value = storeSettings.currency || 'EGP';
    document.getElementById('store-address').value = storeSettings.address || 'القاهرة، مصر';
    document.getElementById('store-description').value = storeSettings.description || 'منصة متخصصة في بيع منتجات التجميل والعناية بالبشرة والشعر من أفضل الماركات المحلية والعالمية.';

    // Load Shipping Settings
    const shippingSettings = JSON.parse(localStorage.getItem('shippingSettings')) || {};
    document.getElementById('shipping-cost').value = shippingSettings.cost !== undefined ? shippingSettings.cost : 50;
    document.getElementById('free-shipping-threshold').value = shippingSettings.freeThreshold !== undefined ? shippingSettings.freeThreshold : 500;
    document.getElementById('enable-free-shipping').checked = shippingSettings.enableFree !== undefined ? shippingSettings.enableFree : true;

    // Load Payment Settings
    const paymentSettings = JSON.parse(localStorage.getItem('paymentSettings')) || {};
    document.getElementById('enable-cod').checked = paymentSettings.enableCod !== undefined ? paymentSettings.enableCod : true;
    document.getElementById('enable-card-payment').checked = paymentSettings.enableCard !== undefined ? paymentSettings.enableCard : true;
    document.getElementById('payment-api-key').value = paymentSettings.apiKey || 'sk_test_example_key';
    document.getElementById('payment-secret-key').value = paymentSettings.secretKey || '••••••••••••••••'; // Keep placeholder for security
    document.getElementById('payment-test-mode').checked = paymentSettings.testMode !== undefined ? paymentSettings.testMode : true;

    // Load Social Settings
    const socialSettings = JSON.parse(localStorage.getItem('socialSettings')) || {};
    document.getElementById('facebook-url').value = socialSettings.facebook || 'https://facebook.com/sarraa';
    document.getElementById('instagram-url').value = socialSettings.instagram || 'https://instagram.com/sarraa';
    document.getElementById('twitter-url').value = socialSettings.twitter || 'https://twitter.com/sarraa';
    document.getElementById('whatsapp-number').value = socialSettings.whatsapp || '+201234567890';

    // Trigger change event for card payment visibility after loading
    const enableCardPaymentCheckbox = document.getElementById('enable-card-payment');
    if (enableCardPaymentCheckbox) {
        enableCardPaymentCheckbox.dispatchEvent(new Event('change'));
    }
}

function saveStoreSettings(event) {
    event.preventDefault();
    const settings = {
        name: document.getElementById('store-name').value,
        email: document.getElementById('store-email').value,
        phone: document.getElementById('store-phone').value,
        currency: document.getElementById('store-currency').value,
        address: document.getElementById('store-address').value,
        description: document.getElementById('store-description').value,
    };
    localStorage.setItem('storeSettings', JSON.stringify(settings));
    alert('تم حفظ إعدادات المتجر بنجاح!');
}

function saveShippingSettings(event) {
    event.preventDefault();
    const settings = {
        cost: parseFloat(document.getElementById('shipping-cost').value),
        freeThreshold: parseFloat(document.getElementById('free-shipping-threshold').value),
        enableFree: document.getElementById('enable-free-shipping').checked,
    };
    localStorage.setItem('shippingSettings', JSON.stringify(settings));
    alert('تم حفظ إعدادات الشحن بنجاح!');
}

function savePaymentSettings(event) {
    event.preventDefault();
    const settings = {
        enableCod: document.getElementById('enable-cod').checked,
        enableCard: document.getElementById('enable-card-payment').checked,
        apiKey: document.getElementById('payment-api-key').value,
        // Avoid saving the password field directly if it's just a placeholder
        secretKey: document.getElementById('payment-secret-key').value !== '••••••••••••••••' ? document.getElementById('payment-secret-key').value : (JSON.parse(localStorage.getItem('paymentSettings')) || {}).secretKey,
        testMode: document.getElementById('payment-test-mode').checked,
    };
    localStorage.setItem('paymentSettings', JSON.stringify(settings));
    alert('تم حفظ إعدادات الدفع بنجاح!');
}

function saveSocialSettings(event) {
    event.preventDefault();
    const settings = {
        facebook: document.getElementById('facebook-url').value,
        instagram: document.getElementById('instagram-url').value,
        twitter: document.getElementById('twitter-url').value,
        whatsapp: document.getElementById('whatsapp-number').value,
    };
    localStorage.setItem('socialSettings', JSON.stringify(settings));
    alert('تم حفظ إعدادات التواصل الاجتماعي بنجاح!');
}

