import {
  d3,
  LinearGradient,
  curveMonotoneX,
  scaleLinear,
  makeStyles,
  clsx,
  useTheme,
} from "../../dependencies";
import { useEffect, useMemo, useRef } from "react";
import { Counter } from "./countUp";
import { noop } from "../../Utils";

const useStyles = makeStyles({
  investValueLabel: {
    top: "100vh",
    right: 0,
    fontSize: "1.5rem",
    marginTop: "-2rem",
    lineHeight: "2rem",
    position: "absolute",
    minWidth: "36vw",
    transition: "500ms ease",
    "&.count-in": {
      transition: "1s",
    },
    borderBottom: "2px dotted #000",
    textShadow: "1px 1px 14px #fff, -1px -1px 14px #fff",
    pointerEvents: "none",
    "& span": {
      display: "block",
      "&:nth-of-type(2)": {
        position: "absolute",
        fontSize: "1rem",
      },
    },
  },
  investValueBank: {
    borderBottomColor: "#c91f17",
  },
  investValueEduFina: {
    borderBottomColor: "#0063b2",
  },
});

const getIndex = (scale) => (_, i) => scale(i);

export const InvestChart = ({ width, height, data }) => {
  console.log(data, "data");
  const classes = useStyles();
  const { palette } = useTheme();

  const loadingScales = useMemo(() => getLoadingScales(width, height), [
    width,
    height,
  ]);

  // scales
  const scaleX = useMemo(
    () =>
      data?.edufinaInvest &&
      scaleLinear({
        range: [0, width],
        domain: [0, data.edufinaInvest.length - 1],
      }),
    [data?.edufinaInvest, width]
  );
  const scaleY = useMemo(
    () =>
      data?.edufinaInvest &&
      scaleLinear({
        range: [height, 0],
        domain: [0, d3.max(data.edufinaInvest)],
      }),
    [data?.edufinaInvest, height]
  );

  const edufina = useMemo(() => {
    if (data?.edufinaInvest) {
      const max = d3.max(data.edufinaInvest);
      const values = {
        top: scaleY(max),
        value: max,
      };
      console.log(values, "values");
      return values;
    }
    return { top: height, value: 0 };
  }, [data?.edufinaInvest, height, scaleY]);
  const bank = useMemo(() => {
    if (data?.bankInvest) {
      const max = d3.max(data.bankInvest);
      const values = {
        top: scaleY(max),
        value: max,
      };
      return values;
    }
    return { top: height, value: 0 };
  }, [data?.bankInvest, height, scaleY]);

  if (width < 10) return null;

  return (
    <>
      <svg width={width} height={height}>
        <LinearGradient id="loading-gradient" from={"#aaa"} to={"#efefef"} />
        <LinearGradient
          id="edufina-gradient"
          from={palette.accent.main}
          to={palette.accent.dark}
        />
        <LinearGradient id="bank-gradient" from={"#c91f17"} to={"#884744"} />

        <AnimatedAreaClosed
          redraw={[width, height]}
          data={data?.edufinaInvest ? null : loadingMockData}
          x={getIndex(loadingScales.scaleX)}
          y={loadingScales.scaleY}
          yScale={loadingScales.scaleY}
          strokeWidth={2}
          stroke={"#aaa"}
          fill="url(#loading-gradient)"
          curve={curveMonotoneX}
        />
        <AnimatedAreaClosed
          redraw={[width, height]}
          animateIntro
          data={data?.edufinaInvest ?? null}
          x={getIndex(scaleX)}
          y={scaleY}
          yScale={scaleY}
          strokeWidth={1.5}
          stroke={palette.accent.dark}
          fill="url(#edufina-gradient)"
          curve={curveMonotoneX}
        />
        <AnimatedAreaClosed
          redraw={[width, height]}
          data={data?.bankInvest ?? null}
          x={getIndex(scaleX)}
          y={scaleY}
          yScale={scaleY}
          strokeWidth={1.5}
          stroke="#a01812"
          fill="url(#bank-gradient)"
          curve={curveMonotoneX}
        />
      </svg>
      <div>
        <div
          style={{ top: edufina.value === 0 ? edufina.top + 40 : edufina.top }}
          className={clsx(
            classes.investValueLabel,
            classes.investValueEduFina,
            { "count-in": edufina.value > 0 }
          )}
        >
          <Counter value={edufina.value} onDisplayValue={displayMoney} />
          <span>EduFina</span>
        </div>
        <div
          style={{ top: bank.value <= 0 ? bank.top + 40 : bank.top }}
          className={clsx(classes.investValueLabel, classes.investValueBank, {
            "count-in": bank.value > 0,
          })}
        >
          <Counter value={bank.value} onDisplayValue={displayMoney} />
          <span>Traditional Bank</span>
        </div>
      </div>
    </>
  );
};

