import { useEffect, useRef, useState } from 'react';
import { noop } from '../../Utils';

// How long you want the animation to take, in ms
const animationDuration = 1000;
// Calculate how long each ‘frame’ should last if we want to update the animation 60 times per second
const frameDuration = 1000 / 60;
// Use that to calculate how many frames we need to complete the animation
const totalFrames = Math.round(animationDuration / frameDuration);
// An ease-out function that slows the count as it progresses
const easeOutQuad = (t) => t * (2 - t);

// The animation function, which takes an Element
const animateCountTo = (countTo, counterRef, callback = noop) => {
  let frame = 0;
  if (counterRef.current) {
    clearTimeout(counterRef.current);
  }
  const fn = () => {
    frame++;
    // Calculate our progress as a value between 0 and 1
    // Pass that value to our easing function to get our
    // progress on a curve
    const progress = easeOutQuad(frame / totalFrames);
    // Use the progress value to calculate the current count
    const currentCount = Math.round(countTo * progress);

    // Notify
    callback(currentCount);

    // Start the animation running 60 times per second
    counterRef.current = setTimeout(() => {
      // If we’ve reached our last frame, stop the animation
      if (frame < totalFrames) {
        fn();
      }
    }, frameDuration);
  };

  fn();
};

export const Counter = ({ className, value, onDisplayValue = noop }) => {
  const handleValueDisplay = useRef();
  const counterRef = useRef();
  const [displayValue, setDisplayValue] = useState(value);
  useEffect(() => {
    handleValueDisplay.current = onDisplayValue;
  });
  useEffect(() => {
    if (
      typeof value === 'number' &&
      !Number.isNaN(value) &&
      typeof handleValueDisplay.current === 'function'
    ) {
      animateCountTo(value, counterRef, (c) => {
        setDisplayValue(handleValueDisplay.current(c));
      });
    }
  }, [value]);

  return <span className={className}>{displayValue}</span>;
};
