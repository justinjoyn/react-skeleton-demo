const processComputedStyle = computedStyle => {
  const styles = {
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

  return styles;
};

export default processComputedStyle;
