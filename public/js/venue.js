/**
 * Venue-specific operations
 */
const Venue = {
    /**
     * Load venue statistics
     */
    loadVenueStats: async function() {
        if (!AppState.contract) return;
        
        try {
            const totalSupply = await AppState.contract.methods.totalSupply().call();
            const contractBalance = await AppState.contract.methods.balanceOf(contractAddress).call();
            const decimals = await AppState.contract.methods.decimals().call();
            
            // Tickets sold = total supply - contract balance
            const sold = totalSupply - contractBalance;
            
            if (DOM.ticketsSold) {
                DOM.ticketsSold.textContent = Token.formatTokenAmount(sold, decimals);
            }
            
            if (DOM.availableTickets) {
                DOM.availableTickets.textContent = Token.formatTokenAmount(contractBalance, decimals);
            }
            
            // Load recent transactions
            this.loadRecentTransactions();
        } catch (error) {
            console.error('Error loading venue stats:', error);
        }
    },
    
    /**
     * Load recent transactions
     */
    loadRecentTransactions: function() {
        const transactionsList = document.getElementById('recent-transactions');
        if (!transactionsList) return;

        try {
            // Empty state message
            transactionsList.innerHTML = `
                <div class="no-transactions">
                    <p>No recent transactions to display</p>
                    <p class="hint">Transactions will appear here when users purchase or transfer tickets</p>
                </div>
            `;
        } catch (error) {
            console.error('Error loading transactions:', error);
            transactionsList.innerHTML = '<p class="error-message">Failed to load transactions</p>';
        }
    },
    
    /**
     * Load transfer history
     */
    loadTransferHistory: function() {
        const historyList = document.getElementById('transfer-history-list');
        if (!historyList) return;
        
        // Empty state message
        historyList.innerHTML = `
            <div class="no-transactions">
                <p>No transfer history to display</p>
                <p class="hint">Your transfer history will appear here after you send or receive tickets</p>
            </div>
        `;
    }
}; 