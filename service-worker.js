const CACHE='pul-v36'; const ASSETS=['./index.html','./style.css','./main.js','./manifest.json','./icon-192.png','./icon-512.png','./splash-1024.png','./service-worker.js'];
self.addEventListener('install',e=>{self.skipWaiting(); e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));});
self.addEventListener('activate',e=>{e.waitUntil((async()=>{const ks=await caches.keys(); await Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k))); await self.clients.claim();})());});
self.addEventListener('fetch',e=>{
  const r=e.request; const u=new URL(r.url);
  if(r.method!=='GET') return;
  if(u.origin===location.origin){
    e.respondWith((async()=>{
      const c=await caches.open(CACHE);
      const hit=await c.match(r);
      if(hit) return hit;
      try{const fresh=await fetch(r); if(fresh&&fresh.ok) c.put(r,fresh.clone()); return fresh;}
      catch(err){ if(r.mode==='navigate') return c.match('./index.html'); throw err; }
    })());
  }
});