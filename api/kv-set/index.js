import { ensureTableExists, setKey } from '../shared/tableClient.js'

export default async function (context, req) {
  try {
    const key = context.bindingData.key
    if (!key) {
      context.res = { status: 400, body: 'Missing key' }
      return
    }
    const body = req.body
    let parsed
    if (typeof body === 'string') {
      try { parsed = JSON.parse(body) } catch (e) { 
        context.log.error('JSON parse error:', e)
        context.res = { status: 400, body: 'Invalid JSON' }
        return
      }
    } else {
      parsed = body
    }
    
    if (!parsed || parsed.value === undefined) {
      context.res = { status: 400, body: 'Missing value property' }
      return
    }
    
    context.log('Setting key:', key, 'with value type:', typeof parsed.value)
    await ensureTableExists()
    await setKey(key, parsed.value)
    context.log('Successfully set key:', key)
    context.res = { status: 204 }
  } catch (error) {
    context.log.error('kv-set error:', error)
    context.res = { status: 500, body: `Error: ${error.message}` }
  }
}
