const requestController = (controller) => async (req, res, next) => {
    try {
      const { locals: { requestId, language } } = req;
      const { statusCode, displayMessage = undefined, data = undefined } = await controller(req, res, next);
  
      const response = {
        meta: {
          requestId,
        },
        data,
        status: 'Success',
        displayMessage: displayMessage && typeof (displayMessage) === 'object' ? displayMessage[language] : displayMessage,
      };
  
      return res.status(statusCode).json(response);
    } catch (error) {
      return next(error);
    }
  };
  
  export default requestController