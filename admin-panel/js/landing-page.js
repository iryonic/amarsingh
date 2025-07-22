// Landing Page module
class LandingPage {
    static render(container) {
        const landingPageData = storage.get('landingPage');
        
        container.innerHTML = `
            <div class="page-header mb-4">
                <h2 class="text-2xl font-bold">Landing Page Content Management</h2>
            </div>
            
            <div class="landing-page-tabs" id="landingTabs">
                <div class="tab-nav">
                    <button class="tab-btn active" data-tab="hero" onclick="LandingPage.switchTab('hero')">
                        <i data-feather="monitor"></i>
                        Hero Section
                    </button>
                    <button class="tab-btn" data-tab="about" onclick="LandingPage.switchTab('about')">
                        <i data-feather="info"></i>
                        About Section
                    </button>
                    <button class="tab-btn" data-tab="vision-mission" onclick="LandingPage.switchTab('vision-mission')">
                        <i data-feather="target"></i>
                        Vision & Mission
                    </button>
                    <button class="tab-btn" data-tab="achievements" onclick="LandingPage.switchTab('achievements')">
                        <i data-feather="award"></i>
                        Achievements
                    </button>
                    <button class="tab-btn" data-tab="contact" onclick="LandingPage.switchTab('contact')">
                        <i data-feather="phone"></i>
                        Contact Info
                    </button>
                </div>
                
                <div class="tab-content">
                    <div class="tab-panel active" id="hero">
                        ${this.renderHeroSection(landingPageData.hero)}
                    </div>
                    
                    <div class="tab-panel" id="about">
                        ${this.renderAboutSection(landingPageData.about)}
                    </div>
                    
                    <div class="tab-panel" id="vision-mission">
                        ${this.renderVisionMissionSection(landingPageData)}
                    </div>
                    
                    <div class="tab-panel" id="achievements">
                        ${this.renderAchievementsSection(landingPageData.achievements)}
                    </div>
                    
                    <div class="tab-panel" id="contact">
                        ${this.renderContactSection(landingPageData.contact)}
                    </div>
                </div>
            </div>
        `;
    }

