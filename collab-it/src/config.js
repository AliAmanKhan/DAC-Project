// API Gateway runs on a separate port (set to 3001 so it doesn't conflict with the front-end dev server)
export const GATEWAY_API_URL = "http://localhost:3001";

// Direct service endpoints (bypass API Gateway)
export const USER_SERVICE_URL = "http://localhost:8080";
export const PITCH_SERVICE_URL = "http://localhost:8081";
export const COLLAB_SERVICE_URL = "http://localhost:8082";
export const AUTH_SERVICE_URL = "http://localhost:3050";

export const AUTH_API_URL = `${AUTH_SERVICE_URL}/auth`; 
