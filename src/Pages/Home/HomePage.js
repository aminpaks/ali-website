import React, { useEffect, useRef } from "react";
import jQuery from "jquery";
import { clsx, makeStyles, Link } from "../../dependencies";
import {
  Button,
  iPhonePortraitMediaQuery,
  iPhoneLandscapeMediaQuery,
  LayoutHome,
} from "../../UI";
import { getPublicImage } from "../../Utils";
import bgImg from "../../Assets/back-04.jpg";

const getBackground = (image) => ({ backgroundImage: `url(${image}` });

const useStyles = makeStyles(({ breakpoints }) => ({
  scrollable: {
    width: "100vw",
    height: "var(--windowHeight)",
    boxSizing: "border-box",
    overflowY: "scroll",
    scrollSnapType: "y mandatory",
  },
  section: {
    width: "100vw",
    height: "var(--windowHeight)",
    scrollSnapAlign: "start",
    scrollSnapStop: "always",
    "& > div": {
      width: "100%",
      height: "var(--windowHeight)",
      backgroundPosition: "top center",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
    },
    "& img": {
      opacity: 0,
      width: 1,
      height: 1,
    },
    [`@media ${iPhonePortraitMediaQuery}`]: {
      "& > div": {
        "--beforeTopColor": "rgba(255,255,255,0)",
        "--beforeBottomColor": "rgba(255,255,255,0)",
        "--afterTopColor": "rgba(255,255,255,0)",
        "--afterBottomColor": "rgba(255,255,255,0)",
        position: "relative",
        "&::before,&::after": {
          width: "100%",
          content: '""',
          display: "block",
          position: "absolute",
        },
        "&::before": {
          top: 0,
          height: "40vh",
          backgroundImage:
            "linear-gradient(0deg, var(--beforeBottomColor) 0%, var(--beforeTopColor) 40%)",
        },
        "&::after": {
          bottom: 0,
          height: "25vh",
          backgroundImage:
            "linear-gradient(0deg, var(--afterBottomColor) 0%, var(--afterTopColor) 70%)",
        },
      },
      "&:nth-child(1) > div": {
        "--beforeTopColor": "rgba(255,255,255,1)",
        "--beforeBottomColor": "rgba(255,255,255,0)",
        "--afterTopColor": "rgba(255,255,255,0)",
        "--afterBottomColor": "rgba(255,255,255,1)",
        backgroundSize: "250vw",
        backgroundPosition: "center 75%",
      },
      "&:nth-child(3) > div": {
        "--beforeTopColor": "rgba(230,230,230,1)",
        "--beforeBottomColor": "rgba(230,230,230,0)",
        "--afterTopColor": "rgba(230,230,230,0)",
        "--afterBottomColor": "rgba(230,230,230,1)",
        backgroundPosition: "center 60px",
      },
    },
  },
  contents: {
    top: 0,
    left: 0,
    width: "100vw",
    position: "fixed",
    cursor: "default",
    textAlign: "center",
    pointerEvents: "none",
    "& h2": {
      fontSize: "2rem",
      fontWeight: "normal",
    },
    "& h2 + span": {
      display: "block",
      marginTop: -18,
    },
  },
  contentsContainer: {
    top: 60,
    left: "50%",
    transform: "translateX(-50%)",
    opacity: 0,
    color: "#2d2d2d",
    textShadow: "0px 0px 4px rgba(0,0,0, 0.2)",
    position: "absolute",
    [breakpoints.down("md")]: {
      top: 60,
      width: "100vw",
      transform: "translateX(-50%)",
    },
    [`@media ${iPhoneLandscapeMediaQuery}`]: {
      "&::before": {
        top: "50%",
        width: "100%",
        height: "100%",
        display: "block",
        content: '""',
        position: "absolute",
        transform: "translateY(-50%)",
        backgroundImage:
          "linear-gradient(0deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 45%, rgba(255, 255, 255, 1) 55%, rgba(255, 255, 255, 0) 100%)",
        zIndex: -1,
      },
      "&:nth-child(1)::before": {
        height: "250%",
        transform: "translateY(-40%)",
      },
    },
  },
  contentsBottom: {
    bottom: 0,
    left: 0,
    width: "100%",
    position: "fixed",
    cursor: "default",
    [`@media ${iPhoneLandscapeMediaQuery}`]: {
      top: "calc(var(--windowHeight) - 30px)",
      bottom: "initial",
    },
  },
  contentsBottomContainer: {
    left: "50%",
    bottom: 80,
    transform: "translateX(-50%)",
    opacity: 0,
    position: "absolute",
    textAlign: "center",
    [breakpoints.down("md")]: {
      bottom: 30,
    },
  },
  buttonGroup: {
    "& > *": {
      margin: "0.8rem 1.2rem",
      // margin: "0.8rem",
      padding: "6px 18px",
      fontSize: "16px",
      width: "150px",
    },
    [`@media ${iPhonePortraitMediaQuery}`]: {
      "& > *:first-of-type": {
        marginBottom: "0.8rem",
      },
    },
    [`@media ${iPhoneLandscapeMediaQuery}`]: {
      "& > *:first-of-type": {
        marginBottom: "0.8rem",
      },
    },
  },
}));

