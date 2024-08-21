const dotenv = require('dotenv').config();

const express = require('express');
const otpRouter = require("./routes/auth.routes");
const DbConnect = require('./database');
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');

app.use(cookieParser());
const corsOption = {
    credentials: true,
    origin: ['http://localhost:3000'],
};
app.use(cors(corsOption));

// to show the image properly when we have routes like /storage so show the image which is stored in it we use this
app.use('/storage', express.static('storage'));
app.use(express.json({limit: '10mb'}));
app.use('/api/v1', otpRouter);

const PORT = process.env.PORT || 5500;
DbConnect();
app.get('/', (req, res) => {
    res.send('Hello World');
});



 app.listen(PORT, async() => console.log(`Listening on port ${PORT}`));