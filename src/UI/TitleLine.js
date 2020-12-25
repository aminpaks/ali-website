import { createElement } from 'react';
import { clsx, makeStyles } from '../dependencies';

const useStyles = makeStyles(({ palette }) => ({
  titleStyleRoot: {
    display: 'table',
    fontWeight: 900,
    textShadow: '-1px 1px 1px #000',
    position: 'relative',
    '& span': {
      display: 'block',
      position: 'relative',
      zIndex: 1,
    },
    '&::before': {
      width: '100%',
      height: '0.08em',
      bottom: '0.2em',
      display: 'block',
      content: '""',
      position: 'absolute',
      backgroundColor: palette.accent2.main,
    },
  },
}));

export const TitleLine = ({ component = 'h3', children, className }) => {
  const classes = useStyles();
  return createElement(
    component,
    { className: clsx(classes.titleStyleRoot, className) },
    createElement('span', null, children)
  );
};
