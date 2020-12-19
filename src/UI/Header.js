import { Typography } from '@material-ui/core';

export const Header = ({ variant, children }) => {
  return (
    <header>
      <Typography variant={variant}>{children}</Typography>
    </header>
  );
};
