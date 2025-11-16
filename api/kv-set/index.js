import { app } from '@azure/functions'
import { ensureTableExists, setKey } from '../shared/tableClient.js'

app.http('kv-set', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'kv/{key}',
  handler: async (request) => {
    const key = request.params.get('key')
    if (!key) return { status: 400, body: 'Missing key' }
    const body = await request.text()
    let parsed
    try { parsed = JSON.parse(body) } catch { return { status: 400, body: 'Invalid JSON' } }
    await ensureTableExists()
    await setKey(key, parsed.value)
    return { status: 204 }
  }
})
