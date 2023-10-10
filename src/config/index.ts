interface Config {
  apiBaseUrl: string;
  googleClientId: string;
  googleClientSecret: string;
  spaceEndpoint: string;
  spaceAccessKeyId: string;
  spaceSecretAccessKey: string;
  orderAppUrl: string;
  environment: string;
}

export const config: Config = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "",
  googleClientId: process.env.GOOGLE_CLIENT_ID || "",
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  spaceAccessKeyId: process.env.SPACE_ACCESS_KEY_ID || "",
  spaceSecretAccessKey: process.env.SPACE_SECRET_ACCESS_KEY || "",
  spaceEndpoint: process.env.SPACE_ENDPOINT || "",
  orderAppUrl: process.env.NEXT_PUBLIC_ORDER_APP_URL || "",
  environment: process.env.NEXT_PUBLIC_ENVIRONMENT || "",
};

export const getEnv = () => {
  if (config.environment === "production") return null;
  if (config.environment === "development") return "Development";
  if (config.environment === "staging") return "Staging";
};
