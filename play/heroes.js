(async()=>{const A=await AW.ready,{robots:R,gear:G,arena:Z}=A.C,$=AW.$,$$=AW.$$,t=AW.t;let H=[],F="All",cur=null,pick=new Set();
const empty=(m,cta)=>`<div class="empty"><img src="/guide/img/o07.png" alt=""><p>${t(m)}</p>${cta||""}</div>`;
function grid(){const g=$("#h-grid");const L=H.filter(h=>F==="All"||h.f===F);
 if(!AW.addr()){g.className="";g.innerHTML=empty("Connect your wallet to see your heroes.",`<button class="btn g sm" onclick="AW.connect()">${t("Connect Wallet")}</button>`);return}
 if(!H.length){g.className="";g.innerHTML=empty("No heroes in this wallet yet.",`<a class="btn g sm" href="/play/mint/">${t("Go to mint")}</a>`);return}
 g.className="hgrid";g.innerHTML=L.map(AW.heroCard).join("");$$(".hc",g).forEach(c=>c.onclick=()=>detail(H.find(h=>h.id.toString()===c.dataset.id)))}
async function load(){const a=AW.addr();$("#h-grid").innerHTML='<div class="hgrid">'+Array(5).fill('<div class="hc"><div class="skel" style="aspect-ratio:1"></div></div>').join("")+"</div>";
 H=a?await AW.myHeroes(a):[];$("#h-count").textContent=t("My heroes")+(a?" · "+H.length:"");
 const fr=["All",...new Set(H.map(h=>h.f))];$("#h-filter").innerHTML=fr.length>2?fr.map(f=>`<button class="${f===F?"on":""}" data-f="${f}">${t(f==="Pending"?"Unrevealed":f)}</button>`).join(""):"";
 $$("#h-filter button").forEach(b=>b.onclick=()=>{F=b.dataset.f;$$("#h-filter button").forEach(x=>x.classList.toggle("on",x===b));grid()});grid();
 if(cur){const n=H.find(h=>h.id===cur.id);n?detail(n):($("#h-detail").hidden=true)}}
async function detail(h){cur=h;pick.clear();const d=$("#h-detail");d.hidden=false;d.querySelector(".panel").className="panel card f-"+h.f;
 $("#d-pic").innerHTML=`<img src="${h.pending?"/guide/img/r20.png":AW.img(h.c)}" alt="">`;$("#d-frame").textContent=t(h.pending?"Unrevealed":h.f)+" · #"+h.id;$("#d-name").textContent=h.pending?t("Awaiting reveal"):AW.name(h.c);
 const a=AW.addr();const [eq,gp]=await Promise.all([G.equipped(h.id),G.gearPowerBps(h.id)]);let pw="–";try{pw=(await Z.unitPower(h.id,gp)).toString()}catch(_){}
 const gb=Number(gp&0xffffffffn);
 $("#d-kv").innerHTML=(h.st?`<span>HP / ATK</span><b>${h.st[0]} / ${h.st[1]}</b><span>DEF / SPD</span><b>${h.st[2]} / ${h.st[3]}</b>`:"")+`<span>${t("Arena power")}</span><b class="gd">${pw}</b><span>${t("Gear bonus")}</span><b>+${(gb/100).toFixed(2)}%</b>`;
 const MAX=(1n<<256n)-1n;$("#d-eq").innerHTML=[0,1,2,3].map(s=>{const g=eq[s];return g===MAX?`<div>${t(AW.SLOTS[s])}<br>${t("Empty")}</div>`:`<div><img src="/assets/gear/${g}.jpg" alt=""><em>${AW.esc((AW.gear[g]||[g])[0])}</em><span class="x" data-s="${s}" style="position:absolute;top:4px;right:4px;cursor:pointer;background:#05060dcc;color:#fff;padding:0 6px" title="Unequip">✕</span></div>`}).join("");
 $$("#d-eq .x").forEach(x=>x.onclick=()=>AW.send({title:t("Unequip")+" · "+t(AW.SLOTS[+x.dataset.s]),c:"gear",fn:"unequip",args:[h.id,Number(x.dataset.s)]}));
 const inv=$("#d-inv");if(!a){inv.innerHTML="";return}const [bal,lk]=await G.inventory(a);const av=[];for(let i=0;i<80;i++){const n=bal[i]-lk[i];if(n>0n)av.push([100+i,n])}
 inv.innerHTML=av.length?av.map(([g,n])=>AW.gearCard(g,n,"pick")).join(""):`<p class="note">${t("No free gear. Open blind boxes to get some.")} <a href="/play/boxes/">${t("Blind boxes")} →</a></p>`;
 $$(".gi.pick",inv).forEach(c=>c.onclick=()=>{const g=+c.dataset.g,sl=Math.floor((g-100)%20/5);for(const x of [...pick])if(Math.floor((x-100)%20/5)===sl&&x!==g){pick.delete(x);$(`.gi[data-g="${x}"]`,inv).classList.remove("sel")}pick.has(g)?pick.delete(g):pick.add(g);c.classList.toggle("sel")});
 d.scrollIntoView({behavior:"smooth",block:"start"})}
$("#d-equip").onclick=()=>{if(!cur)return;if(!pick.size)return AW.toast(t("Select 1-4 gear (one per slot)."));AW.send({title:t("Equip gear")+" × "+pick.size+" → #"+cur.id,c:"gear",fn:"equipMany",args:[cur.id,[...pick]]})};
AW.on(()=>load().catch(e=>{console.error(e);$("#h-grid").innerHTML=empty("Could not read from BSC. Please retry.")}))})();
