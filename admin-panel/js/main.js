// Main application controller
class AdminApp {
    constructor() {
        this.currentPage = 'dashboard';
        this.sidebarCollapsed = false;
        this.isMobile = window.innerWidth <= 991;
        
        this.init();
    }

    init() {
        this.initializeTheme();
        this.setupEventListeners();
        this.setupSidebar();
        this.loadPage('dashboard');
        this.setupKeyboardShortcuts();
        
        // Initialize Feather icons
        feather.replace();
    }

    initializeTheme() {
        const savedTheme = storage.get('settings')?.theme || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateThemeIcon(savedTheme);
    }

    setupEventListeners() {
        // Sidebar toggle
        const sidebarToggle = document.getElementById('sidebarToggle');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                this.toggleSidebar();
            });
        }

        const mobileSidebarToggle = document.getElementById('mobileSidebarToggle');
        if (mobileSidebarToggle) {
            mobileSidebarToggle.addEventListener('click', () => {
                this.toggleMobileSidebar();
            });
        }

        // Sidebar overlay click
        const sidebarOverlay = document.getElementById('sidebarOverlay');
        if (sidebarOverlay) {
            sidebarOverlay.addEventListener('click', () => {
                this.closeMobileSidebar();
            });
        }

        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }

        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = item.dataset.page;
                this.loadPage(page);
            });
        });

        // Modal close
        const modalClose = document.getElementById('modalClose');
        if (modalClose) {
            modalClose.addEventListener('click', () => {
                Utils.hideModal();
            });
        }

        const modalOverlay = document.getElementById('modalOverlay');
        if (modalOverlay) {
            modalOverlay.addEventListener('click', (e) => {
                if (e.target === e.currentTarget) {
                    Utils.hideModal();
                }
            });
        }

        // Escape key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                Utils.hideModal();
            }
        });

        // Window resize
        window.addEventListener('resize', Utils.throttle(() => {
            this.handleResize();
        }, 250));

        // Auto-save functionality
        this.setupAutoSave();
    }

    setupSidebar() {
        // Set tooltips for collapsed sidebar
        document.querySelectorAll('.nav-item').forEach(item => {
            const text = item.querySelector('.nav-text').textContent;
            item.setAttribute('data-tooltip', text);
        });

        // Handle responsive sidebar
        this.handleResize();
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + shortcuts
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 's':
                        e.preventDefault();
                        this.saveCurrentPageData();
                        break;
                    case 'n':
                        e.preventDefault();
                        this.createNewItem();
                        break;
                    case '/':
                        e.preventDefault();
                        this.focusSearch();
                        break;
                }
            }

            // Alt + number keys for navigation
            if (e.altKey && e.key >= '1' && e.key <= '9') {
                e.preventDefault();
                const navItems = document.querySelectorAll('.nav-item');
                const index = parseInt(e.key) - 1;
                if (navItems[index]) {
                    const page = navItems[index].dataset.page;
                    this.loadPage(page);
                }
            }
        });
    }

    setupAutoSave() {
        // Auto-save form data every 30 seconds
        setInterval(() => {
            if (storage.get('settings')?.autoSave) {
                this.autoSaveFormData();
            }
        }, 30000);
    }

    toggleSidebar() {
        if (this.isMobile) {
            this.toggleMobileSidebar();
            return;
        }
        
        this.sidebarCollapsed = !this.sidebarCollapsed;
        document.body.classList.toggle('sidebar-collapsed', this.sidebarCollapsed);
        
        // Save preference
        const settings = storage.get('settings') || {};
        settings.sidebarCollapsed = this.sidebarCollapsed;
        storage.set('settings', settings);
    }

    toggleMobileSidebar() {
        const sidebar = document.querySelector('.sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        
        if (!sidebar || !overlay) return;
        
        const isOpen = sidebar.classList.contains('show');
        
        if (isOpen) {
            this.closeMobileSidebar();
        } else {
            this.openMobileSidebar();
        }
    }

    openMobileSidebar() {
        const sidebar = document.querySelector('.sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        
        if (sidebar && overlay) {
            sidebar.classList.add('show');
            overlay.classList.add('show');
            document.body.style.overflow = 'hidden';
            
            // Close sidebar when clicking on nav items (mobile)
            document.querySelectorAll('.nav-item').forEach(item => {
                const clickHandler = () => {
                    if (this.isMobile) {
                        setTimeout(() => this.closeMobileSidebar(), 150);
                    }
                };
                item.addEventListener('click', clickHandler, { once: true });
            });
        }
    }

    closeMobileSidebar() {
        const sidebar = document.querySelector('.sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        
        if (sidebar && overlay) {
            sidebar.classList.remove('show');
            overlay.classList.remove('show');
            document.body.style.overflow = '';
        }
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        this.updateThemeIcon(newTheme);
        
        // Save preference
        const settings = storage.get('settings') || {};
        settings.theme = newTheme;
        storage.set('settings', settings);
        
        Utils.showToast(`Switched to ${newTheme} theme`);
    }

    updateThemeIcon(theme) {
        const themeIcon = document.querySelector('#themeToggle i');
        if (themeIcon) {
            themeIcon.setAttribute('data-feather', theme === 'dark' ? 'sun' : 'moon');
            feather.replace();
        }
    }

    loadPage(pageName) {
        if (this.currentPage === pageName) return;

        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        const activeItem = document.querySelector(`.nav-item[data-page="${pageName}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
        }

        // Update page title
        const pageTitle = document.getElementById('pageTitle');
        const navText = activeItem?.querySelector('.nav-text')?.textContent || 'Page';
        if (pageTitle) {
            pageTitle.textContent = navText;
        }

        // Load page content
        this.currentPage = pageName;
        this.renderPageContent(pageName);

        // Close mobile sidebar if open
        if (this.isMobile) {
            const sidebar = document.querySelector('.sidebar');
            if (sidebar.classList.contains('show')) {
                this.toggleMobileSidebar();
            }
        }

        // Update URL without page reload
        history.pushState({ page: pageName }, navText, `#${pageName}`);
    }

    renderPageContent(pageName) {
        const contentArea = document.getElementById('contentArea');
        contentArea.innerHTML = Utils.createLoadingSpinner();

        // Simulate loading delay for better UX
        setTimeout(() => {
            switch (pageName) {
                case 'dashboard':
                    Dashboard.render(contentArea);
                    break;
                case 'notifications':
                    Notifications.render(contentArea);
                    break;
                case 'events':
                    Events.render(contentArea);
                    break;
                case 'faculty':
                    Faculty.render(contentArea);
                    break;
                case 'gallery':
                    Gallery.render(contentArea);
                    break;
                case 'departments':
                    Departments.render(contentArea);
                    break;
                case 'suggestions':
                    Suggestions.render(contentArea);
                    break;
                case 'landing-page':
                    LandingPage.render(contentArea);
                    break;
                case 'settings':
                    Settings.render(contentArea);
                    break;
                default:
                    contentArea.innerHTML = '<div class="empty-state"><h3>Page not found</h3></div>';
            }
            
            // Replace feather icons
            feather.replace();
        }, 150);
    }

    handleResize() {
        const wasMobile = this.isMobile;
        this.isMobile = window.innerWidth <= 991;

        // Handle mobile/desktop transition
        if (wasMobile !== this.isMobile) {
            const sidebar = document.querySelector('.sidebar');
            const overlay = document.querySelector('.sidebar-overlay');
            
            if (this.isMobile) {
                // Switching to mobile
                sidebar.classList.remove('show');
                document.body.classList.remove('sidebar-collapsed');
            } else {
                // Switching to desktop
                sidebar.classList.remove('show');
                if (overlay) {
                    overlay.remove();
                }
                
                // Restore sidebar collapsed state
                const settings = storage.get('settings');
                if (settings?.sidebarCollapsed) {
                    document.body.classList.add('sidebar-collapsed');
                    this.sidebarCollapsed = true;
                }
            }
        }
    }

    saveCurrentPageData() {
        // Save current page data if applicable
        const activeForm = document.querySelector('.content-area form');
        if (activeForm) {
            const submitBtn = activeForm.querySelector('[type="submit"]');
            if (submitBtn) {
                submitBtn.click();
            }
        }
        Utils.showToast('Page data saved!');
    }

    createNewItem() {
        // Create new item for current page
        switch (this.currentPage) {
            case 'notifications':
                Notifications.showCreateModal();
                break;
            case 'events':
                Events.showCreateModal();
                break;
            case 'faculty':
                Faculty.showCreateModal();
                break;
            case 'gallery':
                Gallery.showUploadModal();
                break;
            case 'departments':
                Departments.showCreateModal();
                break;
        }
    }

    focusSearch() {
        const searchInput = document.querySelector('.content-area input[type="search"], .content-area input[placeholder*="Search"]');
        if (searchInput) {
            searchInput.focus();
        }
    }

    autoSaveFormData() {
        // Auto-save form data to localStorage
        const forms = document.querySelectorAll('.content-area form');
        forms.forEach(form => {
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            if (Object.keys(data).length > 0) {
                localStorage.setItem(`autosave_${this.currentPage}`, JSON.stringify(data));
            }
        });
    }

    restoreFormData() {
        // Restore auto-saved form data
        const saved = localStorage.getItem(`autosave_${this.currentPage}`);
        if (saved) {
            try {
                const data = JSON.parse(saved);
                Object.keys(data).forEach(key => {
                    const input = document.querySelector(`[name="${key}"]`);
                    if (input) {
                        input.value = data[key];
                    }
                });
            } catch (error) {
                console.error('Error restoring form data:', error);
            }
        }
    }

    // Handle browser back/forward buttons
    handlePopState(event) {
        const page = event.state?.page || 'dashboard';
        this.loadPage(page);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new AdminApp();
    
    // Handle browser navigation
    window.addEventListener('popstate', (event) => {
        window.app.handlePopState(event);
    });
    
    // Handle initial URL hash
    const hash = window.location.hash.substring(1);
    if (hash && hash !== 'dashboard') {
        window.app.loadPage(hash);
    }
});
