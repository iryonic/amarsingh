// Gallery module
class Gallery {
    static render(container) {
        const gallery = storage.getAll('gallery');
        
        container.innerHTML = `
            <div class="page-header mb-4">
                <div class="flex justify-between items-center">
                    <h2 class="text-2xl font-bold">Gallery Management</h2>
                    <button class="btn btn-primary" onclick="Gallery.showUploadModal()">
                        <i data-feather="upload"></i>
                        Upload Images
                    </button>
                </div>
            </div>
            
            <div class="mb-4">
                <div class="flex gap-4 items-center">
                    <input type="search" class="form-input" placeholder="Search images..." 
                           style="max-width: 300px;" onkeyup="Gallery.handleSearch(this.value)">
                    <select class="form-select" style="max-width: 200px;" onchange="Gallery.handleCategoryFilter(this.value)">
                        <option value="">All Categories</option>
                        <option value="events">Events</option>
                        <option value="campus">Campus</option>
                        <option value="academic">Academic</option>
                        <option value="sports">Sports</option>
                        <option value="cultural">Cultural</option>
                        <option value="other">Other</option>
                    </select>
                </div>
            </div>
            
            <div class="gallery-grid" id="galleryGrid">
                ${this.renderGalleryGrid(gallery)}
            </div>
        `;
    }

    static renderGalleryGrid(images) {
        if (images.length === 0) {
            return `
                <div class="empty-state">
                    <div class="empty-state-icon">
                        <i data-feather="image"></i>
                    </div>
                    <div class="empty-state-title">No Images</div>
                    <div class="empty-state-desc">Upload your first images to get started.</div>
                    <button class="btn btn-primary mt-3" onclick="Gallery.showUploadModal()">
                        <i data-feather="upload"></i>
                        Upload Images
                    </button>
                </div>
            `;
        }

        const gridHTML = images.map(image => `
            <div class="gallery-item card">
                <div class="gallery-image-container" onclick="Gallery.showImagePreview('${image.id}')">
                    <img src="${image.url}" alt="${Utils.escapeHTML(image.title || 'Gallery Image')}" 
                         onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
                    <div class="gallery-image-placeholder" style="display: none;">
                        <i data-feather="image"></i>
                        <span>Image not found</span>
                    </div>
                    <div class="gallery-overlay">
                        <i data-feather="eye"></i>
                    </div>
                </div>
                <div class="gallery-content">
                    <h4 class="gallery-title">${Utils.escapeHTML(image.title || 'Untitled')}</h4>
                    ${image.description ? `<p class="gallery-description">${Utils.truncateText(Utils.escapeHTML(image.description), 80)}</p>` : ''}
                    <div class="gallery-meta">
                        <span class="gallery-category badge badge-info">${Utils.escapeHTML(image.category || 'other')}</span>
                        <span class="gallery-date">${Utils.formatDate(image.createdAt, { month: 'short', day: 'numeric' })}</span>
                    </div>
                </div>
                <div class="gallery-actions">
                    <button class="btn btn-sm btn-secondary" onclick="Gallery.showEditModal('${image.id}')" title="Edit">
                        <i data-feather="edit-2"></i>
                    </button>
                    <button class="btn btn-sm btn-error" onclick="Gallery.deleteImage('${image.id}')" title="Delete">
                        <i data-feather="trash-2"></i>
                    </button>
                </div>
            </div>
        `).join('');

        return `
            <style>
                .gallery-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: var(--spacing-lg);
                }
                
                .gallery-item {
                    overflow: hidden;
                    transition: transform var(--transition-fast), box-shadow var(--transition-fast);
                }
                
                .gallery-item:hover {
                    transform: translateY(-4px);
                    box-shadow: var(--shadow-lg);
                }
                
                .gallery-image-container {
                    position: relative;
                    aspect-ratio: 4/3;
                    overflow: hidden;
                    cursor: pointer;
                    background-color: var(--bg-tertiary);
                }
                
                .gallery-image-container img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform var(--transition-normal);
                }
                
                .gallery-image-container:hover img {
                    transform: scale(1.05);
                }
                
                .gallery-image-placeholder {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    color: var(--text-muted);
                    gap: var(--spacing-sm);
                }
                
                .gallery-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    transition: opacity var(--transition-fast);
                    color: white;
                }
                
                .gallery-image-container:hover .gallery-overlay {
                    opacity: 1;
                }
                
                .gallery-content {
                    padding: var(--spacing-md);
                }
                
                .gallery-title {
                    font-size: 1rem;
                    font-weight: 600;
                    color: var(--text-primary);
                    margin-bottom: var(--spacing-sm);
                }
                
                .gallery-description {
                    color: var(--text-secondary);
                    font-size: 0.875rem;
                    line-height: 1.4;
                    margin-bottom: var(--spacing-sm);
                }
                
                .gallery-meta {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: var(--spacing-md);
                }
                
                .gallery-category {
                    font-size: 0.75rem;
                }
                
                .gallery-date {
                    color: var(--text-muted);
                    font-size: 0.75rem;
                }
                
                .gallery-actions {
                    display: flex;
                    justify-content: center;
                    gap: var(--spacing-sm);
                    padding: 0 var(--spacing-md) var(--spacing-md);
                }
            </style>
            ${gridHTML}
        `;
    }

