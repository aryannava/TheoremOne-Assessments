const express = require('express');
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const app = express();
const port = 3000;

const s3Client = new S3Client({
  region: 'ca-central-1',
  credentials: {
    accessKeyId: 'AXXXXXX',
    secretAccessKey: 'AXXXXXX'
  }
});

app.get('/api/foo', async (req, res) => {
  const params = {
    Bucket: 'aryan-bucket-789123',
    Key: 'myfile.json'
  };

  try {
    const result = await s3Client.send(new GetObjectCommand(params));
    let data = '';

    result.Body.on('data', (chunk) => {
      data += chunk;
    });

    result.Body.on('end', () => {
      res.json(JSON.parse(data));
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
