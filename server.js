require('dotenv').config();
const express = require('express');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fetch = require('node-fetch');

puppeteer.use(StealthPlugin());
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/proxy-video', async (req, res) => {
  const videoUrl = req.query.url;

  if (!videoUrl) {
    return res.status(400).send('URL manquante');
  }

  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(videoUrl, { waitUntil: 'networkidle0' });

    // Extraire les cookies actuels
    const cookies = await page.cookies();
    const cookieHeader = cookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ');

    // Utiliser fetch pour effectuer la requête vidéo
    const response = await fetch(videoUrl, {
      headers: {
        'Referer': 'https://uqload.cx/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Cookie': cookieHeader
      }
    });

    res.set('Content-Type', response.headers.get('content-type') || 'video/mp4');
    res.set('Accept-Ranges', 'bytes');

    response.body.pipe(res);

    await browser.close();
  } catch (err) {
    console.error('Erreur lors de la récupération de la vidéo:', err);
    res.status(500).send('Erreur interne du serveur');
  }
});

app.listen(port, () => {
  console.log(`Serveur proxy démarré sur http://localhost:${port}`);
});
