/* Agent World · Play shared module. Client-side only: reads via public BSC RPC, writes via the user's injected wallet (EIP-1193). No keys. */
(function(){
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const t=k=>(window.AW_T&&window.AW_T[k])||k;
const E=window.ethers;
const K=[["o01","Beacon","引航者"],["o02","Forgeheart","熔砧王"],["o03","Aurelle","霜綾"],["o04","Jade Warden","玉獅"],["o05","Oracle Orrery","星儀先知"],["o06","Ashen Ronin","赤笠"],["o07","Pip & Moss","菇菇搭檔"],["o08","Viperion","蝮刃"],["o09","Cubitron","方塊堡"],["o10","Solaris","日鳳"],
["r01","Iron Sentry","鐵壁哨兵"],["r02","Neon Hound","霓虹獵犬"],["r03","Blast Crab","爆破蟹"],["r04","MediBee","醫療蜂"],["r05","Coin Miner","金幣礦工"],["r06","Thunder Ronin","雷電浪人"],["r07","Shadow Stalker","幽影刺客"],["r08","Siege Colossus","攻城巨像"],["r09","Hack Cat","駭客貓"],["r10","Magneto Sage","磁暴賢者"],["r11","Bastion Turtle","堡壘龜"],["r12","Jet Falcon","噴射隼"],["r13","Drill Mole","鑽地鼴"],["r14","Beat Bot","節拍DJ"],["r15","Frost Warden","冰霜守衛"],["r16","Magma Brawler","熔岩拳手"],["r17","Chrono Keeper","時鐘守護者"],["r18","Mirror Phantom","鏡像幻影"],["r19","Night Market Chef","夜市大廚"],["r20","Dragon Mecha","龍神機甲"],
["e01","Thunder Valkyrie Prime","雷霆女武神"],["e02","Nightwatch Sniper","守夜狙擊手"],["e03","Golden Pulse Goddess","黃金脈動女神"],["e04","Void Sky Commander","虛空空戰指揮官"],["e05","Chrono Dragon Empress","時龍女帝"],
["f01","Storm Valkyrie","雷盾劍姬"],["f02","Frostfire Diva","冰炎歌姬"],["f03","Phantom Hacker","幽網駭客"],["f04","Sky Fortress Pilot","天空要塞駕駛員"],["f05","Gold Drill Queen","黃金鑽礦女王"],["f06","Pulse Idol","脈動治療偶像"],["f07","Chrono Mirror Witch","時鏡魔女"],["f08","Railgun Engineer","磁軌工兵"],["f09","Night Market Guardian","夜市守護者"],["f10","Dragon Empress","龍姬"],["l01","Seraph Prime","熾天使"],["l02","Genesis Matriarch","創世之母"]];
const TIERS=["N","R","SR","SSR","UR","LR","Mythic","Genesis"],SPF=["Elite","Mythic","Fusion","Legend"],RAR=["N","R","SR","SSR","UR"],SLOTS=["Weapon","Armor","Core","Accessory"];
const zh=()=>(window.AW_LANG||"en")==="zh-Hant";
const AW=window.AW={$,$$,t,K,TIERS,RAR,SLOTS,me:null,signer:null,chainOk:false,listeners:[]};
AW.name=c=>{const k=K[c];return k?(zh()?k[2]:k[1]):("#"+c)};
AW.img=c=>K[c]?"/guide/img/"+K[c][0]+".png":"/assets/img/box.jpg";
AW.fmt=(w,d=5)=>{if(w==null)return"–";const s=E.formatEther(w);const [a,b=""]=s.split(".");const x=b.slice(0,d).replace(/0+$/,"");return a+(x?"."+x:"")};
AW.short=a=>a?a.slice(0,6)+"…"+a.slice(-4):"";
AW.esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
AW.toast=(m,ms=4200)=>{let b=$("#toast");if(!b){b=document.createElement("div");b.id="toast";document.body.appendChild(b)}const d=document.createElement("div");d.textContent=m;b.appendChild(d);setTimeout(()=>d.remove(),ms)};
// referral: ?ref= is kept locally, then bound off-chain with a free personal_sign (see /api/referral)
try{const r=new URL(location.href).searchParams.get("ref");if(r&&/^0x[0-9a-fA-F]{40}$/.test(r)&&!localStorage.getItem("aw_ref"))localStorage.setItem("aw_ref",r)}catch(_){}
AW.ready=(async()=>{
 const [cfg,abi,gear]=await Promise.all(["/collection/addresses.json","/play/abis.json","/play/gear.json"].map(u=>fetch(u).then(r=>{if(!r.ok)throw new Error(u+" "+r.status);return r.json()})));
 AW.cfg=cfg;AW.abi=abi;AW.gear=gear;
 const RPCS=[cfg.rpc,"https://data-seed-prebsc-1-s1.bnbchain.org:8545","https://bsc-testnet-rpc.publicnode.com"];let rr=0,inflight=0;const q=[];
 const slot=()=>new Promise(r=>{if(inflight<4){inflight++;r()}else q.push(r)}),rel=()=>{const n=q.shift();n?n():inflight--},sleep=ms=>new Promise(r=>setTimeout(r,ms));
 class P extends E.JsonRpcProvider{async _send(payload){const body=JSON.stringify(payload);let last;for(let a=0;a<7;a++){const url=RPCS[rr++%RPCS.length];await slot();
  try{const r=await fetch(url,{method:"POST",headers:{"content-type":"application/json"},body});if(r.status===429||r.status>=500)throw new Error("http "+r.status);const j=await r.json();const arr=Array.isArray(j)?j:[j];
   if(arr.some(x=>x&&x.error&&(x.error.code===-32005||x.error.code===-32016||/rate|limit|busy/i.test(x.error.message||""))||(x&&x.id==null)))throw new Error("rate limited");return arr}
  catch(e){last=e}finally{rel()}await sleep(250*2**a)}throw last}}
 AW.p=new P(cfg.rpc,cfg.chainId,{staticNetwork:E.Network.from(cfg.chainId),batchMaxCount:12,batchStallTime:15});
 const map={robots:"AgentWorldRobots",arena:"AgentWorldArena",gear:"AgentWorldGear",forge:"AgentWorldForge",lottery:"AgentWorldLottery",raffle:"AgentWorldEventRaffle",randomness:"EpochRandomness",arenaRandomness:"EpochRandomness",eligibility:"IAgentEligibility",tierTable:"AgentWorldTierTable"};
 AW.C={};for(const k in map)AW.C[k]=new E.Contract(cfg[k],abi[map[k]],AW.p);
 AW.cname=Object.fromEntries(Object.entries(map).map(([k,v])=>[k,v.replace("AgentWorld","")]));
 return AW})();
AW.ok=false;AW.ready.then(()=>AW.ok=true).catch(e=>{console.error(e);AW.toast("Config load failed: "+e.message)});
// Historical deployment recorded in this package. Replacement addresses are not filled in here.
AW.REQUIRED_SOURCE="74737d45724bcf1a71c47e44595c87786ef49c8b";
AW.LEGACY={gear:"0x1836e1A6c86F6EE21aD50ecde8A70f636Af22ABe",arena:"0x3cAfF32C56b5Cb4e8f82427908Ad8Bd2eFBD164C",forge:"0xC35709f1f3Fb5338621d41D06232f7D1c3338079",lottery:"0x7394Ee31A71B459EEE135DbBd62E54054A1c0B4f"};
AW.gate=()=>{const cfg=AW.cfg||{},cut=cfg.cutover||{},eq=(a,b)=>(a||"").toLowerCase()===(b||"").toLowerCase();
 const zero="0x0000000000000000000000000000000000000000",keys=["gear","arena","forge","lottery"];
 const legacy=keys.filter(k=>eq(cfg[k],AW.LEGACY[k])),blank=keys.filter(k=>!cfg[k]||eq(cfg[k],zero));
 const sourceOk=cut.source===AW.REQUIRED_SOURCE,flagged=cut.writesEnabled===true&&cut.verified===true;
 const iface=legacy.length===0&&blank.length===0,open=iface&&sourceOk&&flagged;
 const why=open?"Cutover accepted for source 74737d45724bcf1a71c47e44595c87786ef49c8b. Each transaction still waits for your wallet. Nothing is sent twice."
  :legacy.length?"Transactions are disabled. Gear, Arena, Forge or Lottery still uses a historical address, so this page will not call the new purchase-order or lottery-freeze functions on it."
  :!iface?"Transactions are disabled. A replacement address is missing."
  :"Addresses differ from the historical set, but writes stay off until cutover.verified, cutover.writesEnabled and cutover.source are all set to the verified source. This page does not check bytecode.";
 return {open,iface,legacy,blank,sourceOk,flagged,why}};
AW.utcDay=async()=>{await AW.ready;const b=await AW.p.getBlock("latest");return BigInt(b.timestamp)/86400n};
// ---------- wallet ----------
const eth=()=>window.ethereum;
AW.connect=async(silent)=>{
 if(!eth()){if(!silent)AW.toast(t("No wallet found. Install MetaMask, OKX or Binance Web3 Wallet."));return}
 const accs=await eth().request({method:silent?"eth_accounts":"eth_requestAccounts"});if(!accs||!accs.length)return;
 const bp=new E.BrowserProvider(eth());AW.bp=bp;AW.me=E.getAddress(accs[0]);
 const cid=parseInt(await eth().request({method:"eth_chainId"}),16);AW.chainOk=cid===97;
 AW.signer=await bp.getSigner();try{localStorage.setItem("aw_conn","1")}catch(_){}
 if(!AW.chainOk&&!silent)await AW.switch();AW.emit();if(!silent&&AW.pendingRef())setTimeout(()=>AW.bindRef(),400)};
AW.switch=async()=>{try{await eth().request({method:"wallet_switchEthereumChain",params:[{chainId:"0x61"}]})}catch(e){if(e.code===4902)await eth().request({method:"wallet_addEthereumChain",params:[{chainId:"0x61",chainName:"BNB Smart Chain Testnet",nativeCurrency:{name:"tBNB",symbol:"tBNB",decimals:18},rpcUrls:["https://bsc-testnet-rpc.publicnode.com"],blockExplorerUrls:["https://testnet.bscscan.com"]}]});else AW.toast(t("Please switch your wallet to BNB Smart Chain Testnet (chain ID 97)."))}};
AW.refMsg=(I,V,ts)=>`Agent World referral binding\nInviter: ${I}\nInvitee: ${V}\nChain ID: 97\nIssued at: ${ts}\n\nSigning is free and sends no transaction.`;
AW.copyRef=async()=>{if(!AW.me)await AW.connect();if(!AW.me)return;const l=location.origin+"/play/?ref="+AW.me;try{await navigator.clipboard.writeText(l);AW.toast(t("Invite link copied: ")+AW.short(AW.me))}catch(_){prompt(t("Copy your invite link"),l)}};
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("[data-copyref]");if(b){e.preventDefault();AW.copyRef()}});
AW.refStats=async a=>{try{const r=await fetch("/api/referral/stats?addr="+a,{cache:"no-store"});return r.ok?await r.json():null}catch(_){return null}};
AW.pendingRef=()=>{try{const r=localStorage.getItem("aw_ref");return r&&AW.me&&r.toLowerCase()!==AW.me.toLowerCase()&&!localStorage.getItem("aw_refdone_"+AW.me.toLowerCase())?E.getAddress(r):null}catch(_){return null}};
AW.bindRef=async(quiet)=>{const I=AW.pendingRef();if(!I||!AW.signer)return;const V=AW.me;
 const st=await AW.refStats(V);if(st&&st.invitedBy){localStorage.setItem("aw_refdone_"+V.toLowerCase(),st.invitedBy);if(!quiet)AW.toast(t("This wallet already has an inviter."));return}
 const ts=new Date().toISOString();let sig;try{sig=await AW.signer.signMessage(AW.refMsg(I,V,ts))}catch(e){if(!quiet)AW.toast(t("Signature cancelled."));return}
 const r=await fetch("/api/referral/bind",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({inviter:I,invitee:V,ts,signature:sig})});const j=await r.json().catch(()=>({}));
 if(j.ok||j.already){localStorage.setItem("aw_refdone_"+V.toLowerCase(),j.inviter||I);AW.toast(j.ok?t("Invite confirmed ✓"):t("This wallet already has an inviter."))}else AW.toast(t("Invite not recorded: ")+(j.error||r.status));AW.emit()};
