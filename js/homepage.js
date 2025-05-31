// homepage.js - Handles homepage functionality

document.addEventListener("DOMContentLoaded", function() {
    // Initialize data if needed
    initializeData();

    // Load categories on homepage
    const categoriesContainer = document.getElementById("homepage-categories-container");
    if (categoriesContainer) {
        console.log("Categories container found on page load, loading categories...");
        loadHomepageCategories();
    }

    // Load featured products on homepage
    const featuredProductsContainer = document.getElementById("featured-products-container");
    if (featuredProductsContainer) {
        console.log("Featured products container found on page load, loading featured products...");
        loadFeaturedProducts();
    }
});

// Initialize both products and categories if missing
function initializeData() {
    // Initialize products if not already in localStorage
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
                featured: true,
                stock: 15,
                inStock: true,
                reviews: [
                    { user: "سارة أحمد", rating: 5, comment: "منتج رائع، نتائج ملحوظة من أول استخدام" },
                    { user: "هدى محمد", rating: 4, comment: "كريم ممتاز للبشرة الجافة، أنصح به بشدة" }
                ]
            },
            {
                id: 2,
                name: "سيروم ذا نورديا بفيتامين سي 15% من بيونكس، 30 مل",
                brand: "بيونكس",
                category: "cat1",
                price: 550,
                oldPrice: 600,
                image: "images/products/photo_2025-05-28_22-46-40.jpg",
                description: "سيروم مركز بفيتامين سي النقي لتفتيح البشرة وتوحيد لونها وإشراقها. يساعد على تقليل التصبغات وآثار حب الشباب.",
                features: [
                    "تركيز عالي من فيتامين سي النقي",
                    "يفتح البشرة ويوحد لونها",
                    "يقلل التصبغات وآثار حب الشباب",
                    "يحمي البشرة من التلف التأكسدي، ويدعم إنتاج الكولاجين",
                    "نتائج ملحوظة خلال أسبوعين"
                ],
                usage: "يستخدم صباحاً على البشرة النظيفة قبل المرطب وواقي الشمس. ضعي 2-3 قطرات على الوجه والرقبة ودلكي برفق حتى الامتصاص.",
                weight: "30 مل",
                ingredients: "ماء، فيتامين سي بتركيز 15%، حمض الهيالورونيك، جليسرين، بروبيلين جلايكول",
                featured: false,
                stock: 8,
                inStock: true,
                reviews: []
            },
            {
                id: 3,
                name: "شامبو للشعر 300 مل من سيروبيب",
                brand: "سيروبيب",
                category: "cat3",
                price: 185,
                oldPrice: 210,
                image: "images/products/photo_2025-05-28_22-44-53.jpg",
                description: "غني بالأعشاب اليابانية الطبيعية المتعددة (كاميجين كيه وكاميجين اي) والفيتامينات لتقليل معدل تساقط الشعر.",
                features: [
                    "مناسب لجميع أنواع الشعر",
                    "يصلح الشعر التالف",
                    "يمنح الشعر النعومة واللمعان",
                    "يحمي من التقصف",
                    "مناسب للاستخدام اليومي"
                ],
                usage: "ضعي كمية مناسبة على الشعر المبلل ودلكي فروة الرأس برفق، ثم اشطفي جيداً بالماء الدافئ.",
                weight: "400 مل",
                ingredients: "ماء، صوديوم لوريث سلفات، كوكاميدوبروبيل بيتين، زيت الأرغان، زيت جوز الهند، بروتين القمح",
                featured: false,
                stock: 20,
                inStock: true,
                reviews: [
                    { user: "محمد علي", rating: 5, comment: "شامبو ممتاز للشعر الجاف" }
                ]
            },
            {
                id: 4,
                name: "احمر الشفاه السائل سوبر ستاي فينيل انك من ميبيلين نيويورك، لون 10 ليبي، 4،2 ملم، لامع",
                brand: " ميبيلين نيويورك",
                category: "cat2",
                price: 405,
                oldPrice: 450,
                image: "images/products/photo_2025-05-28_22-54-05.jpg",
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
                featured: true,
                stock: 12,
                inStock: true,
                reviews: []
            },
            {
                id: 5,
                name: "ماسكارا سكاي هاي من ميبيلين رقم 01",
                brand: "ميبيلين",
                category: "cat2",
                price: 400,
                oldPrice: 450,
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
                featured: false,
                stock: 7,
                inStock: true,
                reviews: []
            },
            // 14 منتجات جديدة
            {
                id: 6,
                name: "شانيل نمبر 5 ال او دي تواليت للنساء - 100 مل",
                brand: "شانيل",
                category: "cat4",
                price: 12000,
                oldPrice: 14000,
                image: "images/products/photo_2025-05-28_22-16-40.jpg",
                description: "عطر أيقوني للنساء بتركيبة كلاسيكية فاخرة. يتميز برائحة زهرية ألدهيدية تدوم طويلاً وتمنح إحساساً بالأناقة والفخامة.",
                features: [
                    "تركيبة فاخرة من أرقى المكونات",
                    "رائحة  كهرمان",
                    "يدوم طوال اليوم",
                    "عبوة أنيقة وفاخرة",
                    "مناسب للمناسبات الخاصة"
                ],
                usage: "يرش على مناطق النبض مثل المعصمين وخلف الأذنين وعلى الرقبة للحصول على أفضل النتائج.",
                weight: "100 مل",
                ingredients: "كحول، ماء، زيوت عطرية، ألدهيدات، ياسمين، ورد، إيلانغ إيلانغ، فانيليا",
                featured: true,
                stock: 5,
                inStock: true,
                reviews: []
            },
            {
                id: 7,
                name: "كريم اساس فور ايفر سكين جلو من كريستيان ديور- 2.5 نيوترال، 30 مل",
                brand: "ديور",
                category: "cat2",
                price: 3220,
                oldPrice: 3800,
                image: "images/products/photo_2025-05-28_22-19-35.jpg",
                description: "كريم أساس فاخر بتغطية كاملة ولمسة نهائية مخملية. يوحد لون البشرة ويخفي العيوب مع ترطيب عميق ويدوم طوال اليوم.",
                features: [
                    "تغطية كاملة تدوم 24 ساعة",
                    "مقاوم للماء والتعرق",
                    "يحتوي على عامل حماية من الشمس SPF 35",
                    "مناسب لجميع أنواع البشرة",
                    "متوفر بـ 30 درجة لونية"
                ],
                usage: "ضعي كمية صغيرة على الوجه النظيف ووزعيها بإسفنجة مكياج أو فرشاة أساس للحصول على تغطية متساوية.",
                weight: "30 مل",
                ingredients: "ماء، سيليكون، بيجمنت، جلسرين، فيتامين E، أكسيد التيتانيوم",
                featured: true,
                stock: 10,
                inStock: true,
                reviews: []
            },
            {
                id: 8,
                name: "مجموعة فرش المكياج من بي اس مول مكونة من 18 قطعة من فرش الاساس الصناعية الفاخرة والكونسيلر وظلال العيون وفرش مكياج بودرة الخدود مع شنطة سوداء ]ذهبي]",
                brand: " بي اس مول",
                category: "cat7",
                price: 1980,
                oldPrice: 2300,
                image: "images/products/photo_2025-05-28_22-26-05.jpg",
                description: "مجموعة فرش مكياج احترافية تضم 15 فرشاة مختلفة للوجه والعيون والشفاه. مصنوعة من شعيرات اصطناعية عالية الجودة وناعمة على البشرة.",
                features: [
                    "🎀مجموعة فرش مكياج احترافية: غطي 18 قطعة من فرش ظلال العيون وظلال التجاعيد والكونسيلر وأحمر الخدود وكريم الأساس والمساحيق المضغوطة أو السائبة والهايلايتر والحواجب. مثالي لوضع المنتجات ومزجها وتظليلها. سهلة ومريحة للاستخدام اليومي للماكياج.",
                    "شعيرات ناعمة لا تسبب تهيج البشرة",
                    "🎁مثالية كهدية: مخصصة للمبتدئين والمتحمسين للمكياج حيث أن مجموعة فرش المكياج سهلة الاستخدام وذات جودة فائقة بسعر في متناول الجميع، تشكيلة كاملة تسمح لك بالحفاظ على مكياجك. هدية مثالية للأم والزوجة والصديقات.",
                    "✨تصميم أنيق: مجموعة فرش المكياج المكونة من 18 قطعة تبدو أنيقة وعصرية للغاية مع اللون الذهبي الفاتح الأكثر شعبية وأناقة، لا غنى عنها في حقيبة مستحضرات التجميل الخاصة بك.",
                    "💫مصممة بواسطة BS-MALL: مع التركيز الشديد على احتياجات المستخدم من المكياج، صممت بي اس-مول هذه الفرش لتكون ليست فقط متينة وقابلة للحمل، ولكن أيضًا لتلبية احتياجاتك المتنوعة من المكياج بأشكالها المختلفة."
                ],
                usage: "تستخدم كل فرشاة حسب الغرض المخصص لها. يُنصح بتنظيفها أسبوعياً بشامبو لطيف وتركها لتجف في الهواء.",
                weight: "500 جرام",
                ingredients: "شعيرات تاكلون، مقابض خشبية، حلقات ألمنيوم",
                featured: true,
                stock: 8,
                inStock: true,
                reviews: []
            },
            {
                id: 9,
                name: "طلاء أظافر من يولو، 10 مل، لون أحمر قرمزي، موديل 180",
                brand: "يولو",
                category: "cat6",
                price: 65,
                oldPrice: 90,
                image: "images/products/photo_2025-05-28_22-35-14.jpg",
                description: "طلاء أظافر بتقنية الجل يدوم لمدة تصل إلى أسبوعين دون تقشير. يتميز بلمعان عالي ولون غني وتغطية كاملة من الطبقة الأولى.",
                features: [
                    "يدوم حتى 14 يوم دون تقشير",
                    "لمعان عالي كالصالون",
                    "فرشاة عريضة لتطبيق سهل",
                    "تركيبة خالية من المواد الضارة",
                    "لا يحتاج إلى مصباح UV للتثبيت"
                ],
                usage: "ضعي طبقة أساس، ثم طبقتين من اللون، وأخيراً طبقة علوية للحماية واللمعان. اتركي كل طبقة تجف لمدة دقيقتين.",
                weight: "13.5 مل",
                ingredients: "بوتيل أسيتات، إيثيل أسيتات، نيتروسيليلوز، أسيتيل تريبوتيل سيترات، بيجمنت",
                featured: true,
                stock: 15,
                inStock: true,
                reviews: []
            },
            {
                id: 10,
                name: "زيت العناية بالشعر ادفانس تكنيكس بزيت الارجان وجوز الهند من افون، 100 مل",
                brand: "افون",
                category: "cat3",
                price: 522,
                oldPrice: 600,
                image: "images/products/photo_2025-05-28_22-38-18.jpg",
                description: "زيت أرغان نقي 100% للعناية بالشعر. يغذي ويرطب الشعر الجاف والتالف ويمنحه لمعاناً صحياً. يحمي من التقصف ويسهل تصفيف الشعر.",
                features: [
                    "زيت أرغان نقي 100%",
                    "يغذي ويرطب الشعر بعمق",
                    "يمنح لمعاناً طبيعياً",
                    "يحمي من التقصف والتلف",
                    "يسهل تصفيف الشعر"
                ],
                usage: "ضعي بضع قطرات على راحة اليد وافركيها، ثم وزعيها على الشعر الرطب أو الجاف مع التركيز على الأطراف.",
                weight: "100 مل",
                ingredients: "زيت أرغان نقي، فيتامين E",
                featured: false,
                stock: 12,
                inStock: true,
                reviews: []
            },
            {
                id: 11,
                name: "باليت ايشادو امباورد من هدى بيوتي، غير لامع",
                brand: "هدى بيوتي",
                category: "cat2",
                price: 3450,
                oldPrice: 4000,
                image: "images/products/photo_2025-05-28_22-41-10.jpg",
                description: "باليت ظلال عيون احترافي يضم 35 لوناً متنوعاً بين المات والشيمر. ألوان عالية الصباغة سهلة المزج لإطلالات لا حصر لها.",
                features: [
                    "35 لوناً متنوعاً",
                    "درجات مات وشيمر",
                    "صباغة عالية وثبات طويل",
                    "سهلة المزج والتطبيق",
                    "مناسبة للإطلالات اليومية والسهرات"
                ],
                usage: "استخدمي فرشاة ظلال العيون المناسبة لتطبيق اللون على الجفن. يمكن استخدام الألوان الفاتحة للإضاءة والداكنة للتحديد.",
                weight: "56 جرام",
                ingredients: "تالك، ميكا، بيجمنت، سيليكا، زيت النخيل",
                featured: false,
                stock: 7,
                inStock: true,
                reviews: []
            },
            {
                id: 12,
                name: "صابون الاستحمام بزيت الزيتون من نفرتاري 300 جم نيفيرتاري",
                brand: "نفرتاري",
                category: "cat5",
                price: 185,
                oldPrice: 250,
                image: "images/products/photo_2025-05-28_22-48-13.jpg",
                description: "صابون طبيعي 100% مصنوع من زيت الزيتون البكر. ينظف البشرة بلطف ويرطبها ويحافظ على توازنها الطبيعي. مناسب لجميع أنواع البشرة.",
                features: [
                    "صابون الاستحمام السادة بزيت الزيتون. وصفة مدينة قشتالي التقليدية.",
                    "لطيف بشكل ملحوظ كما انه ناعم ويتميز بتكوين سريع للرغاوي علي شكل فقاعات.",
                    "ينظف ويرطب البشرة",
                    "خالي من المواد الكيميائية الضارة",
                    "مناسب للبشرة الحساسة"
                ],
                usage: "يستخدم يومياً لتنظيف الوجه والجسم. يدلك على البشرة المبللة ثم يشطف جيداً بالماء.",
                weight: "100 جرام",
                ingredients: "زيت زيتون بكر، ماء، هيدروكسيد الصوديوم، زيت جوز الهند، زيت النخيل",
                featured: false,
                stock: 25,
                inStock: true,
                reviews: []
            },
            {
                id: 13,
                name: "عطر للنساء بلاك اوركيد من توم فورد، او دو برفان، 100 مل",
                brand: "توم فورد",
                category: "cat4",
                price: 7400,
                oldPrice: 8000,
                image: "images/products/photo_2025-05-28_22-51-23.jpg",
                description: "عطر فاخر بتركيبة شرقية زهرية غنية ومعقدة. يتميز بمزيج من الأوركيد الأسود والتوابل والفواكه مع قاعدة من خشب الصندل والباتشولي.",
                features: [
                    "تركيبة فاخرة ومعقدة",
                    "رائحة شرقية زهرية غنية",
                    "يدوم أكثر من 12 ساعة",
                    "زجاجة أنيقة وفاخرة",
                    "مناسب للمناسبات المسائية"
                ],
                usage: "يرش على مناطق النبض مثل المعصمين وخلف الأذنين وعلى الرقبة للحصول على أفضل النتائج.",
                weight: "50 مل",
                ingredients: "كحول، ماء، زيوت عطرية، أوركيد أسود، ياسمين، توت أسود، باتشولي، خشب الصندل، فانيليا",
                featured: false,
                stock: 4,
                inStock: true,
                reviews: []
            },
            {
                id: 14,
                name: "جل استحمام بالفانيليا ويف من سول اند مور، 500 مل",
                brand: "سول اند مور",
                category: "cat5",
                price: 195,
                oldPrice: 250,
                image: "images/products/photo_2025-05-28_22-56-01.jpg",
                description: "جل استحمام منعش برائحة بالفانيليا المهدئة. ينظف البشرة بلطف ويرطبها ويترك شعوراً بالانتعاش والاسترخاء.",
                features: [
                    "برائحة بالفانيليا المهدئة",
                    "ينظف ويرطب البشرة",
                    "يهدئ التوتر ويساعد على الاسترخاء",
                    "خالي من السلفات والبارابين",
                    "مناسب للاستخدام اليومي"
                ],
                usage: "يوضع كمية مناسبة على ليفة استحمام مبللة أو مباشرة على البشرة المبللة، يدلك لتكوين رغوة ثم يشطف جيداً.",
                weight: "250 مل",
                ingredients: "ماء، جليسرين، صوديوم كوكو سلفات، زيت اللافندر، ألوفيرا، بانثينول",
                featured: false,
                stock: 18,
                inStock: true,
                reviews: []
            },
            {
                id: 15,
                name: "مزيل مكياج بالكولاجين من ايفا للعيون والشفاه",
                brand: "ايفا",
                category: "cat1",
                price: 200,
                oldPrice: 300,
                image: "images/products/photo_2025-05-28_22-57-53.jpg",
                description: "مزيل مكياج لطيف للعيون والوجه. يزيل المكياج بفعالية بما في ذلك المكياج المقاوم للماء دون الحاجة للفرك أو الشطف.",
                features: [
                    "يزيل المكياج المقاوم للماء",
                    "لطيف على البشرة والعيون",
                    "لا يحتاج إلى شطف",
                    "خالي من العطور والكحول",
                    "مناسب للبشرة الحساسة"
                ],
                usage: "ضعي كمية مناسبة على قطنة واضغطي برفق على العين لبضع ثوان ثم امسحي برفق. كرري حتى تصبح القطنة نظيفة.",
                weight: "250 مل",
                ingredients: "ماء، هكسيلين جلايكول، سيتيث-20، بوليأمينوبروبيل بيجوانيد",
                featured: false,
                stock: 14,
                inStock: true,
                reviews: []
            },
            {
                id: 16,
                name: "Joviality مقوي الأظافر من",
                brand: "Joviality",
                category: "cat6",
                price: 200,
                oldPrice: 235,
                image: "images/products/photo_2025-05-28_23-00-17.jpg",
                description: "مقوي أظافر علاجي يعالج الأظافر الضعيفة والمتقصفة. يحتوي على الكالسيوم والبروتين لتقوية الأظافر وحمايتها من التكسر.",
                features: [
                    "يقوي الأظافر الضعيفة",
                    "يمنع تقصف وتكسر الأظافر",
                    "يحتوي على الكالسيوم والبروتين",
                    "يستخدم كطبقة أساس تحت طلاء الأظافر",
                    "نتائج ملحوظة خلال أسبوعين"
                ],
                usage: "ضعي طبقة واحدة على الأظافر النظيفة يومياً لمدة أسبوع، ثم أزيليها وكرري العملية. يمكن استخدامه كطبقة أساس تحت طلاء الأظافر.",
                weight: "15 مل",
                ingredients: "بوتيل أسيتات، إيثيل أسيتات، نيتروسيليلوز، كالسيوم، بروتين القمح، فيتامين E",
                featured: false,
                stock: 10,
                inStock: true,
                reviews: []
            },
            {
                id: 17,
                name: "طقم اسفنجة مكياج بيوتى بلندر داخل برطمان شفاف هدية - 6 قطع",
                brand: "بيوتي بلندر",
                category: "cat7",
                price: 80,
                oldPrice: 100,
                image: "images/products/photo_2025-05-28_23-01-39.jpg",
                description: "إسفنجة مكياج احترافية على شكل قطرة لتطبيق كريم الأساس والكونسيلر بشكل متساوٍ. تمنح تغطية مثالية بدون خطوط.",
                features: [
                    "تكبر حجمها عند البلل",
                    "ناعمة وخالية من اللاتكس",
                    "تطبيق متساوٍ للمكياج",
                    "سهلة التنظيف وإعادة الاستخدام",
                    "مناسبة لجميع أنواع المكياج السائل والكريمي"
                ],
                usage: "بللي الإسفنجة بالماء واعصريها جيداً، ثم استخدميها بحركات نقر لتطبيق المكياج. تغسل بعد كل استخدام بصابون لطيف.",
                weight: "20 جرام",
                ingredients: "إسفنج هيدروفيليك خالي من اللاتكس",
                featured: false,
                stock: 20,
                inStock: true,
                reviews: []
            },
            {
                id: 18,
                name: "زيت شفاه مغذٍ لامع من الجوجوبا والأفوكادو وجوز الهند ايفون مع فيتامين اي ومعامل الحماية الشمس 12 7 مل",
                brand: "كلينيك",
                category: "cat1",
                price: 205,
                oldPrice: 240,
                image: "images/products/photo_2025-05-28_23-03-20.jpg",
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
                name: "قناع تقوية الشعر بزيت الأرجان الذهبي من مجموعة هير كلينك من ايفا - 200 مل",
                brand: "ايفا",
                category: "cat3",
                price: 140,
                oldPrice: 180,
                image: "images/products/photo_2025-05-28_23-04-08.jpg",
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
        localStorage.setItem("products", JSON.stringify(initialProducts));
        console.log("Initialized products in localStorage");
    }

    // Initialize categories if not already in localStorage
    if (!localStorage.getItem("categories")) {
        const initialCategories = [
            { id: "cat1", name: "العناية بالبشرة", description: "منتجات العناية بالوجه والجسم", image: "images/categories/skin_care_category .jpg", featured: true },
            { id: "cat2", name: "المكياج", description: "منتجات المكياج والتجميل", image: "images/categories/makeup_category.jpg", featured: true },
            { id: "cat3", name: "العناية بالشعر", description: "شامبو وبلسم ومنتجات تصفيف الشعر", image: "images/categories/haircare_category.jpg", featured: false },
            { id: "cat4", name: "العطور", description: "عطور نسائية ورجالية فاخرة ومميزة", image: "images/categories/perfumes_category.jpg", featured: true },
            { id: "cat5", name: "مستلزمات الاستحمام", description: "صابون وجل استحمام ومنتجات العناية بالجسم", image: "images/categories/bath_essentials_category.jpg", featured: false },
            { id: "cat6", name: "منتجات الأظافر", description: "طلاء أظافر ومستلزمات العناية بالأظافر", image: "images/categories/nail_products_category.jpg", featured: true },
            { id: "cat7", name: "أدوات التجميل", description: "فرش مكياج وإسفنج وأدوات تطبيق مستحضرات التجميل", image: "images/categories/beauty_tools_category.jpg", featured: true }
        ];
        localStorage.setItem("categories", JSON.stringify(initialCategories));
        console.log("Initialized categories in localStorage");
    }
}

