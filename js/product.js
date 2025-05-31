// product.js - Handles product display, filtering, pagination, and cart functionality

let currentPage = 1;
const productsPerPage = 10;

document.addEventListener("DOMContentLoaded", function() {
    // Initialize data if needed
    initializeData();

    // Populate filters first - ensures dropdowns are ready
    populateFilters(); // Call it here

    // Check for category query parameter and pre-select filter
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    const categoryFilterSelect = document.getElementById("categoryFilter");

    if (categoryParam && categoryFilterSelect) {
        // Check if the category ID from URL exists as an option
        const optionExists = Array.from(categoryFilterSelect.options).some(opt => opt.value === categoryParam);
        if (optionExists) {
            categoryFilterSelect.value = categoryParam;
            console.log(`Pre-selected category filter based on URL parameter: ${categoryParam}`);
        } else {
            console.warn(`Category ID '${categoryParam}' from URL not found in filter options.`);
        }
    }

    // Load products on products.html page
    const productsContainer = document.getElementById("productsContainer");
    if (productsContainer) {
        loadProducts(); // Initial load will now use the pre-selected filter if set
    }    // Load product details on product-detail.html page
    const productDetailContainer = document.getElementById("productDetailContainer");
    if (productDetailContainer) {
        loadProductDetail();
    }

    // Add event listeners for add to cart buttons
    document.addEventListener("click", function(e) {
        if (e.target.classList.contains("add-to-cart-btn") || e.target.closest(".add-to-cart-btn")) {
            const button = e.target.classList.contains("add-to-cart-btn") ? e.target : e.target.closest(".add-to-cart-btn");
            const productId = parseInt(button.getAttribute("data-id"));
            addToCart(productId, 1);
            e.preventDefault();
        }
    });

    // Add event listeners for filter and sort
    const filterForm = document.getElementById("filterForm");
    if (filterForm) {
        // Apply filters button
        const applyFiltersBtn = document.getElementById("applyFiltersBtn");
        if (applyFiltersBtn) {
            applyFiltersBtn.addEventListener("click", function() {
                currentPage = 1; // Reset to first page on filter change
                loadProducts();
            });
        }

        // Reset filters
        const resetFiltersBtn = document.getElementById("resetFiltersBtn");
        if (resetFiltersBtn) {
            resetFiltersBtn.addEventListener("click", function() {
                // Clear URL parameter when resetting filters? Optional, maybe not needed.
                // window.history.replaceState({}, document.title, window.location.pathname); // Removes query params

                document.getElementById("categoryFilter").value = "";
                document.getElementById("brandFilter").value = "";
                document.getElementById("minPriceFilter").value = "";
                document.getElementById("maxPriceFilter").value = "";
                document.getElementById("searchInput").value = ""; // Also reset search
                currentPage = 1; // Reset to first page
                loadProducts();
            });
        }
    }

    // Add event listener for search
    const searchForm = document.getElementById("searchForm");
    if (searchForm) {
        // Handle search button click explicitly as form submit might be prevented elsewhere
        const searchButton = searchForm.querySelector('button[type="submit"]');
        if(searchButton) {
            searchButton.addEventListener('click', function() {
                currentPage = 1; // Reset to first page on search
                loadProducts();
            });
        }
        // Also handle Enter key press in search input
        const searchInput = document.getElementById("searchInput");
        if(searchInput) {
            searchInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault(); // Prevent default form submission if any
                    currentPage = 1;
                    loadProducts();
                }
            });
        }
    }

    // Add event listener for sort dropdown (if exists)
    const sortBySelect = document.getElementById("sortBy");
    if (sortBySelect) {
        sortBySelect.addEventListener("change", function() {
            currentPage = 1; // Reset to first page on sort change
            loadProducts();
        });
    }

    // Listen for storage events to update in real-time when admin makes changes
    window.addEventListener('storage', function(e) {
        if (e.key === 'products' || e.key === 'categories' || e.key === null) {
            console.log(`Storage updated: ${e.key}`);
            
            // Check if we're on the products page
            const productsContainerCheck = document.getElementById("productsContainer");
            if (productsContainerCheck) {
                console.log("Products container found, reloading products...");
                populateFilters(); // Repopulate filters in case categories/brands changed
                loadProducts(); // Reload products, maintaining current page if possible
            }
            
            // Check if we're on the product detail page
            const productDetailContainerCheck = document.getElementById("product-detail-container");
            if (productDetailContainerCheck) {
                console.log("Product detail container found, reloading product details...");
                loadProductDetail();
            }
        }
    });
});

