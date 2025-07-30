const sql = require('mssql/msnodesqlv8');

const dbConfig = {
  database: process.env.DB_NAME || 'mini_blog',
  server: process.env.DB_SERVER || 'localhost',
  driver: 'msnodesqlv8',
  options: {
    trustedConnection: true,
    trustServerCertificate: true,
    enableArithAbort: true,
  },
};

module.exports = {
  connect: () => sql.connect(dbConfig),
  sql,
};
