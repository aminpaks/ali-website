import clsx from 'clsx';
import { Container, makeStyles } from '@material-ui/core';

const useSectionStyle = makeStyles({
  container: {
    fontSize: '1.2rem',
    '& h1,h2,h3': {
      marginTop: 0,
    },
  },
});

const paddingLarge = ({ bgColor }) => {
  return !!bgColor ? '4rem' : undefined;
};
const paddingTopSmall = ({ bgColor }) => {
  return !!bgColor ? '1rem' : 0;
};

const usePartStyle = makeStyles(({ breakpoints, palette }) => ({
  root: {
    marginTop: '3rem',
    '&:not(:first-of-type)': {
      paddingTop: paddingTopSmall,
      [breakpoints.up('md')]: {
        paddingTop: paddingLarge,
      },
    },
    '&:not(:last-of-type)': {
      marginBottom: '3rem',
      paddingBottom: paddingTopSmall,
      [breakpoints.up('md')]: {
        paddingBottom: paddingLarge,
      },
    },
    '&.is-compact': {
      paddingTop: '0 !important',
      paddingBottom: '0 !important',
    },
    '&.bg-accent-color': {
      backgroundColor: 'var(--color--accent-main)',
      '&,& a': {
        color: '#fff',
      },
      '& a': {
        transition: '180ms ease',
        '&:hover': {
          color: 'rgba(255,255,255,0.8)',
        },
      },
      '& .box': {
        display: 'flex',
        '& > div': {
          flex: '1 0 auto',
        },
      },
    },
  },
  container: {
    [breakpoints.up('md')]: {
      display: ({ type }) => (type === 'column' ? 'flex' : undefined),
    },
  },
}));

const useColumnStyle = makeStyles(({ breakpoints }) => ({
  root: {
    [breakpoints.up('md')]: {
      flex: '0 0 50%',
      '&:not(:first-of-type)': {
        paddingLeft: '1.5rem',
      },
      '&:not(:last-of-type)': {
        paddingRight: '1.5rem',
      },
    },
  },
}));

const Part = ({
  component,
  className,
  children,
  bgColor = 'primary',
  variant = 'simple',
  type = 'none',
}) => {
  const classes = usePartStyle({ bgColor, type });

  return (
    <article
      className={clsx(classes.root, className, {
        'bg-accent-color': bgColor === 'accent',
        'is-compact': variant === 'compact',
      })}
    >
      <Container component={component} className={classes.container}>
        {children}
      </Container>
    </article>
  );
};

const Column = ({ children, visible }) => {
  const classes = useColumnStyle();
  return visible === false ? null : (
    <div className={classes.root}>{children}</div>
  );
};

export const Section = ({ children }) => {
  const classes = useSectionStyle();
  return <section className={classes.container}>{children}</section>;
};

Section.Part = Part;

Section.Column = Column;
