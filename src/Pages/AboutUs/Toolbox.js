import { clsx, makeStyles } from '../../dependencies';
import { Section, useDesktopQuery } from '../../UI';
import { getPublicImage } from '../../Utils';

const useStyles = makeStyles({
  header: {
    textAlign: 'center',
    textTransform: 'capitalize',
    '& h3': {
      fontSize: '2rem',
    },
  },
  imgContainer: {
    display: 'flex',
    justifyContent: 'center',
    '& > span': {
      flex: '0 1 auto',
      display: 'block',
      '& > img': {
        margin: 0,
        display: 'block',
        padding: '0 1rem',
        width: '100%',
        height: 'auto',
        top: '50%',
        transform: 'translate(0, -50%)',
        position: 'relative',
      },
    },
    '&.is-not-desktop': {
      flexWrap: 'wrap',
      '& > span': {
        flex: '0 3 auto',
      },
      '& > span:nth-child(1)': {
        flexBasis: '16%',
      },
      '& > span:nth-child(2)': {
        flexBasis: '28%',
      },
      '& > span:nth-child(3)': {
        flexBasis: '56%',
      },
      '& > span:nth-child(4)': {
        flexBasis: '22%',
      },
      '& > span:nth-child(5)': {
        flexBasis: '22%',
      },
      '& > span:nth-child(6)': {
        flexBasis: '30%',
      },
    },
  },
});

export const Toolbox = () => {
  const classes = useStyles();
  const isDesktop = useDesktopQuery();
  return (
    <Section.Part bgColor="accent" component="section">
      <header className={classes.header}>
        <h3>Tools to succeed</h3>
      </header>
      <article>
        <div
          className={clsx(classes.imgContainer, {
            'is-not-desktop': !isDesktop,
          })}
        >
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
