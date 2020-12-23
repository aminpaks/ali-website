import React, {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  forwardRef,
} from 'react';
import {
  clsx,
  Link,
  useLocation,
  Container,
  makeStyles,
} from '../dependencies';
import { useOutsideClick } from '../Utils';
import { iPhoneLandscapeMediaQuery } from './mediaQueries';

const useNavButtonStyle = makeStyles(({ breakpoints, palette }) => ({
  navButton: {
    width: 36,
    height: 36,
    padding: 9,
    margin: -9,
    marginRight: 6,
    borderRadius: 2,
    cursor: 'pointer',
    zIndex: 2,
    [breakpoints.up('sm')]: {
      marginRight: 4,
    },
    '&,& span': {
      display: 'block',
    },
    '& > span': {
      width: 18,
      height: 18,
      overflow: 'hidden',
      position: 'relative',
      backgroundColor: 'rgba(0,0,0,0)',
      pointerEvents: 'none',
      '& > span': {
        top: 8,
        backgroundColor: '#000',
        '&::before': {
          top: -5,
          transform: 'rotate(0deg)',
        },
        '&::after': {
          top: 5,
          transform: 'rotate(0deg)',
        },
        '&,&::before,&::after': {
          width: '100%',
          height: 2,
          content: '""',
          display: 'block',
          backgroundColor: '#000',
          position: 'absolute',
          transition: '200ms ease-out',
          transformOrigin: '50% 50%',
        },
      },
    },
    '&.is-open': {
      '&:hover > span': {
        backgroundColor: palette.accent.main,
        '& > span': {
          '&::before,&::after': {
            backgroundColor: '#fff',
          },
        },
      },
      '& > span': {
        '& > span': {
          backgroundColor: 'transparent',
          '&::before': {
            top: 0,
            transform: 'rotate(45deg)',
          },
          '&::after': {
            top: 0,
            transform: 'rotate(-45deg)',
          },
        },
      },
    },
  },
}));

const NavButton = forwardRef(({ isOpen, onClick }, ref) => {
  const classes = useNavButtonStyle({ open: isOpen });
  return (
    <span
      ref={ref}
      className={clsx(classes.navButton, { 'is-open': isOpen })}
      onClick={onClick}
    >
      <span>
        <span />
      </span>
    </span>
  );
});

const useStyle = makeStyles(({ palette, breakpoints }) => ({
  root: {
    top: 0,
    left: 0,
    right: 0,
    padding: '20px 0',
    position: 'fixed',
    zIndex: 99,
    backgroundColor: ({ bgColor }) => bgColor,
  },
  innerContainer: {
    display: 'flex',
    alignItems: 'center',
    alignContent: 'space-between',
  },
  logo: {
    margin: 0,
    display: 'block',
    '& span': {
      color: '#ce021f',
    },
  },
  navContainer: {
    display: 'flex',
    flex: '1 0 auto',
    justifyContent: 'flex-end',
    position: 'relative',

    '& > nav': {
      top: -24,
      right: -24,
      width: 0,
      height: 0,
      display: 'block',
      position: 'absolute',
      overflow: 'hidden',
      padding: 20,
      paddingTop: 56,
      borderRadius: '0.4em',
      border: '1px solid #eee',
      boxSizing: 'content-box',
      backgroundColor: 'transparent',
      borderColor: 'rgba(0,0,0,0)',
      boxShadow: '0 0 0px rgba(0,0,0,0)',
      transition:
        '180ms ease-in-out all, 160ms 140ms ease-out width, 200ms ease-in height',
      '& > span': {
        display: 'block',
      },
    },
    '&.is-open > nav': {
      top: -20,
      right: -6,
      width: 'var(--expandedWidth)',
      height: 'var(--expandedHeight)',
      backgroundColor: '#fff',
      borderColor: 'rgba(0,0,0,0.16)',
      boxShadow: '0 0 8px rgba(0,0,0,0.1)',
      transition:
        '180ms ease-in-out all, 200ms ease-out width, 200ms 140ms ease-out height',
    },
    [`@media ${iPhoneLandscapeMediaQuery}`]: {
      '& > nav': {
        top: -30,
        right: -60,
        position: 'fixed',
        padding: 40,
        paddingTop: 70,
        boxSizing: 'border-box',
        '& > span': {
          height: '100%',
          overflow: 'scroll',
          '& > span': {
            display: 'block',
            paddingRight: 20,
          },
        },
      },
      '&.is-open > nav': {
        top: 0,
        right: 0,
        width: '100vw',
        height: '100vh',
      },
    },
    '& a': {
      color: '#000',
      display: 'block',
      textDecoration: 'none',
      padding: '1em 0',
      minWidth: '14em',
      textAlign: 'right',
      position: 'relative',
      whiteSpace: 'nowrap',
      cursor: 'pointer',
      transition: '180ms ease-in-out, color 100ms ease',
      '&:hover': {
        color: '#fff',
        '&::after': {
          width: '100%',
        },
        '& > span': {
          padding: '0 1em',
        },
      },
      '&:not(:last-of-type)': {
        borderBottom: '1px dotted #000',
      },
      '& > span': {
        zIndex: 1,
        display: 'block',
        position: 'relative',
        transition: 'inherit',
        pointerEvents: 'none',
      },
      '&::after': {
        top: 0,
        right: 0,
        bottom: 0,
        width: 0,
        content: '""',
        display: 'block',
        position: 'absolute',
        backgroundColor: palette.accent.main,
        transition: 'inherit',
      },
    },
  },
  navPlaceholder: {
    top: 0,
    right: 0,
    position: 'absolute',
    visibility: 'hidden',
    zIndex: -1,
  },
  navLink: {
    color: 'inherit',
    textDecoration: 'none',
  },
}));

