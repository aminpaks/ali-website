import { useEffect } from 'react';

export const useOutsideClick = (ref, callback) => {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside({ target }) {
      if (ref.current && !ref.current.contains(target) && callback) {
        callback({ target });
      }
    }
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  });
};
