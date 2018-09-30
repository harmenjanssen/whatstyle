const executeIdly = f => typeof requestIdleCallback === 'function'
  ? requestIdleCallback(f)
  : setTimeout(f);

executeIdly(() => {
if (typeof document.documentElement.style.setProperty !== 'function') {
  return;
}

/**
 * "How did he come up with this crazy stuff?"
 * - Unknown spectator viewing source at whatstyle.net
 *
 */
const COLORS = [
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
const col1 = randomColor(COLORS);
const col2 = randomColor(COLORS, col1);

document.documentElement.style.setProperty('--primary-color', col1);
document.documentElement.style.setProperty('--secondary-color', col2);

console.log(
  'Hi! The following colors have been chosen at random for your visit:'
);
console.log(`%c - ${col1}`, `color: ${col1}`);
console.log(`%c - ${col2}`, `color: ${col2}`);


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


// Color favicon
const canvas = document.createElement('canvas');
const canvasSize = 16;
canvas.style.width = `${canvasSize}px`;
canvas.setAttribute('width', canvasSize);
canvas.setAttribute('height', canvasSize);
const ctx = canvas.getContext('2d', {alpha: false});
ctx.fillStyle = col1;
ctx.strokeStyle = '#fff';
ctx.font = 'lighter 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"';
ctx.textAlign = 'center';

ctx.fillRect(0, 0, canvasSize, canvasSize);
ctx.fillStyle = '#fff';
ctx.fillText('W', canvasSize/2, 13); // A magic number 🌟
ctx.save();

document.querySelector('link[href="/favicon.ico"]').href = canvas.toDataURL("image/x-icon");

// Update footer text
const footer = document.querySelector('.main-footer');
footer.innerHTML = `Colors generated randomly for no reason.<br>${footer.innerHTML}`;

});
