import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth';

export const jwtInterceptorInterceptor: HttpInterceptorFn = (req, next) => {

  const authService = inject(AuthService);
  const token = authService.getToken();

  if (token){
    req = req.clone({
      setHeaders : {
        Authorization: `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    //console.log('Cabeceras modificadas con éxito');
  }else{
    console.warn('¡Advertencia! No se adjuntó token JWT. La petición podría retornar 401.');
  }

  return next(req);
};
