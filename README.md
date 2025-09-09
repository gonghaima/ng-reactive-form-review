get ip
```
import { Request } from 'express';

export function getClientIp(request: Request): string {
  let ip =
    request.ip ||
    (request.headers['x-forwarded-for'] as string) ||
    request.connection?.remoteAddress ||
    request.socket?.remoteAddress ||
    request.connection?.socket?.remoteAddress ||
    'unknown';

  // Handle multiple IPs in x-forwarded-for
  if (ip && ip.includes(',')) {
    ip = ip.split(',')[0].trim();
  }

  return ip;
}
```
