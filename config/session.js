const expressSession = require("express-session");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
// const { PrismaClient } = require("@prisma/client");
const prisma = require("./prisma"); 

const session = expressSession({
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    },
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(
        prisma,
        {
            checkPeriod: 2 * 60 * 1000, // Remove expired sessions every 2 minutes
            dbRecordIdIsSessionId: false,
        }
    )
});

module.exports = session;