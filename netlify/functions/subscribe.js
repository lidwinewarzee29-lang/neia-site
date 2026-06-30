const https = require('https');

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { email } = JSON.parse(event.body);

    const data = JSON.stringify({
      email: email,
      listIds: [3],
      updateEnabled: true
    });

    return new Promise((resolve) => {
      const options = {
        hostname: 'api.brevo.com',
        path: '/v3/contacts',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': process.env.BREVO_API_KEY,
          'Content-Length': Buffer.byteLength(data)
        }
      };

      const req = https.request(options, (res) => {
        if (res.statusCode === 201 || res.statusCode === 204) {
          resolve({ statusCode: 200, body: JSON.stringify({ success: true }) });
        } else {
          resolve({ statusCode: 400, body: JSON.stringify({ error: 'Erreur Brevo' }) });
        }
      });

      req.on('error', (e) => {
        resolve({ statusCode: 500, body: JSON.stringify({ error: e.message }) });
      });

      req.write(data);
      req.end();
    });

  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
