/**
 * Token operations
 */
const Token = {
    /**
     * Initialize contract
     */
    initContract: async function() {
        try {
            AppState.contract = new AppState.web3.eth.Contract(
                CONTRACT_ABI,
                CONTRACT_ADDRESS
            );
            await this.loadTokenInfo();
            await this.loadTokenBalances();
        } catch (error) {
            console.error('Error initializing contract:', error);
        }
    },
    
    /**
     * Load token information
     */
    loadTokenInfo: async function() {
        if (!AppState.contract) return;
        
        try {
            const name = await AppState.contract.methods.name().call();
            const symbol = await AppState.contract.methods.symbol().call();
            const totalSupply = await AppState.contract.methods.totalSupply().call();
            const decimals = await AppState.contract.methods.decimals().call();  
            
            document.querySelectorAll('.token-symbol').forEach(el => {
                el.textContent = symbol;
            });
            
            if (DOM.totalTokenSupply) {
                DOM.totalTokenSupply.textContent = this.formatTokenAmount(totalSupply, decimals) + ' ' + symbol;
            }
            
            const ethPriceElement = document.getElementById('eth-price-per-ticket');
            if (ethPriceElement) {
                ethPriceElement.textContent = AppState.tokenPrice + ' ETH';
            }
        } catch (error) {
            console.error('Error loading token info:', error);
        }
    },
    
    /**
     * Format token amount with proper decimals
     * @param {string|number} amount - Token amount
     * @param {number} decimals - Token decimals
     * @returns {string} - Formatted amount
     */
    formatTokenAmount: function(amount, decimals) {
        const divisor = Math.pow(10, decimals);
        return (amount / divisor).toLocaleString();
    },
    
    /**
     * Load user's token balance
     */
    loadTokenBalances: async function() {
        if (!AppState.contract || !AppState.currentAccount) return;
        
        try {
            const balance = await AppState.contract.methods.balanceOf(AppState.currentAccount).call();
            const symbol = await AppState.contract.methods.symbol().call();
            const decimals = await AppState.contract.methods.decimals().call();
            
            const formattedBalance = this.formatTokenAmount(balance, decimals);
            
            if (DOM.userTicketBalance) {
                DOM.userTicketBalance.textContent = formattedBalance;
            }
            
            if (DOM.currentTicketBalance) {
                DOM.currentTicketBalance.textContent = formattedBalance;
            }
            
            const ticketListElement = document.getElementById('attendee-ticket-list');
            if (ticketListElement && parseInt(balance) > 0) {
                ticketListElement.innerHTML = '';
                
                const ticketCard = document.createElement('div');
                ticketCard.className = 'ticket-item';
                
                ticketCard.innerHTML = `
                    <div class="ticket-header">
                        <h4>Your Tickets</h4>
                        <span class="ticket-id">${formattedBalance} ${symbol}</span>
                    </div>
                    <p>These tokens can be used as tickets for entry to events.</p>
                    <p class="ticket-owner">Owner: ${AppState.currentAccount.substring(0, 6)}...${AppState.currentAccount.substring(38)}</p>
                `;
                
                ticketListElement.appendChild(ticketCard);
            }
        } catch (error) {
            console.error('Error loading token balance:', error);
        }
    },
    
    /**
     * Buy tokens with ETH
     */
    buyTokensWithETH: async function(e) {
        e.preventDefault();
        
        if (!AppState.contract || !AppState.currentAccount) {
            alert('Please connect your wallet first.');
            return;
        }
        
        const ethAmount = DOM.ethAmountInput.value;
        if (!ethAmount || parseFloat(ethAmount) <= 0) {
            alert('Please enter a valid ETH amount.');
            return;
        }
        
        const weiAmount = AppState.web3.utils.toWei(ethAmount, 'ether');
        
        UI.showLoading('Buying tickets with ETH...');
        
        try {
            // Get the private key from the keystore
            const keystore = localStorage.getItem('keystore');
            if (!keystore) {
                throw new Error('No keystore found. Please connect your wallet first.');
            }

            const password = document.getElementById('keystore-password').value;
            const account = await AppState.web3.eth.accounts.decrypt(keystore, password);
            
            // Create transaction object
            const tx = {
                from: AppState.currentAccount,
                to: CONTRACT_ADDRESS,
                value: weiAmount,
                gas: await AppState.contract.methods.buyToken().estimateGas({ 
                    from: AppState.currentAccount,
                    value: weiAmount 
                }).then(gas => Math.floor(gas * 1.2)),
                data: AppState.contract.methods.buyToken().encodeABI()
            };
            
            // Sign and send transaction
            const signedTx = await AppState.web3.eth.accounts.signTransaction(tx, account.privateKey);
            const receipt = await AppState.web3.eth.sendSignedTransaction(signedTx.rawTransaction);
            
            // Reset form and reload info
            DOM.buyEthForm.reset();
            await this.loadTokenInfo();
            await this.loadTokenBalances();
            
            UI.hideLoading();
            alert('Tickets purchased successfully!');
            
        } catch (error) {
            console.error('Error buying tokens:', error);
            alert('Failed to buy tickets: ' + error.message);
            UI.hideLoading();
        }
    },
    
    /**
     * Update token estimate based on ETH input
     */
    updateTokenEstimate: function() {
        const ethAmount = parseFloat(DOM.ethAmountInput.value) || 0;
        const tokenEstimate = Math.floor(ethAmount / AppState.tokenPrice);
        DOM.ethTicketsEstimateInput.value = tokenEstimate;
    },
    
    /**
     * Transfer tokens to another user
     * @param {Event} e - Form submit event
     */
    transferToUser: async function(e) {
        e.preventDefault();
        
        if (!AppState.contract || !AppState.currentAccount) {
            alert('Please connect your wallet first');
            return;
        }
        
        const recipient = document.getElementById('recipient-address').value.trim();
        const amount = parseInt(document.getElementById('transfer-amount').value);
        
        if (!AppState.web3.utils.isAddress(recipient)) {
            alert('Invalid Ethereum address. Please enter a valid address.');
            return;
        }
        
        if (!amount || amount <= 0) {
            alert('Please enter a valid number of tickets.');
            return;
        }
        
        UI.showLoading('Transferring tickets...');
        
        try {
            const decimals = await AppState.contract.methods.decimals().call();
            const tokenAmount = amount * Math.pow(10, decimals);
            
            await AppState.contract.methods.transfer(recipient, tokenAmount.toString())
                .send({ from: AppState.currentAccount });
            
            DOM.transferUserForm.reset();
            this.loadTokenBalances();
            Venue.loadTransferHistory();
            UI.hideLoading();
            alert('Tickets transferred successfully!');
        } catch (error) {
            console.error('Error transferring tokens:', error);
            alert('Failed to transfer tickets. Please check console for details.');
            UI.hideLoading();
        }
    },
    
    /**
     * Transfer tokens back to vendor
     * @param {Event} e - Form submit event
     */
    transferToVendor: async function(e) {
        e.preventDefault();
        
        if (!AppState.contract || !AppState.currentAccount) {
            alert('Please connect your wallet first');
            return;
        }
        
        const amount = parseInt(document.getElementById('vendor-transfer-amount').value);
        
        if (!amount || amount <= 0) {
            alert('Please enter a valid number of tickets.');
            return;
        }
        
        UI.showLoading('Returning tickets to vendor...');
        
        try {
            const decimals = await AppState.contract.methods.decimals().call();
            const tokenAmount = amount * Math.pow(10, decimals);
            
            await AppState.contract.methods.transfer(contractAddress, tokenAmount.toString())
                .send({ from: AppState.currentAccount });
            
            DOM.transferVendorForm.reset();
            this.loadTokenBalances();
            Venue.loadVenueStats();
            Venue.loadTransferHistory();
            UI.hideLoading();
            alert('Tickets returned to vendor successfully!');
        } catch (error) {
            console.error('Error returning tokens to vendor:', error);
            alert('Failed to return tickets. Please check console for details.');
            UI.hideLoading();
        }
    },
    
    /**
     * Verify ticket holder
     */
    verifyTicketHolder: async function() {
        const address = DOM.ticketAddressInput.value.trim();
        
        if (!AppState.contract) {
            alert('Please connect to the network first');
            return;
        }
        
        if (!AppState.web3.utils.isAddress(address)) {
            alert('Invalid Ethereum address. Please enter a valid address.');
            return;
        }
        
        UI.showLoading('Verifying ticket holder...');
        
        try {
            const balance = await AppState.contract.methods.balanceOf(address).call();
            const decimals = await AppState.contract.methods.decimals().call();
            const symbol = await AppState.contract.methods.symbol().call();
            const formattedBalance = this.formatTokenAmount(balance, decimals);
            
            const verificationResult = document.getElementById('verification-result');
            verificationResult.classList.remove('hidden');
            
            if (parseInt(balance) > 0) {
                verificationResult.classList.add('success');
                verificationResult.classList.remove('error');
                verificationResult.innerHTML = `
                    <h4>Verification Successful</h4>
                    <p>Address ${address.substring(0, 6)}...${address.substring(38)} has ${formattedBalance} ${symbol}</p>
                    <p>This user is authorized for entry.</p>
                `;
            } else {
                verificationResult.classList.add('error');
                verificationResult.classList.remove('success');
                verificationResult.innerHTML = `
                    <h4>Verification Failed</h4>
                    <p>Address ${address.substring(0, 6)}...${address.substring(38)} has no tickets.</p>
                    <p>This user is NOT authorized for entry.</p>
                `;
            }
            
            UI.hideLoading();
        } catch (error) {
            console.error('Error verifying ticket holder:', error);
            const verificationResult = document.getElementById('verification-result');
            verificationResult.classList.remove('hidden');
            verificationResult.classList.add('error');
            verificationResult.classList.remove('success');
            verificationResult.innerHTML = `
                <h4>Verification Error</h4>
                <p>An error occurred while verifying the ticket holder.</p>
            `;
            UI.hideLoading();
        }
    }
}; 