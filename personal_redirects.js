/*
 * This script lets you use your personal domain to redirect
 * to other services and resources. It's useful for managing
 * your professional portfolio, so you can use your own domain
 * to redirect to your GitHub, LinkedIn, certification badges,
 * landing page, work tools, etc.
 *
 * As an example, this base script has:
 *
 * - Public IP checker under `/ip`.
 * - Redirects to certification badges (set in `redirectMap`).
 * - Redirects required to properly show a personal landing
 * page hosted on Carrd (https://carrd.co/).
 */

const redirectMap = new Map([
  ['/certs', 'https://example.com/certs/your-user'],
  ['/certs/aws-cert-1', 'https://example.com/certs/aws-cert-1'],
])

async function handleRequest(request) {
  const requestURL = new URL(request.url)
  const path = requestURL.pathname
  if (path == '/ip') {
    // Get the client's IP and respond with it
    const clientIP = request.headers.get('CF-Connecting-IP');
    return new Response(clientIP);
  } else {
    const url = new URL(request.url)
    let regex = new RegExp("^/assets");
    let match = regex.exec(url.pathname);
    // If we're being asked for the main website or its assets, fetch them from Carrd
    if (path == '/' || match) {
      url.hostname = 'some-site.carrd.co'
      return fetch(url.toString(), request)
    } else {
      // Apply the corresponding redirect
      const location = redirectMap.get(path)
      if (location) {
        return Response.redirect(location, 301)
      } else {
        return new Response('404 Not Found', { status: 404 });
      }
    }
  }
}

addEventListener('fetch', async event => {
  event.respondWith(handleRequest(event.request))
})
