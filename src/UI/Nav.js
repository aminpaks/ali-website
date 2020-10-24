import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, makeStyles } from '@material-ui/core';

const useNavButtonStyle = makeStyles({
  navButton: {
    width: 18,
    height: 18,
    overflow: 'hidden',
    position: 'relative',
    cursor: 'pointer',
    zIndex: 2,
    borderRadius: 2,
    backgroundColor: '#fff',
    // boxShadow: ({ open }) =>
    //   open === true
    //     ? '0 0 2px 2px rgba(0,0,0,0.2)'
    //     : '0 0 2px 2px rgba(0,0,0,0)',
    '& span': {
      top: 8,
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

const NavButton = ({ isOpen, onClick }) => {
  const classes = useNavButtonStyle({ open: isOpen });
  return (
    <span className={classes.navButton} onClick={onClick}>
      <span />
    </span>
  );
};

const useStyle = makeStyles({
  root: {
    top: 0,
    left: 0,
    right: 0,
    padding: '20px 0',
    position: 'fixed',
    zIndex: 99,
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
      backgroundColor: '#fff',
      overflow: 'hidden',
      padding: '2em',
      borderRadius: '0.4em',
      border: '1px solid #eee',
      boxSizing: 'content-box',

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
      minWidth: '10em',
      textAlign: 'right',
      position: 'relative',
      transition: '180ms ease-in-out',
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
      },
      '&::after': {
        top: 0,
        right: 0,
        bottom: 0,
        width: 0,
        content: '""',
        display: 'block',
        position: 'absolute',
        backgroundColor: 'rgba(0,0,0,1)',
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
});

export const Nav = () => {
  const placeholderRef = useRef();
  const [open, setOpen] = useState(false);
  const [client, setClient] = useState({ width: 0, height: 0 });
  const classes = useStyle({ open, client });
  const handleMenuOpen = useCallback(() => setOpen((v) => !v), [setOpen]);
  console.log('open', open, placeholderRef);

  useLayoutEffect(() => {
    const placeholder = placeholderRef.current;
    if (placeholder != null) {
      setClient(placeholder.getBoundingClientRect());
    }
  }, []);

  return (
    <div className={classes.root}>
      <Container>
        <div className={classes.innerContainer}>
          <h1 className={classes.logo}>
            Edu<span>Fina</span>
          </h1>
          <div className={classes.nav}>
            <NavButton isOpen={open} onClick={handleMenuOpen} />
            <nav>
              <span>
                <Link to="/">
                  <span>Home</span>
                </Link>
                <Link to="/checkout">
                  <span>Checkout</span>
                </Link>
                <Link to="/calculators">
                  <span>Calculators</span>
                </Link>
                <Link to="/papers">
                  <span>Papers</span>
                </Link>
              </span>
              <span ref={placeholderRef} className={classes.navPlaceholder}>
                <Link to="/">Home</Link>
                <Link to="/checkout">Checkout</Link>
                <Link to="/calculators">Calculators</Link>
                <Link to="/papers">Papers</Link>
              </span>
            </nav>
          </div>
        </div>
      </Container>
    </div>
  );
};
