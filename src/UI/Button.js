import React from 'react';
import { Button as MuiButton, makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    borderRadius: '2em',
  },
});

export const Button = ({ children, ...rest }) => {
  const classes = useStyles();
  return (
    <MuiButton {...rest} classes={classes} variant="contained" disableElevation>
      {children}
    </MuiButton>
  );
};
