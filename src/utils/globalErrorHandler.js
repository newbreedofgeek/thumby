exports.log = (err, req, res, next) => {
  // stream trace to server or local log here if needed
  console.error('-------------------------');
  console.error('Exception caught!');

  switch (err.name) {
    case 'FileUploadIssue':
      // stream trace to server or local log
      console.error('= FileUploadIssue, stack follows...');
      console.error(err.stack);
      break;
    case 'InvalidRequest':
      console.error('= InvalidRequest, stack follows...');
      console.error(err.stack);
      break;
    default:
      console.error(`= ${err.name}, no specific logging, move to next handler`);
      next();
      break;
  }

  console.error('-------------------------');
};
