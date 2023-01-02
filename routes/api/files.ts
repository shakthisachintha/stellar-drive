import { Request, Response, Router, RequestHandler} from "express";
import multer from 'multer';
import {auth } from "../../middleware/auth";
import AWS from 'aws-sdk';
import { AWS_CONFIG } from "../../configs";

AWS.config.update({
  credentials: {
    accessKeyId: AWS_CONFIG.AccessCredentials.AccessKeyId,
    secretAccessKey: AWS_CONFIG.AccessCredentials.SecretAccessKey,
  }
})

const s3 = new AWS.S3();

const router = Router();
const upload = multer({storage: multer.memoryStorage()});

router.get("/", auth as RequestHandler, (req, res) => {
  //@todo list all files user has uploaded
  /*
 get the file name and etag from the database by matching the username
  */
  res.send("list of files");
});

router.get("/:id", auth as RequestHandler, (req, res) => {
  //@todo get a file by id and send it to the user
  
})

router.post("/", auth as RequestHandler,upload.single('file'), (req: Request, res: Response) => {
 // @todo upload file to s3
 // @todo save the file name and etag to the database with username
 // @todo send the file name and etag to the user
 // use AWS RDS to store the file name and etag
  const file = req.file as any;
 console.log(file)
 const params = {
    Bucket: 'stellar-drive-bucket',
    Key: file.originalname,
    Body: file.buffer,
    ContentType: file.mimetype
 };

 s3.upload(params, (err: any, data: any) => {
  if (err) {
    console.error(err);
    res.sendStatus(500);
    return;
  }

  console.log(`File uploaded to S3: ${data.Location}`);
  console.log(data)
  res.sendStatus(200);

  //@todo save the file name and etag to the database with username
});
  
});



export default router;
