import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
import serverless from 'serverless-http';

dotenv.config();

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY,
  },
});

app.get('/', (req, res) => {
  res.send('Objetiva representações - API!');
});

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { file } = req;
    const fileName = req.body.fileName;
    const metadata = req.body.metadata ? JSON.parse(req.body.metadata) : {};

    if (!file) {
      return res.status(400).send('No file uploaded');
    }

    const command = new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_BUCKET_NAME,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
      Metadata: metadata,
    });

    await s3Client.send(command);

    const url = `${process.env.CLOUDFLARE_PUBLIC_URL}.r2.dev/${fileName}`;
    res.json({ url });
  } catch (error) {
    console.error('Error uploading to R2:', error);
    res.status(500).send('Error uploading file');
  }
});

// const PORT = process.env.PORT || 3001;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

const handler = serverless(app);

export { handler };