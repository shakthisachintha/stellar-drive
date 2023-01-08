import express from "express";
import cors from "cors";
import fileRoutes from './routes/api/files';
import authRoutes from './routes/api/auth';
import { APP_CONFIG } from "./configs";

const app = express();

app.use(express.json());
app.use(cors())

// create a welcome route
app.get("/", (req, res) => {
    res.send("API is working! v3");
});

app.use('/api/files', fileRoutes);
app.use('/api/auth', authRoutes)

app.listen(APP_CONFIG.port, () => console.log(`Server started at ${APP_CONFIG.port} port`));