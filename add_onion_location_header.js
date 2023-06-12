/*
 * This script adds an `Onion-Location` header to the response
 * of a request. This is useful for onion services that are
 * also available on the clearnet. The header will contain the
 * onion address of the service.
 */

export default {
  async fetch(request) {
    ONION_ADDRESS = "some-string";

    // Clone the response so that it's no longer immutable
    const response = await fetch(request);
    const newResponse = new Response(response.body, response);

    // Add the Onion-Location header while keeping the same path and query string for the location
    const url = new URL(request.url)
    newResponse.headers.set("Onion-Location", "http://" + ONION_ADDRESS + ".onion" + url.pathname + url.search);

    return newResponse;
  },
};
