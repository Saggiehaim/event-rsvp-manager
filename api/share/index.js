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
    const url = `https://${req.headers.host}/?event=${eventId}`

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
    <meta property="og:url" content="${escapeHtml(url)}">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="Event Hub">
    
    <!-- Twitter Card metadata -->
    <meta name="twitter:card" content="${image ? 'summary_large_image' : 'summary'}">
    <meta name="twitter:title" content="${escapeHtml(title)}">
    <meta name="twitter:description" content="${escapeHtml(description)}">
    <meta name="twitter:image" content="${escapeHtml(image)}">
    
    <!-- Redirect users (not crawlers) to the React app -->
    <meta http-equiv="refresh" content="0;url=${escapeHtml(url)}">
    <script>window.location.href = '${escapeHtml(url).replace(/'/g, "\\'")}';</script>
</head>
<body>
    <p>Loading event... <a href="${escapeHtml(url)}">Click here if not redirected</a></p>
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
