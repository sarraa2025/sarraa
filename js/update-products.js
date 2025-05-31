// Update product data with new brand images
document.addEventListener('DOMContentLoaded', function() {
    // Update products with new brand images if not already updated
    const products = JSON.parse(localStorage.getItem('products')) || [];
    let updated = false;
    
    // Check if products need updating (if first product doesn't have updated image path)
    if (products.length > 0 && !products[0].image.includes('brands/')) {
        // Update product images and ensure brand information is correct
        const updatedProducts = [
            {
                id: 1,
                name: 'كريم مرطب للبشرة الجافة',
                brand: 'سرَّاء',
                category: 'العناية بالبشرة',
                price: 120,
                oldPrice: 150,
                description: 'كريم مرطب غني بالمكونات الطبيعية المغذية للبشرة الجافة. يعمل على ترطيب البشرة بعمق وحمايتها من الجفاف طوال اليوم.',
                features: ['ترطيب عميق يدوم طوال اليوم', 'مكونات طبيعية 100%', 'خالي من البارابين والكحول', 'مناسب لجميع أنواع البشرة', 'تركيبة غير دهنية'],
                image: 'images/products/brands/sarraa_moisturizer.jpg',
                rating: 4.5,
                reviews: 24,
                inStock: true,
                isPopular: true
            },
            {
                id: 2,
                name: 'سيروم فيتامين سي للوجه',
                brand: 'لوريال',
                category: 'العناية بالبشرة',
                price: 180,
                oldPrice: 220,
                description: 'سيروم مركز بفيتامين سي النقي لتفتيح البشرة وتوحيد لونها وإشراقها. يساعد على تقليل التصبغات وآثار حب الشباب.',
                features: ['تركيز عالي من فيتامين سي النقي', 'يفتح البشرة ويوحد لونها', 'يقلل التصبغات وآثار حب الشباب', 'يحمي البشرة من الجذور الحرة', 'نتائج ملحوظة خلال أسبوعين'],
                image: 'images/products/brands/loreal_serum.jpg',
                rating: 4.7,
                reviews: 36,
                inStock: true,
                isPopular: true
            },
            {
                id: 3,
                name: 'شامبو للشعر الجاف',
                brand: 'نيفيا',
                category: 'العناية بالشعر',
                price: 90,
                oldPrice: 110,
                description: 'شامبو مغذي للشعر الجاف والتالف، يعمل على ترطيب الشعر وإصلاح التلف وحمايته من التقصف.',
                features: ['يغذي الشعر الجاف والتالف', 'يرطب الشعر من الجذور للأطراف', 'يصلح الشعر التالف', 'يحمي من التقصف', 'يمنح الشعر لمعاناً طبيعياً'],
                image: 'images/products/brands/nivea_shampoo.jpg',
                rating: 4.3,
                reviews: 18,
                inStock: true,
                isPopular: false
            },
            {
                id: 4,
                name: 'أحمر شفاه كريمي طويل الأمد',
                brand: 'إيفا',
                category: 'المكياج',
                price: 75,
                oldPrice: 95,
                description: 'أحمر شفاه كريمي بتركيبة مرطبة وألوان نابضة بالحياة تدوم طويلاً. يمنح الشفاه لوناً غنياً وملمساً ناعماً دون جفاف.',
                features: ['تركيبة كريمية مرطبة', 'ألوان نابضة بالحياة', 'يدوم حتى 8 ساعات', 'غني بالفيتامينات المغذية للشفاه', 'خالي من المكونات الضارة'],
                image: 'images/products/brands/eva_lipstick.jpg',
                rating: 4.6,
                reviews: 42,
                inStock: true,
                isPopular: true
            },
            {
                id: 5,
                name: 'ماسكارا لتطويل وتكثيف الرموش',
                brand: 'مايبيلين',
                category: 'المكياج',
                price: 110,
                oldPrice: 140,
                description: 'ماسكارا بتركيبة فريدة تعمل على تطويل وتكثيف الرموش بشكل مذهل. تمنح رموشاً كثيفة وطويلة بلمسة واحدة دون تكتل.',
                features: ['تطويل وتكثيف الرموش', 'فرشاة مصممة لفصل الرموش', 'تركيبة مقاومة للماء', 'سهلة الإزالة', 'لا تسبب تهيج العين'],
                image: 'images/products/brands/maybelline_mascara.jpg',
                rating: 4.8,
                reviews: 56,
                inStock: true,
                isPopular: true
            }
        ];
        
        // Add more products if needed to maintain existing count
        if (products.length > updatedProducts.length) {
            const existingIds = updatedProducts.map(p => p.id);
            const additionalProducts = products
                .filter(p => !existingIds.includes(p.id))
                .map(p => {
                    // Use placeholder image if no specific brand image
                    return {
                        ...p,
                        image: 'images/product-placeholder.jpg'
                    };
                });
            
            updatedProducts.push(...additionalProducts);
        }
        
        // Save updated products to localStorage
        localStorage.setItem('products', JSON.stringify(updatedProducts));
        updated = true;
        
        console.log('Product data updated with new brand images');
    }
    
    // Reload products if they were updated
    if (updated && document.getElementById('productsContainer')) {
        loadProducts();
    }
});
