// Events module
class Events {
    static render(container) {
        const events = storage.getAll('events');
        
        container.innerHTML = `
            <div class="page-header mb-4">
                <div class="flex justify-between items-center">
                    <h2 class="text-2xl font-bold">Events Management</h2>
                    <button class="btn btn-primary" onclick="Events.showCreateModal()">
                        <i data-feather="plus"></i>
                        Add Event
                    </button>
                </div>
            </div>
            
            <div class="mb-4">
                <div class="flex gap-4 items-center">
                    <input type="search" class="form-input" placeholder="Search events..." 
                           style="max-width: 300px;" onkeyup="Events.handleSearch(this.value)">
                    <select class="form-select" style="max-width: 200px;" onchange="Events.handleStatusFilter(this.value)">
                        <option value="">All Events</option>
                        <option value="upcoming">Upcoming</option>
                        <option value="ongoing">Ongoing</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>
            </div>
            
            <div class="card">
                <div class="card-body">
                    <div class="table-container">
                        <table class="table" id="eventsTable">
                            <thead>
                                <tr>
                                    <th>Event</th>
                                    <th class="hide-mobile">Description</th>
                                    <th>Date</th>
                                    <th class="hide-mobile">Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${this.renderEventsTable(events)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }

    static renderEventsTable(events) {
        if (events.length === 0) {
            return `
                <tr>
                    <td colspan="5" class="text-center">
                        <div class="empty-state">
                            <div class="empty-state-icon">
                                <i data-feather="calendar"></i>
                            </div>
                            <div class="empty-state-title">No Events</div>
                            <div class="empty-state-desc">Create your first event to get started.</div>
                            <button class="btn btn-primary mt-3" onclick="Events.showCreateModal()">
                                <i data-feather="plus"></i>
                                Add Event
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }

