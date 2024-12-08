const express = require("express");
const session = require("express-session");
const passport = require("./config/passport");
const app = express(); 
const PORT = process.env.PORT || 3000;


const indexRouter = require("./routes/index");
const postRouter = require("./routes/post");
const userRouter = require("./routes/user");

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(session({
    secret: process.env.SESSION_SECRET || "SessionSecret",
    resave:false,
    saveUninitialized: false
}));   
app.use(passport.session());

app.use("/", indexRouter);
app.use("/post", postRouter);
app.use("/user", userRouter);

app.listen(PORT, () => {console.log(`App listening on port ${PORT}`)});