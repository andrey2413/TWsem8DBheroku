export var databaseConfigProps = {
  port: 3306,
  host: "localhost",
  user: "root",
  password: "test1234",
  database: "seminar_instance",
  connectTimeout: 120 * 1000,
  rowsAsArray: false,
  multipleStatements: true,
};

export var sequelizeConfigProps = {
  host: "localhost",
  dialect: "mariadb",
  dialectOptions: {
    options: {
      enableArithAbort: true,
      trustedConnection: true,
    },
  },
};
