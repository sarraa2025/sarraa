// admin-products.js - Admin dashboard product management functionality

document.addEventListener("DOMContentLoaded", function() {
    // Check if user is admin
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser || !currentUser.isAdmin) {
        window.location.href = "index.html";
        return;
    }

    // Load categories into modals first
    loadCategoriesIntoModals();

    // Load products in admin dashboard
    loadAdminProducts();

    // Set default stock value to 1 in add product modal
    const stockInput = document.getElementById("product-stock");
    if (stockInput) {
        stockInput.value = "1"; // Set default value to 1
        stockInput.placeholder = "1"; // Also set placeholder to 1
    }

    // Add event listener for save product button in Add modal
    const saveProductBtn = document.getElementById("save-product");
    if (saveProductBtn) {
        saveProductBtn.addEventListener("click", handleAddProduct);
    }

    // Add event listener for update product button in Edit modal
    const updateProductBtn = document.getElementById("update-product");
    if (updateProductBtn) {
        updateProductBtn.addEventListener("click", handleUpdateProduct);
    }

    // Add event listener for import products button
    const importProductsBtn = document.getElementById("import-products");
    if (importProductsBtn) {
        importProductsBtn.addEventListener("click", importProductsFromAPI);
    }

    // Add event listener for filter/sort button
    const applyFiltersBtn = document.getElementById("apply-filters");
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener("click", () => loadAdminProducts());
    }
    
    // Add event listener for search input (real-time filtering)
    const searchInput = document.getElementById("search-product");
    if (searchInput) {
        searchInput.addEventListener("input", () => loadAdminProducts());
    }

    // Add event listeners for category filter and sort dropdowns (trigger reload on change)
    const categoryFilter = document.getElementById("filter-category");
    const sortDropdown = document.getElementById("sort-products");
    if (categoryFilter) {
        categoryFilter.addEventListener("change", () => loadAdminProducts());
    }
    if (sortDropdown) {
        sortDropdown.addEventListener("change", () => loadAdminProducts());
    }
});

// Load categories into Add/Edit Product modals
function loadCategoriesIntoModals() {
    const categories = JSON.parse(localStorage.getItem("categories")) || [];
    const addCategorySelect = document.getElementById("product-category");
    const editCategorySelect = document.getElementById("edit-product-category");
    const filterCategorySelect = document.getElementById("filter-category");

    if (addCategorySelect) {
        addCategorySelect.innerHTML = ".<option value=\"\">اختر الفئة...</option>"; // Default option
        categories.forEach(cat => {
            addCategorySelect.innerHTML += `<option value="${cat.id}">${cat.name}</option>`;
        });
    }
    if (editCategorySelect) {
        editCategorySelect.innerHTML = ".<option value=\"\">اختر الفئة...</option>"; // Default option
        categories.forEach(cat => {
            editCategorySelect.innerHTML += `<option value="${cat.id}">${cat.name}</option>`;
        });
    }
    if (filterCategorySelect) {
        // Keep the "All Categories" option
        categories.forEach(cat => {
            filterCategorySelect.innerHTML += `<option value="${cat.id}">${cat.name}</option>`;
        });
    }
}

// Global variables for pagination
let currentPage = 1;
const itemsPerPage = 10; // Show 10 products per page
let filteredProducts = []; // Store filtered products globally