// Initialize both products and categories if missing
function initializeData() {
    // Initialize products if not already in localStorage
    if (!localStorage.getItem("products")) {
        // قائمة بأسماء الصور المفقودة التي تحتاج إلى استبدال
        const missingImages = [
            "images/products/brands/beautyblender.jpg",
            "images/products/brands/clinique_lipbalm.jpg",
            "images/products/brands/morphe_palette.jpg",
            "images/products/brands/lavender_shower.jpg",
            "images/products/brands/moroccanoil.jpg",
            "images/products/brands/olive_soap.jpg"
        ];
        
        // الصورة البديلة التي سيتم استخدامها
        const placeholderImage = "images/product-placeholder.jpg";
        
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
                    "خالي من البارابين والعطور الصناعية",
                    "مناسب لجميع أنواع البشرة الجافة",
                    "تركيبة غير دهنية سريعة الامتصاص"
                ],
                usage: "يوضع على البشرة النظيفة صباحاً ومساءً مع التدليك اللطيف حتى الامتصاص الكامل.",
                weight: "50 مل",
                ingredients: "ماء، جلسرين، زبدة الشيا، زيت جوز الهند، زيت اللوز الحلو، فيتامين E، ألوفيرا",
                featured: true,
                stock: 25,
                inStock: true,
                reviews: []
            },
            {
                id: 2,
                name: "سيروم فيتامين سي للوجه",
                brand: "لوريال",
                category: "cat1",
                price: 180,
                oldPrice: 220,
                image: "images/products/brands/loreal_serum.jpg",
                description: "سيروم مركز بفيتامين سي النقي لتفتيح البشرة وتوحيد لونها ومكافحة علامات التقدم في السن. يساعد على تقليل التصبغات وإشراق البشرة وتحسين مرونتها.",
                features: [
                    "تركيز عالي من فيتامين سي النقي",
                    "يفتح البشرة ويوحد لونها",
                    "يقلل من ظهور التجاعيد والخطوط الدقيقة",
                    "يحارب الجذور الحرة ويحمي البشرة من أضرار البيئة",
                    "نتائج ملحوظة خلال أسبوعين من الاستخدام المنتظم"
                ],
                usage: "يستخدم صباحاً على البشرة النظيفة قبل المرطب وواقي الشمس. ضعي 3-4 قطرات ووزعيها على الوجه والرقبة مع التدليك اللطيف.",
                weight: "30 مل",
                ingredients: "ماء، بروبيلين جلايكول، فيتامين سي (حمض الأسكوربيك)، حمض الهيالورونيك، جلسرين، فيتامين E",
                featured: true,
                stock: 15,
                inStock: true,
                reviews: []
            },
            {
                id: 3,
                name: "ماسكارا للرموش",
                brand: "ميبيلين",
                category: "cat2",
                price: 85,
                oldPrice: 100,
                image: "images/products/brands/maybelline_mascara.jpg",
                description: "ماسكارا لتطويل وتكثيف الرموش بتركيبة مقاومة للماء. تمنح الرموش طولاً وكثافة مذهلة مع فصل مثالي للرموش دون تكتل.",
                features: [
                    "تطويل وتكثيف الرموش",
                    "تركيبة مقاومة للماء والدموع",
                    "فرشاة مصممة لفصل الرموش ومنع التكتل",
                    "تدوم طوال اليوم دون تساقط",
                    "سهلة الإزالة بمزيل المكياج"
                ],
                usage: "ضعي الماسكارا من جذور الرموش إلى الأطراف بحركة متعرجة. يمكن وضع طبقة ثانية بعد جفاف الطبقة الأولى للحصول على مظهر أكثر كثافة.",
                weight: "10 مل",
                ingredients: "ماء، شمع العسل، شمع الكارنوبا، بوليمرات، أكاسيد حديدية",
                featured: false,
                stock: 30,
                inStock: true,
                reviews: []
            },
            {
                id: 4,
                name: "شامبو للشعر الجاف",
                brand: "نيفيا",
                category: "cat3",
                price: 90,
                oldPrice: 110,
                image: "images/products/brands/nivea_shampoo.jpg",
                description: "شامبو مغذي للشعر الجاف والتالف. يعمل على ترطيب الشعر وتغذيته بعمق واستعادة حيويته ولمعانه الطبيعي.",
                features: [
                    "ترطيب عميق للشعر الجاف",
                    "يغذي الشعر ويقويه من الجذور للأطراف",
                    "يمنع تقصف وتكسر الشعر",
                    "يمنح الشعر نعومة ولمعاناً",
                    "رائحة منعشة تدوم طويلاً"
                ],
                usage: "يوضع على الشعر المبلل ويدلك بلطف على فروة الرأس والشعر، ثم يشطف جيداً بالماء الدافئ.",
                weight: "400 مل",
                ingredients: "ماء، صوديوم لوريث سلفات، كوكاميدوبروبيل بيتاين، جلسرين، بروتين القمح، زيت الأرغان، بانثينول",
                featured: false,
                stock: 20,
                inStock: true,
                reviews: []
            },
            {
                id: 5,
                name: "أحمر شفاه كريمي طويل الأمد",
                brand: "إيفا",
                category: "cat2",
                price: 75,
                oldPrice: 95,
                image: "images/products/brands/eva_lipstick.jpg",
                description: "أحمر شفاه كريمي بتركيبة مرطبة وألوان نابضة بالحياة تدوم طويلاً. يمنح الشفاه لوناً غنياً مع ترطيب عميق دون جفاف أو تشقق.",
                features: [
                    "ألوان نابضة بالحياة تدوم طويلاً",
                    "تركيبة كريمية مرطبة",
                    "لا يسبب جفاف الشفاه",
                    "مقاوم للتلطخ والتحول",
                    "غني بالفيتامينات المغذية للشفاه"
                ],
                usage: "يطبق مباشرة على الشفاه. يمكن استخدام محدد الشفاه قبل التطبيق للحصول على مظهر أكثر دقة.",
                weight: "3.5 جرام",
                ingredients: "زيوت نباتية، شموع، بيجمنت، فيتامين E، زبدة الشيا",
                featured: true,
                stock: 35,
                inStock: true,
                reviews: []
            },
            {
                id: 6,
                name: "عطر شانيل نمبر 5",
                brand: "شانيل",
                category: "cat4",
                price: 850,
                oldPrice: 950,
                image: placeholderImage,
                description: "عطر أيقوني للنساء يجمع بين الأناقة والفخامة. رائحة زهرية ألدهيدية كلاسيكية تدوم طويلاً وتترك انطباعاً لا يُنسى.",
                features: [
                    "عطر كلاسيكي أيقوني",
                    "رائحة زهرية ألدهيدية فاخرة",
                    "يدوم طوال اليوم",
                    "مناسب للمناسبات الخاصة والاستخدام اليومي",
                    "تصميم زجاجة كلاسيكي أنيق"
                ],
                usage: "يرش على مناطق النبض: المعصمين، خلف الأذنين، وأسفل الرقبة.",
                weight: "100 مل",
                ingredients: "كحول، ماء، عطور، ألدهيدات، زهور الياسمين، الورد، الفانيليا، خشب الصندل",
                featured: true,
                stock: 10,
                inStock: true,
                reviews: []
            },
            {
                id: 7,
                name: "كريم أساس ديور فوريفر",
                brand: "ديور",
                category: "cat2",
                price: 320,
                oldPrice: 380,
                image: placeholderImage,
                description: "كريم أساس سائل بتغطية متوسطة إلى كاملة ونهاية مطفية. يوحد لون البشرة ويخفي العيوب مع تركيبة خفيفة لا تسد المسام.",
                features: [
                    "تغطية متوسطة إلى كاملة",
                    "نهاية مطفية طبيعية",
                    "يدوم حتى 24 ساعة",
                    "مقاوم للماء والتعرق",
                    "يحتوي على عامل حماية من الشمس SPF 35"
                ],
                usage: "يوزع كمية صغيرة على الوجه والرقبة باستخدام فرشاة أو إسفنجة مكياج. يمكن بناء التغطية حسب الحاجة.",
                weight: "30 مل",
                ingredients: "ماء، سيكلوبنتاسيلوكسان، بوتيلين جلايكول، أكاسيد معدنية، بوليمرات، عطور",
                featured: true,
                stock: 12,
                inStock: true,
                reviews: []
            },
            {
                id: 8,
                name: "مجموعة فرش مكياج احترافية",
                brand: "هدى بيوتي",
                category: "cat7",
                price: 280,
                oldPrice: 350,
                image: placeholderImage,
                description: "مجموعة فرش مكياج احترافية تضم 12 فرشاة أساسية لتطبيق المكياج بدقة واحترافية. مصنوعة من شعيرات اصطناعية عالية الجودة ناعمة على البشرة.",
                features: [
                    "12 فرشاة متنوعة للوجه والعيون والشفاه",
                    "شعيرات اصطناعية عالية الجودة",
                    "مقابض خشبية مريحة",
                    "سهلة التنظيف والعناية",
                    "تأتي في حقيبة أنيقة للتخزين والسفر"
                ],
                usage: "تستخدم كل فرشاة حسب الغرض المخصص لها. تنظف بانتظام باستخدام شامبو لطيف وتترك لتجف في الهواء.",
                weight: "350 جرام",
                ingredients: "شعيرات تاكلون اصطناعية، مقابض خشبية، حلقات ألمنيوم",
                featured: true,
                stock: 8,
                inStock: true,
                reviews: []
            },
            {
                id: 9,
                name: "طلاء أظافر جل متعدد الألوان",
                brand: "إيسي",
                category: "cat6",
                price: 220,
                oldPrice: 280,
                image: placeholderImage,
                description: "مجموعة طلاء أظافر جل بتقنية الـ LED/UV تضم 6 ألوان عصرية. تدوم لمدة تصل إلى أسبوعين دون تقشير أو بهتان.",
                features: [
                    "6 ألوان عصرية متنوعة",
                    "تقنية الجل بدون الحاجة لمزيل الأسيتون",
                    "يجف بسرعة باستخدام مصباح LED/UV",
                    "يدوم حتى 14 يوماً",
                    "لمعان عالي ومظهر احترافي"
                ],
                usage: "يطبق طبقة أساس، ثم طبقتين من اللون المختار، وأخيراً طبقة علوية. يجفف كل طبقة تحت مصباح LED/UV لمدة 30-60 ثانية.",
                weight: "6 × 10 مل",
                ingredients: "بوتيل أسيتات، إيثيل أسيتات، نيتروسيليلوز، أسيتيل تريبوتيل سيترات، بيجمنت",
                featured: true,
                stock: 15,
                inStock: true,
                reviews: []
            },
            {
                id: 10,
                name: "زيت أرغان للشعر",
                brand: "موروكان أويل",
                category: "cat3",
                price: 160,
                oldPrice: 190,
                image: placeholderImage,
                description: "زيت أرغان نقي للشعر يعمل على ترطيب وتنعيم وتغذية الشعر. يقلل من التجعد ويمنح الشعر لمعاناً صحياً ويحميه من الحرارة.",
                features: [
                    "يرطب وينعم الشعر",
                    "يقلل من التجعد والتطاير",
                    "يحمي من الحرارة أثناء التصفيف",
                    "يمنح لمعاناً طبيعياً",
                    "يسرع من وقت التجفيف"
                ],
                usage: "توضع بضع قطرات على الشعر الرطب أو الجاف وتوزع من منتصف الشعر حتى الأطراف. يمكن استخدامه قبل التصفيف بالحرارة.",
                weight: "100 مل",
                ingredients: "زيت الأرغان، سيكلوميثيكون، ديميثيكونول، عطور",
                featured: false,
                stock: 18,
                inStock: true,
                reviews: []
            },
            {
                id: 11,
                name: "باليت ظلال عيون 35 لون",
                brand: "مورفي",
                category: "cat2",
                price: 250,
                oldPrice: 320,
                image: placeholderImage,
                description: "باليت ظلال عيون يضم 35 لوناً متنوعاً بين الألوان المطفية واللامعة والساتان. ألوان عالية الصباغة سهلة المزج لإطلالات لا حصر لها.",
                features: [
                    "35 لوناً متنوعاً",
                    "درجات مطفية ولامعة وساتان",
                    "صباغة عالية وثبات طويل",
                    "سهلة المزج والتطبيق",
                    "مناسبة للإطلالات اليومية والسهرات"
                ],
                usage: "تؤخذ كمية قليلة من الظلال بفرشاة وتطبق على الجفن. يمكن بناء اللون تدريجياً للحصول على التأثير المطلوب.",
                weight: "60 جرام",
                ingredients: "تالك، ميكا، بيجمنت، سيليكا، نايلون-12، بوليمرات",
                featured: false,
                stock: 10,
                inStock: true,
                reviews: []
            },
            {
                id: 12,
                name: "صابون طبيعي بزيت الزيتون",
                brand: "سرَّاء",
                category: "cat5",
                price: 45,
                oldPrice: 60,
                image: placeholderImage,
                description: "صابون طبيعي مصنوع يدوياً بزيت الزيتون البكر. ينظف البشرة بلطف ويرطبها ويحافظ على توازنها الطبيعي.",
                features: [
                    "مصنوع يدوياً بزيت الزيتون البكر",
                    "ينظف ويرطب البشرة بلطف",
                    "خالي من المواد الكيميائية الضارة",
                    "مناسب لجميع أنواع البشرة، بما في ذلك الحساسة",
                    "رائحة طبيعية خفيفة"
                ],
                usage: "يستخدم لغسل الوجه والجسم. يرغى بالماء ويدلك على البشرة ثم يشطف جيداً.",
                weight: "100 جرام",
                ingredients: "زيت زيتون، ماء، هيدروكسيد الصوديوم",
                featured: false,
                stock: 40,
                inStock: true,
                reviews: []
            },
            {
                id: 13,
                name: "عطر رجالي منعش",
                brand: "هوجو بوس",
                category: "cat4",
                price: 450,
                oldPrice: 550,
                image: placeholderImage,
                description: "عطر رجالي منعش وحيوي يجمع بين نفحات الحمضيات والأخشاب. مثالي للاستخدام اليومي ويمنح شعوراً بالثقة والانتعاش.",
                features: [
                    "رائحة منعشة وحيوية",
                    "مزيج من الحمضيات والأخشاب",
                    "يدوم طويلاً",
                    "مناسب للاستخدام اليومي والمناسبات غير الرسمية",
                    "تصميم زجاجة عصري وأنيق"
                ],
                usage: "يرش على مناطق النبض: المعصمين، خلف الأذنين، وأسفل الرقبة.",
                weight: "100 مل",
                ingredients: "كحول، ماء، عطور، ليمون، برغموت، خشب الأرز، نجيل الهند",
                featured: false,
                stock: 12,
                inStock: true,
                reviews: []
            },
            {
                id: 14,
                name: "جل استحمام بخلاصة اللافندر",
                brand: "سرَّاء",
                category: "cat5",
                price: 70,
                oldPrice: 90,
                image: placeholderImage,
                description: "جل استحمام منعش بخلاصة اللافندر الطبيعية. ينظف البشرة بلطف ويهدئ الحواس برائحة اللافندر المريحة ويترك البشرة ناعمة ومنتعشة.",
                features: [
                    "خلاصة اللافندر الطبيعية",
                    "ينظف بلطف دون تجفيف البشرة",
                    "رائحة مهدئة تساعد على الاسترخاء",
                    "رغوة غنية وكريمية",
                    "مناسب للاستخدام اليومي"
                ],
                usage: "يوضع كمية مناسبة على ليفة مبللة أو مباشرة على البشرة المبللة، يدلك لتكوين رغوة ثم يشطف جيداً.",
                weight: "250 مل",
                ingredients: "ماء، صوديوم لوريث سلفات، كوكاميدوبروبيل بيتاين، جلسرين، خلاصة اللافندر، ألوفيرا، بانثينول",
                featured: false,
                stock: 25,
                inStock: true,
                reviews: []
            },
            {
                id: 15,
                name: "مزيل مكياج للعيون",
                brand: "بيوديرما",
                category: "cat1",
                price: 110,
                oldPrice: 140,
                image: placeholderImage,
                description: "مزيل مكياج لطيف للعيون والوجه بتركيبة مائية خالية من الزيوت. يزيل المكياج بفعالية دون فرك أو سحب البشرة الحساسة حول العينين.",
                features: [
                    "تركيبة مائية خالية من الزيوت",
                    "يزيل المكياج المقاوم للماء بسهولة",
                    "لطيف على البشرة الحساسة والعيون",
                    "لا يحتاج للشطف",
                    "خالي من العطور والكحول والبارابين"
                ],
                usage: "توضع كمية مناسبة على قطنة وتمرر بلطف على العينين والوجه لإزالة المكياج. لا يحتاج للشطف.",
                weight: "250 مل",
                ingredients: "ماء، هكسيلين جلايكول، سيتيث-20، بوليأمينوبروبيل بيجوانيد، إديتا ثنائي الصوديوم",
                featured: false,
                stock: 20,
                inStock: true,
                reviews: []
            },
            {
                id: 16,
                name: "مقوي أظافر علاجي",
                brand: "أو بي آي",
                category: "cat6",
                price: 95,
                oldPrice: 120,
                image: placeholderImage,
                description: "مقوي أظافر علاجي يعالج الأظافر الضعيفة والمتقصفة. يحتوي على الكالسيوم والبروتين لتقوية الأظافر وحمايتها من التكسر.",
                features: [
                    "يقوي الأظافر الضعيفة والمتقصفة",
                    "غني بالكالسيوم والبروتين",
                    "يمنع تكسر وتقشر الأظافر",
                    "يمكن استخدامه كطبقة أساس تحت طلاء الأظافر",
                    "نتائج ملحوظة خلال أسبوعين"
                ],
                usage: "يطبق طبقة واحدة على الأظافر النظيفة يومياً لمدة أسبوع، ثم يزال ويعاد التطبيق. للنتائج المثلى، يستخدم لمدة 4-6 أسابيع.",
                weight: "15 مل",
                ingredients: "بوتيل أسيتات، إيثيل أسيتات، نيتروسيليلوز، كالسيوم، بروتين القمح، فيتامين E، كيراتين",
                featured: false,
                stock: 15,
                inStock: true,
                reviews: []
            },
            {
                id: 17,
                name: "إسفنجة مكياج بيوتي بلندر",
                brand: "بيوتي بلندر",
                category: "cat7",
                price: 80,
                oldPrice: 100,
                image: placeholderImage,
                description: "إسفنجة مكياج احترافية بشكل قطرة الماء لتطبيق المكياج بنعومة ودقة. تستخدم رطبة لتوزيع كريم الأساس بشكل متساوٍ ومظهر طبيعي.",
                features: [
                    "شكل فريد يصل إلى جميع زوايا الوجه",
                    "تكبر حجمها عند البلل",
                    "تطبيق سلس ومتساوٍ للمكياج",
                    "خالية من اللاتكس ومواد مسببة للحساسية",
                    "قابلة لإعادة الاستخدام وسهلة التنظيف"
                ],
                usage: "تبلل بالماء وتعصر الماء الزائد، ثم تستخدم بحركات نقر لتطبيق وتوزيع المكياج. تغسل بعد كل استخدام بصابون لطيف.",
                weight: "20 جرام",
                ingredients: "إسفنج هيدروفيليك خالي من اللاتكس",
                featured: false,
                stock: 25,
                inStock: true,
                reviews: []
            },
            {
                id: 18,
                name: "بلسم مرطب للشفاه",
                brand: "كلينيك",
                category: "cat1",
                price: 65,
                oldPrice: 85,
                image: placeholderImage,
                description: "بلسم مرطب للشفاه يعالج الجفاف والتشقق. يحتوي على زبدة الشيا وفيتامين E لترطيب عميق وحماية الشفاه من العوامل الخارجية.",
                features: [
                    "ترطيب مكثف يدوم طويلاً",
                    "يعالج تشقق الشفاه",
                    "خالي من العطور والمواد المهيجة",
                    "يمكن استخدامه تحت أحمر الشفاه",
                    "مناسب للاستخدام اليومي"
                ],
                usage: "يوضع على الشفاه حسب الحاجة. يمكن استخدامه عدة مرات خلال اليوم للحفاظ على ترطيب الشفاه.",
                weight: "4.5 جرام",
                ingredients: "زبدة الشيا، زيت اللوز، شمع النحل، فيتامين E، جلسرين",
                featured: false,
                stock: 15,
                inStock: true,
                reviews: []
            },
            {
                id: 19,
                name: "قناع شعر مغذي بالأرغان والكيراتين",
                brand: "سرَّاء",
                category: "cat3",
                price: 140,
                oldPrice: 180,
                image: placeholderImage,
                description: "قناع شعر مغذي بزيت الأرغان والكيراتين لإصلاح الشعر التالف وتغذيته بعمق. يمنح الشعر نعومة ولمعاناً ويقلل من التقصف والتجعد.",
                features: [
                    "إصلاح عميق للشعر التالف",
                    "يغذي ويرطب الشعر بعمق",
                    "يمنح نعومة ولمعاناً",
                    "يقلل من التقصف والتجعد",
                    "نتائج ملحوظة من أول استخدام"
                ],
                usage: "يوضع على الشعر المبلل بعد الشامبو، يترك لمدة 10-15 دقيقة ثم يشطف جيداً بالماء الدافئ. يستخدم 1-2 مرة أسبوعياً.",
                weight: "300 مل",
                ingredients: "ماء، زيت أرغان، كيراتين، بروتين الحرير، زبدة الشيا، جلسرين، بانثينول",
                featured: false,
                stock: 8,
                inStock: true,
                reviews: []
            }
        ];
        
        // تحديث روابط الصور المكسورة
        initialProducts.forEach(product => {
            if (missingImages.includes(product.image)) {
                product.image = placeholderImage;
            }
        });
        
        localStorage.setItem("products", JSON.stringify(initialProducts));
        console.log("Initialized products in localStorage");
    }

    // Initialize categories if not already in localStorage
    if (!localStorage.getItem("categories")) {
        const initialCategories = [
            {
                id: "cat1",
                name: "العناية بالبشرة",
                description: "منتجات العناية بالوجه والجسم",
                image: "images/category-placeholder.jpg",
                featured: true
            },
            {
                id: "cat2",
                name: "المكياج",
                description: "منتجات المكياج والتجميل",
                image: "images/category-placeholder.jpg",
                featured: true
            },
            {
                id: "cat3",
                name: "العناية بالشعر",
                description: "منتجات العناية بالشعر وتصفيفه",
                image: "images/category-placeholder.jpg",
                featured: false
            },
            {
                id: "cat4",
                name: "العطور",
                description: "عطور نسائية ورجالية فاخرة ومميزة",
                image: "images/category-placeholder.jpg",
                featured: true
            },
            {
                id: "cat5",
                name: "مستلزمات الاستحمام",
                description: "صابون وجل استحمام ومنتجات العناية بالجسم",
                image: "images/category-placeholder.jpg",
                featured: false
            },
            {
                id: "cat6",
                name: "منتجات الأظافر",
                description: "طلاء أظافر ومستلزمات العناية بالأظافر",
                image: "images/category-placeholder.jpg",
                featured: true
            },
            {
                id: "cat7",
                name: "أدوات التجميل",
                description: "فرش مكياج وإسفنج وأدوات تطبيق مستحضرات التجميل",
                image: "images/category-placeholder.jpg",
                featured: true
            }
        ];
        localStorage.setItem("categories", JSON.stringify(initialCategories));
        console.log("Initialized categories in localStorage");
    }
}

