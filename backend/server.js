const dotenv = require('dotenv').config();

const express = require('express');
const otpRouter = require("./routes/auth.routes");

const app = express();

app.use(express.json());
app.use('/api/v1', otpRouter);

const PORT = process.env.PORT || 5500;

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));