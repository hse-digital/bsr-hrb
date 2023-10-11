import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable, Sanitizer } from "@angular/core";
import { SanitizeService } from "./sanitize.service";

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {

  constructor() { }

  private excludedEndpoints: string[] = [
    'api/SendVerificationEmail',
    'api/ValidateApplicationNumber',
    'api/GetApplication'
  ];

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    if (this.excludedEndpoints.indexOf(request.url) > -1)
      return next.handle(request);


    if (request.method == "POST" || request.method == "PUT") {
      request = request.clone({
        body: SanitizeService.sanitize(request.body)
      })
    }

    return next.handle(request);
  }
}
