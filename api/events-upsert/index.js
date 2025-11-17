import { getTableClient } from '../shared/tableClient.js'

export default async function (context, req) {
  try {
    const body = req.body
    
    if (!body || !body.id) {
      context.res = { status: 400, body: 'Missing event id' }
      return
    }
    
    context.log('Upserting event:', body.id)
    const client = getTableClient()
    
    // Store each event as separate entity: PartitionKey='EVENT', RowKey=eventId
    // posterUrl should be a blob URL, not base64 data
    const entity = {
      partitionKey: 'EVENT',
      rowKey: body.id,
      eventData: JSON.stringify(body)
    }
    
    await client.upsertEntity(entity, 'Replace')
    context.log('Event upserted successfully:', body.id)
    
    context.res = { status: 204 }
  } catch (error) {
    context.log.error('events-upsert error:', error)
    context.res = { status: 500, body: `Error: ${error.message}` }
  }
}
