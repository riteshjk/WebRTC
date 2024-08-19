const dotenv = require('dotenv').config();

const express = require('express');
const otpRouter = require("./routes/auth.routes");
const DbConnect = require('./database');

const app = express();

app.use(express.json());
app.use('/api/v1', otpRouter);

const PORT = process.env.PORT || 5500;
DbConnect();
app.get('/', (req, res) => {
    res.send('Hello World');
});



 app.listen(PORT, async() => console.log(`Listening on port ${PORT}`));