// Load categories on homepage
function loadHomepageCategories() {
    const categoriesContainer = document.getElementById("homepage-categories-container");
    if (!categoriesContainer) return;

    // Get categories from localStorage
    const categories = JSON.parse(localStorage.getItem("categories")) || [];
    
    // Filter featured categories
    const featuredCategories = categories.filter(category => category.featured);
    
    // Check if we have categories to display
    if (featuredCategories.length === 0) {
        categoriesContainer.innerHTML = `
            <div class="col-12 text-center my-5">
                <h3>لا توجد فئات متاحة حالياً</h3>
                <p>يرجى زيارة الموقع لاحقاً</p>
            </div>
        `;
        return;
    }

    // Clear container
    categoriesContainer.innerHTML = "";

    // Display all featured categories using Swiper
    featuredCategories.forEach(category => { // <-- Iterate over all featured categories
        const categorySlide = document.createElement("div");
        categorySlide.className = "swiper-slide"; // <-- Correct class for Swiper
        categorySlide.innerHTML = `
            <div class="card h-100 category-card">
                <img src="${category.image || 'images/category-placeholder.jpg'}" class="card-img-top category-img" alt="${category.name}">
                <div class="card-body d-flex flex-column">
                    <h3 class="card-title">${category.name}</h3>
                    <p class="card-text">${category.description}</p>
                    <a href="products.html?category=${category.id}" class="btn btn-primary mt-auto">تسوق الآن</a>
                </div>
            </div>
        `;

        categoriesContainer.appendChild(categorySlide); // Append to the swiper-wrapper
    });

    // Initialize Swiper for categories if more than 2
    if (featuredCategories.length > 2) {
        const categoriesSwiper = new Swiper('.categories-swiper', {
            slidesPerView: 1,
            spaceBetween: 20,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: { // Add navigation arrows
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                768: { // Medium devices (tablets, 768px and up)
                    slidesPerView: 3, // Show 3 slides
                    spaceBetween: 30,
                },
                992: { // Large devices (desktops, 992px and up)
                    slidesPerView: 4, // Show 4 slides
                    spaceBetween: 30,
                }
            }
        });
        console.log("Categories Swiper initialized.");
    }
}

