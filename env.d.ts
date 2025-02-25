declare namespace NodeJS {
  export interface ProcessEnv {
    MYSQL_DATABASE: string;
    MYSQL_USER: string;
    MYSQL_ROOT_PASSWORD: string;
    MYSQL_HOST: string;
    PORT: number;
    TOKEN_SECRET: string;
    REDIS_HOST: string
  }
}
