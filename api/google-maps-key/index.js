import { app } from '@azure/functions'

app.http('google-maps-key', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'google-maps-key',
  handler: async () => {
    const key = process.env.GOOGLE_MAPS_API_KEY || ''
    return {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hasKey: !!key, key })
    }
  }
})
