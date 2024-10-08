import React, { useState, useEffect } from 'react';
import extractStyles from './extractStyles';

const SkeletonPlaceholder = ({ children, loading, count = 1, id }) => {
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
    if (storedStyles) {
      setStylesTree(JSON.parse(storedStyles));
    }
  }, []);

  useEffect(() => {
    // Add pulse animation to the document
    const style = document.createElement('style');
    style.textContent = pulseAnimation;
    document.head.append(style);

    return () => {
      document.head.removeChild(style);
    };
  }, [id]);

  // After loading, record the styles of the first child, going one level deep
  useEffect(() => {
    if (!loading && children.length > 0 && id) {
      getStyles();
    }
  }, [loading, children, id]);

  const getStyles = async () => {
    const { styles, childrenStyles } = await extractStyles(children[0]);

    const _stylesTree = {
      style: styles,
      children: childrenStyles?.map(style => ({
        style,
        children: [],
      })),
    };

    setStylesTree(_stylesTree);

    localStorage.setItem(id, JSON.stringify(_stylesTree));
  };

  return loading ? skeletons : children;
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
