// Student Suggestions module
class Suggestions {
    static render(container) {
        const suggestions = storage.getAll('suggestions');
        
        container.innerHTML = `
            <div class="page-header mb-4">
                <div class="flex justify-between items-center">
                    <h2 class="text-2xl font-bold">Student Suggestions</h2>
                    <div class="flex gap-2">
                        <button class="btn btn-secondary" onclick="Suggestions.markAllAsRead()">
                            <i data-feather="check-circle"></i>
                            Mark All Read
                        </button>
                        <button class="btn btn-error" onclick="Suggestions.deleteAll()">
                            <i data-feather="trash-2"></i>
                            Clear All
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="mb-4">
                <div class="flex gap-4 items-center">
                    <input type="search" class="form-input" placeholder="Search suggestions..." 
                           style="max-width: 300px;" onkeyup="Suggestions.handleSearch(this.value)">
                    <select class="form-select" style="max-width: 200px;" onchange="Suggestions.handleStatusFilter(this.value)">
                        <option value="">All Status</option>
                        <option value="unread">Unread</option>
                        <option value="read">Read</option>
                        <option value="resolved">Resolved</option>
                    </select>
                    <select class="form-select" style="max-width: 200px;" onchange="Suggestions.handleCategoryFilter(this.value)">
                        <option value="">All Categories</option>
                        <option value="academic">Academic</option>
                        <option value="facilities">Facilities</option>
                        <option value="services">Services</option>
                        <option value="events">Events</option>
                        <option value="other">Other</option>
                    </select>
                </div>
            </div>
            
            <div class="suggestions-container" id="suggestionsContainer">
                ${this.renderSuggestions(suggestions)}
            </div>
        `;
    }

