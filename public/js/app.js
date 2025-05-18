/**
 * BlockTicket - Blockchain Ticketing System
 * Main application file
 */

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
        #disconnect-wallet-btn {
            background: linear-gradient(135deg, #ef4444 0%, #b91c1c 100%) !important;
            color: white !important;
            border: none !important;
            padding: 0.9rem 1.8rem !important;
            border-radius: 8px !important;
            cursor: pointer !important;
            font-weight: 600 !important;
            transition: all 0.3s !important;
            box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3) !important;
            width: 100% !important;
            margin-top: 10px !important;
        }
        
        #disconnect-wallet-btn:hover {
            background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%) !important;
            transform: translateY(-2px) !important;
            box-shadow: 0 6px 16px rgba(239, 68, 68, 0.4) !important;
        }
        
@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(34, 197, 94, 0); }
  100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
}
        
.pulse-animation {
  animation: pulse 1s 1;
}
        
.input-focus {
  position: relative;
}
        
.input-focus::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -3px;
  height: 2px;
  background: linear-gradient(90deg, #3b82f6, #4c6ef5);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}
        
.input-focus.active::after {
  transform: scaleX(1);
}
`;
document.head.appendChild(style);

    // Initialize Web3
    Wallet.init();
    
    // Initialize event handlers
    Events.init();
    
    // Check for hash in URL
    if (window.location.hash) {
        const page = window.location.hash.substring(1);
        UI.navigateToPage(page);
    }
});

// Add hash change listener
window.addEventListener('hashchange', function() {
    const page = window.location.hash.substring(1);
    UI.navigateToPage(page);
}); 