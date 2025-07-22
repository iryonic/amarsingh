// Faculty module
class Faculty {
    static render(container) {
        const faculty = storage.getAll('faculty');
        
        container.innerHTML = `
            <div class="page-header mb-4">
                <div class="flex justify-between items-center">
                    <h2 class="text-2xl font-bold">Faculty Management</h2>
                    <button class="btn btn-primary" onclick="Faculty.showCreateModal()">
                        <i data-feather="plus"></i>
                        Add Faculty
                    </button>
                </div>
            </div>
            
            <div class="mb-4">
                <div class="flex gap-4 items-center">
                    <input type="search" class="form-input" placeholder="Search faculty..." 
                           style="max-width: 300px;" onkeyup="Faculty.handleSearch(this.value)">
                    <select class="form-select" style="max-width: 200px;" onchange="Faculty.handleDepartmentFilter(this.value)">
                        <option value="">All Departments</option>
                        ${this.getDepartmentOptions()}
                    </select>
                </div>
            </div>
            
            <div class="faculty-grid" id="facultyGrid">
                ${this.renderFacultyGrid(faculty)}
            </div>
        `;
    }

    static getDepartmentOptions() {
        const departments = storage.getAll('departments');
        return departments.map(dept => 
            `<option value="${Utils.escapeHTML(dept.name)}">${Utils.escapeHTML(dept.name)}</option>`
        ).join('');
    }

    static renderFacultyGrid(faculty) {
        if (faculty.length === 0) {
            return `
                <div class="empty-state">
                    <div class="empty-state-icon">
                        <i data-feather="users"></i>
                    </div>
                    <div class="empty-state-title">No Faculty Members</div>
                    <div class="empty-state-desc">Add your first faculty member to get started.</div>
                    <button class="btn btn-primary mt-3" onclick="Faculty.showCreateModal()">
                        <i data-feather="plus"></i>
                        Add Faculty
                    </button>
                </div>
            `;
        }

        const gridHTML = faculty.map(member => `
            <div class="faculty-card card">
                <div class="faculty-photo">
                    ${member.photo ? 
                        `<img src="${member.photo}" alt="${Utils.escapeHTML(member.name)}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
                         <div class="faculty-photo-placeholder" style="display: none;">
                            <i data-feather="user"></i>
                         </div>` :
                        `<div class="faculty-photo-placeholder">
                            <i data-feather="user"></i>
                         </div>`
                    }
                </div>
                <div class="faculty-info">
                    <h3 class="faculty-name">${Utils.escapeHTML(member.name)}</h3>
                    <div class="faculty-department">${Utils.escapeHTML(member.department)}</div>
                    <div class="faculty-position">${Utils.escapeHTML(member.position || 'Faculty')}</div>
                    ${member.email ? `<div class="faculty-email">${Utils.escapeHTML(member.email)}</div>` : ''}
                    ${member.bio ? `<div class="faculty-bio">${Utils.truncateText(Utils.escapeHTML(member.bio), 100)}</div>` : ''}
                </div>
                <div class="faculty-actions">
                    <button class="btn btn-sm btn-secondary" onclick="Faculty.showEditModal('${member.id}')" title="Edit">
                        <i data-feather="edit-2"></i>
                    </button>
                    <button class="btn btn-sm btn-error" onclick="Faculty.deleteFaculty('${member.id}')" title="Delete">
                        <i data-feather="trash-2"></i>
                    </button>
                </div>
            </div>
        `).join('');

        return `
            <style>
                .faculty-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: var(--spacing-lg);
                }
                
                .faculty-card {
                    padding: var(--spacing-lg);
                    transition: transform var(--transition-fast), box-shadow var(--transition-fast);
                }
                
                .faculty-card:hover {
                    transform: translateY(-2px);
                    box-shadow: var(--shadow-lg);
                }
                
                .faculty-photo {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    margin: 0 auto var(--spacing-md);
                    overflow: hidden;
                    position: relative;
                }
                
                .faculty-photo img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                
                .faculty-photo-placeholder {
                    width: 100%;
                    height: 100%;
                    background-color: var(--bg-tertiary);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--text-muted);
                }
                
                .faculty-info {
                    text-align: center;
                    margin-bottom: var(--spacing-md);
                }
                
                .faculty-name {
                    font-size: 1.125rem;
                    font-weight: 600;
                    color: var(--text-primary);
                    margin-bottom: var(--spacing-xs);
                }
                
                .faculty-department {
                    color: var(--primary-color);
                    font-weight: 500;
                    margin-bottom: var(--spacing-xs);
                }
                
                .faculty-position {
                    color: var(--text-secondary);
                    font-size: 0.875rem;
                    margin-bottom: var(--spacing-sm);
                }
                
                .faculty-email {
                    color: var(--text-muted);
                    font-size: 0.875rem;
                    margin-bottom: var(--spacing-sm);
                }
                
                .faculty-bio {
                    color: var(--text-secondary);
                    font-size: 0.875rem;
                    line-height: 1.4;
                }
                
                .faculty-actions {
                    display: flex;
                    justify-content: center;
                    gap: var(--spacing-sm);
                }
            </style>
            ${gridHTML}
        `;
    }

