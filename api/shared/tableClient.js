import { TableClient } from '@azure/data-tables'

const TABLE_NAME = 'KvStore'

function getConnectionString() {
  const conn = process.env.TABLE_STORAGE_CONNECTION_STRING
  if (!conn) throw new Error('Missing TABLE_STORAGE_CONNECTION_STRING')
  return conn
}

export function getTableClient() {
  return TableClient.fromConnectionString(getConnectionString(), TABLE_NAME)
}

export async function ensureTableExists() {
  const client = getTableClient()
  try {
    await client.getEntity('HEALTH', 'ping')
  } catch (e) {
    if (e && e.statusCode === 404) {
      try {
        await client.createEntity({ partitionKey: 'HEALTH', rowKey: 'ping', ts: Date.now() })
      } catch (inner) {
        if (!inner || inner.statusCode !== 409) throw inner
      }
    } else if (e && e.code === 'ResourceNotFound') {
      await client.createEntity({ partitionKey: 'HEALTH', rowKey: 'ping', ts: Date.now() })
    } else {
      throw e
    }
  }
}

export async function getKey(key, defaultValue) {
  const client = getTableClient()
  try {
    const entity = await client.getEntity('KV', key)
    const raw = entity.value
    if (!raw) return defaultValue
    return JSON.parse(raw)
  } catch (e) {
    if (e && e.statusCode === 404) return defaultValue
    console.error('getKey error:', e)
    throw e
  }
}

export async function setKey(key, value) {
  const client = getTableClient()
  const serialized = JSON.stringify(value)
  console.log('setKey:', key, 'serialized length:', serialized.length)
  try {
    await client.updateEntity({ partitionKey: 'KV', rowKey: key, value: serialized }, 'Replace')
  } catch (e) {
    if (e && e.statusCode === 404) {
      console.log('Entity not found, creating new:', key)
      await client.createEntity({ partitionKey: 'KV', rowKey: key, value: serialized })
    } else {
      console.error('setKey error:', e)
      throw e
    }
  }
}
