import React from 'react';
import { Button as MuiButton, makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    borderRadius: '2em',
  },
});

export const Button = ({ children, ...restProps }) => {
  const classes = useStyles();
  return (
    <MuiButton
      {...restProps}
      classes={classes}
      variant={restProps.variant ?? 'contained'}
      disableElevation
      size="large"
    >
      {children}
    </MuiButton>
  );
};
