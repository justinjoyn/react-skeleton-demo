import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';

const SkeletonPlaceholder = ({ children, loading, count, id }) => {
  /**
   * Styles tree is an array of styles objects, where each object represents the styles
   * for a single element. This is used to create the skeleton placeholders. Each element
   * is recursively processed to create the skeleton placeholders. Each element is an object
   * with a a "style" key and a "children" key. The "children" key is an array of styles objects
   * for the children of the current element.
   */
  const [stylesTree, setStylesTree] = useState([]);

  const skeletons = renderSkeletons(stylesTree, count);

  // Load the styles tree from local storage
  useEffect(() => {
    const storedStyles = localStorage.getItem(id);
    setStylesTree(JSON.parse(storedStyles));
  }, []);

  //   useEffect(() => {
  //     // Add pulse animation to the document
  //     const style = document.createElement('style');
  //     style.textContent = pulseAnimation;
  //     document.head.append(style);

  //     return () => {
  //       document.head.removeChild(style);
  //     };
  //   }, [id]);

  // After loading, record the styles of the first child, going one level deep
  useEffect(() => {
    if (!loading && children.length > 0 && id) {
      extractStyles(children[0]).then(styles => {
        setStylesTree(styles);
        // Write the styles to local storage
        localStorage.setItem(id, JSON.stringify(styles));
      });
    }
  }, [loading, children, id]);

  return loading ? skeletons : children;
};

const extractStyles = element => {
  if (!element || !React.isValidElement(element)) {
    return null;
  }

  const getComputedStyle = el => {
    // Check if el is a valid DOM element before calling getComputedStyle
    if (el instanceof Element) {
      const computedStyle = window.getComputedStyle(el);
      return {
        width: computedStyle.width,
        height: computedStyle.height,
        padding: computedStyle.padding,
        margin: computedStyle.margin,
        borderRadius: computedStyle.borderRadius,
        display: computedStyle.display,
        flexDirection: computedStyle.flexDirection,
        justifyContent: computedStyle.justifyContent,
        alignItems: computedStyle.alignItems,
      };
    }
    // Return default styles if el is not a DOM element
    return {
      width: 'auto',
      height: 'auto',
      padding: '0',
      margin: '0',
      borderRadius: '0',
      display: 'block',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'stretch',
    };
  };

  const extractChildStyles = children => {
    return React.Children.toArray(children)
      .filter(React.isValidElement)
      .map(child => ({
        style: getComputedStyle(child),
        children: [],
      }));
  };

  // Create a hidden div to render the element into
  const rootNode = document.createElement('div');
  rootNode.style.visibility = 'hidden';
  document.body.appendChild(rootNode);

  return new Promise(resolve => {
    const root = createRoot(rootNode);
    root.render(element);

    // Use requestAnimationFrame to ensure the DOM has updated
    requestAnimationFrame(() => {
      const rootElement = rootNode.firstChild;
      const stylesTree = [
        {
          style: getComputedStyle(rootElement),
          children: extractChildStyles(element.props.children),
        },
      ];

      // Clean up the root node
      root.unmount();
      document.body.removeChild(rootNode);

      resolve(stylesTree);
    });
  });
};

// Recursively render skeletons based on stylesTree
const renderSkeleton = (stylesTree, depth = 0) => {
  // If stylesTree is not an array, wrap it in an array
  const treeArray = Array.isArray(stylesTree) ? stylesTree : [stylesTree];

  return treeArray.map((node, index) => {
    const { style, children } = node;

    const skeletonStyle = {
      ...style,
      // Background color should darken with depth
      backgroundColor: `rgba(0, 0, 0, ${0.1 + depth * 0.05})`,
      color: 'transparent',
      animation: 'pulse 1.5s ease-in-out infinite',
    };

    return (
      <div key={index} style={skeletonStyle}>
        {children && children.length > 0
          ? renderSkeleton(children, depth + 1)
          : null}
      </div>
    );
  });
};

const renderSkeletons = (stylesTree, count) => {
  return Array.from({ length: count }, () => renderSkeleton(stylesTree));
};

// Add this CSS animation to your stylesheet
const pulseAnimation = `
@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
  100% {
    opacity: 1;
  }
}
`;

export default SkeletonPlaceholder;
