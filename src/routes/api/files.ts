import { Router, RequestHandler } from "express";
import multer from 'multer';
import { auth } from "../../middleware/auth";
import AWS from 'aws-sdk';
import { AWS_CONFIG } from "../../configs";
import path from "path";

AWS.config.update({
  credentials: {
    accessKeyId: AWS_CONFIG.AccessCredentials.AccessKeyId,
    secretAccessKey: AWS_CONFIG.AccessCredentials.SecretAccessKey,
  }
})

const s3 = new AWS.S3();
const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

const BUCKET_NAME = 'stellar-drive-bucket';

interface File {
  name: string;
  size: string;
  date: Date;
}

router.get("/", auth as RequestHandler, (req: any, res: any) => {
  const folder_id = req.user.username
  const params = {
    Bucket: BUCKET_NAME,
    Prefix: `${folder_id}/`
  };
  s3.listObjects(params, (err: any, data: any) => {
    if (err) {
      console.error(err);
        res.status(err.statusCode || 500).json({ error: err.message || 'Cannot get files!' });
      return;
    }

    const files = data.Contents;

    let resp_file_array: File[] = [];

    files.forEach((file: any) => {
      const fileName = path.basename(file.Key);
      const fileSize = (Math.round(file.Size / 1000)/100).toString() + ' Mb';
      const fileDate = file.LastModified;
      resp_file_array.push({name: fileName, size: fileSize, date: fileDate})
    })

    res.send({files: resp_file_array});
  });
});

router.post("/file", auth as RequestHandler, (req: any, res: any) => {
  const folder_id = req.user.username;
  const file_name = req.body.fileName;
  const file_key = `${folder_id}/${file_name}`;
  const params = {
    Bucket: BUCKET_NAME,
    Key: file_key,
  };
  s3.getObject(params, (err, data) => {
    if (err) {
      console.error(err);
        res.status(err.statusCode || 500).json({ error: err.message || 'Cannot get file!' });
      return;
    }

    // Set the content type and disposition of the file
    res.set('Content-Type', data.ContentType);
    res.set('Content-Disposition', `attachment; filename=${file_name}`);

    // Send the file in the response
    return res.send(data.Body);
  });
})

router.post("/", auth as RequestHandler, upload.single('file'), (req: any, res: any) => {
  const file = req.file as any;
  const folder_id = req.user.username

  const params = {
    Bucket: BUCKET_NAME,
    Key: `${folder_id}/${file.originalname}`,
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
    res.sendStatus(200);
  });
});



export default router;
