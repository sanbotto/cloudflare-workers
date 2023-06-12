/*
 * This script can be used as a proxy that enables us to use a
 * free Shifter subscription and still have a custom domain.
 * 
 * Your worker routes should match the ORIGINS keys, or you
 * could just not use that and always forward every request
 * to the same destination host with a hardcoded value.
 * 
 * A custom path (/resources) has been added to be able to
 * serve files hosted on an S3 bucket, to circumvent some file
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

function handleRequest(request) {
  const url = new URL(request.url)
  let regex = new RegExp("^/resources");
  let match = regex.exec(url.pathname);
  // If something from /resources is being requested...
  if (match) {
    url.host = "example-bucket.s3.us-west-2.amazonaws.com";
    // ...fetch it from the S3 bucket
    return fetch(url.toString(), request)
  } else {
    // Check if incoming hostname is a key in the ORIGINS object
    if (url.hostname in ORIGINS) {
      const target = ORIGINS[url.hostname]
      url.hostname = target
      // If it is, proxy request to that third party origin
      return fetch(url.toString(), request)
    }
    // Otherwise, process the request as normal
    return fetch(request)
  }
}

addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request))
})
