const express = require('express');
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const app = express();

const s3Client = new S3Client({
  region: 'ca-central-1',
  credentials: {accessKeyId: 'Axxxxx',secretAccessKey: 'xxxxxxx'}
});

app.get('/api/foo', (req, res) => {
  s3Client.send(new GetObjectCommand({ Bucket: 'aryan-bucket-789123', Key: 'myfile.json' }))
    .then(result => {
      let data = '';
      result.Body.on('data', chunk => data += chunk);
      result.Body.on('end', () => res.json(JSON.parse(data)));
    })
    .catch(err => res.status(500).send('An error occurred'));
});

app.listen(3000, () => console.log('Server running at http://localhost:3000'));