// Populate filter dropdowns
function populateFilters() {
    const categoryFilterSelect = document.getElementById("categoryFilter");
    const brandFilterSelect = document.getElementById("brandFilter");

    if (!categoryFilterSelect || !brandFilterSelect) return; // Exit if elements not found

    // Check if filters are already populated to avoid duplication
    // Check based on whether the default option is the only one
    const categoryPopulated = categoryFilterSelect.options.length > 1;

    if (categoryPopulated) {
        // console.log("Categories already populated.");
        // We still need to update brands based on selected category
        updateBrandFilterBasedOnCategory();
        return;
    }
    console.log("Populating filters...");

    const categories = JSON.parse(localStorage.getItem("categories")) || [];
    const products = JSON.parse(localStorage.getItem("products")) || [];

    // Populate categories if not already done
    if (!categoryPopulated) {
        categoryFilterSelect.innerHTML = '<option value="">جميع الفئات</option>'; // Reset
        categories.forEach(category => {
            const option = document.createElement("option");
            option.value = category.id;
            option.textContent = category.name;
            categoryFilterSelect.appendChild(option);
        });
    }

    // Add event listener to category filter to update brands when category changes
    categoryFilterSelect.addEventListener("change", updateBrandFilterBasedOnCategory);

    // Initial population of brands based on current category selection
    updateBrandFilterBasedOnCategory();
    
    console.log("Filters populated.");
}