        return events.map(event => {
            const status = this.getEventStatus(event.date);
            const statusClass = this.getStatusClass(status);
            
            return `
                <tr>
                    <td>
                        <div class="font-medium">${Utils.escapeHTML(event.title)}</div>
                        ${event.location ? `<div class="text-muted text-sm">📍 ${Utils.escapeHTML(event.location)}</div>` : ''}
                    </td>
                    <td class="hide-mobile">
                        <div class="text-muted">
                            ${Utils.truncateText(Utils.escapeHTML(event.description), 100)}
                        </div>
                    </td>
                    <td>
                        <div class="font-medium">${Utils.formatDate(event.date, { month: 'short', day: 'numeric' })}</div>
                        <div class="text-muted text-sm">${Utils.formatDate(event.date, { hour: '2-digit', minute: '2-digit' })}</div>
                    </td>
                    <td class="hide-mobile">
                        <span class="badge ${statusClass}">${status}</span>
                    </td>
                    <td>
                        <div class="flex gap-2">
                            <button class="btn btn-sm btn-secondary" onclick="Events.showEditModal('${event.id}')" title="Edit">
                                <i data-feather="edit-2"></i>
                            </button>
                            <button class="btn btn-sm btn-error" onclick="Events.deleteEvent('${event.id}')" title="Delete">
                                <i data-feather="trash-2"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    static getEventStatus(eventDate) {
        const now = new Date();
        const event = new Date(eventDate);
        const eventEnd = new Date(event.getTime() + (4 * 60 * 60 * 1000)); // Assume 4 hours duration
        
        if (now < event) return 'upcoming';
        if (now >= event && now <= eventEnd) return 'ongoing';
        return 'completed';
    }

    static getStatusClass(status) {
        switch (status) {
            case 'upcoming': return 'badge-info';
            case 'ongoing': return 'badge-success';
            case 'completed': return 'badge-warning';
            default: return 'badge-info';
        }
    }

    static showCreateModal() {
        const content = `
            <form id="eventForm" onsubmit="Events.handleSubmit(event)">
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Title *</label>
                        <input type="text" class="form-input" name="title" required>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Location</label>
                        <input type="text" class="form-input" name="location" placeholder="e.g., Main Auditorium">
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Description *</label>
                    <textarea class="form-textarea" name="description" rows="4" required></textarea>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Date *</label>
                        <input type="date" class="form-input" name="date" required>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Time *</label>
                        <input type="time" class="form-input" name="time" required>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Duration (hours)</label>
                        <input type="number" class="form-input" name="duration" min="0.5" step="0.5" value="2">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Category</label>
                        <select class="form-select" name="category">
                            <option value="academic">Academic</option>
                            <option value="cultural">Cultural</option>
                            <option value="sports">Sports</option>
                            <option value="seminar">Seminar</option>
                            <option value="workshop">Workshop</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Event Image URL</label>
                    <input type="url" class="form-input" name="image" placeholder="https://example.com/image.jpg">
                </div>
                
                <div class="form-group">
                    <label class="form-label">Registration Required</label>
                    <select class="form-select" name="registrationRequired">
                        <option value="false">No</option>
                        <option value="true">Yes</option>
                    </select>
                </div>
                
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" onclick="Utils.hideModal()">Cancel</button>
                    <button type="submit" class="btn btn-primary">Create Event</button>
                </div>
            </form>
        `;
        
        Utils.showModal('Create Event', content, { size: 'lg' });
    }

    static showEditModal(id) {
        const event = storage.findById('events', id);
        if (!event) {
            Utils.showToast('Event not found', 'error');
            return;
        }

        // Extract date and time from event date
        const eventDate = new Date(event.date);
        const dateStr = eventDate.toISOString().split('T')[0];
        const timeStr = eventDate.toTimeString().slice(0, 5);

        const content = `
            <form id="eventForm" onsubmit="Events.handleSubmit(event, '${id}')">
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Title *</label>
                        <input type="text" class="form-input" name="title" value="${Utils.escapeHTML(event.title)}" required>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Location</label>
                        <input type="text" class="form-input" name="location" value="${Utils.escapeHTML(event.location || '')}" placeholder="e.g., Main Auditorium">
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Description *</label>
                    <textarea class="form-textarea" name="description" rows="4" required>${Utils.escapeHTML(event.description)}</textarea>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Date *</label>
                        <input type="date" class="form-input" name="date" value="${dateStr}" required>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Time *</label>
                        <input type="time" class="form-input" name="time" value="${timeStr}" required>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Duration (hours)</label>
                        <input type="number" class="form-input" name="duration" min="0.5" step="0.5" value="${event.duration || 2}">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Category</label>
                        <select class="form-select" name="category">
                            <option value="academic" ${event.category === 'academic' ? 'selected' : ''}>Academic</option>
                            <option value="cultural" ${event.category === 'cultural' ? 'selected' : ''}>Cultural</option>
                            <option value="sports" ${event.category === 'sports' ? 'selected' : ''}>Sports</option>
                            <option value="seminar" ${event.category === 'seminar' ? 'selected' : ''}>Seminar</option>
                            <option value="workshop" ${event.category === 'workshop' ? 'selected' : ''}>Workshop</option>
                            <option value="other" ${event.category === 'other' ? 'selected' : ''}>Other</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Event Image URL</label>
                    <input type="url" class="form-input" name="image" value="${event.image || ''}" placeholder="https://example.com/image.jpg">
                </div>
                
                <div class="form-group">
                    <label class="form-label">Registration Required</label>
                    <select class="form-select" name="registrationRequired">
                        <option value="false" ${event.registrationRequired !== true ? 'selected' : ''}>No</option>
                        <option value="true" ${event.registrationRequired === true ? 'selected' : ''}>Yes</option>
                    </select>
                </div>
                
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" onclick="Utils.hideModal()">Cancel</button>
                    <button type="submit" class="btn btn-primary">Update Event</button>
                </div>
            </form>
        `;
        
        Utils.showModal('Edit Event', content, { size: 'lg' });
    }

    static handleSubmit(event, id = null) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const date = formData.get('date');
        const time = formData.get('time');
        
        const data = {
            title: formData.get('title').trim(),
            description: formData.get('description').trim(),
            location: formData.get('location').trim(),
            date: new Date(`${date}T${time}`).toISOString(),
            duration: parseFloat(formData.get('duration')) || 2,
            category: formData.get('category'),
            image: formData.get('image').trim(),
            registrationRequired: formData.get('registrationRequired') === 'true'
        };

        // Validation
        if (!data.title || !data.description || !date || !time) {
            Utils.showToast('Please fill in all required fields', 'error');
            return;
        }

        if (data.image && !Utils.isValidURL(data.image)) {
            Utils.showToast('Please enter a valid image URL', 'error');
            return;
        }

        try {
            if (id) {
                // Update existing event
                const updated = storage.update('events', id, data);
                if (updated) {
                    Utils.showToast('Event updated successfully!');
                    Utils.hideModal();
                    this.refreshTable();
                } else {
                    Utils.showToast('Failed to update event', 'error');
                }
            } else {
                // Create new event
                const created = storage.add('events', data);
                if (created) {
                    Utils.showToast('Event created successfully!');
                    Utils.hideModal();
                    this.refreshTable();
                } else {
                    Utils.showToast('Failed to create event', 'error');
                }
            }
        } catch (error) {
            console.error('Error saving event:', error);
            Utils.showToast('An error occurred while saving', 'error');
        }
    }

    static deleteEvent(id) {
        const event = storage.findById('events', id);
        if (!event) {
            Utils.showToast('Event not found', 'error');
            return;
        }

        Utils.showConfirmation(
            'Delete Event',
            `Are you sure you want to delete "${event.title}"? This action cannot be undone.`,
            () => {
                try {
                    const deleted = storage.delete('events', id);
                    if (deleted) {
                        Utils.showToast('Event deleted successfully!');
                        this.refreshTable();
                    } else {
                        Utils.showToast('Failed to delete event', 'error');
                    }
                } catch (error) {
                    console.error('Error deleting event:', error);
                    Utils.showToast('An error occurred while deleting', 'error');
                }
            }
        );
    }

    static handleSearch(query) {
        const events = storage.search('events', query, ['title', 'description', 'location']);
        this.updateTable(events);
    }

    static handleStatusFilter(status) {
        let events = storage.getAll('events');
        if (status) {
            events = events.filter(event => this.getEventStatus(event.date) === status);
        }
        this.updateTable(events);
    }

    static updateTable(events) {
        const tbody = document.querySelector('#eventsTable tbody');
        tbody.innerHTML = this.renderEventsTable(events);
        feather.replace();
    }

    static refreshTable() {
        const events = storage.getAll('events');
        this.updateTable(events);
    }
}

// Make Events available globally
window.Events = Events;
