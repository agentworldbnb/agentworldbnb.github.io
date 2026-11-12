const GN={"100": "Prototype Riftlight Blade", "101": "Augmented Riftlight Blade", "102": "Quantum Riftlight Blade", "103": "Hyperdimensional Riftlight Blade", "104": "Xeno Relic Riftlight Blade", "105": "Prototype Phase Carapace", "106": "Augmented Phase Carapace", "107": "Quantum Phase Carapace", "108": "Hyperdimensional Phase Carapace", "109": "Xeno Relic Phase Carapace", "110": "Prototype Dimension Drive Core", "111": "Augmented Dimension Drive Core", "112": "Quantum Dimension Drive Core", "113": "Hyperdimensional Dimension Drive Core", "114": "Xeno Relic Dimension Drive Core", "115": "Prototype Void Prism", "116": "Augmented Void Prism", "117": "Quantum Void Prism", "118": "Hyperdimensional Void Prism", "119": "Xeno Relic Void Prism", "120": "Prototype Supernova Pulse Rifle", "121": "Augmented Supernova Pulse Rifle", "122": "Quantum Supernova Pulse Rifle", "123": "Hyperdimensional Supernova Pulse Rifle", "124": "Xeno Relic Supernova Pulse Rifle", "125": "Prototype Corona Armor", "126": "Augmented Corona Armor", "127": "Quantum Corona Armor", "128": "Hyperdimensional Corona Armor", "129": "Xeno Relic Corona Armor", "130": "Prototype Stellar Fusion Core", "131": "Augmented Stellar Fusion Core", "132": "Quantum Stellar Fusion Core", "133": "Hyperdimensional Stellar Fusion Core", "134": "Xeno Relic Stellar Fusion Core", "135": "Prototype Star-Seeker Optic", "136": "Augmented Star-Seeker Optic", "137": "Quantum Star-Seeker Optic", "138": "Hyperdimensional Star-Seeker Optic", "139": "Xeno Relic Star-Seeker Optic", "140": "Prototype Singularity Siege Cannon", "141": "Augmented Singularity Siege Cannon", "142": "Quantum Singularity Siege Cannon", "143": "Hyperdimensional Singularity Siege Cannon", "144": "Xeno Relic Singularity Siege Cannon", "145": "Prototype Event Horizon Plate", "146": "Augmented Event Horizon Plate", "147": "Quantum Event Horizon Plate", "148": "Hyperdimensional Event Horizon Plate", "149": "Xeno Relic Event Horizon Plate", "150": "Prototype Black-Hole Stabilizer", "151": "Augmented Black-Hole Stabilizer", "152": "Quantum Black-Hole Stabilizer", "153": "Hyperdimensional Black-Hole Stabilizer", "154": "Xeno Relic Black-Hole Stabilizer", "155": "Prototype Accretion Halo", "156": "Augmented Accretion Halo", "157": "Quantum Accretion Halo", "158": "Hyperdimensional Accretion Halo", "159": "Xeno Relic Accretion Halo", "160": "Prototype Psionic Resonance Staff", "161": "Augmented Psionic Resonance Staff", "162": "Quantum Psionic Resonance Staff", "163": "Hyperdimensional Psionic Resonance Staff", "164": "Xeno Relic Psionic Resonance Staff", "165": "Prototype Xeno-Bio Shell", "166": "Augmented Xeno-Bio Shell", "167": "Quantum Xeno-Bio Shell", "168": "Hyperdimensional Xeno-Bio Shell", "169": "Xeno Relic Xeno-Bio Shell", "170": "Prototype Hivemind Core", "171": "Augmented Hivemind Core", "172": "Quantum Hivemind Core", "173": "Hyperdimensional Hivemind Core", "174": "Xeno Relic Hivemind Core", "175": "Prototype Neural Tendril Crown", "176": "Augmented Neural Tendril Crown", "177": "Quantum Neural Tendril Crown", "178": "Hyperdimensional Neural Tendril Crown", "179": "Xeno Relic Neural Tendril Crown"};
const $=s=>document.querySelector(s),R=Math.random,TAU=Math.PI*2,pick=a=>a[R()*a.length|0];
const HEROES=[["o01","Beacon"],["o02","Forgeheart"],["o03","Aurelle"],["o04","Jade Warden"],["o05","Oracle Orrery"],["o06","Ashen Ronin"],["o07","Pip & Moss"],["o08","Viperion"],["o09","Cubitron"],["o10","Solaris"]];
const RAR=['Prototype','Augmented','Quantum','Hyperdimensional','Xeno Relic'],RC=['#9aa3b5','#4fa3ff','#a66bff','#ffb02e','#ff4f7b'];
const gear=id=>({id,name:GN[id],r:(id-100)%5,slot:((id-100)/5|0)%4,src:`assets/gear/${id}.jpg`});
const ALLG=Object.keys(GN).map(Number);
const imgs=HEROES.map(h=>{const i=new Image();i.src=`assets/heroes/${h[0]}.png`;return i});
const CTR=[0,0,0,0];function bump(i,n=1){CTR[i]+=n;const e=$('#c'+i);e.textContent=CTR[i].toLocaleString('en-US');e.classList.remove('bump');void e.offsetWidth;e.classList.add('bump')}
// clock
const t0=Date.now();function clock(){const d=new Date();$('#clock').textContent=d.toLocaleTimeString('en-GB');const s=Math.floor((Date.now()-t0)/1000)+3*86400+14*3600+22*60,p=n=>String(n).padStart(2,'0');$('#up').textContent=`${Math.floor(s/86400)}D ${p(Math.floor(s/3600)%24)}:${p(Math.floor(s/60)%60)}:${p(s%60)}`}setInterval(clock,1000);clock();
// roster
const hw=$('#heroes');HEROES.forEach((h,i)=>{const d=document.createElement('div');d.className='hero';d.innerHTML=`<img src="assets/heroes/${h[0]}.png" alt="${h[1]}" style="animation-delay:${-i*.16}s"><b>${h[1]}</b>`;d.onclick=()=>select(i);hw.appendChild(d)});
let sel=0,units=[],track=null;
function select(i){sel=i;[...hw.children].forEach((c,j)=>c.classList.toggle('sel',j==i));$('#crumbHero').textContent=HEROES[i][1].toUpperCase();track=units.find(u=>u.h==i)}
// ===== map =====
const mc=$('#map'),mx=mc.getContext('2d');let MW,MH,DPR,TS;
function fit(c){const r=c.getBoundingClientRect();DPR=Math.min(2,devicePixelRatio||1);c.width=r.width*DPR;c.height=r.height*DPR;return[r.width,r.height]}
const N=9;function iso(gx,gy){return[MW/2+(gx-gy)*TS,MH*.2+(gx+gy)*TS*.5]}
const towers=[[1,1,'#46e3ff'],[7,1,'#9b6bff'],[1,7,'#9b6bff'],[7,7,'#46e3ff'],[4,4,'#f3ba2f']];
let shots=[],floats=[],bursts=[],sparks=[];
units=HEROES.map((h,k)=>({h:k,x:.5+R()*8,y:.5+R()*8,tx:0,ty:0,hp:1,team:k%2,cd:R(),sk:1+R()*2}));units.forEach(newT);
function newT(u){u.tx=.4+R()*8.2;u.ty=.4+R()*8.2}
function resizeMap(){[MW,MH]=fit(mc);TS=Math.max(4,Math.min(MW/(N*2.1),MH/(N*1.2)))}
function tower(gx,gy,col,t){const[x,y]=iso(gx,gy),w=TS*.5,h=TS*(gx==4.5?3.4:2.2);mx.save();
 const g=mx.createRadialGradient(x,y,0,x,y,TS*1.4);g.addColorStop(0,col+'55');g.addColorStop(1,'transparent');mx.fillStyle=g;mx.beginPath();mx.ellipse(x,y,TS*1.4,TS*.7,0,0,TAU);mx.fill();
 for(const s of[-1,1]){const lg=mx.createLinearGradient(x,y,x+s*w,y-h);lg.addColorStop(0,s<0?'#0c1226':'#141c3a');lg.addColorStop(1,s<0?'#1b2550':'#2a3670');mx.fillStyle=lg;mx.beginPath();mx.moveTo(x+s*w,y-w*.5);mx.lineTo(x,y);mx.lineTo(x,y-h);mx.lineTo(x+s*w*.6,y-h-w*.3);mx.closePath();mx.fill();mx.strokeStyle=col;mx.lineWidth=1.2;mx.shadowColor=col;mx.shadowBlur=12;mx.stroke()}
 const k=(t*1.5+gx)%1;mx.globalAlpha=1-k;mx.beginPath();mx.moveTo(x-w*.8,y-h*k-w*.4);mx.lineTo(x,y-h*k);mx.lineTo(x+w*.8,y-h*k-w*.4);mx.stroke();mx.globalAlpha=1;
 const oy=y-h-w*.3-8+Math.sin(t*3+gx)*4;mx.fillStyle=col;mx.shadowBlur=24;mx.beginPath();mx.arc(x,oy,TS*.12,0,TAU);mx.fill();mx.restore()}
