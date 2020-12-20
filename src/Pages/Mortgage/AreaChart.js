import { useCallback, useMemo } from 'react';
import { makeStyles } from '@material-ui/core';
import { AreaClosed, Line, Bar } from '@visx/shape';
import { curveMonotoneX } from '@visx/curve';
import { GridRows } from '@visx/grid';
import { scaleTime, scaleLinear } from '@visx/scale';
import { localPoint } from '@visx/event';
import { LinearGradient } from '@visx/gradient';
import { AxisLeft } from '@visx/axis';
import {
  withTooltip,
  Tooltip,
  TooltipWithBounds,
  defaultStyles,
} from '@visx/tooltip';
import { max, extent, bisector } from 'd3-array';
import { timeFormat } from 'd3-time-format';
import { formatMoney } from '../../Utils';

export const background = '#f9f9f9';
export const background2 = '#fff';
export const accentColorDark = '#404040';
export const balanceColor = '#2734BE';
export const interestColor = '#D00000';
export const principleColor = '#FFA400';
const tooltipStyles = {
  ...defaultStyles,
  background,
  border: '1px solid white',
  color: '#000',
  lineHeight: '2rem',
  fontSize: '1rem',
};

const useChartStyles = makeStyles({
  tooltipLine: {
    '& > div': {
      paddingLeft: '1.3rem',
      position: 'relative',
    },
    '& > div::before': {
      display: 'block',
      content: '""',
      top: '0.7rem',
      left: '0.2rem',
      width: '0.6rem',
      height: '0.6rem',
      borderRadius: '50%',
      position: 'absolute',
    },
  },
  tooltipBalance: {
    '&::before': {
      backgroundColor: balanceColor,
    },
  },
  tooltipInterest: {
    '&::before': {
      backgroundColor: interestColor,
    },
  },
  tooltipPrinciple: {
    '&::before': {
      backgroundColor: principleColor,
    },
  },
});

// util
const formatDate = timeFormat("%b %d, '%y");

// accessors
const getDate = (d) => new Date(d.date);
const getBalanceValue = (d) => d.balance;
const getInterestValue = (d) => d.interest;
const getPrincipleValue = (d) => d.principle;
const bisectDate = bisector((d) => new Date(d.date)).left;