    static renderHeroSection(hero) {
        return `
            <div class="section-card card">
                <div class="card-header">
                    <h3 class="card-title">Hero Section</h3>
                    <button class="btn btn-primary" onclick="LandingPage.showPreview('hero')">
                        <i data-feather="eye"></i>
                        Preview
                    </button>
                </div>
                <div class="card-body">
                    <form id="heroForm" onsubmit="LandingPage.saveHeroSection(event)">
                        <div class="form-group">
                            <label class="form-label">Main Title *</label>
                            <input type="text" class="form-input" name="title" value="${Utils.escapeHTML(hero.title || '')}" required>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Subtitle</label>
                            <input type="text" class="form-input" name="subtitle" value="${Utils.escapeHTML(hero.subtitle || '')}" placeholder="Tagline or subtitle">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Description</label>
                            <div class="editor-container">
                                <div class="editor-toolbar">
                                    <button type="button" class="editor-btn" onclick="LandingPage.formatText('bold')" title="Bold">
                                        <i data-feather="bold"></i>
                                    </button>
                                    <button type="button" class="editor-btn" onclick="LandingPage.formatText('italic')" title="Italic">
                                        <i data-feather="italic"></i>
                                    </button>
                                    <button type="button" class="editor-btn" onclick="LandingPage.formatText('underline')" title="Underline">
                                        <i data-feather="underline"></i>
                                    </button>
                                </div>
                                <div class="form-editor" contenteditable="true" name="description" data-placeholder="Enter hero description...">${hero.description || ''}</div>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Hero Image URL</label>
                            <input type="url" class="form-input" name="image" value="${hero.image || ''}" placeholder="https://example.com/hero-image.jpg">
                            ${hero.image ? `<div class="image-preview mt-2"><img src="${hero.image}" alt="Hero Image" style="max-width: 200px; border-radius: var(--radius-md);"></div>` : ''}
                        </div>
                        
                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">
                                <i data-feather="save"></i>
                                Save Hero Section
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }

    static renderAboutSection(about) {
        return `
            <div class="section-card card">
                <div class="card-header">
                    <h3 class="card-title">About Section</h3>
                    <button class="btn btn-primary" onclick="LandingPage.showPreview('about')">
                        <i data-feather="eye"></i>
                        Preview
                    </button>
                </div>
                <div class="card-body">
                    <form id="aboutForm" onsubmit="LandingPage.saveAboutSection(event)">
                        <div class="form-group">
                            <label class="form-label">Section Title *</label>
                            <input type="text" class="form-input" name="title" value="${Utils.escapeHTML(about.title || '')}" required>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Content *</label>
                            <div class="editor-container">
                                <div class="editor-toolbar">
                                    <button type="button" class="editor-btn" onclick="LandingPage.formatText('bold', 'aboutContent')" title="Bold">
                                        <i data-feather="bold"></i>
                                    </button>
                                    <button type="button" class="editor-btn" onclick="LandingPage.formatText('italic', 'aboutContent')" title="Italic">
                                        <i data-feather="italic"></i>
                                    </button>
                                    <button type="button" class="editor-btn" onclick="LandingPage.formatText('insertUnorderedList', 'aboutContent')" title="Bullet List">
                                        <i data-feather="list"></i>
                                    </button>
                                </div>
                                <div class="form-editor" contenteditable="true" id="aboutContent" data-placeholder="Enter about content...">${about.content || ''}</div>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">About Image URL</label>
                            <input type="url" class="form-input" name="image" value="${about.image || ''}" placeholder="https://example.com/about-image.jpg">
                            ${about.image ? `<div class="image-preview mt-2"><img src="${about.image}" alt="About Image" style="max-width: 200px; border-radius: var(--radius-md);"></div>` : ''}
                        </div>
                        
                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">
                                <i data-feather="save"></i>
                                Save About Section
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }

