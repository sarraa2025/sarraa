// js/categories.js - Dynamically load categories and featured brands for the public categories page

document.addEventListener("DOMContentLoaded", function() {
    initializeDataIfNeeded(); // Ensure sample data exists if needed
    loadPublicCategories();
    loadFeaturedBrands(); // Load featured brands on initial load

    // Listen for storage events to update featured brands in real-time
    window.addEventListener('storage', function(e) {
        if (e.key === 'products' || e.key === null) {
            console.log(`Storage updated for products, reloading featured brands...`);
            loadFeaturedBrands();
        }
        // Also reload categories if they change (optional, but good practice)
        if (e.key === 'categories' || e.key === null) {
             console.log(`Storage updated for categories, reloading public categories...`);
             loadPublicCategories();
        }
    });
});

// Initialize sample data if localStorage is empty (Copied from dashboard.js for consistency)
function initializeDataIfNeeded() {
    // Initialize products if not already in localStorage (Needed for featured brands)
    // Use the initial products from homepage.js for consistency
    if (!localStorage.getItem("products")) {
        const initialProducts = [
            {
                id: 1,
                name: "كريم مرطب للبشرة الجافة",
                brand: "سرَّاء",
                category: "cat1",
                price: 120,
                oldPrice: 150,
                image: "images/products/brands/sarraa_moisturizer.jpg",
                description: "كريم مرطب غني بالمكونات الطبيعية المغذية للبشرة الجافة. يعمل على ترطيب البشرة بعمق وحمايتها من الجفاف طوال اليوم. مناسب للاستخدام اليومي ويترك البشرة ناعمة ومشرقة.",
                features: [
                    "ترطيب عميق يدوم طوال اليوم",
                    "مكونات طبيعية 100%",
                    "خالي من البارابين والكحول",
                    "مناسب لجميع أنواع البشرة",
                    "تركيبة غير دهنية"
                ],
                usage: "يوضع كمية مناسبة من الكريم على البشرة النظيفة ويدلك بحركات دائرية حتى يتم امتصاصه بالكامل. يستخدم صباحاً ومساءً للحصول على أفضل النتائج.",
                weight: "50 مل",
                ingredients: "ماء، زبدة الشيا، زيت جوز الهند، جلسرين، فيتامين E، زيت اللوز، ألوفيرا، زيت الأرغان",
                featured: false, // Default to false
                stock: 10, // Example stock
                inStock: true,
                reviews: [
                    { user: "سارة أحمد", rating: 5, comment: "منتج رائع، نتائج ملحوظة من أول استخدام" },
                    { user: "هدى محمد", rating: 4, comment: "كريم ممتاز للبشرة الجافة، أنصح به بشدة" }
                ]
            },
            {
                id: 2,
                name: "سيروم فيتامين سي للوجه",
                brand: "لوريال",
                category: "cat1",
                price: 180,
                oldPrice: 220,
                image: "images/products/brands/loreal_serum.jpg",
                description: "سيروم مركز بفيتامين سي النقي لتفتيح البشرة وتوحيد لونها وإشراقها. يساعد على تقليل التصبغات وآثار حب الشباب.",
                features: [
                    "تركيز عالي من فيتامين سي النقي",
                    "يفتح البشرة ويوحد لونها",
                    "يقلل التصبغات وآثار حب الشباب",
                    "يحمي البشرة من الجذور الحرة",
                    "نتائج ملحوظة خلال أسبوعين"
                ],
                usage: "يستخدم صباحاً على البشرة النظيفة قبل المرطب وواقي الشمس. ضعي 2-3 قطرات على الوجه والرقبة ودلكي برفق حتى الامتصاص.",
                weight: "30 مل",
                ingredients: "ماء، فيتامين سي بتركيز 10%، حمض الهيالورونيك، جليسرين، بروبيلين جلايكول",
                featured: false, // Default to false
                stock: 5,
                inStock: true,
                reviews: []
            },
            {
                id: 3,
                name: "شامبو للشعر الجاف",
                brand: "نيفيا",
                category: "cat3",
                price: 90,
                oldPrice: 110,
                image: "images/products/brands/nivea_shampoo.jpg",
                description: "شامبو مغذي للشعر الجاف والتالف، يعمل على ترطيب الشعر وإصلاح التلف وإعادة الحيوية واللمعان.",
                features: [
                    "يغذي الشعر الجاف",
                    "يصلح الشعر التالف",
                    "يمنح الشعر النعومة واللمعان",
                    "يحمي من التقصف",
                    "مناسب للاستخدام اليومي"
                ],
                usage: "ضعي كمية مناسبة على الشعر المبلل ودلكي فروة الرأس برفق، ثم اشطفي جيداً بالماء الدافئ.",
                weight: "400 مل",
                ingredients: "ماء، صوديوم لوريث سلفات، كوكاميدوبروبيل بيتين، زيت الأرغان، زيت جوز الهند، بروتين القمح",
                featured: false, // Default to false
                stock: 15,
                inStock: true,
                reviews: [
                    { user: "محمد علي", rating: 5, comment: "شامبو ممتاز للشعر الجاف" }
                ]
            },
            {
                id: 4,
                name: "أحمر شفاه كريمي طويل الأمد",
                brand: "إيفا",
                category: "cat2",
                price: 75,
                oldPrice: 95,
                image: "images/products/brands/eva_lipstick.jpg",
                description: "أحمر شفاه كريمي بتركيبة غنية ومرطبة تدوم طويلاً. يمنح الشفاه لوناً غنياً وتغطية كاملة مع ترطيب عميق.",
                features: [
                    "تركيبة كريمية مرطبة",
                    "يدوم حتى 8 ساعات",
                    "ألوان غنية وتغطية كاملة",
                    "غني بالفيتامينات المرطبة",
                    "لا يجفف الشفاه"
                ],
                usage: "ضعي طبقة واحدة على الشفاه النظيفة للحصول على لون خفيف، أو طبقتين للحصول على لون أكثر كثافة.",
                weight: "3.5 جرام",
                ingredients: "زيت الجوجوبا، شمع العسل، زبدة الشيا، فيتامين E، بيجمنت",
                featured: false, // Default to false
                stock: 8,
                inStock: true,
                reviews: []
            },
            {
                id: 5,
                name: "ماسكارا لتطويل وتكثيف الرموش",
                brand: "مايبيلين",
                category: "cat2",
                price: 110,
                oldPrice: 140,
                image: "images/products/brands/maybelline_mascara.jpg",
                description: "ماسكارا بتركيبة فريدة تعمل على تطويل وتكثيف الرموش بشكل مذهل. تمنح الرموش كثافة وطولاً ملحوظاً من أول استخدام.",
                features: [
                    "تطويل وتكثيف الرموش",
                    "لا تتكتل أو تترك بقعاً",
                    "سهلة الإزالة",
                    "مناسبة للعيون الحساسة",
                    "تدوم طوال اليوم"
                ],
                usage: "ضعي الماسكارا من جذور الرموش إلى الأطراف بحركة متعرجة. يمكن وضع طبقة ثانية بعد جفاف الطبقة الأولى للحصول على كثافة أكبر.",
                weight: "9 مل",
                ingredients: "ماء، شمع النحل، شمع الكارنوبا، بوليمرات، أكاسيد حديد",
                featured: false, // Default to false
                stock: 12,
                inStock: true,
                reviews: []
            }
        ];
        localStorage.setItem("products", JSON.stringify(initialProducts));
        console.log("Initialized sample products for categories page.");
    }

    // Check if categories exist, if not, add sample data
    if (!localStorage.getItem("categories")) {
        const sampleCategories = [
            { id: "cat1", name: "العناية بالبشرة", description: "منتجات العناية بالوجه والجسم", image: "images/categories/skincare.jpg", featured: true },
            { id: "cat2", name: "المكياج", description: "منتجات المكياج والتجميل", image: "images/categories/makeup.jpg", featured: true },
            { id: "cat3", name: "العناية بالشعر", description: "شامبو وبلسم ومنتجات تصفيف الشعر", image: "images/categories/haircare.jpg", featured: false }
        ];
        localStorage.setItem("categories", JSON.stringify(sampleCategories));
        console.log("Initialized sample categories for public page.");
    }
}


