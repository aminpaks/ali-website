import { useEffect } from 'react';
import { noop } from '../Utils';

export const useWindowResize = (callback = noop) => {
  useEffect(() => {
    const handleWindowResize = (event) => {
      callback(event);
    };
    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  });
};
