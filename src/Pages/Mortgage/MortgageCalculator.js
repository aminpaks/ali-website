import React, {
  // useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
} from 'react';
import spacetime from 'spacetime';
import { makeStyles, TextField } from '@material-ui/core';
import clsx from 'clsx';
import { AreaClosed, Line, Bar } from '@visx/shape';
import { curveMonotoneX } from '@visx/curve';
import { GridRows } from '@visx/grid';
import { scaleTime, scaleLinear } from '@visx/scale';
// import { Group } from '@visx/group';
import {
  withTooltip,
  Tooltip,
  TooltipWithBounds,
  defaultStyles,
} from '@visx/tooltip';
import { localPoint } from '@visx/event';
import { LinearGradient } from '@visx/gradient';
import { AxisLeft } from '@visx/axis';

import { max, extent, bisector } from 'd3-array';
import { timeFormat } from 'd3-time-format';

import './../calculator-style.scss';
import { Layout, Button, useSize } from '../../UI';
import { formatMoney } from '../../Utils/format';
import PieChart from './PaymentPie';

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

const Sample = withTooltip(
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

const useStyle = makeStyles({
  container: {
    display: 'block',
    position: 'relative',
  },
  mdcTextField: {
    width: '100%',
    marginBottom: '16px',
  },
  mdcSelect: {
    width: '100%',
  },
  mdcButton: {
    width: '100%',
  },

  lineContainer: {
    '&,& .MuiInputBase-root': {
      fontSize: '2rem',
    },
    '& > div': {
      marginBottom: '1rem',
    },
  },
  line: {
    display: 'block',
  },

  inputs: {
    width: 200,
    verticalAlign: 'baseline',
  },
  inputPurchaseValue: {
    width: 180,
  },
  inputDownPaymentValue: {
    width: 180,
  },
  inputInterestRateValue: {
    width: 100,
  },
  inputLoadDurationValue: {
    width: 80,
    '& input': {
      textAlign: 'center',
    },
  },

  buttonCalculate: {
    fontSize: '1.8rem',
  },

  layout: {
    display: 'block',
  },

  col: {
    margin: 0,
    width: '100%',
    display: 'block',
    position: 'relative',
  },
  colLeft: {
    // maxWidth: '50vw',
    zIndex: 1,
  },
  colRight: {
    display: 'flex',
    marginBottom: '10rem',
    // alignContent: 'space-between',
    '& > div': {
      flex: '0 1 50%',
      maxWidth: '50%',
      display: 'block',
    },
    '& > div:nth-of-type(2)': {
      height: 0,
      paddingBottom: '32%',
      position: 'relative',
      '& > div': {
        width: '100%',
        height: '100%',
        position: 'absolute',
        // border: '1px solid',
        // backgroundColor: 'red',
        '& svg': {
          display: 'block',
          borderRadius: 30,
          overflow: 'hidden',
        },
      },
    },
  },

  chartContainer: {
    position: 'relative',
  },

  investmentValue: {
    fontSize: '1.5rem',
  },
  investValueBank: {},
  investValueEduFina: {},
});

const InitialState = {
  purchaseValue: 500000,
  downPaymentValue: 100000,
  interestRateValue: 3.1,
  loanDurationValue: 30,
  chartData: null,
  paymentData: null,
};

export const PageMortgageCalculator = () => {
  const [state, setState] = useState(InitialState);
  const {
    purchaseValue,
    downPaymentValue,
    interestRateValue,
    loanDurationValue,
    chartData,
    paymentData,
  } = state;

  const handlePartialUpdate = (prop) => ({ target }) =>
    setState((v) => ({
      ...v,
      [prop]:
        target.type === 'number'
          ? parseFloat(target.value || '0')
          : target.value,
    }));
  const handleCalculate = () => {
    const {
      purchaseValue,
      downPaymentValue,
      loanDurationValue,
      interestRateValue,
    } = state;
    const loanValue = purchaseValue - downPaymentValue;
    const interestValue = interestRateValue / 12 / 100;
    const durationValue = loanDurationValue * 12;

    const power = Math.pow(1 + interestValue, durationValue);
    const paymentAmount =
      loanValue * interestValue * (power / Math.abs(power - 1));
    const maintenanceAmount = (purchaseValue * 0.0115) / 12;
    const propertyTaxAmount = (purchaseValue * 0.008) / 12;
    const totalAmount = paymentAmount + maintenanceAmount + propertyTaxAmount;
    const paymentData = {
      values: [
        {
          label: 'Maintenance',
          portion: (maintenanceAmount / totalAmount) * 100,
          amount: maintenanceAmount,
        },
        {
          label: 'Property Tax',
          portion: (propertyTaxAmount / totalAmount) * 100,
          amount: propertyTaxAmount,
        },
        {
          label: 'Principle & Interest',
          portion: (paymentAmount / totalAmount) * 100,
          amount: paymentAmount,
        },
      ],
    };

    let date = spacetime(Date.now());

    let currentOwedAmount = loanValue;
    let totalInterestAmount = 0;
    let principleAmount = 0;
    const chartData = Array(durationValue)
      .fill(null)
      .map(() => {
        date = date.add(1, 'month');
        const currentInterestAmount = interestValue * currentOwedAmount;
        currentOwedAmount -= paymentAmount - currentInterestAmount;
        totalInterestAmount += currentInterestAmount;
        principleAmount += paymentAmount - currentInterestAmount;
        return {
          date: date.format('iso-utc'),
          balance: currentOwedAmount,
          interest: totalInterestAmount,
          principle: principleAmount,
        };
      });
    setState((s) => ({ ...s, chartData, paymentData }));
  };

  const classes = useStyle();
  const chartContainerRef = useRef();
  const containerSize = useSize({ ref: chartContainerRef });

  return (
    <Layout variant="fill" className={classes.layout}>
      <div className={clsx(classes.col, classes.colLeft)}>
        <div className={classes.lineContainer}>
          <div>
            I want to buy a home valued at ${' '}
            <TextField
              className={clsx(classes.inputs, classes.inputPurchaseValue)}
              type="number"
              value={purchaseValue}
              onChange={handlePartialUpdate('purchaseValue')}
            />
          </div>
          <div>
            with a down payment of ${' '}
            <TextField
              className={clsx(classes.inputs, classes.inputDownPaymentValue)}
              type="number"
              value={downPaymentValue}
              onChange={handlePartialUpdate('downPaymentValue')}
            />
          </div>
          <div>
            with an interest rate of %{' '}
            <TextField
              className={clsx(classes.inputs, classes.inputInterestRateValue)}
              type="number"
              value={interestRateValue}
              onChange={handlePartialUpdate('interestRateValue')}
            />{' '}
            for{' '}
            <TextField
              className={clsx(classes.inputs, classes.inputLoadDurationValue)}
              type="number"
              value={loanDurationValue}
              onChange={handlePartialUpdate('loanDurationValue')}
            />{' '}
            years
          </div>
          <div>
            <Button
              className={classes.buttonCalculate}
              onClick={handleCalculate}
              size="large"
            >
              Estimate
            </Button>
          </div>
        </div>
      </div>
      <div className={classes.colRight}>
        <div>
          {paymentData && (
            <PieChart width={340} height={340} data={paymentData} />
          )}
        </div>
        <div>
          <div ref={chartContainerRef}>
            {containerSize.isReady && chartData && (
              <Sample
                width={containerSize.width}
                height={containerSize.height}
                margin={{ top: 0, left: 60, right: 0, bottom: 60 }}
                data={chartData}
              />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};
