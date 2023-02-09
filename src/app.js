import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routers from './routers/index.routers.js';

dotenv.config();

const server = express();

server.use(cors());
server.use(express.json());
server.use(routers);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log('Server running on port', PORT));
