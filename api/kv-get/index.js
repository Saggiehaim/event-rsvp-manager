import { ensureTableExists, getKey } from '../shared/tableClient.js'

export default async function (context, req) {
  try {
    const key = context.bindingData.key
    if (!key) {
      context.res = { status: 400, body: 'Missing key' }
      return
    }
    context.log('Getting key:', key)
    await ensureTableExists()
    const value = await getKey(key, null)
    context.log('Retrieved value for key:', key, 'type:', typeof value)
    context.res = {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value })
    }
  } catch (error) {
    context.log.error('kv-get error:', error)
    context.res = { status: 500, body: `Error: ${error.message}` }
  }
}