// Load products in admin dashboard with filtering, sorting, and pagination
function loadAdminProducts(page = 1) {
    const productsList = document.getElementById("products-list");
    if (!productsList) return;

    // Update current page
    currentPage = page;

    let products = JSON.parse(localStorage.getItem("products")) || [];
    const categories = JSON.parse(localStorage.getItem("categories")) || [];
    const categoryMap = categories.reduce((map, cat) => {
        map[cat.id] = cat.name;
        return map;
    }, {});

    // --- Filtering ---
    const searchTerm = document.getElementById("search-product").value.toLowerCase();
    const selectedCategory = document.getElementById("filter-category").value;

    if (searchTerm) {
        products = products.filter(p => p.name.toLowerCase().includes(searchTerm));
    }
    if (selectedCategory) {
        products = products.filter(p => p.category === selectedCategory);
    }

    // --- Sorting ---
    const sortValue = document.getElementById("sort-products").value;
    switch (sortValue) {
        case "name-asc":
            products.sort((a, b) => a.name.localeCompare(b.name, "ar"));
            break;
        case "name-desc":
            products.sort((a, b) => b.name.localeCompare(a.name, "ar"));
            break;
        case "price-asc":
            products.sort((a, b) => a.price - b.price);
            break;
        case "price-desc":
            products.sort((a, b) => b.price - a.price);
            break;
        case "stock-asc":
            products.sort((a, b) => (a.stock || 0) - (b.stock || 0));
            break;
        case "stock-desc":
            products.sort((a, b) => (b.stock || 0) - (a.stock || 0));
            break;
    }

    // Store filtered products globally for pagination
    filteredProducts = [...products];

    // --- Pagination ---
    const totalItems = products.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    // Adjust current page if it's out of bounds
    if (currentPage < 1) currentPage = 1;
    if (currentPage > totalPages && totalPages > 0) currentPage = totalPages;
    
    // Get products for current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProducts = products.slice(startIndex, endIndex);

    // Clear existing list
    productsList.innerHTML = "";
    
    // Display products for current page
    if (paginatedProducts.length === 0) {
        const emptyRow = document.createElement("tr");
        emptyRow.innerHTML = `
            <td colspan="6" class="text-center py-4">
                <p class="mb-0">لا توجد منتجات متاحة</p>
            </td>
        `;
        productsList.appendChild(emptyRow);
    } else {
        paginatedProducts.forEach(product => {
            const row = document.createElement("tr");
            const categoryName = categoryMap[product.category] || product.category; // Fallback to ID if name not found
            
            row.innerHTML = `
                <td><img src="${product.image || "images/product-placeholder.jpg"}" alt="${product.name}" class="product-thumbnail"></td>
                <td>${product.name}</td>
                <td>${categoryName}</td>
                <td>${product.price} ج.م</td>
                <td>${product.stock !== undefined ? product.stock : "1"}</td>
                <td>
                    <button class="btn btn-sm btn-primary edit-product" data-id="${product.id}" data-bs-toggle="modal" data-bs-target="#editProductModal">
                        <i class="fas fa-edit"></i> تعديل
                    </button>
                    <button class="btn btn-sm btn-danger delete-product" data-id="${product.id}">
                        <i class="fas fa-trash"></i> حذف
                    </button>
                </td>
            `;
            
            productsList.appendChild(row);
        });
    }
    
    // Add event listeners for edit and delete buttons after rendering
    attachProductActionListeners();
    
    // Update pagination UI
    updatePagination(totalPages);
}

// Update pagination UI
function updatePagination(totalPages) {
    const paginationContainer = document.querySelector('.pagination');
    if (!paginationContainer) return;
    
    paginationContainer.innerHTML = '';
    
    // Previous button
    const prevLi = document.createElement('li');
    prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
    prevLi.innerHTML = `<a class="page-link" href="#" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a>`;
    if (currentPage > 1) {
        prevLi.querySelector('a').addEventListener('click', (e) => {
            e.preventDefault();
            loadAdminProducts(currentPage - 1);
        });
    }
    paginationContainer.appendChild(prevLi);
    
    // Page numbers
    const maxVisiblePages = 5; // Maximum number of page links to show
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust start page if end page is at maximum
    if (endPage === totalPages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    // First page link if not visible
    if (startPage > 1) {
        const firstLi = document.createElement('li');
        firstLi.className = 'page-item';
        firstLi.innerHTML = `<a class="page-link" href="#">1</a>`;
        firstLi.querySelector('a').addEventListener('click', (e) => {
            e.preventDefault();
            loadAdminProducts(1);
        });
        paginationContainer.appendChild(firstLi);
        
        // Ellipsis if needed
        if (startPage > 2) {
            const ellipsisLi = document.createElement('li');
            ellipsisLi.className = 'page-item disabled';
            ellipsisLi.innerHTML = `<a class="page-link" href="#">...</a>`;
            paginationContainer.appendChild(ellipsisLi);
        }
    }
    
    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
        const pageLi = document.createElement('li');
        pageLi.className = `page-item ${i === currentPage ? 'active' : ''}`;
        pageLi.innerHTML = `<a class="page-link" href="#">${i}</a>`;
        if (i !== currentPage) {
            pageLi.querySelector('a').addEventListener('click', (e) => {
                e.preventDefault();
                loadAdminProducts(i);
            });
        }
        paginationContainer.appendChild(pageLi);
    }
    
    // Ellipsis and last page if needed
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            const ellipsisLi = document.createElement('li');
            ellipsisLi.className = 'page-item disabled';
            ellipsisLi.innerHTML = `<a class="page-link" href="#">...</a>`;
            paginationContainer.appendChild(ellipsisLi);
        }
        
        const lastLi = document.createElement('li');
        lastLi.className = 'page-item';
        lastLi.innerHTML = `<a class="page-link" href="#">${totalPages}</a>`;
        lastLi.querySelector('a').addEventListener('click', (e) => {
            e.preventDefault();
            loadAdminProducts(totalPages);
        });
        paginationContainer.appendChild(lastLi);
    }
    
    // Next button
    const nextLi = document.createElement('li');
    nextLi.className = `page-item ${currentPage === totalPages || totalPages === 0 ? 'disabled' : ''}`;
    nextLi.innerHTML = `<a class="page-link" href="#" aria-label="Next"><span aria-hidden="true">&raquo;</span></a>`;
    if (currentPage < totalPages) {
        nextLi.querySelector('a').addEventListener('click', (e) => {
            e.preventDefault();
            loadAdminProducts(currentPage + 1);
        });
    }
    paginationContainer.appendChild(nextLi);
}

