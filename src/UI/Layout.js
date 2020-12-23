import { clsx, makeStyles } from '../dependencies';
import { Footer } from './Footer';

const useStyle = makeStyles({
  layoutContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingTop: 120,
    minHeight: '100vh',
  },
});

export const Layout = ({
  children,
  variant,
  className,
  footer = 'visible',
  ...rest
}) => {
  const classes = useStyle({ variant });

  return (
    <div {...rest} className={clsx(classes.layoutContainer, className)}>
      {children}

      {footer === 'visible' && <Footer />}
    </div>
  );
};
