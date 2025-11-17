import { getTableClient } from '../shared/tableClient.js'

export default async function (context, req) {
  try {
    const client = getTableClient()
    
    // Handle DELETE request
    if (req.method === 'DELETE') {
      const eventId = context.bindingData.id
      
      if (!eventId) {
        context.res = { status: 400, body: 'Missing event id' }
        return
      }
      
      context.log('Deleting event:', eventId)
      await client.deleteEntity('EVENT', eventId)
      context.log('Event deleted successfully:', eventId)
      
      context.res = { status: 200, body: { message: 'Event deleted successfully' } }
      return
    }
    
    // Handle POST/PUT (upsert)
    const body = req.body || {}
    const eventId = context.bindingData.id || body.id

    if (!eventId) {
      context.res = { status: 400, body: 'Missing event id' }
      return
    }

    if (!body.id) body.id = eventId

    context.log('Upserting event:', eventId)
    try {
      const entity = {
        partitionKey: 'EVENT',
        rowKey: eventId,
        eventData: JSON.stringify(body)
      }
      await client.upsertEntity(entity, 'Replace')
      context.log('Event upserted successfully:', eventId)
      context.res = { status: 204 }
    } catch (innerErr) {
      context.log.error('Upsert failure for event:', eventId, innerErr)
      context.res = { status: 500, body: `Upsert error: ${innerErr.message}` }
    }
  } catch (error) {
    context.log.error('events-upsert error:', error)
    context.res = { status: 500, body: `Error: ${error.message}` }
  }
}
