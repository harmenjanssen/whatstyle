const colors = [
  'orange',
  'orangered',
  'purple',
  'limegreen',
  'seagreen',
  'olivedrab',
  'lightseagreen',
  'blue',
  'navy',
  'rebeccapurple',
  'gold',
  'hotpink',
  'deeppink'
];
const random = xs => xs[Math.floor(Math.random() * xs.length)];

const randomColor = (colors, refColor = undefined) => {
  const choice = random(colors);
  return choice === refColor ? randomColor(colors, refColor) : choice;
};

const getAngle = ({ x: x1, y: y1 }, { x: x2, y: y2 }) =>
  Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;

const getDistance = ({ x: x1, y: y1 }, { x: x2, y: y2 }) => {
  const xs = x2 - x1;
  const ys = y2 - y1;
  return Math.sqrt(xs * xs + ys * ys);
};

// Set colors for current pageview.
const col1 = randomColor(colors);
const col2 = randomColor(colors, col1);

document.documentElement.style.setProperty('--primary-color', col1);
document.documentElement.style.setProperty('--secondary-color', col2);


// Store references to link positions one time @ page load.
const as = document.querySelectorAll('a');
as.forEach(a => {
  const pos = a.getBoundingClientRect();
  a.refPosition = {
    y: pos.top + window.scrollY + (pos.height / 2),
    x: pos.left + window.scrollX + (pos.width / 2)
  };
});


// Update CSS properties for tuning gradients.
window.addEventListener('mousemove', e => {
  const mouseY = e.clientY + window.scrollY;
  const mouseX = e.clientX + window.scrollX;

  as.forEach(a => {
    const angle = getAngle(a.refPosition, { x: mouseX, y: mouseY }) + -90;
    const distance = getDistance(a.refPosition, { x: mouseX, y: mouseY });
    a.style.setProperty('--gradient-direction', `${angle}deg`);
    a.style.setProperty('--distance',distance);
    a.style.setProperty('--gradient-distance', `${100 - (distance / 400) * 100}%`);
  });
});