    static showUploadModal() {
        const content = `
            <form id="galleryUploadForm" onsubmit="Gallery.handleUpload(event)">
                <div class="file-upload-area" onclick="document.getElementById('imageFiles').click()">
                    <input type="file" id="imageFiles" name="images" multiple accept="image/*" style="display: none;" onchange="Gallery.handleFileSelect(event)">
                    <div class="file-upload-icon">
                        <i data-feather="upload-cloud"></i>
                    </div>
                    <div class="file-upload-text">Click to upload images or drag and drop</div>
                    <div class="file-upload-hint">PNG, JPG, GIF up to 10MB each</div>
                </div>
                
                <div class="file-preview" id="filePreview"></div>
                
                <div class="form-group">
                    <label class="form-label">Category</label>
                    <select class="form-select" name="category" id="imageCategory">
                        <option value="other">Other</option>
                        <option value="events">Events</option>
                        <option value="campus">Campus</option>
                        <option value="academic">Academic</option>
                        <option value="sports">Sports</option>
                        <option value="cultural">Cultural</option>
                    </select>
                </div>
                
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" onclick="Utils.hideModal()">Cancel</button>
                    <button type="submit" class="btn btn-primary" disabled id="uploadBtn">Upload Images</button>
                </div>
            </form>
        `;
        
        Utils.showModal('Upload Images', content, { size: 'lg' });
        this.setupDragAndDrop();
        feather.replace();
    }