// Update brand filter options based on selected category
function updateBrandFilterBasedOnCategory() {
    const categoryFilterSelect = document.getElementById("categoryFilter");
    const brandFilterSelect = document.getElementById("brandFilter");
    
    if (!categoryFilterSelect || !brandFilterSelect) return;
    
    const selectedCategory = categoryFilterSelect.value;
    const products = JSON.parse(localStorage.getItem("products")) || [];
    
    // Filter products by selected category if any
    const filteredProducts = selectedCategory 
        ? products.filter(product => product.category === selectedCategory)
        : products;
    
    // Get unique brands from filtered products
    const uniqueBrands = [...new Set(filteredProducts.map(product => product.brand))].sort();
    
    // Save current selection if possible
    const currentBrandSelection = brandFilterSelect.value;
    
    // Reset brand filter
    brandFilterSelect.innerHTML = '<option value="">جميع البراندات</option>';
    
    // Add brand options
    uniqueBrands.forEach(brand => {
        const option = document.createElement("option");
        option.value = brand;
        option.textContent = brand;
        brandFilterSelect.appendChild(option);
    });
    
    // Try to restore previous selection if it still exists in the new options
    if (currentBrandSelection && uniqueBrands.includes(currentBrandSelection)) {
        brandFilterSelect.value = currentBrandSelection;
    } else {
        brandFilterSelect.value = ""; // Reset to "All Brands" if previous selection is no longer valid
    }
}


