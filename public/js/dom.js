/**
 * DOM element references
 */
const DOM = {
    // Wallet elements
    walletOptions: document.getElementById('wallet-options'),
    connectWeb3Btn: document.getElementById('connect-web3'),
    accountInfo: document.getElementById('account-info'),
    accountAddress: document.getElementById('account-address'),
    networkName: document.getElementById('network-name'),
    networkWarning: document.getElementById('network-warning'),
    
    // Keystore elements
    keystoreFileInput: document.getElementById('keystore-file'),
    keystorePasswordContainer: document.getElementById('keystore-password-container'),
    
    // Ticket elements
    myTicketsSection: document.getElementById('my-tickets'),
    userTicketBalance: document.getElementById('user-ticket-balance'),
    currentTicketBalance: document.getElementById('current-ticket-balance'),
    
    // Venue elements
    totalTokenSupply: document.getElementById('total-token-supply'),
    ticketsSold: document.getElementById('tickets-sold'),
    availableTickets: document.getElementById('available-tickets'),
    
    // Transaction elements
    recentTransactions: document.getElementById('recent-transactions'),
    transferHistoryList: document.getElementById('transfer-history-list'),
    
    // Loading elements
    loadingOverlay: document.getElementById('loading-overlay'),
    loadingMessage: document.getElementById('loading-message'),
    
    // Form elements
    buyEthForm: document.getElementById('buy-eth-form'),
    ethAmountInput: document.getElementById('eth-amount'),
    ethTicketsEstimateInput: document.getElementById('eth-tickets-estimate'),
    transferUserForm: document.getElementById('transfer-user-form'),
    transferVendorForm: document.getElementById('transfer-vendor-form'),
    
    // Doorman elements
    ticketAddressInput: document.getElementById('ticket-address'),
    verifyTicketBtn: document.getElementById('verify-ticket-btn'),
    verificationResult: document.getElementById('verification-result'),
    
    // Wallet creation
    generateWalletBtn: document.getElementById('generate-wallet-btn'),
    downloadKeystoreBtn: document.getElementById('download-keystore-btn'),
    copyAddressBtn: document.getElementById('copy-address-btn'),
    connectNewWalletBtn: document.getElementById('connect-new-wallet-btn'),
}; 