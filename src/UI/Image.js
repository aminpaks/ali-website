import { clsx, makeStyles } from '../dependencies';

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
    borderRadius: '1em',
  },
});

export const Image = ({ float, source, name, className }) => {
  const classes = useStyle({ float });
  return (
    <img className={clsx(classes.root, className)} src={source} alt={name} />
  );
};