// Load products on products.html page
function loadProducts() {
    const productsContainer = document.getElementById("productsContainer");
    if (!productsContainer) return;

    // Get filter values (categoryFilter might be pre-set from URL)
    const categoryFilter = document.getElementById("categoryFilter")?.value || "";
    const brandFilter = document.getElementById("brandFilter")?.value || "";
    const minPriceFilter = document.getElementById("minPriceFilter")?.value || "";
    const maxPriceFilter = document.getElementById("maxPriceFilter")?.value || "";
    const searchQuery = document.getElementById("searchInput")?.value || "";
    // Sorting element ID might be different, check products.html - Ah, it's missing! Let's assume it should be there or ignore sorting for now.
    // const sortBy = document.getElementById("sortBy")?.value || "name-asc"; // Assuming 'sortBy' element exists

    // Get products from localStorage
    const products = JSON.parse(localStorage.getItem("products")) || [];
    // console.log(`Loaded ${products.length} products from localStorage`);
    console.log(`Filtering with Category: '${categoryFilter}', Brand: '${brandFilter}', Price: ${minPriceFilter}-${maxPriceFilter}, Search: '${searchQuery}'`);

    // Filter products
    let filteredProducts = products.filter(product => {
        // Category filter
        if (categoryFilter && product.category !== categoryFilter) return false;

        // Brand filter
        if (brandFilter && product.brand !== brandFilter) return false;

        // Price filter
        if (minPriceFilter && product.price < parseFloat(minPriceFilter)) return false; // Use parseFloat
        if (maxPriceFilter && product.price > parseFloat(maxPriceFilter)) return false; // Use parseFloat

        // Search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase().trim(); // Add trim
            if (query) { // Only search if query is not empty
                 return product.name.toLowerCase().includes(query) ||
                       (product.description && product.description.toLowerCase().includes(query)) || // Check if description exists
                       product.brand.toLowerCase().includes(query);
            }
        }

        return true;
    });

    console.log(`Filtered to ${filteredProducts.length} products`);

    // Sorting (Example - needs sortBy element in HTML)
    /*
    if (sortBy === "price-asc") {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
        filteredProducts.sort((a, b) => b.price - a.price);
    } else if (sortBy === "name-desc") {
        filteredProducts.sort((a, b) => b.name.localeCompare(a.name, 'ar')); // Arabic locale compare
    } else { // Default: name-asc
        filteredProducts.sort((a, b) => a.name.localeCompare(a.name, 'ar')); // Arabic locale compare
    }
    */
    // Default sort by name ascending if no sort element
    filteredProducts.sort((a, b) => a.name.localeCompare(b.name, 'ar'));


    // Pagination
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    currentPage = Math.max(1, Math.min(currentPage, totalPages)); // Ensure currentPage is valid
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const productsToDisplay = filteredProducts.slice(startIndex, endIndex);

    // Display products
    displayProducts(productsToDisplay);

    // Display pagination
    displayPagination(totalPages, currentPage);
}

