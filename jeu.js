
// Données chargées depuis cartes.js ; paramètres depuis reglages.js.
const CARDS=Object.create(null),CARD_IDS=[],COLLECTIONS={
  original:{name:'Collection originale',subtitle:'Les premières facettes de Kylian',symbol:'✦',cover:'couvertures/original.svg',ids:[]},
  anime:{name:'Duo animé',subtitle:'Kylian débarque dans leurs univers',symbol:'⚡',cover:'couvertures/anime.svg',ids:[]}
};
const catalogErrors=[];
for(const [series,groups] of Object.entries(window.TCG_CARTES||{})){
  if(!COLLECTIONS[series]){catalogErrors.push('Booster inconnu : '+series);continue;}
  for(const [rarity,cards] of Object.entries(groups)){
    if(!['common','rare','epic','legendary'].includes(rarity)||!Array.isArray(cards)){catalogErrors.push('Section invalide : '+series+'/'+rarity);continue;}
    cards.forEach(card=>{
      if(!card||!card.id||typeof card.id!=='string'||!card.name||!card.img||CARDS[card.id]){catalogErrors.push('Carte invalide ou identifiant dupliqué : '+(card?.id||'?'));return;}
      const number=COLLECTIONS[series].ids.length+1;
      CARDS[card.id]={...card,desc:card.desc||'',type:card.type||'',rarity,collection:series,number,ordinal:CARD_IDS.length};
      CARD_IDS.push(card.id);COLLECTIONS[series].ids.push(card.id);
    });
  }
}
if(!window.TCG_CARTES)catalogErrors.push('cartes.js absent ou erreur de syntaxe.');
if(catalogErrors.length){const error=document.getElementById('catalog-error');error.hidden=false;error.textContent='Catalogue à corriger : '+catalogErrors.join(' · ');}
const LEGACY_CARD_IDS={"0": "original-010", "1": "original-011", "2": "original-023", "3": "original-037", "4": "original-024", "5": "original-013", "6": "original-014", "7": "original-015", "8": "original-016", "9": "original-017", "10": "original-018", "11": "original-019", "12": "original-020", "13": "original-021", "14": "original-022", "15": "original-025", "16": "original-047", "17": "original-026", "18": "original-027", "20": "original-001", "21": "original-003", "22": "original-004", "23": "original-028", "24": "original-029", "25": "original-043", "26": "original-006", "27": "original-007", "28": "original-008", "29": "original-033", "30": "original-009", "31": "original-048", "32": "original-041", "33": "original-012", "34": "original-034", "35": "original-040", "36": "original-002", "41": "anime-030", "43": "anime-039", "46": "anime-047", "47": "anime-027", "48": "anime-003", "51": "anime-013", "52": "anime-035", "53": "anime-044", "54": "anime-026", "55": "anime-034", "56": "anime-010", "57": "anime-040", "58": "anime-025", "59": "anime-037", "60": "anime-041", "61": "anime-020", "62": "anime-029", "63": "anime-005", "64": "anime-032", "65": "anime-024", "66": "anime-015", "67": "anime-011", "68": "anime-016", "69": "anime-042", "70": "anime-023", "73": "anime-028", "74": "anime-022"};
const RETIRED_LEGACY={"19": {"id": "ancienne-019", "name": "La DS3 du daron"}, "37": {"id": "ancienne-037", "name": "Avec Manu"}, "38": {"id": "ancienne-038", "name": "La familia"}, "39": {"id": "ancienne-039", "name": "En manif"}};
const resolveCardId=id=>CARDS[id]?String(id):LEGACY_CARD_IDS[String(id)]||null;
let activeCollection='original',revealCollection='original';
const CARDS_PER_PACK = 5, STORAGE_KEY = 'kylian-tcg-v1';
const ACCOUNTS_KEY='kylian-tcg-accounts', SESSION_KEY='kylian-tcg-session', LEGACY_CLAIMED_KEY='kylian-tcg-legacy-claimed';
/* COMPTE ADMIN COMMUN — fonctionne sans inscription sur chaque navigateur.
   Modifie ces deux valeurs si tu veux changer les identifiants.
   IMPORTANT : ce site est local ; ces valeurs sont lisibles dans le code.
   Ce compte n'est pas une sécurité serveur et ne synchronise pas les appareils.
*/
const ADMIN_LOGIN = window.TCG_REGLAGES?.adminIdentifiant || 'admin';
const ADMIN_PASSWORD = window.TCG_REGLAGES?.adminMotDePasse || 'KylianAdmin2026!';
const getAccounts=()=>{
  let accounts={};
  try{const a=JSON.parse(localStorage.getItem(ACCOUNTS_KEY));if(a&&typeof a==='object'&&!Array.isArray(a))accounts=a;}catch{}
  return {...accounts,[ADMIN_LOGIN.toLowerCase()]:{name:ADMIN_LOGIN,role:'admin',builtin:true}};
};
let currentUser=(()=>{try{const n=localStorage.getItem(SESSION_KEY);const a=n&&getAccounts()[n.toLowerCase()];return a?a.name:null;}catch{return null;}})();
const storageKey=()=>currentUser?STORAGE_KEY+':'+currentUser.toLowerCase():null;
const COOLDOWN_MS = Math.max(1,Number(window.TCG_REGLAGES?.delaiMinutes)||5)*60000; // Une recharge gratuite toutes les cinq minutes, par série
// Chances de tirer chaque rareté (puis une carte au hasard dans cette rareté). Modifiable.
const RARITY_ORDER = ['common','rare','epic','legendary'];
const RARITY_WEIGHTS = Object.fromEntries(RARITY_ORDER.map(r=>[r,Math.max(0,Number(window.TCG_REGLAGES?.chances?.[r])||0)]));
if(!Object.values(RARITY_WEIGHTS).some(v=>v>0))Object.assign(RARITY_WEIGHTS,{common:60,rare:25,epic:11,legendary:4});
const RARITY_LABEL = {common:'Commune',rare:'Rare',epic:'Épique',legendary:'Légendaire'};
const COLORS = {common:'#a8a0b8',rare:'#4da3ff',epic:'#b36bff',legendary:'#f5c542'};
const RARITY_EFFECTS = {
  common: {symbol:'◇', stars:'◆', charge:120, turn:680, tease:'Une nouvelle facette…'},
  rare: {symbol:'✧', stars:'✦ ✦', charge:360, turn:820, tease:'Un éclat se dessine…'},
  epic: {symbol:'✦', stars:'✦ ✦ ✦', charge:650, turn:980, tease:'Quelque chose se réveille…'},
  legendary: {symbol:'♛', stars:'✦ ✦ ✦ ✦', charge:1000, turn:1180, tease:'Un instant. Ça, c’est Kylian.'}
};
const $ = id => document.getElementById(id);
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
// Animate visible cards only; unseen collection cards do not use animation resources.
const cardVisibility = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver(entries=>{
  entries.forEach(entry=>entry.target.classList.toggle('in-view',entry.isIntersecting));
}, {rootMargin:'40px'});
function newState() {return {owned:{},lastOpen:0,opened:0,lastOpens:{original:0,anime:0},openedByPack:{original:0,anime:0}};}
function packHistory(s){
  const natural=n=>Number.isInteger(n)&&n>=0?n:0;
  const time=n=>Number.isFinite(n)&&n>=0?n:0;
  return {lastOpens:{original:time(s.lastOpens?.original??s.lastOpen),anime:time(s.lastOpens?.anime)},openedByPack:{original:natural(s.openedByPack?.original??s.opened),anime:natural(s.openedByPack?.anime)}};
}
function readState(k) {
  try {
    if(!k)return newState();
    const s=JSON.parse(localStorage.getItem(k));
    if(s && s.owned && typeof s.owned==='object' && !Array.isArray(s.owned)) {
      const owned={};
      const archivedOwned={...(s.archivedOwned||{})};
      Object.entries(s.owned).forEach(([key,v])=>{if(!Number.isInteger(v)||v<=0)return;const id=resolveCardId(key);if(id&&CARDS[id])owned[id]=(owned[id]||0)+v;else if(RETIRED_LEGACY[key])archivedOwned[RETIRED_LEGACY[key].id]=v;});
      return {owned,archivedOwned,progression:s.progression,economy:s.economy,lastOpen:Number.isFinite(s.lastOpen)?s.lastOpen:0,opened:Number.isInteger(s.opened)&&s.opened>=0?s.opened:0,...packHistory(s)};
    }
    // Ancien format (8 paquets fixes) : on garde les cartes déjà obtenues
    if(s && Array.isArray(s.order) && Number.isInteger(s.opened) && s.opened>=0) {
      const owned={};
      s.order.slice(0,Math.min(s.opened,8)*5).forEach(oldId=>{const id=resolveCardId(oldId);if(id&&CARDS[id])owned[id]=1;});
      return {owned,lastOpen:0,opened:s.opened,...packHistory(s)};
    }
  } catch {}
  return newState();
}
function loadState() {return readState(storageKey());}
let state=loadState(), currentFilter='all', opening=false, openingTimer=null, revealIds=[], revealNew=[], revealIdx=0, busy=false, flipTimer=null, spread=false;
let returnFocus=null, zoomReturnFocus=null, audioCtx=null, soundEnabled=false;
function saveState(){const k=storageKey();if(!k)return false;try{localStorage.setItem(k,JSON.stringify(state));return true;}catch{return false;}}
/* Navigation: changing tabs keeps the collection, filters and saved game intact. */
const tabNames=['packs','collection','profile','quests','rebirth','friends','trades'];
function activateTab(name,focus=false){
  if(!tabNames.includes(name))return;
  tabNames.forEach(key=>{
    const selected=key===name,tab=$('tab-'+key);
    tab.setAttribute('aria-selected',String(selected));
    tab.tabIndex=selected?0:-1;
    $('panel-'+key).hidden=!selected;
  });
  if(name==='friends'||name==='trades')renderSocial();
  window.TCGProgression?.activate(name);
  if(focus)$('tab-'+name).focus();
}
function setTabsBusy(value){tabNames.forEach(name=>$('tab-'+name).disabled=value);}
tabNames.forEach((name,index)=>{
  const tab=$('tab-'+name);
  tab.addEventListener('click',()=>activateTab(name));
  tab.addEventListener('keydown',event=>{
    let target;
    if(event.key==='ArrowRight')target=(index+1)%tabNames.length;
    else if(event.key==='ArrowLeft')target=(index+tabNames.length-1)%tabNames.length;
    else if(event.key==='Home')target=0;
    else if(event.key==='End')target=tabNames.length-1;
    else return;
    event.preventDefault();activateTab(tabNames[target],true);
  });
});
const pad = n=>String(n).padStart(3,'0');
const cardNumber=id=>(CARDS[id].collection==='anime'?'DA #':'#')+pad(CARDS[id].number);
function selectCollection(key){
  if(!COLLECTIONS[key])return;
  activeCollection=key;currentFilter='all';
  document.querySelectorAll('.filters button').forEach(b=>{const on=b.dataset.filter==='all';b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on));});
  renderCollection();
}
document.querySelectorAll('[data-collection]').forEach(b=>b.onclick=()=>selectCollection(b.dataset.collection));
function makeCard(id, interactive=false) {
  const d=CARDS[id], el=document.createElement('article');
  el.className='card'; el.dataset.rarity=d.rarity;
  el.style.setProperty('--card-delay',-(d.ordinal%7)*.7+'s');
  el.innerHTML='<div class="inner"><div class="top"><h3 class="name"></h3><span class="num"></span></div><div class="art"><span class="card-sigil" aria-hidden="true"></span></div><div class="badges"><span class="rarity"></span><span class="type"></span><span class="rarity-stars" aria-hidden="true"></span></div><p class="desc"></p><span class="card-ornaments" aria-hidden="true"></span><span class="foil-sheen" aria-hidden="true"></span><span class="foil-dust" aria-hidden="true"></span></div>';
  el.querySelector('.name').textContent=d.name;el.querySelector('.name').title=d.name;
  el.querySelector('.num').textContent=cardNumber(id);
  el.querySelector('.rarity').textContent=RARITY_LABEL[d.rarity];
  el.querySelector('.type').textContent=d.type;
  el.querySelector('.desc').textContent=d.desc;
  el.querySelector('.card-sigil').textContent=RARITY_EFFECTS[d.rarity].symbol;
  el.querySelector('.rarity-stars').textContent=RARITY_EFFECTS[d.rarity].stars;
  const art=el.querySelector('.art');
  if(d.img){const img=new Image();img.alt=d.name;img.loading=interactive?'lazy':'eager';img.addEventListener('error',()=>{img.remove();art.classList.add('missing');});img.src=d.img;art.append(img);}else art.classList.add('missing');
  if(interactive){el.tabIndex=0;el.setAttribute('role','button');el.setAttribute('aria-label',`Agrandir ${d.name}, ${RARITY_LABEL[d.rarity]}`);el.onclick=()=>zoomCard(id);el.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();zoomCard(id);}};}
  bindTilt(el);
  if(cardVisibility)cardVisibility.observe(el);else el.classList.add('in-view');
  return el;
}
function makeBack(id,locked=false){const el=document.createElement('div');el.className='cardback'+(locked?' locked':'');el.innerHTML='<div class="pattern"><div class="k">K</div><div class="t"></div></div>';el.querySelector('.t').textContent=locked?cardNumber(id)+' · À découvrir':'KYLIAN · TCG';return el;}
function bindTilt(el){
  if(reduceMotion||!matchMedia('(hover:hover)').matches)return;
  el.onpointermove=e=>{
    if(el.closest('.flipper:not(.flipped)'))return;
    const r=el.getBoundingClientRect(),x=Math.max(0,Math.min(1,(e.clientX-r.left)/r.width)),y=Math.max(0,Math.min(1,(e.clientY-r.top)/r.height));
    el.style.setProperty('--rx',(0.5-y)*14+'deg');el.style.setProperty('--ry',(x-0.5)*18+'deg');
    el.style.setProperty('--mx',x*100+'%');el.style.setProperty('--my',y*100+'%');
  };
  el.onpointerleave=()=>{el.style.setProperty('--rx','0deg');el.style.setProperty('--ry','0deg');el.style.setProperty('--mx','50%');el.style.setProperty('--my','50%');};
}
function releaseCards(root){root.querySelectorAll('.card').forEach(card=>cardVisibility?.unobserve(card));}
function ownedCount(key){return key?COLLECTIONS[key].ids.filter(id=>state.owned[id]>0).length:Object.keys(state.owned).length;}
function isComplete(key=activeCollection){return COLLECTIONS[key].ids.length>0&&ownedCount(key)>=COLLECTIONS[key].ids.length;}
function cooldownLeft(key=activeCollection){const stock=window.TCGEconomy.stock(state,key);return stock.count>0?0:stock.next;}
function fmtTime(ms){const t=Math.ceil(ms/1000);return Math.floor(t/60)+':'+String(t%60).padStart(2,'0');}
function drawCard(key=activeCollection){
  if(!COLLECTIONS[key]?.ids.length)return null;
  let available=RARITY_ORDER.filter(r=>RARITY_WEIGHTS[r]>0&&COLLECTIONS[key].ids.some(id=>CARDS[id].rarity===r));
  if(!available.length){const pool=COLLECTIONS[key].ids;return pool[Math.floor(Math.random()*pool.length)];}
  const total=available.reduce((a,r)=>a+RARITY_WEIGHTS[r],0);
  let roll=Math.random()*total,rarity=available[0];
  for(const r of available){if(roll<RARITY_WEIGHTS[r]){rarity=r;break;}roll-=RARITY_WEIGHTS[r];}
  const pool=COLLECTIONS[key].ids.filter(i=>CARDS[i].rarity===rarity);
  return pool[Math.floor(Math.random()*pool.length)];
}
function drawPack(key=activeCollection){if(!COLLECTIONS[key]?.ids.length)return [];return Array.from({length:CARDS_PER_PACK},()=>drawCard(key)).sort((a,b)=>RARITY_ORDER.indexOf(CARDS[a].rarity)-RARITY_ORDER.indexOf(CARDS[b].rarity));}
function updateCooldown(){
  let total=0;
  const e=window.TCGEconomy.ensure(state);
  Object.keys(COLLECTIONS).forEach(key=>{
    const empty=!COLLECTIONS[key].ids.length,stock=window.TCGEconomy.stock(state,key),ready=!empty&&stock.count>0,p=$('pack-'+key);
    if(!empty)total+=stock.count;
    if(p&&!p.classList.contains('tearing')){
      p.disabled=!currentUser||!ready||opening;p.classList.toggle('waiting',!ready);
      p.setAttribute('aria-label',COLLECTIONS[key].name+' : '+(empty?'aucune carte configurée':ready?`ouvrir gratuitement, ${stock.count} booster(s) en réserve`:`recharge dans ${fmtTime(stock.next)}`));
      p.querySelector('.count').textContent=empty?'Bientôt disponible':ready?'Ouvrir gratuitement':fmtTime(stock.next);
      p.querySelector('.emblem').textContent='';
    }
    const count=$('stock-'+key);if(count)count.textContent=stock.count+' / '+stock.max+' gratuits';
    const status=$('status-'+key);if(status)status.textContent=empty?'Aucune carte configurée.':stock.count===stock.max?'Réserve pleine · recharge en pause':'Prochain gratuit dans '+fmtTime(stock.next);
    const paid=$('paid-'+key);if(paid){paid.disabled=!currentUser||empty||opening||e.coins<window.TCGEconomy.price();paid.textContent='Ouvrir pour '+window.TCGEconomy.price()+' ◉';}
  });
  $('stat-coins').textContent=e.coins.toLocaleString('fr-FR');
  $('cooldown').textContent=total?total+' booster'+(total>1?'s gratuits disponibles':' gratuit disponible')+' · réserves indépendantes':'Les réserves se remplissent même pendant ton absence.';
  $('tab-packs-count').textContent=total+' gratuits';
}

