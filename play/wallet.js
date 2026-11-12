(async()=>{const A=await AW.ready,{robots:R,gear:G,forge:F,arena:Z,lottery:L}=A.C,$=AW.$,t=AW.t;
async function load(){const a=AW.addr();const base=location.origin+"/play/";
 const from=localStorage.getItem("aw_ref");$("#ref-from").textContent="";refBox(a,from);
 if(!a){["#wa-bnb","#wa-h","#wa-g","#wa-s","#wa-l","#wa-c"].forEach(x=>$(x).textContent="–");$("#wa-fr").innerHTML=`<p class="note">${t("Connect your wallet to see your assets.")}</p>`;$("#wa-cl").innerHTML="";$("#wa-act").innerHTML=`<button class="btn g sm" onclick="AW.connect()">${t("Connect Wallet")}</button>`;$("#ref-l").value=base;setX(base);return}
 const link=base+"?ref="+a;$("#ref-l").value=link;setX(link);
 const key=await AW.key(a);const [bal,H,[gb],sh,day,cp,ap,lp,gc,[bx,op,rd],[fe,fs,fr]]=await Promise.all([A.p.getBalance(a),AW.myHeroes(a),G.inventory(a),F.shardsOf(a),L.today(),Z.codexPoints(a),Z.pending(a),L.pending(a),R.giftCredits(a),G.boxesOf(a),F.entriesOf(a)]);const sov=await G.balanceOf(a,200);
 const n=await Z.entriesOnDay(key,day),need=await Z.LOTTERY_BATTLES();
 $("#wa-bnb").textContent=AW.fmt(bal,4);$("#wa-h").textContent=H.length;$("#wa-g").textContent=gb.reduce((s,x)=>s+x,0n)+sov;$("#wa-s").textContent=sh;$("#wa-l").textContent=n+" / "+need;$("#wa-c").textContent=cp;
 const by={};H.forEach(h=>by[h.f]=(by[h.f]||0)+1);$("#wa-fr").innerHTML=H.length?Object.entries(by).map(([f,c])=>`<span class="f-${f}" style="color:var(--f)">${t(f==="Pending"?"Unrevealed":f)} × ${c}</span>`).join(""):`<p class="note">${t("No heroes yet.")} <a href="/play/mint/">${t("Go to mint")} →</a></p>`;
 const rb=[...bx].filter((_,i)=>!op[i]&&rd[i]),ub=[...bx].filter((_,i)=>!op[i]).length,rf=[...fe].filter((_,i)=>!fs[i]&&fr[i]).length;
 $("#wa-cl").innerHTML=`<span>${t("Arena winnings")}</span><b class="gd">${AW.fmt(ap,6)} BNB</b><span>${t("Lottery winnings")}</span><b class="gd">${AW.fmt(lp,6)} BNB</b><span>${t("Giveaway mint credits")}</span><b>${gc}</b><span>${t("Unopened boxes (ready)")}</span><b>${ub} (${rb.length})</b><span>${t("Forge entries ready to settle")}</span><b>${rf}</b><span>${t("Lottery today")}</span><b>${n>=need?t("Qualified ✓"):t("Not yet")}</b>`;
 const act=[];if(ap>0n)act.push(`<button class="btn g sm" id="c1">${t("Claim arena")}</button>`);if(lp>0n)act.push(`<button class="btn g sm" id="c2">${t("Claim lottery")}</button>`);if(rb.length)act.push(`<a class="btn o sm" href="/play/boxes/">${t("Open boxes")}</a>`);if(gc>0n)act.push(`<a class="btn o sm" href="/play/mint/">${t("Use credits")}</a>`);
 $("#wa-act").innerHTML=act.join("")||`<span class="note">${t("Nothing to claim right now.")}</span>`;
 const c1=$("#c1");if(c1)c1.onclick=()=>AW.send({title:"Claim arena winnings",c:"arena",fn:"claim"});const c2=$("#c2");if(c2)c2.onclick=()=>AW.send({title:"Claim lottery winnings",c:"lottery",fn:"claim"})}
async function refBox(a,from){const n=$("#ref-n"),es=$("#ref-est"),by=$("#ref-by"),act=$("#ref-act");act.innerHTML="";
 if(!a){$("#ref-q").textContent="–";$("#ref-prog").hidden=true;n.textContent="–";es.textContent="–";by.textContent=from?AW.short(from)+" ("+t("not confirmed")+")":"–";return}
 const st=await AW.refStats(a);if(!st){n.textContent="–";es.textContent="–";by.textContent="–";$("#ref-from").textContent=t("Invite records are temporarily unavailable.");return}
 n.textContent=st.count;const e0=st.estimate||{};$("#ref-q").textContent=st.count?(e0.qualified||0)+" / "+(st.count-(e0.qualified||0)):"0 / 0";const e=st.estimate;es.textContent=e?e.pendingBNB+" BNB":"0 BNB";if(e&&e.updated)$("#ref-from").textContent=t("Estimate updated")+" "+e.updated+(e.week?" · "+t("week")+" "+e.week:"");
 const pr=$("#ref-prog");pr.hidden=!st.invitedBy;if(st.invitedBy){const cum=parseFloat((st.spend&&st.spend.cumBNB)||"0"),mn=parseFloat(st.minBNB||"0.05");$("#ref-pv").textContent=(+cum.toFixed(5))+" / "+mn+" BNB"+(cum>=mn?" ✓":"");$("#ref-pb").style.width=Math.min(100,cum/mn*100)+"%";pr.classList.toggle("ok",cum>=mn)}
 if(st.invitedBy)by.innerHTML=`<a href="https://testnet.bscscan.com/address/${st.invitedBy}" target=_blank rel=noopener>${AW.short(st.invitedBy)}</a> ✓`;
 else if(AW.pendingRef()){by.textContent=AW.short(from)+" ("+t("not confirmed")+")";act.innerHTML=`<button class="btn g sm" id="ref-b">${t("Confirm invite (free signature)")}</button>`;$("#ref-b").onclick=()=>AW.bindRef()}
 else by.textContent=t("None")}
function setX(l){$("#ref-x").href="https://x.com/intent/tweet?text="+encodeURIComponent(t("Join me in Agent World, hero NFT battles on BNB Chain")+" @AgentWorldBNB")+"&url="+encodeURIComponent(l)}
$("#ref-c").onclick=async()=>{try{await navigator.clipboard.writeText($("#ref-l").value);AW.toast(t("Link copied"))}catch(_){$("#ref-l").select();document.execCommand("copy");AW.toast(t("Link copied"))}};
AW.on(()=>load().catch(e=>{console.error(e);AW.toast(t("RPC error")+": "+AW.err(e))}))})();