// Load categories onto the public categories page
function loadPublicCategories() {
    const categoriesContainer = document.getElementById("public-categories-list");
    if (!categoriesContainer) {
        console.error("Category container #public-categories-list not found.");
        return;
    }

    const categories = JSON.parse(localStorage.getItem("categories")) || [];

    categoriesContainer.innerHTML = ''; // Clear any static content

    if (categories.length === 0) {
        categoriesContainer.innerHTML =
            `<div class="col-12"><p class="text-center">لا توجد فئات لعرضها حالياً.</p></div>`;
        return;
    }

    categories.forEach(category => {
        const categoryCol = document.createElement("div");
        categoryCol.className = "col-md-6 col-lg-4 mb-4"; // Added mb-4 for spacing

        const categoryCard = `
            <div class="card category-card h-100">
                <img src="${category.image || 'images/category-placeholder.jpg'}" class="card-img-top category-card-img" alt="${category.name}">
                <div class="card-body text-center d-flex flex-column">
                    <h3 class="card-title">${category.name}</h3>
                    <p class="card-text">${category.description}</p>
                    <a href="products.html?category=${encodeURIComponent(category.id)}" class="btn btn-primary mt-auto">تسوق الآن</a>
                </div>
            </div>
        `;

        categoryCol.innerHTML = categoryCard;
        categoriesContainer.appendChild(categoryCol);
    });
}

// Load featured brands dynamically
function loadFeaturedBrands() {
    const brandsContainer = document.getElementById("featured-brands-container");
    const brandsSection = brandsContainer ? brandsContainer.closest('section') : null; // Find the parent section

    if (!brandsContainer || !brandsSection) {
        console.error("Featured brands container (#featured-brands-container) or its parent section not found.");
        return;
    }

    const products = JSON.parse(localStorage.getItem("products")) || [];
    const featuredProducts = products.filter(product => product.featured);

    // Get unique brand names from featured products
    const uniqueBrands = [...new Set(featuredProducts.map(product => product.brand))];

    brandsContainer.innerHTML = ''; // Clear existing static brands

    if (uniqueBrands.length === 0) {
        // Hide the entire section if no featured brands
        brandsSection.style.display = 'none';
        console.log("No featured brands found. Hiding brands section.");
        return;
    }

    // Show the section if brands are found
    brandsSection.style.display = 'block';
    console.log(`Found ${uniqueBrands.length} unique featured brands.`);

    uniqueBrands.forEach(brandName => {
        const brandCol = document.createElement("div");
        // Use the same column classes as the static version
        brandCol.className = "col-6 col-md-4 col-lg-2 mb-4"; // Added mb-4

        brandCol.innerHTML = `
            <div class="card h-100 border-0 shadow-sm brand-card">
                <div class="card-body text-center d-flex align-items-center justify-content-center">
                    <h5 class="mb-0">${brandName}</h5>
                </div>
            </div>
        `;
        brandsContainer.appendChild(brandCol);
    });
}

