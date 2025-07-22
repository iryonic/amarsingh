// Departments module
class Departments {
    static render(container) {
        const departments = storage.getAll('departments');
        
        container.innerHTML = `
            <div class="page-header mb-4">
                <div class="flex justify-between items-center">
                    <h2 class="text-2xl font-bold">Departments Management</h2>
                    <button class="btn btn-primary" onclick="Departments.showCreateModal()">
                        <i data-feather="plus"></i>
                        Add Department
                    </button>
                </div>
            </div>
            
            <div class="mb-4">
                <input type="search" class="form-input" placeholder="Search departments..." 
                       style="max-width: 300px;" onkeyup="Departments.handleSearch(this.value)">
            </div>
            
            <div class="departments-grid" id="departmentsGrid">
                ${this.renderDepartmentsGrid(departments)}
            </div>
        `;
    }

    static renderDepartmentsGrid(departments) {
        if (departments.length === 0) {
            return `
                <div class="empty-state">
                    <div class="empty-state-icon">
                        <i data-feather="building"></i>
                    </div>
                    <div class="empty-state-title">No Departments</div>
                    <div class="empty-state-desc">Create your first department to get started.</div>
                    <button class="btn btn-primary mt-3" onclick="Departments.showCreateModal()">
                        <i data-feather="plus"></i>
                        Add Department
                    </button>
                </div>
            `;
        }

        const gridHTML = departments.map(dept => {
            const facultyCount = storage.getAll('faculty').filter(f => f.department === dept.name).length;
            
            return `
                <div class="department-card card">
                    <div class="department-header">
                        <div class="department-icon">
                            <i data-feather="home"></i>
                        </div>
                        <div class="department-stats">
                            <div class="stat-item">
                                <div class="stat-value">${facultyCount}</div>
                                <div class="stat-label">Faculty</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="department-content">
                        <h3 class="department-name">${Utils.escapeHTML(dept.name)}</h3>
                        ${dept.code ? `<div class="department-code">Code: ${Utils.escapeHTML(dept.code)}</div>` : ''}
                        ${dept.description ? `<p class="department-description">${Utils.truncateText(Utils.escapeHTML(dept.description), 120)}</p>` : ''}
                        
                        ${dept.hod ? `
                            <div class="department-hod">
                                <strong>HOD:</strong> ${Utils.escapeHTML(dept.hod)}
                            </div>
                        ` : ''}
                        
                        ${dept.email ? `
                            <div class="department-contact">
                                <i data-feather="mail"></i>
                                ${Utils.escapeHTML(dept.email)}
                            </div>
                        ` : ''}
                        
                        ${dept.phone ? `
                            <div class="department-contact">
                                <i data-feather="phone"></i>
                                ${Utils.escapeHTML(dept.phone)}
                            </div>
                        ` : ''}
                        
                        ${dept.established ? `
                            <div class="department-established">
                                <small class="text-muted">Established: ${dept.established}</small>
                            </div>
                        ` : ''}
                    </div>
                    
                    <div class="department-actions">
                        <button class="btn btn-sm btn-secondary" onclick="Departments.showEditModal('${dept.id}')" title="Edit">
                            <i data-feather="edit-2"></i>
                        </button>
                        <button class="btn btn-sm btn-error" onclick="Departments.deleteDepartment('${dept.id}')" title="Delete">
                            <i data-feather="trash-2"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        return `
            <style>
                .departments-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
                    gap: var(--spacing-lg);
                }
                
                .department-card {
                    padding: var(--spacing-lg);
                    transition: transform var(--transition-fast), box-shadow var(--transition-fast);
                }
                
                .department-card:hover {
                    transform: translateY(-2px);
                    box-shadow: var(--shadow-lg);
                }
                
                .department-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: var(--spacing-md);
                }
                
                .department-icon {
                    width: 3rem;
                    height: 3rem;
                    background: linear-gradient(135deg, var(--primary-color), var(--info-color));
                    border-radius: var(--radius-lg);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    box-shadow: var(--shadow-md);
                }
                
                .department-stats {
                    text-align: right;
                }
                
                .stat-item {
                    text-align: center;
                }
                
                .stat-value {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: var(--primary-color);
                    line-height: 1;
                }
                
                .stat-label {
                    font-size: 0.75rem;
                    color: var(--text-muted);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                
                .department-content {
                    margin-bottom: var(--spacing-lg);
                }
                
                .department-name {
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: var(--text-primary);
                    margin-bottom: var(--spacing-sm);
                }
                
                .department-code {
                    color: var(--text-secondary);
                    font-size: 0.875rem;
                    margin-bottom: var(--spacing-sm);
                }
                
                .department-description {
                    color: var(--text-secondary);
                    line-height: 1.5;
                    margin-bottom: var(--spacing-md);
                }
                
                .department-hod {
                    color: var(--text-primary);
                    margin-bottom: var(--spacing-sm);
                }
                
                .department-contact {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-sm);
                    color: var(--text-muted);
                    font-size: 0.875rem;
                    margin-bottom: var(--spacing-xs);
                }
                
                .department-contact i {
                    width: 1rem;
                    height: 1rem;
                }
                
                .department-established {
                    margin-top: var(--spacing-md);
                }
                
                .department-actions {
                    display: flex;
                    justify-content: center;
                    gap: var(--spacing-sm);
                }
            </style>
            ${gridHTML}
        `;
    }

    static showCreateModal() {
        const content = `
            <form id="departmentForm" onsubmit="Departments.handleSubmit(event)">
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Department Name *</label>
                        <input type="text" class="form-input" name="name" required placeholder="e.g., Computer Science">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Department Code</label>
                        <input type="text" class="form-input" name="code" placeholder="e.g., CSE, ECE">
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Description</label>
                    <textarea class="form-textarea" name="description" rows="4" placeholder="Brief description of the department..."></textarea>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Head of Department (HOD)</label>
                        <input type="text" class="form-input" name="hod" placeholder="Dr. John Smith">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Established Year</label>
                        <input type="number" class="form-input" name="established" min="1900" max="2024" placeholder="2000">
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Email</label>
                        <input type="email" class="form-input" name="email" placeholder="dept@college.edu">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Phone</label>
                        <input type="tel" class="form-input" name="phone" placeholder="+1 234 567 8900">
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Location</label>
                    <input type="text" class="form-input" name="location" placeholder="Building A, Floor 2">
                </div>
                
                <div class="form-group">
                    <label class="form-label">Website URL</label>
                    <input type="url" class="form-input" name="website" placeholder="https://dept.college.edu">
                </div>
                
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" onclick="Utils.hideModal()">Cancel</button>
                    <button type="submit" class="btn btn-primary">Create Department</button>
                </div>
            </form>
        `;
        
        Utils.showModal('Create Department', content, { size: 'lg' });
    }

    static showEditModal(id) {
        const department = storage.findById('departments', id);
        if (!department) {
            Utils.showToast('Department not found', 'error');
            return;
        }

        const content = `
            <form id="departmentForm" onsubmit="Departments.handleSubmit(event, '${id}')">
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Department Name *</label>
                        <input type="text" class="form-input" name="name" value="${Utils.escapeHTML(department.name)}" required placeholder="e.g., Computer Science">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Department Code</label>
                        <input type="text" class="form-input" name="code" value="${Utils.escapeHTML(department.code || '')}" placeholder="e.g., CSE, ECE">
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Description</label>
                    <textarea class="form-textarea" name="description" rows="4" placeholder="Brief description of the department...">${Utils.escapeHTML(department.description || '')}</textarea>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Head of Department (HOD)</label>
                        <input type="text" class="form-input" name="hod" value="${Utils.escapeHTML(department.hod || '')}" placeholder="Dr. John Smith">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Established Year</label>
                        <input type="number" class="form-input" name="established" value="${department.established || ''}" min="1900" max="2024" placeholder="2000">
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Email</label>
                        <input type="email" class="form-input" name="email" value="${Utils.escapeHTML(department.email || '')}" placeholder="dept@college.edu">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Phone</label>
                        <input type="tel" class="form-input" name="phone" value="${Utils.escapeHTML(department.phone || '')}" placeholder="+1 234 567 8900">
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Location</label>
                    <input type="text" class="form-input" name="location" value="${Utils.escapeHTML(department.location || '')}" placeholder="Building A, Floor 2">
                </div>
                
                <div class="form-group">
                    <label class="form-label">Website URL</label>
                    <input type="url" class="form-input" name="website" value="${Utils.escapeHTML(department.website || '')}" placeholder="https://dept.college.edu">
                </div>
                
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" onclick="Utils.hideModal()">Cancel</button>
                    <button type="submit" class="btn btn-primary">Update Department</button>
                </div>
            </form>
        `;
        
        Utils.showModal('Edit Department', content, { size: 'lg' });
    }

    static handleSubmit(event, id = null) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const data = {
            name: formData.get('name').trim(),
            code: formData.get('code').trim(),
            description: formData.get('description').trim(),
            hod: formData.get('hod').trim(),
            established: formData.get('established') ? parseInt(formData.get('established')) : null,
            email: formData.get('email').trim(),
            phone: formData.get('phone').trim(),
            location: formData.get('location').trim(),
            website: formData.get('website').trim()
        };

        // Validation
        if (!data.name) {
            Utils.showToast('Please enter a department name', 'error');
            return;
        }

        if (data.email && !Utils.isValidEmail(data.email)) {
            Utils.showToast('Please enter a valid email address', 'error');
            return;
        }

        if (data.website && !Utils.isValidURL(data.website)) {
            Utils.showToast('Please enter a valid website URL', 'error');
            return;
        }

        // Check for duplicate department names (excluding current department if editing)
        const existingDepartments = storage.getAll('departments');
        const duplicateName = existingDepartments.find(dept => 
            dept.name.toLowerCase() === data.name.toLowerCase() && dept.id !== id
        );
        
        if (duplicateName) {
            Utils.showToast('A department with this name already exists', 'error');
            return;
        }

        try {
            if (id) {
                // Update existing department
                const updated = storage.update('departments', id, data);
                if (updated) {
                    Utils.showToast('Department updated successfully!');
                    Utils.hideModal();
                    this.refreshGrid();
                } else {
                    Utils.showToast('Failed to update department', 'error');
                }
            } else {
                // Create new department
                const created = storage.add('departments', data);
                if (created) {
                    Utils.showToast('Department created successfully!');
                    Utils.hideModal();
                    this.refreshGrid();
                } else {
                    Utils.showToast('Failed to create department', 'error');
                }
            }
        } catch (error) {
            console.error('Error saving department:', error);
            Utils.showToast('An error occurred while saving', 'error');
        }
    }

    static deleteDepartment(id) {
        const department = storage.findById('departments', id);
        if (!department) {
            Utils.showToast('Department not found', 'error');
            return;
        }

        // Check if department has faculty members
        const facultyCount = storage.getAll('faculty').filter(f => f.department === department.name).length;
        
        if (facultyCount > 0) {
            Utils.showToast(`Cannot delete department. It has ${facultyCount} faculty member(s) assigned.`, 'error');
            return;
        }

        Utils.showConfirmation(
            'Delete Department',
            `Are you sure you want to delete "${department.name}"? This action cannot be undone.`,
            () => {
                try {
                    const deleted = storage.delete('departments', id);
                    if (deleted) {
                        Utils.showToast('Department deleted successfully!');
                        this.refreshGrid();
                    } else {
                        Utils.showToast('Failed to delete department', 'error');
                    }
                } catch (error) {
                    console.error('Error deleting department:', error);
                    Utils.showToast('An error occurred while deleting', 'error');
                }
            }
        );
    }

    static handleSearch(query) {
        const departments = storage.search('departments', query, ['name', 'code', 'description', 'hod']);
        this.updateGrid(departments);
    }

    static updateGrid(departments) {
        const grid = document.getElementById('departmentsGrid');
        grid.innerHTML = this.renderDepartmentsGrid(departments);
        feather.replace();
    }

    static refreshGrid() {
        const departments = storage.getAll('departments');
        this.updateGrid(departments);
    }
}

// Make Departments available globally
window.Departments = Departments;
