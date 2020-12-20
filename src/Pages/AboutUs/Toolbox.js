import { makeStyles } from '@material-ui/core';
import { Section } from '../../UI';
import { getPublicImage } from '../../Utils';

const useStyles = makeStyles(({ palette }) => ({
  header: {
    textAlign: 'center',
    textTransform: 'capitalize',
    '& h3': {
      fontSize: '2rem',
    },
  },
  imgContainer: {
    display: 'flex',
    '& > span': {
      flex: '0 1 auto',
      display: 'block',
      '& > img': {
        margin: 0,
        display: 'block',
        padding: '0 1rem',
        width: '100%',
        height: 'auto',
      },
    },
  },
}));

export const Toolbox = () => {
  const classes = useStyles();
  return (
    <Section.Part bgColor="accent" component="section">
      <header className={classes.header}>
        <h3>Tools to succeed</h3>
      </header>
      <article>
        <div className={classes.imgContainer}>
          <span>
            <img alt="Toolbox Item" src={getPublicImage('toolbox-01.png')} />
          </span>
          <span>
            <img alt="Toolbox Item" src={getPublicImage('toolbox-02.png')} />
          </span>
          <span>
            <img alt="Toolbox Item" src={getPublicImage('toolbox-03.png')} />
          </span>
          <span>
            <img alt="Toolbox Item" src={getPublicImage('toolbox-04.png')} />
          </span>
          <span>
            <img alt="Toolbox Item" src={getPublicImage('toolbox-05.png')} />
          </span>
          <span>
            <img alt="Toolbox Item" src={getPublicImage('toolbox-06.png')} />
          </span>
        </div>
      </article>
    </Section.Part>
  );
};
