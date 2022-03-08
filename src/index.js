require('dotenv').config();
const express = require('express');
require('./db/mangoose');
const userRouter = require('./routers/users');
const taskRouter = require('./routers/tasks');
//console.log(process.env);
const app = express();

const port = process.env.PORT;



app.use(express.json())
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {

    console.log("server is listening on port: " + port);
})






//hashing algo using crypto module