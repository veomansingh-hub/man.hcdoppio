const jsdom = require('jsdom');
const { JSDOM } = jsdom;

JSDOM.fromURL('https://hcdoppio.vercel.app', { runScripts: "dangerously", resources: "usable" }).then(dom => {
  dom.window.addEventListener('error', event => {
    console.error('JSDOM Error:', event.error);
  });
  setTimeout(() => {
    console.log('App HTML after 3 seconds:', dom.window.document.body.innerHTML.substring(0, 500));
  }, 3000);
});
