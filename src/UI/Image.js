import { makeStyles } from '@material-ui/core';

const getFloat = (float) => {
  switch (float) {
    case 'right':
      return 'right';

    default:
      return undefined;
  }
};

const useStyle = makeStyles({
  root: {
    display: 'block',
    maxWidth: '100%',
    float: getFloat,
  },
});

export const Image = ({ float, source, name }) => {
  const classes = useStyle({ float });
  return <img className={classes.root} src={source} alt={name} />;
};
