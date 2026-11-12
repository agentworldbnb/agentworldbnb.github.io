(async()=>{const A=await AW.ready,{robots:R,gear:G,arena:Z,lottery:L}=A.C,$=AW.$;
const set=(id,v)=>{const e=$(id);if(e)e.textContent=v};
try{const [m,mx,pr,po,bp,fee,day,ho,fo]=await Promise.all([R.totalMinted(),R.MAX_SUPPLY(),R.mintPriceWei(),R.paidOpen(),G.priceWei(0),Z.entryFeeWei(),L.today(),Z.houseOn(),R.freeOpen()]);
 set("#s-minted",Number(m).toLocaleString()+" / "+Number(mx).toLocaleString());set("#s-price",AW.fmt(pr));set("#s-box",AW.fmt(bp));set("#s-fee",AW.fmt(fee));set("#s-house",ho?AW.t("On"):AW.t("Off"));
 const di=await L.dayInfo(day);set("#s-pot",AW.fmt(di[3]));
 if(po||fo){const b=$("#launch");b.classList.add("cy");b.innerHTML=`<b>${AW.t("MINT IS LIVE")}</b><span>${AW.t("Minting is open on-chain.")}</span><a class="btn g sm" href="/play/mint/">${AW.t("Mint now")}</a>`}
}catch(e){console.error(e);set("#s-minted",AW.t("RPC error"))}})();