AW.disconnect=()=>{AW.me=null;AW.signer=null;try{localStorage.removeItem("aw_conn")}catch(_){}AW.emit()};
// read-only "view as" for testing / sharing: ?as=0x...
AW.viewAs=(()=>{try{const a=new URL(location.href).searchParams.get("as");return a&&/^0x[0-9a-fA-F]{40}$/.test(a)?E.getAddress(a):null}catch(_){return null}})();
AW.addr=()=>AW.me||AW.viewAs;
AW.on=f=>{AW.listeners.push(f);if(AW.emitted)Promise.resolve().then(f).catch(e=>console.error(e))};
AW.emit=async()=>{await AW.ready;AW.emitted=true;renderBar();for(const f of AW.listeners)try{await f()}catch(e){console.error(e)}};
if(eth()&&eth().on){eth().on("accountsChanged",()=>AW.connect(true).then(()=>{if(!AW.me)AW.emit()}));eth().on("chainChanged",()=>location.reload())}
async function renderBar(){const b=$("#wbar");if(!b)return;
 let note=$("#aw-gate");if(!note){note=document.createElement("div");note.id="aw-gate";note.className="banner";b.insertAdjacentElement("afterend",note)}
 note.textContent=t(AW.gate().why);const a=AW.addr();
 b.classList.toggle("on",!!a&&(AW.chainOk||!AW.me));b.classList.toggle("bad",!!AW.me&&!AW.chainOk);
 $("#w-addr").textContent=a?AW.short(a):t("Not connected");$("#w-mode").textContent=AW.me?(AW.chainOk?t("BNB Smart Chain"):t("Wrong network")):(a?t("View only"):t("Connect to play"));
 $("#w-btn").textContent=AW.me?(AW.chainOk?t("Disconnect"):t("Switch to BSC")):t("Connect Wallet");
 $("#w-bal").textContent="";if(a){try{$("#w-bal").textContent=AW.fmt(await AW.p.getBalance(a),4)+" BNB"}catch(_){}}}
