import React, { useEffect } from 'react';
import jQuery from 'jquery';
import './calculator-style.scss';

export const Calculator = () => {
  useEffect(() => {
    (function ($, Chart) {
      $(() => {
        $('.mdc-text-field').each(function () {
          console.log(this);
          window.mdc.textField.MDCTextField.attachTo(this);
        });
        $('.mdc-select').each(function () {
          const select = window.mdc.select.MDCSelect.attachTo(this);
          select.listen('MDCSelect:change', () => {
            console.log(`Selected option at index ${select.selectedIndex} with value "${select.value}"`);
          });
        });

        $('.calculate-button').on('click', () => {
          $.ajax('http://edufina.ca/wp-admin/admin-ajax.php', {
            data: {
              action: 'calculators',
              initial: 1000,
              addition: 500,
            },
            crossDomain: false,
            error: (...args) => {
              console.log('fail', args);
            },
            success: (...args) => {
              console.log('success', args);
            },
          });
        });

        window.Chart.defaults.global.elements.point.radius = 0;
        const ch = $('#myChart');

        ch.height(window.outerHeight);

        const ctx = document.getElementById('myChart').getContext('2d');
        const chart = new Chart(ctx, {
          // The type of chart we want to create
          type: 'line',

          // The data for our dataset
          data: {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
              {
                label: 'My First dataset',
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: [0, 10, 20, 30, 100, 120, 150],
              },
              {
                label: 'My First dataset',
                backgroundColor: 'rgb(0, 99, 132)',
                borderColor: 'rgb(0, 99, 132)',
                data: [0, 30, 50, 60],
              },
            ],
          },

          // Configuration options go here
          options: {
            maintainAspectRatio: false,
            legend: {
              display: false,
            },
            gridLines: {
              display: false,
            },
            scales: {
              xAxes: [
                {
                  display: false, //this will remove all the x-axis grid lines
                },
              ],
              yAxes: [
                {
                  display: false, //this will remove all the x-axis grid lines
                },
              ],
            },
          },
        });
      });
    })(jQuery, window.Chart);
  }, []);

  return (
    <div className="calculators">
      <div className="col-left">
        <div className="mdc-layout-grid">
          <div className="mdc-layout-grid__inner">
            <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-6">
              <label className="mdc-text-field mdc-text-field--filled initial-inv">
                <span className="mdc-text-field__ripple"></span>
                <input type="text" className="mdc-text-field__input" aria-labelledby="initial-inv-label" name="initial-inv" />
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
                <input type="text" className="mdc-text-field__input" aria-labelledby="initial-inv-label" name="duration-inv" />
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
                    <svg className="mdc-select__dropdown-icon-graphic" viewBox="7 10 10 5">
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
                  <span className="mdc-floating-label mdc-floating-label--float-above">Investment frequency</span>
                  <span className="mdc-line-ripple"></span>
                </div>

                <div className="mdc-select__menu mdc-menu mdc-menu-surface mdc-menu-surface--fullwidth">
                  <ul className="mdc-list">
                    <li className="mdc-list-item mdc-list-item--selected" data-value="grains">
                      <span className="mdc-list-item__ripple"></span>
                      <span className="mdc-list-item__text">Monthly</span>
                    </li>
                    <li className="mdc-list-item" data-value="vegetables">
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
                <input className="mdc-text-field__input" type="text" placeholder="Amount" aria-label="Label" />
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
      <div className="col-right">
        <div className="chart-wrapper">
          <canvas id="myChart"></canvas>
        </div>
      </div>
    </div>
  );
};