// Display products in the container
function displayProducts(productsToDisplay) {
    const productsContainer = document.getElementById("productsContainer");
    productsContainer.innerHTML = ""; // Clear previous products

    if (productsToDisplay.length === 0) {
        productsContainer.innerHTML = `<div class="col-12"><p class="text-center">لا توجد منتجات تطابق معايير البحث.</p></div>`;
        return;
    }

    // Load categories to get names
    const categories = JSON.parse(localStorage.getItem("categories")) || [];

    productsToDisplay.forEach(product => {
        // Find category name
        const category = categories.find(cat => cat.id === product.category);
        const categoryName = category ? category.name : 'غير مصنف'; // Default if category not found

        const productCol = document.createElement("div");
        productCol.className = "col-md-4 mb-4"; // Adjust column size as needed

        // Calculate discount percentage if there's an old price
        const discountBadge = product.oldPrice && product.oldPrice > product.price ? 
            `<span class="badge bg-danger position-absolute top-0 end-0 m-2">خصم ${Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%</span>` : "";

        // Prepare old price display
        const oldPriceDisplay = product.oldPrice ?
            `<del class="text-muted ms-2">${product.oldPrice} <span class="price-currency"></span></del>` : ``; // Removed placeholder

        productCol.innerHTML = `
            <div class="card h-100 product-card position-relative">
                ${discountBadge}
                <a href="product-detail.html?id=${product.id}">
                    <img src="${product.image || 'images/product-placeholder.jpg'}" class="card-img-top product-img" alt="${product.name}">
                </a>
                <div class="card-body d-flex flex-column">
                    <!-- Badges Container -->
                    <div class="product-badges">
                        <span class="badge category-badge">${categoryName}</span>
                        <span class="badge brand-badge">${product.brand}</span>
                    </div>
                    <h5 class="card-title text-center">
                        <a href="product-detail.html?id=${product.id}" class="text-decoration-none text-dark">${product.name}</a>
                    </h5>
                    <div class="text-center mb-3"> <!-- Centered price block -->
                        <span class="price">${product.price} <span class="price-currency"></span></span>
                        ${oldPriceDisplay}
                    </div>
                    <div class="d-flex justify-content-between mt-auto">
                        <a href="product-detail.html?id=${product.id}" class="btn btn-outline-primary">التفاصيل</a>
                        <button class="btn btn-primary add-to-cart-btn" data-id="${product.id}" ${!product.inStock ? 'disabled' : ''}>
                            <i class="fas fa-cart-plus me-1"></i> ${product.inStock ? 'أضف للسلة' : 'نفذ المخزون'}
                        </button>
                    </div>
                </div>
            </div>
        `;
        productsContainer.appendChild(productCol);
    });
    // Apply currency settings after products are loaded
    // applyGlobalCurrencySetting(); 
}

