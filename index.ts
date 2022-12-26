import express from "express";
import fileRoutes from './routes/files';
const app = express();

app.use(express.json());

// create a welcome route
app.get("/", (req, res) => {
    res.send("API is working!");
});

app.use('/files', fileRoutes);

app.listen(3001, () => console.log("server started at 3001 port"));