document.addEventListener("DOMContentLoaded",()=>{const btn=$("#w-btn");if(btn)btn.onclick=()=>AW.me?(AW.chainOk?AW.disconnect():AW.switch()):AW.connect();
 AW.ready.then(async()=>{try{if(localStorage.getItem("aw_conn"))await AW.connect(true)}catch(_){}AW.emit()});
 const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}}),{threshold:.08});$$(".rv").forEach(x=>io.observe(x));AW.io=io});
AW.reveal=root=>$$(".rv",root).forEach(x=>AW.io?AW.io.observe(x):x.classList.add("in"));
AW.need=()=>{if(!AW.me){AW.connect();return false}if(!AW.chainOk){AW.switch();return false}return true};
// ---------- errors ----------
AW.err=e=>{const r=e&&(e.revert||e.info&&e.info.error);if(e&&e.revert&&e.revert.name)return e.revert.name+(e.revert.args&&e.revert.args.length?"("+e.revert.args.join(",")+")":"");
 const d=e&&(e.data||(e.info&&e.info.error&&e.info.error.data)||(e.error&&e.error.data));
 if(d&&typeof d==="string"&&d.length>=10){for(const n in AW.abi){try{const pe=new E.Interface(AW.abi[n]).parseError(d);if(pe)return pe.name}catch(_){}}}
 return(e&&(e.shortMessage||e.reason||e.message))||String(e)};
