// image_fix.js
// هذا الملف يقوم بإصلاح مشكلة الصور المفقودة بشكل نهائي

document.addEventListener("DOMContentLoaded", function() {
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
    
    // إصلاح الصور المفقودة في localStorage
    fixProductImages();
    
    // إصلاح الصور المفقودة في الصفحة مباشرة
    fixPageImages();
    
    // وظيفة لإصلاح الصور في localStorage
    function fixProductImages() {
        // الحصول على المنتجات من localStorage
        const products = JSON.parse(localStorage.getItem("products")) || [];
        let hasChanges = false;
        
        // تحديث روابط الصور المكسورة
        products.forEach(product => {
            if (missingImages.includes(product.image)) {
                product.image = placeholderImage;
                hasChanges = true;
            }
        });
        
        // حفظ المنتجات المحدثة في localStorage إذا كان هناك تغييرات
        if (hasChanges) {
            localStorage.setItem("products", JSON.stringify(products));
            console.log("تم إصلاح روابط الصور المفقودة في بيانات المنتجات");
        }
    }
    
    // وظيفة لإصلاح الصور في الصفحة مباشرة
    function fixPageImages() {
        // البحث عن جميع عناصر الصور في الصفحة
        const images = document.querySelectorAll('img');
        
        // فحص كل صورة وتغيير مصدرها إذا كان مفقوداً
        images.forEach(img => {
            const src = img.getAttribute('src');
            if (src && missingImages.some(missing => src.includes(missing))) {
                img.setAttribute('src', placeholderImage);
                console.log(`تم استبدال الصورة المفقودة: ${src}`);
            }
            
            // إضافة معالج أخطاء للصور
            img.onerror = function() {
                if (this.src !== placeholderImage) {
                    console.log(`تم استبدال صورة غير موجودة: ${this.src}`);
                    this.src = placeholderImage;
                }
            };
        });
    }
});

// إضافة معالج أخطاء عام للصور
window.addEventListener('error', function(e) {
    // التحقق مما إذا كان الخطأ متعلقاً بتحميل صورة
    if (e.target.tagName === 'IMG') {
        console.log(`تم استبدال صورة غير موجودة من خلال معالج الأخطاء العام: ${e.target.src}`);
        e.target.src = 'images/product-placeholder.jpg';
        e.preventDefault(); // منع ظهور الخطأ في وحدة التحكم
    }
}, true);

console.log("تم تحميل ملف إصلاح الصور");
