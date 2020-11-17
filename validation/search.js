
const isObjectEmpty = (obj) => {
  return (!obj || typeof obj !== 'object' || (Object.keys(obj).length === 0));
}

const validateSearch = (req, res, next) => {
 
  if(isObjectEmpty(req.query)){
    res.locals.message = "Atleast one search field is required.";
    res.locals.error = true;
    return next();
  }

  const {king, location, type} = req.query;

  if(!king && !location && !type){
    res.locals.message = "king or location or type is required.";
    res.locals.error = true;
    return next();
  }

  const pattern = /^[ A-Za-z0-9_@.+-]*$/;

  if(king && !pattern.test(king)){
    res.locals.message = "Invalid input for king";
    res.locals.error = true;
    return next();
  }

  if(location && !pattern.test(location)){
    res.locals.message = "Invalid input for location";
    res.locals.error = true;
    return next();
  }

  if(type && !pattern.test(type)){
    res.locals.message = "Invalid input for type";
    res.locals.error = true;
    return next();
  }

  res.locals.error = false;
  next();
}

module.exports = {validateSearch};