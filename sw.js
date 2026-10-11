var CACHE="diamond-karigar-v1";
var FILES=["./","index.html","manifest.json","icon-192.png","icon-512.png","icon-maskable-512.png"];
self.addEventListener("install",function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(FILES)}));
  self.skipWaiting();
});
self.addEventListener("activate",function(e){
  e.waitUntil(caches.keys().then(function(ks){
    return Promise.all(ks.filter(function(k){return k!==CACHE}).map(function(k){return caches.delete(k)}));
  }));
  self.clients.claim();
});
self.addEventListener("fetch",function(e){
  if(e.request.method!=="GET")return;
  e.respondWith(
    caches.match(e.request).then(function(r){
      return r||fetch(e.request).then(function(res){
        var cp=res.clone();
        caches.open(CACHE).then(function(c){c.put(e.request,cp)});
        return res;
      }).catch(function(){return caches.match("index.html")});
    })
  );
});