let last=performance.now(),T=0,ultCd=60/124*8;
function uxy(u){const[x,y]=iso(u.x,u.y);return[x,y-TS*.85]}
function drawMap(dt){mx.setTransform(DPR,0,0,DPR,0,0);mx.clearRect(0,0,MW,MH);
 for(let gx=0;gx<N;gx++)for(let gy=0;gy<N;gy++){const[x,y]=iso(gx,gy);mx.beginPath();mx.moveTo(x,y);mx.lineTo(x+TS,y+TS*.5);mx.lineTo(x,y+TS);mx.lineTo(x-TS,y+TS*.5);mx.closePath();const p=.5+.5*Math.sin(T*3-(gx+gy)*.6);mx.fillStyle=`rgba(70,227,255,${.02+.06*p})`;mx.fill();mx.strokeStyle=`rgba(70,227,255,${.12+.14*p})`;mx.lineWidth=1;mx.stroke()}
 const[cx,cy]=iso(4.5,4.5);const rr=(T*140)%(TS*6);mx.strokeStyle=`rgba(243,186,47,${.5*(1-rr/(TS*6))})`;mx.lineWidth=2;mx.beginPath();mx.ellipse(cx,cy,rr,rr*.5,0,0,TAU);mx.stroke();
 const items=[];towers.forEach(t=>items.push({d:t[0]+t[1]+1,f:()=>tower(t[0]+.5,t[1]+.5,t[2],T)}));
 units.forEach(u=>{const dx=u.tx-u.x,dy=u.ty-u.y,l=Math.hypot(dx,dy);if(l<.1)newT(u);else{u.x+=dx/l*dt*1.8;u.y+=dy/l*dt*1.8}
  u.cd-=dt;if(u.cd<0){u.cd=.35+R()*.6;const tg=pick(units.filter(o=>o.team!=u.team));shots.push({a:u,b:tg,p:0,c:u.team?'#b48bff':'#46e3ff'})}
  u.sk-=dt;if(u.sk<0){u.sk=1.5+R()*2;skill(u)}
  items.push({d:u.x+u.y,f:()=>drawUnit(u)})});
 ultCd-=dt;if(ultCd<0){ultCd=60/124*8;ult(pick(units))}
 items.sort((a,b)=>a.d-b.d).forEach(i=>i.f());
 bursts=bursts.filter(b=>{b.t+=dt;const k=b.t/b.d;mx.save();mx.globalAlpha=1-k;mx.strokeStyle=b.c;mx.shadowColor=b.c;mx.shadowBlur=20;mx.lineWidth=b.big?4:2.5;mx.beginPath();mx.ellipse(b.x,b.y,b.r*k,b.r*k*.5,0,0,TAU);mx.stroke();
  if(b.big){mx.globalAlpha=(1-k)*.7;const g=mx.createLinearGradient(b.x,0,b.x,b.y);g.addColorStop(0,'transparent');g.addColorStop(1,b.c);mx.fillStyle=g;mx.fillRect(b.x-TS*.35*(1-k),0,TS*.7*(1-k),b.y)}mx.restore();return k<1});
 sparks=sparks.filter(s=>{s.t+=dt;s.x+=s.vx*dt;s.y+=s.vy*dt;s.vy+=200*dt;mx.globalAlpha=Math.max(0,1-s.t/.7);mx.fillStyle=s.c;mx.fillRect(s.x-1.5,s.y-1.5,3,3);mx.globalAlpha=1;return s.t<.7});
 shots=shots.filter(s=>{s.p+=dt*3;const[ax,ay]=uxy(s.a),[bx,by]=uxy(s.b);
  if(s.p>=1){const r=R(),txt=r<.12?'MISS':r<.3?'CRIT -'+(24+R()*20|0):'-'+(6+R()*14|0);txtf(bx,by-TS*.9,txt,r<.12?'#8d93b3':r<.3?'#ffe08a':'#ff6f8f',r<.3&&r>=.12?17:13);spark(bx,by,s.c,6);s.b.hp-=.05;if(s.b.hp<.15){s.b.hp=1;txtf(bx,by-TS*1.3,'RESPAWN','#3dffa8',12)}if(R()<.3)bump(0);return false}
  const x=ax+(bx-ax)*s.p,y=ay+(by-ay)*s.p-Math.sin(s.p*Math.PI)*TS*.7;mx.save();mx.shadowColor=s.c;mx.shadowBlur=14;mx.fillStyle=s.c;mx.beginPath();mx.arc(x,y,3,0,TAU);mx.fill();mx.restore();return true});
 floats=floats.filter(f=>{f.t+=dt;mx.save();mx.globalAlpha=Math.max(0,1-f.t/1);mx.font=`900 ${f.z}px Orbitron`;mx.textAlign='center';mx.fillStyle=f.c;mx.shadowColor=f.c;mx.shadowBlur=10;const sc=f.t<.12?1+(.12-f.t)*4:1;mx.translate(f.x,f.y-f.t*45);mx.scale(sc,sc);mx.fillText(f.s,0,0);mx.restore();return f.t<1});
 hud()}