// Load featured products on homepage
function loadFeaturedProducts() {
    const featuredProductsContainer = document.getElementById("featured-products-container");
    if (!featuredProductsContainer) return;

    // Get products from localStorage
    const products = JSON.parse(localStorage.getItem("products")) || [];
    
    // Filter featured products
    const featuredProducts = products.filter(product => product.featured);
    
    // Check if we have products to display
    if (featuredProducts.length === 0) {
        console.log("No featured products found. Hiding section.");
        document.querySelector(".featured-products-section")?.classList.add("d-none");
        return;
    } else {
        document.querySelector(".featured-products-section")?.classList.remove("d-none");
    }

    // Clear container
    featuredProductsContainer.innerHTML = "";

    // Load categories to get names
    const categories = JSON.parse(localStorage.getItem("categories")) || [];

    // Display featured products
    featuredProducts.forEach(product => {
        // Find category name
        const category = categories.find(cat => cat.id === product.category);
        const categoryName = category ? category.name : 'غير مصنف'; // Default if category not found

        const productSlide = document.createElement("div");
        productSlide.className = "swiper-slide";
        
        // Calculate discount percentage if there's an old price
        const discountBadge = product.oldPrice && product.oldPrice > product.price ? 
            `<span class="badge bg-danger position-absolute top-0 end-0 m-2">خصم ${Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%</span>` : "";

        // Prepare old price display
        const oldPriceDisplay = product.oldPrice ?
            `<del class="text-muted ms-2">${product.oldPrice} <span class="price-currency"></span></del>` : `<del class="text-muted ms-2">-</del>`; // Added currency span
        
        productSlide.innerHTML = `
            <div class="card h-100 product-card position-relative">
                ${discountBadge}
                <img src="${product.image}" class="card-img-top product-img" alt="${product.name}">
                <div class="card-body d-flex flex-column">
                    <!-- Badges Container -->
                    <div class="product-badges">
                        <span class="badge category-badge">${categoryName}</span>
                        <span class="badge brand-badge">${product.brand}</span>
                    </div>
                    <h5 class="card-title text-center">${product.name}</h5> <!-- Centered title -->
                    <div class="text-center mb-3"> <!-- Centered price block -->
                        <span class="price">${product.price} <span class="price-currency"></span></span>
                        ${oldPriceDisplay}
                    </div>
                    <div class="d-flex justify-content-between mt-auto">
                        <a href="product-detail.html?id=${product.id}" class="btn btn-outline-primary">التفاصيل</a>
                        <button class="btn btn-primary add-to-cart-btn" data-id="${product.id}">
                            <i class="fas fa-shopping-cart"></i> إضافة للسلة
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        featuredProductsContainer.appendChild(productSlide);
    });

    // Initialize Swiper for featured products
    const featuredProductsSwiper = new Swiper('.featured-products-swiper', {
        slidesPerView: 1,
        spaceBetween: 20,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            576: {
                slidesPerView: 2,
                spaceBetween: 20,
            },
            992: {
                slidesPerView: 3,
                spaceBetween: 30,
            },
            1200: {
                slidesPerView: 4,
                spaceBetween: 30,
            }
        }
    });
    
    // Add event listeners for "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            if (productId && window.addToCart) {
                window.addToCart(productId);
            } else {
                console.error('Error: Product ID not found or addToCart function not available');
            }
        });
    });
}
