// Utility functions for the admin panel
class Utils {
    // Format date to readable string
    static formatDate(date, options = {}) {
        const defaultOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        const formatOptions = { ...defaultOptions, ...options };
        
        try {
            const dateObj = typeof date === 'string' ? new Date(date) : date;
            return dateObj.toLocaleDateString('en-US', formatOptions);
        } catch (error) {
            return 'Invalid Date';
        }
    }

    // Format relative time (e.g., "2 hours ago")
    static formatRelativeTime(date) {
        try {
            const dateObj = typeof date === 'string' ? new Date(date) : date;
            const now = new Date();
            const diffInSeconds = Math.floor((now - dateObj) / 1000);

            if (diffInSeconds < 60) return 'Just now';
            if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
            if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
            if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
            if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
            return `${Math.floor(diffInSeconds / 31536000)} years ago`;
        } catch (error) {
            return 'Unknown';
        }
    }

    // Debounce function
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Throttle function
    static throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Show toast notification
    static showToast(message, type = 'success', duration = 3000) {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');
        const toastIcon = toast.querySelector('.toast-icon');
        
        // Set message
        toastMessage.textContent = message;
        
        // Set icon based on type
        let iconName = 'check-circle';
        toast.className = 'toast';
        
        switch (type) {
            case 'error':
                iconName = 'x-circle';
                toast.classList.add('toast-error');
                break;
            case 'warning':
                iconName = 'alert-triangle';
                toast.classList.add('toast-warning');
                break;
            case 'info':
                iconName = 'info';
                toast.classList.add('toast-info');
                break;
            default:
                toast.classList.add('toast-success');
        }
        
        toastIcon.setAttribute('data-feather', iconName);
        feather.replace();
        
        // Show toast
        toast.classList.add('show');
        
        // Hide after duration
        setTimeout(() => {
            toast.classList.remove('show');
        }, duration);
    }

    // Show modal
    static showModal(title, content, options = {}) {
        const modal = document.getElementById('modal');
        const modalOverlay = document.getElementById('modalOverlay');
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');
        
        modalTitle.textContent = title;
        modalBody.innerHTML = content;
        
        // Apply modal size class
        modal.className = 'modal';
        if (options.size) {
            modal.classList.add(`modal-${options.size}`);
        }
        
        modalOverlay.classList.add('show');
        
        // Focus management
        const firstFocusable = modal.querySelector('input, button, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (firstFocusable) {
            setTimeout(() => firstFocusable.focus(), 100);
        }
        
        return modal;
    }

    // Hide modal
    static hideModal() {
        const modalOverlay = document.getElementById('modalOverlay');
        modalOverlay.classList.remove('show');
    }

    // Show confirmation dialog
    static showConfirmation(title, message, onConfirm, onCancel = null) {
        const content = `
            <div class="confirm-modal">
                <div class="confirm-icon">
                    <i data-feather="alert-triangle"></i>
                </div>
                <h3 class="confirm-title">${title}</h3>
                <p class="confirm-message">${message}</p>
                <div class="confirm-actions">
                    <button class="btn btn-secondary" id="confirmCancel">Cancel</button>
                    <button class="btn btn-error" id="confirmOk">Confirm</button>
                </div>
            </div>
        `;
        
        this.showModal('Confirmation', content, { size: 'sm' });
        feather.replace();
        
        // Handle actions
        document.getElementById('confirmOk').onclick = () => {
            this.hideModal();
            if (onConfirm) onConfirm();
        };
        
        document.getElementById('confirmCancel').onclick = () => {
            this.hideModal();
            if (onCancel) onCancel();
        };
    }

    // Validate email
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Validate URL
    static isValidURL(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    // Sanitize HTML
    static sanitizeHTML(html) {
        const div = document.createElement('div');
        div.textContent = html;
        return div.innerHTML;
    }

    // Generate random color
    static generateRandomColor() {
        const colors = [
            '#2563eb', '#7c3aed', '#dc2626', '#059669',
            '#d97706', '#7c2d12', '#be123c', '#4338ca'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    // Format file size
    static formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Create loading spinner
    static createLoadingSpinner() {
        return '<div class="loading-spinner"></div>';
    }

    // Handle file upload
    static handleFileUpload(file, onProgress = null) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                resolve({
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    data: e.target.result,
                    lastModified: file.lastModified
                });
            };
            
            reader.onerror = () => reject(reader.error);
            
            if (onProgress) {
                reader.onprogress = (e) => {
                    if (e.lengthComputable) {
                        const progress = (e.loaded / e.total) * 100;
                        onProgress(progress);
                    }
                };
            }
            
            reader.readAsDataURL(file);
        });
    }

    // Copy to clipboard
    static async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            this.showToast('Copied to clipboard!');
            return true;
        } catch (error) {
            console.error('Failed to copy to clipboard:', error);
            this.showToast('Failed to copy to clipboard', 'error');
            return false;
        }
    }

    // Download as JSON
    static downloadAsJSON(data, filename = 'data.json') {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }

    // Parse CSV
    static parseCSV(csv) {
        const lines = csv.split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        const data = [];
        
        for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim()) {
                const values = lines[i].split(',').map(v => v.trim());
                const row = {};
                headers.forEach((header, index) => {
                    row[header] = values[index] || '';
                });
                data.push(row);
            }
        }
        
        return data;
    }

    // Escape HTML
    static escapeHTML(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Truncate text
    static truncateText(text, maxLength, suffix = '...') {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + suffix;
    }

    // Generate excerpt
    static generateExcerpt(text, maxWords = 20) {
        const words = text.split(' ');
        if (words.length <= maxWords) return text;
        return words.slice(0, maxWords).join(' ') + '...';
    }

    // Check if element is in viewport
    static isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // Smooth scroll to element
    static scrollToElement(element, offset = 0) {
        const elementPosition = element.offsetTop - offset;
        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
    }
}

// Make Utils available globally
window.Utils = Utils;
