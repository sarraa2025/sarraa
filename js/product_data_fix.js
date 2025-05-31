// product_data_fix.js
// هذا الملف يقوم بتصحيح روابط الصور المكسورة في بيانات المنتجات
// يجب تشغيله مرة واحدة لإصلاح البيانات

(function() {
  // الحصول على بيانات المنتجات الحالية
  const products = JSON.parse(localStorage.getItem("products")) || [];
  
  // قائمة بأسماء الصور المفقودة التي تحتاج إلى استبدال
  const missingImages = [
    "images/products/brands/beautyblender.jpg",
    "images/products/brands/clinique_lipbalm.jpg",
    "images/products/brands/morphe_palette.jpg",
    "images/products/brands/lavender_shower.jpg",
    "images/products/brands/moroccanoil.jpg",
    "images/products/brands/olive_soap.jpg"
  ];
  
  // تحديث روابط الصور المكسورة
  let updatedCount = 0;
  products.forEach(product => {
    if (missingImages.includes(product.image)) {
      product.image = "images/product-placeholder.jpg";
      updatedCount++;
    }
  });
  
  // حفظ البيانات المحدثة
  localStorage.setItem("products", JSON.stringify(products));
  
  console.log(`تم تصحيح ${updatedCount} من روابط الصور المكسورة في بيانات المنتجات`);
})();
