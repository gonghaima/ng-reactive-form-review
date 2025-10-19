cd
```
// Get the Accept header from the request
public static getAcceptHeader(request: Request): string | undefined {
  return request.headers['accept'] || undefined;
}

// Get the browser's color depth
public static getColorDepth(request: Request): number | undefined {
  // Assuming colorDepth is sent in a custom header (e.g., 'x-browser-colordepth')
  const colorDepth = request.headers['x-browser-colordepth'] || request.body?.browserData?.colorDepth;
  return colorDepth ? parseInt(colorDepth as string, 10) : 24; // Default to 24 if not provided
}

// Get the browser's screen height
public static getScreenHeight(request: Request): string | undefined {
  // Assuming screenHeight is sent in a custom header (e.g., 'x-browser-screenheight') or body
  return (
    request.headers['x-browser-screenheight'] ||
    request.body?.browserData?.screenHeight ||
    '1200' // Default to '1200' if not provided
  );
}

// Get the browser's screen width
public static getScreenWidth(request: Request): string | undefined {
  // Assuming screenWidth is sent in a custom header (e.g., 'x-browser-screenwidth') or body
  return (
    request.headers['x-browser-screenwidth'] ||
    request.body?.browserData?.screenWidth ||
    '1920' // Default to '1920' if not provided
  );
}

// Get the browser's locale
public static getLocale(request: Request): string | undefined {
  // Use Accept-Language header or body data
  return (
    request.headers['accept-language']?.split(',')[0] ||
    request.body?.locale ||
    'en-US' // Default to 'en-US' if not provided
  );
}

// Get the User-Agent header
public static getUserAgent(request: Request): string | undefined {
  return request.headers['user-agent'] || undefined;
}

// Get the timezone offset in minutes
public static getTimezoneOffsetUtMinutes(request: Request): string | undefined {
  // Assuming timezoneOffset is sent in a custom header (e.g., 'x-browser-timezoneoffset') or body
  return (
    request.headers['x-browser-timezoneoffset'] ||
    request.body?.timezoneOffsetUtMinutes ||
    '420' // Default to '420' if not provided
  );
}
```
