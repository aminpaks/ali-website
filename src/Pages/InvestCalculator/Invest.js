import React, { useCallback, useState } from 'react';
import clsx from 'clsx';
import $ from 'jquery';
import * as d3 from 'd3';
import { makeStyles, MenuItem, Select, TextField } from '@material-ui/core';
import LoopIcon from '@material-ui/icons/Loop';
import './calculator-style.scss';
import { Layout, Button, Section, Header, useWindowResize } from '../../UI';
import { apiRequest } from '../../fetch';
import { getUserSessionId, noop, setUserSessionId } from '../../Utils';
import { Counter } from './countUp';

const useStyle = makeStyles(({ breakpoints }) => ({
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
  inputInitialAmount: {
    width: 140,
  },
  inputDuration: {
    width: 120,
    '& input': {
      textAlign: 'right',
    },
  },
  inputInvestAmount: {
    width: 110,
  },

  '@keyframes rotate': {
    '0%': {
      transform: 'rotate(0deg)',
    },
    '100%': {
      transform: 'rotate(-360deg)',
    },
  },
  buttonCalculate: {
    fontSize: '1.8rem',
    '& svg': {
      animation: '$rotate 1000ms',
      animationIterationCount: 'infinite',
    },
  },

  col: {
    margin: 0,
    width: '100%',
    display: 'block',
    position: 'relative',
  },
  colLeft: {
    [breakpoints.up('md')]: {
      maxWidth: '60vw',
      zIndex: 1,
    },
  },
  colRight: {},

  chartContainer: {
    [breakpoints.down('md')]: {
      width: '100%',
      height: 600,
      position: 'relative',
    },
    [breakpoints.up('md')]: {
      top: 200,
      left: 0,
      width: '100vw',
      height: 'calc(100vh - 200px)',
      position: 'fixed',
    },
  },

  investValueLabel: {
    top: '100vh',
    right: 0,
    fontSize: '1.5rem',
    marginTop: '-2rem',
    lineHeight: '2rem',
    position: 'absolute',
    minWidth: '36vw',
    transition: '500ms ease',
    '&.count-in': {
      transition: '1s',
    },
    borderBottom: '2px dotted #000',
    textShadow: '0 0 4px #fff',
    pointerEvents: 'none',
    '& span': {
      display: 'block',
      '&:nth-of-type(2)': {
        position: 'absolute',
        fontSize: '1rem',
      },
    },
  },
  investValueBank: {
    borderBottomColor: '#c91f17',
  },
  investValueEduFina: {
    borderBottomColor: '#0063b2',
  },
}));

const InvestValueInitial = {
  isLoading: false,
  investValueEduFina: 0,
  investValueBank: 0,
  topEduFina: undefined,
  topBank: undefined,
  date: null,
  error: null,
};

