const executeIdly = (f) =>
  typeof requestIdleCallback === "function"
    ? requestIdleCallback(f)
    : setTimeout(f);

// Calculate the angle between two points.
const getAngle = ({ x: x1, y: y1 }, { x: x2, y: y2 }) =>
  (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;

// Convert degrees to radians.
const deg2rad = (deg) => deg * (Math.PI / 180);

// Calculate the distance between two points.
const getDistance = ({ x: x1, y: y1 }, { x: x2, y: y2 }) => {
  const xs = x2 - x1;
  const ys = y2 - y1;
  return Math.sqrt(xs * xs + ys * ys);
};

// Clamp a number between min and max.
const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

function main() {
  executeIdly(() => {
    if (typeof document.documentElement.style.setProperty !== "function") {
      return;
    }

    // Grab the default values of these variables.
    const rootStyle = window.getComputedStyle(document.documentElement);
    const gradientMinSize = parseInt(
      rootStyle.getPropertyValue("--gradient-min-size"),
    );
    const gradientMaxSize = parseInt(
      rootStyle.getPropertyValue("--gradient-max-size"),
    );

    // Store references to link positions one time @ page load.
    const as = document.querySelectorAll("a");
    as.forEach((a) => {
      const pos = a.getBoundingClientRect();
      a.refPosition = {
        y: pos.top + window.scrollY + pos.height / 2,
        x: pos.left + window.scrollX + pos.width / 2,
        width: pos.width,
      };
    });

    // Update CSS properties for tuning gradients.
    window.addEventListener("mousemove", (e) => {
      const mouseY = e.clientY + window.scrollY;
      const mouseX = e.clientX + window.scrollX;

      as.forEach((a) => {
        const angle = getAngle(a.refPosition, { x: mouseX, y: mouseY });
        const distance = getDistance(a.refPosition, { x: mouseX, y: mouseY });
        a.style.setProperty(
          "--gradient-position-y",
          `${distance * Math.sin(deg2rad(angle)) + a.refPosition.width / 2}px`,
        );
        a.style.setProperty(
          "--gradient-position-x",
          `${distance * Math.cos(deg2rad(angle)) + a.refPosition.width / 2}px`,
        );
        const newGradientSize = clamp(
          Math.abs(distance - 100),
          gradientMinSize,
          gradientMaxSize,
        );
        a.style.setProperty(
          "--gradient-size",
          distance > 100 ? `${gradientMinSize}%` : `${newGradientSize}%`,
        );
      });
    });
  });
}

main();
