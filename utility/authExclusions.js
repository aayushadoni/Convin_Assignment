import { pathToRegexp } from 'path-to-regexp';

const authExcludedPaths = [
  '/api/users/register',
  '/api/users/login'
];

// For dynamic routes-
// Add route patterns here to be excluded from auth
// eg-'/v1/testing/:testId/test1/:testId2'

function checkExcludedPaths({ path = false, originalUrl = false }) {
  if (originalUrl) {
    console.log(originalUrl)
    const isPublicRoute = authExcludedPaths.some((pattern) => {
      const keys = [];
      const regexObj = pathToRegexp(pattern, keys);
      const regex = regexObj.regexp;
      return regex.test(originalUrl);
    });
    return isPublicRoute;
  }

  if (path) {
    const isPublicRoute = authExcludedPaths.some((pattern) => {
      const keys = [];
      const regexObj = pathToRegexp(pattern, keys);
      const regex = regexObj.regexp;
      return regex.test(path);
    });
    return isPublicRoute;
  }

  return false;
}

export {
  checkExcludedPaths
};
