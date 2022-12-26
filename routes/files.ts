import { Router } from "express";

const router = Router();

router.get('/', (req, res) => {
    res.send("list of files");
});

interface CreateFileDto{
    title: string;
}

router.post('/', (req, res) => {
    const {title} = req.body as CreateFileDto; 
    res.json(title);
})

export default router;
