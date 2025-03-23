const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  __internal: {
    engine: {
      enablePreparedStatements: false, 
    },
  },
});

module.exports = prisma; 