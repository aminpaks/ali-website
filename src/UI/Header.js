import { Container, makeStyles, Typography } from '@material-ui/core';

const fontSize = ({ variant }) => {
  switch (variant) {
    case 'h1':
    default:
      return '3rem';
  }
};
const useStyle = makeStyles(({ palette }) => ({
  root: {
    '& > *': {
      position: 'relative',
      '&::before': {
        top: '10%',
        width: 10,
        height: '78%',
        display: 'block',
        content: '""',
        position: 'absolute',
        backgroundColor: palette.accent.main,
      },
      '& > *': {
        fontSize,
        marginLeft: 20,
      },
    },
  },
}));

export const Header = ({ variant = 'h1', children }) => {
  const classes = useStyle({ variant });
  return (
    <header className={classes.root}>
      <Container>
        <Typography variant={variant}>{children}</Typography>
      </Container>
    </header>
  );
};
