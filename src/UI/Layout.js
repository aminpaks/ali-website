import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core';

const useStyle = makeStyles({
  root: {
    paddingTop: 120,
    minHeight: ({ variant }) => (variant === 'fill' ? '100vh' : undefined),
  },
});

export const Layout = ({ children, variant, className, ...rest }) => {
  const classes = useStyle({ variant });

  return (
    <div {...rest} className={clsx(classes.root, className)}>
      {children}
    </div>
  );
};
