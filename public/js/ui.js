/**
 * UI manipulation functions
 */
const UI = {
    /**
     * Update wallet connection UI based on connection state
     * @param {boolean} connected - Whether wallet is connected
     */
    updateWalletConnection: function(connected) {
        AppState.walletConnected = connected;
        
        if (!DOM.walletOptions) {
            console.error('Wallet options container not found');
            return;
        }
        
        DOM.walletOptions.innerHTML = '';
        
        if (connected) {
            const disconnectBtn = document.createElement('button');
            disconnectBtn.id = 'disconnect-wallet-btn';
            disconnectBtn.className = 'primary-btn disconnect-button';
            disconnectBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Disconnect Wallet';
            disconnectBtn.addEventListener('click', Wallet.disconnect);
            
            DOM.walletOptions.appendChild(disconnectBtn);
            
            if (DOM.accountInfo) {
                DOM.accountInfo.classList.remove('hidden');
            }
            
            const web3ConnectForm = document.getElementById('web3-connect-form');
            if (web3ConnectForm && !web3ConnectForm.classList.contains('hidden')) {
                web3ConnectForm.classList.add('hidden');
            }
        } else {
            // Only Web3/keystore connect button
            const web3Btn = document.createElement('button');
            web3Btn.id = 'connect-web3';
            web3Btn.className = 'primary-btn';
            web3Btn.innerHTML = '<i class="fas fa-wallet"></i> Connect Wallet';
            web3Btn.addEventListener('click', () => {
                const form = document.getElementById('web3-connect-form');
                if (form) form.classList.remove('hidden');
            });
            
            DOM.walletOptions.appendChild(web3Btn);
            
            DOM.walletOptions.style.display = 'flex';
            
            if (DOM.accountInfo) {
                DOM.accountInfo.classList.add('hidden');
            }
        }
    },
    
    /**
     * Show loading overlay with message
     * @param {string} message - Loading message to display
     */
    showLoading: function(message) {
        DOM.loadingMessage.textContent = message || 'Processing...';
        DOM.loadingOverlay.style.opacity = '0';
        DOM.loadingOverlay.classList.remove('hidden');
        
        void DOM.loadingOverlay.offsetWidth;
        
        DOM.loadingOverlay.style.transition = 'opacity 0.3s ease';
        DOM.loadingOverlay.style.opacity = '1';
    },
    
    /**
     * Hide loading overlay
     */
    hideLoading: function() {
        DOM.loadingOverlay.style.transition = 'opacity 0.3s ease';
        DOM.loadingOverlay.style.opacity = '0';
        
        setTimeout(() => {
            DOM.loadingOverlay.classList.add('hidden');
            DOM.loadingOverlay.style.transition = '';
        }, 300);
    },
    
    /**
     * Navigate to a specific page
     * @param {string} page - Page identifier to navigate to
     */
    navigateToPage: function(page) {
        if (!page) page = 'home';
        console.log(`Navigating to: ${page}`);
        
        const pageSections = document.querySelectorAll('.page-section');
        if (pageSections.length === 0) {
            console.error('No page sections found in the DOM');
            return;
        }
        
        const targetPage = document.getElementById(`page-${page}`);
        if (!targetPage) {
            console.error(`Target page not found: page-${page}`);
            return;
        }
        
        pageSections.forEach(section => {
            section.classList.add('hidden');
        });
        
        targetPage.classList.remove('hidden');
        
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            if (link.dataset.page === page) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        
        const currentHash = window.location.hash;
        const newHash = `#${page}`;
        if (currentHash !== newHash) {
            history.pushState(null, null, newHash);
        }
        
        console.log(`Successfully navigated to: ${page}`);
    },
    
    /**
     * Fade in animation
     * @param {HTMLElement} element - Element to fade in
     */
    fadeIn: function(element) {
        element.classList.remove('hidden');
        element.style.opacity = '0';
        setTimeout(() => {
            element.style.transition = 'opacity 0.3s ease';
            element.style.opacity = '1';
            setTimeout(() => {
                element.style.transition = '';
            }, 300);
        }, 10);
    },
    
    /**
     * Fade out animation
     * @param {HTMLElement} element - Element to fade out
     * @param {Function} callback - Function to call after fade out
     */
    fadeOut: function(element, callback) {
        element.style.transition = 'opacity 0.3s ease';
        element.style.opacity = '0';
        setTimeout(() => {
            element.classList.add('hidden');
            element.style.transition = '';
            element.style.opacity = '';
            if (callback) callback();
        }, 300);
    },
    
    /**
     * Show error message
     * @param {string} message - Error message to display
     */
    showError: function(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    },

    showElement: function(element) {
        if (element) element.classList.remove('hidden');
    },

    hideElement: function(element) {
        if (element) element.classList.add('hidden');
    }
}; 