import clsx from 'clsx';
import { Container, makeStyles } from '@material-ui/core';

const useSectionStyle = makeStyles(() => ({
  container: {
    paddingBottom: '6rem',
    fontSize: '1.2rem',
    '& h1,h2,h3': {
      marginTop: 0,
    },
  },
}));

const usePartStyle = makeStyles(({ palette }) => ({
  root: {
    marginTop: '3rem',
    marginBottom: '3rem',
    '&:not(:first-of-type)': {
      paddingTop: ({ bgColor }) => (!!bgColor ? '4rem' : undefined),
    },
    paddingBottom: ({ bgColor }) => (!!bgColor ? '4rem' : undefined),
    color: ({ bgColor }) => (bgColor === 'accent' ? '#fff' : undefined),
    backgroundColor: ({ bgColor }) =>
      bgColor === 'accent' ? palette.accent.main : undefined,

    '&::after': {
      content: '""',
      display: 'block',
      float: 'clear',
    },
  },
  container: {
    display: ({ type }) => (type === 'column' ? 'flex' : undefined),
  },
}));

const useColumnStyle = makeStyles({
  root: {
    flex: '0 0 50%',
    '&:not(:first-of-type)': {
      paddingLeft: '1.5rem',
    },
    '&:not(:last-of-type)': {
      paddingRight: '1.5rem',
    },
  },
});

const Part = ({
  component,
  className,
  children,
  bgColor = 'primary',
  type = 'simple',
}) => {
  const classes = usePartStyle({ bgColor, type });

  return (
    <article className={clsx(classes.root, className)}>
      <Container component={component} className={classes.container}>
        {children}
      </Container>
    </article>
  );
};

const Column = ({ children }) => {
  const classes = useColumnStyle();
  return <div className={classes.root}>{children}</div>;
};

export const Section = ({ children }) => {
  const classes = useSectionStyle();
  return <section className={classes.container}>{children}</section>;
};

Section.Part = Part;

Section.Column = Column;
