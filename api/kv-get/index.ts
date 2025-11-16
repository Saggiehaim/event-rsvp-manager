import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { ensureTableExists, getKey } from '../shared/tableClient.js'

app.http('kv-get', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'kv/{key}',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    const key = request.params.get('key')
    if (!key) return { status: 400, body: 'Missing key' }
    await ensureTableExists()
    const value = await getKey(key, null)
    return {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value })
    }
  }
})
