import { BlobServiceClient } from '@azure/storage-blob'

const CONTAINER_NAME = 'event-posters'

function getConnectionString() {
  const conn = process.env.BLOB_STORAGE_CONNECTION_STRING || process.env.TABLE_STORAGE_CONNECTION_STRING
  if (!conn) throw new Error('Missing storage connection string')
  return conn
}

export function getBlobServiceClient() {
  return BlobServiceClient.fromConnectionString(getConnectionString())
}

export async function ensureContainerExists() {
  const client = getBlobServiceClient()
  const containerClient = client.getContainerClient(CONTAINER_NAME)
  
  try {
    const exists = await containerClient.exists()
    if (!exists) {
      console.log('Creating container:', CONTAINER_NAME)
      await containerClient.create({
        access: 'blob' // Public read access for blob URLs
      })
      console.log('Container created successfully')
    }
  } catch (e) {
    // If container already exists (409), that's fine
    if (e.statusCode !== 409) {
      console.error('Error ensuring container exists:', e)
      throw e
    }
  }
}

export async function uploadBlob(fileName, buffer, contentType) {
  await ensureContainerExists()
  const client = getBlobServiceClient()
  const containerClient = client.getContainerClient(CONTAINER_NAME)
  const blockBlobClient = containerClient.getBlockBlobClient(fileName)
  
  await blockBlobClient.upload(buffer, buffer.length, {
    blobHTTPHeaders: { blobContentType: contentType }
  })
  
  return blockBlobClient.url
}

export async function deleteBlob(fileName) {
  const client = getBlobServiceClient()
  const containerClient = client.getContainerClient(CONTAINER_NAME)
  const blockBlobClient = containerClient.getBlockBlobClient(fileName)
  
  try {
    await blockBlobClient.deleteIfExists()
  } catch (e) {
    console.error('Error deleting blob:', e)
  }
}
