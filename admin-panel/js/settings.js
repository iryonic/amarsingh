// Settings module
class Settings {
    static render(container) {
        const settings = storage.get('settings') || {};
        const stats = storage.getStats();
        
        container.innerHTML = `
            <div class="page-header mb-4">
                <h2 class="text-2xl font-bold">Settings</h2>
            </div>
            
            <div class="settings-container">
                <div class="settings-section card mb-4">
                    <div class="card-header">
                        <h3 class="card-title">Appearance</h3>
                    </div>
                    <div class="card-body">
                        <div class="form-group">
                            <label class="form-label">Theme</label>
                            <select class="form-select" id="themeSelect" onchange="Settings.updateTheme(this.value)">
                                <option value="light" ${settings.theme === 'light' ? 'selected' : ''}>Light</option>
                                <option value="dark" ${settings.theme === 'dark' ? 'selected' : ''}>Dark</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">
                                <input type="checkbox" id="sidebarCollapsed" ${settings.sidebarCollapsed ? 'checked' : ''} 
                                       onchange="Settings.updateSidebarSetting(this.checked)" style="margin-right: var(--spacing-sm);">
                                Collapse sidebar by default
                            </label>
                        </div>
                    </div>
                </div>
                
                <div class="settings-section card mb-4">
                    <div class="card-header">
                        <h3 class="card-title">Preferences</h3>
                    </div>
                    <div class="card-body">
                        <div class="form-group">
                            <label class="form-label">
                                <input type="checkbox" id="notifications" ${settings.notifications !== false ? 'checked' : ''} 
                                       onchange="Settings.updateNotifications(this.checked)" style="margin-right: var(--spacing-sm);">
                                Enable notifications
                            </label>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">
                                <input type="checkbox" id="autoSave" ${settings.autoSave !== false ? 'checked' : ''} 
                                       onchange="Settings.updateAutoSave(this.checked)" style="margin-right: var(--spacing-sm);">
                                Auto-save form data
                            </label>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Items per page</label>
                            <select class="form-select" id="itemsPerPage" onchange="Settings.updateItemsPerPage(this.value)">
                                <option value="10" ${settings.itemsPerPage === 10 ? 'selected' : ''}>10</option>
                                <option value="25" ${settings.itemsPerPage === 25 ? 'selected' : ''}>25</option>
                                <option value="50" ${settings.itemsPerPage === 50 ? 'selected' : ''}>50</option>
                                <option value="100" ${settings.itemsPerPage === 100 ? 'selected' : ''}>100</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <div class="settings-section card mb-4">
                    <div class="card-header">
                        <h3 class="card-title">Data Management</h3>
                    </div>
                    <div class="card-body">
                        <div class="data-stats mb-4">
                            <div class="stats-grid">
                                <div class="stat-item">
                                    <div class="stat-value">${stats.totalFaculty + stats.totalDepartments + stats.totalEvents + stats.totalNotifications + stats.totalGalleryImages + stats.totalStudentMessages}</div>
                                    <div class="stat-label">Total Records</div>
                                </div>
                                <div class="stat-item">
                                    <div class="stat-value">${this.calculateStorageSize()}</div>
                                    <div class="stat-label">Storage Used</div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="data-actions">
                            <button class="btn btn-primary" onclick="Settings.exportData()">
                                <i data-feather="download"></i>
                                Export Data
                            </button>
                            
                            <button class="btn btn-secondary" onclick="Settings.showImportModal()">
                                <i data-feather="upload"></i>
                                Import Data
                            </button>
                            
                            <button class="btn btn-warning" onclick="Settings.showBackupModal()">
                                <i data-feather="archive"></i>
                                Create Backup
                            </button>
                            
                            <button class="btn btn-error" onclick="Settings.showClearDataModal()">
                                <i data-feather="trash-2"></i>
                                Clear All Data
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="settings-section card mb-4">
                    <div class="card-header">
                        <h3 class="card-title">System Information</h3>
                    </div>
                    <div class="card-body">
                        <div class="system-info">
                            <div class="info-item">
                                <strong>Application Version:</strong> 1.0.0
                            </div>
                            <div class="info-item">
                                <strong>Last Updated:</strong> ${Utils.formatDate(new Date())}
                            </div>
                            <div class="info-item">
                                <strong>Browser:</strong> ${navigator.userAgent.split(' ')[0]}
                            </div>
                            <div class="info-item">
                                <strong>Local Storage Available:</strong> ${this.checkLocalStorageAvailable() ? 'Yes' : 'No'}
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="settings-section card mb-4">
                    <div class="card-header">
                        <h3 class="card-title">About</h3>
                    </div>
                    <div class="card-body">
                        <div class="about-content">
                            <h4>College Admin Panel</h4>
                            <p>A comprehensive administrative interface for managing college website content, built with vanilla HTML, CSS, and JavaScript.</p>
                            
                            <h5 class="mt-3">Features:</h5>
                            <ul class="feature-list">
                                <li>Dashboard with statistics overview</li>
                                <li>Notifications management</li>
                                <li>Events scheduling and management</li>
                                <li>Faculty member profiles</li>
                                <li>Image gallery management</li>
                                <li>Department information</li>
                                <li>Student suggestions handling</li>
                                <li>Landing page content management</li>
                                <li>Data export/import capabilities</li>
                                <li>Responsive design for all devices</li>
                                <li>Dark/Light theme support</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.addSettingsStyles();
    }

    static addSettingsStyles() {
        if (!document.getElementById('settingsStyles')) {
            const style = document.createElement('style');
            style.id = 'settingsStyles';
            style.textContent = `
                .settings-container {
                    max-width: 800px;
                }
                
                .settings-section {
                    transition: box-shadow var(--transition-fast);
                }
                
                .settings-section:hover {
                    box-shadow: var(--shadow-md);
                }
                
                .data-stats {
                    padding: var(--spacing-md);
                    background-color: var(--bg-secondary);
                    border-radius: var(--radius-md);
                }
                
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                    gap: var(--spacing-lg);
                }
                
