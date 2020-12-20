import React, {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  forwardRef,
} from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Container, makeStyles } from '@material-ui/core';
import { useOutsideClick } from '../Utils/OutsideClick';

const useNavButtonStyle = makeStyles({
  navButton: {
    width: 18,
    height: 18,
    overflow: 'hidden',
    position: 'relative',
    cursor: 'pointer',
    zIndex: 2,
    borderRadius: 2,
    backgroundColor: 'rgba(0,0,0,0)',
    // boxShadow: ({ open }) =>
    //   open === true
    //     ? '0 0 2px 2px rgba(0,0,0,0.2)'
    //     : '0 0 2px 2px rgba(0,0,0,0)',
    '& span': {
      top: 8,
      pointerEvents: 'none',
      backgroundColor: ({ open }) => (open === true ? 'transparent' : '#000'),
      '&::before': {
        top: ({ open }) => (open === true ? 0 : -5),
        transform: ({ open }) =>
          open === true ? 'rotate(45deg)' : 'rotate(0deg)',
      },
      '&::after': {
        top: ({ open }) => (open === true ? 0 : 5),
        transform: ({ open }) =>
          open === true ? 'rotate(-45deg)' : 'rotate(0deg)',
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
    background: 'rgba(0,0,0,0.2)',
  },
});

const NavButton = forwardRef(({ isOpen, onClick }, ref) => {
  const classes = useNavButtonStyle({ open: isOpen });
  return (
    <span ref={ref} className={classes.navButton} onClick={onClick}>
      <span />
    </span>
  );
});

const useStyle = makeStyles(({ palette }) => ({
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
  nav: {
    display: 'flex',
    flex: '1 0 auto',
    justifyContent: 'flex-end',
    position: 'relative',
    // border: '1px solid',

    '& nav': {
      top: '-1.45em',
      right: ({ open }) => (open === true ? '-2em ' : '-1.45em'),
      display: 'block',
      position: 'absolute',
      overflow: 'hidden',
      padding: '2em',
      borderRadius: '0.4em',
      border: '1px solid #eee',
      boxSizing: 'content-box',
      backgroundColor: ({ open }) => (open === true ? '#fff' : 'transparent'),

      borderColor: ({ open }) =>
        open === true ? 'rgba(0,0,0,0.16)' : 'rgba(0,0,0,0)',
      boxShadow: ({ open }) =>
        open === true ? '0 0 8px rgba(0,0,0,0.1)' : '0 0 0px rgba(0,0,0,0)',
      transition: ({ open }) =>
        open === true
          ? '180ms ease-in-out all, 200ms ease-out width, 200ms 140ms ease-out height'
          : '180ms ease-in-out all, 160ms 140ms ease-out width, 200ms ease-in height',
      width: ({ open, client }) => (open === true ? client.width : 0),
      height: ({ open, client }) => (open === true ? client.height : 0),
      '& > span': {
        display: 'block',
        paddingTop: '2em',
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
          <div className={classes.nav}>
            <NavButton
              ref={navLinkRef}
              isOpen={open}
              onClick={handleMenuToggle}
            />
            <nav ref={navRef} onClick={handleNavLinkClick}>
              <span>
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
              </span>
              <span ref={placeholderRef} className={classes.navPlaceholder}>
                <Link to="/">Home</Link>
                <Link to="/">Checkout</Link>
                <Link to="/">Investment calculator</Link>
                <Link to="/">Mortgage calculator</Link>
                <Link to="/">Articles</Link>
                <Link to="/">About Us</Link>
              </span>
            </nav>
          </div>
        </div>
      </Container>
    </div>
  );
};
