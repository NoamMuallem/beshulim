import React from "react";

export default function useWindowSize(
  widthLimit?: number,
  heightLimit?: number
) {
  //initialized dtate to the current window size/ limit
  const [windowSize, setWindowSize] = React.useState({
    width: widthLimit
      ? window.innerWidth > widthLimit
        ? widthLimit
        : window.innerWidth
      : window.innerWidth,
    height: heightLimit
      ? window.innerHeight > heightLimit
        ? heightLimit
        : window.innerHeight
      : window.innerHeight,
  });

  //function that set the state to the current window width and height or limits
  function changeWindowSize() {
    setWindowSize({
      width: widthLimit
        ? window.innerWidth > widthLimit
          ? widthLimit
          : window.innerWidth
        : window.innerWidth,
      height: heightLimit
        ? window.innerHeight > heightLimit
          ? heightLimit
          : window.innerHeight
        : window.innerHeight,
    });
  }

  React.useEffect(() => {
    //add event listener to when the window is resizing
    window.addEventListener("resize", changeWindowSize);

    //remove the event listener when the component unmouns
    return () => {
      window.removeEventListener("resize", changeWindowSize);
    };
  }, []);

  return windowSize;
}