export const PageHome = () => {
  const classes = useStyles();

  const scrollableRef = useRef();
  const contentsRef = useRef();

  useEffect(() => {
    (function ($) {
      const scrollable = $(".scrollable");
      const sections = $(".scrollable .abs-section");
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

      const texts = $(".abs-text");
      const contentBottom = $(
        ".abs-contents-bottom .abs-contents-bottom-container"
      );

      scrollable.on("scroll", () => {
        const scrollTop = scrollableEl.scrollTop;

        texts.each(function (idx) {
          $(this).css("opacity", applyOpacity(idx, scrollTop).toString());
        });

        contentBottom.each(function (idx) {
          const newOpacity = applyOpacity(idx, scrollTop);
          $(this).css("opacity", String(newOpacity));
          $(this).css("z-index", String(newOpacity * 100));
        });
      });

      texts.eq(0).css("opacity", 1);
      contentBottom.eq(0).css("opacity", 1);
      contentBottom.eq(0).css("z-index", 100);
    })(jQuery);
  }, []);

  return (
    <LayoutHome>
      <div
        ref={scrollableRef}
        className={clsx("scrollable", classes.scrollable)}
      >
        <div className={clsx("abs-section", classes.section)}>
          <div style={getBackground(getPublicImage("/back-01.jpg"))}>
            <img alt="background" src={getPublicImage("/back-01.jpg")} />
          </div>
        </div>
        <div className={clsx("abs-section", classes.section)}>
          <div style={getBackground(getPublicImage("/back-02.jpg"))}>
            <img alt="background" src={getPublicImage("/back-02.jpg")} />
          </div>
        </div>
        <div className={clsx("abs-section", classes.section)}>
          <div
            style={{
              background: `url(${bgImg}) no-repeat`,
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          >
            {/* <img alt="background" src={getPublicImage("/back-04.jpg")} /> */}
          </div>
        </div>
      </div>
      <div ref={contentsRef} className={classes.contents}>
        <div
          className={clsx("abs-text", classes.contentsContainer, {
            "is-small-screen": true,
          })}
        >
          <div className="text">
            <div>
              <h2>Financial Literacy Course</h2>
              <span>Money-back guarantee</span>
            </div>
          </div>
        </div>
        <div
          className={clsx("abs-text", classes.contentsContainer, {
            "is-small-screen": true,
          })}
        >
          <div className="text">
            <div>
              <h2>Free Resources</h2>
            </div>
          </div>
        </div>
        <div
          className={clsx("abs-text", classes.contentsContainer, {
            "is-small-screen": true,
          })}
        >
          <div className="text">
            <div>
              <h2>Schedule a Consultation</h2>
            </div>
          </div>
        </div>
      </div>
      <div className={clsx("abs-contents-bottom", classes.contentsBottom)}>
        <div
          className={clsx(
            "abs-contents-bottom-container",
            classes.contentsBottomContainer
          )}
        >
          <div className={classes.buttonGroup}>
            <Button
              size="small"
              to="/courses"
              color="secondary"
              component={Link}
            >
              Courses
            </Button>
            <Button
              size="small"
              to="/about-us"
              color="secondary"
              component={Link}
            >
              Learn more
            </Button>
          </div>
        </div>
        <div
          className={clsx(
            "abs-contents-bottom-container",
            classes.contentsBottomContainer
          )}
        >
          <div className={classes.buttonGroup}>
            <Button
              size="small"
              to="/investment-calculator"
              color="primary"
              component={Link}
            >
              Calculators
            </Button>
            <Button
              size="small"
              to="/articles"
              component={Link}
              color="secondary"
            >
              Articles
            </Button>
          </div>
        </div>
        <div
          className={clsx(
            "abs-contents-bottom-container",
            classes.contentsBottomContainer
          )}
        >
          <div className={classes.buttonGroup}>
            <Button to="/contact" color="primary" size="small" component={Link}>
              Contact us
            </Button>
          </div>
        </div>
      </div>
    </LayoutHome>
  );
};
