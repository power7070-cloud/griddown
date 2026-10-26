const APPS=[["Refrigerator (full size)",150,8,true],["Chest freezer",80,8,false],["Window AC 8k BTU",700,8,false],["Box/ceiling fan",60,10,true],["LED lights (5 bulbs)",50,6,true],["Wi-Fi router + modem",20,24,true],["Phone/laptop charging",60,4,true],["CPAP",40,8,false],["Microwave",1100,0.25,false],["Sump/well pump",800,1,false],["TV",100,3,false],["Gas furnace blower",500,4,false]];
const PRESETS={"EcoFlow DELTA 2 (1024Wh)":[1024,1800],"EcoFlow DELTA 2 Max (2048Wh)":[2048,2400],"EcoFlow DELTA Pro (3600Wh)":[3600,3600],"EcoFlow DELTA Pro 3 (4096Wh)":[4096,4000],"Tesla Powerwall 3 (13.5kWh)":[13500,11500],"Anker SOLIX F3800 (3840Wh)":[3840,6000],"Custom":[null,null]};
const $=id=>document.getElementById(id),box=$("apps");
function addRow(n,w,h,on){const d=document.createElement("div");d.className="row";d.innerHTML=`<input type=checkbox ${on?"checked":""}><span contenteditable>${n}</span>W<input class=w type=number value=${w}>hrs/day<input class=h type=number step=0.25 value=${h}>`;box.appendChild(d);d.querySelectorAll("input").forEach(i=>i.oninput=calc)}
APPS.forEach(a=>addRow(...a));$("add").onclick=()=>{addRow("Custom",100,2,true);calc()};
for(const k in PRESETS){const o=document.createElement("option");o.textContent=k;$("preset").appendChild(o)}$("preset").value="EcoFlow DELTA Pro (3600Wh)";
$("preset").onchange=e=>{const p=PRESETS[e.target.value];if(p[0]){$("wh").value=p[0];$("out").value=p[1]}calc()};
["wh","out","solar","psh"].forEach(i=>$(i).oninput=calc);
function calc(){let peak=0,daily=0;box.querySelectorAll(".row").forEach(r=>{if(!r.querySelector("input").checked)return;const w=+r.querySelector(".w").value,h=+r.querySelector(".h").value;peak+=w;daily+=w*h});
const usable=+$("wh").value*0.85,solar=+$("solar").value*+$("psh").value*0.75,days=usable/daily,net=daily-solar;
let s=`<div>Daily use: <b>${Math.round(daily)} Wh</b> · Peak if all on at once: <b>${peak} W</b></div><div class=big>${days.toFixed(1)} days on battery alone</div><div>Solar adds ~${Math.round(solar)} Wh/day → `+(net<=0?`<b>indefinite runtime</b> on sunny days 🌞`:`<b>${(usable/net).toFixed(1)} days</b> with solar`)+`</div>`;
if(peak>+$("out").value)s+=`<p class=warn>⚠ Peak load ${peak}W exceeds output ${$("out").value}W — stagger big loads.</p>`;
$("result").innerHTML=s}calc();
