import React from 'react';
import clsx from 'clsx';
import { Container, makeStyles, useTheme } from '@material-ui/core';

const useStyle = makeStyles(({ palette, breakpoints, spacing, bgColor }) => ({
  root: {
    // color: '#fff',
    // display: 'block',
    // padding: '4rem 0',
    // margin: `4rem ${spacing(2) * -1}px`,
    backgroundColor: bgColor === 'accent' ? palette.accent.main : undefined,
    // [breakpoints.up('sm')]: {
    //   marginLeft: spacing(3) * -1,
    //   marginRight: spacing(3) * -1,
    // },
    // [breakpoints.up('lg')]: {
    //   marginLeft: '-100%',
    //   marginRight: '-100%',
    // },
  },
}));

export const Section = ({
  component,
  className,
  children,
  bgColor = 'primary',
}) => {
  const { palette, breakpoints, spacing } = useTheme();
  const classes = useStyle({ palette, breakpoints, spacing, bgColor });

  return (
    <div className={clsx(classes.root, className)}>
      <Container component={component}>{children}</Container>
    </div>
  );
};