// Display pagination controls
function displayPagination(totalPages, currentPage) {
    const paginationContainer = document.getElementById("paginationContainer");
    if (!paginationContainer) return;

    paginationContainer.innerHTML = ""; // Clear previous pagination

    if (totalPages <= 1) return; // No pagination needed for 1 or fewer pages

    const ul = document.createElement("ul");
    ul.className = "pagination";

    // Previous button
    const prevLi = document.createElement("li");
    prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
    const prevLink = document.createElement("a");
    prevLink.className = "page-link";
    prevLink.href = "#";
    prevLink.textContent = "السابق";
    prevLink.addEventListener("click", (e) => {
        e.preventDefault();
        if (currentPage > 1) {
            goToPage(currentPage - 1);
        }
    });
    prevLi.appendChild(prevLink);
    ul.appendChild(prevLi);

    // Page numbers (simplified for brevity, could add ellipsis for many pages)
    for (let i = 1; i <= totalPages; i++) {
        const li = document.createElement("li");
        li.className = `page-item ${i === currentPage ? 'active' : ''}`;
        const link = document.createElement("a");
        link.className = "page-link";
        link.href = "#";
        link.textContent = i;
        link.addEventListener("click", (e) => {
            e.preventDefault();
            goToPage(i);
        });
        li.appendChild(link);
        ul.appendChild(li);
    }

    // Next button
    const nextLi = document.createElement("li");
    nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
    const nextLink = document.createElement("a");
    nextLink.className = "page-link";
    nextLink.href = "#";
    nextLink.textContent = "التالي";
    nextLink.addEventListener("click", (e) => {
        e.preventDefault();
        if (currentPage < totalPages) {
            goToPage(currentPage + 1);
        }
    });
    nextLi.appendChild(nextLink);
    ul.appendChild(nextLi);

    paginationContainer.appendChild(ul);
}

// Go to a specific page
function goToPage(pageNumber) {
    currentPage = pageNumber;
    loadProducts();
    window.scrollTo(0, 0); // Scroll to top
}

