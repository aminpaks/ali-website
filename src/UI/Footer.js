import { makeStyles, Container } from '../dependencies';

const useStyles = makeStyles({
  container: {
    marginTop: '3rem',
    minHeight: 300,
  },
});

export const Footer = () => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <Container>FOOTER</Container>
    </div>
  );
};
