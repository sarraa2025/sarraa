// admin-users.js - Admin dashboard user management functionality

document.addEventListener("DOMContentLoaded", function() {
    // Check if user is admin
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser || !currentUser.isAdmin) {
        window.location.href = "index.html";
        return;
    }

    // Load users in admin dashboard
    loadAdminUsers();

    // Add event listener for update user button in modal
    const updateUserBtn = document.getElementById("update-user");
    if (updateUserBtn) {
        updateUserBtn.addEventListener("click", handleUpdateUser);
    }

    // Add event listener for confirm delete user button in modal
    const confirmDeleteUserBtn = document.getElementById("confirm-delete-user");
    if (confirmDeleteUserBtn) {
        confirmDeleteUserBtn.addEventListener("click", handleDeleteUser);
    }

    // Add event listener for search input
    const searchUserInput = document.getElementById("search-user");
    if (searchUserInput) {
        searchUserInput.addEventListener("input", () => loadAdminUsers(searchUserInput.value.trim()));
    }
});

// Load users in admin dashboard
function loadAdminUsers(searchTerm = "") {
    const usersList = document.getElementById("users-list");
    if (!usersList) return;

    let users = JSON.parse(localStorage.getItem("users")) || [];

    // Filter users based on search term (name or email)
    if (searchTerm) {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        users = users.filter(user => 
            user.firstName.toLowerCase().includes(lowerCaseSearchTerm) ||
            user.lastName.toLowerCase().includes(lowerCaseSearchTerm) ||
            user.email.toLowerCase().includes(lowerCaseSearchTerm)
        );
    }
    
    usersList.innerHTML = ""; // Clear existing list
    
    users.forEach(user => {
        const row = document.createElement("tr");
        const registrationDate = user.registrationDate ? new Date(user.registrationDate).toLocaleDateString("ar-EG") : "غير متوفر";
        const statusBadge = getStatusBadge(user.status || "active");
        const roleText = user.isAdmin ? "مشرف" : "مستخدم";

        row.innerHTML = `
            <td>${user.firstName} ${user.lastName}</td>
            <td>${user.email}</td>
            <td>${registrationDate}</td>
            <td>${roleText}</td>
            <td>${statusBadge}</td>
            <td>
                <button class="btn btn-sm btn-primary edit-user" data-id="${user.id}" data-bs-toggle="modal" data-bs-target="#editUserModal">
                    <i class="fas fa-edit"></i> تعديل
                </button>
                <button class="btn btn-sm btn-danger delete-user" data-id="${user.id}" data-name="${user.firstName} ${user.lastName}" data-bs-toggle="modal" data-bs-target="#deleteUserModal">
                    <i class="fas fa-trash"></i> حذف
                </button>
            </td>
        `;
        
        usersList.appendChild(row);
    });
    
    // Add event listeners for edit and delete buttons after rendering
    attachUserActionListeners();
}

// Get bootstrap badge for user status
function getStatusBadge(status) {
    switch (status) {
        case "active":
            return `<span class="badge bg-success">نشط</span>`;
        case "inactive":
            return `<span class="badge bg-warning text-dark">غير نشط</span>`;
        case "blocked":
            return `<span class="badge bg-danger">محظور</span>`;
        default:
            return `<span class="badge bg-secondary">غير معروف</span>`;
    }
}

// Attach event listeners for edit and delete buttons
function attachUserActionListeners() {
    const editButtons = document.querySelectorAll(".edit-user");
    const deleteButtons = document.querySelectorAll(".delete-user");
    
    editButtons.forEach(button => {
        button.addEventListener("click", function() {
            const userId = parseInt(this.getAttribute("data-id"));
            populateEditUserModal(userId);
        });
    });
    
    deleteButtons.forEach(button => {
        button.addEventListener("click", function() {
            const userId = parseInt(this.getAttribute("data-id"));
            const userName = this.getAttribute("data-name");
            populateDeleteUserModal(userId, userName);
        });
    });
}

// Populate edit user modal with data
function populateEditUserModal(userId) {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(u => u.id === userId);

    if (!user) return;

    document.getElementById("edit-user-id").value = user.id;
    document.getElementById("edit-user-first-name").value = user.firstName;
    document.getElementById("edit-user-last-name").value = user.lastName;
    document.getElementById("edit-user-email").value = user.email;
    document.getElementById("edit-user-phone").value = user.phone || "";
    document.getElementById("edit-user-role").value = user.isAdmin ? "admin" : "user";
    document.getElementById("edit-user-status").value = user.status || "active";
}

// Handle update user form submission
function handleUpdateUser() {
    const userId = parseInt(document.getElementById("edit-user-id").value);
    const firstName = document.getElementById("edit-user-first-name").value.trim();
    const lastName = document.getElementById("edit-user-last-name").value.trim();
    const email = document.getElementById("edit-user-email").value.trim();
    const phone = document.getElementById("edit-user-phone").value.trim();
    const role = document.getElementById("edit-user-role").value;
    const status = document.getElementById("edit-user-status").value;

    if (!firstName || !lastName || !email) {
        alert("يرجى ملء الحقول المطلوبة (الاسم الأول، الاسم الأخير، البريد الإلكتروني).");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
        alert("لم يتم العثور على المستخدم.");
        return;
    }

    // Check if email is already taken by another user
    if (users.some(u => u.email === email && u.id !== userId)) {
        alert("البريد الإلكتروني مستخدم بالفعل من قبل مستخدم آخر.");
        return;
    }

    users[userIndex] = {
        ...users[userIndex],
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: phone,
        isAdmin: role === "admin",
        status: status
    };

    localStorage.setItem("users", JSON.stringify(users));

    // Close modal
    const editModal = bootstrap.Modal.getInstance(document.getElementById("editUserModal"));
    editModal.hide();

    // Reload users list
    loadAdminUsers();

    alert("تم تحديث بيانات المستخدم بنجاح.");
}

// Populate delete user modal with data
function populateDeleteUserModal(userId, userName) {
    document.getElementById("delete-user-id").value = userId;
    document.getElementById("delete-user-name").textContent = userName;
}

// Handle delete user confirmation
function handleDeleteUser() {
    const userIdToDelete = parseInt(document.getElementById("delete-user-id").value);
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    // Prevent admin from deleting themselves
    if (currentUser && currentUser.id === userIdToDelete) {
         alert("لا يمكنك حذف حساب المشرف الخاص بك.");
         const deleteModal = bootstrap.Modal.getInstance(document.getElementById("deleteUserModal"));
         deleteModal.hide();
         return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];
    const updatedUsers = users.filter(u => u.id !== userIdToDelete);

    localStorage.setItem("users", JSON.stringify(updatedUsers));

    // Close modal
    const deleteModal = bootstrap.Modal.getInstance(document.getElementById("deleteUserModal"));
    deleteModal.hide();

    // Reload users list
    loadAdminUsers();

    alert("تم حذف المستخدم بنجاح.");
}

