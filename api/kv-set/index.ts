import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { ensureTableExists, setKey } from '../shared/tableClient.js'

app.http('kv-set', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'kv/{key}',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    const key = request.params.get('key')
    if (!key) return { status: 400, body: 'Missing key' }
    const body = await request.text()
    let parsed: any
    try { parsed = JSON.parse(body) } catch { return { status: 400, body: 'Invalid JSON' } }
    await ensureTableExists()
    await setKey(key, parsed.value)
    return { status: 204 }
  }
})
