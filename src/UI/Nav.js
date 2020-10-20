import React from 'react';
import { Link } from 'react-router-dom';
import { Container, makeStyles } from '@material-ui/core';

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
    flex: '1 0 auto',
    display: 'block',
    textAlign: 'right',

    '& nav': {
      display: 'inline-block',
    },
    '& a': {
      display: 'block',
    },
  },
});

export const Nav = () => {
  const classes = useStyle();

  return (
    <div className={classes.root}>
      <Container>
        <div className={classes.innerContainer}>
          <h1 className={classes.logo}>
            Edu<span>Fina</span>
          </h1>
          <div className={classes.nav}>
            <nav>
              <span>Menu</span>
              <Link to="/">Home</Link>
              <Link to="/checkout">Checkout</Link>
              <Link to="/calculators">Calculators</Link>
              <Link to="/papers">Papers</Link>
            </nav>
          </div>
        </div>
      </Container>
    </div>
  );
};
