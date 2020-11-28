import React, { useEffect, useRef } from 'react';
import jQuery from 'jquery';
import './style.scss';
import { Button } from '../UI';
import { LayoutHome } from '../UI/LayoutHome';
import {
  clsx,
  useMediaQuery,
  useTheme,
  makeStyles,
  Link,
} from '../dependencies';

const getBackground = (image) => ({ backgroundImage: `url(${image}` });
const getPublicImage = (imageUrl) => process.env.PUBLIC_URL + imageUrl;

const useStyles = makeStyles({
  scrollable: {
    width: '100vw',
    height: '100vh',
    overflowY: 'scroll',
    scrollSnapType: 'y mandatory',
  },
  section: {
    width: '100%',
    height: '100%',
    scrollSnapAlign: 'start',
    '& > div': {
      width: '100%',
      height: '100%',
      backgroundPosition: 'top center',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
    },
    '& img': {
      opacity: 0,
      width: 1,
      height: 1,
    },
  },
  contents: {
    top: 0,
    left: 0,
    width: '100vw',
    position: 'fixed',
    cursor: 'default',
    '& h2': {
      fontSize: '2rem',
      fontWeight: 'normal',
    },
    pointerEvents: 'none',
  },
  contentsContainer: {
    width: ({ mdDown }) => (mdDown ? '100vw' : undefined),
    top: ({ mdDown }) => (mdDown ? 60 : 100),
    left: '50%',
    transform: ({ mdDown }) => (mdDown ? undefined : 'translateX(-50%)'),
    opacity: 0,

    color: '#2d2d2d',
    textShadow: '0px 0px 4px rgba(0,0,0, 0.2)',

    position: 'absolute',
    textAlign: 'center',

    userSelect: 'none',
  },
  contentsBottom: {
    bottom: 0,
    left: 0,
    width: '100%',
    position: 'fixed',
    cursor: 'default',
  },
  contentsBottomContainer: {
    left: '50%',
    bottom: ({ mdDown }) => (mdDown ? 60 : 100),
    transform: 'translateX(-50%)',
    opacity: 0,
    padding: '0 2em',
    width: '100%',

    color: 'white',
    // textShadow: '0px 0px 15px black',

    position: 'absolute',
    textAlign: 'center',
  },
  buttonGroup: {
    '& > *': {
      margin: ({ spacing }) => spacing(1),
    },
  },
});

export const Scroll = () => {
  const { breakpoints, spacing } = useTheme();
  const matches = useMediaQuery(breakpoints.down('md'));
  const classes = useStyles({ spacing, breakpoints, mdDown: matches });

  const scrollableRef = useRef();
  // const scrollableEl = scrollableRef.current;
  const contentsRef = useRef();
  // const contentsEl = contentsRef.current;

  useEffect(() => {
    (function ($) {
      const scrollable = $('.scrollable');
      const sections = $('.scrollable .abs-section');
      const scrollableEl = scrollable.get(0);

      const getOpacity = (top) => {
        const height = scrollableEl.clientHeight;
        const bottom = height * (sections.length - 1);
        const pi = Math.PI;
        const x = 2 * pi * (top / bottom) - (3 * pi) / 2;
        const y = Math.sin(x);
        return y;
      };

      const applyOpacity = (idx, top) => {
        const height = scrollableEl.clientHeight;
        const iTop = idx * height - top;
        let opacity = getOpacity(iTop);
        if (Math.abs(iTop) >= height * 0.9999) {
          opacity = 0;
        }
        return opacity;
      };

      const texts = $('.abs-text');
      const contentBottom = $(
        '.abs-contents-bottom .abs-contents-bottom-container'
      );

      scrollable.on('scroll', () => {
        const scrollTop = scrollableEl.scrollTop;

        texts.each(function (idx) {
          $(this).css('opacity', applyOpacity(idx, scrollTop).toString());
        });

        contentBottom.each(function (idx) {
          const newOpacity = applyOpacity(idx, scrollTop);
          $(this).css('opacity', String(newOpacity));
          $(this).css('z-index', String(newOpacity * 100));
        });
      });

      texts.eq(0).css('opacity', 1);
      contentBottom.eq(0).css('opacity', 1);
      contentBottom.eq(0).css('z-index', 100);
    })(jQuery);
  }, []);

  return (
    <LayoutHome>
      <div
        ref={scrollableRef}
        className={clsx('scrollable', classes.scrollable)}
      >
        <div className={clsx('abs-section', classes.section)}>
          <div style={getBackground(getPublicImage('/back-01.jpg'))}>
            <img alt="background" src={getPublicImage('/back-01.jpg')} />
          </div>
        </div>
        <div className={clsx('abs-section', classes.section)}>
          <div style={getBackground(getPublicImage('/back-02.jpg'))}>
            <img alt="background" src={getPublicImage('/back-02.jpg')} />
          </div>
        </div>
        <div className={clsx('abs-section', classes.section)}>
          <div style={getBackground(getPublicImage('/back-03.jpg'))}>
            <img alt="background" src={getPublicImage('/back-03.jpg')} />
          </div>
        </div>
        <div className={clsx('abs-section', classes.section)}>
          <div style={getBackground(getPublicImage('/back-04.jpg'))}>
            <img alt="background" src={getPublicImage('/back-04.jpg')} />
          </div>
        </div>
      </div>
      <div ref={contentsRef} className={classes.contents}>
        <div className={clsx('abs-text', classes.contentsContainer)}>
          <div className="text">
            <div>
              <h2>Financial Literacy Course</h2>
            </div>
          </div>
        </div>
        <div className={clsx('abs-text', classes.contentsContainer)}>
          <div className="text">
            <div>
              <h2>Free Resources</h2>
            </div>
          </div>
        </div>
        <div className={clsx('abs-text', classes.contentsContainer)}>
          <div className="text">
            <div>
              <h2>Meet Our Team</h2>
            </div>
          </div>
        </div>
        <div className={clsx('abs-text', classes.contentsContainer)}>
          <div className="text">
            <div>
              <h2>Schedule a Consultation</h2>
            </div>
          </div>
        </div>
      </div>
      <div className={clsx('abs-contents-bottom', classes.contentsBottom)}>
        <div
          className={clsx(
            'abs-contents-bottom-container',
            classes.contentsBottomContainer
          )}
        >
          <div className={classes.buttonGroup}>
            <Button color="primary" size="large">
              Register
            </Button>
            <Button
              to="/about-us"
              color="secondary"
              size="large"
              component={Link}
            >
              Learn more
            </Button>
          </div>
        </div>
        <div
          className={clsx(
            'abs-contents-bottom-container',
            classes.contentsBottomContainer
          )}
        >
          <div className={classes.buttonGroup}>
            <Button color="primary" size="large">
              Calculators
            </Button>
            <Button
              to="/papers"
              component={Link}
              color="secondary"
              size="large"
            >
              Articles
            </Button>
          </div>
        </div>
        <div
          className={clsx(
            'abs-contents-bottom-container',
            classes.contentsBottomContainer
          )}
        >
          <div className={classes.buttonGroup}>
            <Button color="primary" size="large">
              Calculators
            </Button>
            <Button color="secondary" size="large">
              Articles
            </Button>
          </div>
        </div>
        <div
          className={clsx(
            'abs-contents-bottom-container',
            classes.contentsBottomContainer
          )}
        >
          <div className={classes.buttonGroup}>
            <Button color="primary" size="large">
              Articles
            </Button>
          </div>
        </div>
      </div>
    </LayoutHome>
  );
};