function renderStats(){
  $('stat-cards').textContent=ownedCount();$('stat-total').textContent=CARD_IDS.length;$('stat-packs').textContent=state.opened;
  $('tab-collection-count').textContent=`${ownedCount()} / ${CARD_IDS.length}`;
  Object.keys(COLLECTIONS).forEach(key=>{$('count-'+key).textContent=`${ownedCount(key)} / ${COLLECTIONS[key].ids.length}`;});
  $('complete').textContent=Object.keys(COLLECTIONS).filter(key=>COLLECTIONS[key].ids.length).every(key=>isComplete(key))?'✦ Les deux collections sont complètes ! Continue à ouvrir pour les doublons et les rebirths.':'';
  updateCooldown();
  window.TCGProgression?.render();
}
function renderPacks(){
  const root=$('packs');root.replaceChildren();
  Object.entries(COLLECTIONS).forEach(([key,collection])=>{
    const box=document.createElement('article');box.className='pack-series';box.dataset.series=key;
    const heading=document.createElement('h3');heading.textContent=collection.name;box.append(heading);
    const subtitle=document.createElement('p');subtitle.className='pack-subtitle';subtitle.textContent=collection.subtitle;box.append(subtitle);
    const p=document.createElement('button');p.type='button';p.className='pack';p.id='pack-'+key;
    p.innerHTML='<div class="shine"></div><div class="logo">KYLIAN<br>TCG</div><div class="emblem"></div><div class="pack-edition"></div><div class="count">5 cartes</div>';
    if(collection.cover){const cover=new Image();cover.src=collection.cover;cover.alt='';cover.className='pack-cover-art';p.append(cover);}
    p.querySelector('.pack-edition').textContent=collection.name;
    p.onclick=()=>openPack(p,key,'free');box.append(p);
    const stock=document.createElement('p');stock.className='stock-pill';stock.id='stock-'+key;box.append(stock);
    const paid=document.createElement('button');paid.type='button';paid.className='btn paid-pack';paid.id='paid-'+key;paid.onclick=()=>openPack(p,key,'paid');box.append(paid);
    const progress=document.createElement('p');progress.className='pack-progress';progress.textContent=`${ownedCount(key)} / ${collection.ids.length} cartes · ${state.openedByPack[key]} booster${state.openedByPack[key]>1?'s':''} ouvert${state.openedByPack[key]>1?'s':''}`;box.append(progress);
    const status=document.createElement('p');status.className='pack-status';status.id='status-'+key;box.append(status);
    const browse=document.createElement('button');browse.type='button';browse.className='btn';browse.textContent='Voir la collection';browse.onclick=()=>{selectCollection(key);activateTab('collection',true);};box.append(browse);
    root.append(box);
  });updateCooldown();
}
function renderCollection(){
  const collection=COLLECTIONS[activeCollection],count=ownedCount(activeCollection);
  document.querySelectorAll('[data-collection]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.collection===activeCollection)));
  $('collection-title').textContent=collection.name;
  $('collection-progress').textContent=`${count} / ${collection.ids.length} cartes découvertes · ${state.openedByPack[activeCollection]} booster${state.openedByPack[activeCollection]>1?'s':''} ouvert${state.openedByPack[activeCollection]>1?'s':''}`;
  $('collection-meter').max=Math.max(1,collection.ids.length);$('collection-meter').value=count;
  $('reset').textContent='↺ Réinitialiser '+collection.name.toLowerCase();$('reset').disabled=!collection.ids.length;
  releaseCards($('grid'));$('grid').replaceChildren();
  if(!collection.ids.length){const note=document.createElement('p');note.className='collection-empty';note.textContent='Cette collection arrive bientôt. Aucune carte ajoutée pour le moment.';$('grid').append(note);}
  collection.ids.forEach(i=>{const d=CARDS[i],n=state.owned[i]||0,el=n>0?makeCard(i,true):makeBack(i,true);
    if(n>0){const b=document.createElement('span');b.className='dupe-count';b.textContent='×'+n;b.title=n+(n>1?' exemplaires':' exemplaire');b.setAttribute('aria-hidden','true');el.append(b);}
    el.dataset.owned=n>0?'1':'0';el.dataset.rarityKey=d.rarity;$('grid').append(el);
  });applyFilter();
}
function applyFilter(){$('grid').querySelectorAll('[data-owned]').forEach(el=>el.hidden=currentFilter!=='all'&&!(el.dataset.owned==='1'&&el.dataset.rarityKey===currentFilter));}
document.querySelectorAll('.filters button').forEach(btn=>{btn.setAttribute('aria-pressed',btn.classList.contains('active'));btn.onclick=()=>{document.querySelectorAll('.filters button').forEach(b=>{b.classList.toggle('active',b===btn);b.setAttribute('aria-pressed',b===btn);});currentFilter=btn.dataset.filter;applyFilter();};});
function syncModal(){const zoom=$('zoom-modal').classList.contains('open'),reveal=$('reveal-modal').classList.contains('open'),auth=$('auth-modal').classList.contains('open');$('site-content').inert=zoom||reveal||auth;$('reveal-modal').inert=zoom||auth;document.body.classList.toggle('modal-active',zoom||reveal||auth);}
function openPack(el,key=activeCollection,mode='free'){
  if(!currentUser||!COLLECTIONS[key]?.ids.length||opening||$('reveal-modal').classList.contains('open'))return false;
  const snapshot=JSON.stringify(state);
  if(!window.TCGEconomy.consume(state,key,mode))return false;
  revealCollection=key;activeCollection=key;revealIds=drawPack(key);
  revealNew=revealIds.map(id=>{const isNew=!state.owned[id];state.owned[id]=(state.owned[id]||0)+1;return isNew;});
  window.TCGProgression?.onPack(state,key,revealIds,revealNew,mode);
  state.opened++;state.openedByPack[key]++;state.lastOpens[key]=Date.now();if(key==='original')state.lastOpen=state.lastOpens[key];
  if(!saveState()){state=JSON.parse(snapshot);window.TCGProgression?.announce('Sauvegarde impossible : aucune pièce ni ouverture gratuite n’a été consommée.');updateCooldown();return false;}
  opening=true;returnFocus=el;setTabsBusy(true);
  document.querySelectorAll('.pack,.paid-pack').forEach(p=>p.disabled=true);
  el.classList.add('tearing');
  openingTimer=setTimeout(()=>{openingTimer=null;showReveal();renderStats();renderPacks();renderCollection();},reduceMotion?0:600);
  return true;
}

function showReveal(){
  revealIdx=0;spread=false;busy=false;clearRevealEffects();const row=$('reveal-row');releaseCards(row);row.replaceChildren();row.className='reveal-row stacked';
  $('reveal-title').textContent=revealCollection==='anime'?'Un duo peut en cacher un autre.':'Un Kylian peut en cacher un autre.';document.querySelector('.edition-label').textContent='Kylian TCG · '+COLLECTIONS[revealCollection].name;
  revealIds.forEach((id,i)=>{const f=document.createElement('button');f.type='button';f.className='flipper';f.dataset.rarity=CARDS[id].rarity;f.setAttribute('aria-label',`Retourner la carte ${i+1}`);f.innerHTML='<div class="flipper-inner"><div class="face back" aria-hidden="true"></div><div class="face front" aria-hidden="true"></div></div>';f.querySelector('.back').append(makeBack(id));f.querySelector('.front').append(makeCard(id));f.onclick=()=>{if(spread)zoomCard(id);else if(i===revealIdx)advance();};row.append(f);});
  $('reveal-modal').classList.add('open');layoutStack();updateRevealUI();syncModal();$('reveal-next').focus();
}
function layoutStack(){Array.from($('reveal-row').children).forEach((f,i)=>{const depth=i-revealIdx;f.classList.toggle('top',depth===0);f.classList.toggle('gone',depth<0);f.style.zIndex=depth<0?0:5-depth;f.style.transform=depth<0?'':`translate(${depth*5}px,${depth*4}px) rotate(${depth%2?2:-2}deg)`;f.disabled=depth!==0;f.tabIndex=depth===0?0:-1;});}
function updateRevealUI(){
  const top=$('reveal-row').children[revealIdx], flipped=top?.classList.contains('flipped');
  $('reveal-count').textContent=spread?'5 cartes ajoutées à ta collection':`BOOSTER N° ${state.openedByPack[revealCollection]} · CARTE ${revealIdx+1} / 5`;
  $('reveal-next').hidden=spread;$('reveal-all').hidden=spread;$('reveal-zoom').hidden=spread||!flipped;
  $('reveal-next').disabled=busy;$('reveal-all').disabled=busy;$('reveal-zoom').disabled=busy;
  $('reveal-next').textContent=!flipped?'Révéler la carte':revealIdx<4?'Carte suivante →':'Voir mon paquet';
  $('reveal-close').textContent=spread?'Voir ma collection':'Garder ce paquet et fermer';
  $('reveal-help').textContent=spread?'Sélectionne une carte pour la regarder de plus près.':'Clique sur la carte ou utilise le bouton pour continuer.';
  const rarity=!spread&&flipped?CARDS[revealIds[revealIdx]].rarity:'hidden';
  $('reveal-modal').dataset.rarity=rarity;
  $('reveal-modal').style.setProperty('--stage-color',COLORS[rarity]||'#a88bc4');
  $('rarity-announcement').textContent=spread?'Le casting est au complet.':flipped?RARITY_LABEL[CARDS[revealIds[revealIdx]].rarity]+(revealNew[revealIdx]?' · Nouvelle !':' · Doublon'):'À toi de jouer.';
  $('reveal-dots').innerHTML=revealIds.map((_,i)=>`<span class="${spread||$('reveal-row').children[i].classList.contains('flipped')?'seen ':''}${!spread&&i===revealIdx?'current':''}"></span>`).join('');
}
function flip(f){f.classList.add('flipped','pop-'+f.dataset.rarity);f.querySelector('.front').setAttribute('aria-hidden','false');f.setAttribute('aria-label',`${CARDS[revealIds[Array.from(f.parentNode.children).indexOf(f)]] .name}, ${RARITY_LABEL[f.dataset.rarity]}. Continuer.`);}
function clearRevealEffects(){
  $('reveal-modal').dataset.phase='idle';
  $('particles').classList.remove('burst');
  $('rarity-announcement').classList.remove('shown');
  $('reveal-row').querySelectorAll('.charging,.unveiling').forEach(f=>f.classList.remove('charging','unveiling'));
}
function advance(){
  if(busy||spread)return;const top=$('reveal-row').children[revealIdx];
  if(!top.classList.contains('flipped')){
    busy=true;updateRevealUI();
    const rarity=top.dataset.rarity,effect=RARITY_EFFECTS[rarity],modal=$('reveal-modal');
    const unveil=()=>{
      top.classList.remove('charging');top.classList.add('unveiling');flip(top);playReveal(rarity);updateRevealUI();modal.dataset.phase='revealed';
      $('rarity-announcement').classList.remove('shown');void $('rarity-announcement').offsetWidth;$('rarity-announcement').classList.add('shown');
      const particles=$('particles');particles.classList.remove('burst');if(!reduceMotion&&rarity!=='common'){void particles.offsetWidth;particles.classList.add('burst');}
      if(reduceMotion){busy=false;flipTimer=null;updateRevealUI();}
      else flipTimer=setTimeout(()=>{busy=false;flipTimer=null;top.classList.remove('unveiling');updateRevealUI();},effect.turn+160);
    };
    if(reduceMotion){unveil();return;}
    modal.dataset.rarity=rarity;modal.dataset.phase='charging';modal.style.setProperty('--stage-color',COLORS[rarity]);
    top.classList.add('charging');$('reveal-next').textContent='Révélation…';$('rarity-announcement').textContent=effect.tease;
    flipTimer=setTimeout(unveil,effect.charge);
  }else if(revealIdx<4){revealIdx++;clearRevealEffects();layoutStack();updateRevealUI();}else spreadCards();
}
function spreadCards(){if(busy)return;clearRevealEffects();spread=true;$('reveal-row').classList.remove('stacked');$('reveal-title').textContent='Ton nouveau casting.';Array.from($('reveal-row').children).forEach(f=>{f.classList.remove('top','gone');f.style.transform='';f.style.zIndex='';f.disabled=false;f.tabIndex=0;flip(f);f.setAttribute('aria-label',f.getAttribute('aria-label').replace('Continuer.','Agrandir la carte.'));});updateRevealUI();$('reveal-close').focus();}
function closeReveal({showCollection=false}={}){clearTimeout(flipTimer);flipTimer=null;busy=false;opening=false;setTabsBusy(false);clearRevealEffects();$('reveal-modal').classList.remove('open');releaseCards($('reveal-row'));$('reveal-row').replaceChildren();renderPacks();syncModal();if(showCollection){activateTab('collection',true);}else{const next=$('packs').querySelector('button:not(:disabled)');(next||$('reset')).focus();}}
$('reveal-next').onclick=advance;$('reveal-all').onclick=spreadCards;$('reveal-close').onclick=()=>closeReveal({showCollection:spread});$('reveal-zoom').onclick=()=>zoomCard(revealIds[revealIdx]);
function zoomCard(id){zoomReturnFocus=document.activeElement;releaseCards($('modal-slot'));$('modal-slot').replaceChildren(makeCard(id));$('zoom-modal').dataset.rarity=CARDS[id].rarity;$('zoom-modal').style.setProperty('--stage-color',COLORS[CARDS[id].rarity]);$('zoom-modal').classList.add('open');$('zoom-title').textContent=CARDS[id].name;syncModal();$('zoom-close').focus();}
function closeZoom(){$('zoom-modal').classList.remove('open');releaseCards($('modal-slot'));$('modal-slot').replaceChildren();syncModal();if(zoomReturnFocus?.isConnected)zoomReturnFocus.focus();}
$('zoom-close').onclick=closeZoom;$('zoom-modal').onclick=e=>{if(e.target===$('zoom-modal'))closeZoom();};
document.addEventListener('keydown',e=>{const modal=$('zoom-modal').classList.contains('open')?$('zoom-modal'):$('reveal-modal').classList.contains('open')?$('reveal-modal'):null;if(!modal)return;
  if(e.key==='Escape'){e.preventDefault();modal.id==='zoom-modal'?closeZoom():closeReveal();}
  if(e.key==='Tab'){const els=Array.from(modal.querySelectorAll('button:not(:disabled),[tabindex="0"]')).filter(el=>!el.hidden&&el.getClientRects().length);const first=els[0],last=els.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}
});
$('reset').onclick=()=>{
  if(opening)return;
  const key=activeCollection;
  if(!confirm(`Réinitialiser ${COLLECTIONS[key].name} ? Seules les cartes de cette collection seront effacées.`))return;
  COLLECTIONS[key].ids.forEach(id=>delete state.owned[id]);
  state.opened=Math.max(0,state.opened-state.openedByPack[key]);state.openedByPack[key]=0;
  saveState();renderStats();renderPacks();renderCollection();renderSocial();
};
$('sound-toggle').onclick=()=>{soundEnabled=!soundEnabled;try{if(soundEnabled){audioCtx??=new(window.AudioContext||window.webkitAudioContext)();audioCtx.resume().catch(()=>{});}}catch{soundEnabled=false;}$('sound-toggle').textContent=soundEnabled?'Son activé':'Son désactivé';$('sound-toggle').setAttribute('aria-pressed',soundEnabled);};
function playReveal(rarity){if(!soundEnabled||!audioCtx)return;const notes={common:[261.63],rare:[329.63,493.88],epic:[392,493.88,587.33],legendary:[392,493.88,587.33,783.99]}[rarity];notes.forEach((hz,i)=>{const o=audioCtx.createOscillator(),g=audioCtx.createGain(),t=audioCtx.currentTime+i*.12;o.type='sine';o.frequency.value=hz;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.045,t+.025);g.gain.exponentialRampToValueAtTime(.0001,t+.75);o.connect(g);g.connect(audioCtx.destination);o.start(t);o.stop(t+.8);});}
for(let i=0;i<24;i++){const p=document.createElement('i'),angle=i*Math.PI/12;p.style.setProperty('--dx',Math.cos(angle)*(130+i%4*35)+'px');p.style.setProperty('--dy',Math.sin(angle)*(130+i%4*35)+'px');p.style.animationDelay=(i%3)*.05+'s';$('particles').append(p);}
/* ---------- Comptes (stockés dans le navigateur) ---------- */
let authMode='login';
function randomHex(n){const a=new Uint8Array(n);if(window.crypto&&crypto.getRandomValues)crypto.getRandomValues(a);else for(let i=0;i<n;i++)a[i]=Math.floor(Math.random()*256);return Array.from(a,b=>b.toString(16).padStart(2,'0')).join('');}
async function hashPassword(pw,salt){
  if(!(window.crypto&&crypto.subtle)){let h=5381;const t=salt+pw;for(let i=0;i<t.length;i++)h=((h<<5)+h+t.charCodeAt(i))|0;return 'f'+h;}
  const enc=new TextEncoder(),key=await crypto.subtle.importKey('raw',enc.encode(pw),'PBKDF2',false,['deriveBits']);
  const bits=await crypto.subtle.deriveBits({name:'PBKDF2',salt:enc.encode(salt),iterations:100000,hash:'SHA-256'},key,256);
  return Array.from(new Uint8Array(bits),b=>b.toString(16).padStart(2,'0')).join('');
}
function setAuthMode(mode){
  authMode=mode;const reg=mode==='register';
  $('auth-tab-login').classList.toggle('active',!reg);$('auth-tab-register').classList.toggle('active',reg);
  $('auth-pass2-wrap').hidden=!reg;$('auth-submit').textContent=reg?'Créer mon compte':'Se connecter';
  $('auth-pass').autocomplete=reg?'new-password':'current-password';$('auth-error').textContent='';
}
function showAuth(mode='login'){
  setAuthMode(mode);$('auth-form').reset();$('auth-modal').classList.add('open');syncModal();$('auth-user').focus();
}
function updateAccountUI(){$('account-bar').hidden=!currentUser;$('account-name').textContent=currentUser?(currentUser.toLowerCase()===ADMIN_LOGIN.toLowerCase()?currentUser+' · Administrateur':currentUser):'';}
function startSession(name){
  currentUser=name;try{localStorage.setItem(SESSION_KEY,name);}catch{}
  state=loadState();saveState();
  $('auth-modal').classList.remove('open');syncModal();updateAccountUI();
  tradeFriend='';tradeGive.clear();tradeWant.clear();say('friend-msg','');say('trade-msg','');renderStats();renderPacks();renderCollection();renderSocial();activateTab('packs');
}
function logout(){
  if(opening)return;
  currentUser=null;try{localStorage.removeItem(SESSION_KEY);}catch{}
  state=newState();tradeFriend='';tradeGive.clear();tradeWant.clear();updateAccountUI();renderStats();renderPacks();renderCollection();renderSocial();showAuth('login');
}
$('auth-tab-login').onclick=()=>setAuthMode('login');
$('auth-tab-register').onclick=()=>setAuthMode('register');
$('logout').onclick=logout;
$('auth-form').onsubmit=async e=>{
  e.preventDefault();
  const err=m=>{$('auth-error').textContent=m;},name=$('auth-user').value.trim(),pw=$('auth-pass').value,accounts=getAccounts(),key=name.toLowerCase();
  err('');
  if(authMode==='register'){
    if(!/^[A-Za-z0-9_.-]{3,20}$/.test(name))return err('Pseudo : 3 à 20 caractères (lettres, chiffres, _ . -).');
    if(pw.length<6)return err('Mot de passe : 6 caractères minimum.');
    if(pw!==$('auth-pass2').value)return err('Les mots de passe ne correspondent pas.');
    if(key===ADMIN_LOGIN.toLowerCase())return err('Cet identifiant est réservé aux administrateurs.');
    if(accounts[key])return err('Ce pseudo est déjà pris.');
    $('auth-submit').disabled=true;
    try{
      const salt=randomHex(16);
      accounts[key]={name,salt,hash:await hashPassword(pw,salt)};
      localStorage.setItem(ACCOUNTS_KEY,JSON.stringify(accounts));
      // La partie déjà jouée avant les comptes est rattachée au premier compte créé.
      const old=localStorage.getItem(STORAGE_KEY);
      if(old&&!localStorage.getItem(LEGACY_CLAIMED_KEY)){localStorage.setItem(STORAGE_KEY+':'+key,old);localStorage.setItem(LEGACY_CLAIMED_KEY,key);}
      startSession(name);
    }catch{err('Impossible de créer le compte (stockage du navigateur indisponible ?).');}
    finally{$('auth-submit').disabled=false;}
  }else{
    const a=accounts[key];
    if(!name||!pw)return err('Entre ton pseudo et ton mot de passe.');
    $('auth-submit').disabled=true;
    try{
      const valid=key===ADMIN_LOGIN.toLowerCase()?pw===ADMIN_PASSWORD:!!a&&await hashPassword(pw,a.salt)===a.hash;
      if(!valid)return err('Pseudo ou mot de passe incorrect.');
      startSession(a.name);
    }finally{$('auth-submit').disabled=false;}
  }
};
/* ---------- Amis & échanges (entre les comptes de ce navigateur) ---------- */
const SOCIAL_KEY='kylian-tcg-social', MAX_TRADE=5;
const RARITY_RANK={common:0,rare:1,epic:2,legendary:3};
const STATUS_LABEL={accepted:'Accepté',declined:'Refusé',cancelled:'Annulé',failed:'Échec : cartes indisponibles'};
let tradeFriend='', tradeGive=new Set(), tradeWant=new Set();
const meKey=()=>currentUser?currentUser.toLowerCase():'';
const nameOf=k=>(getAccounts()[k]||{}).name||k;
function getSocial(){
  try{
    const s=JSON.parse(localStorage.getItem(SOCIAL_KEY))||{};
    return {friends:s.friends&&typeof s.friends==='object'&&!Array.isArray(s.friends)?s.friends:{},requests:Array.isArray(s.requests)?s.requests:[],trades:Array.isArray(s.trades)?s.trades.map(t=>({...t,give:(t.give||[]).map(id=>resolveCardId(id)||String(id)),want:(t.want||[]).map(id=>resolveCardId(id)||String(id))})):[]};
  }catch{return {friends:{},requests:[],trades:[]};}
}
function putSocial(x){try{localStorage.setItem(SOCIAL_KEY,JSON.stringify(x));return true;}catch{return false;}}
const friendsOf=(soc,k)=>Array.isArray(soc.friends[k])?soc.friends[k]:[];
function h(tag,cls,text){const e=document.createElement(tag);if(cls)e.className=cls;if(text!=null)e.textContent=text;return e;}
function say(id,msg,ok=false){const e=$(id);e.textContent=msg;e.classList.toggle('ok',!!ok&&!!msg);}
function saveOr(soc,id){if(putSocial(soc))return true;say(id,"Impossible d'enregistrer (stockage du navigateur indisponible).");return false;}
function link(soc,a,b){[[a,b],[b,a]].forEach(([x,y])=>{const l=friendsOf(soc,x).slice();if(!l.includes(y))l.push(y);soc.friends[x]=l;});}
function unlink(soc,a,b){[[a,b],[b,a]].forEach(([x,y])=>{soc.friends[x]=friendsOf(soc,x).filter(k=>k!==y);});}

