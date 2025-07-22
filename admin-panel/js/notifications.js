// Notifications module
class Notifications {
    static render(container) {
        const notifications = storage.getAll('notifications');
        
        container.innerHTML = `
            <div class="page-header mb-4">
                <div class="flex justify-between items-center">
                    <h2 class="text-2xl font-bold">Notifications Management</h2>
                    <button class="btn btn-primary" onclick="Notifications.showCreateModal()">
                        <i data-feather="plus"></i>
                        Add Notification
                    </button>
                </div>
            </div>
            
            <div class="mb-4">
                <div class="flex gap-4 items-center">
                    <input type="search" class="form-input" placeholder="Search notifications..." 
                           style="max-width: 300px;" onkeyup="Notifications.handleSearch(this.value)">
                    <select class="form-select" style="max-width: 200px;" onchange="Notifications.handleStatusFilter(this.value)">
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
            </div>
            
            <div class="card">
                <div class="card-body">
                    <div class="table-container">
                        <table class="table" id="notificationsTable">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Message</th>
                                    <th class="hide-mobile">Status</th>
                                    <th class="hide-mobile">Created</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${this.renderNotificationsTable(notifications)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }

    static renderNotificationsTable(notifications) {
        if (notifications.length === 0) {
            return `
                <tr>
                    <td colspan="5" class="text-center">
                        <div class="empty-state">
                            <div class="empty-state-icon">
                                <i data-feather="bell"></i>
                            </div>
                            <div class="empty-state-title">No Notifications</div>
                            <div class="empty-state-desc">Create your first notification to get started.</div>
                            <button class="btn btn-primary mt-3" onclick="Notifications.showCreateModal()">
                                <i data-feather="plus"></i>
                                Add Notification
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }

        return notifications.map(notification => `
            <tr>
                <td>
                    <div class="font-medium">${Utils.escapeHTML(notification.title)}</div>
                </td>
                <td>
                    <div class="text-muted">
                        ${Utils.truncateText(Utils.escapeHTML(notification.message), 100)}
                    </div>
                </td>
                <td class="hide-mobile">
                    <span class="badge ${notification.status === 'active' ? 'badge-success' : 'badge-warning'}">
                        ${notification.status || 'active'}
                    </span>
                </td>
                <td class="hide-mobile">
                    <div class="text-muted">
                        ${Utils.formatDate(notification.createdAt)}
                    </div>
                </td>
                <td>
                    <div class="flex gap-2">
                        <button class="btn btn-sm btn-secondary" onclick="Notifications.showEditModal('${notification.id}')" title="Edit">
                            <i data-feather="edit-2"></i>
                        </button>
                        <button class="btn btn-sm btn-error" onclick="Notifications.deleteNotification('${notification.id}')" title="Delete">
                            <i data-feather="trash-2"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    static showCreateModal() {
        const content = `
            <form id="notificationForm" onsubmit="Notifications.handleSubmit(event)">
                <div class="form-group">
                    <label class="form-label">Title *</label>
                    <input type="text" class="form-input" name="title" required>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Message *</label>
                    <textarea class="form-textarea" name="message" rows="4" required></textarea>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Status</label>
                    <select class="form-select" name="status">
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Priority</label>
                    <select class="form-select" name="priority">
                        <option value="normal">Normal</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                    </select>
                </div>
                
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" onclick="Utils.hideModal()">Cancel</button>
                    <button type="submit" class="btn btn-primary">Create Notification</button>
                </div>
            </form>
        `;
        
        Utils.showModal('Create Notification', content, { size: 'md' });
    }

    static showEditModal(id) {
        const notification = storage.findById('notifications', id);
        if (!notification) {
            Utils.showToast('Notification not found', 'error');
            return;
        }

        const content = `
            <form id="notificationForm" onsubmit="Notifications.handleSubmit(event, '${id}')">
                <div class="form-group">
                    <label class="form-label">Title *</label>
                    <input type="text" class="form-input" name="title" value="${Utils.escapeHTML(notification.title)}" required>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Message *</label>
                    <textarea class="form-textarea" name="message" rows="4" required>${Utils.escapeHTML(notification.message)}</textarea>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Status</label>
                    <select class="form-select" name="status">
                        <option value="active" ${notification.status === 'active' ? 'selected' : ''}>Active</option>
                        <option value="inactive" ${notification.status === 'inactive' ? 'selected' : ''}>Inactive</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Priority</label>
                    <select class="form-select" name="priority">
                        <option value="normal" ${notification.priority === 'normal' ? 'selected' : ''}>Normal</option>
                        <option value="high" ${notification.priority === 'high' ? 'selected' : ''}>High</option>
                        <option value="urgent" ${notification.priority === 'urgent' ? 'selected' : ''}>Urgent</option>
                    </select>
                </div>
                
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" onclick="Utils.hideModal()">Cancel</button>
                    <button type="submit" class="btn btn-primary">Update Notification</button>
                </div>
            </form>
        `;
        
        Utils.showModal('Edit Notification', content, { size: 'md' });
    }

    static handleSubmit(event, id = null) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const data = {
            title: formData.get('title').trim(),
            message: formData.get('message').trim(),
            status: formData.get('status'),
            priority: formData.get('priority')
        };

        // Validation
        if (!data.title || !data.message) {
            Utils.showToast('Please fill in all required fields', 'error');
            return;
        }

        try {
            if (id) {
                // Update existing notification
                const updated = storage.update('notifications', id, data);
                if (updated) {
                    Utils.showToast('Notification updated successfully!');
                    Utils.hideModal();
                    this.refreshTable();
                } else {
                    Utils.showToast('Failed to update notification', 'error');
                }
            } else {
                // Create new notification
                const created = storage.add('notifications', data);
                if (created) {
                    Utils.showToast('Notification created successfully!');
                    Utils.hideModal();
                    this.refreshTable();
                } else {
                    Utils.showToast('Failed to create notification', 'error');
                }
            }
        } catch (error) {
            console.error('Error saving notification:', error);
            Utils.showToast('An error occurred while saving', 'error');
        }
    }

    static deleteNotification(id) {
        const notification = storage.findById('notifications', id);
        if (!notification) {
            Utils.showToast('Notification not found', 'error');
            return;
        }

        Utils.showConfirmation(
            'Delete Notification',
            `Are you sure you want to delete "${notification.title}"? This action cannot be undone.`,
            () => {
                try {
                    const deleted = storage.delete('notifications', id);
                    if (deleted) {
                        Utils.showToast('Notification deleted successfully!');
                        this.refreshTable();
                    } else {
                        Utils.showToast('Failed to delete notification', 'error');
                    }
                } catch (error) {
                    console.error('Error deleting notification:', error);
                    Utils.showToast('An error occurred while deleting', 'error');
                }
            }
        );
    }

    static handleSearch(query) {
        const notifications = storage.search('notifications', query, ['title', 'message']);
        this.updateTable(notifications);
    }

    static handleStatusFilter(status) {
        let notifications = storage.getAll('notifications');
        if (status) {
            notifications = notifications.filter(n => n.status === status);
        }
        this.updateTable(notifications);
    }

    static updateTable(notifications) {
        const tbody = document.querySelector('#notificationsTable tbody');
        tbody.innerHTML = this.renderNotificationsTable(notifications);
        feather.replace();
    }

    static refreshTable() {
        const notifications = storage.getAll('notifications');
        this.updateTable(notifications);
    }
}

// Make Notifications available globally
window.Notifications = Notifications;
