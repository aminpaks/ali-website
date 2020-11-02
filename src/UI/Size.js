import React, { useEffect, useState, useCallback, useRef } from 'react';

const initialState = {
  isReady: false,
  width: 0,
  height: 0,
};

export const useSize = ({ ref }) => {
  const toId = useRef();
  const [state, setState] = useState(initialState);

  const handleResize = useCallback(
    (isImmediate) => {
      if (toId.current) {
        window.clearTimeout(toId.current);
        toId.current = undefined;
      }
      toId.current = window.setTimeout(
        () => {
          const clientRect = ref.current?.getBoundingClientRect();
          if (clientRect) {
            const { width: oldWidth, height: oldHeight } = state;
            const { width, height } = clientRect;

            if (width !== oldWidth || height !== oldHeight) {
              setState({ isReady: true, width, height });
            }
          }
        },
        isImmediate === true ? 0 : 200
      );
    },
    [ref, state]
  );

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });
  useEffect(() => {
    handleResize(true);
  }, []);

  return state;
};
