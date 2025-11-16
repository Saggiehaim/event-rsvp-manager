import { uploadBlob } from '../shared/blobClient.js'

export default async function (context, req) {
  try {
    const body = req.body
    
    if (!body || !body.fileName || !body.data) {
      context.res = { status: 400, body: 'Missing fileName or data' }
      return
    }
    
    const { fileName, data, contentType } = body
    
    // Extract base64 data (remove data URL prefix if present)
    let base64Data = data
    if (data.includes(',')) {
      base64Data = data.split(',')[1]
    }
    
    // Convert base64 to buffer
    const buffer = Buffer.from(base64Data, 'base64')
    
    // Validate size (5MB limit)
    if (buffer.length > 5 * 1024 * 1024) {
      context.res = { status: 413, body: 'Image too large (max 5MB)' }
      return
    }
    
    context.log('Uploading image:', fileName, 'size:', buffer.length)
    
    // Upload to blob storage
    const url = await uploadBlob(fileName, buffer, contentType || 'image/jpeg')
    
    context.log('Image uploaded successfully:', url)
    
    context.res = {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    }
  } catch (error) {
    context.log.error('upload-image error:', error)
    context.res = { status: 500, body: `Error: ${error.message}` }
  }
}
