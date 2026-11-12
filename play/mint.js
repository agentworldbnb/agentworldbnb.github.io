(async()=>{const A=await AW.ready,R=A.C.robots,$=AW.$,t=AW.t;let S={};
const closed=()=>{const g=AW.gate();if(!g.open){AW.toast(t(g.why));return true}return false};
const syncWrite=()=>{
 const open=AW.gate().open;
 const labels={"#m-go":(S.po?t("Mint"):t("Mint (opens 11/8)")),"#f-go":t("Claim free mint"),"#g-go":t("Use 1 credit"),"#w-go":t("Claim whitelist")};
 for(const id of Object.keys(labels)){const el=$(id);if(!el)continue;el.disabled=!open;el.textContent=open?labels[id]:t("Transactions off")}
};
const q=$("#q");const clamp=()=>{let v=parseInt(q.value)||1;v=Math.max(1,Math.min(Number(S.max||20),v));q.value=v;$("#m-total").innerHTML=(S.price!=null?AW.fmt(S.price*BigInt(v),6):"–")+"<small>BNB</small>"};
$("#qm").onclick=()=>{q.value=(parseInt(q.value)||1)-1;clamp()};$("#qp").onclick=()=>{q.value=(parseInt(q.value)||1)+1;clamp()};q.oninput=clamp;
async function load(){
 const [price,max,minted,sup,po,fo,ff,rc,rv,wr,wc,wf,wm,ws]=await Promise.all([R.mintPriceWei(),R.MAX_PER_TX(),R.totalMinted(),R.MAX_SUPPLY(),R.paidOpen(),R.freeOpen(),R.freeMintFeeWei(),R.revealCommitted(),R.revealed(),R.wlRoot(),R.wlCampaign(),R.wlFeeWei(),R.wlMinted(),R.WL_SUPPLY()]);
 S={price,max,po,fo,ff,wf,wr};
 $("#m-price").textContent=AW.fmt(price,6)+" BNB";$("#m-max").textContent=max.toString();$("#m-sup").textContent=Number(minted).toLocaleString()+" / "+Number(sup).toLocaleString();$("#m-barf").style.width=(Number(minted)*100/Number(sup))+"%";
 $("#f-fee").textContent=AW.fmt(ff,6)+" BNB";$("#w-fee").textContent=AW.fmt(wf,6)+" BNB";$("#w-sup").textContent=wm+" / "+ws;
 $("#w-camp").textContent=/^0x0+$/.test(wr)?t("Closed"):("#"+wc);$("#r-c").textContent=rc?t("Yes"):t("No");$("#r-r").textContent=rv?t("Yes"):t("No");
 const st=$("#m-state");if(po||fo){st.className="banner cy rv in";st.innerHTML=`<b>${t("MINT IS LIVE")}</b><span>${po?t("Paid mint open."):""} ${fo?t("Free mint open."):""}</span>`}
 else{st.className="banner rv in";st.innerHTML=`<b>${t("MINT OPENS 2026-11-08")}</b><span>${t("Minting is not open on-chain yet. You can still preview: every button runs a mainnet simulation first and shows why it would fail.")}</span>`}
 $("#r-demo").innerHTML=[{id:"#",f:"Pending",pending:true},{id:10001,f:"Official",c:0},{id:20001,f:"Elite",c:35}].map(AW.heroCard).join("");
 clamp();syncWrite();const a=AW.addr();
 if(a){const [[isA,used],gc]=await Promise.all([R.freeUsed(a),R.giftCredits(a)]);$("#f-agent").textContent=isA?t("Yes"):t("No");$("#f-used").textContent=!isA?t("Agent ID required"):used?t("Already claimed"):t("Available");$("#g-cred").textContent=gc.toString();S.gc=gc}
 else ["#f-agent","#f-used","#g-cred"].forEach(x=>$(x).textContent=t("Connect wallet"))}
$("#m-go").onclick=()=>{if(closed())return;const n=BigInt(q.value);AW.send({title:t("Mint heroes")+" × "+n,c:"robots",fn:"mint",args:[n,"0x"],value:S.price*n,note:"Price is read from the contract. Any excess is refunded."})};
$("#f-go").onclick=()=>{if(closed())return;AW.send({title:"Free Agent ID mint",c:"robots",fn:"claimFree",args:["0x"],value:S.ff})};
$("#g-go").onclick=()=>{if(closed())return;AW.send({title:"Use 1 giveaway credit",c:"robots",fn:"mintGift",value:S.ff})};
$("#w-go").onclick=()=>{if(closed())return;let pr;try{pr=JSON.parse($("#w-p").value||"[]");if(!Array.isArray(pr))throw 0}catch(_){return AW.toast(t("Proof must be a JSON array of 0x… hashes."))}
 const n=BigInt(parseInt($("#w-q").value)||1),al=BigInt(parseInt($("#w-a").value)||0);AW.send({title:"Whitelist mint",c:"robots",fn:"claimWhitelist",args:[n,al,pr,"0x"],value:S.wf*n})};
AW.on(()=>{syncWrite();return load().catch(e=>{console.error(e);AW.toast(t("RPC error")+": "+AW.err(e))})})})();