function txtf(x,y,s,c,z){floats.push({x,y,s,c,z,t:0})}
function spark(x,y,c,n){for(let i=0;i<n;i++)sparks.push({x,y,vx:(R()-.5)*240,vy:-R()*200,c,t:0})}
const SK=['PULSE NOVA','ARC SLASH','SHIELD WAVE','VOID SNARE','OVERCLOCK'];
function skill(u){const[x,y]=iso(u.x,u.y),c=u.team?'#b48bff':'#46e3ff';bursts.push({x,y,r:TS*2.4,t:0,d:.5,c});spark(x,y-TS*.6,c,14);txtf(x,y-TS*1.9,pick(SK),c,11)}
function ult(u){const[x,y]=iso(u.x,u.y);bursts.push({x,y,r:TS*5,t:0,d:.8,c:'#f3ba2f',big:1});spark(x,y-TS*.8,'#ffe08a',30);txtf(x,y-TS*2.2,'ULTIMATE · '+HEROES[u.h][1].toUpperCase(),'#ffe08a',15);
 const f=$('#flash');f.style.setProperty('--fx',x+'px');f.style.setProperty('--fy',y+'px');f.classList.remove('on');void f.offsetWidth;f.classList.add('on');units.filter(o=>o.team!=u.team&&Math.hypot(o.x-u.x,o.y-u.y)<3).forEach(o=>{const[a,b]=uxy(o);txtf(a,b-TS,'-'+(40+R()*30|0),'#ff4f7b',16);o.hp=Math.max(.2,o.hp-.2)})}
