// evm-extension-fix.js - Enhanced version
// Aggressively prevents ethereum property conflicts

(function() {
  // Track if we've already applied this fix
  if (window._evmFixApplied) return;
  window._evmFixApplied = true;
  
  // First, attempt to define ethereum property before any extension can
  try {
    // Only define if it doesn't exist
    if (!window.hasOwnProperty('ethereum')) {
      let _ethereum = undefined;
      
      // Define with non-configurable descriptor to prevent redefinition
      Object.defineProperty(window, 'ethereum', {
        configurable: false,
        enumerable: true,
        get: function() {
          return _ethereum;
        },
        set: function(value) {
          if (_ethereum === undefined) {
            _ethereum = value;
            console.log('ethereum property set for the first time');
          } else {
            console.warn('Attempt to override ethereum property prevented');
          }
        }
      });
    }
  } catch (e) {
    console.warn('Initial ethereum property protection failed:', e);
  }
  
  // Store original defineProperty method
  const originalDefineProperty = Object.defineProperty;
  
  // Replace with our protected version
  Object.defineProperty = function(obj, prop, descriptor) {
    // For window.ethereum specifically
    if (obj === window && prop === 'ethereum') {
      console.warn('Intercepted attempt to redefine window.ethereum');
      
      // If ethereum is undefined, allow first definition
      if (typeof window.ethereum === 'undefined') {
        try {
          return originalDefineProperty.call(this, obj, prop, descriptor);
        } catch (e) {
          console.warn('Error setting initial ethereum:', e);
        }
      }
      
      // If already defined, prevent redefinition
      return window.ethereum;
    }
    
    // For all other properties, proceed normally
    try {
      return originalDefineProperty.call(this, obj, prop, descriptor);
    } catch (e) {
      console.warn('Error in overridden defineProperty:', e);
      return obj[prop];
    }
  };
  
  // Specifically target evmAsk.js inject method
  // Create a fake inject method on window
  window.inject = function() {
    console.warn('Blocked attempt to call inject method');
    return false;
  };
  
  // Track and protect ethereum object if it's set later
  let ethereumProtectionInterval = setInterval(function() {
    if (window.ethereum && !window._ethereumProtected) {
      window._ethereumProtected = true;
      
      // Make sure ethereum stays protected
      const currentEthereum = window.ethereum;
      
      try {
        // Redefine with the current value but make it non-configurable
        Object.defineProperty(window, 'ethereum', {
          configurable: false,
          enumerable: true,
          writable: false,
          value: currentEthereum
        });
        
        console.log('Successfully locked ethereum property');
        clearInterval(ethereumProtectionInterval);
      } catch (e) {
        console.warn('Failed to lock ethereum property:', e);
      }
    }
  }, 50);
  
  // Clean up interval after 5 seconds
  setTimeout(function() {
    clearInterval(ethereumProtectionInterval);
  }, 5000);
  
  console.log('Enhanced EVM extension conflict prevention loaded');
})(); 