// Load product details on product-detail.html
function loadProductDetail() {
    const productDetailContainer = document.getElementById("productDetailContainer");
    if (!productDetailContainer) return;

    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));

    if (!productId) {
        productDetailContainer.innerHTML = `<p class="text-center text-danger">معرف المنتج غير صحيح.</p>`;
        return;
    }

    const products = JSON.parse(localStorage.getItem("products")) || [];
    const product = products.find(p => p.id === productId);

    if (!product) {
        productDetailContainer.innerHTML = `<p class="text-center text-danger">لم يتم العثور على المنتج.</p>`;
        return;
    }

    // Load categories to get name
    const categories = JSON.parse(localStorage.getItem("categories")) || [];
    const category = categories.find(cat => cat.id === product.category);
    const categoryName = category ? category.name : 'غير مصنف';

    // Calculate discount percentage
    const discountBadge = product.oldPrice && product.oldPrice > product.price ? 
        `<span class="badge bg-danger ms-2">خصم ${Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%</span>` : "";

    // Prepare old price display
    const oldPriceDisplay = product.oldPrice ?
        `<del class="text-muted ms-2">${product.oldPrice} <span class="price-currency"></span></del>` : ``;

    productDetailContainer.innerHTML = `
        <div class="row">
            <div class="col-md-5">
                <div class="product-image-container">
                    <img src="${product.image || 'images/product-placeholder.jpg'}" class="img-fluid product-detail-img" alt="${product.name}">
                </div>
            </div>
            <div class="col-md-7">
                <div class="product-details">
                    <h1 class="product-title">${product.name}</h1>
                    <div class="product-meta">
                        <span class="badge category-badge">${categoryName}</span>
                        <span class="badge brand-badge">${product.brand}</span>
                        <span class="badge ${product.inStock ? 'bg-success' : 'bg-danger'}">${product.inStock ? 'متوفر' : 'غير متوفر'}</span>
                    </div>
                    <div class="product-price mt-3">
                        <span class="price">${product.price} <span class="price-currency"></span></span>
                        ${oldPriceDisplay}
                        ${discountBadge}
                    </div>
                    <div class="product-description mt-4">
                        <p>${product.description}</p>
                    </div>
                    <div class="product-features mt-4">
                        <h4>المميزات</h4>
                        <ul>
                            ${product.features.map(feature => `<li>${feature}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="product-actions mt-4">
                        <div class="quantity-selector mb-3">
                            <label for="quantity">الكمية:</label>
                            <div class="input-group" style="width: 150px;">
                                <button class="btn btn-outline-secondary quantity-minus" type="button">-</button>
                                <input type="number" id="quantity" class="form-control text-center" value="1" min="1" max="${product.stock}">
                                <button class="btn btn-outline-secondary quantity-plus" type="button">+</button>
                            </div>
                        </div>
                        <button class="btn btn-primary add-to-cart-detail-btn" data-id="${product.id}" ${!product.inStock ? 'disabled' : ''}>
                            <i class="fas fa-cart-plus me-1"></i> ${product.inStock ? 'أضف للسلة' : 'غير متوفر'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div class="row mt-5">
            <div class="col-12">
                <ul class="nav nav-tabs" id="productTabs" role="tablist">
                    <li class="nav-item" role="presentation">
                        <button class="nav-link active" id="usage-tab" data-bs-toggle="tab" data-bs-target="#usage" type="button" role="tab" aria-controls="usage" aria-selected="true">طريقة الاستخدام</button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="ingredients-tab" data-bs-toggle="tab" data-bs-target="#ingredients" type="button" role="tab" aria-controls="ingredients" aria-selected="false">المكونات</button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="reviews-tab" data-bs-toggle="tab" data-bs-target="#reviews" type="button" role="tab" aria-controls="reviews" aria-selected="false">التقييمات</button>
                    </li>
                </ul>
                <div class="tab-content p-4 border border-top-0 rounded-bottom" id="productTabsContent">
                    <div class="tab-pane fade show active" id="usage" role="tabpanel" aria-labelledby="usage-tab">
                        <p>${product.usage}</p>
                        <p><strong>الوزن/الحجم:</strong> ${product.weight}</p>
                    </div>
                    <div class="tab-pane fade" id="ingredients" role="tabpanel" aria-labelledby="ingredients-tab">
                        <p>${product.ingredients}</p>
                    </div>
                    <div class="tab-pane fade" id="reviews" role="tabpanel" aria-labelledby="reviews-tab">
                        ${product.reviews && product.reviews.length > 0 ? 
                            product.reviews.map(review => `
                                <div class="review-item mb-3 p-3 border-bottom">
                                    <div class="d-flex justify-content-between">
                                        <h5>${review.name}</h5>
                                        <div class="rating">
                                            ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}
                                        </div>
                                    </div>
                                    <p class="review-date text-muted">${review.date}</p>
                                    <p>${review.comment}</p>
                                </div>
                            `).join('') : 
                            '<p>لا توجد تقييمات لهذا المنتج حتى الآن.</p>'
                        }
                        <div class="add-review mt-4">
                            <h4>أضف تقييمك</h4>
                            <form id="reviewForm">
                                <div class="mb-3">
                                    <label for="reviewName" class="form-label">الاسم</label>
                                    <input type="text" class="form-control" id="reviewName" required>
                                </div>
                                <div class="mb-3">
                                    <label for="reviewRating" class="form-label">التقييم</label>
                                    <select class="form-select" id="reviewRating" required>
                                        <option value="">اختر تقييمك</option>
                                        <option value="5">5 نجوم - ممتاز</option>
                                        <option value="4">4 نجوم - جيد جداً</option>
                                        <option value="3">3 نجوم - جيد</option>
                                        <option value="2">2 نجوم - مقبول</option>
                                        <option value="1">1 نجمة - سيء</option>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label for="reviewComment" class="form-label">التعليق</label>
                                    <textarea class="form-control" id="reviewComment" rows="3" required></textarea>
                                </div>
                                <button type="submit" class="btn btn-primary">إرسال التقييم</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Add event listeners for quantity buttons
    const quantityInput = document.getElementById("quantity");
    const minusBtn = document.querySelector(".quantity-minus");
    const plusBtn = document.querySelector(".quantity-plus");

    if (quantityInput && minusBtn && plusBtn) {
        minusBtn.addEventListener("click", () => {
            const currentValue = parseInt(quantityInput.value);
            if (currentValue > 1) {
                quantityInput.value = currentValue - 1;
            }
        });

        plusBtn.addEventListener("click", () => {
            const currentValue = parseInt(quantityInput.value);
            if (currentValue < product.stock) {
                quantityInput.value = currentValue + 1;
            }
        });
    }

    // Add event listener for add to cart button
    const addToCartBtn = document.querySelector(".add-to-cart-detail-btn");
    if (addToCartBtn) {
        addToCartBtn.addEventListener("click", () => {
            const quantity = parseInt(quantityInput.value);
            addToCart(product.id, quantity);
        });
    }

    // Add event listener for review form
    const reviewForm = document.getElementById("reviewForm");
    if (reviewForm) {
        reviewForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const name = document.getElementById("reviewName").value;
            const rating = parseInt(document.getElementById("reviewRating").value);
            const comment = document.getElementById("reviewComment").value;
            
            // Create new review
            const newReview = {
                name,
                rating,
                comment,
                date: new Date().toLocaleDateString('ar-EG')
            };
            
            // Update product reviews
            const products = JSON.parse(localStorage.getItem("products")) || [];
            const productIndex = products.findIndex(p => p.id === product.id);
            
            if (productIndex !== -1) {
                if (!products[productIndex].reviews) {
                    products[productIndex].reviews = [];
                }
                products[productIndex].reviews.push(newReview);
                localStorage.setItem("products", JSON.stringify(products));
                
                // Reload product detail to show new review
                loadProductDetail();
            }
        });
    }
}

// Add product to cart
function addToCart(productId, quantity) {
    // Get cart from localStorage or initialize empty array
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    // Check if product already in cart
    const existingItemIndex = cart.findIndex(item => item.productId === productId);
    
    if (existingItemIndex !== -1) {
        // Update quantity if product already in cart
        cart[existingItemIndex].quantity += quantity;
    } else {
        // Add new item to cart
        cart.push({
            productId,
            quantity
        });
    }
    
    // Save updated cart to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));
    
    // Update cart count display
    updateCartCount();
    
    // Show success message
    showToast("تمت إضافة المنتج إلى السلة بنجاح");
}

// Update cart count display
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    const cartCountElements = document.querySelectorAll(".cart-count");
    cartCountElements.forEach(element => {
        element.textContent = totalItems;
    });
}

// Show toast notification
function showToast(message) {
    // Check if toast container exists, create if not
    let toastContainer = document.querySelector(".toast-container");
    if (!toastContainer) {
        toastContainer = document.createElement("div");
        toastContainer.className = "toast-container position-fixed bottom-0 end-0 p-3";
        document.body.appendChild(toastContainer);
    }
    
    // Create toast element
    const toastId = `toast-${Date.now()}`;
    const toastHtml = `
        <div id="${toastId}" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header">
                <strong class="me-auto">سرَّاء</strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        </div>
    `;
    
    toastContainer.insertAdjacentHTML("beforeend", toastHtml);
    
    // Initialize and show toast
    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement, { autohide: true, delay: 3000 });
    toast.show();
    
    // Remove toast after it's hidden
    toastElement.addEventListener("hidden.bs.toast", () => {
        toastElement.remove();
    });
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", function() {
    updateCartCount();
});
