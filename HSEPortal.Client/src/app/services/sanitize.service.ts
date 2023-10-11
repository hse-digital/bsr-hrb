export class SanitizeService {
  static sanitize(body: any): string {
    return `base64:${btoa(encodeURIComponent(JSON.stringify(body)))}`;
  }
}