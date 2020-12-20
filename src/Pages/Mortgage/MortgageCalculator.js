import React, { useState, useRef } from 'react';
import spacetime from 'spacetime';
import { makeStyles, TextField, useMediaQuery } from '@material-ui/core';
import clsx from 'clsx';
import { Layout, Button, useSize, Section, Header } from '../../UI';
import PieChart from './PaymentPie';
import { AreaChart } from './AreaChart';
import './../calculator-style.scss';

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
    display: ({ isSmallScreen }) => (isSmallScreen === true ? 'block' : 'flex'),
    marginBottom: '10rem',
    // alignContent: 'space-between',
    '& > div': {
      height: 0,
      display: 'block',
      flex: ({ isSmallScreen }) =>
        console.log('check', isSmallScreen) ||
        (isSmallScreen ? undefined : '0 1 50%'),
      maxWidth: ({ isSmallScreen }) => (isSmallScreen ? 'auto' : '50%'),
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

  const isSmallScreen = useMediaQuery('(max-width: 1024px)');
  const classes = useStyle({ isSmallScreen });
  const chartContainerRef = useRef();
  const pieChartContainerRef = useRef();
  const containerSize = useSize({ ref: chartContainerRef });
  const pieContainerSize = useSize({ ref: pieChartContainerRef });

  return (
    <Layout variant="fill" className={classes.layout}>
      <Section>
        <Header>Mortgage calculator</Header>
        <Section.Part>
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
                  className={clsx(
                    classes.inputs,
                    classes.inputDownPaymentValue
                  )}
                  type="number"
                  value={downPaymentValue}
                  onChange={handlePartialUpdate('downPaymentValue')}
                />
              </div>
              <div>
                with an interest rate of %{' '}
                <TextField
                  className={clsx(
                    classes.inputs,
                    classes.inputInterestRateValue
                  )}
                  type="number"
                  value={interestRateValue}
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
                  size="large"
                >
                  Estimate
                </Button>
              </div>
            </div>
          </div>
          <div className={classes.colRight}>
            <div>
              <div ref={pieChartContainerRef}>
                {pieContainerSize.isReady && paymentData && (
                  <PieChart
                    width={pieContainerSize.width}
                    height={pieContainerSize.height}
                    data={paymentData}
                  />
                )}
              </div>
            </div>
            <div>
              <div ref={chartContainerRef}>
                {containerSize.isReady && chartData && (
                  <AreaChart
                    width={containerSize.width}
                    height={containerSize.height}
                    margin={{ top: 0, left: 60, right: 0, bottom: 60 }}
                    data={chartData}
                  />
                )}
              </div>
            </div>
          </div>
        </Section.Part>
      </Section>
    </Layout>
  );
};
