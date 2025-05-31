// admin-categories.js - Admin dashboard category management functionality

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is admin
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || !currentUser.isAdmin) {
        window.location.href = 'index.html';
        return;
    }

    // Load categories in admin dashboard
    loadAdminCategories();

    // Add event listener for add category button in modal
    const saveCategoryBtn = document.getElementById('save-category');
    if (saveCategoryBtn) {
        saveCategoryBtn.addEventListener('click', handleAddCategory);
    }

    // Add event listener for update category button in modal
    const updateCategoryBtn = document.getElementById('update-category');
    if (updateCategoryBtn) {
        updateCategoryBtn.addEventListener('click', handleUpdateCategory);
    }

    // Add event listener for confirm delete category button in modal
    const confirmDeleteCategoryBtn = document.getElementById('confirm-delete-category');
    if (confirmDeleteCategoryBtn) {
        confirmDeleteCategoryBtn.addEventListener('click', handleDeleteCategory);
    }
});

// Load categories in admin dashboard
function loadAdminCategories() {
    const categoriesList = document.getElementById('categories-list');
    if (!categoriesList) return;

    const categories = JSON.parse(localStorage.getItem('categories')) || [];
    
    categoriesList.innerHTML = ''; // Clear existing list
    
    categories.forEach(category => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td><img src="${category.image || 'images/category-placeholder.jpg'}" alt="${category.name}" class="category-thumbnail"></td>
            <td>${category.name}</td>
            <td>${category.description}</td>
            <td>${category.featured ? '<span class="badge bg-success">نعم</span>' : '<span class="badge bg-secondary">لا</span>'}</td>
            <td>
                <button class="btn btn-sm btn-primary edit-category" data-id="${category.id}" data-bs-toggle="modal" data-bs-target="#editCategoryModal">
                    <i class="fas fa-edit"></i> تعديل
                </button>
                <button class="btn btn-sm btn-danger delete-category" data-id="${category.id}" data-name="${category.name}" data-bs-toggle="modal" data-bs-target="#deleteCategoryModal">
                    <i class="fas fa-trash"></i> حذف
                </button>
            </td>
        `;
        
        categoriesList.appendChild(row);
    });
    
    // Add event listeners for edit and delete buttons after rendering
    attachCategoryActionListeners();
}

// Attach event listeners for edit and delete buttons
function attachCategoryActionListeners() {
    const editButtons = document.querySelectorAll('.edit-category');
    const deleteButtons = document.querySelectorAll('.delete-category');
    
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const categoryId = this.getAttribute('data-id');
            populateEditCategoryModal(categoryId);
        });
    });
    
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const categoryId = this.getAttribute('data-id');
            const categoryName = this.getAttribute('data-name');
            populateDeleteCategoryModal(categoryId, categoryName);
        });
    });
}

// Handle add category form submission
function handleAddCategory() {
    const categoryIdInput = document.getElementById('category-id');
    const categoryNameInput = document.getElementById('category-name');
    const categoryDescriptionInput = document.getElementById('category-description');
    const categoryImageInput = document.getElementById('category-image');
    const categoryFeaturedInput = document.getElementById('category-featured');

    const id = categoryIdInput.value.trim();
    const name = categoryNameInput.value.trim();
    const description = categoryDescriptionInput.value.trim();
    const image = categoryImageInput.value.trim();
    const featured = categoryFeaturedInput.checked;

    if (!id || !name || !description) {
        alert('يرجى ملء جميع الحقول المطلوبة (المعرف، الاسم، الوصف).');
        return;
    }

    const categories = JSON.parse(localStorage.getItem('categories')) || [];

    // Check if category ID already exists
    if (categories.some(cat => cat.id === id)) {
        alert('معرف الفئة موجود بالفعل. يرجى اختيار معرف فريد.');
        return;
    }

    const newCategory = {
        id: id,
        name: name,
        description: description,
        image: image,
        featured: featured
    };

    categories.push(newCategory);
    localStorage.setItem('categories', JSON.stringify(categories));

    // Close modal
    const addModal = bootstrap.Modal.getInstance(document.getElementById('addCategoryModal'));
    addModal.hide();

    // Reset form
    document.getElementById('add-category-form').reset();

    // Reload categories list
    loadAdminCategories();

    alert('تمت إضافة الفئة بنجاح.');
}

// Populate edit category modal with data
function populateEditCategoryModal(categoryId) {
    const categories = JSON.parse(localStorage.getItem('categories')) || [];
    const category = categories.find(cat => cat.id === categoryId);

    if (!category) return;

    document.getElementById('edit-category-id').value = category.id;
    document.getElementById('edit-category-name').value = category.name;
    document.getElementById('edit-category-description').value = category.description;
    document.getElementById('edit-category-image').value = category.image || '';
    document.getElementById('edit-category-featured').checked = category.featured;
}

// Handle update category form submission
function handleUpdateCategory() {
    const categoryId = document.getElementById('edit-category-id').value;
    const categoryNameInput = document.getElementById('edit-category-name');
    const categoryDescriptionInput = document.getElementById('edit-category-description');
    const categoryImageInput = document.getElementById('edit-category-image');
    const categoryFeaturedInput = document.getElementById('edit-category-featured');

    const name = categoryNameInput.value.trim();
    const description = categoryDescriptionInput.value.trim();
    const image = categoryImageInput.value.trim();
    const featured = categoryFeaturedInput.checked;

    if (!name || !description) {
        alert('يرجى ملء حقلي الاسم والوصف.');
        return;
    }

    let categories = JSON.parse(localStorage.getItem('categories')) || [];
    const categoryIndex = categories.findIndex(cat => cat.id === categoryId);

    if (categoryIndex === -1) {
        alert('لم يتم العثور على الفئة.');
        return;
    }

    categories[categoryIndex] = {
        ...categories[categoryIndex],
        name: name,
        description: description,
        image: image,
        featured: featured
    };

    localStorage.setItem('categories', JSON.stringify(categories));

    // Close modal
    const editModal = bootstrap.Modal.getInstance(document.getElementById('editCategoryModal'));
    editModal.hide();

    // Reload categories list
    loadAdminCategories();

    alert('تم تحديث الفئة بنجاح.');
}

// Populate delete category modal with data
function populateDeleteCategoryModal(categoryId, categoryName) {
    document.getElementById('delete-category-id').value = categoryId;
    document.getElementById('delete-category-name').textContent = categoryName;
}

// Handle delete category confirmation
function handleDeleteCategory() {
    const categoryIdToDelete = document.getElementById('delete-category-id').value;

    let categories = JSON.parse(localStorage.getItem('categories')) || [];
    let products = JSON.parse(localStorage.getItem('products')) || [];

    // Filter out the category to delete
    const updatedCategories = categories.filter(cat => cat.id !== categoryIdToDelete);

    // Filter out products associated with the deleted category
    const updatedProducts = products.filter(prod => prod.category !== categoryIdToDelete);

    localStorage.setItem('categories', JSON.stringify(updatedCategories));
    localStorage.setItem('products', JSON.stringify(updatedProducts));

    // Close modal
    const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteCategoryModal'));
    deleteModal.hide();

    // Reload categories list
    loadAdminCategories();

    alert('تم حذف الفئة والمنتجات المرتبطة بها بنجاح.');
}