    static setupDragAndDrop() {
        const uploadArea = document.querySelector('.file-upload-area');
        
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, this.preventDefaults, false);
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            uploadArea.addEventListener(eventName, () => uploadArea.classList.add('dragover'), false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, () => uploadArea.classList.remove('dragover'), false);
        });

        uploadArea.addEventListener('drop', (e) => {
            const files = e.dataTransfer.files;
            this.handleFiles(files);
        }, false);
    }

    static preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    static handleFileSelect(event) {
        this.handleFiles(event.target.files);
    }

    static handleFiles(files) {
        const fileArray = Array.from(files);
        const imageFiles = fileArray.filter(file => file.type.startsWith('image/'));
        
        if (imageFiles.length === 0) {
            Utils.showToast('Please select valid image files', 'error');
            return;
        }

        this.selectedFiles = imageFiles;
        this.renderFilePreview(imageFiles);
        
        const uploadBtn = document.getElementById('uploadBtn');
        uploadBtn.disabled = false;
    }

    static renderFilePreview(files) {
        const preview = document.getElementById('filePreview');
        
        Promise.all(files.map(file => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve({
                    file: file,
                    dataUrl: e.target.result
                });
                reader.readAsDataURL(file);
            });
        })).then(results => {
            preview.innerHTML = results.map((result, index) => `
                <div class="file-preview-item">
                    <img src="${result.dataUrl}" alt="${result.file.name}" class="file-preview-image">
                    <button type="button" class="file-preview-remove" onclick="Gallery.removeFile(${index})">
                        <i data-feather="x"></i>
                    </button>
                    <div class="file-info">
                        <div class="file-name">${Utils.truncateText(result.file.name, 20)}</div>
                        <div class="file-size">${Utils.formatFileSize(result.file.size)}</div>
                    </div>
                </div>
            `).join('');
            feather.replace();
        });
    }

    static removeFile(index) {
        this.selectedFiles.splice(index, 1);
        if (this.selectedFiles.length === 0) {
            document.getElementById('uploadBtn').disabled = true;
            document.getElementById('filePreview').innerHTML = '';
        } else {
            this.renderFilePreview(this.selectedFiles);
        }
    }

    static async handleUpload(event) {
        event.preventDefault();
        
        if (!this.selectedFiles || this.selectedFiles.length === 0) {
            Utils.showToast('Please select images to upload', 'error');
            return;
        }

        const category = document.getElementById('imageCategory').value;
        const uploadBtn = document.getElementById('uploadBtn');
        
        uploadBtn.disabled = true;
        uploadBtn.innerHTML = '<i data-feather="loader"></i> Uploading...';
        feather.replace();

        try {
            for (const file of this.selectedFiles) {
                const fileData = await Utils.handleFileUpload(file);
                
                const imageData = {
                    title: file.name.replace(/\.[^/.]+$/, ''), // Remove extension
                    url: fileData.data,
                    category: category,
                    size: file.size,
                    type: file.type,
                    description: ''
                };

                storage.add('gallery', imageData);
            }

            Utils.showToast(`${this.selectedFiles.length} image(s) uploaded successfully!`);
            Utils.hideModal();
            this.refreshGrid();
        } catch (error) {
            console.error('Error uploading images:', error);
            Utils.showToast('Failed to upload images', 'error');
        } finally {
            uploadBtn.disabled = false;
            uploadBtn.innerHTML = '<i data-feather="upload"></i> Upload Images';
            feather.replace();
        }
    }

    static showEditModal(id) {
        const image = storage.findById('gallery', id);
        if (!image) {
            Utils.showToast('Image not found', 'error');
            return;
        }

        const content = `
            <form id="editImageForm" onsubmit="Gallery.handleEdit(event, '${id}')">
                <div class="form-group">
                    <label class="form-label">Title</label>
                    <input type="text" class="form-input" name="title" value="${Utils.escapeHTML(image.title || '')}" placeholder="Image title">
                </div>
                
                <div class="form-group">
                    <label class="form-label">Description</label>
                    <textarea class="form-textarea" name="description" rows="3" placeholder="Image description">${Utils.escapeHTML(image.description || '')}</textarea>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Category</label>
                        <select class="form-select" name="category">
                            <option value="other" ${image.category === 'other' ? 'selected' : ''}>Other</option>
                            <option value="events" ${image.category === 'events' ? 'selected' : ''}>Events</option>
                            <option value="campus" ${image.category === 'campus' ? 'selected' : ''}>Campus</option>
                            <option value="academic" ${image.category === 'academic' ? 'selected' : ''}>Academic</option>
                            <option value="sports" ${image.category === 'sports' ? 'selected' : ''}>Sports</option>
                            <option value="cultural" ${image.category === 'cultural' ? 'selected' : ''}>Cultural</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Image URL</label>
                        <input type="url" class="form-input" name="url" value="${image.url}" readonly>
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Preview</label>
                    <div style="max-width: 200px; border-radius: var(--radius-md); overflow: hidden;">
                        <img src="${image.url}" alt="Preview" style="width: 100%; height: auto;">
                    </div>
                </div>
                
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" onclick="Utils.hideModal()">Cancel</button>
                    <button type="submit" class="btn btn-primary">Update Image</button>
                </div>
            </form>
        `;
        
        Utils.showModal('Edit Image', content, { size: 'md' });
    }

    static handleEdit(event, id) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const data = {
            title: formData.get('title').trim(),
            description: formData.get('description').trim(),
            category: formData.get('category')
        };

        try {
            const updated = storage.update('gallery', id, data);
            if (updated) {
                Utils.showToast('Image updated successfully!');
                Utils.hideModal();
                this.refreshGrid();
            } else {
                Utils.showToast('Failed to update image', 'error');
            }
        } catch (error) {
            console.error('Error updating image:', error);
            Utils.showToast('An error occurred while updating', 'error');
        }
    }

    static showImagePreview(id) {
        const image = storage.findById('gallery', id);
        if (!image) {
            Utils.showToast('Image not found', 'error');
            return;
        }

        const content = `
            <div class="image-preview-modal">
                <img src="${image.url}" alt="${Utils.escapeHTML(image.title || 'Gallery Image')}" class="image-preview">
            </div>
        `;
        
        Utils.showModal(image.title || 'Image Preview', content, { size: 'xl' });
    }

    static deleteImage(id) {
        const image = storage.findById('gallery', id);
        if (!image) {
            Utils.showToast('Image not found', 'error');
            return;
        }

        Utils.showConfirmation(
            'Delete Image',
            `Are you sure you want to delete "${image.title || 'this image'}"? This action cannot be undone.`,
            () => {
                try {
                    const deleted = storage.delete('gallery', id);
                    if (deleted) {
                        Utils.showToast('Image deleted successfully!');
                        this.refreshGrid();
                    } else {
                        Utils.showToast('Failed to delete image', 'error');
                    }
                } catch (error) {
                    console.error('Error deleting image:', error);
                    Utils.showToast('An error occurred while deleting', 'error');
                }
            }
        );
    }

    static handleSearch(query) {
        const images = storage.search('gallery', query, ['title', 'description', 'category']);
        this.updateGrid(images);
    }

    static handleCategoryFilter(category) {
        let images = storage.getAll('gallery');
        if (category) {
            images = images.filter(img => img.category === category);
        }
        this.updateGrid(images);
    }

    static updateGrid(images) {
        const grid = document.getElementById('galleryGrid');
        grid.innerHTML = this.renderGalleryGrid(images);
        feather.replace();
    }

    static refreshGrid() {
        const images = storage.getAll('gallery');
        this.updateGrid(images);
    }
}

// Make Gallery available globally
window.Gallery = Gallery;
