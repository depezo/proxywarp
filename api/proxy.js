const axios = require('axios');
const https = require('https');

// Créer un agent HTTPS personnalisé pour contourner certaines vérifications
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
  secureProtocol: 'TLSv1_2_method'
});

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const videoUrl = req.query.url;

  if (!videoUrl) {
    return res.status(400).json({ error: 'URL manquante' });
  }

  try {
    // Effectuer la requête vidéo avec axios
    const response = await axios({
      method: 'GET',
      url: videoUrl,
      responseType: 'stream',
      headers: {
        'Referer': 'https://uqload.cx/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'video/webm,video/ogg,video/*;q=0.9,application/ogg;q=0.7,audio/*;q=0.6,*/*;q=0.5',
        'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"Windows"',
        'Sec-Fetch-Dest': 'video',
        'Sec-Fetch-Mode': 'no-cors',
        'Sec-Fetch-Site': 'cross-site',
        'Range': req.headers.range || undefined,
        // Transmettre l'IP du client original si disponible
        'X-Forwarded-For': req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        'X-Real-IP': req.headers['x-real-ip'] || req.connection.remoteAddress
      },
      httpsAgent: httpsAgent,
      maxRedirects: 5,
      validateStatus: (status) => status < 500,
      timeout: 30000
    });

    // Transmettre les headers appropriés
    const headers = {
      'Content-Type': response.headers['content-type'] || 'video/mp4',
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'public, max-age=3600'
    };

    if (response.headers['content-length']) {
      headers['Content-Length'] = response.headers['content-length'];
    }

    if (response.headers['content-range']) {
      headers['Content-Range'] = response.headers['content-range'];
    }

    res.writeHead(response.status, headers);
    response.data.pipe(res);

  } catch (error) {
    console.error('Erreur lors de la récupération de la vidéo:', error.message);
    
    // Pour les erreurs de certificat ou de connexion
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      return res.status(503).json({ error: 'Service temporairement indisponible' });
    }
    
    res.status(500).json({ error: 'Erreur lors de la récupération de la vidéo' });
  }
};
