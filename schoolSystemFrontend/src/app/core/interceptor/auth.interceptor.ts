import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const isBrowser = typeof window !== 'undefined';
  const token = isBrowser ? localStorage.getItem('token') : null;

  console.log('Hay token', !!token)

  if(token) {
    const cleanToken = token.replace(/['"]+/g, '');
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${cleanToken}`
      }
    });
    return next(authReq);
  }
  return next(req);
};
