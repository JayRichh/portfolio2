import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import verifyHumanRouter from './routes/verify-human';
import sendEmailRouter from './routes/send-email';
import githubRouter from './routes/github';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use('/api/verify-human', verifyHumanRouter);
app.use('/api/send-email', sendEmailRouter);
app.use('/api/github', githubRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
