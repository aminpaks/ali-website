import { Paper, makeStyles } from '../dependencies';

const useStyles = makeStyles(({ spacing }) => ({
  container: {
    padding: spacing(4),
  },
}));

export const Card = ({ children }) => {
  const classes = useStyles();

  return (
    <Paper>
      <div className={classes.container}>{children}</div>
    </Paper>
  );
};
