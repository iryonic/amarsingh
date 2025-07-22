// Storage utility for managing localStorage data
class Storage {
    constructor() {
        this.initializeData();
    }

    // Initialize default data structure
    initializeData() {
        const defaultData = {
            notifications: [],
            events: [],
            faculty: [],
            gallery: [],
            departments: [],
            suggestions: [],
            landingPage: {
                hero: {
                    title: 'Welcome to Our College',
                    subtitle: 'Excellence in Education Since 1960',
                    description: 'We provide world-class education and foster innovation.',
                    image: 'https://via.placeholder.com/800x400'
                },
                about: {
                    title: 'About Our College',
                    content: 'Our college has been a beacon of excellence in education for over 60 years.',
                    image: 'https://via.placeholder.com/600x400'
                },
                vision: 'To be a leading institution in higher education.',
                mission: 'To provide quality education and research opportunities.',
                achievements: [
                    'Top 10 Engineering College',
                    '100% Placement Record',
                    'Research Excellence Award'
                ],
                contact: {
                    address: '123 College Street, Education City',
                    phone: '+1 234 567 8900',
                    email: 'info@college.edu',
                    website: 'www.college.edu'
                }
            },
            settings: {
                theme: 'light',
                notifications: true,
                autoSave: true
            }
        };

        // Initialize data if not exists
        Object.keys(defaultData).forEach(key => {
            if (!this.get(key)) {
                this.set(key, defaultData[key]);
            }
        });
    }

    // Get data from localStorage
    get(key) {
        try {
            const data = localStorage.getItem(`college_admin_${key}`);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return null;
        }
    }

    // Set data to localStorage
    set(key, value) {
        try {
            localStorage.setItem(`college_admin_${key}`, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error writing to localStorage:', error);
            return false;
        }
    }

    // Add item to array
    add(collection, item) {
        const data = this.get(collection) || [];
        item.id = this.generateId();
        item.createdAt = new Date().toISOString();
        item.updatedAt = new Date().toISOString();
        data.push(item);
        return this.set(collection, data) ? item : null;
    }

    // Update item in array
    update(collection, id, updates) {
        const data = this.get(collection) || [];
        const index = data.findIndex(item => item.id === id);
        if (index !== -1) {
            data[index] = { ...data[index], ...updates, updatedAt: new Date().toISOString() };
            return this.set(collection, data) ? data[index] : null;
        }
        return null;
    }

    // Delete item from array
    delete(collection, id) {
        const data = this.get(collection) || [];
        const filteredData = data.filter(item => item.id !== id);
        return this.set(collection, filteredData);
    }

    // Find item by id
    findById(collection, id) {
        const data = this.get(collection) || [];
        return data.find(item => item.id === id) || null;
    }

    // Get all items from collection
    getAll(collection) {
        return this.get(collection) || [];
    }

    // Search items in collection
    search(collection, query, fields = []) {
        const data = this.get(collection) || [];
        if (!query) return data;

        return data.filter(item => {
            return fields.some(field => {
                const value = this.getNestedValue(item, field);
                return value && value.toString().toLowerCase().includes(query.toLowerCase());
            });
        });
    }

    // Get nested object value
    getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => current && current[key], obj);
    }

    // Generate unique ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Get statistics
    getStats() {
        return {
            totalFaculty: this.getAll('faculty').length,
            totalDepartments: this.getAll('departments').length,
            totalEvents: this.getAll('events').length,
            totalNotifications: this.getAll('notifications').length,
            totalGalleryImages: this.getAll('gallery').length,
            totalStudentMessages: this.getAll('suggestions').length
        };
    }

    // Export data
    exportData() {
        const data = {};
        const keys = ['notifications', 'events', 'faculty', 'gallery', 'departments', 'suggestions', 'landingPage', 'settings'];
        keys.forEach(key => {
            data[key] = this.get(key);
        });
        return data;
    }

    // Import data
    importData(data) {
        try {
            Object.keys(data).forEach(key => {
                this.set(key, data[key]);
            });
            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    }

    // Clear all data
    clearAll() {
        const keys = ['notifications', 'events', 'faculty', 'gallery', 'departments', 'suggestions', 'landingPage', 'settings'];
        keys.forEach(key => {
            localStorage.removeItem(`college_admin_${key}`);
        });
        this.initializeData();
    }
}

// Create global storage instance
window.storage = new Storage();
