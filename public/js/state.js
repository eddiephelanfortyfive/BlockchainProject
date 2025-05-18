/**
 * Application state management
 */
window.AppState = {
    web3: null,
    contract: null,
    currentAccount: null,
    isCorrectNetwork: false,
    walletConnected: false,
    sepoliaChainId: '0xaa36a7', // Sepolia testnet chain ID in hex
    tokenPrice: 0.00001, // Token price in ETH
    newWallet: null,
    encryptedKeystore: null
}; 