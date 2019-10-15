import React, { useState, useEffect } from 'react';

function getRandomArbitrary(max) {
  return Math.floor(Math.random() * max);
}

const defaultColor = 'black';

const colors = [
  'red',
  'orange',
  'yellow',
  'blue',
  'indigo',
  'violet',
  'green',
];

const initialShapes = [
  { color: defaultColor, id: 'svg_1', vector: 'm54.6,26.7c-0.3,-0.6 -2.5,-1 -3.6,-1s-2.5,0.2 -3.1,0.5c-0.6,0.3 -1,2.5 -1,3.6s0.5,3.4 1,3.6c0.6,0.3 1.9,0.5 3.1,0.5s2.5,-0.2 3.1,-0.5c0.6,-0.3 1,-2.5 1,-3.6s-0.2,-2.5 -0.5,-3.1z' },
  { color: defaultColor, id: 'svg_2', vector: 'm54.6,36.9c-0.3,-0.6 -2.5,-1 -3.6,-1s-2.5,0.2 -3.1,0.5c-0.6,0.3 -1,2.5 -1,3.6s0.5,3.4 1,3.6c0.6,0.3 1.9,0.5 3.1,0.5s2.5,-0.2 3.1,-0.5c0.6,-0.3 1,-2.5 1,-3.6s-0.2,-2.5 -0.5,-3.1z' },
  { color: defaultColor, id: 'svg_3', vector: 'm64.3,36.4c-0.6,-0.3 -1.9,-0.5 -3.1,-0.5s-2.5,0.2 -3.1,0.5c-0.6,0.3 -1,2.5 -1,3.6s0.2,2.5 0.5,3.1s2.5,1 3.6,1s2.5,-0.2 3.1,-0.5c0.6,-0.3 1,-2.5 1,-3.6s-0.4,-3.4 -1,-3.6z' },
  { color: defaultColor, id: 'svg_4', vector: 'm81.7,35.9c-1.1,0 -3.4,0.5 -3.6,1c-0.3,0.6 -0.5,1.9 -0.5,3.1s0.2,2.5 0.5,3.1c0.3,0.6 2.5,1 3.6,1s2.5,-0.2 3.1,-0.5c0.6,-0.3 1,-2.5 1,-3.6s-0.2,-2.5 -0.5,-3.1c-0.2,-0.5 -2.5,-1 -3.6,-1z' },
  { color: defaultColor, id: 'svg_5', vector: 'm84.8,26.1c-0.6,-0.3 -1.9,-0.5 -3.1,-0.5s-2.5,0.2 -3.1,0.5c-0.6,0.3 -1,2.5 -1,3.6s0.2,2.5 0.5,3.1c0.3,0.6 2.5,1 3.6,1s2.5,-0.2 3.1,-0.5c0.6,-0.3 1,-2.5 1,-3.6s-0.5,-3.3 -1,-3.6z' },
  { color: defaultColor, id: 'svg_6', vector: 'm64.9,26.7c-0.3,-0.6 -2.5,-1 -3.6,-1s-2.5,0.2 -3.1,0.5c-0.6,0.3 -1,2.5 -1,3.6s0.5,3.4 1,3.6c0.6,0.3 1.9,0.5 3.1,0.5s2.5,-0.2 3.1,-0.5c0.6,-0.3 1,-2.5 1,-3.6s-0.3,-2.5 -0.5,-3.1z' },
  { color: defaultColor, id: 'svg_7', vector: 'm64.9,16.5c-0.3,-0.6 -2.5,-1 -3.6,-1s-2.5,0.2 -3.1,0.5c-0.6,0.3 -1,2.5 -1,3.6s0.2,2.5 0.5,3.1s2.5,1 3.6,1s3.4,-0.5 3.6,-1s0.5,-1.9 0.5,-3.1s-0.3,-2.6 -0.5,-3.1z' },
  { color: defaultColor, id: 'svg_8', vector: 'm85.3,16.5c-0.3,-0.6 -2.5,-1 -3.6,-1s-3.4,0.5 -3.6,1c-0.3,0.6 -0.5,1.9 -0.5,3.1s0.2,2.5 0.5,3.1c0.3,0.6 2.5,1 3.6,1s2.5,-0.2 3.1,-0.5c0.6,-0.3 1,-2.5 1,-3.6s-0.2,-2.6 -0.5,-3.1z' },
  { color: defaultColor, id: 'svg_9', vector: 'm85.3,6.2c-0.3,-0.6 -2.5,-1 -3.6,-1s-2.5,0.2 -3.1,0.5c-0.6,0.3 -1,2.5 -1,3.6s0.5,3.4 1,3.6s1.9,0.5 3.1,0.5s2.5,-0.2 3.1,-0.5s1,-2.5 1,-3.6s-0.2,-2.5 -0.5,-3.1z' },
  { color: defaultColor, id: 'svg_10', vector: 'm91.9,15.5c-1.1,0 -2.5,0.2 -3.1,0.5c-0.6,0.3 -1,2.5 -1,3.6s0.5,3.4 1,3.6c0.6,0.3 1.9,0.5 3.1,0.5s2.5,-0.2 3.1,-0.5c0.6,-0.3 1,-2.5 1,-3.6s-0.2,-2.5 -0.5,-3.1s-2.5,-1 -3.6,-1z' },
  { color: defaultColor, id: 'svg_11', vector: 'm91.9,25.7c-1.1,0 -3.4,0.5 -3.6,1s-0.5,1.9 -0.5,3.1s0.2,2.5 0.5,3.1s2.5,1 3.6,1s2.5,-0.2 3.1,-0.5c0.6,-0.3 1,-2.5 1,-3.6s-0.2,-2.5 -0.5,-3.1s-2.5,-1 -3.6,-1z' },
  { color: defaultColor, id: 'svg_12', vector: 'm74.5,36.4c-0.6,-0.3 -1.9,-0.5 -3.1,-0.5s-2.5,0.2 -3.1,0.5c-0.6,0.3 -1,2.5 -1,3.6s0.2,2.5 0.5,3.1s2.5,1 3.6,1s2.5,-0.2 3.1,-0.5c0.6,-0.3 1,-2.5 1,-3.6s-0.4,-3.4 -1,-3.6z' },
  { color: defaultColor, id: 'svg_13', vector: 'm74.5,26.1c-0.6,-0.3 -1.9,-0.5 -3.1,-0.5s-2.5,0.2 -3.1,0.5c-0.6,0.3 -1,2.5 -1,3.6s0.2,2.5 0.5,3.1s2.5,1 3.6,1s2.5,-0.2 3.1,-0.5c0.6,-0.3 1,-2.5 1,-3.6s-0.4,-3.3 -1,-3.6z' },
  { color: defaultColor, id: 'svg_14', vector: 'm75.1,16.5c-0.3,-0.6 -2.5,-1 -3.6,-1s-2.5,0.2 -3.1,0.5c-0.6,0.3 -1,2.5 -1,3.6s0.5,3.4 1,3.6c0.6,0.3 1.9,0.5 3.1,0.5s2.5,-0.2 3.1,-0.5c0.6,-0.3 1,-2.5 1,-3.6s-0.3,-2.6 -0.5,-3.1z' },
  { color: defaultColor, id: 'svg_15', vector: 'm75.1,6.2c-0.3,-0.6 -2.5,-1 -3.6,-1s-2.5,0.2 -3.1,0.5c-0.6,0.3 -1,2.5 -1,3.6s0.2,2.5 0.5,3.1s2.5,1 3.6,1s3.4,-0.5 3.6,-1c0.3,-0.6 0.5,-1.9 0.5,-3.1s-0.3,-2.5 -0.5,-3.1z' },
  { color: defaultColor, id: 'svg_16', vector: 'm71.5,46.1c-1.1,0 -3.4,0.5 -3.6,1s-0.5,1.9 -0.5,3.1s0.2,2.5 0.5,3.1s2.5,1 3.6,1s2.5,-0.2 3.1,-0.5c0.6,-0.3 1,-2.5 1,-3.6s-0.2,-2.5 -0.5,-3.1c-0.3,-0.5 -2.5,-1 -3.6,-1z' },
  { color: defaultColor, id: 'svg_17', vector: 'm64.3,64.1c0.6,-0.3 1,-2.5 1,-3.6s-0.2,-2.5 -0.5,-3.1s-2.5,-1 -3.6,-1s-3.4,0.5 -3.6,1s-0.5,1.9 -0.5,3.1s0.2,2.5 0.5,3.1s2.5,1 3.6,1s2.5,-0.3 3.1,-0.5z' },
  { color: defaultColor, id: 'svg_18', vector: 'm51,66.6c-1.1,0 -3.4,0.5 -3.6,1c-0.3,0.6 -0.5,1.9 -0.5,3.1s0.2,2.5 0.5,3.1c0.3,0.6 2.5,1 3.6,1s2.5,-0.2 3.1,-0.5c0.6,-0.3 1,-2.5 1,-3.6s-0.2,-2.5 -0.5,-3.1c-0.2,-0.5 -2.5,-1 -3.6,-1z' },
  { color: defaultColor, id: 'svg_19', vector: 'm64.3,46.6c-0.6,-0.3 -1.9,-0.5 -3.1,-0.5s-2.5,0.2 -3.1,0.5c-0.6,0.3 -1,2.5 -1,3.6s0.2,2.5 0.5,3.1s2.5,1 3.6,1s2.5,-0.2 3.1,-0.5c0.6,-0.3 1,-2.5 1,-3.6s-0.4,-3.4 -1,-3.6z' },
  { color: defaultColor, id: 'svg_20', vector: 'm54.1,46.6c-0.6,-0.3 -1.9,-0.5 -3.1,-0.5s-2.5,0.2 -3.1,0.5c-0.6,0.3 -1,2.5 -1,3.6s0.2,2.5 0.5,3.1c0.3,0.6 2.5,1 3.6,1s2.5,-0.2 3.1,-0.5c0.6,-0.3 1,-2.5 1,-3.6s-0.5,-3.4 -1,-3.6z' },
  { color: defaultColor, id: 'svg_21', vector: 'm54.1,56.8c-0.6,-0.3 -1.9,-0.5 -3.1,-0.5s-2.5,0.2 -3.1,0.5s-1,2.5 -1,3.6s0.2,2.5 0.5,3.1c0.3,0.6 2.5,1 3.6,1s2.5,-0.2 3.1,-0.5c0.6,-0.3 1,-2.5 1,-3.6s-0.5,-3.3 -1,-3.6z' },
  { color: defaultColor, id: 'svg_22', vector: 'm37.1,43.1c0.3,0.6 2.5,1 3.6,1s3.4,-0.5 3.6,-1s0.5,-1.9 0.5,-3.1s-0.2,-2.5 -0.5,-3.1s-2.5,-1 -3.6,-1s-2.5,0.2 -3.1,0.5c-0.6,0.3 -1,2.5 -1,3.6s0.3,2.5 0.5,3.1z' },
  { color: defaultColor, id: 'svg_23', vector: 'm16.7,43.1c0.3,0.6 2.5,1 3.6,1s2.5,-0.2 3.1,-0.5c0.6,-0.3 1,-2.5 1,-3.6s-0.5,-3.4 -1,-3.6c-0.6,-0.3 -1.9,-0.5 -3.1,-0.5s-2.5,0.2 -3.1,0.5c-0.6,0.3 -1,2.5 -1,3.6s0.2,2.5 0.5,3.1z' },
  { color: defaultColor, id: 'svg_24', vector: 'm16.7,32.8c0.3,0.6 2.5,1 3.6,1s3.4,-0.5 3.6,-1c0.3,-0.6 0.5,-1.9 0.5,-3.1s-0.2,-2.5 -0.5,-3.1c-0.3,-0.6 -2.5,-1 -3.6,-1s-2.5,0.2 -3.1,0.5c-0.6,0.3 -1,2.5 -1,3.6s0.2,2.6 0.5,3.1z' },
  { color: defaultColor, id: 'svg_25', vector: 'm37.1,32.8c0.3,0.6 2.5,1 3.6,1s2.5,-0.2 3.1,-0.5c0.6,-0.3 1,-2.5 1,-3.6s-0.2,-2.5 -0.5,-3.1s-2.5,-1 -3.6,-1s-3.4,0.5 -3.6,1s-0.5,1.9 -0.5,3.1s0.3,2.6 0.5,3.1z' },
  { color: defaultColor, id: 'svg_26', vector: 'm36.7,19.5c0,1.1 0.5,3.4 1,3.6c0.6,0.3 1.9,0.5 3.1,0.5s2.5,-0.2 3.1,-0.5c0.6,-0.3 1,-2.5 1,-3.6s-0.2,-2.5 -0.5,-3.1s-2.5,-1 -3.6,-1s-2.5,0.2 -3.1,0.5c-0.6,0.3 -1,2.5 -1,3.6z' },
  { color: defaultColor, id: 'svg_27', vector: 'm17.2,23.2c0.6,0.3 1.9,0.5 3.1,0.5s2.5,-0.2 3.1,-0.5c0.6,-0.3 1,-2.5 1,-3.6s-0.2,-2.6 -0.4,-3.1c-0.3,-0.6 -2.5,-1 -3.6,-1s-2.5,0.2 -3.1,0.5c-0.6,0.3 -1,2.5 -1,3.6s0.4,3.3 0.9,3.6z' },
  { color: defaultColor, id: 'svg_28', vector: 'm16.2,9.3c0,1.1 0.2,2.5 0.5,3.1c0.3,0.6 2.5,1 3.6,1s3.4,-0.5 3.6,-1c0.3,-0.6 0.5,-1.9 0.5,-3.1s-0.2,-2.5 -0.5,-3.1c-0.3,-0.6 -2.5,-1 -3.6,-1s-2.5,0.2 -3.1,0.5c-0.5,0.2 -1,2.5 -1,3.6z' },
  { color: defaultColor, id: 'svg_29', vector: 'm6,19.5c0,1.1 0.2,2.5 0.5,3.1s2.5,1 3.6,1s3.4,-0.5 3.6,-1s0.5,-1.9 0.5,-3.1s-0.2,-2.5 -0.5,-3s-2.5,-1 -3.6,-1s-2.5,0.2 -3.1,0.4c-0.5,0.3 -1,2.5 -1,3.6z' },
  { color: defaultColor, id: 'svg_30', vector: 'm10.1,33.9c1.1,0 2.5,-0.2 3.1,-0.5c0.6,-0.3 1,-2.5 1,-3.6s-0.5,-3.4 -1,-3.6c-0.6,-0.3 -1.9,-0.5 -3.1,-0.5s-2.5,0.2 -3.1,0.4c-0.6,0.3 -1,2.5 -1,3.6s0.2,2.5 0.5,3.1s2.5,1.1 3.6,1.1z' },
  { color: defaultColor, id: 'svg_31', vector: 'm34.2,36.9c-0.3,-0.6 -2.5,-1 -3.6,-1s-2.5,0.2 -3.1,0.5c-0.6,0.3 -1,2.5 -1,3.6s0.2,2.5 0.5,3.1c0.3,0.6 2.5,1 3.6,1s3.4,-0.5 3.6,-1s0.5,-1.9 0.5,-3.1s-0.3,-2.5 -0.5,-3.1z' },
  { color: defaultColor, id: 'svg_32', vector: 'm34.2,26.7c-0.3,-0.6 -2.5,-1 -3.6,-1s-2.5,0.2 -3.1,0.5c-0.6,0.3 -1,2.5 -1,3.6s0.2,2.5 0.5,3.1c0.3,0.6 2.5,1 3.6,1s3.4,-0.5 3.6,-1s0.5,-1.9 0.5,-3.1s-0.3,-2.5 -0.5,-3.1z' },
  { color: defaultColor, id: 'svg_33', vector: 'm34.2,16.5c-0.3,-0.6 -2.5,-1 -3.6,-1s-3.4,0.5 -3.6,1c-0.3,0.6 -0.5,1.9 -0.5,3.1s0.2,2.5 0.5,3.1c0.3,0.6 2.5,1 3.6,1s2.5,-0.2 3.1,-0.5c0.6,-0.3 1,-2.5 1,-3.6s-0.3,-2.6 -0.5,-3.1z' },
  { color: defaultColor, id: 'svg_34', vector: 'm34.2,6.2c-0.3,-0.6 -2.5,-1 -3.6,-1s-2.5,0.2 -3.1,0.5c-0.6,0.3 -1,2.5 -1,3.6s0.5,3.4 1,3.6s1.9,0.5 3.1,0.5s2.5,-0.2 3.1,-0.5s1,-2.5 1,-3.6s-0.3,-2.5 -0.5,-3.1z' },
  { color: defaultColor, id: 'svg_35', vector: 'm33.6,46.6c-0.6,-0.3 -1.9,-0.5 -3.1,-0.5s-2.5,0.2 -3.1,0.5c-0.6,0.3 -1,2.5 -1,3.6s0.2,2.5 0.5,3.1c0.3,0.6 2.5,1 3.6,1s2.5,-0.2 3.1,-0.5c0.6,-0.3 1,-2.5 1,-3.6s-0.4,-3.4 -1,-3.6z' },
  { color: defaultColor, id: 'svg_36', vector: 'm37.1,63.5c0.3,0.6 2.5,1 3.6,1s2.5,-0.2 3.1,-0.5c0.6,-0.3 1,-2.5 1,-3.6s-0.5,-3.4 -1,-3.6s-1.9,-0.5 -3.1,-0.5s-2.5,0.2 -3.1,0.5s-1,2.5 -1,3.6s0.3,2.6 0.5,3.1z' },
  { color: defaultColor, id: 'svg_37', vector: 'm37.1,53.3c0.3,0.6 2.5,1 3.6,1s3.4,-0.5 3.6,-1s0.5,-1.9 0.5,-3.1s-0.2,-2.5 -0.5,-3.1s-2.5,-1 -3.6,-1s-2.5,0.2 -3.1,0.5c-0.6,0.3 -1,2.5 -1,3.6s0.3,2.5 0.5,3.1z' },
];

function Logo(props) {
  const {
    color: colorProp,
    width,
    height,
    randomColor,
    className,
  } = props;

  const [shapes, setShapes] = useState(initialShapes);

  useEffect(() => {
    let timer;
    if (!!colorProp === false && randomColor) {
      timer = setTimeout(() => {
        const updatedShapes = shapes.map((shape) => {
          const colorIndex = getRandomArbitrary(colors.length);
          return { ...shape, color: colors[colorIndex] };
        });
        setShapes(updatedShapes);
      }, 150);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [colorProp, randomColor, shapes]);

  return (
    <div style={{ width: width || '100%', height: height || '100%' }} className={className}>
      <svg
        viewBox="0 0 102 80"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g>
          <title>background</title>
          <rect
            fill="none"
            id="canvas_background"
            width="104"
            height="82"
            y="-1"
            x="-1"
          />
        </g>
        <g>
          { shapes.map((shape) => {
            const { id, vector, color } = shape;
            return (
              <path
                key={id}
                id={id}
                fill={colorProp || color}
                d={vector}
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
}

export default Logo;
