document.addEventListener("DOMContentLoaded", function() {
    updateCartCount(); // Update cart count on initial load
    loadGlobalSettings();
    // Listen for changes in localStorage from other tabs/windows
    window.addEventListener("storage", function(event) {
        if (event.key === "storeSettings" || event.key === "shippingSettings" || event.key === "paymentSettings" || event.key === "socialSettings") {
            console.log(`Detected change in ${event.key}. Reloading global settings.`);
            // Use a flag to prevent infinite loops if storage event triggers itself
            if (!window.PROCESSING_STORAGE_EVENT) {
                window.PROCESSING_STORAGE_EVENT = true;
                loadGlobalSettings();
                setTimeout(() => { window.PROCESSING_STORAGE_EVENT = false; }, 100); // Reset flag after a short delay
            }
        } else if (event.key === "cart") { // Add check for cart changes
            console.log("Detected change in cart. Updating cart count.");
            updateCartCount(); // Update cart count if cart changes in another tab
        }
    });

    // Ensure settings are applied even if DOMContentLoaded fired before script load
    if (document.readyState === "interactive" || document.readyState === "complete") {
        // Check if already loaded to avoid double execution in some edge cases
        if (!window.SARRAA_SETTINGS_LOADED) {
             loadGlobalSettings();
        }
    }
});

function loadGlobalSettings() {
    // Prevent double execution during initial load or rapid storage events
    if (window.SARRAA_SETTINGS_LOADED && !window.PROCESSING_STORAGE_EVENT) return;
    window.SARRAA_SETTINGS_LOADED = true;

    // --- Define Default Settings --- (User Specified)
    const defaultSocialSettings = {
        facebook: "https://facebook.com/sarraa",
        instagram: "https://instagram.com/sarraa",
        twitter: "https://twitter.com/sarraa",
        whatsapp: "+201124082101"
    };
    const defaultStoreSettings = {
        name: "سرَّاء للتجميل والعناية",
        description: "منصة متخصصة في بيع منتجات التجميل والعناية بالبشرة والشعر من أفضل الماركات المحلية والعالمية.",
        phone: "+20 123 456 7890",
        email: "info@sarraa.com",
        address: "القاهرة، مصر",
        currency: "EGP"
    };
    const defaultShippingSettings = {
        cost: 50,
        freeThreshold: 500,
        enableFree: true
    };

    // Load Store Settings (with defaults)
    const storedStoreSettings = JSON.parse(localStorage.getItem("storeSettings")) || {};
    const storeSettings = { ...defaultStoreSettings, ...storedStoreSettings };
    const storeName = storeSettings.name;
    const storeDescription = storeSettings.description;
    const storePhone = storeSettings.phone;
    const storeEmail = storeSettings.email;
    const storeAddress = storeSettings.address;
    const storeCurrencySymbol = getCurrencySymbol(storeSettings.currency);

    // Load Shipping Settings (with defaults)
    const storedShippingSettings = JSON.parse(localStorage.getItem("shippingSettings")) || {};
    const shippingSettings = { ...defaultShippingSettings, ...storedShippingSettings };
    const defaultShippingCost = shippingSettings.cost;
    const freeShippingThreshold = shippingSettings.freeThreshold;
    const enableFreeShipping = shippingSettings.enableFree;

    // Load Social Settings (with defaults)
    const storedSocialSettings = JSON.parse(localStorage.getItem("socialSettings")) || {};
    const socialSettings = { ...defaultSocialSettings, ...storedSocialSettings };
    const facebookUrl = socialSettings.facebook || "#"; // Fallback to # if explicitly empty
    const instagramUrl = socialSettings.instagram || "#";
    const twitterUrl = socialSettings.twitter || "#";
    const whatsappNumber = socialSettings.whatsapp || "";
    const whatsappUrl = whatsappNumber ? `https://wa.me/${whatsappNumber.replace(/\D/g,"")}` : "#";

    // --- Update DOM Elements ---

    // Update Header Elements (e.g., Logo Alt Text, Title)
    const logoImage = document.querySelector(".navbar-brand img.logo");
    if (logoImage) {
        logoImage.alt = storeName;
    }

    // Update Footer Elements
    const footerStoreName = document.querySelector("footer h5");
    if (footerStoreName && footerStoreName.closest("footer")) {
        footerStoreName.textContent = storeName;
    }

    const footerDescription = document.querySelector("footer p:first-of-type");
    if (footerDescription && footerDescription.closest("footer")) {
        footerDescription.textContent = storeDescription;
    }

    // Update Footer Contact Info
    updateFooterContact("fa-map-marker-alt", storeAddress);
    updateFooterContact("fa-phone", storePhone);
    updateFooterContact("fa-envelope", storeEmail);

    // --- Robustly Update ALL Social Media Icons (Facebook, Instagram, Twitter) ---
    const socialIconContainers = document.querySelectorAll(".social-icons");
    socialIconContainers.forEach(container => {
        const links = container.querySelectorAll("a");
        links.forEach(link => {
            const icon = link.querySelector("i.fab");
            if (icon) {
                let targetUrl = "#"; // Default URL

                if (icon.classList.contains("fa-facebook-f")) {
                    targetUrl = facebookUrl;
                } else if (icon.classList.contains("fa-instagram")) {
                    targetUrl = instagramUrl;
                } else if (icon.classList.contains("fa-twitter")) {
                    targetUrl = twitterUrl;
                } else if (icon.classList.contains("fa-whatsapp")) {
                    return; // Skip WhatsApp here, handled by updateAllWhatsappLinks
                }

                link.href = targetUrl;
                link.target = "_blank";
                link.rel = "noopener noreferrer";
                link.style.display = ""; // Ensure link is always visible
            }
        });
    });

    // Handle WhatsApp link separately (creation/update/visibility)
    updateAllWhatsappLinks(".social-icons", whatsappUrl);

    // Update Currency Symbols across the site
    document.querySelectorAll(".price-currency, .cart-currency, .shipping-currency").forEach(span => {
        span.textContent = storeCurrencySymbol;
    });
    const shippingCostCurrency = document.querySelector("#shipping-settings-form .input-group-text");
    if (shippingCostCurrency) shippingCostCurrency.textContent = storeCurrencySymbol;
    const freeShippingCurrency = document.querySelector("#shipping-settings-form .input-group-text:last-of-type");
    if (freeShippingCurrency) freeShippingCurrency.textContent = storeCurrencySymbol;

    // Update global settings object and dispatch event
    window.SARRAA_SETTINGS = {
        ...(window.SARRAA_SETTINGS || {}),
        shipping: {
            cost: defaultShippingCost,
            freeThreshold: freeShippingThreshold,
            enableFree: enableFreeShipping,
            currency: storeCurrencySymbol
        },
        store: {
            currency: storeCurrencySymbol
        }
    };
    document.dispatchEvent(new CustomEvent("sarraaSettingsUpdated", { detail: window.SARRAA_SETTINGS }));

    console.log("Global settings loaded with defaults and applied robustly (icons always visible).");
}

