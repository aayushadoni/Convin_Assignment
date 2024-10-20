const httpStatusCodes = {
    OK: 200,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    REQ_TIMEOUT: 408,
    CONFLICT: 409,
    UNPROCESSABLE: 422,
    FAILED_DEPENDENCY: 424,
    INTERNAL_SERVER: 500,
  };
  
  /**
   * DD_VD_400_101
   * DD  -> App Name
   * VD  -> Error Type
   * 400 -> Status Code
   * 101 -> Custom Number
   */
  const customStatusMessage = {
    INTERNAL_SERVER: 'DD_IE_500_101',
    BAD_REQUEST: 'DD_BR_400_101',
    NOT_FOUND: 'DD_UNF_404_101',
    AUTH_ERROR: 'DD_AE_401_101',
    UNVERIFIED: 'DD_BR_401_102',
    DB_OPERATION_ERR: 'DB Operation Error',
    APP_ERR: 'Application Error',
    VALIDATION_ERR: 'DD_VD_400_101',
  };
  
  export {
    httpStatusCodes,
    customStatusMessage,
  };
  