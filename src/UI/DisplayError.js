import { clsx, Typography, makeStyles } from '../dependencies';

const useStyles = makeStyles(({ palette }) => ({
  container: {
    marginTop: '1rem',
    marginBottom: '1rem',
  },
  content: {},
  heading: {
    color: palette.error.main,
  },
}));

export const DisplayError = ({ failure, className }) => {
  const classes = useStyles();
  const {
    text = `Whoops! Something has gone wrong, try again some time later.`,
  } = failure || {};

  return (
    <div className={clsx(classes.container, className)}>
      <Typography variant="h3" className={classes.heading}>
        Failure!
      </Typography>
      <div className={classes.content}>
        <Typography>{text}</Typography>
      </div>
    </div>
  );
};