    static renderSuggestions(suggestions) {
        if (suggestions.length === 0) {
            return `
                <div class="empty-state">
                    <div class="empty-state-icon">
                        <i data-feather="message-circle"></i>
                    </div>
                    <div class="empty-state-title">No Student Suggestions</div>
                    <div class="empty-state-desc">Student feedback and suggestions will appear here.</div>
                    <button class="btn btn-primary mt-3" onclick="Suggestions.showAddSampleModal()">
                        <i data-feather="plus"></i>
                        Add Sample Suggestion
                    </button>
                </div>
            `;
        }

        // Sort suggestions by date (newest first) and status (unread first)
        const sortedSuggestions = suggestions.sort((a, b) => {
            if (a.status !== b.status) {
                const statusPriority = { unread: 0, read: 1, resolved: 2 };
                return statusPriority[a.status || 'unread'] - statusPriority[b.status || 'unread'];
            }
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

        const suggestionCards = sortedSuggestions.map(suggestion => `
            <div class="suggestion-card card ${suggestion.status === 'unread' ? 'unread' : ''}" data-id="${suggestion.id}">
                <div class="suggestion-header">
                    <div class="suggestion-meta">
                        <div class="suggestion-author">
                            <div class="author-avatar">
                                <i data-feather="user"></i>
                            </div>
                            <div class="author-info">
                                <div class="author-name">${Utils.escapeHTML(suggestion.name)}</div>
                                <div class="author-email">${Utils.escapeHTML(suggestion.email)}</div>
                            </div>
                        </div>
                        <div class="suggestion-status-actions">
                            <span class="badge ${this.getStatusBadgeClass(suggestion.status || 'unread')}">${suggestion.status || 'unread'}</span>
                            <div class="suggestion-date">${Utils.formatRelativeTime(suggestion.createdAt)}</div>
                        </div>
                    </div>
                </div>
                
                <div class="suggestion-body">
                    ${suggestion.subject ? `<h4 class="suggestion-subject">${Utils.escapeHTML(suggestion.subject)}</h4>` : ''}
                    <div class="suggestion-message">${Utils.escapeHTML(suggestion.message).replace(/\n/g, '<br>')}</div>
                    ${suggestion.category ? `<div class="suggestion-category">
                        <span class="badge badge-info">${Utils.escapeHTML(suggestion.category)}</span>
                    </div>` : ''}
                </div>
                
                <div class="suggestion-actions">
                    ${suggestion.status !== 'read' ? `
                        <button class="btn btn-sm btn-secondary" onclick="Suggestions.markAsRead('${suggestion.id}')" title="Mark as Read">
                            <i data-feather="eye"></i>
                        </button>
                    ` : ''}
                    ${suggestion.status !== 'resolved' ? `
                        <button class="btn btn-sm btn-success" onclick="Suggestions.markAsResolved('${suggestion.id}')" title="Mark as Resolved">
                            <i data-feather="check"></i>
                        </button>
                    ` : ''}
                    <button class="btn btn-sm btn-info" onclick="Suggestions.replyToSuggestion('${suggestion.id}')" title="Reply">
                        <i data-feather="reply"></i>
                    </button>
                    <button class="btn btn-sm btn-error" onclick="Suggestions.deleteSuggestion('${suggestion.id}')" title="Delete">
                        <i data-feather="trash-2"></i>
                    </button>
                </div>
            </div>
        `).join('');

        return `
            <style>
                .suggestions-container {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-md);
                }
                
                .suggestion-card {
                    padding: var(--spacing-lg);
                    transition: transform var(--transition-fast), box-shadow var(--transition-fast);
                    border-left: 4px solid var(--border-color);
                }
                
                .suggestion-card.unread {
                    border-left-color: var(--primary-color);
                    background-color: rgba(37, 99, 235, 0.02);
                }
                
                .suggestion-card:hover {
                    transform: translateY(-1px);
                    box-shadow: var(--shadow-md);
                }
                
                .suggestion-header {
                    margin-bottom: var(--spacing-md);
                }
                
                .suggestion-meta {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    gap: var(--spacing-md);
                }
                
                .suggestion-author {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-md);
                }
                
                .author-avatar {
                    width: 2.5rem;
                    height: 2.5rem;
                    background-color: var(--bg-tertiary);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--text-muted);
                    flex-shrink: 0;
                }
                
                .author-info {
                    display: flex;
                    flex-direction: column;
                }
                
                .author-name {
                    font-weight: 600;
                    color: var(--text-primary);
                }
                
                .author-email {
                    font-size: 0.875rem;
                    color: var(--text-muted);
                }
                
                .suggestion-status-actions {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                    gap: var(--spacing-xs);
                }
                
                .suggestion-date {
                    font-size: 0.75rem;
                    color: var(--text-muted);
                }
                
                .suggestion-body {
                    margin-bottom: var(--spacing-lg);
                }
                
                .suggestion-subject {
                    font-size: 1.125rem;
                    font-weight: 600;
                    color: var(--text-primary);
                    margin-bottom: var(--spacing-sm);
                }
                
                .suggestion-message {
                    color: var(--text-secondary);
                    line-height: 1.6;
                    margin-bottom: var(--spacing-md);
                }
                
                .suggestion-category {
                    margin-top: var(--spacing-sm);
                }
                
                .suggestion-actions {
                    display: flex;
                    gap: var(--spacing-sm);
                    justify-content: flex-end;
                }
                
                @media (max-width: 767px) {
                    .suggestion-meta {
                        flex-direction: column;
                        align-items: flex-start;
                    }
                    
                    .suggestion-status-actions {
                        align-items: flex-start;
                        flex-direction: row;
                        gap: var(--spacing-md);
                    }
                    
                    .suggestion-actions {
                        justify-content: flex-start;
                        flex-wrap: wrap;
                    }
                }
            </style>
            ${suggestionCards}
        `;
    }

    static getStatusBadgeClass(status) {
        switch (status) {
            case 'unread': return 'badge-warning';
            case 'read': return 'badge-info';
            case 'resolved': return 'badge-success';
            default: return 'badge-warning';
        }
    }

    static showAddSampleModal() {
        const content = `
            <form id="sampleSuggestionForm" onsubmit="Suggestions.handleAddSample(event)">
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Student Name *</label>
                        <input type="text" class="form-input" name="name" required placeholder="John Doe">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Email *</label>
                        <input type="email" class="form-input" name="email" required placeholder="student@college.edu">
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Subject</label>
                    <input type="text" class="form-input" name="subject" placeholder="Subject of the suggestion">
                </div>
                
                <div class="form-group">
                    <label class="form-label">Category</label>
                    <select class="form-select" name="category">
                        <option value="other">Other</option>
                        <option value="academic">Academic</option>
                        <option value="facilities">Facilities</option>
                        <option value="services">Services</option>
                        <option value="events">Events</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Message *</label>
                    <textarea class="form-textarea" name="message" rows="4" required placeholder="Your suggestion or feedback..."></textarea>
                </div>
                
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" onclick="Utils.hideModal()">Cancel</button>
                    <button type="submit" class="btn btn-primary">Add Suggestion</button>
                </div>
            </form>
        `;
        
        Utils.showModal('Add Sample Suggestion', content, { size: 'md' });
    }

    static handleAddSample(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const data = {
            name: formData.get('name').trim(),
            email: formData.get('email').trim(),
            subject: formData.get('subject').trim(),
            message: formData.get('message').trim(),
            category: formData.get('category'),
            status: 'unread'
        };

        // Validation
        if (!data.name || !data.email || !data.message) {
            Utils.showToast('Please fill in all required fields', 'error');
            return;
        }

        if (!Utils.isValidEmail(data.email)) {
            Utils.showToast('Please enter a valid email address', 'error');
            return;
        }

        try {
            const created = storage.add('suggestions', data);
            if (created) {
                Utils.showToast('Sample suggestion added successfully!');
                Utils.hideModal();
                this.refreshSuggestions();
            } else {
                Utils.showToast('Failed to add suggestion', 'error');
            }
        } catch (error) {
            console.error('Error adding suggestion:', error);
            Utils.showToast('An error occurred while saving', 'error');
        }
    }

    static markAsRead(id) {
        try {
            const updated = storage.update('suggestions', id, { status: 'read' });
            if (updated) {
                Utils.showToast('Marked as read');
                this.refreshSuggestions();
            } else {
                Utils.showToast('Failed to update status', 'error');
            }
        } catch (error) {
            console.error('Error updating suggestion:', error);
            Utils.showToast('An error occurred while updating', 'error');
        }
    }

    static markAsResolved(id) {
        const suggestion = storage.findById('suggestions', id);
        if (!suggestion) {
            Utils.showToast('Suggestion not found', 'error');
            return;
        }

        Utils.showConfirmation(
            'Mark as Resolved',
            `Mark this suggestion from ${suggestion.name} as resolved?`,
            () => {
                try {
                    const updated = storage.update('suggestions', id, { 
                        status: 'resolved',
                        resolvedAt: new Date().toISOString()
                    });
                    if (updated) {
                        Utils.showToast('Marked as resolved');
                        this.refreshSuggestions();
                    } else {
                        Utils.showToast('Failed to update status', 'error');
                    }
                } catch (error) {
                    console.error('Error updating suggestion:', error);
                    Utils.showToast('An error occurred while updating', 'error');
                }
            }
        );
    }

    static replyToSuggestion(id) {
        const suggestion = storage.findById('suggestions', id);
        if (!suggestion) {
            Utils.showToast('Suggestion not found', 'error');
            return;
        }

        const content = `
            <form id="replyForm" onsubmit="Suggestions.handleReply(event, '${id}')">
                <div class="mb-4">
                    <h4>Original Message</h4>
                    <div class="card" style="background-color: var(--bg-secondary); padding: var(--spacing-md);">
                        <div class="text-sm text-muted mb-2">From: ${Utils.escapeHTML(suggestion.name)} (${Utils.escapeHTML(suggestion.email)})</div>
                        ${suggestion.subject ? `<div class="font-medium mb-2">${Utils.escapeHTML(suggestion.subject)}</div>` : ''}
                        <div>${Utils.escapeHTML(suggestion.message).replace(/\n/g, '<br>')}</div>
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Reply Message *</label>
                    <textarea class="form-textarea" name="reply" rows="6" required 
                              placeholder="Thank you for your suggestion. We will review it and take appropriate action..."></textarea>
                </div>
                
                <div class="form-group">
                    <label class="form-label">
                        <input type="checkbox" name="markAsResolved" style="margin-right: var(--spacing-sm);">
                        Mark as resolved after sending reply
                    </label>
                </div>
                
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" onclick="Utils.hideModal()">Cancel</button>
                    <button type="submit" class="btn btn-primary">Send Reply</button>
                </div>
            </form>
        `;
        
        Utils.showModal('Reply to Suggestion', content, { size: 'lg' });
    }

    static handleReply(event, id) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const replyMessage = formData.get('reply').trim();
        const markAsResolved = formData.get('markAsResolved');
        
        if (!replyMessage) {
            Utils.showToast('Please enter a reply message', 'error');
            return;
        }

        try {
            const updateData = {
                reply: replyMessage,
                repliedAt: new Date().toISOString(),
                status: markAsResolved ? 'resolved' : 'read'
            };
            
            if (markAsResolved) {
                updateData.resolvedAt = new Date().toISOString();
            }

            const updated = storage.update('suggestions', id, updateData);
            if (updated) {
                Utils.showToast('Reply sent successfully!');
                Utils.hideModal();
                this.refreshSuggestions();
                
                // In a real application, you would send an email here
                console.log('Reply would be sent via email:', {
                    to: updated.email,
                    subject: `Re: ${updated.subject || 'Your suggestion'}`,
                    message: replyMessage
                });
            } else {
                Utils.showToast('Failed to send reply', 'error');
            }
        } catch (error) {
            console.error('Error sending reply:', error);
            Utils.showToast('An error occurred while sending reply', 'error');
        }
    }

    static deleteSuggestion(id) {
        const suggestion = storage.findById('suggestions', id);
        if (!suggestion) {
            Utils.showToast('Suggestion not found', 'error');
            return;
        }

        Utils.showConfirmation(
            'Delete Suggestion',
            `Are you sure you want to delete the suggestion from ${suggestion.name}? This action cannot be undone.`,
            () => {
                try {
                    const deleted = storage.delete('suggestions', id);
                    if (deleted) {
                        Utils.showToast('Suggestion deleted successfully!');
                        this.refreshSuggestions();
                    } else {
                        Utils.showToast('Failed to delete suggestion', 'error');
                    }
                } catch (error) {
                    console.error('Error deleting suggestion:', error);
                    Utils.showToast('An error occurred while deleting', 'error');
                }
            }
        );
    }

    static markAllAsRead() {
        const suggestions = storage.getAll('suggestions');
        const unreadSuggestions = suggestions.filter(s => s.status === 'unread');
        
        if (unreadSuggestions.length === 0) {
            Utils.showToast('No unread suggestions to mark', 'info');
            return;
        }

        Utils.showConfirmation(
            'Mark All as Read',
            `Mark ${unreadSuggestions.length} suggestion(s) as read?`,
            () => {
                try {
                    let updated = 0;
                    unreadSuggestions.forEach(suggestion => {
                        if (storage.update('suggestions', suggestion.id, { status: 'read' })) {
                            updated++;
                        }
                    });
                    
                    Utils.showToast(`${updated} suggestion(s) marked as read`);
                    this.refreshSuggestions();
                } catch (error) {
                    console.error('Error marking suggestions as read:', error);
                    Utils.showToast('An error occurred while updating', 'error');
                }
            }
        );
    }

    static deleteAll() {
        const suggestions = storage.getAll('suggestions');
        
        if (suggestions.length === 0) {
            Utils.showToast('No suggestions to delete', 'info');
            return;
        }

        Utils.showConfirmation(
            'Delete All Suggestions',
            `Are you sure you want to delete all ${suggestions.length} suggestion(s)? This action cannot be undone.`,
            () => {
                try {
                    storage.set('suggestions', []);
                    Utils.showToast('All suggestions deleted successfully!');
                    this.refreshSuggestions();
                } catch (error) {
                    console.error('Error deleting suggestions:', error);
                    Utils.showToast('An error occurred while deleting', 'error');
                }
            }
        );
    }

    static handleSearch(query) {
        const suggestions = storage.search('suggestions', query, ['name', 'email', 'subject', 'message']);
        this.updateSuggestions(suggestions);
    }

    static handleStatusFilter(status) {
        let suggestions = storage.getAll('suggestions');
        if (status) {
            suggestions = suggestions.filter(s => (s.status || 'unread') === status);
        }
        this.updateSuggestions(suggestions);
    }

    static handleCategoryFilter(category) {
        let suggestions = storage.getAll('suggestions');
        if (category) {
            suggestions = suggestions.filter(s => s.category === category);
        }
        this.updateSuggestions(suggestions);
    }

    static updateSuggestions(suggestions) {
        const container = document.getElementById('suggestionsContainer');
        container.innerHTML = this.renderSuggestions(suggestions);
        feather.replace();
    }

    static refreshSuggestions() {
        const suggestions = storage.getAll('suggestions');
        this.updateSuggestions(suggestions);
    }
}

// Make Suggestions available globally
window.Suggestions = Suggestions;