                .stat-item {
                    text-align: center;
                }
                
                .stat-value {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: var(--primary-color);
                    line-height: 1;
                    margin-bottom: var(--spacing-xs);
                }
                
                .stat-label {
                    font-size: 0.875rem;
                    color: var(--text-muted);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                
                .data-actions {
                    display: flex;
                    gap: var(--spacing-md);
                    flex-wrap: wrap;
                }
                
                .system-info {
                    display: grid;
                    gap: var(--spacing-sm);
                }
                
                .info-item {
                    padding: var(--spacing-sm) 0;
                    border-bottom: 1px solid var(--border-light);
                    color: var(--text-secondary);
                }
                
                .info-item:last-child {
                    border-bottom: none;
                }
                
                .about-content h4 {
                    color: var(--text-primary);
                    margin-bottom: var(--spacing-sm);
                }
                
                .about-content h5 {
                    color: var(--text-primary);
                    margin-bottom: var(--spacing-sm);
                    font-size: 1rem;
                }
                
                .about-content p {
                    color: var(--text-secondary);
                    line-height: 1.6;
                    margin-bottom: var(--spacing-md);
                }
                
                .feature-list {
                    color: var(--text-secondary);
                    padding-left: var(--spacing-lg);
                }
                
                .feature-list li {
                    margin-bottom: var(--spacing-xs);
                    line-height: 1.5;
                }
                
                @media (max-width: 767px) {
                    .data-actions {
                        flex-direction: column;
                    }
                    
                    .stats-grid {
                        grid-template-columns: 1fr 1fr;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    static updateTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        
        // Update theme icon in topbar
        const themeIcon = document.querySelector('#themeToggle i');
        themeIcon.setAttribute('data-feather', theme === 'dark' ? 'sun' : 'moon');
        feather.replace();
        
        // Save to settings
        const settings = storage.get('settings') || {};
        settings.theme = theme;
        storage.set('settings', settings);
        
        Utils.showToast(`Switched to ${theme} theme`);
    }

    static updateSidebarSetting(collapsed) {
        const settings = storage.get('settings') || {};
        settings.sidebarCollapsed = collapsed;
        storage.set('settings', settings);
        
        // Apply immediately if not on mobile
        if (window.innerWidth > 991) {
            document.body.classList.toggle('sidebar-collapsed', collapsed);
            if (window.app) {
                window.app.sidebarCollapsed = collapsed;
            }
        }
        
        Utils.showToast('Sidebar preference updated');
    }

    static updateNotifications(enabled) {
        const settings = storage.get('settings') || {};
        settings.notifications = enabled;
        storage.set('settings', settings);
        
        Utils.showToast(`Notifications ${enabled ? 'enabled' : 'disabled'}`);
    }

    static updateAutoSave(enabled) {
        const settings = storage.get('settings') || {};
        settings.autoSave = enabled;
        storage.set('settings', settings);
        
        Utils.showToast(`Auto-save ${enabled ? 'enabled' : 'disabled'}`);
    }

    static updateItemsPerPage(itemsPerPage) {
        const settings = storage.get('settings') || {};
        settings.itemsPerPage = parseInt(itemsPerPage);
        storage.set('settings', settings);
        
        Utils.showToast(`Items per page set to ${itemsPerPage}`);
    }

    static calculateStorageSize() {
        try {
            let totalSize = 0;
            for (let key in localStorage) {
                if (key.startsWith('college_admin_')) {
                    totalSize += localStorage[key].length;
                }
            }
            
            // Convert to human readable format
            if (totalSize < 1024) return totalSize + ' B';
            if (totalSize < 1024 * 1024) return Math.round(totalSize / 1024) + ' KB';
            return Math.round(totalSize / (1024 * 1024)) + ' MB';
        } catch (error) {
            return 'Unknown';
        }
    }

    static checkLocalStorageAvailable() {
        try {
            const test = 'localStorage_test';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (error) {
            return false;
        }
    }

    static exportData() {
        try {
            const data = storage.exportData();
            const timestamp = new Date().toISOString().split('T')[0];
            const filename = `college_admin_export_${timestamp}.json`;
            
            Utils.downloadAsJSON(data, filename);
            Utils.showToast('Data exported successfully!');
        } catch (error) {
            console.error('Export error:', error);
            Utils.showToast('Failed to export data', 'error');
        }
    }

    static showImportModal() {
        const content = `
            <form id="importForm" onsubmit="Settings.handleImport(event)">
                <div class="file-upload-area" onclick="document.getElementById('importFile').click()">
                    <input type="file" id="importFile" accept=".json" style="display: none;" onchange="Settings.handleFileSelect(event)">
                    <div class="file-upload-icon">
                        <i data-feather="upload"></i>
                    </div>
                    <div class="file-upload-text">Click to select JSON file</div>
                    <div class="file-upload-hint">Choose exported admin panel data file</div>
                </div>
                
                <div class="form-group mt-3" id="fileInfo" style="display: none;">
                    <div class="alert alert-info">
                        <strong>File selected:</strong> <span id="fileName"></span>
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">
                        <input type="checkbox" id="overwriteData" style="margin-right: var(--spacing-sm);">
                        Overwrite existing data (if unchecked, data will be merged)
                    </label>
                </div>
                
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" onclick="Utils.hideModal()">Cancel</button>
                    <button type="submit" class="btn btn-primary" id="importBtn" disabled>
                        <i data-feather="upload"></i>
                        Import Data
                    </button>
                </div>
            </form>
        `;
        
        Utils.showModal('Import Data', content, { size: 'md' });
        feather.replace();
    }

    static handleFileSelect(event) {
        const file = event.target.files[0];
        if (file) {
            document.getElementById('fileName').textContent = file.name;
            document.getElementById('fileInfo').style.display = 'block';
            document.getElementById('importBtn').disabled = false;
            this.selectedFile = file;
        }
    }

    static async handleImport(event) {
        event.preventDefault();
        
        if (!this.selectedFile) {
            Utils.showToast('Please select a file to import', 'error');
            return;
        }

        const overwrite = document.getElementById('overwriteData').checked;
        const importBtn = document.getElementById('importBtn');
        
        importBtn.disabled = true;
        importBtn.innerHTML = '<i data-feather="loader"></i> Importing...';
        feather.replace();

        try {
            const fileContent = await this.readFileAsText(this.selectedFile);
            const importData = JSON.parse(fileContent);
            
            // Validate import data structure
            if (!this.validateImportData(importData)) {
                Utils.showToast('Invalid file format', 'error');
                return;
            }

            if (overwrite) {
                // Clear existing data and import
                storage.clearAll();
                storage.importData(importData);
            } else {
                // Merge with existing data
                this.mergeImportData(importData);
            }
            
            Utils.showToast('Data imported successfully!');
            Utils.hideModal();
            
            // Refresh current page if it's affected
            if (window.app && window.app.currentPage !== 'settings') {
                window.app.loadPage(window.app.currentPage);
            }
            
        } catch (error) {
            console.error('Import error:', error);
            if (error instanceof SyntaxError) {
                Utils.showToast('Invalid JSON file format', 'error');
            } else {
                Utils.showToast('Failed to import data', 'error');
            }
        } finally {
            importBtn.disabled = false;
            importBtn.innerHTML = '<i data-feather="upload"></i> Import Data';
            feather.replace();
        }
    }

    static readFileAsText(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(e);
            reader.readAsText(file);
        });
    }

    static validateImportData(data) {
        const requiredKeys = ['notifications', 'events', 'faculty', 'gallery', 'departments', 'suggestions', 'landingPage', 'settings'];
        return requiredKeys.every(key => data.hasOwnProperty(key));
    }

    static mergeImportData(importData) {
        // For arrays (collections), merge by adding new items
        const collections = ['notifications', 'events', 'faculty', 'gallery', 'departments', 'suggestions'];
        
        collections.forEach(collection => {
            const existing = storage.getAll(collection);
            const imported = importData[collection] || [];
            
            imported.forEach(item => {
                // Generate new ID to avoid conflicts
                storage.add(collection, item);
            });
        });
        
        // For objects, merge properties
        const landingPage = storage.get('landingPage');
        const importedLandingPage = importData.landingPage || {};
        storage.set('landingPage', { ...landingPage, ...importedLandingPage });
        
        const settings = storage.get('settings');
        const importedSettings = importData.settings || {};
        storage.set('settings', { ...settings, ...importedSettings });
    }

    static showBackupModal() {
        const content = `
            <div class="backup-info">
                <div class="mb-3">
                    <h4>Create Data Backup</h4>
                    <p>This will download a complete backup of your admin panel data including:</p>
                    <ul>
                        <li>All notifications and events</li>
                        <li>Faculty members and departments</li>
                        <li>Gallery images and descriptions</li>
                        <li>Student suggestions</li>
                        <li>Landing page content</li>
                        <li>Settings and preferences</li>
                    </ul>
                </div>
                
                <div class="backup-options">
                    <div class="form-group">
                        <label class="form-label">Backup name (optional)</label>
                        <input type="text" class="form-input" id="backupName" placeholder="backup_${new Date().toISOString().split('T')[0]}">
                    </div>
                </div>
            </div>
            
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" onclick="Utils.hideModal()">Cancel</button>
                <button type="button" class="btn btn-primary" onclick="Settings.createBackup()">
                    <i data-feather="download"></i>
                    Create Backup
                </button>
            </div>
        `;
        
        Utils.showModal('Create Backup', content, { size: 'md' });
    }

    static createBackup() {
        try {
            const data = storage.exportData();
            const backupName = document.getElementById('backupName').value.trim();
            const timestamp = new Date().toISOString().split('T')[0];
            const filename = backupName || `college_admin_backup_${timestamp}`;
            
            // Add backup metadata
            const backupData = {
                ...data,
                _backup: {
                    created: new Date().toISOString(),
                    version: '1.0.0',
                    type: 'full_backup'
                }
            };
            
            Utils.downloadAsJSON(backupData, `${filename}.json`);
            Utils.showToast('Backup created successfully!');
            Utils.hideModal();
        } catch (error) {
            console.error('Backup error:', error);
            Utils.showToast('Failed to create backup', 'error');
        }
    }

    static showClearDataModal() {
        const stats = storage.getStats();
        const totalRecords = stats.totalFaculty + stats.totalDepartments + stats.totalEvents + 
                           stats.totalNotifications + stats.totalGalleryImages + stats.totalStudentMessages;

        Utils.showConfirmation(
            'Clear All Data',
            `Are you sure you want to delete all ${totalRecords} records? This will permanently remove:
            
            • ${stats.totalNotifications} notifications
            • ${stats.totalEvents} events  
            • ${stats.totalFaculty} faculty members
            • ${stats.totalGalleryImages} gallery images
            • ${stats.totalDepartments} departments
            • ${stats.totalStudentMessages} student messages
            • Landing page content
            
            This action cannot be undone!`,
            () => {
                try {
                    storage.clearAll();
                    Utils.showToast('All data cleared successfully!');
                    
                    // Redirect to dashboard and refresh
                    if (window.app) {
                        window.app.loadPage('dashboard');
                    }
                } catch (error) {
                    console.error('Clear data error:', error);
                    Utils.showToast('Failed to clear data', 'error');
                }
            }
        );
    }

    static resetToDefaults() {
        Utils.showConfirmation(
            'Reset Settings',
            'Are you sure you want to reset all settings to their default values?',
            () => {
                try {
                    // Reset settings to defaults
                    const defaultSettings = {
                        theme: 'light',
                        notifications: true,
                        autoSave: true,
                        sidebarCollapsed: false,
                        itemsPerPage: 25
                    };
                    
                    storage.set('settings', defaultSettings);
                    
                    // Apply theme immediately
                    document.documentElement.setAttribute('data-theme', 'light');
                    const themeIcon = document.querySelector('#themeToggle i');
                    themeIcon.setAttribute('data-feather', 'moon');
                    feather.replace();
                    
                    // Refresh settings page
                    this.render(document.getElementById('contentArea'));
                    feather.replace();
                    
                    Utils.showToast('Settings reset to defaults!');
                } catch (error) {
                    console.error('Reset settings error:', error);
                    Utils.showToast('Failed to reset settings', 'error');
                }
            }
        );
    }
}

// Make Settings available globally
window.Settings = Settings;
