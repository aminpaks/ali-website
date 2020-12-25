import { cloneElement, Children } from 'react';
import { clsx, makeStyles } from '../dependencies';

const useStyles = makeStyles({
  spacingRoot: {
    '&.0': {},
  },
});

const getUnitClass = (type, unit) => {
  switch (unit) {
    case '0':
      return `${type}--zero`;
    case 'xs':
      return `${type}--extra-small`;
    case 'sm':
      return `${type}--small`;
    case 'md':
      return `${type}--medium`;
    case 'lg':
      return `${type}--large`;
    case 'xl':
      return `${type}--extra-large`;
    case 'none':
      return undefined;
    default:
      throw new Error(`Invalid unit "${unit}"!`);
  }
};
const getUnitDirection = (index) => {
  switch (index) {
    case 0:
      return 'top';
    case 1:
      return 'right';
    case 2:
      return 'bottom';
    case 3:
      return 'left';
    default:
      throw new Error(`Invalid direction!`);
  }
};

const mergeUnits = (type, units) => {
  const [top, right = top, bottom = top, left = right] = units;

  return [top, right, bottom, left]
    .map((unit, idx) => getUnitClass(`${type}-${getUnitDirection(idx)}`, unit))
    .filter((v) => !!v)
    .join(' ');
};

export const Spacing = ({ margin, padding, children, className }) => {
  const { spacingRoot } = useStyles();
  const marginClass = Array.isArray(margin) ? mergeUnits('margin', margin) : '';
  const paddingClass = Array.isArray(padding)
    ? mergeUnits('padding', padding)
    : '';

  return cloneElement(Children.only(children), {
    className: clsx(className, spacingRoot, marginClass, paddingClass),
  });
};
