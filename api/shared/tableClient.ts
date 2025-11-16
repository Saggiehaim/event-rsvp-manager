import { TableClient, odata } from '@azure/data-tables'

// Expects connection string in env: TABLE_STORAGE_CONNECTION_STRING
// Table name: KvStore (PartitionKey='KV', RowKey=key)

const TABLE_NAME = 'KvStore'

function getConnectionString(): string {
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
  } catch (e: any) {
    if (e.statusCode === 404) {
      // create a dummy entity to force table creation
      await client.createEntity({ partitionKey: 'HEALTH', rowKey: 'ping', ts: Date.now() })
    }
  }
}

export async function getKey<T>(key: string, defaultValue: T): Promise<T> {
  const client = getTableClient()
  try {
    const entity = await client.getEntity('KV', key)
    const raw = (entity as any).value as string
    return JSON.parse(raw) as T
  } catch (e: any) {
    if (e.statusCode === 404) return defaultValue
    throw e
  }
}

export async function setKey<T>(key: string, value: T): Promise<void> {
  const client = getTableClient()
  const serialized = JSON.stringify(value)
  try {
    await client.updateEntity({ partitionKey: 'KV', rowKey: key, value: serialized }, 'Replace')
  } catch (e: any) {
    if (e.statusCode === 404) {
      await client.createEntity({ partitionKey: 'KV', rowKey: key, value: serialized })
    } else {
      throw e
    }
  }
}
