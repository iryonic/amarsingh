// Dashboard module
class Dashboard {
    static render(container) {
        const stats = storage.getStats();
        const recentActivity = this.getRecentActivity();
        
        container.innerHTML = `
            <div class="page-header mb-4">
                <h2 class="text-2xl font-bold">Dashboard Overview</h2>
                <div class="header-actions">
                    <button class="btn btn-secondary" onclick="Dashboard.refreshStats()">
                        <i data-feather="refresh-cw"></i>
                        Refresh
                    </button>
                </div>
            </div>
            
            <div class="dashboard-stats">
                <div class="stat-card">
                    <div class="stat-card-header">
                        <div class="stat-card-title">Total Faculty</div>
                        <div class="stat-card-icon faculty">
                            <i data-feather="users"></i>
                        </div>
                    </div>
                    <div class="stat-card-value">${stats.totalFaculty}</div>
                    <div class="stat-card-change">
                        <span class="change-label">Active Members</span>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-card-header">
                        <div class="stat-card-title">Departments</div>
                        <div class="stat-card-icon departments">
                            <i data-feather="grid"></i>
                        </div>
                    </div>
                    <div class="stat-card-value">${stats.totalDepartments}</div>
                    <div class="stat-card-change">
                        <span class="change-label">Active Departments</span>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-card-header">
                        <div class="stat-card-title">Events</div>
                        <div class="stat-card-icon events">
                            <i data-feather="calendar"></i>
                        </div>
                    </div>
                    <div class="stat-card-value">${stats.totalEvents}</div>
                    <div class="stat-card-change">
                        <span class="change-label">Scheduled Events</span>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-card-header">
                        <div class="stat-card-title">Notifications</div>
                        <div class="stat-card-icon notifications">
                            <i data-feather="bell"></i>
                        </div>
                    </div>
                    <div class="stat-card-value">${stats.totalNotifications}</div>
                    <div class="stat-card-change">
                        <span class="change-label">Active Announcements</span>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-card-header">
                        <div class="stat-card-title">Gallery Images</div>
                        <div class="stat-card-icon gallery">
                            <i data-feather="image"></i>
                        </div>
                    </div>
                    <div class="stat-card-value">${stats.totalGalleryImages}</div>
                    <div class="stat-card-change">
                        <span class="change-label">Total Images</span>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-card-header">
                        <div class="stat-card-title">Student Messages</div>
                        <div class="stat-card-icon messages">
                            <i data-feather="message-circle"></i>
                        </div>
                    </div>
                    <div class="stat-card-value">${stats.totalStudentMessages}</div>
                    <div class="stat-card-change">
                        <span class="change-label ${stats.totalStudentMessages > 0 ? 'attention' : ''}">${stats.totalStudentMessages > 0 ? 'Needs Attention' : 'All Handled'}</span>
                    </div>
                </div>
            </div>
            
            <div class="dashboard-content">
                <div class="dashboard-section">
                    <div class="recent-activity">
                        <div class="section-header">
                            <h3 class="section-title">Recent Activity</h3>
                            <button class="btn btn-secondary btn-sm" onclick="Dashboard.refreshActivity()">
                                <i data-feather="refresh-cw"></i>
                                Refresh
                            </button>
                        </div>
                        <div class="recent-activity-body">
                            ${this.renderRecentActivity(recentActivity)}
                        </div>
                    </div>
                </div>
                
                <div class="dashboard-section">
                    <div class="quick-actions">
                        <div class="section-header">
                            <h3 class="section-title">Quick Actions</h3>
                        </div>
                        <div class="quick-actions-grid">
                            <button class="quick-action-btn" onclick="app.loadPage('notifications'); setTimeout(() => Notifications.showCreateModal(), 100);">
                                <div class="quick-action-icon">
                                    <i data-feather="bell"></i>
                                </div>
                                <div class="quick-action-content">
                                    <div class="quick-action-title">Add Notification</div>
                                    <div class="quick-action-desc">Create announcement</div>
                                </div>
                            </button>
                            
                            <button class="quick-action-btn" onclick="app.loadPage('events'); setTimeout(() => Events.showCreateModal(), 100);">
                                <div class="quick-action-icon">
                                    <i data-feather="calendar"></i>
                                </div>
                                <div class="quick-action-content">
                                    <div class="quick-action-title">Add Event</div>
                                    <div class="quick-action-desc">Schedule a new event</div>
                                </div>
                            </button>
                            
                            <button class="quick-action-btn" onclick="app.loadPage('faculty'); setTimeout(() => Faculty.showCreateModal(), 100);">
                                <div class="quick-action-icon">
                                    <i data-feather="user-plus"></i>
                                </div>
                                <div class="quick-action-content">
                                    <div class="quick-action-title">Add Faculty</div>
                                    <div class="quick-action-desc">Register new faculty member</div>
                                </div>
                            </button>
                            
                            <button class="quick-action-btn" onclick="app.loadPage('gallery'); setTimeout(() => Gallery.showUploadModal(), 100);">
                                <div class="quick-action-icon">
                                    <i data-feather="upload"></i>
                                </div>
                                <div class="quick-action-content">
                                    <div class="quick-action-title">Upload Images</div>
                                    <div class="quick-action-desc">Add photos to gallery</div>
                                </div>
                            </button>
                            
                            <button class="quick-action-btn" onclick="app.loadPage('suggestions');">
                                <div class="quick-action-icon">
                                    <i data-feather="message-circle"></i>
                                </div>
                                <div class="quick-action-content">
                                    <div class="quick-action-title">Student Messages</div>
                                    <div class="quick-action-desc">Review student feedback</div>
                                </div>
                            </button>
                            
                            <button class="quick-action-btn" onclick="app.loadPage('landing-page');">
                                <div class="quick-action-icon">
                                    <i data-feather="layout"></i>
                                </div>
                                <div class="quick-action-content">
                                    <div class="quick-action-title">Update Homepage</div>
                                    <div class="quick-action-desc">Edit landing page content</div>
                                </div>
                            </button>
                            
                            <button class="quick-action-btn" onclick="app.loadPage('departments'); setTimeout(() => Departments.showCreateModal(), 100);">
                                <div class="quick-action-icon">
                                    <i data-feather="grid"></i>
                                </div>
                                <div class="quick-action-content">
                                    <div class="quick-action-title">Add Department</div>
                                    <div class="quick-action-desc">Create new department</div>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <style>
                .dashboard-stats {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: var(--spacing-lg);
                    margin-bottom: var(--spacing-2xl);
                }
                
                .stat-card {
                    background: var(--bg-primary);
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius-lg);
                    padding: var(--spacing-lg);
                    transition: all var(--transition-normal);
                    position: relative;
                    overflow: hidden;
                }
                
                .stat-card:hover {
                    transform: translateY(-2px);
                    box-shadow: var(--shadow-lg);
                    border-color: var(--primary-color-light);
                }
                
                .stat-card-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: var(--spacing-md);
                }
                
                .stat-card-title {
                    font-size: 0.875rem;
                    font-weight: 500;
                    color: var(--text-secondary);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                
                .stat-card-icon {
                    width: 2.5rem;
                    height: 2.5rem;
                    border-radius: var(--radius-md);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                }
                
                .stat-card-icon.faculty { background: linear-gradient(135deg, #3b82f6, #1d4ed8); }
                .stat-card-icon.departments { background: linear-gradient(135deg, #10b981, #059669); }
                .stat-card-icon.events { background: linear-gradient(135deg, #f59e0b, #d97706); }
                .stat-card-icon.notifications { background: linear-gradient(135deg, #ef4444, #dc2626); }
                .stat-card-icon.gallery { background: linear-gradient(135deg, #8b5cf6, #7c3aed); }
                .stat-card-icon.messages { background: linear-gradient(135deg, #06b6d4, #0891b2); }
                
                .stat-card-value {
                    font-size: 2rem;
                    font-weight: 700;
                    color: var(--text-primary);
                    line-height: 1;
                    margin-bottom: var(--spacing-sm);
                }
                
                .stat-card-change {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-xs);
                }
                
                .change-label {
                    font-size: 0.75rem;
                    color: var(--text-muted);
                    font-weight: 500;
                }
                
                .change-label.attention {
                    color: var(--warning-color);
                    font-weight: 600;
                }
                
                .dashboard-content {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: var(--spacing-xl);
                }
                
                .dashboard-section {
                    background: var(--bg-primary);
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius-lg);
                    overflow: hidden;
                }
                
                .section-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: var(--spacing-lg);
                    border-bottom: 1px solid var(--border-color);
                    background: var(--bg-secondary);
                }
                
                .section-title {
                    font-size: 1.125rem;
                    font-weight: 600;
                    color: var(--text-primary);
                    margin: 0;
                }
                
                .recent-activity-body {
                    padding: var(--spacing-lg);
                    max-height: 400px;
                    overflow-y: auto;
                }
                
                .activity-item {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-md);
                    padding: var(--spacing-md) 0;
                    border-bottom: 1px solid var(--border-light);
                }
                
                .activity-item:last-child {
                    border-bottom: none;
                }
                
                .activity-icon {
                    width: 2rem;
                    height: 2rem;
                    background: var(--bg-tertiary);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--text-muted);
                    flex-shrink: 0;
                }
                
                .activity-content {
                    flex: 1;
                }
                
                .activity-title {
                    font-size: 0.875rem;
                    color: var(--text-primary);
                    margin-bottom: var(--spacing-xs);
                }
                
                .activity-time {
                    font-size: 0.75rem;
                    color: var(--text-muted);
                }
                
                .quick-actions-grid {
                    display: grid;
                    gap: var(--spacing-sm);
                    padding: var(--spacing-lg);
                }
                
                .quick-action-btn {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-md);
                    padding: var(--spacing-md);
                    background: var(--bg-secondary);
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius-md);
                    text-decoration: none;
                    color: var(--text-primary);
                    transition: all var(--transition-fast);
                    cursor: pointer;
                }
                
                .quick-action-btn:hover {
                    background: var(--bg-tertiary);
                    border-color: var(--primary-color-light);
                    transform: translateX(2px);
                }
                
                .quick-action-icon {
                    width: 2rem;
                    height: 2rem;
                    background: var(--primary-color);
                    border-radius: var(--radius-sm);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    flex-shrink: 0;
                }
                
                .quick-action-content {
                    flex: 1;
                }
                
                .quick-action-title {
                    font-weight: 500;
                    color: var(--text-primary);
                    margin-bottom: var(--spacing-xs);
                }
                
                .quick-action-desc {
                    font-size: 0.75rem;
                    color: var(--text-muted);
                }
                
                @media (max-width: 991px) {
                    .dashboard-content {
                        grid-template-columns: 1fr;
                    }
                    
                    .dashboard-stats {
                        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
                    }
                }
                
                @media (max-width: 767px) {
                    .dashboard-stats {
                        grid-template-columns: 1fr 1fr;
                    }
                    
                    .stat-card {
                        padding: var(--spacing-md);
                    }
                    
                    .stat-card-value {
                        font-size: 1.5rem;
                    }
                }
            </style>
        `;
    }