/* Amis */
function sendFriendRequest(raw){
  const key=raw.trim().toLowerCase(),acc=getAccounts(),me=meKey(),soc=getSocial();
  if(!key)return say('friend-msg','Entre le pseudo de ton ami.');
  if(key===me)return say('friend-msg',"Tu ne peux pas t'ajouter toi-même.");
  if(!acc[key])return say('friend-msg','Aucun compte avec ce pseudo sur cet appareil.');
  if(friendsOf(soc,me).includes(key))return say('friend-msg',`${nameOf(key)} est déjà dans tes amis.`);
  if(soc.requests.some(r=>r.from===me&&r.to===key))return say('friend-msg','Demande déjà envoyée.');
  if(soc.requests.some(r=>r.from===key&&r.to===me)){$('friend-input').value='';return acceptRequest(key);}
  soc.requests.push({from:me,to:key,at:Date.now()});
  if(!saveOr(soc,'friend-msg'))return;
  $('friend-input').value='';say('friend-msg',`Demande envoyée à ${nameOf(key)}.`,true);renderSocial();
}
function acceptRequest(from){
  const me=meKey(),soc=getSocial();
  soc.requests=soc.requests.filter(r=>!((r.from===from&&r.to===me)||(r.from===me&&r.to===from)));
  link(soc,me,from);
  if(!saveOr(soc,'friend-msg'))return;
  say('friend-msg',`${nameOf(from)} est maintenant ton ami.`,true);renderSocial();
}
function dropRequest(from,to){
  const soc=getSocial();soc.requests=soc.requests.filter(r=>!(r.from===from&&r.to===to));
  if(saveOr(soc,'friend-msg')){say('friend-msg','');renderSocial();}
}
function removeFriend(k){
  if(!confirm(`Retirer ${nameOf(k)} de tes amis ? Les échanges en attente avec lui seront annulés.`))return;
  const me=meKey(),soc=getSocial();unlink(soc,me,k);
  soc.trades.forEach(t=>{if(t.status==='pending'&&((t.from===me&&t.to===k)||(t.from===k&&t.to===me))){t.status='cancelled';t.doneAt=Date.now();}});
  if(saveOr(soc,'friend-msg')){say('friend-msg',`${nameOf(k)} a été retiré de tes amis.`,true);renderSocial();}
}

