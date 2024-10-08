import React from 'react';
import { createRoot } from 'react-dom/client';
import getComputedStyle from './getComputedStyle';

const extractStyles = async element => {
  if (!element || !React.isValidElement(element)) {
    return null;
  }

  // Create a hidden div to render the element into
  const container = document.createElement('div');
  container.style.visibility = 'hidden';
  document.body.appendChild(container);

  return new Promise(resolve => {
    const root = createRoot(container);
    root.render(element);

    // Use requestAnimationFrame to ensure the DOM has updated
    requestAnimationFrame(() => {
      const rootElement = container.firstChild;

      const styles = getComputedStyle(rootElement);

      const childrenStyles = [];
      rootElement?.childNodes.forEach(child => {
        childrenStyles.push(getComputedStyle(child));
      });

      // Clean up the root node
      root.unmount();
      document.body.removeChild(container);

      resolve({ styles, childrenStyles });
    });
  });
};

export default extractStyles;
