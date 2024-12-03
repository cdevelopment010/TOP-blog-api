const express = require("express")
const app = express(); 
const PORT = process.env.PORT || 3000;

const indexRouter = require("./routes/index");
const postRouter = require("./routes/post");
const userRouter = require("./routes/user");

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/", indexRouter);
app.use("/post", postRouter);
app.use("/user", userRouter);

app.listen(PORT, () => {console.log(`App listening on port ${PORT}`)});