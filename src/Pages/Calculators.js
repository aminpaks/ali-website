import React, { useEffect, useState } from 'react';
import $ from 'jquery';
import * as d3 from 'd3';
import { makeStyles, MenuItem, Select, TextField } from '@material-ui/core';
import clsx from 'clsx';
import './calculator-style.scss';
import { Layout, Button } from '../UI';
import { apiRequest } from '../fetch';

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
    maxWidth: '50vw',
    zIndex: 1,
  },
  colRight: {},

  chartContainer: {
    top: 200,
    left: 0,
    width: '100vw',
    height: 'calc(100vh - 200px)',
    position: 'fixed',
  },
});

export const PageCalculators = () => {
  const [state, setState] = useState({
    initialAmount: 1000,
    investDuration: 10,
    cycleType: 'monthly',
    cycleAmount: 500,
  });
  const { initialAmount, investDuration, cycleType, cycleAmount } = state;

  const [isCalculating, setCalculating] = useState(false);

  const handlePartialUpdate = (prop) => ({ target }) =>
    setState((v) => ({ ...v, [prop]: target.value }));
  const handleCalculate = () => {
    console.log(
      'initialAmount',
      initialAmount,
      'investDuration',
      investDuration,
      'cycleType',
      cycleType,
      'cycleAmount',
      cycleAmount
    );

    setCalculating(true);
    apiRequest(
      { url: '/calculators' },
      {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        // mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        // credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/json',
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        // redirect: 'follow', // manual, *follow, error
        // referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify({
          initialAmount,
          duration: investDuration,
          cycleType,
          cycleAmount,
        }), // body data type must match "Content-Type" header
      }
    )
      .then((data) => {
        setCalculating(false);
        console.log('data', data);
        drawChart(data.data);
      })
      .catch((err) => {
        setCalculating(false);
        console.log(err);
        debugger;
      });
  };

  const classes = useStyle();

  return (
    <Layout variant="fill">
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
              disabled={isCalculating}
            >
              Show me results
            </Button>
          </div>
        </div>
      </div>
      <div
        className={clsx(classes.col, classes.colRight, classes.chartContainer)}
      >
        <div className="chart-wrapper">
          <div id="invest-chart" />
        </div>
        <div id="dollar-value-a"></div>
        <div id="dollar-value-b"></div>
      </div>
    </Layout>
  );
};

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
function drawChart(dataInput) {
  if (to) {
    clearTimeout(to);
    to = undefined;
  }
  const { y, width, height } = document
    .querySelector('.chart-wrapper')
    ?.getBoundingClientRect() ?? { y: 0 };
  // const width = window.innerWidth;
  // const height = window.innerHeight - y;

  $('#chart-container').css({ top: y, height });

  let svg;
  const s1 = d3.select('#invest-chart svg');
  if (s1.size() > 0) {
    svg = s1;
  } else {
    svg = d3.select('#invest-chart').append('svg');
  }
  svg.attr('width', width).attr('height', height);

  const { invest, bankInvest, investMinMax, bankInvestMinMax } = dataInput;
  const dataA = invest.slice((invest.length / 2) * -1);
  const dataB = bankInvest.slice((bankInvest.length / 2) * -1);

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
      .attr('fill', '#0063B2')
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

  areaA
    .datum(dataA)
    .transition()
    .duration(500)
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
    .transition()
    .duration(500)
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

  to = setTimeout(() => {
    areaA
      .datum(dataA)
      .transition()
      .duration(500)
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
      .transition()
      .duration(500)
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

    const [lowA, highA] = investMinMax;
    const [lowB, highB] = bankInvestMinMax;

    const valueA = `$${formatMoney(lowA)} - $${formatMoney(highA)}`;
    const valueB = `$${formatMoney(lowB)} - $${formatMoney(highB)}`;

    console.log('A', lowA, highA, scaleY(highA), scaleY(highB));
    console.log('B', lowB.toFixed(2), highB.toFixed(2));

    $('#dollar-value-a')
      .text(valueA)
      .css({ top: scaleY(highA) });
    $('#dollar-value-b')
      .text(valueB)
      .css({ top: scaleY(highB) });
  }, 1000);
}
