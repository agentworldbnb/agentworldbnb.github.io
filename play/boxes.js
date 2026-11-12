(async()=>{const A=await AW.ready,G=A.C.gear,$=AW.$,$$=AW.$$,t=AW.t;
const NM=["Common box","Premium box","Seasonal box"],HUE=["0deg","200deg","300deg"],AC=["#4fa3ff","#ffb02e","#ff4fe0"],RC=["var(--N)","var(--R)","var(--SR)","var(--SSR)","var(--UR)"],RNAME=["N","R","SR","SSR","UR"];
let P=[];
const closed=()=>{const g=AW.gate();if(!g.open){AW.toast(t(g.why));return true}return false};
async function tiers(){const day=await AW.utcDay();const a=AW.addr();const g=AW.gate();const key=a?(g.iface?await G.accountKey(a):await AW.key(a)):null;const so=await G.seasonalOpen();const paused=await G.paused();
 const rows=await Promise.all([0,1,2].map(async i=>{const [p,lim,dp,o,b]=await Promise.all([G.priceWei(i),G.dailyBoxLimit(i),G.heroDropPpm(i),Promise.all([0,1,2,3,4].map(j=>G.odds(i,j))),key?G.boughtOnDay(key,day,i):null]);return{p,lim,dp,o:o.map(Number),b}}));P=rows.map(r=>r.p);
 $("#b-tiers").innerHTML=rows.map((r,i)=>{const pr=r.o.map((v,j)=>v-(j?r.o[j-1]:0));const off=i===2&&!so;const stop=!g.open||paused||off;
  const label=off?t("Not open this season"):paused?t("Paused"):g.open?t("Buy"):t("Transactions off");
  return`<div class="panel box rv in" style="--a:${AC[i]};--h:${HUE[i]}"><div class="im"><img src="/assets/img/box.jpg" alt="${t(NM[i])}"></div><h3>${t(NM[i])}</h3><div class="px">${AW.fmt(r.p,6)} BNB</div>
  <div class="odds">${pr.map((v,j)=>v?`<i style="width:${v/100}%;background:${RC[j]}"></i>`:"").join("")}</div><div class="oddl">${pr.map((v,j)=>v?`<span><b style="color:${RC[j]}">${AW.RAR[j]}</b> ${(v/100).toFixed(1)}%</span>`:"").join("")}</div>
  <div class="kv" style="margin:12px 22px 0"><span>${t("Daily limit")}</span><b>${r.b!=null?r.b+" / ":""}${r.lim}</b><span>${t("Bonus hero drop")}</span><b>${(Number(r.dp)/1e4).toFixed(1)}%</b></div>
  <div class="qty"><button type="button" data-d="-1" data-i="${i}">−</button><input id="bq${i}" value="1" aria-label="Quantity"><button type="button" data-d="1" data-i="${i}">+</button></div><br>
  <button class="btn ${i===1?"g":"o"} sm" data-buy="${i}" ${stop?"disabled":""}>${label}</button></div>`}).join("");
 $$("[data-d]").forEach(b=>b.onclick=()=>{const q=$("#bq"+b.dataset.i);q.value=Math.max(1,Math.min(10,(parseInt(q.value)||1)+ +b.dataset.d))});
 $$("[data-buy]").forEach(b=>b.onclick=()=>{if(closed()||paused)return;const i=+b.dataset.buy,n=BigInt(Math.max(1,Math.min(10,parseInt($("#bq"+i).value)||1)));
  AW.send(n===1n?{title:t("Buy")+" 1 × "+t(NM[i]),c:"gear",fn:"buy",args:[i],value:P[i]}:{title:t("Buy")+" "+n+" × "+t(NM[i]),c:"gear",fn:"buyMany",args:[i,n],value:P[i]*n})})}
function line(x){if(x.np)return x.seed?t("Shard box. Seed is in. Not in the pity queue."):t("Shard box. Waiting for seed. Not in the pity queue.");
 if(!x.seed)return t("Waiting for seed. Pity stays in purchase order.");
 if(!x.rr)return t("Seed is in. Earlier boxes must be finalized first (PityPending).");
 return t("Finalized. Open mints this rarity.")+" "+(RNAME[x.rolled]||""); }
async function mine(){const a=AW.addr(),m=$("#b-mine"),gEl=$("#b-gear"),g=AW.gate();
 if(!a){m.innerHTML=`<div class="empty"><img src="/assets/img/box.jpg" alt=""><p>${t("Connect your wallet to see your boxes and gear.")}</p><button class="btn g sm" onclick="AW.connect()">${t("Connect Wallet")}</button></div>`;gEl.innerHTML="";$("#b-pity").textContent=t("Pity follows purchase order. A late seed keeps its place and is not dropped.");return}
 if(!g.iface){const key=await AW.key(a);const [[ids,op,rd],ss,su]=await Promise.all([G.boxesOf(a),G.sinceSSR(key),G.sinceUR(key)]);
  const [ps,pu]=await Promise.all([G.PITY_SSR(),G.PITY_UR()]);
  $("#b-pity").textContent=t("Historical Gear: purchase-order pity is not queried, and no buy or open will be sent.")+" "+t("Pity")+": SSR "+ss+" / "+ps+" · UR "+su+" / "+pu;
  const sh=[...ids].map((id,i)=>({id,o:op[i],r:rd[i]})).filter(x=>!x.o).sort((x,y)=>x.id<y.id?-1:1);
  m.innerHTML=sh.length?`<div class="panel card"><p class="note">${t("Listed in box id order. Seed-ready on this historical contract is not a purchase-order finality.")}</p><div class="bx">${sh.map(x=>`<span class="${x.r?"rd":""}">▣ #${x.id} · ${x.r?t("Seed is in"):t("Waiting for seed")}</span>`).join("")}</div><div class="cta" style="justify-content:flex-start"><button class="btn g sm" disabled>${t("Transactions off")}</button></div></div>`:`<div class="empty"><p>${t("No unopened boxes.")}</p></div>`;
 }else{const key=await G.accountKey(a);let views;try{views=await Promise.all([G.pityCursor(key),G.pityQueueLength(key),G.sinceSSR(key),G.sinceUR(key),G.PITY_SSR(),G.PITY_UR(),G.MAX_PITY_STEPS(),G.paused(),G.boxesOf(a)])}
  catch(e){$("#b-pity").textContent=t("New views reverted on the configured address. No transaction was sent.");m.innerHTML=`<div class="panel card"><p class="warn">${AW.esc(AW.explain(e))}</p></div>`;return}
  const [cursor,qlen,ss,su,ps,pu,steps,paused,pack]=views;const [ids,op,rd]=pack;
  $("#b-pity").textContent=t("Pity follows purchase order. A late seed keeps its place and is not dropped.")+" "+t("Finalized pity")+": SSR "+ss+" / "+ps+" · UR "+su+" / "+pu+". "+t("Queue")+" "+cursor+" / "+qlen+". "+(paused?t("Gear is paused. Buy and open are disabled. Finalize pity does not mint."):"");
  const pending=[];for(let i=0;i<ids.length;i++){if(op[i])continue;const id=ids[i];const [np,rr]=await Promise.all([G.noPity(id),G.rarityReady(id)]);const rolled=rr?Number(await G.rolledRarity(id)):null;pending.push({id,seed:rd[i],np,rr,rolled})}
  pending.sort((x,y)=>x.id<y.id?-1:1);
  const openable=pending.filter(x=>x.np?x.seed:x.rr).map(x=>x.id);
  const remain=qlen>cursor?qlen-cursor:0n;const batch=remain>steps?steps:remain;
  const head=pending.find(x=>!x.np&&!x.rr);const headSeeded=!!(head&&head.seed);
  const can=g.open&&batch>0n&&headSeeded;
  m.innerHTML=pending.length?`<div class="panel card"><p class="note">${t("Purchase order is box id order. Finalize pity walks that queue and stops at the first missing seed. One click sends one transaction.")}</p><div class="bx">${pending.map(x=>`<span class="${x.rr||(x.np&&x.seed)?"rd":""}">▣ #${x.id} · ${AW.esc(line(x))}</span>`).join("")}</div><div class="cta" style="justify-content:flex-start"><button class="btn o sm" id="b-mat" ${can?"":"disabled"}>${batch>0n&&!headSeeded?t("Finalize pity (waiting for seed)"):t("Finalize next pity boxes")+(batch>0n?" ("+batch+")":"")}</button><button class="btn g sm" id="b-open" ${g.open&&!paused&&openable.length?"":"disabled"}>${t("Open finalized")} (${openable.length})</button></div></div>`:`<div class="empty"><p>${t("No unopened boxes.")}</p></div>`;
  const mat=$("#b-mat");if(mat)mat.onclick=()=>{if(closed()||!can)return;AW.send({title:t("Finalize next pity boxes"),c:"gear",fn:"materialize",args:[key,batch],note:"One transaction finalizes at most 32 boxes, in purchase order, and stops at the first missing seed. It does not mint and it is not sent again automatically."})};
  const o=$("#b-open");if(o)o.onclick=()=>{if(closed()||paused||!openable.length)return;AW.send(openable.length===1?{title:t("Open box")+" #"+openable[0],c:"gear",fn:"open",args:[openable[0]],note:"Opens one box whose rarity is already finalized, or a shard box whose seed is in."}:{title:t("Open boxes")+" × "+openable.length,c:"gear",fn:"openMany",args:[openable],note:"Only boxes that are already finalized, or shard boxes with a seed, are included. Nothing is retried automatically."})}}
 const items=[];const [bal,lk]=await G.inventory(a);for(let i=0;i<80;i++)if(bal[i]>0n)items.push(AW.gearCard(100+i,bal[i]+(lk[i]?" ("+lk[i]+" "+t("equipped")+")":"")));
 const os=await G.balanceOf(a,200);if(os>0n)items.unshift(`<div class="gi r-UR"><span class="rk">SOVEREIGN</span><img src="/guide/img/sov.jpg" alt="Sovereign Set"><div class="m"><b>${t("Sovereign Set")}</b><span>+100% · ${t("soulbound")}</span></div></div>`);
 gEl.innerHTML=items.length?items.join(""):`<div class="empty" style="grid-column:1/-1"><p>${t("No gear yet. Buy a box above.")}</p></div>`}
const run=()=>Promise.all([tiers(),mine()]).catch(e=>{console.error(e);AW.toast(t("RPC error")+": "+AW.err(e))});AW.on(run)})();
