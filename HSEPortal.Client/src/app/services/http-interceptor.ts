import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor
} from '@angular/common/http';

export class Sanitizer {
  static sanitize(body: any): string {
    return `base64:${btoa(encodeURIComponent(JSON.stringify(body)))}`;
  }

  static sanitizeField(value: string): string {
    return value.replaceAll("'", "&39");
  }
}

const excludedEndpoints = [
  'api/SendVerificationEmail',
  'api/ValidateApplicationNumber',
  'api/GetApplication'
];

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {

  constructor() { }

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    if (excludedEndpoints.indexOf(request.url) < 0 && (request.method == "POST" || request.method == "PUT")) {
      request = request.clone({
        body: Sanitizer.sanitize(request.body)
      })
    }

    return next.handle(request);
  }
}
