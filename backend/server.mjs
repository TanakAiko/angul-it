import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';


import captchaRouter from './routes/captcha.js';

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/api', captchaRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