export const PageInvestCalculator = () => {
  const classes = useStyle();

  const [state, setState] = useState({
    initialAmount: 1000,
    investDuration: 10,
    cycleType: 'monthly',
    cycleAmount: 500,
  });
  const { initialAmount, investDuration, cycleType, cycleAmount } = state;

  const [investValueState, setInvestValueState] = useState(InvestValueInitial);

  const handlePartialUpdate = useCallback(
    (prop) => ({ target }) => setState((v) => ({ ...v, [prop]: target.value })),
    []
  );
  const handleCalculate = () => {
    setInvestValueState((s) => ({ ...s, isLoading: true }));
    apiRequest(
      { url: '/calculators' },
      {
        method: 'POST',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          initialAmount,
          duration: investDuration,
          cycleType,
          cycleAmount,
          sessionId: getUserSessionId(),
        }),
      }
    )
      .then(({ data }) => {
        if (data.sessionId) {
          setUserSessionId(data.sessionId);
        }
        drawChart(
          data,
          (investValueEduFina, topEduFina, investValueBank, topBank) => {
            setInvestValueState(() => ({
              isLoading: false,
              data,
              topBank,
              topEduFina,
              investValueBank,
              investValueEduFina,
            }));
          }
        );
      })
      .catch((error) => {
        setInvestValueState({ ...InvestValueInitial, error });
      });
  };

  useWindowResize(() => {
    if (investValueState.isLoading === false && investValueState.data != null) {
      drawChart(
        investValueState.data,
        (_, topEduFina, __, topBank) => {
          setInvestValueState((s) => ({
            ...s,
            topBank,
            topEduFina,
          }));
        },
        true
      );
    }
  });

  return (
    <Layout variant="fill">
      <Section>
        <Header>Investment</Header>
        <Section.Part>
          <div className={clsx(classes.col, classes.colLeft)}>
            <div className={classes.lineContainer}>
              <div>
                I want to invest an initial amount of ${' '}
                <TextField
                  className={clsx(classes.inputs, classes.inputInitialAmount)}
                  type="number"
                  value={initialAmount}
                  onChange={handlePartialUpdate('initialAmount')}
                />
              </div>
              <div>
                for{' '}
                <TextField
                  className={clsx(classes.inputs, classes.inputDuration)}
                  type="number"
                  value={investDuration}
                  onChange={handlePartialUpdate('investDuration')}
                />{' '}
                years
              </div>
              <div>
                with{' '}
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={cycleType}
                  onChange={handlePartialUpdate('cycleType')}
                >
                  <MenuItem value="monthly">monthly</MenuItem>
                  <MenuItem value="biweekly">biweekly</MenuItem>
                </Select>{' '}
                investments of ${' '}
                <TextField
                  className={clsx(classes.inputs, classes.inputInvestAmount)}
                  type="number"
                  value={cycleAmount}
                  onChange={handlePartialUpdate('cycleAmount')}
                />
              </div>
              <div>
                <Button
                  className={classes.buttonCalculate}
                  onClick={handleCalculate}
                  disabled={investValueState.isLoading}
                  startIcon={investValueState.isLoading && <LoopIcon />}
                >
                  Show me results
                </Button>
              </div>
            </div>
          </div>
        </Section.Part>
        <Section.Part>
          <div
            className={clsx(
              classes.col,
              classes.colRight,
              classes.chartContainer
            )}
          >
            <div className="chart-wrapper">
              <div id="invest-chart" />
            </div>
            {typeof investValueState.topEduFina === 'number' && (
              <div
                style={{ top: investValueState.topEduFina }}
                className={clsx(
                  classes.investValueLabel,
                  classes.investValueEduFina,
                  { 'count-in': investValueState.investValueEduFina > 0 }
                )}
              >
                <Counter
                  value={investValueState.investValueEduFina ?? 0}
                  onDisplayValue={displayMoney}
                />
                <span>EduFina</span>
              </div>
            )}
            {typeof investValueState.topBank === 'number' && (
              <div
                style={{ top: investValueState.topBank }}
                className={clsx(
                  classes.investValueLabel,
                  classes.investValueBank,
                  { 'count-in': investValueState.investValueEduFina > 0 }
                )}
              >
                <Counter
                  value={investValueState.investValueBank ?? 0}
                  onDisplayValue={displayMoney}
                />
                <span>Traditional Bank</span>
              </div>
            )}
          </div>
        </Section.Part>
      </Section>
    </Layout>
  );
};

function displayMoney(count) {
  return '$' + formatMoney(count);
}
function formatMoney(amount, decimalCount = 2, decimal = '.', thousands = ',') {
  try {
    decimalCount = Math.abs(decimalCount);
    decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

    const negativeSign = amount < 0 ? '-' : '';

    let i = parseInt(
      (amount = Math.abs(Number(amount) || 0).toFixed(decimalCount))
    ).toString();
    let j = i.length > 3 ? i.length % 3 : 0;

    return (
      negativeSign +
      (j ? i.substr(0, j) + thousands : '') +
      i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousands) +
      (decimalCount
        ? decimal +
          Math.abs(amount - i)
            .toFixed(decimalCount)
            .slice(2)
        : '')
    );
  } catch (e) {
    console.log(e);
  }
}

