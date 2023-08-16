/*
 * This script simply returns a static page to show that a given
 * site is under construction.
 * You can use it to serve any static page, even a proper landing.
 */

const html = `<!DOCTYPE html>
<html lang="en" class="page">
  <head>
    <meta charset="UTF-8">
    <title>Site Under Construction</title>
    <meta name="robots" content="noindex,nofollow">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta charset="utf-8">
    <style>
      *,
      *:before,
      *:after {
        box-sizing: border-box;
      }

      html {
        height: 100%;
      }

      body {
        background: #F2994A;
        font-family: Roboto, Helvetica, Arial, sans-serif;
        height: 100%;
        margin: 0;
      }

      .wrapper {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-style: italic;
        margin-top: -1em;
        color: #000;
      }

      .icon {
        color: #ffde66;
        font-size: 10em;
      }

      .title {
        margin: 30px;
        font-size: 2em;
        font-weight: 700;
      }

      .text {
        font-size: 18px;
        text-align: center;
        padding: 20px;
      }
    </style>
    <script src="https://kit.fontawesome.com/ac0f4620f4.js" crossorigin="anonymous"></script>
  </head>
  <body>
    <div class="wrapper">
      <div class="icon">
        <i class="fa-solid fa-helmet-safety"></i>
      </div>
      <div class="title">We're sorry, we're still working on our site.</div>
      <div class="text">Please check back soon!</div>
    </div>
  </body>
</html>
`

async function handleRequest(request) {
  return new Response(html, {
    headers: {
      'content-type': 'text/html;charset=UTF-8'
    }
  })
}

addEventListener('fetch', event => {
  return event.respondWith(handleRequest(event.request))
})
