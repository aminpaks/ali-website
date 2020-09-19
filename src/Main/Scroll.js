import React, { useEffect } from 'react';
import $ from 'jquery';
import './style.scss';

const getBackground = (image) => ({ backgroundImage: `url(${image}` });
const getPublicImage = (imageUrl) => process.env.PUBLIC_URL + imageUrl;

export const Scroll = () => {
  useEffect(() => {
    console.log('SCRIPT');

    const scrollable = $('.scrollable');
    const sections = $('.scrollable .section');
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

    const texts = $('.contents .container');
    const contentBottom = $('.contents-bottom .container');

    scrollable.on('scroll', () => {
      const scrollTop = scrollableEl.scrollTop;
      console.log('top scroll', scrollTop);

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
  }, []);
  return (
    <div>
      <div className="scrollable">
        <div className="section">
          <div style={getBackground(getPublicImage('/back-01.jpg'))}>
            <img alt="background" src={getPublicImage('/back-01.jpg')} />
          </div>
        </div>
        <div className="section">
          <div style={getBackground(getPublicImage('/back-02.jpg'))}>
            <img alt="background" src={getPublicImage('/back-02.jpg')} />
          </div>
        </div>
        <div className="section">
          <div style={getBackground(getPublicImage('/back-03.jpg'))}>
            <img alt="background" src={getPublicImage('/back-03.jpg')} />
          </div>
        </div>
        <div className="section">
          <div style={getBackground(getPublicImage('/back-04.jpg'))}>
            <img alt="background" src={getPublicImage('/back-04.jpg')} />
          </div>
        </div>
      </div>
      <div className="contents">
        <div className="container">
          <div className="text">
            <div>
              <h2>Something about this life</h2>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="text">
            <div>
              <h2>Some other topic to point out</h2>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="text">
            <div>
              <h2>Courses for free</h2>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="text">
            <div>
              <h2>This is the end game. Die hard!</h2>
            </div>
          </div>
        </div>
      </div>
      <div className="contents-bottom">
        <div className="container">
          <div className="buttons">
            <a href="https://google.com/" className="button inverse" target="_blank" rel="noopener noreferrer">
              Hello
            </a>
            <a href="https://google.com/" className="button" target="_blank" rel="noopener noreferrer">
              Second
            </a>
          </div>
        </div>
        <div className="container">
          <div className="buttons">
            <a href="https://google.com/" className="button" target="_blank" rel="noopener noreferrer">
              Section 2 Hello
            </a>
            <a href="https://google.com/" className="button" target="_blank" rel="noopener noreferrer">
              Section 2 Hello
            </a>
          </div>
        </div>
        <div className="container">
          <div className="buttons">
            <a href="https://google.com/" className="button inverse" target="_blank" rel="noopener noreferrer">
              S#3 Hello
            </a>
            <a href="https://google.com/" className="button inverse" target="_blank" rel="noopener noreferrer">
              Second
            </a>
          </div>
        </div>
        <div className="container">
          <div className="buttons">
            <a href="https://google.com/" className="button" target="_blank" rel="noopener noreferrer">
              S#4 Hello
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