let to = undefined;
function drawChart(dataInput, callback = noop, immediate = false) {
  if (to) {
    clearTimeout(to);
    to = undefined;
  }
  const { y, width, height } = document
    .querySelector('.chart-wrapper')
    ?.getBoundingClientRect() ?? { y: 0 };

  $('#chart-container').css({ top: y, height });

  let svg;
  const s1 = d3.select('#invest-chart svg');
  if (s1.size() > 0) {
    svg = s1;
  } else {
    svg = d3.select('#invest-chart').append('svg');
  }
  svg.attr('width', width).attr('height', height);

  const { edufinaInvest: dataA, bankInvest: dataB } = dataInput;

  // X Scale
  const scaleX = d3
    .scaleLinear()
    .domain([0, dataA.length - 1])
    .range([0, width]);

  // Y Scale
  const scaleY = d3
    .scaleLinear()
    .domain([dataA[0], d3.max(dataA)])
    .range([height, 0]);
  const scaleY2 = d3
    .scaleLinear()
    .domain([dataB[0], d3.max(dataA)])
    .range([height, 0]);

  // Add the area
  let areaA;
  const arA = d3.select('#invest-area');
  if (arA.size() > 0) {
    areaA = arA;
  } else {
    areaA = svg
      .append('path')
      .attr('id', 'invest-area')
      .attr('fill', '#0063b2')
      .attr('stroke', '#003f72')
      .attr('stroke-width', 2);
  }

  let areaB;
  const arB = d3.select('#invest-bank-area');
  if (arB.size() > 0) {
    areaB = arB;
  } else {
    areaB = svg
      .append('path')
      .attr('id', 'invest-bank-area')
      .attr('fill', '#c91f17')
      .attr('stroke', '#a01812')
      .attr('stroke-width', 1.5);
  }

  const _transOut = d3.transition().ease(d3.easeQuadOut).duration(500);

  areaA
    .datum(dataA)
    .transition(_transOut)
    .attr(
      'd',
      d3
        .area()
        .x(function (d, i) {
          return scaleX(i);
        })
        .y0(scaleY(dataA[0]))
        .y1(scaleY(dataA[0]))
    );
  areaB
    .datum(dataB)
    .transition(_transOut)
    .attr(
      'd',
      d3
        .area()
        .x(function (d, i) {
          return scaleX(i);
        })
        .y0(scaleY2(dataB[0]))
        .y1(scaleY2(dataB[0]))
    );

  if (immediate !== true) {
    callback(0, height, 0, height);
  }

  to = setTimeout(
    () => {
      const _trans = d3.transition().ease(d3.easeCubicOut).duration(1000);

      areaA
        .datum(dataA)
        .transition(_trans)
        .attr(
          'd',
          d3
            .area()
            .x(function (d, i) {
              return scaleX(i);
            })
            .y0(scaleY(dataA[0]))
            .y1(function (d) {
              return scaleY(d);
            })
        );

      areaB
        .datum(dataB)
        .transition(_trans)
        .attr(
          'd',
          d3
            .area()
            .x(function (d, i) {
              return scaleX(i);
            })
            .y0(scaleY2(0))
            .y1(function (d) {
              return scaleY2(d);
            })
        );

      const highA = dataA[dataA.length - 1];
      const highB = dataB[dataB.length - 1];

      // console.log('A', highA, highB, scaleY(highA), scaleY(highB));
      // console.log('B', highA.toFixed(2), highB.toFixed(2));

      callback(highA, scaleY(highA), highB, scaleY(highB));
    },
    immediate === true ? 0 : 1000
  );
}
