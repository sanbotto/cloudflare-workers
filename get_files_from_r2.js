/*
 * This is just an example of how you can use a Cloudflare
 * Worker to serve files from a R2 bucket.
 * 
 * The idea for this particular script is that the base path
 * used to get the file is the name of the bucket, and that's
 * why it's being removed from the path used to fetch the
 * object, as you can see by the use of substring().
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    // Remove the first char from the path, which is '/'
    const objectName = url.pathname.slice(1)

    // Make sure that env.R2_BUCKET is set
    if (!env.R2_BUCKET) {
      return new Response(JSON.stringify({ error: 'The binding with the backend storage service has not been set' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    }

    if (request.method === 'GET') {
      try {
        // Get the requested object from the R2 bucket
        const object = await env.R2_BUCKET.get(objectName)

        // Set the ETag header to the value of the object's httpEtag
        const headers = new Headers()
        object.writeHttpMetadata(headers)
        headers.set('etag', object.httpEtag)

        // Return the object's body with the modified headers
        return new Response(object.body, {
          headers
        })
      } catch (err) {
        // An error here is most likely due to the object not being found
        return new Response(JSON.stringify({ error: `Object ${objectName || null} not found` }), {
          status: 404,
          headers: {
            'Content-Type': 'application/json'
          }
        })
      }

    } else {

      // Only GET requests are allowed
      return new Response(JSON.stringify({ error: `Method not allowed (${request.method}), please use GET` }), {
        status: 405,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    }
  }
}
