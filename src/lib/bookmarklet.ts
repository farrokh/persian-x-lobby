export function generateBookmarkletCode(apiUrl: string, token: string, xHandle: string): string {
  // Fully self-contained: scrolls, collects handles, then opens our app with the data.
  // No fetch/XHR needed — bypasses X's CSP entirely by navigating away at the end.
  const code = `
void(async function(){
var D=document,W=window;
if(!W.location.href.includes('/following')){alert('Go to x.com/YOUR_HANDLE/following first');return}
if(!confirm('Syncing as @${xHandle}. Continue?'))return;
var s=D.createElement('div');
s.style.cssText='position:fixed;top:10px;right:10px;z-index:99999;background:#1a1a2e;color:#e0e0e0;padding:16px 24px;border-radius:12px;font-family:system-ui;font-size:14px;box-shadow:0 4px 20px rgba(0,0,0,0.3);min-width:220px';
s.textContent='Syncing as @${xHandle}...';
D.body.appendChild(s);
var h=new Set(),lc=0,sr=0,skip=['home','explore','notifications','messages','settings','search','i','compose','premium','communities','lists'];
function ex(){
D.querySelectorAll('[data-testid="UserCell"] a[href^="/"]').forEach(function(a){var p=a.getAttribute('href');if(p&&/^\\/[a-zA-Z0-9_]{1,15}$/.test(p)){var v=p.slice(1).toLowerCase();if(skip.indexOf(v)<0)h.add(v)}});
D.querySelectorAll('div[data-testid] span').forEach(function(n){var t=n.textContent||'';var m=t.match(/^@([a-zA-Z0-9_]{1,15})$/);if(m)h.add(m[1].toLowerCase())});
D.querySelectorAll('a[role="link"][href^="/"]').forEach(function(a){var c=a.closest('[data-testid="cellInnerDiv"]');if(!c)return;var p=a.getAttribute('href');if(p&&/^\\/[a-zA-Z0-9_]{1,15}$/.test(p)){var v=p.slice(1).toLowerCase();if(skip.indexOf(v)<0)h.add(v)}});
}
for(var i=0;i<300;i++){
ex();s.textContent='Scrolling... '+h.size+' handles';
if(h.size===lc){sr++;if(sr>=8)break}else{sr=0;lc=h.size}
W.scrollBy(0,600);await new Promise(function(r){setTimeout(r,400)})
}
if(h.size===0){s.style.background='#5c1a1a';s.textContent='No handles found';setTimeout(function(){s.remove()},4000);return}
s.textContent='Opening sync page with '+h.size+' handles...';
var u='${apiUrl}/api/sync-receive?token=${token}&handles='+encodeURIComponent(Array.from(h).join(','));
setTimeout(function(){W.location.href=u},500);
})()`.replace(/\n/g, '');

  return "javascript:" + encodeURIComponent(code);
}

export function generateConsoleScript(apiUrl: string, token: string, xHandle: string): string {
  return decodeURIComponent(generateBookmarkletCode(apiUrl, token, xHandle).replace("javascript:", ""));
}