function drawUnit(u){const[x,y]=iso(u.x,u.y),im=imgs[u.h],h=TS*1.6,w=h*367/504,b=Math.sin(T*6+u.h)*2;
 mx.save();const c=u.team?'#b48bff':'#46e3ff';mx.fillStyle=c+'33';mx.strokeStyle=c;mx.shadowColor=c;mx.shadowBlur=10;mx.beginPath();mx.ellipse(x,y,TS*.4,TS*.2,0,0,TAU);mx.fill();mx.stroke();mx.restore();
 if(u===track){mx.save();mx.strokeStyle='#f3ba2f';mx.lineWidth=2;mx.shadowColor='#f3ba2f';mx.shadowBlur=16;mx.setLineDash([5,4]);mx.lineDashOffset=-T*40;mx.beginPath();mx.ellipse(x,y,TS*.65,TS*.33,0,0,TAU);mx.stroke();mx.restore()}
 if(im.complete)mx.drawImage(im,x-w/2,y-h+TS*.08+b,w,h);
 mx.fillStyle='#0009';mx.fillRect(x-TS*.4,y-h-3,TS*.8,4);mx.fillStyle=u.hp>.5?'#3dffa8':u.hp>.25?'#f3ba2f':'#ff4f7b';mx.fillRect(x-TS*.4,y-h-3,TS*.8*u.hp,4)}
function hud(){const u=track;if(!u)return;const[x,y0]=iso(u.x,u.y),y=y0-TS*1.7;const bw=230,bh=96,right=x<MW/2,bx=right?MW-bw-14:14,by=14,ex=right?bx:bx+bw,ey=by+bh;
 mx.save();mx.strokeStyle='#f3ba2f';mx.lineWidth=1.5;mx.shadowColor='#f3ba2f';mx.shadowBlur=8;mx.beginPath();mx.moveTo(ex,ey);mx.lineTo(ex+(right?-24:24),ey+24);mx.lineTo(x,y);mx.stroke();
 mx.beginPath();mx.arc(x,y,4,0,TAU);mx.fillStyle='#f3ba2f';mx.fill();mx.shadowBlur=0;
 mx.fillStyle='rgba(10,13,28,.88)';mx.strokeStyle='#f3ba2f';mx.beginPath();mx.roundRect(bx,by,bw,bh,10);mx.fill();mx.stroke();
 const im=imgs[u.h];if(im.complete)mx.drawImage(im,bx+8,by+8,58,80);
 mx.fillStyle='#ffe08a';mx.font='700 13px Orbitron';mx.fillText(HEROES[u.h][1].toUpperCase(),bx+74,by+26);mx.fillStyle='#8d93b3';mx.font='600 10px Inter';mx.fillText('OFFICIAL · TEAM '+(u.team?'B':'A')+' · '+HEROES[u.h][0].toUpperCase(),bx+74,by+42);
 mx.fillText('HP',bx+74,by+60);mx.fillStyle='#ffffff15';mx.fillRect(bx+94,by+54,bw-106,6);mx.fillStyle='#3dffa8';mx.fillRect(bx+94,by+54,(bw-106)*u.hp,6);
 mx.fillStyle='#8d93b3';mx.fillText('SET 4PC · AFFINITY +1%',bx+74,by+80);mx.restore()}