AW.HINT={NotOpen:"Not open yet: mint and this feature open on 2026-11-08.",WrongFee:"Exact fee required.",NotAgent:"This needs an Agent ID wallet.",AlreadyClaimed:"This Agent ID already claimed its free mint.",LimitReached:"Daily box limit reached (resets 00:00 UTC).",NotReady:"The seed is not ready. Waiting does not remove pity or a lottery snapshot.",PityPending:"An earlier box in purchase order is not finalized. Finalize pity (at most 32 boxes per transaction), then open.",DayNotOver:"commit is refused until two UTC days have passed (day + 2).",BadStatus:"That lottery day is not in the required state.",AlreadyOpened:"This box is already open.",NotLottery:"Arena lottery address does not match the caller.",BadQty:"Quantity is outside the contract limit. Finalize pity accepts 1 to 32.",TwoOfficials:"Max 1 Official hero per team.",WrongValue:"Amount does not match the on-chain price.",EnforcedPause:"Contract is paused.",GiftState:"No giveaway credits on this wallet.",WeeklyCap:"Weekly redeem limit reached.",NoShards:"Not enough shards.",NoGear:"You don't hold a free copy of that gear.",BadTeam:"Team must be 1-3 heroes, filled from the first slot.",Closed:"This raffle is closed.",SoldOut:"Sold out.",Nothing:"Nothing to claim.",Locked:"That gear is locked (equipped) or not in your wallet.",NotBuyer:"Only the buyer can open this box.",ERC721NonexistentToken:"That hero does not exist.",NotOwnerOfRobot:"You must own every hero in the team.",CraftPending:"A hero in this team is locked in a pending craft.",DuplicateRobot:"The same hero is in the team twice.",BadGear:"These inputs do not fit this recipe (rarity, hero type or ownership).",BadState:"That match or entry is not in the right state for this action.",NotYours:"That entry is not yours.",TooEarly:"Too early. Wait for the batch window to close.",Underpaid:"Amount is below the on-chain price.",NotOwner:"You do not own that item.",CraftLocked:"That hero is locked in a pending craft.",BadFee:"Exact fee required.",BadTier:"Invalid box tier."};
AW.explain=e=>{const n=AW.err(e);const k=n.split("(")[0];return AW.HINT[k]?t(AW.HINT[k])+" ("+k+")":n};
// ---------- confirmed write: simulate (eth_call) first, show BNB amount, then send through the user's wallet ----------
AW.send=async({title,c,fn,args=[],value=0n,note})=>{
 await AW.ready;const g=AW.gate();if(!g.open){AW.toast(t(g.why));return}
 if(!AW.need())return;const ct=AW.C[c];value=BigInt(value);
 const data=ct.interface.encodeFunctionData(fn,args);const tx={to:AW.cfg[c],data,value,from:AW.me};
 let sim=null,gas=null;try{await AW.p.call(tx);try{gas=await AW.p.estimateGas(tx)}catch(_){}}catch(e){sim=e}
 try{const bal=await AW.p.getBalance(AW.me);let need=value;if(gas){try{const fd=await AW.p.getFeeData();if(fd.gasPrice)need+=gas*fd.gasPrice}catch(_){}}
  if(bal<need)sim={shortMessage:t("Not enough BNB in this wallet.")+" "+t("Needs about")+" "+AW.fmt(need,8)+" BNB ("+t("amount + gas")+"), "+t("wallet has")+" "+AW.fmt(bal,8)+" BNB."}}catch(_){}
 return new Promise(res=>{const m=modal();m.innerHTML=`<div class="bd"><span class="chip g">${t("Confirm transaction")}</span><h3 style="margin-top:12px">${AW.esc(t(title))}</h3>
 <div class="amt">${AW.fmt(value,8)} <small style="font-size:.5em">BNB</small></div>
 <div class="kv"><span>${t("Contract")}</span><b>${AW.cname[c]} · <a href="https://testnet.bscscan.com/address/${AW.cfg[c]}" target=_blank rel=noopener>${AW.short(AW.cfg[c])}</a></b><span>${t("Function")}</span><b><code>${fn}</code></b><span>${t("Amount")}</span><b class="gd">${E.formatEther(value)} BNB</b><span>${t("Network")}</span><b>BNB Smart Chain Testnet (97)</b>${gas?`<span>${t("Est. gas")}</span><b>${gas.toString()}</b>`:""}</div>
 ${note?`<p class="note">${AW.esc(t(note))}</p>`:""}
 ${sim?`<div class="err">${t("Simulation failed, this would revert:")} ${AW.esc(AW.explain(sim))}</div>`:`<div class="okm">${t("Simulation passed against BSC testnet.")}</div>`}
 <div class="acts"><button class="btn o sm" data-x>${t("Cancel")}</button><button class="btn g sm" data-go ${sim?"disabled":""}>${t("Confirm in wallet")}</button></div></div>`;
 requestAnimationFrame(()=>m.classList.add("open"));const close=v=>{m.classList.remove("open");setTimeout(()=>m.remove(),300);res(v)};
 m.querySelector("[data-x]").onclick=()=>close(null);m.onclick=e=>{if(e.target===m)close(null)};
 m.querySelector("[data-go]").onclick=async()=>{const b=m.querySelector("[data-go]");b.disabled=true;b.textContent=t("Waiting for wallet…");
  try{const s=await AW.signer.sendTransaction({to:tx.to,data,value});AW.toast(t("Sent: ")+AW.short(s.hash));b.textContent=t("Pending…");const rc=await s.wait();AW.toast(rc.status===1?t("Confirmed on-chain ✓"):t("Transaction failed"));close(rc);AW.emit()}
  catch(e){b.disabled=false;b.textContent=t("Confirm in wallet");AW.toast(AW.explain(e))}}})};
