(async()=>{const A=await AW.ready,{forge:F,gear:G,robots:R}=A.C,$=AW.$,$$=AW.$$,t=AW.t;let S={},sel=[];
const closed=()=>{const g=AW.gate();if(!g.open){AW.toast(t(g.why));return true}return false};
const syncWrite=()=>{
 const open=AW.gate().open;
 const labels={"#fu-go":t("Fuse"),"#di-go":t("Dismantle"),"#re-0":t("Common box"),"#re-1":t("Premium box"),"#ce-go":t("Craft Elite"),"#cm-go":t("Craft Mythic"),"#cl-go":t("Craft Legend")};
 for(const id of Object.keys(labels)){const el=$(id);if(!el)continue;el.disabled=!open;el.textContent=open?labels[id]:t("Transactions off")}
 const ap=$("#ap-go");if(ap){const approved=!!S.ap;ap.disabled=approved||!open;ap.textContent=!open?t("Transactions off"):(approved?t("Forge approved ✓"):t("Approve Forge"))}
};
const opt=(lo,n)=>Array.from({length:n},(_,i)=>`<option value="${i}">${AW.esc(AW.name(lo+i))}</option>`).join("");
$("#ce-t").innerHTML=opt(35,10);$("#cm-t").innerHTML=opt(30,5);$("#cl-t").innerHTML=opt(45,2);
async function base(){const [ff,y,r0,r1,f0,f1,c0,c1,c2]=await Promise.all([F.forgeFeeWei(),Promise.all([0,1,2,3,4].map(i=>F.SHARD_YIELD(i))),F.redeemShards(0),F.redeemShards(1),F.redeemFeeWei(0),F.redeemFeeWei(1),F.craftFeeWei(0),F.craftFeeWei(1),F.craftFeeWei(2)]);
 S={...S,ff,f0,f1,c:[c0,c1,c2]};$("#fo-fee").textContent=AW.fmt(ff);$("#fu-fee").textContent=AW.fmt(ff,6)+" BNB";$("#fo-y").textContent=y.join("·");$("#fo-r0").textContent=r0;$("#fo-r1").textContent=r1;
 $("#re-note").textContent=t("Common")+": "+r0+" "+t("shards")+" + "+AW.fmt(f0,6)+" BNB · "+t("Premium")+": "+r1+" "+t("shards")+" + "+AW.fmt(f1,6)+" BNB";
 $("#cr-fees").textContent=t("Fees")+": "+t("Elite")+" "+AW.fmt(c0,5)+" · "+t("Mythic")+" "+AW.fmt(c1,5)+" · "+t("Legend")+" "+AW.fmt(c2,5)+" BNB";syncWrite()}
function upd(){$("#fu-n").textContent=sel.length+" / 3";$$("#fo-gear .gi").forEach(c=>{const n=sel.filter(x=>x==c.dataset.g).length;c.classList.toggle("sel",n>0)})}
async function mine(){const a=AW.addr(),g=$("#fo-gear"),en=$("#fo-ent");sel=[];upd();const open=AW.gate().open;
 if(!a){["#fo-sh","#fo-wk"].forEach(x=>$(x).textContent="–");g.innerHTML=`<div class="empty" style="grid-column:1/-1"><img src="/guide/img/f08.png" alt=""><p>${t("Connect your wallet to use the forge.")}</p><button class="btn g sm" onclick="AW.connect()">${t("Connect Wallet")}</button></div>`;en.innerHTML="";syncWrite();return}
 const [sh,wk,[bal,lk],[ids,st,rd],cc,ap]=await Promise.all([F.shardsOf(a),F.redeemLeftThisWeek(a),G.inventory(a),F.entriesOf(a),F.craftCount(),R.isApprovedForAll(a,A.cfg.forge)]);
 S.ap=!!ap;$("#fo-sh").textContent=sh;$("#fo-wk").textContent=wk;syncWrite();
 const av=[];for(let i=0;i<80;i++){const n=bal[i]-lk[i];if(n>0n)av.push([100+i,n])}S.av=Object.fromEntries(av.map(([k,n])=>[k,Number(n)]));
 g.innerHTML=av.length?av.map(([k,n])=>AW.gearCard(k,n,"pick")).join(""):`<div class="empty" style="grid-column:1/-1"><p>${t("No free gear. Open blind boxes to get some.")}</p><a class="btn g sm" href="/play/boxes/">${t("Blind boxes")}</a></div>`;
 $$(".gi.pick",g).forEach(c=>{c.onclick=()=>{const k=+c.dataset.g;const have=sel.filter(x=>x===k).length;if(have<S.av[k]&&sel.length<3)sel.push(k);else sel=sel.filter(x=>x!==k);upd()}});
 const E=[...ids].map((id,i)=>({id,s:st[i],r:rd[i]})).filter(x=>!x.s);const cr=[];const n=Number(cc);for(let i=n;i>0&&i>n-200;i--){cr.push(F.craftOf(i).then(x=>({id:i,x})).catch(()=>null))}
 const C=(await Promise.all(cr)).filter(o=>o&&o.x[0].toLowerCase()===a.toLowerCase()&&!o.x[3]);
 const settleFuse=x=>x.r?(open?`<a href="#" data-e="${x.id}">${t("Settle")}</a>`:t("Transactions off")):t("Waiting for VRF");
 const settleCraft=o=>o.x[5]?(open?`<a href="#" data-k="${o.id}">${t("Settle")}</a>`:t("Transactions off")):t("Waiting for VRF");
 en.innerHTML=(E.length||C.length)?`<div class="panel card"><div class="bx">${E.map(x=>`<span class="${x.r?"rd":""}">♨ ${t("Fuse")} #${x.id} · ${settleFuse(x)}</span>`).join("")}${C.map(o=>`<span class="${o.x[5]?"rd":""}">✦ ${t("Craft")} #${o.id} · ${AW.esc(AW.name(Number(o.x[2])))} · ${settleCraft(o)}</span>`).join("")}</div></div>`:`<div class="empty"><p>${t("Nothing pending.")}</p></div>`;
 $$("[data-e]",en).forEach(b=>b.onclick=e=>{e.preventDefault();if(closed())return;AW.send({title:t("Settle fuse")+" #"+b.dataset.e,c:"forge",fn:"settle",args:[BigInt(b.dataset.e)]})});
 $$("[data-k]",en).forEach(b=>b.onclick=e=>{e.preventDefault();if(closed())return;AW.send({title:t("Settle craft")+" #"+b.dataset.k,c:"forge",fn:"settleCraft",args:[BigInt(b.dataset.k)]})})}
const ids2=s=>s.split(/[ ,]+/).filter(Boolean).map(x=>BigInt(x));
$("#fu-go").onclick=()=>{if(closed())return;if(sel.length!==3)return AW.toast(t("Select exactly 3 gear."));AW.send({title:"Fuse 3 gear",c:"forge",fn:"enter",args:[sel],value:S.ff})};
$("#di-go").onclick=()=>{if(closed())return;if(!sel.length)return AW.toast(t("Select a gear first."));const n=BigInt(Math.max(1,parseInt($("#di-n").value)||1));AW.send({title:t("Dismantle")+" "+n+" × #"+sel[0],c:"forge",fn:"dismantle",args:[sel[0],n],note:"Burns the gear. Shards are bound to your account and cannot be transferred."})};
$("#re-0").onclick=()=>{if(closed())return;AW.send({title:"Redeem common box with shards",c:"forge",fn:"redeem",args:[0],value:S.f0})};
$("#re-1").onclick=()=>{if(closed())return;AW.send({title:"Redeem premium box with shards",c:"forge",fn:"redeem",args:[1],value:S.f1})};
$("#ce-go").onclick=()=>{if(closed())return;if(sel.length!==3||sel.some(g=>g%5!==4))return AW.toast(t("Select exactly 3 UR gear."));AW.send({title:t("Craft Elite")+": "+AW.name(35+ +$("#ce-t").value),c:"forge",fn:"craftElite",args:[+$("#ce-t").value,sel],value:S.c[0],note:"80% success. On failure one of the 3 gear is returned."})};
$("#ap-go").onclick=()=>{if(closed())return;AW.send({title:"Approve the Forge to lock your craft heroes",c:"robots",fn:"setApprovalForAll",args:[A.cfg.forge,true],note:"Needed only for Mythic and Legend crafts. No BNB is moved."})};
$("#cm-go").onclick=()=>{if(closed())return;const h=ids2($("#cm-h").value);if(h.length!==2)return AW.toast(t("Enter 2 hero IDs."));AW.send({title:t("Craft Mythic")+": "+AW.name(30+ +$("#cm-t").value),c:"forge",fn:"craftMythic",args:[+$("#cm-t").value,h],value:S.c[1],note:"60% success. On failure one hero is returned."})};
$("#cl-go").onclick=()=>{if(closed())return;const h=ids2($("#cl-h").value);if(h.length!==2)return AW.toast(t("Enter 2 hero IDs."));AW.send({title:t("Craft Legend")+": "+AW.name(45+ +$("#cl-t").value),c:"forge",fn:"craftLegend",args:[+$("#cl-t").value,h],value:S.c[2],note:"40% success. On failure one hero is returned."})};
AW.on(()=>{syncWrite();return Promise.all([base(),mine()]).catch(e=>{console.error(e);AW.toast(t("RPC error")+": "+AW.err(e))})})})();
