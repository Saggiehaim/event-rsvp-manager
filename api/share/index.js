import { getTableClient } from '../shared/tableClient.js'

export default async function (context, req) {
  try {
    const eventId = context.bindingData.id
    
    if (!eventId) {
      context.res = { status: 400, body: 'Missing event id' }
      return
    }

    // Fetch event from Table Storage
    const client = getTableClient()
    let event
    try {
      const entity = await client.getEntity('EVENT', eventId)
      event = JSON.parse(entity.eventData)
    } catch (err) {
      context.log.error('Event not found:', eventId, err)
      context.res = { 
        status: 404, 
        headers: { 'Content-Type': 'text/html' },
        body: `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0;url=/"></head><body>Event not found. Redirecting...</body></html>`
      }
      return
    }

    // Build complete meta tags for crawlers
    const title = event.name || 'Event'
    const description = event.description || 'Join us for this event.'
    const image = event.posterUrl || ''
    // Canonical event page URL uses query param only; relative avoids wrong host issues
    const eventPageUrl = `/?event=${eventId}`
    const absoluteEventUrl = `https://${req.headers.host}${eventPageUrl}`

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(title)} – Event Hub</title>
    
    <!-- Open Graph metadata -->
    <meta property="og:title" content="${escapeHtml(title)}">
    <meta property="og:description" content="${escapeHtml(description)}">
    <meta property="og:image" content="${escapeHtml(image)}">
    <meta property="og:url" content="${escapeHtml(absoluteEventUrl)}">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="Event Hub">
    
    <!-- Twitter Card metadata -->
    <meta name="twitter:card" content="${image ? 'summary_large_image' : 'summary'}">
    <meta name="twitter:title" content="${escapeHtml(title)}">
    <meta name="twitter:description" content="${escapeHtml(description)}">
    <meta name="twitter:image" content="${escapeHtml(image)}">
    
    <link rel="canonical" href="${escapeHtml(absoluteEventUrl)}" />
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        color: #1d1d1f;
      }
      .container {
        max-width: 500px;
        width: 100%;
        background: rgba(255, 255, 255, 0.98);
        backdrop-filter: blur(20px);
        border-radius: 24px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        overflow: hidden;
        animation: slideUp 0.6s ease-out;
      }
      @keyframes slideUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .poster {
        width: 100%;
        aspect-ratio: 3/4;
        object-fit: cover;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }
      .poster-placeholder {
        width: 100%;
        aspect-ratio: 3/4;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        font-size: 80px;
        font-weight: 700;
      }
      .content {
        padding: 32px;
      }
      h1 {
        font-size: 32px;
        font-weight: 700;
        line-height: 1.2;
        margin-bottom: 16px;
        color: #1d1d1f;
        letter-spacing: -0.5px;
      }
      p {
        font-size: 17px;
        line-height: 1.5;
        color: #6e6e73;
        margin-bottom: 32px;
      }
      .cta-button {
        display: block;
        width: 100%;
        background: #667eea;
        color: white;
        border: none;
        border-radius: 12px;
        padding: 16px 24px;
        font-size: 17px;
        font-weight: 600;
        text-align: center;
        text-decoration: none;
        cursor: pointer;
        transition: all 0.2s ease;
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
      }
      .cta-button:hover {
        background: #5568d3;
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
      }
      .cta-button:active {
        transform: translateY(0);
      }
      @media (max-width: 640px) {
        .container { border-radius: 16px; }
        .content { padding: 24px; }
        h1 { font-size: 28px; }
        p { font-size: 16px; }
      }
    </style>
</head>
<body>
    <div class="container">
      ${image 
        ? \`<img src='\${escapeHtml(image)}' alt='\${escapeHtml(title)}' class='poster'/>\`
        : \`<div class='poster-placeholder'>\${escapeHtml(title.charAt(0).toUpperCase())}</div>\`
      }
      <div class="content">
        <h1>${escapeHtml(title)}</h1>
        <p>${escapeHtml(description)}</p>
        <a href="${escapeHtml(eventPageUrl)}" class="cta-button">View Event Details</a>
      </div>
    </div>
</body>
</html>`

    context.res = {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
      body: html
    }
  } catch (error) {
    context.log.error('share-event error:', error)
    context.res = { status: 500, body: `Error: ${error.message}` }
  }
}

function escapeHtml(text) {
  if (!text) return ''
  return text
    .toString()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
