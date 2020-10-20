import React, { useEffect } from 'react';
import clsx from 'clsx';
import './calculator-style.scss';
import { data } from './sampleData';
import { Layout } from '../UI';
import { makeStyles } from '@material-ui/core';

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
  colRight: {
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    position: 'fixed',
  },
});

export const PageCalculators = () => {
  const classes = useStyle();

  useEffect(() => {
    (function ($, d3) {
      $(() => {
        let additionType = 'monthly';
        $('.mdc-text-field').each(function () {
          window.mdc.textField.MDCTextField.attachTo(this);
        });
        $('.mdc-select').each(function () {
          const select = window.mdc.select.MDCSelect.attachTo(this);
          select.listen('MDCSelect:change', () => {
            additionType = select.value;
          });
        });

        function formatMoney(
          amount,
          decimalCount = 2,
          decimal = '.',
          thousands = ','
        ) {
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
        const drawChart = (dataInput) => {
          if (to) {
            clearTimeout(to);
            to = undefined;
          }
          const { y } = document
            .querySelector('.entry-content')
            ?.getBoundingClientRect() ?? { y: 0 };
          const width = window.innerWidth;
          const height = window.innerHeight - y;

          $('#chart-container').css({ top: y, height });

          let svg;
          const s1 = d3.select('#invest-chart svg');
          if (s1.size() > 0) {
            svg = s1;
          } else {
            svg = d3.select('#invest-chart').append('svg');
          }
          svg.attr('width', width).attr('height', height);

          const {
            invest,
            bankInvest,
            investMinMax,
            bankInvestMinMax,
          } = dataInput;
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
        };

        $('.calculate-button').on('click', () => {
          const initialValue = $('#initial-inv').val();
          const additionValue = $('#invest-addition').val();
          const term = $('#term-inv').val();

          $.ajax('http://edufina.ca/wp-admin/admin-ajax.php', {
            type: 'POST',
            data: {
              action: 'calculators',
              initial: initialValue,
              addition: additionValue,
              term: term,
              additionType: additionType,
            },
            crossDomain: true,
            error: (...args) => {
              console.log('fail', args);
            },
            success: (d) => {
              drawChart(d.data);
            },
          });
        });
      });
    })(window.jQuery, window.d3);
  }, []);

  return (
    <Layout variant="fill">
      <div className={clsx(classes.col, classes.colLeft)}>
        <div className="mdc-layout-grid">
          <div className="mdc-layout-grid__inner">
            <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-6">
              <label className="mdc-text-field mdc-text-field--filled initial-inv">
                <span className="mdc-text-field__ripple"></span>
                <input
                  type="text"
                  className="mdc-text-field__input"
                  aria-labelledby="initial-inv-label"
                  name="initial-inv"
                  id="initial-inv"
                />
                <span className="mdc-floating-label" id="initial-inv-label">
                  Initial investment amount
                </span>
                <span className="mdc-line-ripple"></span>
              </label>
            </div>
            <div className="mdc-layout-grid__cell"></div>
          </div>
          <div className="mdc-layout-grid__inner">
            <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-6">
              <label className="mdc-text-field mdc-text-field--filled initial-inv">
                <span className="mdc-text-field__ripple"></span>
                <input
                  type="text"
                  className="mdc-text-field__input"
                  aria-labelledby="initial-inv-label"
                  name="term-inv"
                  id="term-inv"
                />
                <span className="mdc-floating-label" id="initial-inv-label">
                  Investment duration (years)
                </span>
                <span className="mdc-line-ripple"></span>
              </label>
            </div>
            <div className="mdc-layout-grid__cell"></div>
          </div>
          <div className="mdc-layout-grid__inner">
            <div className="mdc-layout-grid__cell mdc-layout-grid__cell--align-right mdc-layout-grid__cell--span-6">
              {/* SELECT */}
              <div className="mdc-select mdc-select--filled mdc-select--required mdc-select--fullwidth">
                <div className="mdc-select__anchor">
                  <span className="mdc-select__selected-text"></span>
                  <span className="mdc-select__ripple"></span>
                  <span className="mdc-select__dropdown-icon">
                    <svg
                      className="mdc-select__dropdown-icon-graphic"
                      viewBox="7 10 10 5"
                    >
                      <polygon
                        className="mdc-select__dropdown-icon-inactive"
                        stroke="none"
                        fill-rule="evenodd"
                        points="7 10 12 15 17 10"
                      ></polygon>
                      <polygon
                        className="mdc-select__dropdown-icon-active"
                        stroke="none"
                        fill-rule="evenodd"
                        points="7 15 12 10 17 15"
                      ></polygon>
                    </svg>
                  </span>
                  <span className="mdc-floating-label mdc-floating-label--float-above">
                    Investment frequency
                  </span>
                  <span className="mdc-line-ripple"></span>
                </div>

                <div className="mdc-select__menu mdc-menu mdc-menu-surface mdc-menu-surface--fullwidth">
                  <ul className="mdc-list">
                    <li
                      className="mdc-list-item mdc-list-item--selected"
                      data-value="monthly"
                    >
                      <span className="mdc-list-item__ripple"></span>
                      <span className="mdc-list-item__text">Monthly</span>
                    </li>
                    <li className="mdc-list-item" data-value="biweekly">
                      <span className="mdc-list-item__ripple"></span>
                      <span className="mdc-list-item__text">Bi-weekly</span>
                    </li>
                  </ul>
                </div>
              </div>
              {/* SELECT */}
            </div>
            <div className="mdc-layout-grid__cell mdc-layout-grid__cell--align-left mdc-layout-grid__cell--span-6">
              <label className="mdc-text-field mdc-text-field--filled mdc-text-field--no-label">
                <span className="mdc-text-field__ripple"></span>
                <input
                  className="mdc-text-field__input"
                  type="text"
                  placeholder="Amount"
                  aria-label="Label"
                  id="invest-addition"
                />
                <span className="mdc-line-ripple"></span>
              </label>
            </div>
          </div>
          <div className="mdc-layout-grid__inner">
            <div className="mdc-layout-grid__cell mdc-layout-grid__cell--align-right mdc-layout-grid__cell--span-6">
              {/* BUTTON */}
              <button class="mdc-button mdc-button--raised calculate-button">
                <div class="mdc-button__ripple"></div>
                <span class="mdc-button__label">Calculate</span>
              </button>
              {/* BUTTON */}
            </div>
          </div>
        </div>
      </div>
      <div id="chart-container" className={clsx(classes.col, classes.colRight)}>
        <div className="chart-wrapper">
          <div id="invest-chart" />
        </div>
        <div id="dollar-value-a"></div>
        <div id="dollar-value-b"></div>
      </div>
    </Layout>
  );
};
