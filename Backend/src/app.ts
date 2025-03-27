import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import userRouter from './routes/user.routes.js'
import profileRouter from './routes/profile.routes.js'
import serverRouter from './routes/server.routes.js'
import memberRouter from './routes/member.routes.js'
import channelRouter from './routes/channel.routes.js'
import conversationRouter from './routes/conversation.routes.js'
import videoRouter from './routes/video.routes.js'
import gptRouter from './routes/gpt.routes.js'
import { createServer } from "http";
import { Server } from "socket.io";

dotenv.config({
    path: './.env'
});
const app: Application = express();

const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    allowedHeaders: ['Authorization', 'Content-Type'],
}));

app.options('*', cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));

// app.use((req, res, next) => {
//     console.log('Incoming request:', {
//         origin: req.headers.origin,
//         headers: req.headers,
//     });
//     next();
// });

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.use("/api/v1/users", userRouter)
app.use("/api/v1/profiles", profileRouter)
app.use("/api/v1/servers", serverRouter)
app.use("/api/v1/members", memberRouter)
app.use("/api/v1/channels", channelRouter)
app.use("/api/v1/conversations", conversationRouter)
app.use("/api/v1/video", videoRouter)
app.use("/api/v1/gpt", gptRouter)

export { app, httpServer };