// Helper function to update footer contact info
function updateFooterContact(iconClass, text) {
    const iconElement = document.querySelector(`footer ul li i.${iconClass}`);
    if (iconElement && iconElement.parentElement) {
        let textNode = iconElement.nextSibling;
        while (textNode && textNode.nodeType !== Node.TEXT_NODE) {
            textNode = textNode.nextSibling;
        }
        if (textNode) {
            textNode.nodeValue = ` ${text}`;
        } else {
            iconElement.parentElement.appendChild(document.createTextNode(` ${text}`));
        }
    }
}

// Helper function specifically for ALL WhatsApp links update/creation/visibility
function updateAllWhatsappLinks(containerSelector, url) {
    const socialIconsContainers = document.querySelectorAll(containerSelector);
    if (!socialIconsContainers || socialIconsContainers.length === 0) return;

    socialIconsContainers.forEach(socialIconsContainer => {
        let whatsappLink = socialIconsContainer.querySelector("a > i.fa-whatsapp")?.parentElement;

        if (!whatsappLink) {
            whatsappLink = document.createElement("a");
            whatsappLink.innerHTML = ",<i class=\"fab fa-whatsapp\"></i>";
            const sibling = socialIconsContainer.querySelector("a");
            if (sibling) {
                whatsappLink.className = sibling.className;
            } else {
                whatsappLink.classList.add("social-link");
            }
            socialIconsContainer.appendChild(whatsappLink);
        }

        whatsappLink.href = url;
        whatsappLink.target = "_blank";
        whatsappLink.rel = "noopener noreferrer";
        whatsappLink.style.display = ""; // Ensure it's always visible
    });
}

// Helper to get currency symbol
function getCurrencySymbol(currencyCode) {
    switch (currencyCode) {
        case "EGP": return "ج.م";
        case "USD": return "$";
        case "SAR": return "ر.س";
        case "AED": return "د.إ";
        default: return currencyCode;
    }
}