    static showCreateModal() {
        const departments = storage.getAll('departments');
        const departmentOptions = departments.map(dept => 
            `<option value="${Utils.escapeHTML(dept.name)}">${Utils.escapeHTML(dept.name)}</option>`
        ).join('');

        const content = `
            <form id="facultyForm" onsubmit="Faculty.handleSubmit(event)">
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Full Name *</label>
                        <input type="text" class="form-input" name="name" required>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Email</label>
                        <input type="email" class="form-input" name="email" placeholder="faculty@college.edu">
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Department *</label>
                        <select class="form-select" name="department" required>
                            <option value="">Select Department</option>
                            ${departmentOptions}
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Position</label>
                        <select class="form-select" name="position">
                            <option value="Professor">Professor</option>
                            <option value="Associate Professor">Associate Professor</option>
                            <option value="Assistant Professor">Assistant Professor</option>
                            <option value="Lecturer">Lecturer</option>
                            <option value="HOD">Head of Department</option>
                            <option value="Dean">Dean</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Photo URL</label>
                    <input type="url" class="form-input" name="photo" placeholder="https://example.com/photo.jpg">
                </div>
                
                <div class="form-group">
                    <label class="form-label">Phone</label>
                    <input type="tel" class="form-input" name="phone" placeholder="+1 234 567 8900">
                </div>
                
                <div class="form-group">
                    <label class="form-label">Qualifications</label>
                    <input type="text" class="form-input" name="qualifications" placeholder="PhD in Computer Science">
                </div>
                
                <div class="form-group">
                    <label class="form-label">Specialization</label>
                    <input type="text" class="form-input" name="specialization" placeholder="Machine Learning, AI">
                </div>
                
                <div class="form-group">
                    <label class="form-label">Bio</label>
                    <textarea class="form-textarea" name="bio" rows="4" placeholder="Brief description about the faculty member..."></textarea>
                </div>
                
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" onclick="Utils.hideModal()">Cancel</button>
                    <button type="submit" class="btn btn-primary">Add Faculty</button>
                </div>
            </form>
        `;
        
        Utils.showModal('Add Faculty Member', content, { size: 'lg' });
    }

    static showEditModal(id) {
        const faculty = storage.findById('faculty', id);
        if (!faculty) {
            Utils.showToast('Faculty member not found', 'error');
            return;
        }

        const departments = storage.getAll('departments');
        const departmentOptions = departments.map(dept => 
            `<option value="${Utils.escapeHTML(dept.name)}" ${dept.name === faculty.department ? 'selected' : ''}>${Utils.escapeHTML(dept.name)}</option>`
        ).join('');

        const content = `
            <form id="facultyForm" onsubmit="Faculty.handleSubmit(event, '${id}')">
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Full Name *</label>
                        <input type="text" class="form-input" name="name" value="${Utils.escapeHTML(faculty.name)}" required>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Email</label>
                        <input type="email" class="form-input" name="email" value="${Utils.escapeHTML(faculty.email || '')}" placeholder="faculty@college.edu">
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Department *</label>
                        <select class="form-select" name="department" required>
                            <option value="">Select Department</option>
                            ${departmentOptions}
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Position</label>
                        <select class="form-select" name="position">
                            <option value="Professor" ${faculty.position === 'Professor' ? 'selected' : ''}>Professor</option>
                            <option value="Associate Professor" ${faculty.position === 'Associate Professor' ? 'selected' : ''}>Associate Professor</option>
                            <option value="Assistant Professor" ${faculty.position === 'Assistant Professor' ? 'selected' : ''}>Assistant Professor</option>
                            <option value="Lecturer" ${faculty.position === 'Lecturer' ? 'selected' : ''}>Lecturer</option>
                            <option value="HOD" ${faculty.position === 'HOD' ? 'selected' : ''}>Head of Department</option>
                            <option value="Dean" ${faculty.position === 'Dean' ? 'selected' : ''}>Dean</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Photo URL</label>
                    <input type="url" class="form-input" name="photo" value="${faculty.photo || ''}" placeholder="https://example.com/photo.jpg">
                </div>
                
                <div class="form-group">
                    <label class="form-label">Phone</label>
                    <input type="tel" class="form-input" name="phone" value="${faculty.phone || ''}" placeholder="+1 234 567 8900">
                </div>
                
                <div class="form-group">
                    <label class="form-label">Qualifications</label>
                    <input type="text" class="form-input" name="qualifications" value="${Utils.escapeHTML(faculty.qualifications || '')}" placeholder="PhD in Computer Science">
                </div>
                
                <div class="form-group">
                    <label class="form-label">Specialization</label>
                    <input type="text" class="form-input" name="specialization" value="${Utils.escapeHTML(faculty.specialization || '')}" placeholder="Machine Learning, AI">
                </div>
                
                <div class="form-group">
                    <label class="form-label">Bio</label>
                    <textarea class="form-textarea" name="bio" rows="4" placeholder="Brief description about the faculty member...">${Utils.escapeHTML(faculty.bio || '')}</textarea>
                </div>
                
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" onclick="Utils.hideModal()">Cancel</button>
                    <button type="submit" class="btn btn-primary">Update Faculty</button>
                </div>
            </form>
        `;
        
        Utils.showModal('Edit Faculty Member', content, { size: 'lg' });
    }

