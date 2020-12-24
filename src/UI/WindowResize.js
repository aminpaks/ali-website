import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { noop } from '../Utils';

export const getWindowBounds = () => {
  return { width: window.innerWidth, height: window.innerHeight };
};

export const useWindowBounds = () => {
  const boundsRef = useRef();
  const [bounds, setBounds] = useState(getWindowBounds());
  useEffect(() => {
    boundsRef.current = bounds;
  });
  useLayoutEffect(() => {
    const intervalId = window.setInterval(() => {
      const { width, height } = getWindowBounds();
      const { width: currentWidth, height: currentHeight } = boundsRef.current;
      if (currentWidth !== width || currentHeight !== height) {
        console.log('change of window size', width, height);
        setBounds({ width, height });
      }
    }, 400);
    return () => {
      window.clearInterval(intervalId);
    };
  }, []);
  return bounds;
};

export const useWindowResize = (callback = noop, forceOnInit = false) => {
  const initRef = useRef();
  useLayoutEffect(() => {
    const handleWindowResize = (event) => {
      callback(event);
    };
    if (forceOnInit === true && !initRef.current) {
      initRef.current = true;
      handleWindowResize();
    }
    window.addEventListener('resize', handleWindowResize);
    window.addEventListener('orientationchange', handleWindowResize);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
      window.removeEventListener('orientationchange', handleWindowResize);
    };
  });
};
