import processComputedStyle from './processComputedStyle';

const getComputedStyle = element => {
  // Check if element is a valid DOM element before calling getComputedStyle
  if (element instanceof Element) {
    const computedStyle = window.getComputedStyle(element);
    const styles = processComputedStyle(computedStyle);
    return styles;
  }
  return {};
};

export default getComputedStyle;
