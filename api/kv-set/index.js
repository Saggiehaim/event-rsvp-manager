import { ensureTableExists, setKey } from '../shared/tableClient.js'

export default async function (context, req) {
  const key = context.bindingData.key
  if (!key) {
    context.res = { status: 400, body: 'Missing key' }
    return
  }
  const body = req.body
  let parsed
  if (typeof body === 'string') {
    try { parsed = JSON.parse(body) } catch { 
      context.res = { status: 400, body: 'Invalid JSON' }
      return
    }
  } else {
    parsed = body
  }
  await ensureTableExists()
  await setKey(key, parsed.value)
  context.res = { status: 204 }
}
