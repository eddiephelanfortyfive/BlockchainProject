/**
 * Wallet connection and management
 */
const Wallet = {
    /**
     * Initialize Web3 connection
     */
    init: async function() {
        try {
            // Initialize Web3 with Sepolia provider
            const provider = new Web3.providers.HttpProvider('https://sepolia.infura.io/v3/YOUR_INFURA_KEY');
            AppState.web3 = new Web3(provider);
            
            // Check for existing keystore
            const keystore = localStorage.getItem('keystore');
            if (keystore) {
                await this.connectWithKeystore();
            }
        } catch (error) {
            console.error('Error initializing Web3:', error);
        }
    },

    /**
     * Connect with keystore file
     */
    connectWithKeystore: async function() {
        try {
            const keystore = localStorage.getItem('keystore');
            if (!keystore) {
                throw new Error('No keystore found. Please create or import a wallet first.');
            }

            const password = document.getElementById('keystore-password').value;
            if (!password) {
                throw new Error('Please enter your password');
            }

            // Decrypt the keystore
            const account = await AppState.web3.eth.accounts.decrypt(keystore, password);
            
            // Update the current account
            AppState.currentAccount = account.address;
            
            // Update UI
            UI.updateAccountInfo();
            UI.hideElement(DOM.web3ConnectForm);
            UI.showElement(DOM.accountInfo);
            
            // Initialize contract
            await Token.initContract();
            
            return true;
        } catch (error) {
            console.error('Error connecting with keystore:', error);
            alert('Failed to connect wallet: ' + error.message);
            return false;
        }
    },

    /**
     * Create new wallet
     */
    createNewWallet: async function() {
        try {
            const password = document.getElementById('wallet-password').value;
            if (!password) {
                throw new Error('Please enter a password');
            }

            // Create new account
            const account = AppState.web3.eth.accounts.create();
            
            // Encrypt the private key
            const keystore = await AppState.web3.eth.accounts.encrypt(account.privateKey, password);
            
            // Store keystore in localStorage
            localStorage.setItem('keystore', JSON.stringify(keystore));
            
            // Update UI with new wallet details
            document.getElementById('new-wallet-address').textContent = account.address;
            UI.showElement(document.getElementById('wallet-details'));
            
            // Create download link for keystore
            const blob = new Blob([JSON.stringify(keystore)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const downloadBtn = document.getElementById('download-keystore-btn');
            downloadBtn.href = url;
            downloadBtn.download = `keystore-${account.address}.json`;
            
            return account;
        } catch (error) {
            console.error('Error creating wallet:', error);
            alert('Failed to create wallet: ' + error.message);
            return null;
        }
    },

    /**
     * Connect newly created wallet
     */
    connectNewWallet: async function() {
        try {
            await this.connectWithKeystore();
            UI.navigateToPage('buy-tickets');
        } catch (error) {
            console.error('Error connecting new wallet:', error);
            alert('Failed to connect new wallet: ' + error.message);
        }
    }
};

// Expose functions to global scope
window.connectWithKeystore = function() {
    Wallet.connectWithKeystore();
};

window.connectNewWallet = function() {
    Wallet.connectNewWallet();
}; 