export const AreaChart = withTooltip(
  ({
    width,
    height,
    margin = { top: 0, right: 0, bottom: 0, left: 0 },
    showTooltip,
    hideTooltip,
    tooltipData,
    tooltipTop = 0,
    tooltipLeft = 0,
    data,
  }) => {
    if (width < 10) return null;

    const classes = useChartStyles();

    // bounds
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // scales
    const dateScale = useMemo(
      () =>
        scaleTime({
          range: [margin.left, innerWidth + margin.left],
          domain: extent(data, getDate),
        }),
      [innerWidth, margin.left, data]
    );
    const balanceValueScale = useMemo(() => {
      const maxBalanceValue = max(data, getBalanceValue) || 0;
      return scaleLinear({
        range: [innerHeight + margin.top, margin.top],
        domain: [0, maxBalanceValue * 1.005],
        nice: true,
      });
    }, [margin.top, innerHeight, data]);

    // tooltip handler
    const handleTooltip = useCallback(
      (event) => {
        const { x } = localPoint(event) || { x: 0 };
        const x0 = dateScale.invert(x);
        const index = bisectDate(data, x0, 1);
        const d0 = data[index - 1];
        const d1 = data[index];
        let d = d0;
        if (d1 && getDate(d1)) {
          d =
            x0.valueOf() - getDate(d0).valueOf() >
            getDate(d1).valueOf() - x0.valueOf()
              ? d1
              : d0;
        }
        showTooltip({
          tooltipData: {
            d,
            interestTop: balanceValueScale(getInterestValue(d)),
            principleTop: balanceValueScale(getPrincipleValue(d)),
          },
          tooltipLeft: x,
          tooltipTop: balanceValueScale(getBalanceValue(d)),
        });
      },
      [showTooltip, balanceValueScale, dateScale, data]
    );

    return (
      <div>
        <svg width={width} height={height}>
          <rect
            x={0}
            y={0}
            width={width}
            height={height}
            fill="url(#area-background-gradient)"
          />
          <LinearGradient
            id="area-background-gradient"
            from={background}
            to={background2}
          />
          <LinearGradient
            id="area-gradient"
            from={balanceColor}
            to={balanceColor}
            fromOpacity={0.8}
            toOpacity={0.2}
          />
          <LinearGradient
            id="interest-gradient"
            from={interestColor}
            to={interestColor}
            fromOpacity={0.6}
            toOpacity={0.8}
          />
          <LinearGradient
            id="principle-gradient"
            from={principleColor}
            to={principleColor}
            fromOpacity={0.8}
            toOpacity={0.2}
          />
          <GridRows
            left={margin.left}
            scale={balanceValueScale}
            width={innerWidth}
            strokeDasharray="1,3"
            stroke={balanceColor}
            strokeOpacity={0.3}
            pointerEvents="none"
          />
          <AreaClosed
            data={data}
            x={(d) => dateScale(getDate(d)) ?? 0}
            y={(d) => balanceValueScale(getBalanceValue(d)) ?? 0}
            yScale={balanceValueScale}
            strokeWidth={2}
            stroke="url(#area-gradient)"
            fill="url(#area-gradient)"
            curve={curveMonotoneX}
          />
          <AreaClosed
            data={data}
            x={(d) => dateScale(getDate(d)) ?? 0}
            y={(d) => balanceValueScale(getPrincipleValue(d)) ?? 0}
            yScale={balanceValueScale}
            strokeWidth={2}
            stroke="url(#principle-gradient)"
            fill="url(#principle-gradient)"
            curve={curveMonotoneX}
          />
          <AreaClosed
            data={data}
            x={(d) => dateScale(getDate(d)) ?? 0}
            y={(d) => balanceValueScale(getInterestValue(d)) ?? 0}
            yScale={balanceValueScale}
            strokeWidth={2}
            stroke="url(#interest-gradient)"
            fill="url(#interest-gradient)"
            curve={curveMonotoneX}
          />
          <Bar
            x={margin.left}
            y={margin.top}
            width={innerWidth}
            height={innerHeight}
            fill="transparent"
            rx={14}
            onTouchStart={handleTooltip}
            onTouchMove={handleTooltip}
            onMouseMove={handleTooltip}
            onMouseLeave={() => hideTooltip()}
          />
          <AxisLeft left={margin.left} scale={balanceValueScale} />
          {tooltipData && (
            <g>
              <Line
                from={{ x: tooltipLeft, y: margin.top }}
                to={{ x: tooltipLeft, y: innerHeight + margin.top }}
                stroke={accentColorDark}
                strokeWidth={2}
                pointerEvents="none"
                strokeDasharray="5,2"
              />
              <circle
                cx={tooltipLeft}
                cy={tooltipTop + 1}
                r={4}
                fill="black"
                fillOpacity={0.1}
                stroke="black"
                strokeOpacity={0.1}
                strokeWidth={2}
                pointerEvents="none"
              />
              <circle
                cx={tooltipLeft}
                cy={tooltipTop}
                r={4}
                fill={accentColorDark}
                stroke="white"
                strokeWidth={2}
                pointerEvents="none"
              />
              <circle
                cx={tooltipLeft}
                cy={tooltipData.interestTop}
                r={4}
                fill={accentColorDark}
                stroke="white"
                strokeWidth={2}
                pointerEvents="none"
              />
              <circle
                cx={tooltipLeft}
                cy={tooltipData.principleTop}
                r={4}
                fill={accentColorDark}
                stroke="white"
                strokeWidth={2}
                pointerEvents="none"
              />
            </g>
          )}
        </svg>
        {tooltipData && (
          <div>
            <TooltipWithBounds
              key={Math.random()}
              top={tooltipData.interestTop - 12}
              left={tooltipLeft + 12}
              style={tooltipStyles}
            >
              <div className={classes.tooltipLine}>
                <div className={classes.tooltipInterest}>
                  Interest: ${formatMoney(getInterestValue(tooltipData.d), 2)}
                </div>
                <div className={classes.tooltipBalance}>
                  Balance: ${formatMoney(getBalanceValue(tooltipData.d), 2)}
                </div>
                <div className={classes.tooltipPrinciple}>
                  Principle: ${formatMoney(getPrincipleValue(tooltipData.d), 2)}
                </div>
              </div>
            </TooltipWithBounds>
            <Tooltip
              top={innerHeight + margin.top}
              left={tooltipLeft}
              style={{
                ...defaultStyles,
                minWidth: 72,
                lineHeight: '1rem',
                textAlign: 'center',
                transform: 'translateX(-50%)',
                whiteSpace: 'nowrap',
                color: '#444',
              }}
            >
              {formatDate(getDate(tooltipData.d))}
            </Tooltip>
          </div>
        )}
      </div>
    );
  }
);
