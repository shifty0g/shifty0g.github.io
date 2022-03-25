const resource = [

  /* --- CSS --- */
  '/_site/assets/css/style.css',

  /* --- PWA --- */
  '/_site/app.js',
  '/_site/sw.js',

  /* --- HTML --- */
  '/_site/index.html',
  '/_site/404.html',
  
    '/_site/categories/',
  
    '/_site/tags/',
  
    '/_site/archives/',
  
    '/_site/toolbox/',
  
    '/_site/whoami/',
  

  /* --- Favicons & compressed JS --- */
  
  
    '/_site/assets/img/favicons/android-chrome-192x192.png',
    '/_site/assets/img/favicons/android-chrome-512x512.png',
    '/_site/assets/img/favicons/apple-touch-icon.png',
    '/_site/assets/img/favicons/favicon-16x16.png',
    '/_site/assets/img/favicons/favicon-32x32.png',
    '/_site/assets/img/favicons/favicon.ico',
    '/_site/assets/img/favicons/mstile-150x150.png',
    '/_site/assets/js/dist/categories.min.js',
    '/_site/assets/js/dist/commons.min.js',
    '/_site/assets/js/dist/home.min.js',
    '/_site/assets/js/dist/misc.min.js',
    '/_site/assets/js/dist/page.min.js',
    '/_site/assets/js/dist/post.min.js',
    '/_site/assets/js/dist/pvreport.min.js'

];

/* The request url with below domain will be cached */
const allowedDomains = [
  

  '',

  

  'fonts.gstatic.com',
  'fonts.googleapis.com',
  'cdn.jsdelivr.net',
  'polyfill.io'
];

/* Requests that include the following path will be banned */
const denyUrls = [
  
];

