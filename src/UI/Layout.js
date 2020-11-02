import React from 'react';
import clsx from 'clsx';
import { Container, makeStyles } from '@material-ui/core';

const useStyle = makeStyles({
  root: {
    paddingTop: 120,
    minHeight: ({ variant }) => (variant === 'fill' ? '100vh' : undefined),
  },
});

export const Layout = ({ children, variant, className, ...rest }) => {
  const classes = useStyle({ variant });
  const { root, ...restClassNames } = classes;
  return (
    <Container
      {...rest}
      classes={{ root: clsx(root, className), ...restClassNames }}
    >
      {children}
    </Container>
  );
};