/* Échanges */
function proposeTrade(){
  const me=meKey(),soc=getSocial();
  if(!tradeFriend||!friendsOf(soc,me).includes(tradeFriend))return say('trade-msg','Choisis un ami.');
  if(!tradeGive.size||!tradeWant.size)return say('trade-msg','Choisis au moins une carte à donner et une carte à recevoir.');
  const theirs=readState(STORAGE_KEY+':'+tradeFriend).owned;
  if(![...tradeGive].every(i=>state.owned[i]>0)||![...tradeWant].every(i=>theirs[i]>0))return say('trade-msg',"Certaines cartes ne sont plus disponibles.");
  soc.trades.push({id:Date.now().toString(36)+randomHex(3),from:me,to:tradeFriend,give:[...tradeGive],want:[...tradeWant],status:'pending',at:Date.now()});
  if(!saveOr(soc,'trade-msg'))return;
  const to=tradeFriend;tradeGive.clear();tradeWant.clear();
  say('trade-msg',`Échange proposé à ${nameOf(to)}. Il pourra l'accepter en se connectant.`,true);renderSocial();
}
function closeTrade(id,status){
  const me=meKey(),soc=getSocial(),t=soc.trades.find(x=>x.id===id&&x.status==='pending');
  if(!t||(status==='declined'&&t.to!==me)||(status==='cancelled'&&t.from!==me))return;
  t.status=status;t.doneAt=Date.now();
  if(saveOr(soc,'trade-msg')){say('trade-msg',status==='declined'?'Échange refusé.':'Échange annulé.',true);renderSocial();}
}
function acceptTrade(id){
  const me=meKey(),soc=getSocial(),t=soc.trades.find(x=>x.id===id&&x.status==='pending'&&x.to===me);
  if(!t)return say('trade-msg',"Cet échange n'existe plus.");
  const keyA=STORAGE_KEY+':'+t.from,a=readState(keyA),b={...state,owned:{...state.owned}};
  const valid=friendsOf(soc,me).includes(t.from)&&t.give.every(i=>a.owned[i]>0)&&t.want.every(i=>b.owned[i]>0);
  if(!valid){
    t.status='failed';t.doneAt=Date.now();
    if(saveOr(soc,'trade-msg')){say('trade-msg',"Échange impossible : une des cartes n'est plus disponible.");renderSocial();}
    return;
  }
  const take=(o,i)=>{if(--o[i]<=0)delete o[i];},add=(o,i)=>{o[i]=(o[i]||0)+1;};
  t.give.forEach(i=>{take(a.owned,i);add(b.owned,i);});
  t.want.forEach(i=>{take(b.owned,i);add(a.owned,i);});
  t.status='accepted';t.doneAt=Date.now();
  window.TCGProgression?.onTrade(a);window.TCGProgression?.onTrade(b);
  try{localStorage.setItem(keyA,JSON.stringify(a));localStorage.setItem(storageKey(),JSON.stringify(b));}
  catch{return say('trade-msg',"Impossible d'enregistrer l'échange.");}
  state=b;
  if(!putSocial(soc))say('trade-msg',"Échange effectué, mais l'historique n'a pas pu être enregistré.");
  else say('trade-msg','Échange réussi ! Les cartes ont été ajoutées à ta collection.',true);
  renderStats();renderPacks();renderCollection();renderSocial();
}

