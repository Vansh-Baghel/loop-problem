module.exports = (fn) => {
  // Here return is used because we want to stop the middleware from executing after this. Otherwise it would continue
  //  to go to other middlewares.
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};