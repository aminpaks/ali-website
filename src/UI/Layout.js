import { clsx, makeStyles } from '../dependencies';
import { useWindowBounds } from './WindowResize';
import { Footer } from './Footer';

const useStyle = makeStyles({
  layoutContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingTop: 120,
    minHeight: `var(--height)`,
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
  const bounds = useWindowBounds();

  return (
    <div
      {...rest}
      style={{
        '--width': `${bounds.width}px`,
        '--height': `${bounds.height}px`,
      }}
      className={clsx(classes.layoutContainer, className)}
    >
      {children}

      {footer === 'visible' && <Footer />}
    </div>
  );
};
