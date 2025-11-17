import { getTableClient } from '../shared/tableClient.js'

export default async function (context) {
  try {
    context.log('Getting all events')
    const client = getTableClient()
    
    // Query all entities with partitionKey='EVENT'
    const entities = client.listEntities({ queryOptions: { filter: "PartitionKey eq 'EVENT'" } })
    const events = []
    
    for await (const entity of entities) {
      try {
        const eventData = JSON.parse(entity.eventData)
        events.push(eventData)
      } catch (e) {
        context.log.error('Failed to parse event:', entity.rowKey, e)
      }
    }
    
    context.log('Retrieved', events.length, 'events')
    
    context.res = {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(events)
    }
  } catch (error) {
    context.log.error('events-get error:', error)
    context.res = { status: 500, body: `Error: ${error.message}` }
  }
}