export const Nav = () => {
  const { pathname } = useLocation();
  const navRef = useRef();
  const navLinkRef = useRef();
  const placeholderRef = useRef();
  const [open, setOpen] = useState(false);
  const [client, setClient] = useState({ width: 0, height: 0 });
  const classes = useStyle({
    open,
    client,
    bgColor: pathname === '/' ? 'transparent' : 'rgba(245,245,245,0.9)',
  });
  const handleMenuToggle = useCallback(() => setOpen((v) => !v), [setOpen]);
  const handleMenuClose = useCallback(
    ({ target }) => {
      if (target !== navLinkRef.current) {
        setOpen(false);
      }
    },
    [setOpen]
  );
  const handleNavLinkClick = useCallback(
    ({ target }) => {
      if (target.tagName === 'A') {
        setOpen(false);
      }
    },
    [setOpen]
  );

  useLayoutEffect(() => {
    const placeholder = placeholderRef.current;
    if (placeholder != null) {
      setClient(placeholder.getBoundingClientRect());
    }
  }, []);

  useOutsideClick(navRef, handleMenuClose);

  return (
    <div className={classes.root}>
      <Container>
        <div className={classes.innerContainer}>
          <Link to="/" className={classes.navLink}>
            <h1 className={classes.logo}>
              Edu<span>Fina</span>
            </h1>
          </Link>
          <div
            className={clsx(classes.navContainer, { 'is-open': open })}
            style={{
              '--expandedWidth': client.width + 'px',
              '--expandedHeight': client.height + 'px',
            }}
          >
            <NavButton
              ref={navLinkRef}
              isOpen={open}
              onClick={handleMenuToggle}
            />
            <nav ref={navRef} onClick={handleNavLinkClick}>
              <span className="real-links-container">
                <span className="real-links-wrapper">
                  <Link to="/">
                    <span>Home</span>
                  </Link>
                  <Link to="/checkout">
                    <span>Checkout</span>
                  </Link>
                  <Link to="/investment-calculator">
                    <span>Investment calculator</span>
                  </Link>
                  <Link to="/mortgage-calculator">
                    <span>Mortgage calculator</span>
                  </Link>
                  <Link to="/articles">
                    <span>Articles</span>
                  </Link>
                  <Link to="/about-us">
                    <span>About Us</span>
                  </Link>
                  <Link to="/contact">
                    <span>Contact</span>
                  </Link>
                </span>
              </span>
              <span ref={placeholderRef} className={classes.navPlaceholder}>
                <Link to="/">Home</Link>
                <Link to="/">Checkout</Link>
                <Link to="/">Investment calculator</Link>
                <Link to="/">Mortgage calculator</Link>
                <Link to="/">Articles</Link>
                <Link to="/">About Us</Link>
                <Link to="/">Contact</Link>
              </span>
            </nav>
          </div>
        </div>
      </Container>
    </div>
  );
};
