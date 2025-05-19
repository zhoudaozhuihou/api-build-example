// ethereum-shim.js
// This script provides a robust solution to handle the window.ethereum property
// to prevent conflicts with extensions like MetaMask and similar wallets

(function() {
  // Skip if already shimmed
  if (window._ethereumShimApplied) return;
  window._ethereumShimApplied = true;
  
  // Store the original ethereum value if it exists
  const originalEthereum = window.ethereum;
  let hasDefinedProperty = false;

  if (!originalEthereum) {
    try {
      // Only create a shim if ethereum isn't already defined
      let ethereumValue = null;
      
      Object.defineProperty(window, 'ethereum', {
        configurable: true,
        enumerable: true,
        set: function(val) {
          ethereumValue = val;
        },
        get: function() {
          return ethereumValue;
        }
      });
      
      hasDefinedProperty = true;
      console.log('ethereum-shim: Successfully set up ethereum property');
    } catch (e) {
      console.warn('ethereum-shim: Could not define ethereum property', e);
      
      // Fallback implementation - create a bare minimum ethereum object
      window.ethereum = {
        isMetaMask: false,
        _isShim: true,
        request: function() {
          return Promise.reject(new Error('Ethereum provider not available'));
        },
        on: function() {},
        removeListener: function() {}
      };
    }
  } else {
    console.log('ethereum-shim: ethereum already defined, no action taken');
  }
  
  // Safely patch window event listeners to prevent errors
  const originalAddEventListener = window.addEventListener;
  window.addEventListener = function(type, listener, options) {
    if (!listener) return;
    try {
      return originalAddEventListener.call(this, type, listener, options);
    } catch (e) {
      console.warn('ethereum-shim: Error in addEventListener', e);
      // Return a no-op function that can be called to "remove" the listener
      return function() {};
    }
  };
  
  // Handle ethereum injection from wallet extensions after page load
  if (hasDefinedProperty) {
    window.addEventListener('DOMContentLoaded', function() {
      if (typeof window.ethereum !== 'undefined' && window.ethereum !== null) {
        console.log('ethereum-shim: Ethereum provider detected after page load');
      }
    });
  }
})(); 