function modal(){const m=document.createElement("div");m.className="mdl";document.body.appendChild(m);return m}
AW.modal=modal;
// ---------- heroes ----------
AW.hero=async id=>{await AW.ready;id=BigInt(id);const R=AW.C.robots,A=AW.C.arena;const h={id};
 if(id>=10001n&&id<=10010n){h.c=Number(id-10001n);h.f="Official"}
 else if(id>=20001n){h.c=Number(await R.specialCharOf(id));h.f=SPF[Number(await R.specialFrame(id))]}
 else{const sc=Number(await R.seasonCharOf(id));if(sc){h.c=sc;h.f="Season"}else if(!(await R.revealed())){h.f="Pending";h.pending=true}
  else{const [rb,tier]=await AW.C.tierTable.unitOf(await R.metadataIndex(id));h.c=10+Number(rb);h.f=TIERS[Number(tier)]}}
 if(h.c!=null){try{const s=await A.charStats(h.c);h.st=s.map(Number)}catch(_){}}
 return h};
AW.heroCard=(h,i=0)=>`<div class="hc f-${h.f}${h.pending?" pend":""}" data-id="${h.id}" style="animation-delay:${Math.min(i,12)*40}ms"><span class="fr">${t(h.f==="Pending"?"Unrevealed":h.f)}</span>
 <img src="${h.pending?"/guide/img/r20.png":AW.img(h.c)}" alt="${AW.esc(h.pending?t("Unrevealed hero"):AW.name(h.c))}" loading="lazy"><div class="m"><b>${AW.esc(h.pending?t("Awaiting reveal"):AW.name(h.c))}</b><span>#${h.id}</span>
 ${h.st?`<div class="st"><div><i>HP</i>${h.st[0]}</div><div><i>ATK</i>${h.st[1]}</div><div><i>DEF</i>${h.st[2]}</div><div><i>SPD</i>${h.st[3]}</div></div>`:""}</div></div>`;