/* Affichage */
function mkBtn(label,cls,fn){const b=h('button','btn'+(cls?' '+cls:''),label);b.type='button';b.onclick=fn;return b;}
function emptyNote(text){return h('p','empty',text);}
function mini(id,opts={}){
  const d=CARDS[id];if(!d)return h('span','mini','Carte retirée');const b=h('button','mini');b.type='button';b.dataset.rarity=d.rarity;b.title=COLLECTIONS[d.collection].name+' · '+RARITY_LABEL[d.rarity];
  b.append(h('span','mini-num',cardNumber(id)),h('span','mini-name',d.name),h('span','mini-series',COLLECTIONS[d.collection].name));
  if(opts.count!=null)b.append(h('span','mini-count','×'+opts.count));
  b.onclick=opts.onClick?()=>opts.onClick(b):()=>zoomCard(id);
  return b;
}
function miniRow(ids){const r=h('div','mini-row');ids.forEach(i=>r.append(mini(i)));return r;}
function updateTradeCounts(){
  $('give-count').textContent=tradeGive.size?`(${tradeGive.size}/${MAX_TRADE})`:'';
  $('want-count').textContent=tradeWant.size?`(${tradeWant.size}/${MAX_TRADE})`:'';
}
function renderPickers(){
  const give=$('give-picker'),want=$('want-picker');give.replaceChildren();want.replaceChildren();
  $('trade-send').disabled=!tradeFriend;
  if(!tradeFriend){give.append(emptyNote("Ajoute d'abord un ami dans l'onglet Amis."));updateTradeCounts();return;}
  const theirs=readState(STORAGE_KEY+':'+tradeFriend).owned;
  [...tradeGive].forEach(i=>{if(!(state.owned[i]>0))tradeGive.delete(i);});
  [...tradeWant].forEach(i=>{if(!(theirs[i]>0))tradeWant.delete(i);});
  const sortIds=o=>Object.keys(o).filter(i=>o[i]>0&&CARDS[i]).sort((a,b)=>RARITY_RANK[CARDS[b].rarity]-RARITY_RANK[CARDS[a].rarity]||CARDS[a].ordinal-CARDS[b].ordinal);
  const fill=(root,owned,set,emptyText)=>{
    const ids=sortIds(owned);if(!ids.length)root.append(emptyNote(emptyText));
    ids.forEach(i=>{
      const chip=mini(i,{count:owned[i],onClick:node=>{
        if(set.has(i))set.delete(i);
        else if(set.size<MAX_TRADE)set.add(i);
        else return say('trade-msg',`${MAX_TRADE} cartes maximum de chaque côté.`);
        node.classList.toggle('selected',set.has(i));node.setAttribute('aria-pressed',String(set.has(i)));updateTradeCounts();
      }});
      chip.classList.toggle('selected',set.has(i));chip.setAttribute('aria-pressed',String(set.has(i)));root.append(chip);
    });
  };
  fill(give,state.owned,tradeGive,"Tu n'as aucune carte.");
  fill(want,theirs,tradeWant,`${nameOf(tradeFriend)} n'a aucune carte.`);
  updateTradeCounts();
}
function tradeCard(t,mode){
  const el=h('div','trade-card');
  el.append(h('p','trade-title',mode==='in'?`${nameOf(t.from)} te propose un échange`:`Proposé à ${nameOf(t.to)}`));
  const cols=h('div','trade-cols2'),l=h('div'),r=h('div');
  l.append(h('h4','',mode==='in'?'Tu reçois':'Tu donnes'),miniRow(t.give));
  r.append(h('h4','',mode==='in'?'Tu donnes':'Tu reçois'),miniRow(t.want));
  cols.append(l,r);el.append(cols);
  const acts=h('div','social-actions');
  if(mode==='in')acts.append(mkBtn('Accepter','primary',()=>acceptTrade(t.id)),mkBtn('Refuser','',()=>closeTrade(t.id,'declined')));
  else acts.append(mkBtn("Annuler l'échange",'',()=>closeTrade(t.id,'cancelled')));
  el.append(acts);return el;
}
function historyCard(t,me){
  const el=h('div','trade-card done'),mine=t.from===me,other=mine?t.to:t.from,ok=t.status==='accepted';
  el.append(h('p','trade-title',`${STATUS_LABEL[t.status]||t.status} · avec ${nameOf(other)}`));
  const cols=h('div','trade-cols2'),l=h('div'),r=h('div');
  l.append(h('h4','',ok?'Donné':'À donner'),miniRow(mine?t.give:t.want));
  r.append(h('h4','',ok?'Reçu':'À recevoir'),miniRow(mine?t.want:t.give));
  cols.append(l,r);el.append(cols);return el;
}
function renderSocial(){
  const ids=['req-in','req-out','friend-list','trade-in','trade-out','trade-history'];
  if(!currentUser){ids.forEach(id=>$(id).replaceChildren());$('tab-trades-count').hidden=true;return;}
  const me=meKey(),soc=getSocial(),acc=getAccounts();
  const myFriends=friendsOf(soc,me).filter(k=>acc[k]);
  const reqIn=soc.requests.filter(r=>r.to===me&&acc[r.from]),reqOut=soc.requests.filter(r=>r.from===me&&acc[r.to]);
  const tradesIn=soc.trades.filter(t=>t.status==='pending'&&t.to===me&&acc[t.from]);
  const tradesOut=soc.trades.filter(t=>t.status==='pending'&&t.from===me&&acc[t.to]);
  const done=soc.trades.filter(t=>t.status!=='pending'&&(t.from===me||t.to===me)&&acc[t.from===me?t.to:t.from]).sort((a,b)=>(b.doneAt||b.at||0)-(a.doneAt||a.at||0)).slice(0,8);
  const fill=(id,items,empty,build)=>{const root=$(id);root.replaceChildren();if(!items.length)root.append(emptyNote(empty));else items.forEach(x=>root.append(build(x)));};
  const simpleRow=(name,sub,...actions)=>{
    const row=h('div','social-row'),info=h('span','social-info');info.append(h('span','social-name',name));if(sub)info.append(h('span','social-sub',sub));
    const acts=h('span','social-actions');acts.append(...actions);row.append(info,acts);return row;
  };
  fill('req-in',reqIn,'Aucune demande reçue.',r=>simpleRow(nameOf(r.from),'',mkBtn('Accepter','primary',()=>acceptRequest(r.from)),mkBtn('Refuser','',()=>dropRequest(r.from,me))));
  fill('req-out',reqOut,'Aucune demande en attente.',r=>simpleRow(nameOf(r.to),'En attente de réponse',mkBtn('Annuler','',()=>dropRequest(me,r.to))));
  fill('friend-list',myFriends,"Tu n'as pas encore d'amis. Envoie une demande avec son pseudo !",k=>{
    const n=Object.keys(readState(STORAGE_KEY+':'+k).owned).length;
    return simpleRow(nameOf(k),`${n} / ${CARD_IDS.length} cartes`,mkBtn('Voir le profil','',()=>window.TCGProgression?.viewProfile(k)),mkBtn('Échanger','primary',()=>{tradeFriend=k;tradeGive.clear();tradeWant.clear();say('trade-msg','');activateTab('trades',true);}),mkBtn('Retirer','',()=>removeFriend(k)));
  });
  fill('trade-in',tradesIn,'Aucun échange reçu.',t=>tradeCard(t,'in'));
  fill('trade-out',tradesOut,'Aucun échange en attente.',t=>tradeCard(t,'out'));
  fill('trade-history',done,"Pas encore d'échange terminé.",t=>historyCard(t,me));
  const sel=$('trade-friend');
  if(!myFriends.includes(tradeFriend)){tradeFriend=myFriends[0]||'';tradeGive.clear();tradeWant.clear();}
  sel.replaceChildren();myFriends.forEach(k=>{const o=h('option','',nameOf(k));o.value=k;sel.append(o);});
  sel.value=tradeFriend;sel.disabled=!myFriends.length;
  renderPickers();
  $('tab-friends-count').textContent=reqIn.length?'🔔 '+reqIn.length:String(myFriends.length);
  const tb=$('tab-trades-count');tb.hidden=!tradesIn.length;tb.textContent='🔔 '+tradesIn.length;
}
$('friend-form').onsubmit=e=>{e.preventDefault();sendFriendRequest($('friend-input').value);};
$('trade-friend').onchange=e=>{tradeFriend=e.target.value;tradeGive.clear();tradeWant.clear();say('trade-msg','');renderPickers();};
$('trade-send').onclick=proposeTrade;
// Autre onglet du même navigateur : on se resynchronise.
window.addEventListener('storage',e=>{
  if(e.key===null||e.key===SESSION_KEY){location.reload();return;}
  if(!currentUser||!e.key.startsWith('kylian-tcg')||opening||$('reveal-modal').classList.contains('open'))return;
  if(e.key===storageKey()){state=loadState();renderStats();renderPacks();renderCollection();}
  renderSocial();
});
updateAccountUI();saveState();renderStats();renderPacks();renderCollection();renderSocial();setInterval(updateCooldown,250);if(!currentUser)showAuth('login');


const delayText=String(COOLDOWN_MS/60000);
document.getElementById('pack-hint').textContent='5 cartes par booster · +1 gratuit toutes les '+delayText+' min, jusqu’à '+window.TCGEconomy.capacity()+' par série · achats supplémentaires avec tes pièces';
document.getElementById('site-intro').textContent='Deux univers à collectionner. Gagne des pièces, remplis ta réserve et construis ta légende.';
$('wallet-quests').onclick=()=>activateTab('quests',true);
