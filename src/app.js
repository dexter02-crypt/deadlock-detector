import {analyze,waitForGraph} from "./core.js";
const $=s=>document.querySelector(s);
const dead={processes:["P1","P2","P3"],resources:["R1","R2","R3"],edges:[
 {type:"assignment",from:"R1",to:"P1"},{type:"request",from:"P1",to:"R2"},{type:"assignment",from:"R2",to:"P2"},{type:"request",from:"P2",to:"R3"},{type:"assignment",from:"R3",to:"P3"},{type:"request",from:"P3",to:"R1"}]};
const safe={processes:["P1","P2","P3"],resources:["R1","R2","R3"],edges:[
 {type:"assignment",from:"R1",to:"P1"},{type:"request",from:"P1",to:"R2"},{type:"assignment",from:"R2",to:"P2"},{type:"request",from:"P3",to:"R3"}]};
let g=structuredClone(dead);
function render(){
 const r=analyze(g);$("#status").textContent=r.deadlocked?"DEADLOCK CYCLE FOUND":"NO CYCLE FOUND";$("#status").className="metric "+(r.deadlocked?"warning":"good");$("#cycle").textContent=r.cycle?r.cycle.join(" → "):"—";
 const pos={};g.processes.forEach((x,i)=>pos[x]={x:130,y:90+i*115,type:"p"});g.resources.forEach((x,i)=>pos[x]={x:520,y:90+i*115,type:"r"});
 let svg="";for(const e of g.edges){const a=pos[e.from],b=pos[e.to];svg+=`<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke="${e.type==="request"?"#fde68a":"#7dd3fc"}" stroke-width="3" marker-end="url(#arrow)"/>`}
 svg+=`<defs><marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#cbd5e1"/></marker></defs>`;
 for(const [n,o] of Object.entries(pos)){svg+=`<${o.type==="p"?"circle":"rect"} ${o.type==="p"?`cx="${o.x}" cy="${o.y}" r="34"`:`x="${o.x-34}" y="${o.y-34}" width="68" height="68" rx="10"`} fill="#182434" stroke="#60738d" stroke-width="2"/><text x="${o.x}" y="${o.y+5}" text-anchor="middle" fill="#f4f7fb">${n}</text>`}
 $("#graph").innerHTML=svg;
 $("#wait").innerHTML=waitForGraph(g).map(([a,b])=>`<tr><td>${a}</td><td>waits for</td><td>${b}</td></tr>`).join("")||`<tr><td colspan="3">No derived wait-for edges</td></tr>`;
}
$("#dead").onclick=()=>{g=structuredClone(dead);render()};$("#safe").onclick=()=>{g=structuredClone(safe);render()};
$("#remove").onclick=()=>{if(g.edges.length)g.edges.pop();render()};$("#restore").onclick=()=>{g=structuredClone(dead);render()};render();
