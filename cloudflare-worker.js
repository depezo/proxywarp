addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  // Enable CORS
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const url = new URL(request.url)
  const videoUrl = url.searchParams.get('url')

  if (!videoUrl) {
    return new Response(JSON.stringify({ error: 'URL manquante' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  try {
    // Headers pour simuler un navigateur réel
    const headers = new Headers({
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
    })

    // Ajouter le header Range si présent
    if (request.headers.get('Range')) {
      headers.set('Range', request.headers.get('Range'))
    }

    // Effectuer la requête
    const response = await fetch(videoUrl, {
      method: 'GET',
      headers: headers,
      redirect: 'follow'
    })

    // Créer les headers de réponse
    const responseHeaders = new Headers(corsHeaders)
    responseHeaders.set('Content-Type', response.headers.get('Content-Type') || 'video/mp4')
    responseHeaders.set('Accept-Ranges', 'bytes')
    responseHeaders.set('Cache-Control', 'public, max-age=3600')

    if (response.headers.get('Content-Length')) {
      responseHeaders.set('Content-Length', response.headers.get('Content-Length'))
    }

    if (response.headers.get('Content-Range')) {
      responseHeaders.set('Content-Range', response.headers.get('Content-Range'))
    }

    return new Response(response.body, {
      status: response.status,
      headers: responseHeaders
    })

  } catch (error) {
    console.error('Erreur:', error)
    return new Response(JSON.stringify({ 
      error: 'Erreur lors de la récupération de la vidéo',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}
