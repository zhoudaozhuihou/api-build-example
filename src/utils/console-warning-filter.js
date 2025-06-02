// Utility to filter out specific console warnings in development
// This helps clean up the console while keeping important warnings

const originalWarn = console.warn;

console.warn = function filterConsoleWarnings(...args) {
  const message = args.join(' ');
  
  // Filter out known Material-UI findDOMNode warnings in StrictMode
  const warningsToFilter = [
    'findDOMNode is deprecated in StrictMode',
    'findDOMNode was passed an instance',
    'which is inside StrictMode',
  ];
  
  // Check if this warning should be filtered
  const shouldFilter = warningsToFilter.some(warning => 
    message.includes(warning)
  );
  
  // Only show the warning if it's not in our filter list
  if (!shouldFilter) {
    originalWarn.apply(console, args);
  }
};

// Export for potential cleanup in tests
export const restoreConsoleWarn = () => {
  console.warn = originalWarn;
};

export default {
  filterConsoleWarnings: console.warn,
  restoreConsoleWarn,
}; 