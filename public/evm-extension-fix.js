// evm-extension-fix.js
// Handles potential conflicts with cryptocurrency browser extensions
// Specifically targets issues with evmAsk.js and similar extensions

(function() {
  // Track if we've already applied this fix
  if (window._evmFixApplied) return;
  window._evmFixApplied = true;
  
  // Store original methods we'll be patching
  const originalDefineProperty = Object.defineProperty;
  
  // Create a safe version of defineProperty that prevents conflicts
  Object.defineProperty = function(obj, prop, descriptor) {
    // If trying to redefine ethereum and it already exists, prevent it
    if (obj === window && prop === 'ethereum' && window.ethereum) {
      console.warn('Prevented attempt to redefine window.ethereum property');
      return window.ethereum;
    }
    
    // Otherwise proceed normally
    try {
      return originalDefineProperty.call(this, obj, prop, descriptor);
    } catch (e) {
      console.warn('Error in defineProperty:', e);
      return obj[prop];
    }
  };
  
  // Patch the inject method often used by extensions
  if (window.ethereum) {
    const originalEthereum = window.ethereum;
    
    // Monitor for external attempts to replace the provider
    setInterval(function() {
      if (window.ethereum !== originalEthereum && typeof window.ethereum !== 'undefined') {
        console.log('Detected ethereum provider change, merging capabilities');
        
        // Merge the new provider's methods with our saved reference
        for (const key in window.ethereum) {
          if (typeof window.ethereum[key] === 'function' && !originalEthereum[key]) {
            originalEthereum[key] = window.ethereum[key].bind(window.ethereum);
          }
        }
        
        // Restore our original reference
        window.ethereum = originalEthereum;
      }
    }, 1000);
  }
  
  // Patch common injection points
  const patchedMethods = ['inject', 'injectWeb3', 'setProvider', 'setEthereum'];
  
  patchedMethods.forEach(method => {
    // For each potential injection method, create a safe version
    window[method] = function() {
      console.warn(`Blocked attempt to call ${method}`);
      return false;
    };
  });
  
  console.log('EVM extension conflict prevention loaded');
})(); 