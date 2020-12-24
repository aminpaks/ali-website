import React, { useState, useRef, useLayoutEffect } from 'react';
import spacetime from 'spacetime';
import {
  InputAdornment,
  makeStyles,
  TextField,
  useMediaQuery,
  SvgIcon,
} from '../../dependencies';
import clsx from 'clsx';
import { Layout, Button, useSize, Section, Header } from '../../UI';
import PieChart from './PaymentPie';
import { AreaChart } from './AreaChart';
import { AttachMoneyIcon } from '../../dependencies';

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
    width: 200,
  },
  inputDownPaymentValue: {
    width: 200,
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

  col: {
    margin: 0,
    width: '100%',
    display: 'block',
    position: 'relative',
  },
  colLeft: {
    zIndex: 1,
  },
  colRight: {
    display: 'block',
    '& > div': {
      height: 0,
      display: 'block',
      position: 'relative',
      paddingBottom: 'min(340px, 120%)',
      '&:not(:last-of-type)': {
        marginBottom: 0,
      },
      '& > div': {
        width: '100%',
        height: '100%',
        position: 'absolute',
        '& svg': {
          display: 'block',
          borderRadius: 30,
          overflow: 'hidden',
        },
      },
    },
    '&.is-not-small': {
      display: 'flex',
      '& > div': {
        flex: '0 1 50%',
        maxWidth: '50%',
        paddingBottom: '32%',
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

  const isTooSmall = useMediaQuery(({ breakpoints }) => breakpoints.down('sm'));

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
  const pieChartContainerRef = useRef();
  const isChartDataAvailable = Boolean(chartData);
  const isPaymentDataAvailable = Boolean(paymentData);
  const containerSize = useSize({ ref: chartContainerRef }, [
    isChartDataAvailable,
  ]);
  const pieContainerSize = useSize({ ref: pieChartContainerRef }, [
    isPaymentDataAvailable,
  ]);

  useLayoutEffect(() => {
    if (isTooSmall && isChartDataAvailable) {
      const { top } =
        chartContainerRef.current?.getBoundingClientRect?.() || {};
      if (top) {
        window.scrollTo({
          top: top - 300,
          left: 0,
          behavior: 'smooth',
        });
      }
    }
  }, [isChartDataAvailable, isTooSmall]);

  return (
    <Layout className={classes.layout}>
      <Section>
        <Header>Mortgage calculator</Header>
        <Section.Part>
          <div className={clsx(classes.col, classes.colLeft)}>
            <div className={classes.lineContainer}>
              <div>
                I want to buy a home valued at{' '}
                <TextField
                  className={clsx(classes.inputs, classes.inputPurchaseValue)}
                  type="number"
                  value={purchaseValue}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AttachMoneyIcon />
                      </InputAdornment>
                    ),
                  }}
                  onChange={handlePartialUpdate('purchaseValue')}
                />
              </div>
              <div>
                with a down payment of{' '}
                <TextField
                  className={clsx(
                    classes.inputs,
                    classes.inputDownPaymentValue
                  )}
                  type="number"
                  value={downPaymentValue}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AttachMoneyIcon />
                      </InputAdornment>
                    ),
                  }}
                  onChange={handlePartialUpdate('downPaymentValue')}
                />
              </div>
              <div>
                with an interest rate of{' '}
                <TextField
                  className={clsx(
                    classes.inputs,
                    classes.inputInterestRateValue
                  )}
                  type="number"
                  value={interestRateValue}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SvgIcon viewBox="-300 -300 1400 1400">
                          <path
                            xmlns="http://www.w3.org/2000/svg"
                            d="M102.9,947.8c-13,0-25.9-5-35.8-14.9c-19.8-19.8-19.8-51.9,0-71.7L861.2,67.1c19.8-19.8,51.9-19.8,71.7,0c19.8,19.8,19.8,51.9,0,71.7L138.8,932.9C128.9,942.8,115.9,947.8,102.9,947.8z M990,753.4c0-130.4-106.1-236.5-236.6-236.5C623,516.9,516.9,623,516.9,753.4S623,990,753.4,990C883.9,990,990,883.9,990,753.4z M888.6,753.4c0,74.5-60.6,135.2-135.2,135.2c-74.5,0-135.2-60.6-135.2-135.2c0-74.5,60.6-135.2,135.2-135.2C828,618.3,888.6,678.9,888.6,753.4z M483.1,246.6C483.1,116.1,377,10,246.6,10C116.1,10,10,116.1,10,246.6C10,377,116.1,483.1,246.6,483.1C377,483.1,483.1,377,483.1,246.6z M381.7,246.6c0,74.5-60.6,135.2-135.2,135.2c-74.5,0-135.2-60.6-135.2-135.2c0-74.5,60.6-135.2,135.2-135.2C321.1,111.4,381.7,172,381.7,246.6z"
                          />
                        </SvgIcon>
                      </InputAdornment>
                    ),
                  }}
                  onChange={handlePartialUpdate('interestRateValue')}
                />{' '}
                for{' '}
                <TextField
                  className={clsx(
                    classes.inputs,
                    classes.inputLoadDurationValue
                  )}
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
                >
                  Estimate
                </Button>
              </div>
            </div>
          </div>
          <div
            className={clsx(classes.colRight, { 'is-not-small': !isTooSmall })}
          >
            {paymentData && (
              <div>
                <div ref={pieChartContainerRef}>
                  {pieContainerSize.isReady && (
                    <PieChart
                      width={pieContainerSize.width}
                      height={pieContainerSize.height - 40}
                      data={paymentData}
                    />
                  )}
                </div>
              </div>
            )}
            {chartData && (
              <div>
                <div ref={chartContainerRef}>
                  {containerSize.isReady && (
                    <AreaChart
                      width={containerSize.width}
                      height={containerSize.height}
                      margin={{ top: 0, left: 60, right: 0, bottom: 60 }}
                      data={chartData}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </Section.Part>
      </Section>
    </Layout>
  );
};
