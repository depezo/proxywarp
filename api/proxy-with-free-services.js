const axios = require('axios');

// Liste de services proxy gratuits qui peuvent être utilisés
const PROXY_SERVICES = [
  {
    name: 'allorigins',
    buildUrl: (targetUrl) => `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`
  },
  {
    name: 'corsproxy',
    buildUrl: (targetUrl) => `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`
  },
  {
    name: 'cors-anywhere',
    buildUrl: (targetUrl) => `https://cors-anywhere.herokuapp.com/${targetUrl}`
  }
];

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const videoUrl = req.query.url;
  const proxyIndex = parseInt(req.query.proxy) || 0;

  if (!videoUrl) {
    return res.status(400).json({ error: 'URL manquante' });
  }

  // Sélectionner le service proxy
  const proxyService = PROXY_SERVICES[proxyIndex % PROXY_SERVICES.length];
  const proxiedUrl = proxyService.buildUrl(videoUrl);

  console.log(`Utilisation du proxy: ${proxyService.name}`);
  console.log(`URL proxifiée: ${proxiedUrl}`);

  try {
    const response = await axios({
      method: 'GET',
      url: proxiedUrl,
      responseType: 'stream',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'video/webm,video/ogg,video/*;q=0.9,application/ogg;q=0.7,audio/*;q=0.6,*/*;q=0.5',
        'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
        'Range': req.headers.range || undefined
      },
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
    console.error(`Erreur avec ${proxyService.name}:`, error.message);
    
    // Si on n'a pas essayé tous les proxies, suggérer d'essayer le suivant
    if (proxyIndex < PROXY_SERVICES.length - 1) {
      return res.status(500).json({ 
        error: 'Erreur avec ce proxy',
        suggestion: `Essayez avec proxy=${proxyIndex + 1}`,
        details: error.message
      });
    }
    
    res.status(500).json({ 
      error: 'Erreur lors de la récupération de la vidéo',
      details: error.message
    });
  }
};
