import { useRef, useState } from 'react';
import {
  AttachMoneyIcon,
  clsx,
  InputAdornment,
  LoopIcon,
  makeStyles,
  MenuItem,
  Select,
  TextField,
  useMutation,
} from '../../dependencies';
import {
  Button,
  Header,
  Layout,
  Section,
  usePhoneMediaQuery,
  useSize,
} from '../../UI';
import { apiRequest } from '../../fetch';
import {
  getPartialUpdate,
  getUserSessionId,
  setUserSessionId,
} from '../../Utils';
import { InvestChart } from './InvestChart';

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
      width: '2rem',
      height: '2rem',
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
    '& .chart-wrapper': {
      height: '100%',
      width: '100%',
      position: 'relative',
    },
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
}));

export const PageInvestCalculator = () => {
  const classes = useStyle();
  const isIPhone = usePhoneMediaQuery();

  const chartContainerRef = useRef();
  const chartContainerSize = useSize({ ref: chartContainerRef });

  const [state, setState] = useState({
    initialAmount: 1000,
    investDuration: 10,
    cycleType: 'monthly',
    cycleAmount: 500,
  });
  const { initialAmount, investDuration, cycleType, cycleAmount } = state;

  const { mutate: queryInvest, isLoading, data } = useMutation(
    doQueryInvestment,
    {
      retry: false,
      onSuccess: () => {
        if (isIPhone) {
          const { top } =
            chartContainerRef.current?.getBoundingClientRect?.() || {};
          if (top) {
            window.scrollTo({
              top,
              left: 0,
              behavior: 'smooth',
            });
          }
        }
      },
    }
  );

  const handleCalculate = () => {
    queryInvest(state);
  };

  return (
    <Layout variant="fill" footer="hidden">
      <Section>
        <Header>Investment</Header>
        <Section.Part>
          <div className={clsx(classes.col, classes.colLeft)}>
            <div className={classes.lineContainer}>
              <div>
                I want to invest an initial amount of{' '}
                <TextField
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AttachMoneyIcon />
                      </InputAdornment>
                    ),
                  }}
                  className={clsx(classes.inputs, classes.inputInitialAmount)}
                  type="number"
                  value={initialAmount}
                  onChange={getPartialUpdate(setState, 'initialAmount')}
                />
              </div>
              <div>
                for{' '}
                <TextField
                  className={clsx(classes.inputs, classes.inputDuration)}
                  type="number"
                  value={investDuration}
                  onChange={getPartialUpdate(setState, 'investDuration')}
                />{' '}
                years
              </div>
              <div>
                with{' '}
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={cycleType}
                  onChange={getPartialUpdate(setState, 'cycleType')}
                >
                  <MenuItem value="monthly">monthly</MenuItem>
                  <MenuItem value="biweekly">biweekly</MenuItem>
                </Select>{' '}
                investments of{' '}
                <TextField
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AttachMoneyIcon />
                      </InputAdornment>
                    ),
                  }}
                  className={clsx(classes.inputs, classes.inputInvestAmount)}
                  type="number"
                  value={cycleAmount}
                  onChange={getPartialUpdate(setState, 'cycleAmount')}
                />
              </div>
              <div>
                <Button
                  className={classes.buttonCalculate}
                  onClick={handleCalculate}
                  disabled={isLoading}
                  endIcon={isLoading && <LoopIcon />}
                >
                  Calculate
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
            <div ref={chartContainerRef} className="chart-wrapper">
              {chartContainerSize.isReady && (
                <InvestChart
                  data={data}
                  width={chartContainerSize.width}
                  height={chartContainerSize.height}
                />
              )}
              <div id="invest-chart" />
            </div>
          </div>
        </Section.Part>
      </Section>
    </Layout>
  );
};

function doQueryInvestment({
  initialAmount,
  investDuration,
  cycleType,
  cycleAmount,
}) {
  return apiRequest(
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
  ).then(({ data }) => {
    if (data.sessionId) {
      setUserSessionId(data.sessionId);
    }
    return data;
  });
}
