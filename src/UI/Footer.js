import { makeStyles, Container } from '../dependencies';
import { getPublicImage } from '../Utils';
import { Image } from './Image';

const useStyles = makeStyles({
  container: {
    color: '#888',
    marginTop: '3rem',
    marginBottom: '3rem',
  },
  innerContainer: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTop: '1px solid #ddd',
    paddingTop: '2rem',
  },
  logo: {
    width: 120,
  },
});

export const Footer = () => {
  const classes = useStyles();
  return (
    <footer className={classes.container}>
      <Container>
        <div className={classes.innerContainer}>
          <div>
            <p>Copyright © 2020 EduFina Inc. - All Rights Reserved.</p>
          </div>
          <div>
            <Image
              className={classes.logo}
              name="edufina"
              source={getPublicImage('/edufina-logo-grayscaled.png')}
            />
          </div>
        </div>
      </Container>
    </footer>
  );
};