    static handleSubmit(event, id = null) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const data = {
            name: formData.get('name').trim(),
            email: formData.get('email').trim(),
            department: formData.get('department'),
            position: formData.get('position'),
            photo: formData.get('photo').trim(),
            phone: formData.get('phone').trim(),
            qualifications: formData.get('qualifications').trim(),
            specialization: formData.get('specialization').trim(),
            bio: formData.get('bio').trim()
        };

        // Validation
        if (!data.name || !data.department) {
            Utils.showToast('Please fill in all required fields', 'error');
            return;
        }

        if (data.email && !Utils.isValidEmail(data.email)) {
            Utils.showToast('Please enter a valid email address', 'error');
            return;
        }

        if (data.photo && !Utils.isValidURL(data.photo)) {
            Utils.showToast('Please enter a valid photo URL', 'error');
            return;
        }

        try {
            if (id) {
                // Update existing faculty
                const updated = storage.update('faculty', id, data);
                if (updated) {
                    Utils.showToast('Faculty member updated successfully!');
                    Utils.hideModal();
                    this.refreshGrid();
                } else {
                    Utils.showToast('Failed to update faculty member', 'error');
                }
            } else {
                // Create new faculty
                const created = storage.add('faculty', data);
                if (created) {
                    Utils.showToast('Faculty member added successfully!');
                    Utils.hideModal();
                    this.refreshGrid();
                } else {
                    Utils.showToast('Failed to add faculty member', 'error');
                }
            }
        } catch (error) {
            console.error('Error saving faculty:', error);
            Utils.showToast('An error occurred while saving', 'error');
        }
    }

    static deleteFaculty(id) {
        const faculty = storage.findById('faculty', id);
        if (!faculty) {
            Utils.showToast('Faculty member not found', 'error');
            return;
        }

        Utils.showConfirmation(
            'Delete Faculty Member',
            `Are you sure you want to delete "${faculty.name}"? This action cannot be undone.`,
            () => {
                try {
                    const deleted = storage.delete('faculty', id);
                    if (deleted) {
                        Utils.showToast('Faculty member deleted successfully!');
                        this.refreshGrid();
                    } else {
                        Utils.showToast('Failed to delete faculty member', 'error');
                    }
                } catch (error) {
                    console.error('Error deleting faculty:', error);
                    Utils.showToast('An error occurred while deleting', 'error');
                }
            }
        );
    }

    static handleSearch(query) {
        const faculty = storage.search('faculty', query, ['name', 'department', 'position', 'specialization', 'bio']);
        this.updateGrid(faculty);
    }

    static handleDepartmentFilter(department) {
        let faculty = storage.getAll('faculty');
        if (department) {
            faculty = faculty.filter(f => f.department === department);
        }
        this.updateGrid(faculty);
    }

    static updateGrid(faculty) {
        const grid = document.getElementById('facultyGrid');
        grid.innerHTML = this.renderFacultyGrid(faculty);
        feather.replace();
    }

    static refreshGrid() {
        const faculty = storage.getAll('faculty');
        this.updateGrid(faculty);
    }
}

// Make Faculty available globally
window.Faculty = Faculty;
