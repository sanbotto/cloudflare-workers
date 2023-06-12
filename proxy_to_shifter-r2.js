/*
 * This script can be used as a proxy that enables us to use a
 * free Shifter subscription and still have a custom domain.
 * 
 * Your worker routes should match the ORIGINS keys, or you
 * could just not use that and always forward every request
 * to the same destination host with a hardcoded value.
 * 
 * A custom path (/resources) has been added to be able to
 * serve files hosted on an R2 bucket, to circumvent some file
 * type restrictions that Wordpress on Shifter has.
 */

/**
 * An object with different URLs to fetch
 * @param {Object} ORIGINS
 */
const ORIGINS = {
  // key = request host, value = destination host for proxying
  "example.organization-name.workers.dev": "random.on.getshifter.io",
  "example.com": "random.on.getshifter.io",
  "www.example.com": "random.on.getshifter.io"
}

async function handleRequest(request) {
  const url = new URL(request.url)
  let regex = new RegExp("^/wp-content/uploads");
  let match = regex.exec(url.pathname);

  // If something from /wp-content/uploads is being requested...
  if (match) {

    const objectName = url.pathname.slice(1) // slice(1) removes the first char from the path, which is '/'
    //const objectName = str.substring(str.indexOf('/') + 1) // Remove the first directory from the path (if needed)

    // Get the requested object from the R2 bucket
    const object = await r2_bucket.get(objectName)
    // r2_bucket is defined as an environment variable

    const headers = new Headers()
    object.writeHttpMetadata(headers)
    headers.set('etag', object.httpEtag)

    return new Response(object.body, {
      headers
    })

  } else {

    // Check if incoming hostname is a key in the ORIGINS object
    if (url.hostname in ORIGINS) {
      const target = ORIGINS[url.hostname]
      url.hostname = target

      // If it is, proxy request to that third party origin
      return fetch(url.toString(), request)
    }

    // Otherwise, process request as normal
    return fetch(request)
  }
}

addEventListener("fetch", async event => {
  event.respondWith(handleRequest(event.request))
})
