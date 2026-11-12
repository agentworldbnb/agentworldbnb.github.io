(async()=>{const A=await AW.ready,{lottery:L,arena:Z,raffle:RF}=A.C,$=AW.$,$$=AW.$$,t=AW.t;
const DS=["Not started","Committed","Drawn"],RS=["–","Open","Drawing","Drawn"];
const dayLabel=d=>new Date(Number(d)*864e5).toISOString().slice(0,10);
const closed=()=>{const g=AW.gate();if(!g.open){AW.toast(t(g.why));return true}return false};
async function snap(day){const g=AW.gate();
 if(!g.iface){$("#l-snap").innerHTML=`<div class="panel card"><p class="note">${t("Historical lottery: day + 2, freeze, reserved and the committed snapshot are not queried, and no commit, draw or claim will be sent.")}</p></div>`;return}
 let pack;try{pack=await Promise.all([L.reserved(),L.owed(),L.freeBalance(),L.paused(),Z.dayFrozen(day),Z.lottery(),Z.paused()])}
 catch(e){$("#l-snap").innerHTML=`<div class="panel card"><p class="warn">${t("New views reverted on the configured address. No transaction was sent.")} ${AW.esc(AW.explain(e))}</p></div>`;return}
 const [reserved,owed,free,paused,frozenToday,lotto,arenaPaused]=pack;
 const zero=/^0x0+$/i.test(lotto);
 const rows=[];
 for(const d of [day,day-1n]){const info=await L.dayInfo(d);rows.push({d,blocked:true,st:Number(info[0]),elig:info[1],pot:info[3],cc:0n,cp:0n,fr:false})}
 for(let k=2n;k<=16n;k++){const d=day-k;if(d<0n)break;
  const [info,cc,cp,fr]=await Promise.all([L.dayInfo(d),L.committedCount(d),L.committedPot(d),Z.dayFrozen(d)]);
  rows.push({d,blocked:false,st:Number(info[0]),elig:info[1],pot:info[3],cc,cp,fr})}
 const send=g.open&&!paused;
 $("#l-snap").innerHTML=`<div class="panel card"><span class="tag">${t("Snapshot")}</span><h3>${t("Commit window")}</h3>
 <div class="kv"><span>${t("Reserved (BNB)")}</span><b class="gd">${AW.fmt(reserved,6)}</b><span>${t("Owed (BNB)")}</span><b>${AW.fmt(owed,6)}</b><span>${t("Free balance (BNB)")}</span><b>${AW.fmt(free,6)}</b>
 <span>${t("Today")}</span><b>${frozenToday?t("Frozen"):t("Not frozen")}</b><span>${t("Arena lottery address")}</span><b>${zero?t("unset"):`<a href="https://testnet.bscscan.com/address/${lotto}" target=_blank rel=noopener>${AW.short(lotto)}</a>`}</b></div>
 ${zero?`<p class="warn">${t("Arena lottery is unset. commit will revert NotLottery until it is set.")}</p>`:""}
 ${paused?`<p class="note">${t("Lottery is paused. commit and draw are disabled. Claim is still allowed by the contract once writes are accepted.")}</p>`:""}
 ${arenaPaused?`<p class="note">${t("Arena is paused. Enter and settle are disabled there. Lottery commit can still freeze a day when the lottery itself is not paused.")}</p>`:""}
 <p class="note">${t("commit is refused until two UTC days have passed (day + 2). The list below stops at today-16. It freezes that arena day. reserved increases only when someone qualified. One confirmation, no retry.")}</p>
 <div style="overflow-x:auto"><table class="t"><tr><th>${t("Day (UTC)")}</th><th>${t("Rule")}</th><th>${t("Status")}</th><th>${t("Frozen")}</th><th>${t("Eligible / snapshot")}</th><th>${t("Pot / snapshot")}</th><th></th></tr>
 ${rows.map(r=>{const act=r.blocked?"":r.st===0?`<button class="btn o sm" data-commit="${r.d}" ${send&&!zero?"":"disabled"}>${t("Commit")}</button>`:r.st===1?`<button class="btn g sm" data-draw="${r.d}" ${send?"":"disabled"}>${t("Draw")}</button>`:"";
  return`<tr><td>${dayLabel(r.d)}</td><td>${r.blocked?t("day + 2 not reached"):t("day + 2 reached")}</td><td>${t(DS[r.st]||"?")}</td><td>${r.blocked?"–":(r.fr?t("Frozen"):t("Not frozen"))}</td><td>${r.blocked?r.elig:(r.st===0?r.elig:r.cc)}</td><td>${AW.fmt(r.st===0||r.blocked?r.pot:r.cp,5)}</td><td>${act}</td></tr>`}).join("")}
 </table></div></div>`;
 $$("[data-commit]").forEach(b=>b.onclick=()=>{if(closed()||paused)return;const d=BigInt(b.dataset.commit);AW.send({title:t("Commit lottery day")+" "+dayLabel(d),c:"lottery",fn:"commit",args:[d],note:"Requires day + 2 <= today. Freezes that arena day and reserves the committed pot. If nobody qualified, nothing is reserved. One confirmation, no retry."})});
 $$("[data-draw]").forEach(b=>b.onclick=()=>{if(closed()||paused)return;const d=BigInt(b.dataset.draw);AW.send({title:t("Draw lottery day")+" "+dayLabel(d),c:"lottery",fn:"draw",args:[d],note:"Draw uses the committed count and pot, then releases reserved. If the seed is not ready the transaction reverts NotReady. One confirmation, no retry."})})}
async function load(){const a=AW.addr();const g=AW.gate();
 const [day,mp,need,sb]=await Promise.all([L.today(),L.maxPotWei(),Z.LOTTERY_BATTLES(),Promise.all([0,1,2].map(i=>L.SHARE_BPS(i)))]);
 const di=await L.dayInfo(day);$("#l-pot").textContent=AW.fmt(di[3]);$("#l-elig").textContent=di[1];$("#l-st").textContent=t(DS[Number(di[0])]);$("#l-max").textContent=AW.fmt(mp);
 $("#l-how").textContent=t("Finish")+" "+need+" "+t("arena battles in one UTC day to enter that day's draw automatically. No ticket purchase needed.");
 $("#l-split").innerHTML=sb.map((b,i)=>`<span>${t(["1st","2nd","3rd"][i])}</span><b class="gd">${Number(b)/100}%</b>`).join("");
 if(a){const key=await AW.key(a);const [n,p]=await Promise.all([Z.entriesOnDay(key,day),L.pending(a)]);$("#l-me").textContent=n+" / "+need;$("#l-bar").style.width=Math.min(100,Number(n)*100/Number(need))+"%";
  $("#l-prog").textContent=n>=need?t("You qualified for today's draw ✓"):(need-n)+" "+t("more battles to qualify today.");$("#l-pend").textContent=AW.fmt(p,6);$("#l-claim").disabled=!g.open||p===0n}
 else{$("#l-me").textContent="–";$("#l-pend").textContent="–";$("#l-prog").textContent=t("Connect your wallet to see your progress.");$("#l-claim").disabled=true}
 await snap(day);
 const past=await Promise.all([1,2,3,4,5,6,7].map(async k=>{const d=day-BigInt(k);const [x,w]=await Promise.all([L.dayInfo(d),L.winnersOf(d)]);return{d,x,w}}));
 $("#l-hist").innerHTML=`<div class="panel card" style="overflow-x:auto"><table class="t"><tr><th>${t("Day (UTC)")}</th><th>${t("Status")}</th><th>${t("Qualified")}</th><th>${t("Pot")}</th><th>${t("Winners")}</th></tr>${past.map(({d,x,w})=>`<tr><td>${dayLabel(d)}</td><td>${t(DS[Number(x[0])])}</td><td>${x[1]}</td><td>${AW.fmt(Number(x[0])===2?x[4]:x[3],5)}</td><td>${w.filter(z=>!/^0x0+$/.test(z)).map(AW.short).join(", ")||"–"}</td></tr>`).join("")}</table></div>`;
 const rc=Number(await RF.raffleCount());const key=a?await AW.key(a):null;const rs=await Promise.all(Array.from({length:Math.min(rc,10)},(_,i)=>rc-i).map(async id=>{const [r,ent,me]=await Promise.all([RF.raffles(id),RF.entrantsOf(id),key?RF.entered(id,key):false]);return{id,r,n:ent.length,me}}));
 $("#r-list").innerHTML=rs.length?`<div class="pg3">${rs.map(({id,r,n,me})=>{const open=Number(r.state)===1&&Number(r.closesAt)>Date.now()/1000;return`<div class="panel card"><span class="tag">${t("Raffle")} #${id}</span><h3>${t(RS[Number(r.state)])}</h3><div class="kv"><span>${t("Closes")}</span><b>${new Date(Number(r.closesAt)*1e3).toLocaleString()}</b><span>${t("Entrants")}</span><b>${n}</b>${Number(r.state)===3?`<span>${t("Winner")}</span><b>${AW.short(r.winner)}</b>`:""}</div><div class="cta" style="justify-content:flex-start">${me?`<span class="chip ok">${t("Entered ✓")}</span>`:open?`<button class="btn g sm" data-r="${id}" ${g.open?"":"disabled"}>${g.open?t("Enter free"):t("Transactions off")}</button>`:""}</div></div>`}).join("")}</div>`:`<div class="empty"><img src="/guide/img/o05.png" alt=""><p>${t("No event raffle is open right now. Follow @AgentWorldBNB for the next one.")}</p></div>`;
 $$("[data-r]").forEach(b=>b.onclick=()=>{if(closed())return;AW.send({title:t("Enter raffle")+" #"+b.dataset.r,c:"raffle",fn:"enter",args:[BigInt(b.dataset.r)],note:"Free entry. Only network gas is paid."})})}
if(!$("#l-snap")){const host=$("#l-hist").parentNode;const n=document.createElement("section");n.className="s";n.id="l-snap";host.parentNode.insertBefore(n,host)}
$("#l-claim").onclick=()=>{if(closed())return;AW.send({title:"Claim lottery winnings",c:"lottery",fn:"claim",note:"Claim pays only the pending balance already stored. It is not retried automatically. The contract allows claim while paused."})};
AW.on(()=>load().catch(e=>{console.error(e);AW.toast(t("RPC error")+": "+AW.err(e))}))})();