// Attach event listeners for edit and delete buttons
function attachProductActionListeners() {
    const editButtons = document.querySelectorAll(".edit-product");
    const deleteButtons = document.querySelectorAll(".delete-product");
    
    editButtons.forEach(button => {
        button.addEventListener("click", function() {
            const productId = parseInt(this.getAttribute("data-id"));
            populateEditProductModal(productId);
        });
    });
    
    deleteButtons.forEach(button => {
        button.addEventListener("click", function() {
            const productId = parseInt(this.getAttribute("data-id"));
            handleDeleteProduct(productId);
        });
    });
}

// Handle add product form submission
function handleAddProduct() {
    const name = document.getElementById("product-name").value.trim();
    const category = document.getElementById("product-category").value;
    const price = parseFloat(document.getElementById("product-price").value);
    const oldPrice = document.getElementById("product-old-price").value ? parseFloat(document.getElementById("product-old-price").value) : null;
    let stock = document.getElementById("product-stock").value ? parseInt(document.getElementById("product-stock").value) : 1; // Default to 1 if empty
    const brand = document.getElementById("product-brand").value.trim();
    const image = document.getElementById("product-image").value.trim();
    const description = document.getElementById("product-description").value.trim();
    const featured = document.getElementById("product-featured").checked;

    if (!name || !category || isNaN(price) || !brand || !description) {
        alert("يرجى ملء جميع الحقول المطلوبة بشكل صحيح.");
        return;
    }

    // Ensure stock is at least 1 if invalid
    if (isNaN(stock) || stock < 0) {
        stock = 1;
    }

    const products = JSON.parse(localStorage.getItem("products")) || [];
    const newProductId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;

    const newProduct = {
        id: newProductId,
        name: name,
        category: category,
        price: price,
        oldPrice: oldPrice,
        stock: stock,
        brand: brand,
        image: image || "images/product-placeholder.jpg", // Default image if none provided
        description: description,
        featured: featured,
        rating: 0, // Default value
        reviews: 0, // Default value
        inStock: stock > 0 // Automatically set based on stock
    };

    products.push(newProduct);
    localStorage.setItem("products", JSON.stringify(products));

    // Trigger storage event for real-time updates on other pages
    window.dispatchEvent(new Event('storage'));

    // Close modal
    const addModal = bootstrap.Modal.getInstance(document.getElementById("addProductModal"));
    addModal.hide();

    // Reset form
    document.getElementById("add-product-form").reset();
    
    // Reset default stock value to 1
    const stockInput = document.getElementById("product-stock");
    if (stockInput) {
        stockInput.value = "1";
    }

    // Reload products list
    loadAdminProducts();

    alert("تمت إضافة المنتج بنجاح.");
}

