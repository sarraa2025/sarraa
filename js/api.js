// api.js - External API integration for Sarraa e-commerce platform

/**
 * API integration module for Sarraa e-commerce platform
 * Handles fetching products from external APIs and integrating them into the platform
 */

// FakeStore API integration
const fakeStoreAPI = {
    baseUrl: 'https://fakestoreapi.com',
    
    // Get all products from FakeStore API
    async getAllProducts() {
        try {
            const response = await fetch(`${this.baseUrl}/products`);
            const data = await response.json();
            return {
                success: true,
                data
            };
        } catch (error) {
            console.error('Error fetching products from FakeStore API:', error);
            return {
                success: false,
                error: error.message
            };
        }
    },
    
    // Get product by ID from FakeStore API
    async getProductById(id) {
        try {
            const response = await fetch(`${this.baseUrl}/products/${id}`);
            const data = await response.json();
            return {
                success: true,
                data
            };
        } catch (error) {
            console.error(`Error fetching product ${id} from FakeStore API:`, error);
            return {
                success: false,
                error: error.message
            };
        }
    },
    
    // Get products by category from FakeStore API
    async getProductsByCategory(category) {
        try {
            const response = await fetch(`${this.baseUrl}/products/category/${category}`);
            const data = await response.json();
            return {
                success: true,
                data
            };
        } catch (error) {
            console.error(`Error fetching products in category ${category} from FakeStore API:`, error);
            return {
                success: false,
                error: error.message
            };
        }
    },
    
    // Get all categories from FakeStore API
    async getAllCategories() {
        try {
            const response = await fetch(`${this.baseUrl}/products/categories`);
            const data = await response.json();
            return {
                success: true,
                data
            };
        } catch (error) {
            console.error('Error fetching categories from FakeStore API:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
};

// Import products from FakeStore API
async function importProductsFromFakeStoreAPI() {
    try {
        // Get products from FakeStore API
        const result = await fakeStoreAPI.getAllProducts();
        
        if (!result.success) {
            return {
                success: false,
                message: 'فشل في استيراد المنتجات من FakeStore API',
                error: result.error
            };
        }
        
        const apiProducts = result.data;
        
        // Transform API products to match our format
        const transformedProducts = apiProducts.map(product => {
            // Filter out products related to prohibited categories
            if (product.category.includes('women') || 
                product.title.toLowerCase().includes('women') ||
                product.description.toLowerCase().includes('women')) {
                return null;
            }
            
            // Map categories
            let category = 'accessories';
            if (product.category.includes('clothing')) {
                category = 'accessories';
            } else if (product.category.includes('jewelery')) {
                category = 'accessories';
            } else if (product.category.includes('electronics')) {
                category = 'accessories';
            }
            
            return {
                id: 'api-' + product.id,
                name: product.title,
                description: product.description,
                price: Math.round(product.price * 30), // Convert to EGP
                oldPrice: null,
                category: category,
                brand: 'عالمية',
                image: product.image,
                rating: product.rating.rate,
                reviewCount: product.rating.count,
                stock: Math.floor(Math.random() * 20) + 5,
                featured: product.rating.rate > 4.5,
                createdAt: new Date().toISOString()
            };
        }).filter(product => product !== null);
        
        // Get existing products
        const existingProducts = JSON.parse(localStorage.getItem('sarraa_products')) || [];
        
        // Merge products (avoid duplicates)
        const apiProductIds = transformedProducts.map(p => p.id);
        const filteredExistingProducts = existingProducts.filter(p => !p.id.startsWith('api-'));
        
        // Combine products
        const combinedProducts = [...filteredExistingProducts, ...transformedProducts];
        
        // Save updated products
        localStorage.setItem('sarraa_products', JSON.stringify(combinedProducts));
        
        return {
            success: true,
            message: 'تم استيراد المنتجات بنجاح',
            count: transformedProducts.length
        };
    } catch (error) {
        console.error('Error importing products from FakeStore API:', error);
        return {
            success: false,
            message: 'حدث خطأ أثناء استيراد المنتجات',
            error: error.message
        };
    }
}

// Event listeners for API functionality
document.addEventListener('DOMContentLoaded', function() {
    // Import products button
    const importButton = document.getElementById('import-products');
    if (importButton) {
        importButton.addEventListener('click', async function() {
            // Show loading state
            this.disabled = true;
            this.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> جاري الاستيراد...';
            
            // Import products
            const result = await importProductsFromFakeStoreAPI();
            
            // Reset button state
            this.disabled = false;
            this.innerHTML = 'استيراد المنتجات من API';
            
            // Show result
            if (result.success) {
                alert(`${result.message} (${result.count} منتج)`);
                window.location.reload();
            } else {
                alert(`فشل الاستيراد: ${result.message}`);
            }
        });
    }
});

// Export functions for use in other modules
window.apiModule = {
    fakeStoreAPI,
    importProductsFromFakeStoreAPI
};
