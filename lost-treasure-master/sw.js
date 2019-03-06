/*
	We only need to modify cacheName variable
	Since we use 'cache with Network Update' strategy, we don't need to manually add files to be stored in cache, browser will do this for us! 
*/

const cacheName = 'lost-treasure-v1.3'; /* Name your cache  */
const filesToCache = [ /* that's all, all of the rest files will be automatically installed in cache */
  '/lost-treasure/index.html',
  '/lost-treasure/assets/fbx/ascend-stairs.fbx',
  '/lost-treasure/assets/fbx/climb-ladder.fbx',
  '/lost-treasure/assets/fbx/climb-rope.fbx',
  '/lost-treasure/assets/fbx/environment.fbx',
  '/lost-treasure/assets/fbx/gather-objects.fbx',
  '/lost-treasure/assets/fbx/girl-walk.fbx',
  '/lost-treasure/assets/fbx/look-around.fbx',
  '/lost-treasure/assets/fbx/punch.fbx',
  '/lost-treasure/assets/fbx/push-button.fbx',
  '/lost-treasure/assets/fbx/run.fbx',
  '/lost-treasure/assets/fbx/stumble-backwards.fbx',
  '/lost-treasure/assets/fbx/usb.fbx'
] 


// register service worker
if ('serviceWorker' in navigator) { // || if (navigator.serviceWorker) {
  window.addEventListener('load', () => {
      navigator.serviceWorker.register('/lost-treasure/sw.js', {scope: '/lost-treasure/'})
        .then(registration => {
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
      }).catch(err => {
          console.log('ServiceWorker registration failed: ', err);
      });
  });
}  
  
// delete previous caches
self.addEventListener('activate', e => {
  let cachecleaned = caches.keys().then(keys => {
    keys.forEach(key => {
      if(key !== `${cacheName}`) return caches.delete(key)
    })
  })
})

// install service worker 
self.addEventListener('install', e => {
  console.log('sw install');
  e.waitUntil(
    caches.open(`${cacheName}`).then(function(cache) {
      console.log('sw caching files');
      return cache.addAll(filesToCache);
    }).catch(err => {
      console.log(err);
    })
  );
});

// fetch assets from cache or network
self.addEventListener('fetch', e => {
  console.log('sw fetch');
  console.log(e.request.url);

  // Cache with Network Update 
  e.respondWith(
    caches.open(`${cacheName}`).then(cache => {
      return cache.match(e.request).then(res => {
        let updateRes = fetch(e.request).then(newRes => {
          cache.put(e.request, newRes.clone())
          return newRes
        })
        return res || updateRes
      })
    })
  )
});
  
  
