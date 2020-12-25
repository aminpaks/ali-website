import { clsx, makeStyles } from '../../dependencies';
import { TitleLine, Section, useDesktopQuery } from '../../UI';
import { getPublicImage } from '../../Utils';

const useStyles = makeStyles({
  header: {
    '& h3': {
      fontSize: '2.4rem',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  imgContainer: {
    display: 'block',
    columnCount: 3,
    columnGap: '2rem',
    '& > span': {
      display: 'block',
      margin: '0 auto',
      '& > img': {
        margin: '0 auto',
        display: 'block',
        width: '100%',
      },
    },
    '&.is-desktop': {
      columnCount: 6,
    },
  },
});

export const Toolbox = () => {
  const classes = useStyles();
  const isDesktop = useDesktopQuery();
  return (
    <Section.Part bgColor="accent" component="section">
      <header className={classes.header}>
        <TitleLine>Tools to Succeed</TitleLine>
      </header>
      <article>
        <div
          className={clsx(classes.imgContainer, {
            'is-desktop': isDesktop,
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
