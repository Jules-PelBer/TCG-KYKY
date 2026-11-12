/* Profils, vitrine, quêtes et rebirths. Aucun accès Supabase dans cette édition locale. */
(() => {
  'use strict';
  const config=window.TCG_PROGRESSION||{}, levels=config.rebirths||[];
  const slots=Math.max(1,Math.min(6,Number(config.vitrinePlaces)||6));
  const tiers=[
    {at:0,name:'Nouvelle recrue',symbol:'◇'},
    {at:10,name:'Chasseur de Kylian',symbol:'✧'},
    {at:25,name:'Collectionneur confirmé',symbol:'✦'},
    {at:50,name:'Archiviste épique',symbol:'❖'},
    {at:75,name:'Gardien des légendes',symbol:'♜'},
    {at:100,name:'Maître des collections',symbol:'♛'}
  ];
  const questPool=[
    {id:'first',title:'Le rituel du jour',desc:'Ouvre 1 booster.',metric:'packs',target:1,xp:40,coins:30},
    {id:'three',title:'Jamais deux sans trois',desc:'Ouvre 3 boosters.',metric:'packs',target:3,xp:80,coins:75},
    {id:'duplicates',title:'Encore toi ?',desc:'Obtiens 5 doublons dans les boosters.',metric:'duplicates',target:5,xp:70,coins:50},
    {id:'rare',title:'Ça commence à briller',desc:'Tire 3 cartes rares ou mieux.',metric:'rare',target:3,xp:70,coins:60},
    {id:'both',title:'Un pied dans chaque univers',desc:'Ouvre 1 booster de chaque série.',metric:'both',target:2,xp:60,coins:50},
    {id:'ten',title:'Petite moisson',desc:'Obtiens 10 cartes dans les boosters.',metric:'cards',target:10,xp:60,coins:60},
    {id:'original2',title:'Retour aux origines',desc:'Ouvre 2 boosters de la collection originale.',metric:'original',target:2,xp:70,coins:60},
    {id:'anime2',title:'Épisode suivant',desc:'Ouvre 2 boosters Duo animé.',metric:'anime',target:2,xp:70,coins:60},
    {id:'free2',title:'Cadeau de la maison',desc:'Ouvre 2 boosters gratuits.',metric:'free',target:2,xp:50,coins:50},
    {id:'twenty',title:'La moisson de Kylian',desc:'Obtiens 20 cartes dans les boosters.',metric:'cards',target:20,xp:100,coins:90},
    {id:'dup10',title:'La photocopieuse',desc:'Obtiens 10 doublons dans les boosters.',metric:'duplicates',target:10,xp:100,coins:80},
    {id:'epic',title:'Éclat violet',desc:'Tire 1 carte épique ou légendaire.',metric:'epic',target:1,xp:90,coins:70},
    {id:'six',title:'Le grand déballage',desc:'Ouvre 6 boosters.',metric:'packs',target:6,xp:140,coins:120},
    {id:'rare8',title:'Une journée brillante',desc:'Tire 8 cartes rares ou mieux.',metric:'rare',target:8,xp:120,coins:100}
  ];
  const weeklyPool=[
    {id:'week-packs',scope:'weekly',title:'Le rendez-vous des collectionneurs',desc:'Ouvre 15 boosters cette semaine.',metric:'packs',target:15,xp:300,coins:250},
    {id:'week-rare',scope:'weekly',title:'Les pépites de la semaine',desc:'Tire 20 cartes rares ou mieux cette semaine.',metric:'rare',target:20,xp:350,coins:300},
    {id:'week-cards',scope:'weekly',title:'Cent nouvelles chances',desc:'Obtiens 100 cartes dans les boosters cette semaine.',metric:'cards',target:100,xp:400,coins:350}
  ];
  const collectionPool=[
    {id:'unique10',scope:'collection',title:'Début de collection',desc:'Possède 10 cartes différentes.',metric:'unique',target:10,xp:100,coins:100},
    {id:'unique25',scope:'collection',title:'Ça prend de la place',desc:'Possède 25 cartes différentes.',metric:'unique',target:25,xp:180,coins:150},
    {id:'unique50',scope:'collection',title:'L’archiviste',desc:'Possède 50 cartes différentes.',metric:'unique',target:50,xp:300,coins:250},
    {id:'firstlegend',scope:'collection',title:'La première légende',desc:'Possède une carte légendaire.',metric:'legendOwned',target:1,xp:120,coins:100},
    {id:'firstprestige',scope:'collection',title:'Le premier rituel',desc:'Atteins le prestige 1.',metric:'prestige',target:1,xp:200,coins:200},
    {id:'showcase3',scope:'collection',title:'Commissaire d’exposition',desc:'Expose 3 cartes dans ta vitrine.',metric:'showcase',target:3,xp:60,coins:60}
  ];
  const levelRanks=[{at:1,name:'Recrue'},{at:5,name:'Éclaireur'},{at:10,name:'Élite'},{at:20,name:'Champion'},{at:35,name:'Maître'},{at:50,name:'Mythique'},{at:100,name:'Transcendant'}];
  const prestigeNames=['Sans prestige','Bronze','Argent','Or','Astral','Souverain'];
  let viewedUser=null, editing=false, noticeTimer, pendingAvatar=null;
  const num=n=>Number.isSafeInteger(n)&&n>=0?n:0;
  const day=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Paris',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
  function dailyQuests(date=day()){
    let hash=0;for(const c of date)hash=(hash*31+c.charCodeAt(0))>>>0;
    // Garder les quatre missions de la version précédente et ajouter quatre nouvelles.
    const old=questPool.slice(1,6),start=hash%old.length;
    const first=[questPool[0],...Array.from({length:3},(_,i)=>old[(start+i)%old.length])];
    const extra=questPool.filter(q=>!first.includes(q)),offset=hash%extra.length;
    return [...first,...Array.from({length:4},(_,i)=>extra[(offset+i)%extra.length])];
  }
  function weekId(date=day()){const d=new Date(date+'T12:00:00Z');d.setUTCDate(d.getUTCDate()-(d.getUTCDay()+6)%7);return d.toISOString().slice(0,10);}
  function freshCounters(date){return {date,packs:0,cards:0,duplicates:0,rare:0,epic:0,original:0,anime:0,free:0,paid:0,series:[],claimed:[]};}
  const counterKeys=['packs','cards','duplicates','rare','epic','original','anime','free','paid'];
  function normalizeCounters(raw,date,quests){
    if(!raw||raw.date!==date)raw=freshCounters(date);
    counterKeys.forEach(k=>raw[k]=num(raw[k]));
    raw.series=[...new Set(Array.isArray(raw.series)?raw.series:[])].filter(k=>COLLECTIONS[k]);
    raw.claimed=[...new Set(Array.isArray(raw.claimed)?raw.claimed:[])].filter(id=>quests.some(q=>q.id===id));return raw;
  }
  function ensure(s){
    const raw=s.progression&&typeof s.progression==='object'?s.progression:{};
    if(!raw.profile||typeof raw.profile!=='object')raw.profile={};
    raw.profile.displayName=typeof raw.profile.displayName==='string'?raw.profile.displayName.slice(0,24):'';
    raw.profile.bio=typeof raw.profile.bio==='string'?raw.profile.bio.slice(0,240):'';
    raw.profile.avatar=typeof raw.profile.avatar==='string'&&/^data:image\/(png|jpeg|webp);base64,/.test(raw.profile.avatar)&&raw.profile.avatar.length<400000?raw.profile.avatar:'';
    raw.profile.accent=['violet','ocean','gold','rose'].includes(raw.profile.accent)?raw.profile.accent:'violet';
    raw.prestige=Math.min(levels.length,num(raw.prestige));raw.xp=num(raw.xp);
    raw.showcase=[...new Set(Array.isArray(raw.showcase)?raw.showcase:[])].filter(id=>CARDS[id]&&s.owned[id]>0).slice(0,slots);
    raw.daily=normalizeCounters(raw.daily,day(),questPool);
    raw.weekly=normalizeCounters(raw.weekly,weekId(),weeklyPool);
    raw.contracts=[...new Set(Array.isArray(raw.contracts)?raw.contracts:[])].filter(id=>collectionPool.some(q=>q.id===id));
    raw.honors=Array.isArray(raw.honors)?raw.honors:[];
    const unlocked=honorDefinitions(s,raw).filter(x=>x.test).map(x=>x.id);
    raw.honors=[...new Set([...raw.honors,...unlocked])];
    s.progression=raw;return raw;
  }
  function collectionBadge(s){
    const count=CARD_IDS.filter(id=>s.owned[id]>0).length,percent=CARD_IDS.length?count/CARD_IDS.length*100:0;
    const tier=[...tiers].reverse().find(t=>percent>=t.at)||tiers[0];
    return {count,percent,tier,next:tiers.find(t=>t.at>percent)};
  }
  function progressOf(q,p,s=state){
    if(q.scope==='collection'){
      if(q.metric==='unique')return CARD_IDS.filter(id=>s.owned[id]>0).length;
      if(q.metric==='legendOwned')return CARD_IDS.filter(id=>s.owned[id]>0&&CARDS[id].rarity==='legendary').length;
      if(q.metric==='prestige')return p.prestige;if(q.metric==='showcase')return p.showcase.length;return 0;
    }
    const d=q.scope==='weekly'?p.weekly:p.daily;return q.metric==='both'?d.series.length:d[q.metric]||0;
  }
  function claims(q,p){return q.scope==='weekly'?p.weekly.claimed:q.scope==='collection'?p.contracts:p.daily.claimed;}
  function allQuests(){return [...dailyQuests(),...weeklyPool,...collectionPool];}
  function onPack(s,series,ids,isNew,mode='free'){
    const p=ensure(s);
    for(const d of [p.daily,p.weekly]){
      d.packs++;d.cards+=ids.length;d[series]++;d[mode]++;
      d.duplicates+=isNew.filter(v=>!v).length;
      d.rare+=ids.filter(id=>CARDS[id]&&CARDS[id].rarity!=='common').length;
      d.epic+=ids.filter(id=>CARDS[id]&&['epic','legendary'].includes(CARDS[id].rarity)).length;
      if(!d.series.includes(series))d.series.push(series);
    }
  }
  function onTrade(s){ensure(s);}
  function announce(text){
    const node=$('progression-notice');node.textContent=text;node.classList.add('visible');
    clearTimeout(noticeTimer);noticeTimer=setTimeout(()=>node.classList.remove('visible'),6000);
  }
  function persistChange(fn){
    if(!currentUser||opening||$('reveal-modal').classList.contains('open'))return false;
    const old=JSON.stringify(state);fn();
    if(!saveState()){state=JSON.parse(old);announce('Sauvegarde impossible : espace du navigateur insuffisant. Aucun changement appliqué.');return false;}
    renderStats();renderPacks();renderCollection();renderSocial();return true;
  }
  function claimQuest(id){
    const p=ensure(state),q=allQuests().find(q=>q.id===id);
    if(!q||claims(q,p).includes(id)||progressOf(q,p)<q.target)return false;
    const ok=persistChange(()=>{claims(q,p).push(id);p.xp+=q.xp;window.TCGEconomy.award(state,q.coins);});
    if(ok)announce('Quête validée ! +'+q.xp+' XP et +'+q.coins+' pièces.');return ok;
  }
  function requirements(s,index=ensure(s).prestige){
    const goal=levels[index];if(!goal)return {goal:null,cards:[],ready:false};
    const counts=new Map();let invalid=!Array.isArray(goal.cards)||!goal.cards.length;
    for(const item of goal.cards||[]){if(!CARDS[item.id]||!Number.isSafeInteger(item.count)||item.count<1)invalid=true;counts.set(item.id,(counts.get(item.id)||0)+item.count);}
    const cards=[...counts].map(([id,count])=>({id,count,have:s.owned[id]||0}));
    return {goal,cards,invalid,ready:!invalid&&cards.every(c=>c.have>=c.count)};
  }
  function performRebirth(expectedIndex){
    const p=ensure(state);if(p.prestige!==expectedIndex)return false;
    const req=requirements(state);if(!req.ready)return false;
    const summary=req.cards.map(c=>c.count+' × '+CARDS[c.id].name).join('\n');
    if(!confirm('Passer au prestige '+(p.prestige+1)+' ?\n\nCes exemplaires seront définitivement consommés :\n'+summary+'\n\nToutes les autres cartes, les XP et les délais sont conservés.'))return false;
    // Revalidation immédiate avant la consommation (et protection contre un double clic).
    if(ensure(state).prestige!==expectedIndex||!requirements(state).ready)return false;
    const ok=persistChange(()=>{
      req.cards.forEach(c=>{state.owned[c.id]-=c.count;if(!state.owned[c.id])delete state.owned[c.id];});
      p.prestige++;p.xp+=num(req.goal.xp);ensure(state);
    });
    if(ok)announce('Prestige '+ensure(state).prestige+' débloqué ! Seules les cartes indiquées ont été consommées.');return ok;
  }
  function meter(value,max,label){const el=h('progress');el.max=Math.max(1,max);el.value=value;el.setAttribute('aria-label',label);return el;}
  function heading(kicker,title,sub){const box=h('div','feature-heading');box.append(h('p','eyebrow',kicker),h('h2','',title),h('p','feature-sub',sub));return box;}
  function labelBadge(text,cls=''){return h('span','player-badge '+cls,text);}
  function levelTier(level){return Math.max(0,levelRanks.findLastIndex(r=>level>=r.at));}
  function rankEmblem(kind,value){
    const tier=kind==='level'?levelTier(value):Math.min(5,num(value));
    const mark=h('span','rank-emblem');mark.dataset.kind=kind;mark.dataset.tier=tier;
    const title=kind==='level'?'Niveau '+value+' · '+levelRanks[tier].name:'Prestige '+value+' · '+prestigeNames[tier];
    mark.setAttribute('role','img');mark.setAttribute('aria-label',title);mark.title=title;
    const wings=tier>=2?'<path d="M25 30 7 21l5 12 12 7M55 30l18-9-5 12-12 7" fill="currentColor" opacity=".65"/>':'';
    const feathers=tier>=4?'<path d="M22 41 5 33l8 17 13 6M58 41l17-8-8 17-13 6" fill="currentColor" opacity=".45"/>':'';
    const rays=tier>=5?'<path d="m40 3 3 9h-6Zm-27 9 6 6-5 4Zm54 0-6 6 5 4ZM5 57l12-3-3 7Zm70 0-12-3 3 7Z" fill="currentColor"/>':'';
    const crown=tier>=3?'<path d="m28 23-3-11 10 5 5-9 5 9 10-5-3 11Z" fill="currentColor"/>':'';
    const stars=Array.from({length:Math.min(5,tier)},(_,i)=>'<circle cx="'+(40+(i-(Math.min(5,tier)-1)/2)*7)+'" cy="69" r="2" fill="currentColor"/>').join('');
    mark.innerHTML='<svg viewBox="0 0 80 80" aria-hidden="true" focusable="false">'+rays+wings+feathers+'<path d="m40 17 19 9v19c0 12-19 21-19 21S21 57 21 45V26Z" fill="currentColor" opacity=".13" stroke="currentColor" stroke-width="2"/>'+crown+'<path d="m40 28 10 12-10 14-10-14Z" fill="currentColor" opacity=".9"/><path d="m40 28 0 26 10-14Z" fill="#fff" opacity=".3"/>'+stars+'</svg>';return mark;
  }
  function rankBadge(kind,value){
    const tier=kind==='level'?levelTier(value):Math.min(5,num(value));
    const badge=h('span','player-badge rank-badge');badge.dataset.kind=kind;badge.dataset.tier=tier;
    badge.append(rankEmblem(kind,value),h('span','',kind==='level'?'Niv. '+value+' · '+levelRanks[tier].name:'P'+value+' · '+prestigeNames[tier]));return badge;
  }
  function honorDefinitions(s,p){
    const unique=CARD_IDS.filter(id=>s.owned[id]>0).length;
    const legends=CARD_IDS.filter(id=>s.owned[id]>0&&CARDS[id].rarity==='legendary').length;
    return [
      {id:'first10',icon:'✧',name:'Premières pépites',desc:'Réunir 10 cartes uniques.',test:unique>=10},
      {id:'archive25',icon:'❖',name:'Archiviste',desc:'Réunir 25 cartes uniques.',test:unique>=25},
      {id:'archive50',icon:'♜',name:'Grand conservateur',desc:'Réunir 50 cartes uniques.',test:unique>=50},
      {id:'legend',icon:'♛',name:'Touché par l’or',desc:'Posséder une légendaire.',test:legends>=1},
      {id:'traveler',icon:'⚡',name:'Voyageur des univers',desc:'Posséder une carte de chaque série.',test:Object.keys(COLLECTIONS).every(k=>COLLECTIONS[k].ids.some(id=>s.owned[id]>0))},
      {id:'packs10',icon:'◈',name:'Rituel bien rodé',desc:'Ouvrir 10 boosters.',test:s.opened>=10},
      {id:'packs50',icon:'✺',name:'Le grand déballage',desc:'Ouvrir 50 boosters.',test:s.opened>=50},
      {id:'prestige1',icon:'♔',name:'Renaissance',desc:'Atteindre le prestige 1.',test:p.prestige>=1},
      {id:'prestige5',icon:'✵',name:'Souverain de Kylian',desc:'Atteindre le prestige 5.',test:p.prestige>=5},
      {id:'gallery',icon:'▣',name:'Galeriste',desc:'Remplir les six places de la vitrine.',test:p.showcase.length>=6},
      {id:'coins1000',icon:'◉',name:'Petit pactole',desc:'Gagner 1 000 pièces au total.',test:window.TCGEconomy.ensure(s).earned>=1000},
      {id:'level20',icon:'✶',name:'Étoile montante',desc:'Atteindre le niveau 20.',test:p.xp>=3800}
    ];
  }
  function renderHonors(s,p){
    const box=h('article','feature-box');box.append(h('p','eyebrow','Les distinctions permanentes'),h('h3','','Un palmarès à construire'),h('p','feature-sub','Chaque exploit débloqué reste sur ton profil, même après avoir consommé ou échangé les cartes.'));
    const grid=h('div','honors-grid');honorDefinitions(s,p).forEach(x=>{
      const won=p.honors.includes(x.id),card=h('div','honor-card'+(won?' earned-honor':''));
      card.append(h('span','honor-icon',x.icon),h('strong','',x.name),h('small','',x.desc),h('span','honor-state',won?'✓ Acquis':'À débloquer'));grid.append(card);
    });box.append(grid);return box;
  }
  function avatar(s,name,size=''){
    const p=ensure(s),el=h('div','player-avatar '+size);
    if(p.profile.avatar){const img=new Image();img.src=p.profile.avatar;img.alt='Photo de profil de '+name;el.append(img);}
    else el.textContent=name.slice(0,2).toUpperCase();return el;
  }
  function imageCard(id){
    const button=h('button','showcase-card');button.type='button';
    button.dataset.rarity=CARDS[id].rarity;
    const img=new Image();img.src=CARDS[id].img;img.alt=CARDS[id].name;img.loading='lazy';
    button.append(img,h('span','',CARDS[id].name),h('small','',RARITY_LABEL[CARDS[id].rarity]));button.onclick=()=>zoomCard(id);return button;
  }
  function renderProfile(){
    const root=$('profile-root');root.replaceChildren();if(!currentUser){root.append(emptyNote('Connecte-toi pour créer ton profil.'));return;}
    const key=viewedUser&&getAccounts()[viewedUser]?viewedUser:meKey(),own=key===meKey();
    const s=own?state:readState(STORAGE_KEY+':'+key),p=ensure(s),login=nameOf(key),display=p.profile.displayName||login,badge=collectionBadge(s);
    if(!own)root.append(mkBtn('← Revenir à mon profil','',()=>{viewedUser=null;renderProfile();}));
    root.append(heading('L’espace collectionneur',own?'Mon profil':'Profil de '+display,'Ta collection raconte ton histoire. Tes meilleures cartes aussi.'));
    const hero=h('article','profile-hero');hero.dataset.accent=p.profile.accent;
    const banner=h('div','profile-banner');banner.append(h('span','',p.prestige?'PRESTIGE '+p.prestige+' / 5':'KYLIAN · COLLECTIONNEUR'));hero.append(banner);
    const identity=h('div','profile-identity'),text=h('div','profile-copy');identity.append(avatar(s,display));
    text.append(h('h3','',display),h('p','profile-handle','@'+login));
    const badges=h('div','badge-row');badges.append(labelBadge(badge.tier.symbol+' '+badge.tier.name),rankBadge('prestige',p.prestige),rankBadge('level',1+Math.floor(p.xp/200)));text.append(badges);
    identity.append(text);if(own)identity.append(mkBtn(editing?'Fermer l’édition':'Modifier mon profil','primary',()=>{editing=!editing;renderProfile();}));hero.append(identity);
    hero.append(h('p','profile-bio',p.profile.bio||'Pas encore de description. Une légende se construit…'));
    const stats=h('div','profile-numbers');
    for(const [n,label] of [[badge.count,'cartes uniques'],[Object.values(s.owned).reduce((a,b)=>a+b,0),'exemplaires'],[s.opened,'boosters ouverts'],[p.xp,'XP gagnés']]){const x=h('div');x.append(h('strong','',String(n)),h('span','',label));stats.append(x);}hero.append(stats);root.append(hero);
    if(own&&editing)root.append(profileEditor(p));
    root.append(renderHonors(s,p));
    const badgeBox=h('article','feature-box');badgeBox.append(h('p','eyebrow','Badge évolutif'),h('h3','',badge.tier.symbol+' '+badge.tier.name),meter(badge.count,CARD_IDS.length,'Progression du badge de collection'));
    badgeBox.append(h('p','feature-sub',badge.next?'Prochain badge à '+badge.next.at+' % · '+Math.max(0,Math.ceil(CARD_IDS.length*badge.next.at/100)-badge.count)+' cartes uniques manquantes.':'Le badge ultime de collection est atteint.'));
    const steps=h('div','badge-ladder');tiers.forEach(t=>steps.append(labelBadge(t.symbol+' '+t.at+' %',badge.percent>=t.at?'unlocked':'locked-badge')));badgeBox.append(steps,h('p','fine-print','Le badge suit les cartes actuellement possédées. Le prestige reste acquis, même après un rebirth.'));root.append(badgeBox);
    const showcase=h('article','feature-box');showcase.append(h('div','eyebrow','La vitrine · '+p.showcase.length+' / '+slots),h('h3','','Les cartes à l’honneur'));
    const grid=h('div','showcase-grid');
    p.showcase.forEach((id,i)=>{const slot=h('div','showcase-slot');slot.append(imageCard(id));
      if(own){const actions=h('div','slot-actions');const prev=mkBtn('←','',()=>moveShowcase(i,-1)),next=mkBtn('→','',()=>moveShowcase(i,1));prev.disabled=i===0;next.disabled=i===p.showcase.length-1;prev.setAttribute('aria-label','Déplacer '+CARDS[id].name+' vers la gauche');next.setAttribute('aria-label','Déplacer '+CARDS[id].name+' vers la droite');actions.append(prev,next,mkBtn('Retirer','',()=>toggleShowcase(id)));slot.append(actions);}grid.append(slot);});
    for(let i=p.showcase.length;i<slots;i++){const blank=h('div','showcase-empty');blank.append(h('b','','＋'),h('span','','Emplacement '+(i+1)));grid.append(blank);}showcase.append(grid);
    if(own){showcase.append(h('p','feature-sub','Choisis tes cartes ci-dessous. Si tu perds le dernier exemplaire d’une carte exposée, elle quitte automatiquement la vitrine.'));
      const picker=h('details','showcase-picker');picker.append(h('summary','','Choisir mes cartes favorites'));
      const filters=h('div','showcase-filters'),search=h('input'),series=h('select');search.type='search';search.placeholder='Rechercher une carte…';search.setAttribute('aria-label','Rechercher une carte à exposer');
      [['all','Toutes les séries'],['original','Collection originale'],['anime','Duo animé']].forEach(([val,name])=>{const o=h('option','',name);o.value=val;series.append(o);});series.setAttribute('aria-label','Filtrer les cartes à exposer');filters.append(search,series);picker.append(filters);
      const list=h('div','showcase-choices');const fill=()=>{list.replaceChildren();const ids=CARD_IDS.filter(id=>state.owned[id]>0&&(series.value==='all'||CARDS[id].collection===series.value)&&CARDS[id].name.toLocaleLowerCase('fr').includes(search.value.toLocaleLowerCase('fr')));
        if(!ids.length)list.append(emptyNote('Aucune carte possédée ne correspond. Ouvre des boosters pour remplir ta vitrine.'));
        ids.forEach(id=>{const b=mini(id,{count:state.owned[id],onClick:()=>{toggleShowcase(id);}});b.classList.toggle('selected',p.showcase.includes(id));b.setAttribute('aria-pressed',String(p.showcase.includes(id)));b.setAttribute('aria-label',(p.showcase.includes(id)?'Retirer de la vitrine : ':'Exposer : ')+CARDS[id].name);list.append(b);});};search.oninput=fill;series.onchange=fill;fill();picker.append(list);showcase.append(picker);
    }root.append(showcase);
    root.append(h('p','local-note','Version locale : seuls les comptes de ce navigateur peuvent se voir. La synchronisation en ligne reste en pause.'));
  }
  function profileEditor(p){
    const form=h('form','feature-box profile-editor');form.append(h('h3','','Personnaliser mon profil'));
    const field=(text,node)=>{const label=h('label','',text);label.append(node);form.append(label);};
    const display=h('input');display.maxLength=24;display.value=p.profile.displayName||currentUser;display.required=true;field('Pseudo affiché · 24 caractères maximum',display);
    form.append(h('p','fine-print','Ton identifiant de connexion reste @'+currentUser+'.'));
    const bio=h('textarea');bio.maxLength=240;bio.rows=3;bio.value=p.profile.bio;field('Description · 240 caractères maximum',bio);
    const theme=h('select');[['violet','Violet cosmique'],['ocean','Bleu océan'],['gold','Or légendaire'],['rose','Rose néon']].forEach(([v,t])=>{const o=h('option','',t);o.value=v;theme.append(o);});theme.value=p.profile.accent;field('Couleur de bannière',theme);
    const file=h('input');file.type='file';file.accept='image/png,image/jpeg,image/webp';field('Photo de profil · JPG, PNG ou WebP · 5 Mo maximum',file);
    const preview=avatar(state,p.profile.displayName||currentUser,'small-avatar'),message=h('p','social-msg');message.setAttribute('role','status');form.append(preview,message);
    pendingAvatar=null;
    const submit=h('button','btn primary','Enregistrer mon profil');submit.type='submit';
    file.onchange=async()=>{
      const f=file.files[0];if(!f)return;
      if(!['image/png','image/jpeg','image/webp'].includes(f.type)||f.size>5*1024*1024){message.textContent='Choisis une image JPG, PNG ou WebP de moins de 5 Mo.';file.value='';return;}
      submit.disabled=true;message.textContent='Préparation de la photo…';
      try{pendingAvatar=await compressAvatar(f);preview.replaceChildren();const img=new Image();img.src=pendingAvatar;img.alt='Aperçu de la nouvelle photo';preview.append(img);message.textContent='Photo prête. Enregistre pour la conserver.';}
      catch{pendingAvatar=null;message.textContent='Cette image ne peut pas être lue. Essaie un autre fichier.';}
      finally{submit.disabled=false;}
    };
    const actions=h('div','social-actions');actions.append(submit,mkBtn('Retirer la photo','',()=>{pendingAvatar='';preview.replaceChildren();preview.textContent=(display.value||currentUser).slice(0,2).toUpperCase();message.textContent='Enregistre pour retirer la photo.';}));form.append(actions);
    form.onsubmit=e=>{e.preventDefault();const name=display.value.trim();if(!name){message.textContent='Le pseudo affiché ne peut pas être vide.';return;}
      if(persistChange(()=>{p.profile.displayName=name.slice(0,24);p.profile.bio=bio.value.trim().slice(0,240);p.profile.accent=theme.value;if(pendingAvatar!==null)p.profile.avatar=pendingAvatar;editing=false;}))announce('Profil enregistré.');
    };return form;
  }
  function compressAvatar(file){return new Promise((resolve,reject)=>{
    const url=URL.createObjectURL(file),img=new Image();img.onload=()=>{try{const canvas=document.createElement('canvas');canvas.width=canvas.height=256;const ctx=canvas.getContext('2d');if(!ctx)throw Error();const side=Math.min(img.naturalWidth,img.naturalHeight);ctx.drawImage(img,(img.naturalWidth-side)/2,(img.naturalHeight-side)/2,side,side,0,0,256,256);resolve(canvas.toDataURL('image/jpeg',.82));}catch(e){reject(e);}finally{URL.revokeObjectURL(url);}};img.onerror=()=>{URL.revokeObjectURL(url);reject(Error('image'));};img.src=url;
  });}
  function toggleShowcase(id){
    const p=ensure(state);if(!CARDS[id]||!state.owned[id])return;
    if(!p.showcase.includes(id)&&p.showcase.length>=slots){announce('Ta vitrine est pleine. Retire une carte pour en exposer une autre.');return;}
    // Garder le sélecteur ouvert après chaque choix.
    const wasOpen=$('profile-root').querySelector('details')?.open;
    persistChange(()=>{p.showcase=p.showcase.includes(id)?p.showcase.filter(x=>x!==id):[...p.showcase,id];});
    const picker=$('profile-root').querySelector('details');if(picker)picker.open=!!wasOpen;
  }
  function moveShowcase(index,delta){const p=ensure(state),next=index+delta;if(next<0||next>=p.showcase.length)return;persistChange(()=>{[p.showcase[index],p.showcase[next]]=[p.showcase[next],p.showcase[index]];});}
  function renderQuests(){
    const root=$('quests-root');root.replaceChildren();root.append(heading('Chaque objectif fait avancer ta collection','Le tableau des quêtes','Gagne des XP et des pièces pour ouvrir des boosters supplémentaires.'));
    if(!currentUser){root.append(emptyNote('Connecte-toi pour commencer tes quêtes.'));return;}
    const p=ensure(state),e=window.TCGEconomy.ensure(state);
    const wallet=h('div','quest-wallet');wallet.append(h('div','','Ton portefeuille'),h('strong','',e.coins+' ◉'),h('p','feature-sub','1 booster supplémentaire = '+window.TCGEconomy.price()+' pièces. Monnaie virtuelle, sans achat en argent réel.'),mkBtn('Ouvrir des boosters','primary',()=>activateTab('packs',true)));root.append(wallet);
    for(const [title,sub,qs] of [
      ['Quotidiennes','8 missions · renouvellement à minuit, heure de Paris',dailyQuests()],
      ['Hebdomadaires','3 missions · renouvellement le lundi à minuit, heure de Paris',weeklyPool],
      ['Parcours de collection','6 objectifs permanents · chaque récompense se récupère une seule fois',collectionPool]
    ]){
      const done=qs.filter(q=>claims(q,p).includes(q.id)).length,strip=h('div','quest-summary');strip.append(h('div','',title+' · '+sub),h('strong','',done+' / '+qs.length+' récupérées'));root.append(strip);
      const grid=h('div','quest-grid');qs.forEach(q=>{
        const count=Math.min(q.target,progressOf(q,p)),claimed=claims(q,p).includes(q.id),done=count>=q.target;
        const box=h('article','feature-box quest-card'+(claimed?' claimed':''));box.append(h('p','eyebrow',claimed?'✓ Récompense récupérée':done?'✦ Objectif atteint':'Mission en cours'),h('h3','',q.title),h('p','feature-sub',q.desc),meter(count,q.target,q.title));
        const bottom=h('div','quest-bottom'),rewards=h('div','quest-rewards');rewards.append(labelBadge('+'+q.xp+' XP'),labelBadge('+'+q.coins+' ◉','coin-badge'));bottom.append(h('span','',count+' / '+q.target),rewards);box.append(bottom);
        const button=mkBtn(claimed?'Récupérée':done?'Récupérer XP + pièces':'En cours',done&&!claimed?'primary':'',()=>claimQuest(q.id));button.disabled=claimed||!done;box.append(button);grid.append(box);
      });root.append(grid);
    }
    const level=1+Math.floor(p.xp/200),xp=h('article','feature-box xp-card');xp.append(h('p','eyebrow','Ton expérience de collectionneur'),rankBadge('level',level),h('h3','',p.xp+' XP au total'),meter(p.xp%200,200,'XP vers le prochain niveau'),h('p','feature-sub',(200-p.xp%200)+' XP avant le niveau suivant. Ton insigne évolue aux niveaux 5, 10, 20, 35, 50 et 100.'));
    const ladder=h('div','rank-ladder');levelRanks.forEach(r=>{const badge=rankBadge('level',r.at);if(level<r.at)badge.classList.add('not-earned');ladder.append(badge);});xp.append(ladder);root.append(xp);
    root.append(h('p','fine-print','Les boosters gratuits et ceux achetés avec des pièces comptent pour les missions de tirage. Les échanges ne comptent pas comme des tirages. Les récompenses quotidiennes et hebdomadaires non réclamées expirent à leur renouvellement.'));
  }
  function renderRebirth(){
    const root=$('rebirth-root');root.replaceChildren();root.append(heading('Le prestige se mérite','Le rituel du rebirth','Cinq paliers. Des cartes précises à réunir. Un badge qui reste.'));
    if(!currentUser){root.append(emptyNote('Connecte-toi pour accéder aux rebirths.'));return;}
    const p=ensure(state),hero=h('article','prestige-hero');hero.append(rankEmblem('prestige',p.prestige),h('p','eyebrow','Ton rang permanent'),h('h3','','PRESTIGE '+p.prestige+' / '+levels.length));
    const ladder=h('div','prestige-ladder');levels.forEach((l,i)=>{const medal=rankBadge('prestige',i+1);if(i>=p.prestige)medal.classList.add('not-earned');ladder.append(medal);});hero.append(ladder,h('p','feature-sub','Seules les quantités affichées sont consommées. Tes autres cartes, tes XP, tes ouvertures et tes délais sont conservés.'));root.append(hero);
    levels.forEach((goal,index)=>{
      const past=index<p.prestige,active=index===p.prestige,req=requirements(state,index),box=h('article','feature-box rebirth-card'+(active?' active-rebirth':''));
      box.append(h('p','eyebrow',past?'✓ Prestige acquis':active?'Prochain rebirth':'Palier à venir'),h('h3','','P'+(index+1)+' · '+goal.title),labelBadge('Badge Prestige '+(index+1)+' · +'+goal.xp+' XP'));
      if(!past){const list=h('div','sacrifice-list');req.cards.forEach(c=>{const row=h('div','sacrifice-row'),info=h('div');
        if(CARDS[c.id]){const img=new Image();img.src=CARDS[c.id].img;img.alt='';img.loading='lazy';row.append(img);info.append(h('strong','',CARDS[c.id].name),h('small','',COLLECTIONS[CARDS[c.id].collection].name+' · '+RARITY_LABEL[CARDS[c.id].rarity]));}
        else info.append(h('strong','','Carte manquante : '+c.id));
        row.append(info,h('b',c.have>=c.count?'requirement-met':'',Math.min(c.have,c.count)+' / '+c.count),h('small','sacrifice-cost','−'+c.count+' exemplaire'+(c.count>1?'s':'')));list.append(row);});box.append(list);
        if(req.invalid)box.append(h('p','social-msg','Objectif à corriger dans progression-reglages.js : carte absente ou quantité invalide.'));
        const button=mkBtn(active&&req.ready?'Accomplir le rebirth '+(index+1):active?'Réunis les cartes demandées':'Débloqué après le prestige '+index,active&&req.ready?'primary':'',()=>performRebirth(index));button.disabled=!active||!req.ready;box.append(button);
      }else box.append(h('p','feature-sub','Le badge de ce palier est conservé définitivement.'));
      root.append(box);
    });
  }
  function render(){
    if(currentUser){const p=ensure(state);$('tab-profile-count').textContent='P'+p.prestige;$('tab-rebirth-count').textContent=p.prestige+'/5';const ready=allQuests().filter(q=>progressOf(q,p)>=q.target&&!claims(q,p).includes(q.id)).length;$('tab-quests-count').textContent=ready?ready+' à récupérer':p.daily.claimed.length+'/8';}
    // Ne pas remplacer le formulaire pendant la saisie, ni les panneaux invisibles.
    if(!$('panel-profile').hidden&&!editing)renderProfile();
    if(!$('panel-quests').hidden)renderQuests();
    if(!$('panel-rebirth').hidden)renderRebirth();
  }
  function activate(name){
    if(name==='profile'){if(!viewedUser)viewedUser=meKey();renderProfile();}
    if(name==='quests')renderQuests();if(name==='rebirth')renderRebirth();
  }
  function viewProfile(key){viewedUser=key;editing=false;activateTab('profile',true);}
  window.TCGProgression={render,activate,onPack,onTrade,viewProfile,ensure,dailyQuests,claimQuest,requirements,performRebirth,collectionBadge,announce,weekId,allQuests,progressOf,rankEmblem,rankBadge};
  // Cliquer sur « Mon profil » revient toujours à soi, même après la visite d'un ami.
  $('tab-profile').addEventListener('click',()=>{viewedUser=meKey();editing=false;renderProfile();});
  let previousUser=currentUser,previousDay=day();
  setInterval(()=>{
    if(previousUser!==currentUser){previousUser=currentUser;viewedUser=null;editing=false;}
    if(previousDay!==day()){previousDay=day();if(currentUser){ensure(state);saveState();render();}}
  },1000);
  // La connexion d'un autre compte réinitialise immédiatement le contexte du profil.
  const originalStartSession=startSession;
  startSession=function(name){viewedUser=null;editing=false;originalStartSession(name);};
  if(currentUser){ensure(state);saveState();}render();
})();
