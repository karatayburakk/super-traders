export const dbConfig = {
  dialect: "postgres",
  host: process.env.POSTGRESQL_HOST || "localhost",
  database: "super-traders",
  username: "postgres",
  password: "postgres",
  logging: false,
  port: 5432,
};
