/*
 * This is just an example of how you can use a Cloudflare
 * Worker to serve files from a R2 bucket.
 * 
 * The idea for this particular script is that the base path
 * used to get the file is the name of the bucket, and that's
 * why it's being removed from the path used to fetch the
 * object, as you can see by the use of substring().
 */

async function handleRequest(request) {
  const url = new URL(request.url)
  // slice(1) removes the first char from the path, which is '/'
  const str = url.pathname.slice(1)
  // This next part removes the first directory from the path
  const objectName = str.substring(str.indexOf('/') + 1)

  console.log(`${request.method} object ${objectName}: ${request.url}`)
  if (request.method === 'GET') {
    // Get the requested object from the R2 bucket
    const object = await r2_bucket.get(objectName)
    // r2_bucket is defined as an environment variable

    const headers = new Headers()
    object.writeHttpMetadata(headers)
    headers.set('etag', object.httpEtag)
    return new Response(object.body, {
      headers
    })
  }
}

addEventListener('fetch', async event => {
  event.respondWith(handleRequest(event.request))
})