AW.myHeroes=async a=>{await AW.ready;const ids=await AW.C.robots.tokensOf(a);return Promise.all([...ids].map(AW.hero))};
AW.gearCard=(id,q,extra="")=>{const g=AW.gear[id]||["#"+id,"","","N",""];return`<div class="gi r-${g[3]} ${extra}" data-g="${id}"><span class="rk">${g[3]}</span><span class="id">#${id}</span>${q!=null?`<span class="q">×${q}</span>`:""}<img loading="lazy" src="/assets/gear/${id}.jpg" alt="${AW.esc(g[0])}"><div class="m"><b>${AW.esc(zh()&&g[1]?g[1]:g[0])}</b><span>${t(g[2])} · ${g[4]}</span></div></div>`};
AW.key=async a=>{const [,k]=await AW.C.arena.agentKeyOf(a);return k};
AW.countdown=(el,ts)=>{const f=()=>{let s=Math.max(0,Math.floor(ts-Date.now()/1000));const d=Math.floor(s/86400),h=Math.floor(s%86400/3600),m=Math.floor(s%3600/60),x=s%60;
 el.innerHTML=[[d,"Days"],[h,"Hrs"],[m,"Min"],[x,"Sec"]].map(([v,l])=>`<div><b>${String(v).padStart(2,"0")}</b><span>${t(l)}</span></div>`).join("")};f();setInterval(f,1000)};
AW.LAUNCH=Date.UTC(2026,10,8,0,0,0)/1000; // display only (2026-11-08); actual opening is whatever the contract flags say
})();
