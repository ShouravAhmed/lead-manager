import colors from 'colors';

const logger = (req, res, next) => {
  const methodColor = {
      GET: "green",
      POST: "blue",
      PUT: "yellow",
      DELETE: "red",
      default: "white"
  }
  const color = methodColor[req.method] || methodColor.default;
  console.log(`${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`[color]);
  next();
}

export default logger;