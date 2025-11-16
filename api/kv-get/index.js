import { ensureTableExists, getKey } from '../shared/tableClient.js'

export default async function (context, req) {
  const key = context.bindingData.key
  if (!key) {
    context.res = { status: 400, body: 'Missing key' }
    return
  }
  await ensureTableExists()
  const value = await getKey(key, null)
  context.res = {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key, value })
  }
}