// ===== chart =====
const cc=$('#chart'),cx2=cc.getContext('2d');let CW,CH;const pts=[];let wins=0,games=0;
function simStep(){for(let i=0;i<40;i++){games++;if(R()<.525)wins++}pts.push(wins/games);if(pts.length>80)pts.shift();$('#wr').textContent=(wins/games*100).toFixed(2)+'%';slot(games)}
function drawChart(){cx2.setTransform(DPR,0,0,DPR,0,0);cx2.clearRect(0,0,CW,CH);const lo=.45,hi=.6,Y=v=>CH-10-(v-lo)/(hi-lo)*(CH-20);
 cx2.strokeStyle='#ffffff10';cx2.fillStyle='#5d6386';cx2.font='9px Inter';for(const v of[.45,.5,.55,.6]){cx2.beginPath();cx2.moveTo(26,Y(v));cx2.lineTo(CW,Y(v));cx2.stroke();cx2.fillText(Math.round(v*100)+'%',2,Y(v)+3)}
 if(pts.length<2)return;const X=i=>26+i/79*(CW-30);const path=()=>{cx2.beginPath();pts.forEach((p,i)=>i?cx2.lineTo(X(i),Y(p)):cx2.moveTo(X(i),Y(p)))};
 path();const g=cx2.createLinearGradient(0,0,0,CH);g.addColorStop(0,'#3dffa855');g.addColorStop(1,'#3dffa800');cx2.lineTo(X(pts.length-1),CH);cx2.lineTo(X(0),CH);cx2.fillStyle=g;cx2.fill();
 path();cx2.strokeStyle='#3dffa8';cx2.lineWidth=2;cx2.shadowColor='#3dffa8';cx2.shadowBlur=10;cx2.stroke();cx2.shadowBlur=0;cx2.fillStyle='#fff';cx2.beginPath();cx2.arc(X(pts.length-1),Y(pts[pts.length-1]),3+Math.sin(T*8),0,TAU);cx2.fill()}
const sl=$('#slot');function slot(n){const s=String(n).padStart(6,'0');if(sl.children.length!=s.length)sl.innerHTML=[...s].map(()=>'<span><i>'+[...'0123456789'].map(d=>'<em>'+d+'</em>').join('')+'</i></span>').join('');[...s].forEach((d,i)=>sl.children[i].firstChild.style.transform=`translateY(${-d*22}px)`)}
// ===== forge =====
const fw=$('#forge');function forge(){const slot=R()*4|0,set=R()*4|0,ins=[0,1,2].map(()=>gear(100+set*20+slot*5+(R()*5|0))),lowest=Math.min(...ins.map(g=>g.r));
 const out=gear(100+(R()*4|0)*20+slot*5+lowest);const W=fw.clientWidth,H=fw.clientHeight;
 fw.className='forge';fw.innerHTML='<div class="core"></div>'+ins.map((g,i)=>`<div class="fi" style="--c:${RC[g.r]};left:${[8,W/2-31,W-70][i]}px;top:${[14,H-92,14][i]}px"><img src="${g.src}"></div>`).join('')+`<div class="fo" style="--c:${RC[out.r]}"><img src="${out.src}"></div>`;
 $('#fcap').innerHTML=`<span style="color:${RC[lowest]}">→ ${RAR[lowest]}</span> · lowest input rarity`;
 setTimeout(()=>{fw.classList.add('go');fw.querySelectorAll('.fi').forEach(e=>{e.style.left=W/2-31+'px';e.style.top=H/2-41+'px';e.style.transform='scale(.3) rotate(180deg)';e.style.opacity=0})},700);
 setTimeout(()=>{fw.querySelector('.fo').classList.add('on');bump(2);log('k1','FORGE',`3 inputs merged → ${out.name}`)},1300)}