// Populate edit product modal with data
function populateEditProductModal(productId) {
    const products = JSON.parse(localStorage.getItem("products")) || [];
    const product = products.find(p => p.id === productId);

    if (!product) return;

    document.getElementById("edit-product-id").value = product.id;
    document.getElementById("edit-product-name").value = product.name;
    document.getElementById("edit-product-category").value = product.category;
    document.getElementById("edit-product-price").value = product.price;
    document.getElementById("edit-product-old-price").value = product.oldPrice || "";
    document.getElementById("edit-product-stock").value = product.stock !== undefined ? product.stock : "1"; // Default to 1 if undefined
    document.getElementById("edit-product-brand").value = product.brand;
    document.getElementById("edit-product-image").value = product.image || "";
    document.getElementById("edit-product-description").value = product.description;
    document.getElementById("edit-product-featured").checked = product.featured || false;
}

// Handle update product form submission
function handleUpdateProduct() {
    const productId = parseInt(document.getElementById("edit-product-id").value);
    const name = document.getElementById("edit-product-name").value.trim();
    const category = document.getElementById("edit-product-category").value;
    const price = parseFloat(document.getElementById("edit-product-price").value);
    const oldPrice = document.getElementById("edit-product-old-price").value ? parseFloat(document.getElementById("edit-product-old-price").value) : null;
    let stock = document.getElementById("edit-product-stock").value ? parseInt(document.getElementById("edit-product-stock").value) : 1; // Default to 1 if empty
    const brand = document.getElementById("edit-product-brand").value.trim();
    const image = document.getElementById("edit-product-image").value.trim();
    const description = document.getElementById("edit-product-description").value.trim();
    const featured = document.getElementById("edit-product-featured").checked;

    if (!name || !category || isNaN(price) || !brand || !description) {
        alert("يرجى ملء جميع الحقول المطلوبة بشكل صحيح.");
        return;
    }

    // Ensure stock is at least 1 if invalid
    if (isNaN(stock) || stock < 0) {
        stock = 1;
    }

    let products = JSON.parse(localStorage.getItem("products")) || [];
    const productIndex = products.findIndex(p => p.id === productId);

    if (productIndex === -1) {
        alert("لم يتم العثور على المنتج.");
        return;
    }

    products[productIndex] = {
        ...products[productIndex], // Preserve existing fields like rating, reviews
        name: name,
        category: category,
        price: price,
        oldPrice: oldPrice,
        stock: stock,
        brand: brand,
        image: image || "images/product-placeholder.jpg",
        description: description,
        featured: featured,
        inStock: stock > 0
    };

    localStorage.setItem("products", JSON.stringify(products));
    
    // Trigger storage event for real-time updates on other pages
    window.dispatchEvent(new Event('storage'));

    // Close modal
    const editModal = bootstrap.Modal.getInstance(document.getElementById("editProductModal"));
    editModal.hide();

    // Reload products list
    loadAdminProducts(currentPage); // Stay on current page

    alert("تم تحديث المنتج بنجاح.");
}

// Handle delete product confirmation
function handleDeleteProduct(productId) {
    if (!confirm(`هل أنت متأكد من حذف المنتج رقم ${productId}؟`)) return;

    let products = JSON.parse(localStorage.getItem("products")) || [];
    const updatedProducts = products.filter(p => p.id !== productId);

    localStorage.setItem("products", JSON.stringify(updatedProducts));
    
    // Trigger storage event for real-time updates on other pages
    window.dispatchEvent(new Event('storage'));

    // Reload products list - may need to go to previous page if last item on current page was deleted
    const totalPages = Math.ceil(updatedProducts.length / itemsPerPage);
    if (currentPage > totalPages && totalPages > 0) {
        loadAdminProducts(totalPages);
    } else {
        loadAdminProducts(currentPage);
    }

    alert("تم حذف المنتج بنجاح.");
}

// Function to import products from a dummy API (placeholder)
async function importProductsFromAPI() {
    alert("جاري استيراد المنتجات من API... هذه الميزة قيد التطوير.");
    // Placeholder for API call
    // try {
    //     const response = await fetch("YOUR_API_ENDPOINT");
    //     const apiProducts = await response.json();
    //     let currentProducts = JSON.parse(localStorage.getItem("products")) || [];
    //     // Logic to merge or replace products
    //     localStorage.setItem("products", JSON.stringify(mergedProducts));
    //     loadAdminProducts();
    //     alert("تم استيراد المنتجات بنجاح.");
    // } catch (error) {
    //     console.error("Error importing products:", error);
    //     alert("حدث خطأ أثناء استيراد المنتجات.");
    // }
}
