const express = require('express');
const https = require('https');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/check-tls/:domain', (req, res) => {
  const domain = req.params.domain;
  
  const options = {
    host: domain,
    port: 443,
    method: 'HEAD',
    rejectUnauthorized: false // Allow self-signed certificates
  };

  const request = https.request(options, (response) => {
    const cert = response.socket.getPeerCertificate();
    
    res.json({
      protocols: [`TLS ${response.socket.getProtocol()}`],
      cipher: response.socket.getCipher(),
      certInfo: {
        subject: cert.subject.CN || domain,
        issuer: cert.issuer.CN || 'Unknown',
        validFrom: cert.valid_from,
        validTo: cert.valid_to,
        signatureAlgorithm: cert.signatureAlgorithm
      }
    });
  });

  request.on('error', (error) => {
    res.status(500).json({ error: error.message });
  });

  request.end();
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
