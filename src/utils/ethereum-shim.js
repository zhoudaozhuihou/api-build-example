// Only define ethereum if it doesn't exist and can be defined
try {
  if (!window.ethereum) {
    const descriptor = Object.getOwnPropertyDescriptor(window, 'ethereum');
    
    // Only proceed if the property doesn't exist or is configurable
    if (!descriptor || descriptor.configurable) {
      Object.defineProperty(window, 'ethereum', {
        value: {
          // Basic ethereum shim properties
          isMetaMask: false,
          isConnected: () => false,
          request: async () => { throw new Error('No Ethereum provider available'); },
          on: () => {},
          removeListener: () => {},
          // Add other necessary properties
        },
        writable: true,
        enumerable: true,
        configurable: true
      });
      console.log('ethereum-shim: ethereum property defined');
    } else {
      console.log('ethereum-shim: ethereum property exists but is not configurable');
    }
  } else {
    console.log('ethereum-shim: ethereum already defined, no action taken');
  }
} catch (error) {
  console.warn('ethereum-shim: Error defining ethereum property', error);
} 