    static getRecentActivity() {
        const activities = [];
        
        // Get recent items from all collections
        const collections = ['notifications', 'events', 'faculty', 'gallery', 'departments', 'suggestions'];
        
        collections.forEach(collection => {
            const items = storage.getAll(collection);
            items.forEach(item => {
                activities.push({
                    type: collection,
                    item: item,
                    timestamp: item.updatedAt || item.createdAt
                });
            });
        });
        
        // Sort by timestamp (most recent first)
        activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        // Return only the most recent 10 activities
        return activities.slice(0, 10);
    }

    static renderRecentActivity(activities) {
        if (activities.length === 0) {
            return `
                <div class="empty-state">
                    <div class="empty-state-icon">
                        <i data-feather="activity"></i>
                    </div>
                    <div class="empty-state-title">No Recent Activity</div>
                    <div class="empty-state-desc">Start managing your college content to see activity here.</div>
                </div>
            `;
        }

        return activities.map(activity => {
            const icon = this.getActivityIcon(activity.type);
            const title = this.getActivityTitle(activity);
            const time = Utils.formatRelativeTime(activity.timestamp);
            
            return `
                <div class="activity-item">
                    <div class="activity-icon">
                        <i data-feather="${icon}"></i>
                    </div>
                    <div class="activity-content">
                        <div class="activity-title">${title}</div>
                        <div class="activity-time">${time}</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    static getActivityIcon(type) {
        const icons = {
            notifications: 'bell',
            events: 'calendar',
            faculty: 'users',
            gallery: 'image',
            departments: 'home',
            suggestions: 'message-circle'
        };
        return icons[type] || 'activity';
    }

    static getActivityTitle(activity) {
        const { type, item } = activity;
        const actionText = item.updatedAt !== item.createdAt ? 'updated' : 'created';
        
        switch (type) {
            case 'notifications':
                return `Notification "${Utils.truncateText(item.title, 30)}" ${actionText}`;
            case 'events':
                return `Event "${Utils.truncateText(item.title, 30)}" ${actionText}`;
            case 'faculty':
                return `Faculty member "${item.name}" ${actionText}`;
            case 'gallery':
                return `Gallery image "${Utils.truncateText(item.title || 'Untitled', 30)}" ${actionText}`;
            case 'departments':
                return `Department "${item.name}" ${actionText}`;
            case 'suggestions':
                return `Student message from ${item.name} received`;
            default:
                return `Item ${actionText}`;
        }
    }

    static refreshStats() {
        Utils.showToast('Refreshing dashboard...');
        setTimeout(() => {
            const container = document.getElementById('contentArea');
            Dashboard.render(container);
            feather.replace();
            Utils.showToast('Dashboard refreshed successfully!');
        }, 500);
    }
    
    static refreshActivity() {
        const activityBody = document.querySelector('.recent-activity-body');
        if (activityBody) {
            activityBody.innerHTML = Utils.createLoadingSpinner();
            
            setTimeout(() => {
                const recentActivity = this.getRecentActivity();
                activityBody.innerHTML = this.renderRecentActivity(recentActivity);
                feather.replace();
                Utils.showToast('Activity refreshed!');
            }, 500);
        }
    }
}

// Make Dashboard available globally
window.Dashboard = Dashboard;