    static renderVisionMissionSection(data) {
        return `
            <div class="vision-mission-sections">
                <div class="section-card card mb-4">
                    <div class="card-header">
                        <h3 class="card-title">Vision Statement</h3>
                    </div>
                    <div class="card-body">
                        <form id="visionForm" onsubmit="LandingPage.saveVision(event)">
                            <div class="form-group">
                                <label class="form-label">Vision Statement *</label>
                                <div class="editor-container">
                                    <div class="editor-toolbar">
                                        <button type="button" class="editor-btn" onclick="LandingPage.formatText('bold', 'visionContent')" title="Bold">
                                            <i data-feather="bold"></i>
                                        </button>
                                        <button type="button" class="editor-btn" onclick="LandingPage.formatText('italic', 'visionContent')" title="Italic">
                                            <i data-feather="italic"></i>
                                        </button>
                                    </div>
                                    <div class="form-editor" contenteditable="true" id="visionContent" data-placeholder="Enter vision statement...">${data.vision || ''}</div>
                                </div>
                            </div>
                            
                            <div class="form-actions">
                                <button type="submit" class="btn btn-primary">
                                    <i data-feather="save"></i>
                                    Save Vision
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                
                <div class="section-card card">
                    <div class="card-header">
                        <h3 class="card-title">Mission Statement</h3>
                    </div>
                    <div class="card-body">
                        <form id="missionForm" onsubmit="LandingPage.saveMission(event)">
                            <div class="form-group">
                                <label class="form-label">Mission Statement *</label>
                                <div class="editor-container">
                                    <div class="editor-toolbar">
                                        <button type="button" class="editor-btn" onclick="LandingPage.formatText('bold', 'missionContent')" title="Bold">
                                            <i data-feather="bold"></i>
                                        </button>
                                        <button type="button" class="editor-btn" onclick="LandingPage.formatText('italic', 'missionContent')" title="Italic">
                                            <i data-feather="italic"></i>
                                        </button>
                                    </div>
                                    <div class="form-editor" contenteditable="true" id="missionContent" data-placeholder="Enter mission statement...">${data.mission || ''}</div>
                                </div>
                            </div>
                            
                            <div class="form-actions">
                                <button type="submit" class="btn btn-primary">
                                    <i data-feather="save"></i>
                                    Save Mission
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
    }

    static renderAchievementsSection(achievements) {
        return `
            <div class="section-card card">
                <div class="card-header">
                    <h3 class="card-title">Achievements</h3>
                    <button class="btn btn-primary" onclick="LandingPage.addAchievement()">
                        <i data-feather="plus"></i>
                        Add Achievement
                    </button>
                </div>
                <div class="card-body">
                    <div class="achievements-list" id="achievementsList">
                        ${this.renderAchievementsList(achievements || [])}
                    </div>
                </div>
            </div>
        `;
    }

    static renderAchievementsList(achievements) {
        if (achievements.length === 0) {
            return `
                <div class="empty-state">
                    <div class="empty-state-icon">
                        <i data-feather="award"></i>
                    </div>
                    <div class="empty-state-title">No Achievements</div>
                    <div class="empty-state-desc">Add your first achievement to showcase accomplishments.</div>
                </div>
            `;
        }

        return achievements.map((achievement, index) => `
            <div class="achievement-item">
                <div class="achievement-content">
                    <div class="achievement-text">${Utils.escapeHTML(achievement)}</div>
                </div>
                <div class="achievement-actions">
                    <button class="btn btn-sm btn-secondary" onclick="LandingPage.editAchievement(${index})" title="Edit">
                        <i data-feather="edit-2"></i>
                    </button>
                    <button class="btn btn-sm btn-error" onclick="LandingPage.deleteAchievement(${index})" title="Delete">
                        <i data-feather="trash-2"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    static renderContactSection(contact) {
        return `
            <div class="section-card card">
                <div class="card-header">
                    <h3 class="card-title">Contact Information</h3>
                </div>
                <div class="card-body">
                    <form id="contactForm" onsubmit="LandingPage.saveContactSection(event)">
                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label">Address *</label>
                                <textarea class="form-textarea" name="address" rows="3" required>${Utils.escapeHTML(contact.address || '')}</textarea>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">Phone *</label>
                                <input type="tel" class="form-input" name="phone" value="${Utils.escapeHTML(contact.phone || '')}" required>
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label">Email *</label>
                                <input type="email" class="form-input" name="email" value="${Utils.escapeHTML(contact.email || '')}" required>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">Website</label>
                                <input type="url" class="form-input" name="website" value="${Utils.escapeHTML(contact.website || '')}" placeholder="https://www.college.edu">
                            </div>
                        </div>
                        
                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">
                                <i data-feather="save"></i>
                                Save Contact Info
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }

    static switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update tab panels
        document.querySelectorAll('.tab-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        document.getElementById(tabName).classList.add('active');

        // Replace feather icons
        feather.replace();
    }

    static formatText(command, editorId = null) {
        if (editorId) {
            document.getElementById(editorId).focus();
        }
        document.execCommand(command, false, null);
    }

    static saveHeroSection(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const description = document.querySelector('#heroForm .form-editor').innerHTML;
        
        const heroData = {
            title: formData.get('title').trim(),
            subtitle: formData.get('subtitle').trim(),
            description: description,
            image: formData.get('image').trim()
        };

        // Validation
        if (!heroData.title) {
            Utils.showToast('Please enter a title', 'error');
            return;
        }

        if (heroData.image && !Utils.isValidURL(heroData.image)) {
            Utils.showToast('Please enter a valid image URL', 'error');
            return;
        }

        try {
            const landingPageData = storage.get('landingPage');
            landingPageData.hero = heroData;
            storage.set('landingPage', landingPageData);
            
            Utils.showToast('Hero section saved successfully!');
        } catch (error) {
            console.error('Error saving hero section:', error);
            Utils.showToast('Failed to save hero section', 'error');
        }
    }

    static saveAboutSection(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const content = document.getElementById('aboutContent').innerHTML;
        
        const aboutData = {
            title: formData.get('title').trim(),
            content: content,
            image: formData.get('image').trim()
        };

        // Validation
        if (!aboutData.title) {
            Utils.showToast('Please enter a title', 'error');
            return;
        }

        if (aboutData.image && !Utils.isValidURL(aboutData.image)) {
            Utils.showToast('Please enter a valid image URL', 'error');
            return;
        }

        try {
            const landingPageData = storage.get('landingPage');
            landingPageData.about = aboutData;
            storage.set('landingPage', landingPageData);
            
            Utils.showToast('About section saved successfully!');
        } catch (error) {
            console.error('Error saving about section:', error);
            Utils.showToast('Failed to save about section', 'error');
        }
    }

    static saveVision(event) {
        event.preventDefault();
        
        const vision = document.getElementById('visionContent').innerHTML.trim();
        
        if (!vision) {
            Utils.showToast('Please enter a vision statement', 'error');
            return;
        }

        try {
            const landingPageData = storage.get('landingPage');
            landingPageData.vision = vision;
            storage.set('landingPage', landingPageData);
            
            Utils.showToast('Vision statement saved successfully!');
        } catch (error) {
            console.error('Error saving vision:', error);
            Utils.showToast('Failed to save vision statement', 'error');
        }
    }

    static saveMission(event) {
        event.preventDefault();
        
        const mission = document.getElementById('missionContent').innerHTML.trim();
        
        if (!mission) {
            Utils.showToast('Please enter a mission statement', 'error');
            return;
        }

        try {
            const landingPageData = storage.get('landingPage');
            landingPageData.mission = mission;
            storage.set('landingPage', landingPageData);
            
            Utils.showToast('Mission statement saved successfully!');
        } catch (error) {
            console.error('Error saving mission:', error);
            Utils.showToast('Failed to save mission statement', 'error');
        }
    }

    static addAchievement() {
        const content = `
            <form id="achievementForm" onsubmit="LandingPage.handleAddAchievement(event)">
                <div class="form-group">
                    <label class="form-label">Achievement *</label>
                    <input type="text" class="form-input" name="achievement" required placeholder="e.g., Top 10 Engineering College">
                </div>
                
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" onclick="Utils.hideModal()">Cancel</button>
                    <button type="submit" class="btn btn-primary">Add Achievement</button>
                </div>
            </form>
        `;
        
        Utils.showModal('Add Achievement', content, { size: 'sm' });
    }

    static handleAddAchievement(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const achievement = formData.get('achievement').trim();
        
        if (!achievement) {
            Utils.showToast('Please enter an achievement', 'error');
            return;
        }

        try {
            const landingPageData = storage.get('landingPage');
            landingPageData.achievements = landingPageData.achievements || [];
            landingPageData.achievements.push(achievement);
            storage.set('landingPage', landingPageData);
            
            Utils.showToast('Achievement added successfully!');
            Utils.hideModal();
            this.refreshAchievements();
        } catch (error) {
            console.error('Error adding achievement:', error);
            Utils.showToast('Failed to add achievement', 'error');
        }
    }

    static editAchievement(index) {
        const landingPageData = storage.get('landingPage');
        const achievement = landingPageData.achievements[index];
        
        const content = `
            <form id="editAchievementForm" onsubmit="LandingPage.handleEditAchievement(event, ${index})">
                <div class="form-group">
                    <label class="form-label">Achievement *</label>
                    <input type="text" class="form-input" name="achievement" value="${Utils.escapeHTML(achievement)}" required>
                </div>
                
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" onclick="Utils.hideModal()">Cancel</button>
                    <button type="submit" class="btn btn-primary">Update Achievement</button>
                </div>
            </form>
        `;
        
        Utils.showModal('Edit Achievement', content, { size: 'sm' });
    }

    static handleEditAchievement(event, index) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const achievement = formData.get('achievement').trim();
        
        if (!achievement) {
            Utils.showToast('Please enter an achievement', 'error');
            return;
        }

        try {
            const landingPageData = storage.get('landingPage');
            landingPageData.achievements[index] = achievement;
            storage.set('landingPage', landingPageData);
            
            Utils.showToast('Achievement updated successfully!');
            Utils.hideModal();
            this.refreshAchievements();
        } catch (error) {
            console.error('Error updating achievement:', error);
            Utils.showToast('Failed to update achievement', 'error');
        }
    }

    static deleteAchievement(index) {
        const landingPageData = storage.get('landingPage');
        const achievement = landingPageData.achievements[index];
        
        Utils.showConfirmation(
            'Delete Achievement',
            `Are you sure you want to delete "${achievement}"?`,
            () => {
                try {
                    landingPageData.achievements.splice(index, 1);
                    storage.set('landingPage', landingPageData);
                    
                    Utils.showToast('Achievement deleted successfully!');
                    this.refreshAchievements();
                } catch (error) {
                    console.error('Error deleting achievement:', error);
                    Utils.showToast('Failed to delete achievement', 'error');
                }
            }
        );
    }

    static saveContactSection(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const contactData = {
            address: formData.get('address').trim(),
            phone: formData.get('phone').trim(),
            email: formData.get('email').trim(),
            website: formData.get('website').trim()
        };

        // Validation
        if (!contactData.address || !contactData.phone || !contactData.email) {
            Utils.showToast('Please fill in all required fields', 'error');
            return;
        }

        if (!Utils.isValidEmail(contactData.email)) {
            Utils.showToast('Please enter a valid email address', 'error');
            return;
        }

        if (contactData.website && !Utils.isValidURL(contactData.website)) {
            Utils.showToast('Please enter a valid website URL', 'error');
            return;
        }

        try {
            const landingPageData = storage.get('landingPage');
            landingPageData.contact = contactData;
            storage.set('landingPage', landingPageData);
            
            Utils.showToast('Contact information saved successfully!');
        } catch (error) {
            console.error('Error saving contact info:', error);
            Utils.showToast('Failed to save contact information', 'error');
        }
    }

    static showPreview(section) {
        const landingPageData = storage.get('landingPage');
        let content = '';
        
        switch (section) {
            case 'hero':
                content = this.generateHeroPreview(landingPageData.hero);
                break;
            case 'about':
                content = this.generateAboutPreview(landingPageData.about);
                break;
        }
        
        Utils.showModal(`${section.charAt(0).toUpperCase() + section.slice(1)} Preview`, content, { size: 'xl' });
    }

    static generateHeroPreview(hero) {
        return `
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 3rem; text-align: center; border-radius: var(--radius-lg);">
                ${hero.image ? `<img src="${hero.image}" alt="Hero" style="max-width: 100%; height: 200px; object-fit: cover; border-radius: var(--radius-md); margin-bottom: 2rem;">` : ''}
                <h1 style="font-size: 2.5rem; font-weight: bold; margin-bottom: 1rem;">${hero.title || 'Hero Title'}</h1>
                ${hero.subtitle ? `<h2 style="font-size: 1.5rem; margin-bottom: 1rem; opacity: 0.9;">${hero.subtitle}</h2>` : ''}
                <div style="font-size: 1.125rem; line-height: 1.6; max-width: 600px; margin: 0 auto;">${hero.description || 'Hero description...'}</div>
            </div>
        `;
    }

    static generateAboutPreview(about) {
        return `
            <div style="padding: 2rem; background-color: var(--bg-secondary); border-radius: var(--radius-lg);">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; align-items: center;">
                    <div>
                        <h2 style="font-size: 2rem; font-weight: bold; margin-bottom: 1rem; color: var(--text-primary);">${about.title || 'About Title'}</h2>
                        <div style="font-size: 1rem; line-height: 1.6; color: var(--text-secondary);">${about.content || 'About content...'}</div>
                    </div>
                    ${about.image ? `<div><img src="${about.image}" alt="About" style="width: 100%; border-radius: var(--radius-md);"></div>` : '<div style="background-color: var(--bg-tertiary); height: 200px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; color: var(--text-muted);">No Image</div>'}
                </div>
            </div>
        `;
    }

    static refreshAchievements() {
        const landingPageData = storage.get('landingPage');
        const achievementsList = document.getElementById('achievementsList');
        achievementsList.innerHTML = this.renderAchievementsList(landingPageData.achievements || []);
        feather.replace();
    }

    static initializeEditors() {
        // Add styling for the tabs and editor
        if (!document.getElementById('landingPageStyles')) {
            const style = document.createElement('style');
            style.id = 'landingPageStyles';
            style.textContent = `
                .landing-page-tabs {
                    background-color: var(--bg-primary);
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius-lg);
                    overflow: hidden;
                }
                
                .tab-nav {
                    display: flex;
                    background-color: var(--bg-secondary);
                    border-bottom: 1px solid var(--border-color);
                    overflow-x: auto;
                }
                
                .tab-btn {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-sm);
                    padding: var(--spacing-md) var(--spacing-lg);
                    background: none;
                    border: none;
                    color: var(--text-secondary);
                    cursor: pointer;
                    transition: all var(--transition-fast);
                    white-space: nowrap;
                    border-bottom: 2px solid transparent;
                }
                
