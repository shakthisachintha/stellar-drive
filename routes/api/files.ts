import { Request, Response, Router, RequestHandler} from "express";
import {auth } from "../../middleware/auth";

const router = Router();

router.get("/", (req, res) => {
  res.send("list of files");
});

interface CreateFileDto {
  title: string;
}

router.post("/", auth as RequestHandler, (req: Request, res: Response) => {
  const { title } = req.body as CreateFileDto;
  res.json(title);
});

export default router;
