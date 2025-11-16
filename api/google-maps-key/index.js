export default async function (context) {
  const key = process.env.GOOGLE_MAPS_API_KEY || ''
  context.res = {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ hasKey: !!key, key })
  }
}