                .tab-btn:hover {
                    background-color: var(--bg-tertiary);
                    color: var(--text-primary);
                }
                
                .tab-btn.active {
                    background-color: var(--bg-primary);
                    color: var(--primary-color);
                    border-bottom-color: var(--primary-color);
                }
                
                .tab-content {
                    padding: var(--spacing-xl);
                }
                
                .tab-panel {
                    display: none;
                }
                
                .tab-panel.active {
                    display: block;
                }
                
                .section-card {
                    margin-bottom: var(--spacing-lg);
                }
                
                .editor-container {
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius-md);
                    overflow: hidden;
                }
                
                .editor-toolbar {
                    display: flex;
                    gap: var(--spacing-xs);
                    padding: var(--spacing-sm);
                    background-color: var(--bg-secondary);
                    border-bottom: 1px solid var(--border-color);
                }
                
                .editor-btn {
                    background: none;
                    border: none;
                    padding: var(--spacing-xs);
                    border-radius: var(--radius-sm);
                    color: var(--text-secondary);
                    cursor: pointer;
                    transition: background-color var(--transition-fast);
                }
                
                .editor-btn:hover {
                    background-color: var(--bg-tertiary);
                }
                
                .form-editor {
                    min-height: 120px;
                    padding: var(--spacing-md);
                    background-color: var(--bg-primary);
                    color: var(--text-primary);
                    outline: none;
                    line-height: 1.5;
                }
                
                .form-editor:empty::before {
                    content: attr(data-placeholder);
                    color: var(--text-muted);
                }
                
                .achievement-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: var(--spacing-md);
                    background-color: var(--bg-secondary);
                    border-radius: var(--radius-md);
                    margin-bottom: var(--spacing-sm);
                }
                
                .achievement-content {
                    flex: 1;
                }
                
                .achievement-text {
                    color: var(--text-primary);
                    font-weight: 500;
                }
                
                .achievement-actions {
                    display: flex;
                    gap: var(--spacing-sm);
                }
                
                .form-actions {
                    display: flex;
                    justify-content: flex-end;
                    margin-top: var(--spacing-lg);
                }
                
                .vision-mission-sections .section-card:last-child {
                    margin-bottom: 0;
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// Initialize when the module loads
document.addEventListener('DOMContentLoaded', () => {
    LandingPage.initializeEditors();
});

// Make LandingPage available globally
window.LandingPage = LandingPage;
