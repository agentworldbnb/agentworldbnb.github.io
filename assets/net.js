/* Agent World network config. Switch to mainnet: set AW_NETWORK = "mainnet" and fill mainnet.contracts after deploy. */
var AW_NETWORK = "mainnet";
var AW_NETS = {
 "testnet": {
  "label": "BSC Testnet",
  "chainId": 97,
  "explorer": "https://testnet.bscscan.com",
  "contracts": {
   "robots": "0x429eCA5254c8c3fA9F30A793482b2b05b71Da62F",
   "gear": "0x1750661c1743445d37581782270e010b4Cf35E24",
   "arena": "0xf00495fE45Ad73044C7b8e2f6e57451d9A55f0BA",
   "forge": "0xb642468853D09a04439A8B679cD7780E2aE8FF73",
   "lottery": "0x2A0342bc5A321a364cE382d20ABe842d29C9D692",
   "raffle": "0xBa086c3e81226846D89C0e18D71B36680C0e28B6",
   "randomness": "0x57e2098865aAE480F1b1b912C2D6d5A3223b1d82",
   "arenaRandomness": "0xaDd7ab3B98686D57b34e57FfE373bB28B3F639f3",
   "eligibility": "0x830d060E95797704B50704114e3D68B05D5DEd7f",
   "treasury": "0x145479F86ff50d9Ea3DA856f81Fa22B7F53665ad"
  }
 },
 "mainnet": {
  "label": "BNB Smart Chain",
  "chainId": 56,
  "explorer": "https://bscscan.com",
  "contracts": {
     "robots": "0x931B026F06D9229a25409dD02C99B8517437cb8c",
     "gear": "0x1836e1A6c86F6EE21aD50ecde8A70f636Af22ABe",
     "arena": "0x3cAfF32C56b5Cb4e8f82427908Ad8Bd2eFBD164C",
     "forge": "0xC35709f1f3Fb5338621d41D06232f7D1c3338079",
     "lottery": "0x7394Ee31A71B459EEE135DbBd62E54054A1c0B4f",
     "raffle": "0x8C9Ef6591d9c4FA9F6153A77e766c4275D37629D",
     "randomness": "0xBe5844A71d5d2F99632FAd9a18AAB5A5B44c888C",
     "arenaRandomness": "0x58f1691c815121E607eaA60e8e9C859A62B2A0A7",
     "eligibility": "0x6c30D8DceD6383f7a7C5C2421e81e9030D0FbEB9",
     "tierTable": "0x933a507b3d98E65f88610A9fB9b462701E519016",
     "treasury": "0x145479F86ff50d9Ea3DA856f81Fa22B7F53665ad"
  }
 }
};
(function(){var n=AW_NETS[AW_NETWORK],el=document.getElementById("aw-net");if(!el||!n)return;
var h='<h2 class="disp">Play on '+n.label+'</h2>';
if(AW_NETWORK==="testnet")h+='<p class="sub">Agent World is live on BSC Testnet (chain ID 97). Mainnet launches 11/8. Testnet BNB (tBNB) has no value.</p><ol class="awsteps"><li>Add BSC Testnet to your wallet: chain ID 97, RPC https://bsc-testnet-rpc.publicnode.com</li><li>Get free tBNB from the official <a href="https://www.bnbchain.org/en/testnet-faucet" target="_blank" rel="noopener">BNB Chain faucet</a></li><li>Use the contracts below on <a href="'+n.explorer+'" target="_blank" rel="noopener">testnet BscScan</a></li></ol>';
var c=n.contracts,k=Object.keys(c);if(!k.length)h+='<p class="sub">Contract addresses will be published here after deployment.</p>';
else{h+='<ul class="awaddr">';k.forEach(function(x){h+='<li><b>'+x+'</b> <a href="'+n.explorer+'/address/'+c[x]+'" target="_blank" rel="noopener"><code>'+c[x]+'</code></a></li>'});h+='</ul>'}
el.innerHTML=h;})();