// ===== ladder =====
const FR=[['N','#9aa3b5'],['R','#4fa3ff'],['SR','#a66bff'],['SSR','#ffb02e'],['UR','#ff4f7b'],['LR','#ff7a2e'],['Mythic','#e04fff'],['Genesis','#3dffa8'],['Fusion','#46e3ff'],['Elite','#c0d0ff'],['Legend','#f5f5ff'],['Official','#f3ba2f']];
const ld=$('#ladder');ld.innerHTML=FR.map((f,i)=>`<span style="--c:${f[1]}">${f[0]}<i>${String(i+1).padStart(2,'0')}</i></span>`).join('');let li2=0;
setInterval(()=>{[...ld.children].forEach((c,j)=>{c.classList.toggle('on',j==li2);c.classList.toggle('done',j<li2)});li2=(li2+1)%13},260);
// ===== flips =====
const fl=$('#flips');let pool=[...ALLG].sort(()=>R()-.5),pi=0;const nextG=()=>gear(pool[pi++%pool.length]);
function setFace(card,g){card.style.setProperty('--c',RC[g.r]);card.querySelector('.f').innerHTML=`<img src="${g.src}"><p><b>${RAR[g.r]}</b>${g.name.replace(RAR[g.r]+' ','')}</p>`}
for(let i=0;i<6;i++){const c=document.createElement('div');c.className='flip';c.innerHTML='<div class="f"></div><div class="b"></div>';setFace(c,nextG());fl.appendChild(c)}
let fi=0;setInterval(()=>{const c=fl.children[fi++%6];c.classList.add('back');setTimeout(()=>{const g=nextG();setFace(c,g);c.classList.remove('back');if(g.r>=3)log('k5','REVEAL',`${g.name} · ${RAR[g.r]}`)},450)},60/124*2000);
// ===== codex toasts =====
const tw=$('#toasts');function codex(){const g=nextG(),b=pick(['+1% ATK','+1% HP','+0.5% ATK / HP']);const d=document.createElement('div');d.className='toast';d.style.setProperty('--c',RC[g.r]);d.innerHTML=`<img src="${g.src}"><div>CODEX UNLOCK · ${b}<small>${g.name}</small></div>`;tw.appendChild(d);setTimeout(()=>d.remove(),2600);while(tw.children.length>3)tw.firstChild.remove();bump(3);log('k5','CODEX',`${g.name} logged · ${b} (max +5%)`)}
// ===== face (Grok Bot avatar) =====
const fc=$('#face'),fx=fc.getContext('2d');let FW;
const MOODS=['LOL','NERVOUS','LOOK','STAR EYES','ANGRY','SINGING','LOVE IT','DIZZY','SHOCKED'];let mi=0,parts=[],moodT=0;
function setMood(i){mi=i;moodT=0;$('#mood').textContent=MOODS[mi]}
setInterval(()=>setMood((mi+1)%MOODS.length),60/124*4000);
function star(x,y,r,c){fx.save();fx.fillStyle=c;fx.shadowColor=c;fx.shadowBlur=8;fx.beginPath();for(let k=0;k<10;k++){const a=-Math.PI/2+k*Math.PI/5,rr=k%2?r*.45:r;fx.lineTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr)}fx.fill();fx.restore()}
function heart(x,y,r,c){fx.save();fx.fillStyle=c;fx.shadowColor=c;fx.shadowBlur=8;fx.beginPath();fx.moveTo(x,y+r*.9);fx.bezierCurveTo(x-r*1.4,y-r*.1,x-r*.6,y-r*1.1,x,y-r*.35);fx.bezierCurveTo(x+r*.6,y-r*1.1,x+r*1.4,y-r*.1,x,y+r*.9);fx.fill();fx.restore()}
function drawFace(dt){moodT+=dt;const W=FW,c=W/2,m=MOODS[mi];fx.setTransform(DPR,0,0,DPR,0,0);fx.clearRect(0,0,W,W);
 const R0=W*.34,shake=m=='ANGRY'?Math.sin(T*60)*1.5:0,bob=m=='LOL'?Math.abs(Math.sin(T*10))*-5:Math.sin(T*3)*3,sq=m=='LOL'?1+Math.abs(Math.sin(T*10))*.03:1;
 const cx=c+shake,cy=c+bob+W*.04;
 // glow
 const gl=fx.createRadialGradient(cx,cy,R0*.8,cx,cy,R0*1.45);gl.addColorStop(0,m=='ANGRY'?'#ff4f6faa':m=='LOVE IT'?'#ff7ab8aa':'#46e3ffaa');gl.addColorStop(1,'transparent');fx.fillStyle=gl;fx.beginPath();fx.arc(cx,cy,R0*1.45,0,TAU);fx.fill();
 // body
 fx.save();fx.translate(cx,cy);fx.scale(sq,2-sq);
 const bg=fx.createRadialGradient(-R0*.35,-R0*.4,R0*.1,0,0,R0);if(m=='ANGRY'){bg.addColorStop(0,'#ffe3e3');bg.addColorStop(.7,'#ff9a9a');bg.addColorStop(1,'#e25b6b')}else{bg.addColorStop(0,'#ffffff');bg.addColorStop(.75,'#eef3fa');bg.addColorStop(1,'#c4cfdd')}
 fx.fillStyle=bg;fx.beginPath();fx.arc(0,0,R0,0,TAU);fx.fill();
 // blush
 for(const s of[-1,1]){const g=fx.createRadialGradient(s*R0*.55,R0*.2,0,s*R0*.55,R0*.2,R0*.2);g.addColorStop(0,'#ff8fb1cc');g.addColorStop(1,'#ff8fb100');fx.fillStyle=g;fx.beginPath();fx.arc(s*R0*.55,R0*.2,R0*.2,0,TAU);fx.fill()}
 const ink='#1d2233',ex=R0*.36,ey=-R0*.08;fx.strokeStyle=ink;fx.fillStyle=ink;fx.lineWidth=R0*.07;fx.lineCap='round';fx.lineJoin='round';
 const blink=(T%3)<.1;
 for(const s of[-1,1]){const x=s*ex;fx.beginPath();
  if(m=='LOL'){fx.moveTo(x-s*R0*.12,ey-R0*.1);fx.lineTo(x+s*R0*.06,ey);fx.lineTo(x-s*R0*.12,ey+R0*.1);fx.stroke()}
  else if(m=='STAR EYES'){star(x,ey,R0*.17*(1+.15*Math.sin(T*12)),'#ffc83d')}
  else if(m=='LOVE IT'){heart(x,ey,R0*.15*(1+.15*Math.sin(T*10)),'#ff3d7f')}
  else if(m=='DIZZY'){fx.lineWidth=R0*.045;for(let a=0;a<10;a+=.2){const r=a*R0*.015,aa=a+T*8*s;a?fx.lineTo(x+Math.cos(aa)*r,ey+Math.sin(aa)*r):fx.moveTo(x,ey)}fx.stroke();fx.lineWidth=R0*.07}
  else if(m=='SINGING'||blink){fx.arc(x,ey+R0*.04,R0*.1,Math.PI*1.15,Math.PI*1.85);fx.stroke()}
  else if(m=='ANGRY'){fx.moveTo(x-R0*.14,ey-R0*.14+(s>0?R0*.0:0));fx.lineTo(x+R0*.14,ey-R0*.14);fx.stroke();fx.beginPath();fx.moveTo(x-s*R0*.16,ey-R0*.22);fx.lineTo(x+s*R0*.1,ey-R0*.12);fx.stroke();fx.beginPath();fx.ellipse(x,ey+R0*.02,R0*.06,R0*.07,0,0,TAU);fx.fill()}
  else if(m=='SHOCKED'){fx.ellipse(x,ey,R0*.1,R0*.13,0,0,TAU);fx.fill();fx.fillStyle='#fff';fx.beginPath();fx.arc(x+R0*.03,ey-R0*.04,R0*.035,0,TAU);fx.fill();fx.fillStyle=ink}
  else{const lx=m=='LOOK'?Math.sin(T*2)*R0*.06:0;fx.ellipse(x+lx,ey,R0*.075,R0*.1,0,0,TAU);fx.fill();fx.fillStyle='#fff';fx.beginPath();fx.arc(x+lx+R0*.025,ey-R0*.035,R0*.025,0,TAU);fx.fill();fx.fillStyle=ink}}
 // mouth
 const my=R0*.3;fx.beginPath();
 if(m=='LOL'||m=='STAR EYES'||m=='LOVE IT'){fx.moveTo(-R0*.22,my-R0*.06);fx.quadraticCurveTo(0,my+R0*.32,R0*.22,my-R0*.06);fx.closePath();fx.fillStyle='#3a1d2b';fx.fill();fx.save();fx.clip();fx.fillStyle='#ff6f91';fx.beginPath();fx.arc(0,my+R0*.2,R0*.12,0,TAU);fx.fill();fx.restore()}
 else if(m=='NERVOUS'){fx.moveTo(-R0*.16,my);for(let k=1;k<=6;k++)fx.lineTo(-R0*.16+k*R0*.053,my+(k%2?-R0*.04:R0*.02));fx.stroke()}
 else if(m=='ANGRY'){fx.arc(0,my+R0*.12,R0*.13,Math.PI*1.15,Math.PI*1.85);fx.stroke()}
 else if(m=='SINGING'||m=='SHOCKED'){const o=m=='SINGING'?1+.25*Math.sin(T*16):1.2;fx.ellipse(0,my,R0*.09*o,R0*.12*o,0,0,TAU);fx.fillStyle='#3a1d2b';fx.fill()}
 else if(m=='DIZZY'){fx.moveTo(-R0*.14,my);fx.quadraticCurveTo(-R0*.05,my-R0*.08,0,my);fx.quadraticCurveTo(R0*.05,my+R0*.08,R0*.14,my);fx.stroke()}
 else{fx.arc(0,my-R0*.12,R0*.16,Math.PI*.2,Math.PI*.8);fx.stroke()}
 fx.restore();
 // particles
 if(R()<dt*6)parts.push({x:cx+(R()*2-1)*R0*1.1,y:cy-R0*(.6+R()*.5),t:0,m,s:R()});
 parts=parts.filter(p=>{p.t+=dt;const a=Math.max(0,1-p.t/1.4),y=p.y-p.t*28;fx.save();fx.globalAlpha=a;fx.textAlign='center';fx.textBaseline='middle';
  const k=p.m;if(k=='LOL'){fx.fillStyle='#46e3ff';fx.shadowColor='#46e3ff';fx.shadowBlur=8;fx.font=`900 ${W*.08}px Orbitron`;fx.fillText('HA',p.x,y)}
  else if(k=='NERVOUS'){fx.fillStyle='#7fd8ff';const yy=p.y+p.t*60;fx.beginPath();fx.arc(p.x,yy,W*.022,0,Math.PI);fx.lineTo(p.x,yy-W*.05);fx.fill()}
  else if(k=='LOOK'){fx.fillStyle='#ffe08a';fx.font=`800 ${W*.08}px Inter`;fx.fillText('?',p.x,y)}
  else if(k=='STAR EYES'||k=='DIZZY')star(p.x,y,W*.035,'#ffc83d');
  else if(k=='ANGRY'){fx.strokeStyle='#ff3d5a';fx.lineWidth=3;const s=W*.035;fx.beginPath();for(const[dx,dy]of[[-1,-1],[1,-1],[-1,1],[1,1]]){fx.moveTo(p.x+dx*s*.3,y+dy*s);fx.quadraticCurveTo(p.x+dx*s*.3,y+dy*s*.3,p.x+dx*s,y+dy*s*.3)}fx.stroke()}
  else if(k=='SINGING'){fx.fillStyle='#b48bff';fx.shadowColor='#b48bff';fx.shadowBlur=8;fx.font=`${W*.09}px Inter`;fx.fillText(p.s<.5?'♪':'♫',p.x+Math.sin(p.t*5)*6,y)}
  else if(k=='LOVE IT')heart(p.x,y,W*.03,'#ff5c93');
  else{fx.strokeStyle='#ffe08a';fx.lineWidth=3;fx.beginPath();fx.moveTo(p.x,y);fx.lineTo(p.x,y-W*.05);fx.stroke()}
  fx.restore();return a>0&&parts.length<50})}
