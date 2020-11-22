import React, { useState, useMemo } from 'react';
import { makeStyles } from '@material-ui/core';
import Pie from '@visx/shape/lib/shapes/Pie';
import { scaleOrdinal } from '@visx/scale';
import { Group } from '@visx/group';
import { animated, useTransition, interpolate } from 'react-spring';

const useChartStyle = makeStyles({
  root: {
    '& text': {
      userSelect: 'none',
    },
  },
});
// accessor functions
const getPortion = (d) => d.portion;

// color scales
const defaultMargin = { top: 20, right: 20, bottom: 20, left: 20 };

export default function Example({
  data,
  width,
  height,
  margin = defaultMargin,
  animate = true,
}) {
  const { values } = data;
  const paymentAmount = useMemo(
    () => values.map((v) => v.amount).reduce((acc, v) => acc + v, 0),
    [data]
  );
  const classes = useChartStyle();
  const getBrowserColor = useMemo(
    () =>
      scaleOrdinal({
        domain: values.map((v) => v.label),
        range: [
          'rgba(0,20,255,0.2)',
          'rgba(0,20,255,0.1)',
          'rgba(0,20,255,0.5)',
        ],
      }),
    [data]
  );

  if (width < 10) return null;

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const radius = Math.min(innerWidth, innerHeight) / 2;
  const centerY = innerHeight / 2;
  const centerX = innerWidth / 2;
  const donutThickness = 50;

  return (
    <svg className={classes.root} width={width} height={height}>
      <Group top={centerY + margin.top} left={centerX + margin.left}>
        <Pie
          data={values}
          pieValue={getPortion}
          outerRadius={radius}
          innerRadius={radius - donutThickness}
          cornerRadius={3}
          padAngle={0.005}
        >
          {(pie) => (
            <AnimatedPie
              {...pie}
              animate={animate}
              getKey={(arc) => arc.data.label}
              getColor={(arc) => getBrowserColor(arc.data.label)}
            />
          )}
        </Pie>
        <text
          textAnchor="middle"
          fontSize={46}
          fontWeight={400}
          pointerEvents="none"
        >
          <tspan fontSize={18} dy="-20" dx="-2">
            $
          </tspan>
          <tspan dy="10" dx="8">
            {paymentAmount.toFixed(0)}
          </tspan>
        </text>
        <text
          textAnchor="middle"
          transform="translate(0, 40)"
          fontSize={18}
          pointerEvents="none"
        >
          Monthly payment
        </text>
      </Group>
    </svg>
  );
}

const fromLeaveTransition = ({ endAngle }) => ({
  // enter from 360° if end angle is > 180°
  startAngle: endAngle > Math.PI ? 2 * Math.PI : 0,
  endAngle: endAngle > Math.PI ? 2 * Math.PI : 0,
  opacity: 0,
});
const enterUpdateTransition = ({ startAngle, endAngle }) => ({
  startAngle,
  endAngle,
  opacity: 1,
});

function AnimatedPie({ animate, arcs, path, getKey, getColor }) {
  const transitions = useTransition(
    arcs,
    getKey,
    // @ts-ignore react-spring doesn't like this overload
    {
      from: animate ? fromLeaveTransition : enterUpdateTransition,
      enter: enterUpdateTransition,
      update: enterUpdateTransition,
      leave: animate ? fromLeaveTransition : enterUpdateTransition,
    }
  );
  return (
    <>
      {transitions.map(({ item: arc, props, key }) => {
        const [centroidX, centroidY] = path.centroid(arc);
        const hasSpaceForLabel = arc.endAngle - arc.startAngle >= 0.1;

        return (
          <g key={key}>
            <animated.path
              // compute interpolated path d attribute from intermediate angle values
              d={interpolate(
                [props.startAngle, props.endAngle],
                (startAngle, endAngle) =>
                  path({
                    ...arc,
                    startAngle,
                    endAngle,
                  })
              )}
              fill={getColor(arc)}
            />
            {hasSpaceForLabel && (
              <animated.g style={{ opacity: props.opacity }}>
                <text
                  fill="black"
                  x={centroidX}
                  y={centroidY}
                  dy=".33em"
                  textAnchor="middle"
                  pointerEvents="none"
                >
                  {getKey(arc)}
                </text>
              </animated.g>
            )}
          </g>
        );
      })}
    </>
  );
}
