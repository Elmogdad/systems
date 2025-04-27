import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';


import authRoutes from './routes/authRoutes.js';
import messageRoutes from './routes/messageRoutes.js';


dotenv.config();

const app = express();


app.use(cookieParser())
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
    }
);