// ===== log =====
const LOG=[['k2','VRF','fulfillRandomWords · batch seed received'],['k3','BATTLE','Team A wins · 3v3 · Beacon MVP'],['k2','ARENA','batch closed · pairing via VRF seed'],['k3','EQUIP','2-piece set active · +2%'],['k1','AFFINITY','set matches hero · +1%'],['k4','REFUND','self-match · entry refunded in full'],['k3','BATTLE','Solaris crit chain · 3 hits'],['k2','VRF','request sent · awaiting fulfillment'],['k1','TRADE','Official hero transferred · 5% royalty routed'],['k4','CAP','gear bonus clamped at +20%'],['k3','HOUSE','House Bot match · fixed fair odds'],['k3','ULT','Viperion ultimate · 3 targets hit'],['k2','QUEUE','team of 3 · max 1 Official · accepted']];
const lg=$('#log');let li=0;function log(c,k,m){const d=new Date(),p=document.createElement('p');p.innerHTML=`<span class="t">${d.toLocaleTimeString('en-GB')}</span> <span class="${c}">[${k}]</span> ${m.replace(/(\+[\d.]+%|Xeno Relic|Hyperdimensional|5% royalty)/g,'<span class="k1">$1</span>')}`;lg.appendChild(p);while(lg.children.length>16)lg.firstChild.remove()}
function auto(){const[c,k,m]=LOG[li++%LOG.length];log(c,k,m);if(k=='VRF')bump(1);if(k=='BATTLE')bump(0)}
for(let i=0;i<10;i++)auto();setInterval(auto,450);
function sys(){const c=35+R()*40,m=55+R()*15;$('#cpu').style.setProperty('--w',c+'%');$('#mem').style.setProperty('--w',m+'%');$('#cpuv').textContent=c.toFixed(0)+'%';$('#memv').textContent=m.toFixed(0)+'%'}sys();setInterval(sys,700);
$('#tick').innerHTML=['<b>SIM</b>4-PIECE SET <u>≈52–53%</u>','4-PIECE + UR <u>≈55–56%</u>','HOUSE BOT <u>UNCHANGED</u>','2PC <u>+2%</u>','AFFINITY <u>+1%</u>','GEAR CAP <u>+20%</u>','CODEX <u>UP TO +5% ATK/HP</u>','ROYALTY <u>5%</u>','RANDOMNESS <u>CHAINLINK VRF</u>','TEAM <u>3 · MAX 1 OFFICIAL</u>','TESTS <u>269 PASSING</u>'].join('<b>◆</b>');
function resize(){resizeMap();[CW,CH]=fit(cc);FW=Math.max(40,fit(fc)[0])}addEventListener('resize',resize);resize();
select(0);setInterval(()=>select((sel+1)%10),60/124*4000);
for(let i=0;i<30;i++)simStep();setInterval(simStep,300);
forge();setInterval(forge,60/124*12000);setTimeout(()=>{codex();setInterval(codex,1900)},600);
function loop(n){const dt=Math.max(0,Math.min(.05,(n-last)/1000));last=n;T+=dt;drawMap(dt);drawChart();drawFace(dt);requestAnimationFrame(loop)}requestAnimationFrame(loop);
