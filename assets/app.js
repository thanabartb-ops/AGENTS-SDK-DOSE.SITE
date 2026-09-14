'use strict';
const root=document.documentElement,$=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)];
const store={get:(k,f)=>{try{return localStorage.getItem(k)||f}catch{return f}},set:(k,v)=>{try{localStorage.setItem(k,v)}catch{}}};
const media=matchMedia('(prefers-color-scheme: dark)'),panel=$('#settingsPanel'),settings=$('#settingsBtn'),menu=$('#menuBtn'),mobile=$('#mobileNav'),motion=$('#motionToggle');
let theme=store.get('agents-dose-theme','dark');
const resolve=t=>t==='system'?(media.matches?'dark':'dim'):t;
function applyTheme(value,persist=true){theme=value;root.dataset.theme=resolve(value);$('.button-label').textContent=value==='system'?'Auto':root.dataset.theme==='dark'?'Dark':'Dim';$$('[data-theme-option]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.themeOption===value)));$('meta[name="theme-color"]').content=root.dataset.theme==='dark'?'#090b09':'#111510';if(persist)store.set('agents-dose-theme',value)}
function applyFont(value,persist=true){root.dataset.font=value;$$('[data-font-option]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.fontOption===value)));if(persist)store.set('agents-dose-font',value)}
function applyMotion(value,persist=true){root.dataset.reduceMotion=String(value);motion.checked=value;if(persist)store.set('agents-dose-motion',String(value))}
function closePanel(focus=false){panel.hidden=true;settings.setAttribute('aria-expanded','false');if(focus)settings.focus()}
function closeMenu(){mobile.hidden=true;menu.setAttribute('aria-expanded','false')}
applyTheme(theme,false);applyFont(store.get('agents-dose-font','100'),false);applyMotion(store.get('agents-dose-motion','false')==='true',false);$('#year').textContent=new Date().getFullYear();
settings.addEventListener('click',()=>{const open=panel.hidden;panel.hidden=!open;settings.setAttribute('aria-expanded',String(open));if(open)$('#settingsClose').focus()});
$('#settingsClose').addEventListener('click',()=>closePanel(true));
$('#themeOptions').addEventListener('click',e=>{const b=e.target.closest('[data-theme-option]');if(b)applyTheme(b.dataset.themeOption)});
$('#fontOptions').addEventListener('click',e=>{const b=e.target.closest('[data-font-option]');if(b)applyFont(b.dataset.fontOption)});
motion.addEventListener('change',()=>applyMotion(motion.checked));
$('#themeQuick').addEventListener('click',()=>applyTheme(resolve(theme)==='dark'?'dim':'dark'));
media.addEventListener?.('change',()=>{if(theme==='system')applyTheme('system',false)});
menu.addEventListener('click',()=>{const open=mobile.hidden;mobile.hidden=!open;menu.setAttribute('aria-expanded',String(open))});
$$('#mobileNav a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('click',e=>{if(!panel.hidden&&!panel.contains(e.target)&&!settings.contains(e.target))closePanel()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(!panel.hidden)closePanel(true);if(!mobile.hidden){closeMenu();menu.focus()}}});
addEventListener('scroll',()=>$('.site-header').classList.toggle('scrolled',scrollY>12),{passive:true});
const reveals=$$('.reveal');
if('IntersectionObserver'in window&&root.dataset.reduceMotion!=='true'){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.12});reveals.forEach(el=>observer.observe(el))}else reveals.forEach(el=>el.classList.add('visible'));
if('IntersectionObserver'in window){const links=$$('.desktop-nav a'),observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting)links.forEach(a=>a.classList.toggle('active',a.hash==='#'+entry.target.id))}),{rootMargin:'-35% 0px -55%'});$$('main section[id]').forEach(s=>observer.observe(s))}
const card=$('#consoleCard');
if(card&&matchMedia('(pointer:fine)').matches){card.addEventListener('pointermove',e=>{if(root.dataset.reduceMotion==='true')return;const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.transform=`rotateY(${x*5-2}deg) rotateX(${-y*4+1}deg)`});card.addEventListener('pointerleave',()=>card.style.transform='')}
