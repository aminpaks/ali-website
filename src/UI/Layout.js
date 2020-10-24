import React from 'react';
import { Container, makeStyles } from '@material-ui/core';

const useStyle = makeStyles({
  root: {
    paddingTop: 120,
    minHeight: ({ variant }) => (variant === 'fill' ? '100vh' : undefined),
  },
});

export const Layout = ({ children, variant, ...rest }) => {
  const classes = useStyle({ variant });
  return (
    <Container {...rest} classes={classes}>
      {children}
    </Container>
  );
};
