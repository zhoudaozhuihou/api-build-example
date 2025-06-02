import React from 'react';
import ReactDOM from 'react-dom';

/**
 * Initialize Stagewise toolbar for development
 * This module is only imported in development mode
 */
export const initStagewise = async () => {
  try {
    // Dynamic import to ensure it's not included in production builds
    const { StagewiseToolbar } = await import('@stagewise/toolbar-react');
    
    const stagewiseConfig = {
      plugins: []
    };

    // Create a separate div for the stagewise toolbar to avoid interfering with the main app
    const toolbarContainer = document.createElement('div');
    toolbarContainer.id = 'stagewise-toolbar-container';
    toolbarContainer.style.position = 'fixed';
    toolbarContainer.style.top = '0';
    toolbarContainer.style.left = '0';
    toolbarContainer.style.zIndex = '9999';
    toolbarContainer.style.pointerEvents = 'none';
    document.body.appendChild(toolbarContainer);

    // Render the StagewiseToolbar in its own React root
    const ToolbarWrapper = () => (
      <div style={{ pointerEvents: 'auto' }}>
        <StagewiseToolbar config={stagewiseConfig} />
      </div>
    );

    ReactDOM.render(<ToolbarWrapper />, toolbarContainer);
    
    console.log('Stagewise toolbar initialized successfully');
  } catch (error) {
    console.warn('Failed to load Stagewise toolbar:', error);
  }
}; 