const alwaysTrue = () => true;
const defaultIntroTransition = () =>
  d3.transition().ease(d3.easeQuadOut).duration(1000);
const defaultOutroTransition = () =>
  d3.transition().ease(d3.easeQuadOut).duration(500);

function AnimatedAreaClosed({
  data,
  x,
  y,
  y1,
  y0,
  yScale,
  redraw = [],
  defined = alwaysTrue,
  curve,
  introTransitionGetter = defaultIntroTransition,
  outroTransitionGetter = defaultOutroTransition,
  outroTransitionDuration = 500,
  animateIntro,
  ...restProps
}) {
  const elRef = useRef();
  const outroFnRef = useRef();
  const redrawRef = useRef();

  useEffect(() => {
    const isRedraw = data && redrawRef.current === data;
    const hasOutro = typeof outroFnRef.current === "function";
    if (!isRedraw) {
      redrawRef.current = data;
      if (hasOutro) {
        outroFnRef.current(() => {
          outroFnRef.current = undefined;
        });
      }
    }
    if (data) {
      const path = d3
        .area()
        .x(x)
        .y0(y0 ?? yScale(yScale.domain()[0]))
        .y1(y1 ?? y)
        .curve(curve)
        .defined(defined);

      const d3select = d3.select(elRef.current);

      const redraw = () => {
        d3select.attr("d", path);
      };
      const reset = () => {
        const min = d3.min(yScale.domain());
        const resetData = Array(data.length).fill(min);
        d3select.datum(resetData).attr("d", path);
      };
      const intro = () => {
        d3select
          .datum(data)
          .transition(introTransitionGetter())
          .attr("d", path);
      };

      outroFnRef.current = (fn = noop) => {
        const min = d3.min(yScale.domain());
        const mockData = Array(data.length).fill(min);
        const trans = outroTransitionGetter();
        d3select
          .datum(mockData)
          .transition(trans)
          .attr("d", path)
          .on("end", fn);
      };

      if (isRedraw) {
        redraw();
        console.log("sync redraw");
      } else {
        const tid = window.setTimeout(
          () => {
            if (isRedraw) {
              redraw();
            } else {
              reset();
              intro();
            }
          },
          hasOutro ? outroTransitionDuration : 0
        );
        return () => window.clearTimeout(tid);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, ...redraw]);

  return <path {...restProps} ref={elRef} />;
}

function displayMoney(count) {
  return "$" + formatMoney(count);
}

function formatMoney(amount, decimalCount = 2, decimal = ".", thousands = ",") {
  try {
    decimalCount = Math.abs(decimalCount);
    decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

    const negativeSign = amount < 0 ? "-" : "";
    let i = parseInt((amount = Math.abs(Number(amount) || 0))).toString();
    let j = i.length > 3 ? i.length % 3 : 0;

    return (
      negativeSign +
      (j ? i.substr(0, j) + thousands : "") +
      i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) +
      (decimalCount
        ? decimal +
          Math.abs(amount - i)
            // .toString()
            .toFixed(decimalCount)
            .slice(2)
        : "")
    );
  } catch (e) {
    console.log(e);
  }
}

const loadingMockData = [
  0,
  1,
  3,
  5,
  7,
  9,
  11,
  13,
  15,
  16,
  17,
  19,
  20,
  21,
  22,
  23,
  24,
  26,
  27,
  29,
  30,
  31,
  35,
  36,
  37,
  40,
  46,
  58,
];
const getLoadingScales = (width, height) => {
  const scaleX = scaleLinear({
    range: [0, width],
    domain: [0, loadingMockData.length - 1],
  });
  const scaleY = scaleLinear({
    range: [height, 0],
    domain: [0, loadingMockData[loadingMockData.length - 1]],
  });

  return { scaleX, scaleY };
};
