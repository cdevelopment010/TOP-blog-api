const express = require("express");
// const session = require("express-session");
const session = require("./config/session");
const passport = require("./config/passport");
const prisma = require("./prisma/queries"); 

const cors = require("cors");
const app = express(); 
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: '*', // Allow all origins
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
}));


const indexRouter = require("./routes/index");
const postRouter = require("./routes/post");
const userRouter = require("./routes/user");
const authRouter = require("./routes/auth");
const tagRouter = require("./routes/tag"); 

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(session);   
app.use(passport.session());

app.use("/", indexRouter);
app.use("/post", postRouter);
app.use("/user", userRouter);
app.use("/auth", authRouter); 
app.use("/tag", tagRouter);

// Gracefully close Prisma on process termination
process.on('SIGINT', async () => {
    console.log('SIGINT received: Closing Prisma client');
    await prisma.$disconnect();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('SIGTERM received: Closing Prisma client');
    await prisma.$disconnect();
    process.exit(0);
});


  

app.listen(PORT, () => {console.log(`App listening on port ${PORT}`)});