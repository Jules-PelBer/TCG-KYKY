/* Monnaie virtuelle et réserve gratuite. Aucune transaction en argent réel. */
(() => {
  const settings=()=>window.TCG_REGLAGES||{};
  const interval=()=>Math.max(1,Number(settings().delaiMinutes)||5)*60000;
  const capacity=()=>Math.max(1,Math.min(20,Math.floor(Number(settings().stockMaximum)||5)));
  const price=()=>Math.max(1,Math.floor(Number(settings().prixBooster)||100));
  const nat=n=>Number.isSafeInteger(n)&&n>=0?n:0;
  function ensure(s,now=Date.now()){
    if(!s.economy||typeof s.economy!=='object'||Array.isArray(s.economy))s.economy={coins:0,earned:0,spent:0,free:{}};
    const e=s.economy;for(const k of ['coins','earned','spent'])e[k]=nat(e[k]);
    if(!e.free||typeof e.free!=='object'||Array.isArray(e.free))e.free={};
    for(const key of ['original','anime']){
      if(!e.free[key]||typeof e.free[key]!=='object'){
        const last=s.lastOpens?.[key]||0;
        e.free[key]=last>0?{count:0,tickAt:Math.min(last,now)}:{count:1,tickAt:now};
      }
      const b=e.free[key];b.count=Math.min(capacity(),nat(b.count));
      if(!Number.isFinite(b.tickAt)||b.tickAt<0||b.tickAt>now)b.tickAt=now;
      if(b.count>=capacity()){b.tickAt=now;continue;}
      const gain=Math.floor((now-b.tickAt)/interval());
      if(gain>0){b.count=Math.min(capacity(),b.count+gain);b.tickAt=b.count===capacity()?now:b.tickAt+gain*interval();}
    }
    return e;
  }
  function stock(s,key,now=Date.now()){const b=ensure(s,now).free[key];return {count:b.count,max:capacity(),next:b.count>=capacity()?0:Math.max(0,b.tickAt+interval()-now)};}
  function consume(s,key,mode='free',now=Date.now()){
    if(!['original','anime'].includes(key)||!['free','paid'].includes(mode))return false;
    const e=ensure(s,now);
    if(mode==='paid'){if(e.coins<price())return false;e.coins-=price();e.spent+=price();return true;}
    const b=e.free[key];if(b.count<1)return false;
    if(b.count===capacity())b.tickAt=now;
    b.count--;return true;
  }
  function award(s,amount){const e=ensure(s),n=nat(amount);e.coins+=n;e.earned+=n;return e.coins;}
  window.TCGEconomy={ensure,stock,consume,award,price,capacity,interval};
})();
