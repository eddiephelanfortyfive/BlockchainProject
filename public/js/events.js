/**
 * Event handlers
 */
const Events = {
    /**
     * Initialize all event handlers
     */
    init: function() {
        // Remove MetaMask event listeners
        // Keep only Web3 wallet related events
        DOM.connectWeb3Btn.addEventListener('click', () => {
            UI.showElement(DOM.web3ConnectForm);
        });

        DOM.keystoreFileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                UI.showElement(DOM.keystorePasswordContainer);
            }
        });

        // Keep other event listeners for Web3 functionality
        DOM.buyEthForm.addEventListener('submit', Token.buyTokensWithETH.bind(Token));
        DOM.transferUserForm.addEventListener('submit', Token.transferToUser.bind(Token));
        
        if (DOM.transferVendorForm) {
            DOM.transferVendorForm.addEventListener('submit', Token.transferToVendor.bind(Token));
        }
        
        if (DOM.verifyTicketBtn) {
            DOM.verifyTicketBtn.addEventListener('click', Token.verifyTicketHolder);
        }
        
        const generateWalletBtn = document.getElementById('generate-wallet-btn');
        if (generateWalletBtn) {
            generateWalletBtn.addEventListener('click', Wallet.createNewWallet);
        }
        
        const downloadKeystoreBtn = document.getElementById('download-keystore-btn');
        if (downloadKeystoreBtn) {
            downloadKeystoreBtn.addEventListener('click', Wallet.downloadKeystore);
        }
        
        const copyAddressBtn = document.getElementById('copy-address-btn');
        if (copyAddressBtn) {
            copyAddressBtn.addEventListener('click', Wallet.copyWalletAddress);
        }
        
        const connectNewWalletBtn = document.getElementById('connect-new-wallet-btn');
        if (connectNewWalletBtn) {
            connectNewWalletBtn.addEventListener('click', Wallet.connectNewWallet);
        }
        
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.dataset.page;
                UI.navigateToPage(page);
            });
        });
        
        const homeCreateWalletBtn = document.getElementById('home-create-wallet');
        if (homeCreateWalletBtn) {
            homeCreateWalletBtn.addEventListener('click', () => {
                UI.navigateToPage('create-wallet');
            });
        }
        
        const homeBuyTicketsBtn = document.getElementById('home-buy-tickets');
        if (homeBuyTicketsBtn) {
            homeBuyTicketsBtn.addEventListener('click', () => {
                UI.navigateToPage('buy-tickets');
            });
        }
        
        const roleBtns = document.querySelectorAll('.role-btn');
        roleBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                roleBtns.forEach(b => b.classList.remove('active'));
                
                btn.classList.add('active');
                
                const role = btn.dataset.role;
                const views = [
                    document.getElementById('attendee-view'),
                    document.getElementById('doorman-view'),
                    document.getElementById('venue-view')
                ];
                
                const currentView = views.find(v => !v.classList.contains('hidden'));
                const targetView = views.find(v => v.id === `${role}-view`);
                
                if (currentView && targetView && currentView !== targetView) {
                    UI.fadeOut(currentView, () => {
                        UI.fadeIn(targetView);
                    });
                }
            });
        });
        
        const transferBtns = document.querySelectorAll('.transfer-btn');
        transferBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                transferBtns.forEach(b => b.classList.remove('active'));
                
                btn.classList.add('active');
                
                const transferType = btn.dataset.transfer;
                const userTransfer = document.getElementById('user-transfer');
                const vendorTransfer = document.getElementById('vendor-transfer');
                
                if (transferType === 'user') {
                    if (!vendorTransfer.classList.contains('hidden')) {
                        UI.fadeOut(vendorTransfer, () => {
                            UI.fadeIn(userTransfer);
                        });
                    }
                } else {
                    if (!userTransfer.classList.contains('hidden')) {
                        UI.fadeOut(userTransfer, () => {
                            UI.fadeIn(vendorTransfer);
                        });
                    }
                }
            });
        });
        
        const formInputs = document.querySelectorAll('input, textarea');
        formInputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('input-focus');
            });
            
            input.addEventListener('blur', () => {
                input.parentElement.classList.remove('input-focus');
            });
            
            if (input.tagName === 'TEXTAREA') {
                input.addEventListener('input', () => {
                    input.style.height = 'auto';
                    input.style.height = input.scrollHeight + 'px';
                });
            }
        });
        
        const connectWalletBtn = document.querySelector('button[onclick="connectWithKeystore()"]');
        if (connectWalletBtn) {
            connectWalletBtn.addEventListener('click', (e) => {
                e.preventDefault();
                Wallet.connectWithKeystore();
            });
        }
    }
}; 