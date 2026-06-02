import { useState, useEffect, useRef, useCallback } from "react";
import * as Tone from "tone";

// ── SPLASH SCREEN ─────────────────────────────────────────────────────────────
function SplashScreen({onDone}){
  const [phase,setPhase]=useState(0); // 0=fade in, 1=show, 2=fade out
  useEffect(()=>{
    const t1=setTimeout(()=>setPhase(1),400);
    const t2=setTimeout(()=>setPhase(2),2400);
    const t3=setTimeout(()=>onDone(),3100);
    return()=>{clearTimeout(t1);clearTimeout(t2);clearTimeout(t3);};
  },[]);
  return(
    <div style={{
      position:"fixed",inset:0,zIndex:99999,
      background:"linear-gradient(135deg,#06061a 0%,#0d0a2e 40%,#080f2a 70%,#06061a 100%)",
      display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
      opacity:phase===2?0:1,transition:phase===2?"opacity 0.7s ease":"opacity 0.5s ease",
      overflow:"hidden",
    }}>
      {/* Animated background particles */}
      <style>{`
        @keyframes floatUp{0%{transform:translateY(100vh) rotate(0deg);opacity:0}10%{opacity:1}90%{opacity:1}100%{transform:translateY(-100px) rotate(720deg);opacity:0}}
        @keyframes splashPulse{0%,100%{transform:scale(1);filter:drop-shadow(0 0 20px #7C3AED)}50%{transform:scale(1.08);filter:drop-shadow(0 0 50px #7C3AED) drop-shadow(0 0 80px #38BDF8)}}
        @keyframes slideUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
        @keyframes shimmer{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        @keyframes starTwinkle{0%,100%{opacity:0.2}50%{opacity:1}}
        @keyframes orbitSpin{from{transform:rotate(0deg) translateX(80px) rotate(0deg)}to{transform:rotate(360deg) translateX(80px) rotate(-360deg)}}
      `}</style>

      {/* Floating emoji particles */}
      {["📚","⭐","🚀","🧠","💡","📝","🎮","🔬","✨","💎","⚡","🎯"].map((e,i)=>(
        <div key={i} style={{
          position:"absolute",fontSize:20+Math.random()*16,
          left:`${5+i*8}%`,
          animation:`floatUp ${3+i*0.4}s ${i*0.25}s infinite ease-in-out`,
          pointerEvents:"none",userSelect:"none",
        }}>{e}</div>
      ))}

      {/* Glow circles */}
      <div style={{position:"absolute",width:300,height:300,borderRadius:"50%",background:"radial-gradient(circle,rgba(124,58,237,0.25) 0%,transparent 70%)",animation:"splashPulse 2s infinite"}}/>
      <div style={{position:"absolute",width:200,height:200,borderRadius:"50%",background:"radial-gradient(circle,rgba(56,189,248,0.2) 0%,transparent 70%)",animation:"splashPulse 2s 0.5s infinite"}}/>

      {/* Main icon */}
      <div style={{
        width:120,height:120,borderRadius:28,
        background:"linear-gradient(135deg,#7C3AED,#4C1D95)",
        border:"3px solid rgba(124,58,237,0.6)",
        boxShadow:"0 0 40px rgba(124,58,237,0.6),0 0 80px rgba(56,189,248,0.3),inset 0 0 30px rgba(124,58,237,0.2)",
        display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",
        animation:`splashPulse 2s infinite`,
        marginBottom:28,
        opacity:phase>=1?1:0,transition:"opacity 0.5s ease",
        position:"relative",overflow:"hidden",
      }}>
        {/* Icon shine overlay */}
        <div style={{position:"absolute",top:0,left:"-100%",width:"60%",height:"100%",background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent)",transform:"skewX(-20deg)",animation:"shimmer 2s 0.8s infinite"}}/>
        <div style={{fontSize:48,lineHeight:1,marginBottom:2}}>🚀</div>
        <div style={{fontSize:11,color:"rgba(255,255,255,0.9)",fontWeight:900,letterSpacing:2,fontFamily:"'Outfit',sans-serif"}}>STUDY</div>
      </div>

      {/* App name */}
      <div style={{
        opacity:phase>=1?1:0,
        animation:phase>=1?"slideUp 0.6s ease forwards":"none",
        textAlign:"center",
      }}>
        <div style={{
          fontSize:38,fontWeight:900,letterSpacing:-1,
          background:"linear-gradient(135deg,#7C3AED,#38BDF8,#10B981)",
          backgroundSize:"200% 200%",
          WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",
          animation:"shimmer 2s infinite",fontFamily:"'Outfit',sans-serif",
          marginBottom:8,
        }}>Study Quest</div>
        <div style={{fontSize:14,color:"rgba(255,255,255,0.5)",letterSpacing:3,textTransform:"uppercase",fontFamily:"'Outfit',sans-serif"}}>
          Learn · Earn · Play
        </div>
      </div>

      {/* Loading dots */}
      <div style={{display:"flex",gap:8,marginTop:40,opacity:phase>=1?1:0,transition:"opacity 0.5s 0.3s"}}>
        {[0,1,2].map(i=><div key={i} style={{width:8,height:8,borderRadius:"50%",background:"#7C3AED",animation:`starTwinkle 1s ${i*0.2}s infinite`}}/>)}
      </div>
    </div>
  );
}

// ── TIMER BELL ────────────────────────────────────────────────────────────────
async function playTimerBell(){
  try{
    await Tone.start();
    const vol=new Tone.Volume(-4).toDestination();
    const rev=new Tone.Reverb({decay:1.8,wet:0.35}).connect(vol);
    const bell=new Tone.PolySynth(Tone.Synth,{
      oscillator:{type:"sine"},
      envelope:{attack:0.005,decay:0.6,sustain:0.1,release:1.2},
      volume:-6,
    }).connect(rev);
    const lead=new Tone.Synth({
      oscillator:{type:"triangle"},
      envelope:{attack:0.01,decay:0.3,sustain:0.3,release:0.8},
      volume:-10,
    }).connect(rev);
    const now=Tone.now();
    const notes=[
      {n:"E5",t:0},{n:"D5",t:0.16},{n:"C5",t:0.32},{n:"D5",t:0.48},
      {n:"E5",t:0.64},{n:"E5",t:0.80},{n:"E5",t:0.96},
      {n:"D5",t:1.18},{n:"D5",t:1.34},{n:"D5",t:1.50},
      {n:"E5",t:1.72},{n:"G5",t:1.88},{n:"G5",t:2.04},
      {n:"E5",t:2.26},{n:"D5",t:2.42},{n:"C5",t:2.58},{n:"D5",t:2.74},
      {n:"E5",t:2.90},{n:"E5",t:3.06},{n:"E5",t:3.22},{n:"E5",t:3.38},
      {n:"D5",t:3.56},{n:"D5",t:3.72},{n:"E5",t:3.88},{n:"D5",t:4.04},{n:"C5",t:4.20},
    ];
    notes.forEach(({n,t})=>lead.triggerAttackRelease(n,"16n",now+t));
    [[0,"C5","E5","G5"],[1.18,"A4","C5","E5"],[2.26,"F4","A4","C5"],[3.56,"G4","B4","D5"],[4.20,"C5","E5","G5"]].forEach(([t,...ch])=>{
      bell.triggerAttackRelease(ch,"4n",now+t);
    });
    setTimeout(()=>{try{bell.dispose();lead.dispose();rev.dispose();vol.dispose();}catch{}},6000);
  }catch{}
}

// ── MUSIC ─────────────────────────────────────────────────────────────────────
function useBgMusic(){
  const started=useRef(false),parts=useRef([]);
  const [playing,setPlaying]=useState(false);
  const stopAll=()=>{try{Tone.Transport.stop();Tone.Transport.cancel();}catch{};parts.current.forEach(p=>{try{p.dispose();}catch{}});parts.current=[];};
  const start=async()=>{
    if(started.current)return;started.current=true;await Tone.start();
    Tone.Transport.bpm.value=124;Tone.Transport.loop=true;Tone.Transport.loopEnd="16m";
    const vol=new Tone.Volume(-2).toDestination();
    const comp=new Tone.Compressor({threshold:-16,ratio:4}).connect(vol);
    const rev=new Tone.Reverb({decay:1.4,wet:0.18}).connect(comp);
    const dly=new Tone.PingPongDelay({delayTime:"8n.",feedback:0.18,wet:0.1}).connect(rev);
    const lFilt=new Tone.Filter({frequency:4200,type:"lowpass",rolloff:-24}).connect(dly);
    const lead=new Tone.PolySynth(Tone.Synth,{oscillator:{type:"sawtooth"},envelope:{attack:0.01,decay:0.12,sustain:0.55,release:0.6},volume:-8}).connect(lFilt);
    const pad=new Tone.PolySynth(Tone.Synth,{oscillator:{type:"triangle"},envelope:{attack:0.28,decay:0.3,sustain:0.72,release:1.8},volume:-21}).connect(rev);
    const bFilt=new Tone.Filter({frequency:280,type:"lowpass"}).connect(comp);
    const bass=new Tone.Synth({oscillator:{type:"square"},envelope:{attack:0.01,decay:0.16,sustain:0.22,release:0.28},volume:-13}).connect(bFilt);
    const arp=new Tone.Synth({oscillator:{type:"sine"},envelope:{attack:0.004,decay:0.08,sustain:0.04,release:0.2},volume:-16}).connect(dly);
    const kick=new Tone.MembraneSynth({pitchDecay:0.05,octaves:8,volume:-6}).connect(comp);
    const snare=new Tone.NoiseSynth({noise:{type:"white"},envelope:{attack:0.001,decay:0.12,sustain:0,release:0.04},volume:-14}).connect(comp);
    const hh=new Tone.MetalSynth({frequency:400,envelope:{attack:0.001,decay:0.032,release:0.01},harmonicity:5.1,modulationIndex:32,resonance:4000,octaves:1.5,volume:-22}).connect(comp);
    parts.current=[lead,lFilt,pad,bass,bFilt,arp,kick,snare,hh,rev,dly,comp,vol];
    const cmap={C:["C4","E4","G4","B4"],Am:["A3","C4","E4","A4"],F:["F3","A3","C4","F4"],G:["G3","B3","D4","G4"]};
    const prog=["C","C","Am","Am","F","F","G","G"];
    const padEvts=[];for(let r=0;r<2;r++)prog.forEach((ch,i)=>padEvts.push({time:`${r*8+i}:0`,chord:cmap[ch]}));
    const pPart=new Tone.Part((time,{chord})=>pad.triggerAttackRelease(chord,"2n.",time),padEvts).start(0);
    const bRoots={C:"C2",Am:"A1",F:"F1",G:"G1"};
    const bEvts=[];for(let r=0;r<2;r++)["C","C","Am","Am","F","F","G","G"].forEach((ch,i)=>{const bar=r*8+i,rt=bRoots[ch];[0,1,2,3].forEach(b=>bEvts.push({time:`${bar}:${b}`,n:rt}));});
    const bPart=new Tone.Part((time,{n})=>bass.triggerAttackRelease(n,"8n",time),bEvts).start(0);
    const mel=[{b:"0:0:0",n:"E5",d:"8n"},{b:"0:0:2",n:"G5",d:"8n"},{b:"0:1:0",n:"A5",d:"4n"},{b:"0:2:0",n:"G5",d:"8n"},{b:"0:2:2",n:"E5",d:"8n"},{b:"0:3:0",n:"C5",d:"4n"},{b:"1:0:0",n:"A4",d:"8n"},{b:"1:0:2",n:"C5",d:"8n"},{b:"1:1:0",n:"E5",d:"4n"},{b:"1:2:0",n:"G5",d:"8n"},{b:"1:2:2",n:"E5",d:"8n"},{b:"1:3:0",n:"A5",d:"4n"},{b:"2:0:0",n:"F5",d:"8n"},{b:"2:0:2",n:"A5",d:"8n"},{b:"2:1:0",n:"C6",d:"4n"},{b:"2:2:0",n:"A5",d:"8n"},{b:"2:2:2",n:"G5",d:"8n"},{b:"2:3:0",n:"F5",d:"4n"},{b:"3:0:0",n:"G5",d:"8n"},{b:"3:0:2",n:"B5",d:"8n"},{b:"3:1:0",n:"D6",d:"4n"},{b:"3:2:0",n:"C6",d:"8n"},{b:"3:2:2",n:"B5",d:"8n"},{b:"3:3:0",n:"G5",d:"2n"},{b:"4:0:0",n:"E5",d:"8n"},{b:"4:0:2",n:"G5",d:"8n"},{b:"4:1:0",n:"A5",d:"8n"},{b:"4:1:2",n:"C6",d:"8n"},{b:"4:2:0",n:"B5",d:"8n"},{b:"4:2:2",n:"A5",d:"8n"},{b:"4:3:0",n:"G5",d:"8n"},{b:"4:3:2",n:"F5",d:"8n"},{b:"5:0:0",n:"E5",d:"8n"},{b:"5:0:2",n:"D5",d:"8n"},{b:"5:1:0",n:"C5",d:"4n"},{b:"5:2:0",n:"D5",d:"8n"},{b:"5:2:2",n:"E5",d:"8n"},{b:"5:3:0",n:"G5",d:"4n"},{b:"6:0:0",n:"A5",d:"8n"},{b:"6:0:2",n:"C6",d:"8n"},{b:"6:1:0",n:"A5",d:"8n"},{b:"6:1:2",n:"G5",d:"8n"},{b:"6:2:0",n:"F5",d:"8n"},{b:"6:2:2",n:"E5",d:"8n"},{b:"6:3:0",n:"D5",d:"4n"},{b:"7:0:0",n:"G5",d:"8n"},{b:"7:0:2",n:"B5",d:"8n"},{b:"7:1:0",n:"D6",d:"8n"},{b:"7:1:2",n:"B5",d:"8n"},{b:"7:2:0",n:"A5",d:"8n"},{b:"7:2:2",n:"G5",d:"8n"},{b:"7:3:0",n:"E5",d:"2n"}];
    const sm={"C":"C#","C#":"D","D":"D#","D#":"E","E":"F","F":"F#","F#":"G","G":"G#","G#":"A","A":"A#","A#":"B","B":"C"};
    const tr=n=>{const m=n.match(/^([A-G]#?)(\d)$/);if(!m)return n;const p=sm[m[1]];return p+(p==="C"?parseInt(m[2])+1:parseInt(m[2]));};
    const mel2=mel.map(m=>{const bar=parseInt(m.b.split(":")[0]);const rest=m.b.substring(m.b.indexOf(":"));return{time:`${bar+8}${rest}`,n:tr(m.n),d:m.d};});
    const mPart=new Tone.Part((time,{n,d})=>lead.triggerAttackRelease(n,d,time),[...mel.map(m=>({time:m.b,n:m.n,d:m.d})),...mel2]).start(0);
    const arpBars=[4,5,6,7,12,13,14,15];const arpMap={4:"C",5:"A",6:"F",7:"G",12:"C",13:"A",14:"F",15:"G"};const arpSc={C:["C6","E6","G6"],A:["A5","C6","E6"],F:["F5","A5","C6"],G:["G5","B5","D6"]};
    const aEvts=[];arpBars.forEach(bar=>{const sc=arpSc[arpMap[bar]];[0,1,2,3].forEach(beat=>[0,2].forEach(sub=>aEvts.push({time:`${bar}:${beat}:${sub}`,n:sc[(beat*2+sub/2)%sc.length]})));});
    const aPart=new Tone.Part((time,{n})=>arp.triggerAttackRelease(n,"16n",time),aEvts).start(0);
    const dEvts=[];for(let bar=0;bar<16;bar++){[0,1,2,3].forEach(b=>{dEvts.push({time:`${bar}:${b}`,type:"kick"});[0,2].forEach(s=>dEvts.push({time:`${bar}:${b}:${s}`,type:"hh"}));});dEvts.push({time:`${bar}:1`,type:"snare"},{time:`${bar}:3`,type:"snare"});if(bar%2===1)dEvts.push({time:`${bar}:3:2`,type:"hh"});}
    const dPart=new Tone.Part((time,{type})=>{if(type==="kick")kick.triggerAttackRelease("C1","16n",time);else if(type==="snare")snare.triggerAttackRelease("16n",time);else hh.triggerAttackRelease("32n",time);},dEvts).start(0);
    parts.current.push(pPart,bPart,mPart,aPart,dPart);
    Tone.Transport.start("+0.1");setPlaying(true);
  };
  const toggle=()=>{if(!started.current){start();return;}if(Tone.Transport.state==="started"){Tone.Transport.pause();setPlaying(false);}else{Tone.Transport.start();setPlaying(true);}};
  useEffect(()=>()=>stopAll(),[]);
  return{playing,toggle};
}

function MusicButton(){
  const{playing,toggle}=useBgMusic();
  const[pulse,setPulse]=useState(false);
  useEffect(()=>{if(!playing)return;const iv=setInterval(()=>setPulse(p=>!p),550);return()=>clearInterval(iv);},[playing]);
  return(
    <button onClick={toggle} title={playing?"⏸ Pause Music":"🎵 Play Music"}
      style={{position:"fixed",bottom:24,left:24,zIndex:500,width:48,height:48,borderRadius:"50%",
        background:playing?"linear-gradient(135deg,#10B981,#059669)":"rgba(15,15,40,0.85)",
        border:`2px solid ${playing?"#34D399":"rgba(255,255,255,0.18)"}`,color:"#fff",fontSize:20,cursor:"pointer",
        boxShadow:playing?`0 0 ${pulse?28:16}px #10B98177,0 0 ${pulse?50:28}px #10B98133`:"0 2px 12px rgba(0,0,0,0.4)",
        transition:"all 0.25s",display:"flex",alignItems:"center",justifyContent:"center",
        transform:playing&&pulse?"scale(1.1)":"scale(1)"}}>
      {playing?"🎵":"🔇"}
    </button>
  );
}

// ── CANVAS ROUNDRECT POLYFILL ─────────────────────────────────────────────────
if(typeof CanvasRenderingContext2D!=="undefined"&&!CanvasRenderingContext2D.prototype.roundRect){
  CanvasRenderingContext2D.prototype.roundRect=function(x,y,w,h,r=0){
    const rad=Math.min(r,Math.abs(w)/2,Math.abs(h)/2);
    this.moveTo(x+rad,y);this.lineTo(x+w-rad,y);this.arcTo(x+w,y,x+w,y+rad,rad);
    this.lineTo(x+w,y+h-rad);this.arcTo(x+w,y+h,x+w-rad,y+h,rad);
    this.lineTo(x+rad,y+h);this.arcTo(x,y+h,x,y+h-rad,rad);
    this.lineTo(x,y+rad);this.arcTo(x,y,x+rad,y,rad);this.closePath();
  };
}

// ── CHARACTER CONSTANTS ───────────────────────────────────────────────────────
const SKIN_TONES=["#FDBCB4","#F1C27D","#E8A87C","#C68642","#8D5524","#4A2912"];
const HAIR_COLORS=["#1a1a2e","#5c3317","#f0c040","#e67e22","#c0392b","#2c2c2c","#aaaaaa","#7B2FBE","#00B4D8","#FF69B4"];
const HAIR_STYLES_NAMES=["Short","Long","Curly","Wavy","Spiky","Bun","Afro","Mohawk","Straight","Bob"];
const EYE_COLORS=["#1a1a2e","#2e6b3e","#1a4a7a","#7a5c1a","#6b1a1a","#4a2c6b"];
const EYE_NAMES=["Dark","Green","Blue","Brown","Red","Purple"];
const ACCESSORIES=["none","👓","🕶️","🎧","🎩","👑","🎓","⛑️","🌸","💎"];
const ACC_NAMES=["None","Glasses","Sunglasses","Headphones","Top Hat","Crown","Grad Cap","Helmet","Flower","Diamond"];
const OUTFITS=["🧥","👕","🎽","🥼","🦺","🎮","🎸","🚀","⚔️","🧙"];
const OUTFIT_NAMES=["Jacket","T-Shirt","Jersey","Lab Coat","Vest","Gamer","Rockstar","Astronaut","Warrior","Wizard"];
const MOUTH_STYLES=["smile","grin","cool","serious","happy"];
const MOUTH_NAMES=["Smile","Grin","Cool","Serious","Happy"];

function drawHair(ctx,style,x,y,size,color){
  ctx.fillStyle=color;
  const s=size;
  switch(style){
    case 0: // Short
      ctx.beginPath();ctx.ellipse(x,y-s*.08,s*.38,s*.22,0,Math.PI,0);ctx.fill();
      break;
    case 1: // Long
      ctx.beginPath();ctx.ellipse(x,y-s*.08,s*.38,s*.22,0,Math.PI,0);ctx.fill();
      ctx.beginPath();ctx.rect(x-s*.35,y-s*.08,s*.1,s*.45);ctx.fill();
      ctx.beginPath();ctx.rect(x+s*.25,y-s*.08,s*.1,s*.45);ctx.fill();
      break;
    case 2: // Curly
      for(let i=0;i<8;i++){const a=Math.PI+(i/8)*Math.PI;const rx=x+Math.cos(a)*s*.3,ry=y-s*.05+Math.sin(a)*s*.18;ctx.beginPath();ctx.arc(rx,ry,s*.1,0,Math.PI*2);ctx.fill();}
      break;
    case 3: // Wavy
      ctx.beginPath();ctx.moveTo(x-s*.35,y-s*.05);
      for(let i=0;i<=7;i++){const wx=x-s*.35+i*(s*.7/7),wy=y-s*.05-s*.15+Math.sin(i*1.2)*s*.08;ctx.lineTo(wx,wy);}
      ctx.lineTo(x+s*.35,y+s*.1);ctx.lineTo(x-s*.35,y+s*.1);ctx.closePath();ctx.fill();
      break;
    case 4: // Spiky
      for(let i=0;i<6;i++){const a=Math.PI+(i/6)*Math.PI+.1;ctx.beginPath();ctx.moveTo(x+Math.cos(a)*s*.28,y+Math.sin(a)*s*.18);ctx.lineTo(x+Math.cos(a-.2)*s*.42,y+Math.sin(a-.2)*s*.32);ctx.lineTo(x+Math.cos(a+.2)*s*.42,y+Math.sin(a+.2)*s*.32);ctx.closePath();ctx.fill();}
      ctx.beginPath();ctx.ellipse(x,y-s*.08,s*.28,s*.18,0,Math.PI,0);ctx.fill();
      break;
    case 5: // Bun
      ctx.beginPath();ctx.ellipse(x,y-s*.08,s*.38,s*.22,0,Math.PI,0);ctx.fill();
      ctx.beginPath();ctx.arc(x,y-s*.28,s*.11,0,Math.PI*2);ctx.fill();
      break;
    case 6: // Afro
      ctx.beginPath();ctx.arc(x,y-s*.08,s*.42,Math.PI,0);ctx.fill();
      break;
    case 7: // Mohawk
      ctx.beginPath();ctx.moveTo(x-s*.07,y-s*.05);ctx.lineTo(x-s*.05,y-s*.46);ctx.lineTo(x+s*.05,y-s*.46);ctx.lineTo(x+s*.07,y-s*.05);ctx.closePath();ctx.fill();
      break;
    case 8: // Straight
      ctx.beginPath();ctx.rect(x-s*.38,y-s*.28,s*.76,s*.24);ctx.fill();
      ctx.beginPath();ctx.rect(x-s*.38,y-s*.08,s*.1,s*.3);ctx.fill();
      ctx.beginPath();ctx.rect(x+s*.28,y-s*.08,s*.1,s*.3);ctx.fill();
      break;
    case 9: // Bob
      ctx.beginPath();ctx.moveTo(x-s*.38,y-s*.08);ctx.arc(x,y-s*.08,s*.38,Math.PI,0);ctx.lineTo(x+s*.38,y+s*.15);ctx.arc(x,y+s*.15,s*.38,0,Math.PI);ctx.closePath();ctx.fill();
      break;
  }
}

function CharAvatarCanvas({char,size=70}){
  const cvRef=useRef(null);
  useEffect(()=>{
    if(!cvRef.current||!char)return;
    const cv=cvRef.current,ctx=cv.getContext("2d"),s=size;
    ctx.clearRect(0,0,s,s);
    const skin=SKIN_TONES[char.skin]||SKIN_TONES[0];
    const hairColor=HAIR_COLORS[char.hair]||HAIR_COLORS[0];
    const eyeColor=EYE_COLORS[char.eye]||EYE_COLORS[0];
    const cx=s/2,cy=s*0.42;
    // Body / outfit
    ctx.fillStyle=`rgba(80,60,120,0.85)`;
    ctx.beginPath();ctx.rect(cx-s*.22,cy+s*.3,s*.44,s*.35);ctx.fill();
    ctx.font=`${s*.2}px serif`;ctx.textAlign="center";ctx.fillText(OUTFITS[char.outfit||0],cx,cy+s*.55);
    // Hair (behind head)
    drawHair(ctx,char.hairStyle||0,cx,cy,s,hairColor);
    // Head
    ctx.fillStyle=skin;ctx.shadowColor="rgba(0,0,0,0.3)";ctx.shadowBlur=s*.08;
    ctx.beginPath();ctx.ellipse(cx,cy,s*.28,s*.3,0,0,Math.PI*2);ctx.fill();
    ctx.shadowBlur=0;
    // Eyes
    const eyeW=s*.07,eyeH=s*.08;
    [-1,1].forEach(side=>{
      const ex=cx+side*s*.1,ey=cy-s*.05;
      // White
      ctx.fillStyle="#fff";ctx.beginPath();ctx.ellipse(ex,ey,eyeW,eyeH,0,0,Math.PI*2);ctx.fill();
      // Iris
      ctx.fillStyle=eyeColor;ctx.beginPath();ctx.ellipse(ex+side*.01*s,ey,eyeW*.6,eyeH*.7,0,0,Math.PI*2);ctx.fill();
      // Pupil
      ctx.fillStyle="#000";ctx.beginPath();ctx.ellipse(ex+side*.01*s,ey,eyeW*.3,eyeH*.35,0,0,Math.PI*2);ctx.fill();
      // Shine
      ctx.fillStyle="#fff";ctx.beginPath();ctx.arc(ex+side*.015*s-eyeW*.15,ey-eyeH*.2,eyeW*.12,0,Math.PI*2);ctx.fill();
    });
    // Eyebrows
    ctx.strokeStyle=hairColor;ctx.lineWidth=s*.025;ctx.lineCap="round";
    [-1,1].forEach(side=>{ctx.beginPath();ctx.moveTo(cx+side*(s*.04),cy-s*.15);ctx.lineTo(cx+side*(s*.14),cy-s*.17);ctx.stroke();});
    // Mouth
    ctx.strokeStyle="#c0392b";ctx.lineWidth=s*.022;
    const ms=char.mouth||0;
    ctx.beginPath();
    if(ms===0){ctx.arc(cx,cy+s*.1,s*.1,0.1,Math.PI-.1);}
    else if(ms===1){ctx.moveTo(cx-s*.13,cy+s*.08);ctx.quadraticCurveTo(cx,cy+s*.18,cx+s*.13,cy+s*.08);}
    else if(ms===2){ctx.moveTo(cx-s*.12,cy+s*.1);ctx.lineTo(cx+s*.12,cy+s*.1);}
    else if(ms===3){ctx.arc(cx,cy+s*.14,-s*.08,Math.PI,0);}
    else{ctx.moveTo(cx-s*.11,cy+s*.06);ctx.quadraticCurveTo(cx,cy+s*.15,cx+s*.11,cy+s*.06);ctx.moveTo(cx-s*.08,cy+s*.1);ctx.lineTo(cx+s*.08,cy+s*.1);}
    ctx.stroke();
    // Nose
    ctx.strokeStyle=skin==="fair"?"#e8b0a0":"#c0785a";ctx.lineWidth=s*.018;
    ctx.beginPath();ctx.moveTo(cx,cy+s*.02);ctx.quadraticCurveTo(cx+s*.07,cy+s*.1,cx,cy+s*.1);ctx.stroke();
    // Accessory
    if(char.acc>0){ctx.font=`${s*.22}px serif`;ctx.textAlign="center";ctx.fillText(ACCESSORIES[char.acc],cx,cy-s*.32);}
    // Ears
    ctx.fillStyle=skin;
    [-1,1].forEach(side=>{ctx.beginPath();ctx.ellipse(cx+side*s*.28,cy,s*.06,s*.09,0,0,Math.PI*2);ctx.fill();});
  },[char,size]);
  if(!char)return<div style={{width:size,height:size,borderRadius:"50%",background:"rgba(124,58,237,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*.4}}>👤</div>;
  return<canvas ref={cvRef} width={size} height={size} style={{borderRadius:size*.1}}/>;
}

function CharSelector({label,items,names,val,onChange,isColor,isEmoji}){
  return(
    <div style={{marginBottom:12}}>
      <div style={{fontSize:11,color:"#666",marginBottom:5,fontWeight:700,letterSpacing:1,textTransform:"uppercase"}}>{label}</div>
      <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
        {items.map((item,i)=>(
          <button key={i} onClick={()=>onChange(i)} title={names?.[i]}
            style={{width:38,height:38,borderRadius:9,border:`2px solid ${val===i?"#7C3AED":"rgba(255,255,255,0.1)"}`,background:val===i?"rgba(124,58,237,0.3)":"rgba(255,255,255,0.05)",cursor:"pointer",fontSize:isEmoji?18:11,display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.12s",flexShrink:0}}>
            {isColor
              ?<div style={{width:22,height:22,borderRadius:"50%",background:item,border:"1px solid rgba(255,255,255,0.2)"}}/>
              :isEmoji
                ?<span>{item==="none"?"✗":item}</span>
                :<span style={{fontFamily:"monospace",fontSize:9,color:"#ccc",textAlign:"center",lineHeight:1.1,whiteSpace:"nowrap",overflow:"hidden",maxWidth:34}}>{item}</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

function CharacterCreator({onDone,lang}){
  const [charState,setCharState]=useState({skin:0,hair:0,hairStyle:0,eye:0,acc:0,outfit:0,mouth:0});
  const set=(k,v)=>setCharState(prev=>({...prev,[k]:v}));
  return(
    <div style={{maxWidth:460,margin:"0 auto",display:"flex",flexDirection:"column",gap:0}}>
      <h3 style={{background:"linear-gradient(135deg,#7C3AED,#38BDF8,#10B981)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",margin:"0 0 16px",fontSize:20,fontWeight:900,textAlign:"center"}}>
        ✨ {lang==="de"?"Charakter erstellen":lang==="en"?"Create Your Character":lang==="it"?"Crea il personaggio":"Crée ton personnage"}
      </h3>
      <div style={{display:"flex",justifyContent:"center",marginBottom:16}}>
        <div style={{background:"linear-gradient(135deg,rgba(124,58,237,0.25),rgba(56,189,248,0.18))",border:"2px solid rgba(124,58,237,0.5)",borderRadius:22,padding:20,display:"inline-flex",alignItems:"center",justifyContent:"center",boxShadow:"0 0 40px rgba(124,58,237,0.35)"}}>
          <CharAvatarCanvas char={charState} size={110}/>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 16px"}}>
        <CharSelector label="Skin Tone" items={SKIN_TONES} names={["Light","Fair","Medium","Tan","Brown","Deep"]} val={charState.skin} onChange={v=>set("skin",v)} isColor/>
        <CharSelector label="Hair Color" items={HAIR_COLORS} names={["Black","Brown","Blonde","Orange","Red","Dark","Gray","Purple","Cyan","Pink"]} val={charState.hair} onChange={v=>set("hair",v)} isColor/>
        <CharSelector label="Hair Style" items={HAIR_STYLES_NAMES} names={HAIR_STYLES_NAMES} val={charState.hairStyle} onChange={v=>set("hairStyle",v)}/>
        <CharSelector label="Eye Color" items={EYE_COLORS} names={EYE_NAMES} val={charState.eye} onChange={v=>set("eye",v)} isColor/>
        <CharSelector label="Mouth" items={MOUTH_NAMES} names={MOUTH_NAMES} val={charState.mouth} onChange={v=>set("mouth",v)}/>
        <CharSelector label="Accessory" items={ACCESSORIES} names={ACC_NAMES} val={charState.acc} onChange={v=>set("acc",v)} isEmoji/>
      </div>
      <CharSelector label="Outfit" items={OUTFITS} names={OUTFIT_NAMES} val={charState.outfit} onChange={v=>set("outfit",v)} isEmoji/>
      <button onClick={()=>onDone({...charState})} style={{padding:"14px",borderRadius:14,background:"linear-gradient(135deg,#7C3AED,#4C1D95)",color:"#fff",border:"none",fontWeight:900,cursor:"pointer",fontSize:16,marginTop:8,boxShadow:"0 4px 20px rgba(124,58,237,0.4)"}}>
        {lang==="de"?"✅ Fertig!":lang==="en"?"✅ Ready!":lang==="it"?"✅ Pronto!":"✅ Prêt!"}
      </button>
    </div>
  );
}

const T = {
  de: {
    appName:"Study Quest",tagline:"Lerne. Verdiene. Spiele.",subjects:"Fächer",addSubject:"+ Fach hinzufügen",
    myPoints:"Meine Punkte",play:"Spielen",playCost:"1 ⭐ pro Spiel",history:"Verlauf",
    howLong:"Wie lange möchtest du lernen?",back:"← Zurück",chooseTopic:"Thema wählen",
    customTopic:"Eigenes Thema…",topicPlaceholder:"z.B. Subtraktion, Photosynthese…",
    summaryOnly:"Nur Summary",min5:"5 Minuten",min15:"15 Minuten",min30:"30 Minuten",min45:"45 Minuten",min60:"1 Stunde",
    startSession:"▶ Lerneinheit starten",donePoints:"✅ Fertig – Punkte erhalten",
    summaryTitle:"📖 Zusammenfassung",summaryAnswer:"Deine Antwort",answerPlaceholder:"Erkläre das Thema in deinen eigenen Worten…",submitAnswer:"✅ Antwort abschicken",
    midCheck:"📸 Halbzeit-Check!",midDesc:"Schicke ein Foto deines Fortschritts für KI-Feedback.",
    endCheck:"🏁 Abschluss!",endDesc:"Schicke ein Foto mit allem was du gelernt hast.",
    continueBtn:"▶ Weiter lernen",finishBtn:"✅ Abschließen & Punkte holen",
    abort:"⚠️ Abbrechen",abortMsg:"Abgebrochen – keine Punkte erhalten",
    cancelConfirm:"Wirklich abbrechen?",cancelYes:"Ja, abbrechen",cancelNo:"Nein, weitermachen",
    great:"Fantastisch!",earnedPoints:"Punkte verdient!",totalPoints:"Gesamtpunkte",
    home:"🏠 Start",playNow:"🎮 Jetzt spielen!",
    quizBtn:"🧠 Quiz",quizTitle:"Wissens-Quiz",quizLoading:"Fragen werden geladen…",quizResult:"Quiz abgeschlossen!",
    nextQ:"Nächste Frage →",finishQuiz:"Quiz beenden",quizPass:"Super! +2 ⭐",quizPerfect:"Perfekt! +3 ⭐",quizFail:"Weiter üben!",
    subjectName:"Fachname",chooseIcon:"Icon wählen",chooseColor:"Farbe wählen",addBtn:"✅ Fach hinzufügen",preview:"Vorschau",
    typeMsg:"Schreib eine Nachricht…",photoLabel:"📷 Foto für KI-Feedback",choosePhoto:"📷 Foto wählen",
    photoAttached:"✅ Foto angehängt",gamesTitle:"Spiele",exitGame:"← Verlassen",learnTab:"📚 Lernen",
    selectGame:"Spiel auswählen",gameTimer:"Spielzeit",gameTimerDone:"Zeit abgelaufen!",playAgain:"🎮 Nochmal spielen (1 ⭐)",
    needStar:"Du brauchst 1 ⭐ zum Spielen!",
    loginTitle:"Willkommen bei StudyQuest!",loginSubtitle:"Gib deinen Benutzernamen ein um zu starten.",loginLabel:"Benutzername",loginPlaceholder:"Dein Name…",loginBtn:"▶ Loslegen",loginNew:"Neues Profil",loginExisting:"Gespeichertes Profil",loginHello:"Hallo",loginContinue:"Weitermachen",loginOr:"oder",loginCreate:"Neu erstellen",
    switchUser:"👤 Nutzer wechseln",
  },
  en: {
    appName:"Study Quest",tagline:"Learn. Earn. Play.",subjects:"Subjects",addSubject:"+ Add Subject",
    myPoints:"My Points",play:"Play",playCost:"1 ⭐ per game",history:"History",
    howLong:"How long do you want to study?",back:"← Back",chooseTopic:"Choose Topic",
    customTopic:"Custom topic…",topicPlaceholder:"e.g. Subtraction, Photosynthesis…",
    summaryOnly:"Summary only",min5:"5 Minutes",min15:"15 Minutes",min30:"30 Minutes",min45:"45 Minutes",min60:"1 Hour",
    startSession:"▶ Start Session",donePoints:"✅ Done – Get Points",
    summaryTitle:"📖 Summary",summaryAnswer:"Your answer",answerPlaceholder:"Explain the topic in your own words…",submitAnswer:"✅ Submit Answer",
    midCheck:"📸 Halfway Check!",midDesc:"Send a photo of your progress for AI feedback.",
    endCheck:"🏁 Finish!",endDesc:"Send a photo of everything you learned.",
    continueBtn:"▶ Continue Studying",finishBtn:"✅ Finish & Claim Points",
    abort:"⚠️ Quit",abortMsg:"Quit – no points received",
    cancelConfirm:"Really quit?",cancelYes:"Yes, quit",cancelNo:"No, continue",
    great:"Amazing!",earnedPoints:"Points earned!",totalPoints:"Total Points",
    home:"🏠 Home",playNow:"🎮 Play now!",
    quizBtn:"🧠 Quiz",quizTitle:"Knowledge Quiz",quizLoading:"Loading questions…",quizResult:"Quiz complete!",
    nextQ:"Next Question →",finishQuiz:"Finish Quiz",quizPass:"Great! +2 ⭐",quizPerfect:"Perfect! +3 ⭐",quizFail:"Keep practicing!",
    subjectName:"Subject name",chooseIcon:"Choose icon",chooseColor:"Choose color",addBtn:"✅ Add Subject",preview:"Preview",
    typeMsg:"Type a message…",photoLabel:"📷 Photo for AI feedback",choosePhoto:"📷 Choose Photo",
    photoAttached:"✅ Photo attached",gamesTitle:"Games",exitGame:"← Exit",learnTab:"📚 Learn",
    selectGame:"Select a game",gameTimer:"Play time",gameTimerDone:"Time's up!",playAgain:"🎮 Play again (1 ⭐)",
    needStar:"You need 1 ⭐ to play!",
    loginTitle:"Welcome to StudyQuest!",loginSubtitle:"Enter your username to get started.",loginLabel:"Username",loginPlaceholder:"Your name…",loginBtn:"▶ Let's go",loginNew:"New Profile",loginExisting:"Saved Profile",loginHello:"Hello",loginContinue:"Continue",loginOr:"or",loginCreate:"Create new",
    switchUser:"👤 Switch user",
  },
  it: {
    appName:"Study Quest",tagline:"Studia. Guadagna. Gioca.",subjects:"Materie",addSubject:"+ Aggiungi Materia",
    myPoints:"I Miei Punti",play:"Gioca",playCost:"1 ⭐ per gioco",history:"Cronologia",
    howLong:"Quanto vuoi studiare?",back:"← Indietro",chooseTopic:"Scegli Argomento",
    customTopic:"Argomento personalizzato…",topicPlaceholder:"es. Sottrazione, Fotosintesi…",
    summaryOnly:"Solo Riassunto",min5:"5 Minuti",min15:"15 Minuti",min30:"30 Minuti",min45:"45 Minuti",min60:"1 Ora",
    startSession:"▶ Inizia sessione",donePoints:"✅ Finito – Prendi i punti",
    summaryTitle:"📖 Riassunto",summaryAnswer:"La tua risposta",answerPlaceholder:"Spiega l'argomento con parole tue…",submitAnswer:"✅ Invia risposta",
    midCheck:"📸 Check a metà!",midDesc:"Invia una foto per feedback AI.",
    endCheck:"🏁 Fine!",endDesc:"Invia una foto di tutto ciò che hai imparato.",
    continueBtn:"▶ Continua",finishBtn:"✅ Termina e prendi i punti",
    abort:"⚠️ Abbandona",abortMsg:"Abbandonato – nessun punto",
    cancelConfirm:"Vuoi davvero uscire?",cancelYes:"Sì, esci",cancelNo:"No, continua",
    great:"Fantastico!",earnedPoints:"Punti guadagnati!",totalPoints:"Punti totali",
    home:"🏠 Home",playNow:"🎮 Gioca ora!",
    quizBtn:"🧠 Quiz",quizTitle:"Quiz di Conoscenza",quizLoading:"Caricamento domande…",quizResult:"Quiz completato!",
    nextQ:"Domanda successiva →",finishQuiz:"Termina Quiz",quizPass:"Bravo! +2 ⭐",quizPerfect:"Perfetto! +3 ⭐",quizFail:"Continua a esercitarti!",
    subjectName:"Nome materia",chooseIcon:"Scegli icona",chooseColor:"Scegli colore",addBtn:"✅ Aggiungi materia",preview:"Anteprima",
    typeMsg:"Scrivi un messaggio…",photoLabel:"📷 Foto per feedback AI",choosePhoto:"📷 Scegli foto",
    photoAttached:"✅ Foto allegata",gamesTitle:"Giochi",exitGame:"← Esci",learnTab:"📚 Studia",
    selectGame:"Scegli un gioco",gameTimer:"Tempo di gioco",gameTimerDone:"Tempo scaduto!",playAgain:"🎮 Gioca ancora (1 ⭐)",
    needStar:"Hai bisogno di 1 ⭐ per giocare!",
    loginTitle:"Benvenuto su StudyQuest!",loginSubtitle:"Inserisci il tuo nome utente per iniziare.",loginLabel:"Nome utente",loginPlaceholder:"Il tuo nome…",loginBtn:"▶ Inizia",loginNew:"Nuovo Profilo",loginExisting:"Profilo Salvato",loginHello:"Ciao",loginContinue:"Continua",loginOr:"oppure",loginCreate:"Crea nuovo",
    switchUser:"👤 Cambia utente",
  },
  fr: {
    appName:"Study Quest",tagline:"Apprends. Gagne. Joue.",subjects:"Matières",addSubject:"+ Ajouter Matière",
    myPoints:"Mes Points",play:"Jouer",playCost:"1 ⭐ par jeu",history:"Historique",
    howLong:"Combien de temps veux-tu étudier?",back:"← Retour",chooseTopic:"Choisir un Sujet",
    customTopic:"Sujet personnalisé…",topicPlaceholder:"ex. Soustraction, Photosynthèse…",
    summaryOnly:"Résumé seulement",min5:"5 Minutes",min15:"15 Minutes",min30:"30 Minutes",min45:"45 Minutes",min60:"1 Heure",
    startSession:"▶ Commencer la session",donePoints:"✅ Terminé – Points obtenus",
    summaryTitle:"📖 Résumé",summaryAnswer:"Ta réponse",answerPlaceholder:"Explique le sujet avec tes propres mots…",submitAnswer:"✅ Envoyer la réponse",
    midCheck:"📸 Mi-parcours!",midDesc:"Envoie une photo de tes progrès pour un retour IA.",
    endCheck:"🏁 Fin!",endDesc:"Envoie une photo de tout ce que tu as appris.",
    continueBtn:"▶ Continuer",finishBtn:"✅ Terminer et obtenir les points",
    abort:"⚠️ Abandonner",abortMsg:"Abandonné – aucun point reçu",
    cancelConfirm:"Tu es sûr de vouloir quitter?",cancelYes:"Oui, quitter",cancelNo:"Non, continuer",
    great:"Fantastique!",earnedPoints:"Points gagnés!",totalPoints:"Points totaux",
    home:"🏠 Accueil",playNow:"🎮 Jouer maintenant!",
    quizBtn:"🧠 Quiz",quizTitle:"Quiz de Connaissances",quizLoading:"Chargement des questions…",quizResult:"Quiz terminé!",
    nextQ:"Question suivante →",finishQuiz:"Terminer le Quiz",quizPass:"Bien joué! +2 ⭐",quizPerfect:"Parfait! +3 ⭐",quizFail:"Continue à pratiquer!",
    subjectName:"Nom de la matière",chooseIcon:"Choisir une icône",chooseColor:"Choisir une couleur",addBtn:"✅ Ajouter la matière",preview:"Aperçu",
    typeMsg:"Écris un message…",photoLabel:"📷 Photo pour retour IA",choosePhoto:"📷 Choisir photo",
    photoAttached:"✅ Photo attachée",gamesTitle:"Jeux",exitGame:"← Quitter",learnTab:"📚 Apprendre",
    selectGame:"Choisir un jeu",gameTimer:"Temps de jeu",gameTimerDone:"Temps écoulé!",playAgain:"🎮 Rejouer (1 ⭐)",
    needStar:"Tu as besoin de 1 ⭐ pour jouer!",
    loginTitle:"Bienvenue sur StudyQuest!",loginSubtitle:"Entre ton nom d'utilisateur pour commencer.",loginLabel:"Nom d'utilisateur",loginPlaceholder:"Ton nom…",loginBtn:"▶ C'est parti",loginNew:"Nouveau Profil",loginExisting:"Profil Sauvegardé",loginHello:"Bonjour",loginContinue:"Continuer",loginOr:"ou",loginCreate:"Créer nouveau",
    switchUser:"👤 Changer d'utilisateur",
  },
};

// Topics per subject
const SUBJECT_TOPICS = {
  math:    {de:["Subtraktion","Addition","Multiplikation","Division","Brüche","Prozentrechnung","Geometrie","Gleichungen","Potenzen","Wurzeln","Statistik","Wahrscheinlichkeit"],en:["Subtraction","Addition","Multiplication","Division","Fractions","Percentages","Geometry","Equations","Powers","Roots","Statistics","Probability"],it:["Sottrazione","Addizione","Moltiplicazione","Divisione","Frazioni","Percentuali","Geometria","Equazioni","Potenze","Radici","Statistica","Probabilità"],fr:["Soustraction","Addition","Multiplication","Division","Fractions","Pourcentages","Géométrie","Équations","Puissances","Racines","Statistiques","Probabilités"]},
  science: {de:["Atom","Chemische Reaktionen","Periodensystem","Säuren & Basen","Energie","Elektrizität","Magnetismus","Optik","Wärmelehre"],en:["Atoms","Chemical Reactions","Periodic Table","Acids & Bases","Energy","Electricity","Magnetism","Optics","Thermodynamics"],it:["Atomi","Reazioni Chimiche","Tavola Periodica","Acidi & Basi","Energia","Elettricità","Magnetismo","Ottica","Termodinamica"],fr:["Atomes","Réactions Chimiques","Tableau Périodique","Acides & Bases","Énergie","Électricité","Magnétisme","Optique","Thermodynamique"]},
  history: {de:["Antikes Rom","Mittelalter","Französische Revolution","Erster Weltkrieg","Zweiter Weltkrieg","Kalter Krieg","Ägypten","Griechische Antike"],en:["Ancient Rome","Middle Ages","French Revolution","World War I","World War II","Cold War","Egypt","Ancient Greece"],it:["Roma Antica","Medioevo","Rivoluzione Francese","Prima Guerra Mondiale","Seconda Guerra Mondiale","Guerra Fredda","Egitto","Grecia Antica"],fr:["Rome Antique","Moyen Âge","Révolution Française","Première Guerre Mondiale","Deuxième Guerre Mondiale","Guerre Froide","Égypte","Grèce Antique"]},
  german:  {de:["Grammatik","Rechtschreibung","Aufsatz schreiben","Gedichtanalyse","Textanalyse","Kommasetzung","Wortarten","Literatur"],en:["Grammar","Spelling","Essay Writing","Poetry Analysis","Text Analysis","Punctuation","Parts of Speech","Literature"],it:["Grammatica","Ortografia","Scrittura","Analisi Poesia","Analisi Testo","Punteggiatura","Parti del Discorso","Letteratura"],fr:["Grammaire","Orthographe","Rédaction","Analyse Poésie","Analyse Texte","Ponctuation","Parties du Discours","Littérature"]},
  english: {de:["Grammatik","Vokabular","Present Tenses","Past Tenses","Future Tenses","Conditional","Passiv","Leseverstehen"],en:["Grammar","Vocabulary","Present Tenses","Past Tenses","Future Tenses","Conditional","Passive Voice","Reading Comprehension"],it:["Grammatica","Vocabolario","Tempi Presenti","Tempi Passati","Tempi Futuri","Condizionale","Passivo","Comprensione"],fr:["Grammaire","Vocabulaire","Présents","Passés","Futurs","Conditionnel","Voix Passive","Compréhension"]},
  biology: {de:["Zellen","Fotosynthese","Ökosystem","Evolution","Genetik","Verdauung","Atmung","Kreislauf","Nervensystem","Pflanzen"],en:["Cells","Photosynthesis","Ecosystem","Evolution","Genetics","Digestion","Respiration","Circulation","Nervous System","Plants"],it:["Cellule","Fotosintesi","Ecosistema","Evoluzione","Genetica","Digestione","Respirazione","Circolazione","Sistema Nervoso","Piante"],fr:["Cellules","Photosynthèse","Écosystème","Évolution","Génétique","Digestion","Respiration","Circulation","Système Nerveux","Plantes"]},
  italian: {de:["Grundgrammatik","Vokabeln A1","Vokabeln A2","Präsens","Vergangenheit","Futur","Konjunktiv","Aussprache","Alltag & Dialoge","Zahlen & Farben"],en:["Basic Grammar","Vocabulary A1","Vocabulary A2","Present Tense","Past Tense","Future Tense","Subjunctive","Pronunciation","Everyday Dialogues","Numbers & Colors"],it:["Grammatica base","Vocabolario A1","Vocabolario A2","Presente","Passato","Futuro","Congiuntivo","Pronuncia","Dialoghi quotidiani","Numeri e colori"],fr:["Grammaire de base","Vocabulaire A1","Vocabulaire A2","Présent","Passé","Futur","Subjonctif","Prononciation","Dialogues quotidiens","Chiffres et couleurs"]},
  french:  {de:["Grundgrammatik","Vokabeln A1","Vokabeln A2","Präsens","Passé composé","Imparfait","Futur","Konjunktiv","Aussprache","Alltag & Dialoge","Zahlen & Farben"],en:["Basic Grammar","Vocabulary A1","Vocabulary A2","Present Tense","Passé composé","Imparfait","Future Tense","Subjunctive","Pronunciation","Everyday Dialogues","Numbers & Colors"],it:["Grammatica base","Vocabolario A1","Vocabolario A2","Presente","Passé composé","Imparfait","Futuro","Congiuntivo","Pronuncia","Dialoghi quotidiani","Numeri e colori"],fr:["Grammaire de base","Vocabulaire A1","Vocabulaire A2","Présent","Passé composé","Imparfait","Futur","Subjonctif","Prononciation","Dialogues quotidiens","Chiffres et couleurs"]},
};

const DEFAULT_SUBJECTS = [
  {id:"math",   name:{de:"Mathematik",   en:"Mathematics",  it:"Matematica",   fr:"Mathématiques"}, icon:"📐",color:"#7C3AED"},
  {id:"science",name:{de:"Naturwiss.",   en:"Science",      it:"Scienze",      fr:"Sciences"},       icon:"🔬",color:"#0EA5E9"},
  {id:"history",name:{de:"Geschichte",   en:"History",      it:"Storia",       fr:"Histoire"},       icon:"📜",color:"#F59E0B"},
  {id:"german", name:{de:"Deutsch",      en:"German",       it:"Tedesco",      fr:"Allemand"},       icon:"📝",color:"#EC4899"},
  {id:"english",name:{de:"Englisch",     en:"English",      it:"Inglese",      fr:"Anglais"},        icon:"🇬🇧",color:"#10B981"},
  {id:"biology",name:{de:"Biologie",     en:"Biology",      it:"Biologia",     fr:"Biologie"},       icon:"🌱",color:"#14B8A6"},
  {id:"italian",name:{de:"Italienisch",  en:"Italian",      it:"Italiano",     fr:"Italien"},        icon:"🇮🇹",color:"#EF4444"},
  {id:"french", name:{de:"Französisch",  en:"French",       it:"Francese",     fr:"Français"},       icon:"🇫🇷",color:"#3B82F6"},
];

const DURATIONS = [
  {key:"summaryOnly",minutes:0,points:0.5,icon:"📖"},
  {key:"min5",minutes:5,points:0.5,icon:"⚡"},
  {key:"min15",minutes:15,points:1,icon:"⏱️"},
  {key:"min30",minutes:30,points:2,icon:"🕐"},
  {key:"min45",minutes:45,points:3,icon:"🕒"},
  {key:"min60",minutes:60,points:5,icon:"🏆"},
];

// ── API CALL ──────────────────────────────────────────────────────────────────
async function callClaude(messages, system, maxTokens=1000) {
  const res = await fetch("/api/gemini",{
    method:"POST",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({system, messages, maxTokens})
  });
  const data = await res.json();
  return data.text||data.text||data.content?.map(c=>c.text||"").join("")||"";
}

// ── PARKOUR: GAME COMMENT PLACEHOLDER ────────────────────────────────────────
// ══════════════════════════════════════════════
// GAME 1: GRAVITY DASH
// ══════════════════════════════════════════════
// ── SCORE HELPERS ─────────────────────────────────────────────────────────────
function saveGameScore(gameId, score, username){
  if(!username) return;
  const key = `sq_game_${username}_${gameId}_scores`;
  const scores = JSON.parse(localStorage.getItem(key)||"[]");
  scores.push({score, date: new Date().toLocaleDateString()});
  scores.sort((a,b)=>b.score-a.score);
  localStorage.setItem(key, JSON.stringify(scores.slice(0,3)));
}
function getTopScores(gameId, username){
  if(!username) return [];
  const key = `sq_game_${username}_${gameId}_scores`;
  return JSON.parse(localStorage.getItem(key)||"[]");
}

// ── GAME RESULTS OVERLAY ──────────────────────────────────────────────────────
function GameResults({gameId, score, diamonds, username, onClose, gameName}){
  const top = getTopScores(gameId, username);
  const isTopThree = top.length < 3 || score > top[top.length-1]?.score;
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",zIndex:9000,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(10px)"}}>
      <div style={{background:"linear-gradient(135deg,#0d0d28,#0a1228)",border:"2px solid rgba(124,58,237,0.5)",borderRadius:24,padding:28,maxWidth:380,width:"92%",textAlign:"center",boxShadow:"0 0 60px rgba(124,58,237,0.4)"}}>
        <div style={{fontSize:50,marginBottom:8}}>🎮</div>
        <h2 style={{background:"linear-gradient(135deg,#7C3AED,#38BDF8)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",margin:"0 0 6px",fontSize:22,fontWeight:900}}>{gameName}</h2>
        <div style={{fontSize:13,color:"#888",marginBottom:16}}>Session Complete!</div>
        <div style={{display:"flex",gap:14,justifyContent:"center",marginBottom:20}}>
          <div style={{background:"rgba(255,215,0,0.1)",border:"1px solid rgba(255,215,0,0.3)",borderRadius:12,padding:"10px 16px"}}>
            <div style={{fontSize:11,color:"#888"}}>Score</div>
            <div style={{fontSize:28,fontWeight:900,color:"#FFD700"}}>{score}</div>
          </div>
          <div style={{background:"rgba(56,189,248,0.1)",border:"1px solid rgba(56,189,248,0.3)",borderRadius:12,padding:"10px 16px"}}>
            <div style={{fontSize:11,color:"#888"}}>💎 Diamonds</div>
            <div style={{fontSize:28,fontWeight:900,color:"#38BDF8"}}>{diamonds}</div>
          </div>
        </div>
        {isTopThree&&<div style={{background:"rgba(255,215,0,0.12)",border:"1px solid rgba(255,215,0,0.3)",borderRadius:10,padding:"8px 16px",marginBottom:14,fontSize:13,color:"#FFD700",fontWeight:"bold"}}>🏅 New Top Score!</div>}
        {top.length>0&&<div style={{marginBottom:16}}>
          <div style={{fontSize:12,color:"#666",marginBottom:8,fontWeight:700,letterSpacing:1}}>🏆 TOP 3 SCORES</div>
          {top.map((s,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",padding:"7px 12px",borderRadius:8,background:"rgba(255,255,255,0.04)",marginBottom:4,border:"1px solid rgba(255,255,255,0.06)"}}>
            <span style={{color:i===0?"#FFD700":i===1?"#C0C0C0":"#CD7F32",fontWeight:700}}>#{i+1}</span>
            <span style={{color:"#fff",fontWeight:600}}>{s.score}</span>
            <span style={{color:"#555",fontSize:11}}>{s.date}</span>
          </div>)}
        </div>}
        <button onClick={onClose} style={{padding:"13px 32px",borderRadius:14,background:"linear-gradient(135deg,#7C3AED,#4C1D95)",color:"#fff",border:"none",fontWeight:"bold",cursor:"pointer",fontSize:16,width:"100%"}}>← Back to Games</button>
      </div>
    </div>
  );
}

// ── GAME 1: GRAVITY DASH ──────────────────────────────────────────────────────
function GravityDash({onExit,lang,char,username}){
  const cvRef=useRef(null),stRef=useRef(null),keysRef=useRef({}),rafRef=useRef(null);
  const [results,setResults]=useState(null);
  useEffect(()=>{
    const cv=cvRef.current,ctx=cv.getContext("2d"),W=cv.width,H=cv.height;
    // Build level with guaranteed safe gaps ≤90px
    const platforms=[{x:0,y:370,w:280,h:16,type:"start",idx:0}];
    let px=300;
    for(let i=0;i<38;i++){
      const w=80+Math.random()*70,y=190+Math.random()*150;
      const gap=45+Math.random()*45; // max 90px gap, always jumpable
      const type=i%7===0?"moving":i%9===0?"spike":"normal";
      platforms.push({x:px,y,w,h:13,type,dir:1,speed:0.6+Math.random()*0.5,orig:px,finish:i===37,idx:i+1});
      px+=w+gap;
    }
    const gems=[];
    platforms.forEach((pl,i)=>{if(i>0&&i%3===0&&pl.type!=="spike")gems.push({x:pl.x+pl.w/2,y:pl.y-32,collected:false,bob:Math.random()*Math.PI*2});});

    // Track last safe platform index for respawn
    let lastSafePlatIdx=0;

    const g={p:{x:80,y:330,vy:0,vx:0,onGround:false,flipped:false,size:16,dead:false,respawnTimer:0,flash:0},
      platforms,gems:[...gems],score:0,diamonds:0,scroll:0,won:false,particles:[],trail:[],deaths:0,combo:0,frame:0};
    stRef.current=g;

    const onKD=e=>{keysRef.current[e.code]=true;if(e.code==="KeyF"&&!e.repeat){const g=stRef.current;if(g&&!g.p.dead&&!g.won){g.p.flipped=!g.p.flipped;g.p.vy=g.p.flipped?10:-10;for(let i=0;i<7;i++)g.particles.push({x:g.p.x,y:g.p.y,vx:(Math.random()-.5)*6,vy:(Math.random()-.5)*5,life:0.8,col:g.p.flipped?"#F472B6":"#38BDF8"});}}};
    const onKU=e=>{keysRef.current[e.code]=false;};
    window.addEventListener("keydown",onKD);window.addEventListener("keyup",onKU);

    function respawn(g){
      // Find the last SAFE platform we actually reached (within current scroll)
      const scrollX=g.scroll;
      // Get all safe platforms that are visible or recently passed
      const safe=g.platforms.filter(pl=>
        pl.type!=="spike"&&!pl.finish&&
        pl.x<=scrollX+W*.7 && // not too far ahead
        pl.x>=scrollX-300 // not too far behind
      );
      const target=safe.length>0?safe[safe.length-1]:g.platforms[0];
      const spawnX=(target.x-g.scroll)+target.w/2+g.scroll;
      const spawnY=g.p.flipped?target.y+target.h+g.p.size+8:target.y-g.p.size-8;
      g.p.x=Math.max(g.scroll+60,spawnX);
      g.p.y=spawnY;
      g.p.vy=0;g.p.vx=0;g.p.onGround=false;g.p.dead=false;g.p.flash=0;g.combo=0;
    }

    function update(g){
      g.frame++;
      if(g.won)return;
      if(g.p.dead){g.p.respawnTimer--;g.p.flash=(g.p.flash+1)%6;if(g.p.respawnTimer<=0)respawn(g);return;}
      const p=g.p,k=keysRef.current,grav=p.flipped?-0.52:0.52;
      p.vx*=0.83;
      if(k.ArrowLeft||k.KeyA)p.vx-=1.3;
      if(k.ArrowRight||k.KeyD)p.vx+=1.3;
      p.vx=Math.max(-7.5,Math.min(7.5,p.vx));
      p.x+=p.vx;
      if((k.Space||k.ArrowUp||k.KeyW)&&p.onGround){p.vy=p.flipped?11.5:-13.5;p.onGround=false;g.combo++;for(let i=0;i<5;i++)g.particles.push({x:p.x,y:p.y+(p.flipped?-p.size:p.size),vx:(Math.random()-.5)*4,vy:-Math.random()*3,life:0.6,col:"#a78bfa"});}
      p.vy=Math.max(-15,Math.min(15,p.vy+grav));
      p.y+=p.vy;
      p.onGround=false;
      g.trail.push({x:p.x,y:p.y,life:1,fl:p.flipped});
      g.trail=g.trail.filter(t=>{t.life-=0.1;return t.life>0;});
      for(const pl of g.platforms){
        if(pl.type==="moving"){pl.x+=pl.speed*pl.dir;if(pl.x>pl.orig+80||pl.x<pl.orig-80)pl.dir*=-1;}
        const rx=pl.x-g.scroll;
        const inX=p.x+p.size>rx&&p.x-p.size<rx+pl.w;
        if(!p.flipped){
          if(inX&&p.y+p.size>pl.y&&p.y+p.size<pl.y+pl.h+Math.abs(p.vy)+2){
            if(pl.type==="spike"){die(g);return;}
            p.y=pl.y-p.size;p.vy=0;p.onGround=true;
            if(pl.finish)finishGame(g);
          }
        } else {
          if(inX&&p.y-p.size<pl.y+pl.h&&p.y-p.size>pl.y-Math.abs(p.vy)-2){
            if(pl.type==="spike"){die(g);return;}
            p.y=pl.y+pl.h+p.size;p.vy=0;p.onGround=true;
            if(pl.finish)finishGame(g);
          }
        }
      }
      for(const gem of g.gems){gem.bob=(gem.bob||0)+0.055;if(!gem.collected&&Math.abs(p.x-(gem.x-g.scroll))<26&&Math.abs(p.y-gem.y)<28){gem.collected=true;g.score+=10+Math.floor(g.combo/2)*5;g.diamonds++;for(let i=0;i<12;i++)g.particles.push({x:gem.x-g.scroll,y:gem.y,vx:(Math.random()-.5)*8,vy:(Math.random()-.5)*8,life:1.1,col:"#38BDF8"});}}
      g.particles=g.particles.filter(pt=>{pt.x+=pt.vx;pt.y+=pt.vy*.9;pt.life-=0.033;return pt.life>0;});
      if(p.x-g.scroll>280)g.scroll=p.x-280;
      if((!p.flipped&&p.y>H+80)||(p.flipped&&p.y<-80))die(g);
    }
    function die(g){if(g.p.dead)return;g.p.dead=true;g.p.respawnTimer=55;g.deaths++;const p=g.p;for(let i=0;i<18;i++)g.particles.push({x:p.x,y:p.y,vx:(Math.random()-.5)*11,vy:(Math.random()-.5)*11,life:1.2,col:i%2?"#EF4444":"#FF6B6B"});}
    function finishGame(g){
      g.won=true;
      saveGameScore("gravity",g.score,username);
      setTimeout(()=>setResults({score:g.score,diamonds:g.diamonds}),800);
    }

    function drawChar(ctx,cx,cy,size,flipped,charData){
      ctx.save();ctx.translate(cx,cy);if(flipped)ctx.scale(1,-1);
      const s=size,skin=SKIN_TONES[charData?.skin||0]||SKIN_TONES[0];
      const hairColor=HAIR_COLORS[charData?.hair||0]||HAIR_COLORS[0];
      // Body glow
      ctx.shadowColor=flipped?"#F472B6":"#38BDF8";ctx.shadowBlur=22;
      // Body
      ctx.fillStyle=`rgba(80,60,160,0.85)`;
      ctx.beginPath();ctx.roundRect(-s*.55,-s*.2,s*1.1,s*.9,s*.1);ctx.fill();
      ctx.shadowBlur=0;
      // Head
      ctx.fillStyle=skin;ctx.beginPath();ctx.ellipse(0,-s*.55,s*.38,s*.4,0,0,Math.PI*2);ctx.fill();
      // Hair
      ctx.fillStyle=hairColor;ctx.beginPath();ctx.ellipse(0,-s*.75,s*.38,s*.22,0,Math.PI,0);ctx.fill();
      // Eyes
      [-1,1].forEach(side=>{ctx.fillStyle="#fff";ctx.beginPath();ctx.ellipse(side*s*.13,-s*.52,s*.08,s*.09,0,0,Math.PI*2);ctx.fill();ctx.fillStyle="#1a1a2e";ctx.beginPath();ctx.ellipse(side*s*.13,-s*.52,s*.045,s*.055,0,0,Math.PI*2);ctx.fill();});
      ctx.restore();ctx.shadowBlur=0;
    }

    function draw(g){
      const p=g.p,t=g.frame;
      const bg=ctx.createLinearGradient(0,0,0,H);
      bg.addColorStop(0,p.flipped?"#1a0040":"#030d1a");bg.addColorStop(1,p.flipped?"#040818":"#0d0030");
      ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
      for(let i=0;i<90;i++){const sx=(i*173+g.scroll*0.02)%W,sy=(i*97)%H,br=0.1+0.15*Math.abs(Math.sin(i+t/150));ctx.fillStyle=`rgba(255,255,255,${br})`;ctx.beginPath();ctx.arc(sx,sy,i%7===0?1.5:0.8,0,Math.PI*2);ctx.fill();}
      for(const pl of g.platforms){
        const rx=pl.x-g.scroll;if(rx<-200||rx>W+200)continue;
        ctx.shadowBlur=0;
        if(pl.type==="spike"){
          ctx.shadowColor="#EF4444";ctx.shadowBlur=14;ctx.fillStyle="#EF4444";
          for(let s=0;s<pl.w;s+=13){ctx.beginPath();ctx.moveTo(rx+s,pl.y);ctx.lineTo(rx+s+6.5,pl.y-18);ctx.lineTo(rx+s+13,pl.y);ctx.fill();}
          ctx.shadowBlur=0;ctx.fillStyle="rgba(239,68,68,0.07)";ctx.fillRect(rx,pl.y,pl.w,H-pl.y);
        } else if(pl.finish){
          const gg=ctx.createLinearGradient(rx,pl.y,rx+pl.w,pl.y);gg.addColorStop(0,"#FFD700");gg.addColorStop(.5,"#FFF9C4");gg.addColorStop(1,"#FFD700");
          ctx.fillStyle=gg;ctx.shadowColor="#FFD700";ctx.shadowBlur=28+10*Math.sin(t/20);
          ctx.beginPath();ctx.roundRect(rx,pl.y,pl.w,pl.h,5);ctx.fill();
          ctx.shadowBlur=0;ctx.font="bold 12px monospace";ctx.fillStyle="#FFD700";ctx.textAlign="center";ctx.fillText("🏆 FINISH",rx+pl.w/2,pl.y-8);ctx.textAlign="left";
        } else if(pl.type==="moving"){
          const gg=ctx.createLinearGradient(rx,pl.y,rx,pl.y+pl.h);gg.addColorStop(0,"#06B6D4");gg.addColorStop(1,"#0284C7");
          ctx.fillStyle=gg;ctx.shadowColor="#06B6D4";ctx.shadowBlur=14;
          ctx.beginPath();ctx.roundRect(rx,pl.y,pl.w,pl.h,5);ctx.fill();ctx.shadowBlur=0;
        } else {
          const gg=ctx.createLinearGradient(rx,pl.y,rx,pl.y+pl.h);gg.addColorStop(0,"#7C3AED");gg.addColorStop(1,"#4C1D95");
          ctx.fillStyle=gg;ctx.shadowColor="#7C3AED";ctx.shadowBlur=8;
          ctx.beginPath();ctx.roundRect(rx,pl.y,pl.w,pl.h,5);ctx.fill();
          ctx.shadowBlur=0;ctx.fillStyle="rgba(255,255,255,0.1)";ctx.fillRect(rx+3,pl.y+2,pl.w-6,3);
        }
        ctx.shadowBlur=0;
      }
      for(const gem of g.gems){if(!gem.collected){const gx=gem.x-g.scroll,bob=Math.sin(gem.bob||0)*5;ctx.shadowColor="#38BDF8";ctx.shadowBlur=16+5*Math.sin(t/28);ctx.font="18px serif";ctx.fillText("💎",gx-9,gem.y+bob);ctx.shadowBlur=0;}}
      for(const pt of g.particles){ctx.fillStyle=pt.col||"rgba(99,102,241,0.8)";ctx.globalAlpha=Math.max(0,pt.life);ctx.beginPath();ctx.arc(pt.x,pt.y,5*pt.life,0,Math.PI*2);ctx.fill();}ctx.globalAlpha=1;
      for(const tr of g.trail){ctx.fillStyle=tr.fl?"rgba(244,114,182,0.5)":"rgba(56,189,248,0.5)";ctx.globalAlpha=tr.life*0.55;ctx.beginPath();ctx.arc(tr.x,tr.y,8*tr.life,0,Math.PI*2);ctx.fill();}ctx.globalAlpha=1;
      if(!p.dead||(p.flash%2===0)) drawChar(ctx,p.x,p.y,18,p.flipped,char);
      if(p.dead){ctx.fillStyle="rgba(239,68,68,0.15)";ctx.fillRect(0,0,W,H);ctx.fillStyle="#FF6B6B";ctx.font="bold 22px 'Courier New'";ctx.textAlign="center";ctx.fillText(`💀 Respawning in ${Math.max(1,Math.ceil(p.respawnTimer/20))}...`,W/2,H/2);ctx.textAlign="left";}
      ctx.fillStyle="rgba(5,5,20,0.72)";ctx.beginPath();ctx.roundRect(10,10,280,62,12);ctx.fill();
      ctx.fillStyle="#38BDF8";ctx.font="bold 15px 'Courier New'";ctx.fillText(`💎 ${g.diamonds}  Score: ${g.score}  Combo ${g.combo}x`,18,32);
      ctx.fillStyle="#a78bfa";ctx.font="11px 'Courier New'";ctx.fillText(`Deaths: ${g.deaths}  [F] Flip Gravity  WASD/Arrows`,18,52);
      if(g.won){ctx.fillStyle="rgba(0,0,0,0.85)";ctx.fillRect(0,0,W,H);ctx.textAlign="center";ctx.fillStyle="#FFD700";ctx.font="bold 48px 'Courier New'";ctx.fillText("🏆 LEVEL COMPLETE!",W/2,H/2-28);ctx.fillStyle="#38BDF8";ctx.font="22px 'Courier New'";ctx.fillText(`💎 ${g.diamonds}  Score: ${g.score}  Deaths: ${g.deaths}`,W/2,H/2+20);ctx.textAlign="left";}
    }
    const loop=()=>{const g=stRef.current;if(!g.won)update(g);draw(g);rafRef.current=requestAnimationFrame(loop);};
    rafRef.current=requestAnimationFrame(loop);
    return()=>{cancelAnimationFrame(rafRef.current);window.removeEventListener("keydown",onKD);window.removeEventListener("keyup",onKU);};
  },[]);
  const touch=(c,d)=>{keysRef.current[c]=d;};
  const flip=()=>{const g=stRef.current;if(g&&!g.p.dead&&!g.won){g.p.flipped=!g.p.flipped;g.p.vy=g.p.flipped?10:-10;}};
  const top=getTopScores("gravity",username);
  return(<div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:10}}>
    {results&&<GameResults gameId="gravity" score={results.score} diamonds={results.diamonds} username={username} gameName="🌌 Gravity Dash" onClose={onExit}/>}
    <div style={{fontSize:12,color:"#888",textAlign:"center"}}>← → Move · ↑/Space Jump · <b style={{color:"#F472B6"}}>F = Flip Gravity</b> · Collect 💎</div>
    <canvas ref={cvRef} width={700} height={420} style={{borderRadius:18,border:"2px solid #7C3AED",boxShadow:"0 0 60px #7C3AED55",maxWidth:"100%"}}/>
    {top.length>0&&<div style={{fontSize:12,color:"#888"}}>🏆 Best: {top[0].score} · {top[1]?.score||"-"} · {top[2]?.score||"-"}</div>}
    <div style={{display:"flex",gap:8}}>
      {[["◀","ArrowLeft"],["▲","Space"],["▶","ArrowRight"]].map(([l,c])=>(
        <button key={c} onPointerDown={()=>touch(c,true)} onPointerUp={()=>touch(c,false)} onPointerLeave={()=>touch(c,false)} style={{padding:"10px 20px",borderRadius:10,border:"1px solid #7C3AED44",background:"rgba(124,58,237,0.28)",color:"#fff",fontWeight:"bold",cursor:"pointer",fontSize:15,userSelect:"none"}}>{l}</button>
      ))}
      <button onClick={flip} style={{padding:"10px 18px",borderRadius:10,border:"1px solid #F472B444",background:"rgba(244,114,182,0.22)",color:"#F472B6",fontWeight:"bold",cursor:"pointer",fontSize:14}}>🔄</button>
    </div>
    <button onClick={onExit} style={{padding:"8px 22px",borderRadius:10,border:"1px solid rgba(255,100,100,0.4)",background:"rgba(255,80,80,0.14)",color:"#FF6B6B",cursor:"pointer",fontWeight:"bold"}}>Exit</button>
  </div>);
}

// ── GAME 2: NEON SNAKE ────────────────────────────────────────────────────────
function NeonSnake({onExit,lang,char,username}){
  const cvRef=useRef(null),stRef=useRef(null),rafRef=useRef(null);
  const [results,setResults]=useState(null);
  const CELL=24,COLS=26,ROWS=18;
  useEffect(()=>{
    const cv=cvRef.current,ctx=cv.getContext("2d");
    const rand=()=>({x:Math.floor(Math.random()*COLS),y:Math.floor(Math.random()*ROWS)});
    const g={snake:[{x:13,y:9},{x:12,y:9},{x:11,y:9}],dir:{x:1,y:0},next:{x:1,y:0},food:rand(),diamond:null,diamondTimer:0,score:0,diamonds:0,dead:false,speed:142,lastMove:0,particles:[],frame:0,rainbow:0};
    stRef.current=g;
    const spawnDiamond=()=>{if(Math.random()<0.3){g.diamond=rand();g.diamondTimer=300;}};
    const onK=e=>{const d={ArrowUp:{x:0,y:-1},ArrowDown:{x:0,y:1},ArrowLeft:{x:-1,y:0},ArrowRight:{x:1,y:0},KeyW:{x:0,y:-1},KeyS:{x:0,y:1},KeyA:{x:-1,y:0},KeyD:{x:1,y:0}}[e.code];if(d&&!(d.x===-g.dir.x&&d.y===-g.dir.y))g.next=d;};
    window.addEventListener("keydown",onK);
    const loop=ts=>{
      const g=stRef.current;g.frame++;g.rainbow=(g.rainbow+2)%360;
      if(!g.dead&&ts-g.lastMove>g.speed){
        g.lastMove=ts;g.dir={...g.next};
        const head={x:(g.snake[0].x+g.dir.x+COLS)%COLS,y:(g.snake[0].y+g.dir.y+ROWS)%ROWS};
        if(g.snake.slice(1).some(s=>s.x===head.x&&s.y===head.y)){
          g.dead=true;
          saveGameScore("snake",g.score,username);
          setTimeout(()=>setResults({score:g.score,diamonds:g.diamonds}),800);
        } else {
          g.snake.unshift(head);
          let ate=false;
          if(head.x===g.food.x&&head.y===g.food.y){
            g.score+=10;g.speed=Math.max(48,g.speed-2.2);
            for(let i=0;i<14;i++)g.particles.push({x:g.food.x*CELL+12,y:g.food.y*CELL+12,vx:(Math.random()-.5)*7,vy:(Math.random()-.5)*7,life:1.1,col:`hsl(${g.rainbow},100%,60%)`});
            g.food=rand();ate=true;spawnDiamond();
          }
          if(g.diamond&&head.x===g.diamond.x&&head.y===g.diamond.y){
            g.score+=50;g.diamonds++;
            for(let i=0;i<20;i++)g.particles.push({x:g.diamond.x*CELL+12,y:g.diamond.y*CELL+12,vx:(Math.random()-.5)*9,vy:(Math.random()-.5)*9,life:1.3,col:"#38BDF8"});
            g.diamond=null;ate=true;
          }
          if(!ate)g.snake.pop();
          if(g.diamond){g.diamondTimer--;if(g.diamondTimer<=0)g.diamond=null;}
        }
      }
      g.particles=g.particles.filter(p=>{p.x+=p.vx;p.y+=p.vy;p.life-=0.04;return p.life>0;});
      ctx.fillStyle="#030c16";ctx.fillRect(0,0,cv.width,cv.height);
      ctx.strokeStyle="rgba(16,185,129,0.07)";ctx.lineWidth=1;
      for(let c=0;c<=COLS;c++){ctx.beginPath();ctx.moveTo(c*CELL,0);ctx.lineTo(c*CELL,ROWS*CELL);ctx.stroke();}
      for(let r=0;r<=ROWS;r++){ctx.beginPath();ctx.moveTo(0,r*CELL);ctx.lineTo(COLS*CELL,r*CELL);ctx.stroke();}
      ctx.strokeStyle=`hsla(${g.rainbow},70%,60%,0.4)`;ctx.lineWidth=3;ctx.strokeRect(1,1,COLS*CELL-2,ROWS*CELL-2);
      g.snake.forEach((s,i)=>{
        const hue=(g.rainbow-i*4+360)%360;const bright=Math.max(0.15,1-i/g.snake.length);
        const grd=ctx.createRadialGradient(s.x*CELL+12,s.y*CELL+12,2,s.x*CELL+12,s.y*CELL+12,13);
        grd.addColorStop(0,`hsla(${hue},90%,70%,${bright})`);grd.addColorStop(1,`hsla(${hue},90%,40%,${bright*0.25})`);
        ctx.fillStyle=grd;ctx.shadowColor=`hsl(${hue},80%,60%)`;ctx.shadowBlur=i===0?24:7;
        ctx.beginPath();ctx.roundRect(s.x*CELL+2,s.y*CELL+2,CELL-4,CELL-4,i===0?8:4);ctx.fill();
        if(i===0){ctx.fillStyle="#fff";ctx.fillRect(s.x*CELL+6,s.y*CELL+6,4,4);ctx.fillRect(s.x*CELL+13,s.y*CELL+6,4,4);}
      });
      ctx.shadowBlur=0;
      const fp=1+0.15*Math.sin(g.frame/12);ctx.save();ctx.translate(g.food.x*CELL+12,g.food.y*CELL+12);ctx.scale(fp,fp);ctx.shadowColor="#10B981";ctx.shadowBlur=18;ctx.font="18px serif";ctx.textAlign="center";ctx.fillText("🍎",0,7);ctx.restore();ctx.textAlign="left";
      if(g.diamond){const dp=1+0.2*Math.sin(g.frame/9);ctx.save();ctx.translate(g.diamond.x*CELL+12,g.diamond.y*CELL+12);ctx.scale(dp,dp);ctx.shadowColor="#38BDF8";ctx.shadowBlur=26;ctx.font="18px serif";ctx.textAlign="center";ctx.fillText("💎",0,7);ctx.restore();ctx.textAlign="left";}
      for(const p of g.particles){ctx.fillStyle=p.col;ctx.globalAlpha=p.life;ctx.beginPath();ctx.arc(p.x,p.y,5*p.life,0,Math.PI*2);ctx.fill();}ctx.globalAlpha=1;
      ctx.fillStyle="rgba(0,0,0,0.72)";ctx.beginPath();ctx.roundRect(10,ROWS*CELL+4,320,40,8);ctx.fill();
      ctx.fillStyle=`hsl(${g.rainbow},80%,65%)`;ctx.font="bold 14px 'Courier New'";ctx.fillText(`💎 ${g.diamonds}  Score: ${g.score}  Length: ${g.snake.length}  Speed: ${(1000/g.speed).toFixed(1)}x`,16,ROWS*CELL+26);
      if(g.dead){ctx.fillStyle="rgba(0,0,0,0.85)";ctx.fillRect(0,0,cv.width,cv.height);ctx.textAlign="center";ctx.fillStyle="#EF4444";ctx.font="bold 38px 'Courier New'";ctx.fillText("💀 GAME OVER",cv.width/2,ROWS*CELL/2-8);ctx.fillStyle="#10B981";ctx.font="20px 'Courier New'";ctx.fillText(`💎 ${g.diamonds}  Score: ${g.score}  Length: ${g.snake.length}`,cv.width/2,ROWS*CELL/2+34);ctx.textAlign="left";}
      rafRef.current=requestAnimationFrame(loop);
    };
    rafRef.current=requestAnimationFrame(loop);
    return()=>{cancelAnimationFrame(rafRef.current);window.removeEventListener("keydown",onK);};
  },[]);
  const dir=d=>{const g=stRef.current;if(g){const m={up:{x:0,y:-1},down:{x:0,y:1},left:{x:-1,y:0},right:{x:1,y:0}}[d];if(m&&!(m.x===-g.dir.x&&m.y===-g.dir.y))g.next=m;}};
  const top=getTopScores("snake",username);
  return(<div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:10}}>
    {results&&<GameResults gameId="snake" score={results.score} diamonds={results.diamonds} username={username} gameName="🐍 Neon Snake" onClose={onExit}/>}
    <div style={{fontSize:12,color:"#888"}}>WASD / Arrow keys · 🍎 +10pts · 💎 +50pts (random spawns)</div>
    <canvas ref={cvRef} width={COLS*CELL} height={ROWS*CELL+48} style={{borderRadius:16,border:"2px solid #10B981",boxShadow:"0 0 50px #10B98140",maxWidth:"100%"}}/>
    {top.length>0&&<div style={{fontSize:12,color:"#888"}}>🏆 Best: {top[0].score} · {top[1]?.score||"-"} · {top[2]?.score||"-"}</div>}
    <div style={{display:"flex",gap:8}}>{[["↑","up"],["↓","down"],["←","left"],["→","right"]].map(([l,d])=><button key={d} onClick={()=>dir(d)} style={{padding:"10px 16px",borderRadius:10,border:"1px solid #10B98140",background:"rgba(16,185,129,0.18)",color:"#10B981",fontWeight:"bold",cursor:"pointer",fontSize:15}}>{l}</button>)}</div>
    <button onClick={onExit} style={{padding:"8px 22px",borderRadius:10,border:"1px solid rgba(255,100,100,0.4)",background:"rgba(255,80,80,0.14)",color:"#FF6B6B",cursor:"pointer",fontWeight:"bold"}}>Exit</button>
  </div>);
}

// ── GAME 3: MATRIX BREAKER ────────────────────────────────────────────────────
function MatrixBreaker({onExit,lang,char,username}){
  const cvRef=useRef(null),stRef=useRef(null),rafRef=useRef(null),mouseRef=useRef(350);
  const [results,setResults]=useState(null);
  useEffect(()=>{
    const cv=cvRef.current,ctx=cv.getContext("2d"),W=cv.width,H=cv.height;
    const BW=52,BH=20,PAD=3,ROWS=5,COLS=12;
    const cols=["#7C3AED","#6D28D9","#5B21B6","#4C1D95","#3B0764"];
    const bricks=[];
    for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++){const hp=r<2?3:r<4?2:1;bricks.push({x:c*(BW+PAD)+18,y:r*(BH+PAD)+52,w:BW,h:BH,hp,maxHp:hp,col:cols[r],pup:Math.random()<0.15?["⚡","🔵","💥","❄️","🔴","💎"][Math.floor(Math.random()*6)]:null});}
    const g={bricks,balls:[{x:W/2,y:H-90,vx:3.8,vy:-5,r:9}],drops:[],paddle:{x:W/2-60,w:120,y:H-34,h:14},score:0,diamonds:0,lives:3,done:false,won:false,particles:[],frame:0,frozen:0};
    stRef.current=g;
    const onM=e=>{const r=cv.getBoundingClientRect();mouseRef.current=e.clientX-r.left;};
    const onT=e=>{e.preventDefault();const r=cv.getBoundingClientRect();mouseRef.current=e.touches[0].clientX-r.left;};
    cv.addEventListener("mousemove",onM);cv.addEventListener("touchmove",onT,{passive:false});
    const loop=()=>{
      const g=stRef.current;g.frame++;
      if(!g.done){
        if(g.frozen>0)g.frozen--;
        else{
          g.paddle.x=Math.max(0,Math.min(W-g.paddle.w,mouseRef.current-g.paddle.w/2));
          g.drops=g.drops.filter(dp=>{dp.y+=3.5;if(dp.y>H)return false;if(dp.y+18>g.paddle.y&&dp.y<g.paddle.y+g.paddle.h&&dp.x>g.paddle.x&&dp.x<g.paddle.x+g.paddle.w){
            if(dp.type==="⚡")g.balls.forEach(b=>{b.vx*=1.3;b.vy*=1.3;});
            else if(dp.type==="🔵")g.paddle.w=Math.min(230,g.paddle.w+40);
            else if(dp.type==="🔴")g.paddle.w=Math.max(50,g.paddle.w-30);
            else if(dp.type==="💥"&&g.balls.length<5){const b=g.balls[0];g.balls.push({x:b.x,y:b.y,vx:-b.vx,vy:b.vy,r:9},{x:b.x,y:b.y,vx:b.vx*.7,vy:b.vy,r:9});}
            else if(dp.type==="❄️")g.frozen=200;
            else if(dp.type==="💎"){g.score+=50;g.diamonds++;}
            return false;
          }return true;});
          g.balls=g.balls.filter(b=>{b.x+=b.vx;b.y+=b.vy;if(b.x<b.r||b.x>W-b.r)b.vx*=-1;if(b.y<b.r)b.vy*=-1;if(b.y>H){if(g.balls.length===1){g.lives--;b.x=W/2;b.y=H-90;b.vx=3.8;b.vy=-5;if(g.lives<=0){g.done=true;saveGameScore("breaker",g.score,username);setTimeout(()=>setResults({score:g.score,diamonds:g.diamonds}),600);}}return g.balls.length>1;}
          if(b.y+b.r>g.paddle.y&&b.y<g.paddle.y+g.paddle.h&&b.x>g.paddle.x&&b.x<g.paddle.x+g.paddle.w){b.vy=-Math.abs(b.vy);const hit=(b.x-(g.paddle.x+g.paddle.w/2))/(g.paddle.w/2);b.vx=hit*8;}
          for(const br of g.bricks){if(br.hp<=0)continue;if(b.x+b.r>br.x&&b.x-b.r<br.x+br.w&&b.y+b.r>br.y&&b.y-b.r<br.y+br.h){br.hp--;g.score+=10*br.maxHp;b.vy*=-1;for(let i=0;i<10;i++)g.particles.push({x:br.x+br.w/2,y:br.y+br.h/2,vx:(Math.random()-.5)*8,vy:(Math.random()-.5)*8,life:1,col:br.col});if(br.hp<=0&&br.pup)g.drops.push({x:br.x+br.w/2,y:br.y,type:br.pup});}}
          return true;});
          if(g.balls.length===0)g.balls.push({x:W/2,y:H-90,vx:3.8,vy:-5,r:9});
          g.particles=g.particles.filter(p=>{p.x+=p.vx;p.y+=p.vy;p.life-=0.04;return p.life>0;});
          if(g.bricks.every(b=>b.hp<=0)){g.done=true;g.won=true;saveGameScore("breaker",g.score,username);setTimeout(()=>setResults({score:g.score,diamonds:g.diamonds}),600);}
        }
      }
      ctx.fillStyle="#030a18";ctx.fillRect(0,0,W,H);
      for(let y=0;y<H;y+=4){ctx.fillStyle="rgba(0,0,0,0.1)";ctx.fillRect(0,y,W,2);}
      for(const br of g.bricks){if(br.hp<=0)continue;const a=br.hp/br.maxHp;const grd=ctx.createLinearGradient(br.x,br.y,br.x,br.y+br.h);grd.addColorStop(0,br.col);grd.addColorStop(1,`${br.col}66`);ctx.fillStyle=grd;ctx.shadowColor=br.col;ctx.shadowBlur=12*a+3*Math.sin(g.frame/20);ctx.beginPath();ctx.roundRect(br.x,br.y,br.w,br.h,4);ctx.fill();ctx.shadowBlur=0;if(br.pup){ctx.font="11px serif";ctx.fillText(br.pup,br.x+br.w/2-7,br.y+br.h-3);}if(br.maxHp>1){ctx.fillStyle=`rgba(255,255,255,${a*0.3})`;ctx.fillRect(br.x+2,br.y+2,br.w-4,5);}if(br.hp>1){ctx.fillStyle="rgba(255,100,100,0.7)";ctx.font="bold 10px monospace";ctx.fillText(br.hp,br.x+br.w-12,br.y+br.h-4);}}
      for(const dp of g.drops){ctx.font="20px serif";ctx.fillText(dp.type,dp.x-10,dp.y+16);}
      if(g.frozen>0){ctx.fillStyle="rgba(56,189,248,0.08)";ctx.fillRect(0,0,W,H);}
      const pg=ctx.createLinearGradient(g.paddle.x,g.paddle.y,g.paddle.x+g.paddle.w,g.paddle.y);pg.addColorStop(0,"#7C3AED");pg.addColorStop(.5,"#38BDF8");pg.addColorStop(1,"#7C3AED");ctx.fillStyle=pg;ctx.shadowColor="#38BDF8";ctx.shadowBlur=20+8*Math.sin(g.frame/15);ctx.beginPath();ctx.roundRect(g.paddle.x,g.paddle.y,g.paddle.w,g.paddle.h,8);ctx.fill();ctx.shadowBlur=0;
      for(const b of g.balls){const hue=(g.frame*3)%360;const bg2=ctx.createRadialGradient(b.x,b.y,1,b.x,b.y,b.r);bg2.addColorStop(0,"#fff");bg2.addColorStop(.5,`hsl(${hue},100%,70%)`);bg2.addColorStop(1,`hsl(${hue},80%,40%)`);ctx.fillStyle=bg2;ctx.shadowColor=`hsl(${hue},80%,60%)`;ctx.shadowBlur=20;ctx.beginPath();ctx.arc(b.x,b.y,b.r,0,Math.PI*2);ctx.fill();}ctx.shadowBlur=0;
      for(const p of g.particles){ctx.fillStyle=p.col;ctx.globalAlpha=p.life;ctx.beginPath();ctx.arc(p.x,p.y,5*p.life,0,Math.PI*2);ctx.fill();}ctx.globalAlpha=1;
      ctx.fillStyle="rgba(0,0,0,0.7)";ctx.beginPath();ctx.roundRect(8,8,340,30,8);ctx.fill();ctx.fillStyle="#fff";ctx.font="bold 13px 'Courier New'";ctx.fillText(`💎 ${g.diamonds}  Score: ${g.score}  ❤️ ${g.lives}  Balls: ${g.balls.length}`,16,26);
      if(g.done){ctx.fillStyle="rgba(0,0,0,0.88)";ctx.fillRect(0,0,W,H);ctx.textAlign="center";ctx.fillStyle=g.won?"#FFD700":"#EF4444";ctx.font=`bold 42px 'Courier New'`;ctx.fillText(g.won?"🏆 CLEARED!":"💀 GAME OVER",W/2,H/2-14);ctx.fillStyle="#38BDF8";ctx.font="20px 'Courier New'";ctx.fillText(`💎 ${g.diamonds}  Score: ${g.score}`,W/2,H/2+28);ctx.textAlign="left";}
      rafRef.current=requestAnimationFrame(loop);
    };
    rafRef.current=requestAnimationFrame(loop);
    return()=>{cancelAnimationFrame(rafRef.current);cv.removeEventListener("mousemove",onM);cv.removeEventListener("touchmove",onT);};
  },[]);
  const top=getTopScores("breaker",username);
  return(<div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:10}}>
    {results&&<GameResults gameId="breaker" score={results.score} diamonds={results.diamonds} username={username} gameName="🔮 Matrix Breaker" onClose={onExit}/>}
    <div style={{fontSize:12,color:"#888"}}>Mouse/Touch paddle · ⚡Speed · 🔵Bigger · 💥Multi-ball · ❄️Freeze · 💎+50pts</div>
    <canvas ref={cvRef} width={700} height={500} style={{borderRadius:16,border:"2px solid #7C3AED",boxShadow:"0 0 50px #7C3AED44",maxWidth:"100%",cursor:"none"}}/>
    {top.length>0&&<div style={{fontSize:12,color:"#888"}}>🏆 Best: {top[0].score} · {top[1]?.score||"-"} · {top[2]?.score||"-"}</div>}
    <button onClick={onExit} style={{padding:"8px 22px",borderRadius:10,border:"1px solid rgba(255,100,100,0.4)",background:"rgba(255,80,80,0.14)",color:"#FF6B6B",cursor:"pointer",fontWeight:"bold"}}>Exit</button>
  </div>);
}

// ── GAME 4: CIPHER RUSH ───────────────────────────────────────────────────────
function encodeWord(word){const s=Math.floor(Math.random()*5)+1;return{encoded:word.split("").map(c=>String.fromCharCode(((c.charCodeAt(0)-65+s)%26)+65)).join(""),shift:s};}
function CipherRush({onExit,lang,char,username}){
  const WORDS=["QUANTUM","GALAXY","NEURON","PROTEIN","FRACTAL","ALGEBRA","VOLTAGE","THEOREM","CELSIUS","ELEMENT","PROTON","BINARY","VECTOR","MATRIX","GENOME","PHOTON","PASCAL","SYNTAX","DELTA","OMEGA","KRYPTON","SPIRAL","CIPHER","FUSION","PLASMA","CARBON","HELIUM","COSMOS","NEBULA","VERTEX"];
  const make=()=>{const w=WORDS[Math.floor(Math.random()*WORDS.length)];const e=encodeWord(w);return{word:w,cipher:e.encoded,shift:e.shift};};
  const [cur,setCur]=useState(make);const [score,setScore]=useState(0);const [diamonds,setDiamonds]=useState(0);const [lives,setLives]=useState(3);const [input,setInput]=useState("");const [result,setResult]=useState(null);const [done,setDone]=useState(false);const [timeLeft,setTimeLeft]=useState(20);const [round,setRound]=useState(0);
  const wrRef=useRef(false);
  const next=useCallback(()=>{setCur(make());setInput("");setResult(null);setTimeLeft(20);setRound(r=>r+1);wrRef.current=false;},[]);
  useEffect(()=>{if(done)return;const iv=setInterval(()=>setTimeLeft(t=>{if(t<=1){if(!wrRef.current){wrRef.current=true;setLives(l=>{const nl=l-1;if(nl<=0){setDone(true);saveGameScore("cipher",score,username);}return nl;});setResult("wrong");setTimeout(next,1100);}return 20;}return t-1;}),1000);return()=>clearInterval(iv);},[done,cur,next,score]);
  const check=()=>{if(result||wrRef.current)return;if(input.toUpperCase()===cur.word){const bonus=Math.ceil(timeLeft*5);const isDiamond=round%5===4;setScore(s=>s+bonus+(isDiamond?50:0));if(isDiamond){setDiamonds(d=>d+1);}setResult(isDiamond?"diamond":"correct");setTimeout(next,750);}else{wrRef.current=true;setLives(l=>{const nl=l-1;if(nl<=0){setDone(true);saveGameScore("cipher",score,username);}return nl;});setResult("wrong");setTimeout(next,1100);}};
  const shiftLabel={1:"A→B",2:"A→C",3:"A→D",4:"A→E",5:"A→F"};
  const colrs=cur.cipher?Array.from(cur.cipher).map((_,i)=>`hsl(${(i*43)%360},80%,66%)`) :[];
  const top=getTopScores("cipher",username);
  if(done)return(<div style={{display:"flex",flexDirection:"column",gap:0}}><GameResults gameId="cipher" score={score} diamonds={diamonds} username={username} gameName="🔐 Cipher Rush" onClose={onExit}/></div>);
  return(<div style={{display:"flex",flexDirection:"column",gap:14,maxWidth:560,margin:"0 auto"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <span style={{color:"#a78bfa",fontSize:13}}>Round {round+1} · ❤️ {lives}</span>
      <div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:130,height:8,background:"rgba(255,255,255,0.08)",borderRadius:4,overflow:"hidden"}}><div style={{height:"100%",width:`${(timeLeft/20)*100}%`,background:timeLeft<=5?"#EF4444":"linear-gradient(90deg,#10B981,#38BDF8)",borderRadius:4,transition:"width 1s linear"}}/></div><span style={{fontFamily:"monospace",color:timeLeft<=5?"#EF4444":"#fff",fontWeight:"bold"}}>{timeLeft}s</span></div>
      <div style={{display:"flex",gap:8}}><span style={{color:"#38BDF8",fontWeight:"bold"}}>💎 {diamonds}</span><span style={{color:"#FFD700",fontWeight:"bold"}}>⭐ {score}</span></div>
    </div>
    {round%5===4&&<div style={{textAlign:"center",background:"rgba(56,189,248,0.1)",border:"1px solid rgba(56,189,248,0.3)",borderRadius:10,padding:"6px",fontSize:12,color:"#38BDF8",fontWeight:"bold"}}>💎 DIAMOND ROUND! Correct = +💎</div>}
    <div style={{background:"rgba(255,255,255,0.04)",borderRadius:20,padding:22,border:"1px solid rgba(124,58,237,0.3)",textAlign:"center"}}>
      <div style={{fontSize:12,color:"#888",marginBottom:10}}>ENCODED (Caesar +{cur.shift} · {shiftLabel[cur.shift]}) · Shift each letter BACK</div>
      <div style={{display:"flex",justifyContent:"center",gap:5,flexWrap:"wrap",marginBottom:10}}>{colrs.map((col,i)=><div key={i} style={{width:36,height:44,borderRadius:8,background:`${col}18`,border:`2px solid ${col}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,fontWeight:900,color:col,fontFamily:"monospace",boxShadow:`0 0 10px ${col}33`}}>{cur.cipher[i]}</div>)}</div>
    </div>
    <div style={{display:"flex",gap:8}}>
      <input value={input} onChange={e=>setInput(e.target.value.toUpperCase())} onKeyDown={e=>e.key==="Enter"&&check()} placeholder="Type decoded word…" maxLength={cur.word.length} style={{flex:1,background:result==="correct"||result==="diamond"?"rgba(16,185,129,0.15)":result==="wrong"?"rgba(239,68,68,0.15)":"rgba(255,255,255,0.07)",border:`1px solid ${result==="correct"||result==="diamond"?"#10B981":result==="wrong"?"#EF4444":"rgba(255,255,255,0.12)"}`,borderRadius:12,padding:"13px 16px",color:"#fff",fontSize:17,outline:"none",fontFamily:"monospace",letterSpacing:4,textAlign:"center",transition:"all 0.2s"}}/>
      <button onClick={check} style={{padding:"13px 20px",borderRadius:12,background:"linear-gradient(135deg,#7C3AED,#4C1D95)",color:"#fff",border:"none",fontWeight:"bold",cursor:"pointer",fontSize:16}}>✓</button>
    </div>
    {result&&<div style={{textAlign:"center",fontSize:15,fontWeight:"bold",color:result==="diamond"?"#38BDF8":result==="correct"?"#10B981":"#EF4444"}}>{result==="diamond"?`💎 +${Math.ceil(timeLeft*5)+50} DIAMOND!`:result==="correct"?`✅ +${Math.ceil(timeLeft*5)} pts!`:`❌ Answer: ${cur.word}`}</div>}
    {top.length>0&&<div style={{fontSize:11,color:"#555",textAlign:"center"}}>🏆 Best: {top[0].score} · {top[1]?.score||"-"} · {top[2]?.score||"-"}</div>}
    <button onClick={onExit} style={{padding:"7px 18px",borderRadius:10,border:"1px solid rgba(255,100,100,0.4)",background:"rgba(255,80,80,0.14)",color:"#FF6B6B",cursor:"pointer",fontSize:12,alignSelf:"center"}}>Exit</button>
  </div>);
}

// ── GAME 5: REFLEX GRID ───────────────────────────────────────────────────────
function ReflexGrid({onExit,lang,char,username}){
  const SIZE=6;
  const [active,setActive]=useState([]);const [score,setScore]=useState(0);const [diamonds,setDiamonds]=useState(0);const [misses,setMisses]=useState(0);const [level,setLevel]=useState(1);const [done,setDone]=useState(false);const [combo,setCombo]=useState(0);const [maxCombo,setMaxCombo]=useState(0);const [frame,setFrame]=useState(0);const [diamondCell,setDiamondCell]=useState(null);
  const tmRef=useRef(null),dmRef=useRef(null),stRef=useRef({score:0,diamonds:0,misses:0,level:1,combo:0,maxCombo:0,done:false});
  const getSpeed=lv=>Math.max(260,1020-lv*82);const getCount=lv=>Math.min(5,1+Math.floor(lv/2));
  const nrRef=useRef(null);
  nrRef.current=()=>{
    clearTimeout(tmRef.current);clearTimeout(dmRef.current);
    const s=stRef.current;if(s.done)return;
    const count=getCount(s.level);
    const idxs=[];while(idxs.length<count){const i=Math.floor(Math.random()*SIZE*SIZE);if(!idxs.includes(i))idxs.push(i);}
    setActive(idxs);
    // Randomly spawn diamond cell
    if(Math.random()<0.2){const dc=Math.floor(Math.random()*SIZE*SIZE);setDiamondCell(dc);dmRef.current=setTimeout(()=>setDiamondCell(null),getSpeed(s.level)*1.5);}
    else setDiamondCell(null);
    tmRef.current=setTimeout(()=>{const ns={...stRef.current};ns.misses++;ns.combo=0;if(ns.misses>=6){ns.done=true;stRef.current=ns;setDone(true);setMisses(ns.misses);saveGameScore("reflex",ns.score,username);return;}stRef.current=ns;setMisses(ns.misses);setCombo(0);nrRef.current();},getSpeed(s.level));
  };
  useEffect(()=>{nrRef.current();const anim=setInterval(()=>setFrame(f=>f+1),80);return()=>{clearTimeout(tmRef.current);clearTimeout(dmRef.current);clearInterval(anim);};},[]);
  const tap=i=>{
    const s=stRef.current;if(s.done)return;
    if(i===diamondCell){setDiamondCell(null);const ns={...s,diamonds:s.diamonds+1,score:s.score+100};stRef.current=ns;setDiamonds(ns.diamonds);setScore(ns.score);}
    if(active.includes(i)){const nc=s.combo+1,ns={...s,combo:nc,maxCombo:Math.max(s.maxCombo,nc),score:s.score+10+nc*4};if(Math.floor(ns.score/130)>Math.floor(s.score/130)){ns.level=Math.min(14,ns.level+1);setLevel(ns.level);}stRef.current=ns;setScore(ns.score);setCombo(nc);setMaxCombo(ns.maxCombo);nrRef.current();}
    else if(i!==diamondCell){const ns={...stRef.current,misses:stRef.current.misses+1,combo:0};if(ns.misses>=6){ns.done=true;stRef.current=ns;setDone(true);setMisses(ns.misses);saveGameScore("reflex",ns.score,username);return;}stRef.current=ns;setMisses(ns.misses);setCombo(0);}
  };
  const hueBase=(frame*8)%360;
  const colrs=active.map((_,i)=>`hsl(${(hueBase+i*60)%360},90%,62%)`);
  const top=getTopScores("reflex",username);
  if(done)return(<div><GameResults gameId="reflex" score={score} diamonds={diamonds} username={username} gameName="⚡ Reflex Grid" onClose={onExit}/></div>);
  return(<div style={{display:"flex",flexDirection:"column",gap:12,alignItems:"center",maxWidth:440,margin:"0 auto"}}>
    <div style={{display:"flex",justifyContent:"space-between",width:"100%",fontSize:13}}><span style={{color:"#a78bfa"}}>Lv {level}</span><span style={{color:"#38BDF8",fontWeight:"bold"}}>💎 {diamonds}</span><span style={{color:"#FFD700",fontWeight:"bold"}}>⭐ {score}</span><span style={{color:"#10B981"}}>🔥 {combo}x</span><span style={{color:"#EF4444"}}>❌ {misses}/6</span><span style={{color:"#888",fontSize:10}}>{getSpeed(level)}ms</span></div>
    <div style={{width:"100%",height:5,background:"rgba(255,255,255,0.07)",borderRadius:4}}><div style={{height:"100%",width:`${Math.max(0,(1-misses/6)*100)}%`,background:"linear-gradient(90deg,#10B981,#7C3AED)",borderRadius:4,transition:"width 0.3s"}}/></div>
    <div style={{display:"grid",gridTemplateColumns:`repeat(${SIZE},1fr)`,gap:6,width:"100%",maxWidth:420}}>
      {Array(SIZE*SIZE).fill(0).map((_,i)=>{const isA=active.includes(i);const isDia=i===diamondCell;const idx=active.indexOf(i);const col=isA?colrs[idx]:"rgba(255,255,255,0.06)";
      return(<button key={i} onClick={()=>tap(i)} style={{aspectRatio:"1",borderRadius:11,border:`2px solid ${isDia?"#38BDF8":isA?col:"rgba(255,255,255,0.07)"}`,background:isDia?"rgba(56,189,248,0.2)":isA?`${col}28`:"rgba(255,255,255,0.03)",cursor:"pointer",transition:"all 0.07s",boxShadow:isDia?`0 0 24px #38BDF888`:isA?`0 0 22px ${col}77`:"none",transform:isDia||isA?"scale(1.1)":"scale(1)",fontSize:isDia?22:14,display:"flex",alignItems:"center",justifyContent:"center"}}>
        {isDia?"💎":isA?<div style={{width:"52%",height:"52%",borderRadius:"50%",background:col,boxShadow:`0 0 12px ${col}`}}/>:null}
      </button>);})}
    </div>
    {top.length>0&&<div style={{fontSize:11,color:"#555"}}>🏆 Best: {top[0].score} · {top[1]?.score||"-"} · {top[2]?.score||"-"}</div>}
    <div style={{fontSize:11,color:"#555"}}>Tap glowing cells · 💎 = +100 pts + 1 diamond!</div>
    <button onClick={onExit} style={{padding:"7px 18px",borderRadius:10,border:"1px solid rgba(255,100,100,0.4)",background:"rgba(255,80,80,0.14)",color:"#FF6B6B",cursor:"pointer",fontSize:12}}>Exit</button>
  </div>);
}

// ── QUIZ ──────────────────────────────────────────────────────────────────────
function QuizSection({topic,subject,lang,onDone}) {
  const [questions,setQuestions]=useState(null);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState(null);
  const [qIdx,setQIdx]=useState(0);
  const [selected,setSelected]=useState(null);
  const [showAnswer,setShowAnswer]=useState(false);
  const [answers,setAnswers]=useState([]);
  const [finished,setFinished]=useState(false);
  const t=T[lang];

  const loadQuiz=async()=>{
    setLoading(true); setError(null); setQuestions(null);
    setQIdx(0); setSelected(null); setShowAnswer(false); setAnswers([]); setFinished(false);
    try{
      const ln={de:"German",en:"English",it:"Italian",fr:"French"}[lang];
      const langSubjectMap={"English":"english","German":"german","Italian":"italian","French":"french"};
      const subjectLang=Object.entries(langSubjectMap).find(([,k])=>subject?.toLowerCase().includes(k))?.[0];
      const isNative=subjectLang&&subjectLang===ln;
      const levelNote=subjectLang?(isNative?`Use native-level ${ln} (C1-C2).`:`Use very simple A1-level ${ln}.`):"";

      const prompt=`You are a quiz generator. Generate exactly 20 multiple-choice quiz questions about the topic "${topic}" (subject: ${subject}) for students aged 10-15. ${levelNote}

CRITICAL: Return ONLY a raw JSON array. No explanation, no markdown, no code fences, no text before or after.
Format: [{"q":"question text","options":["option1","option2","option3","option4"],"answer":0},...]
"answer" must be the integer index (0, 1, 2, or 3) of the correct option.
Language: ${ln}.`;

      const res=await fetch("/api/gemini",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({system:"You are a quiz generator. You ONLY output raw valid JSON arrays. Never add markdown, never add explanations.",messages:[{role:"user",content:prompt}],maxTokens:4000})
      });
      if(!res.ok) throw new Error(`API error ${res.status}`);
      const data=await res.json();
      if(data.error) throw new Error(data.error.message||"API error");
      const raw=data.text||data.content?.map(c=>c.text||"").join("")||"";

      // Robust JSON extraction
      let parsed=null;
      // Try direct parse first
      try{ parsed=JSON.parse(raw.trim()); }catch(_){
        // Strip markdown fences
        const stripped=raw.replace(/^```(?:json)?\s*/i,"").replace(/\s*```$/,"").trim();
        try{ parsed=JSON.parse(stripped); }catch(_){
          // Find array bounds
          const start=raw.indexOf("["), end=raw.lastIndexOf("]");
          if(start!==-1&&end!==-1&&end>start){
            try{ parsed=JSON.parse(raw.slice(start,end+1)); }catch(_){ throw new Error("JSON parse failed"); }
          } else { throw new Error("No JSON array found"); }
        }
      }

      if(!Array.isArray(parsed)||parsed.length===0) throw new Error("Empty questions array");

      // Validate and sanitize each question
      const valid=parsed.filter(q=>
        q&&typeof q.q==="string"&&Array.isArray(q.options)&&q.options.length===4&&
        typeof q.answer==="number"&&q.answer>=0&&q.answer<=3
      );
      if(valid.length<5) throw new Error(`Only ${valid.length} valid questions`);
      setQuestions(valid.slice(0,20));
    }catch(e){
      setError(`Fehler: ${e.message}`);
    }
    setLoading(false);
  };

  useEffect(()=>{ loadQuiz(); },[topic,lang]);

  const handleAnswer=(i)=>{
    if(showAnswer) return;
    setSelected(i);
    setShowAnswer(true);
  };

  const next=()=>{
    if(selected===null) return;
    const correct=selected===questions[qIdx].answer;
    const na=[...answers,correct];
    setAnswers(na);
    if(qIdx+1>=questions.length){ setFinished(true); }
    else{ setQIdx(q=>q+1); setSelected(null); setShowAnswer(false); }
  };

  if(loading) return(
    <div style={{textAlign:"center",padding:48,color:"#aaa"}}>
      <div style={{fontSize:38,marginBottom:12,display:"inline-block",animation:"spin 1s linear infinite"}}>🧠</div>
      <div style={{fontSize:15}}>{t.quizLoading}</div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if(error) return(
    <div style={{textAlign:"center",padding:32}}>
      <div style={{fontSize:38,marginBottom:12}}>⚠️</div>
      <div style={{color:"#FF6B6B",fontSize:14,marginBottom:20}}>{error}</div>
      <button onClick={loadQuiz} style={{padding:"12px 28px",borderRadius:12,background:"linear-gradient(135deg,#7C3AED,#4C1D95)",color:"#fff",border:"none",fontWeight:"bold",cursor:"pointer",fontSize:15}}>
        🔄 Nochmal versuchen
      </button>
    </div>
  );

  if(finished){
    const correct=answers.filter(Boolean).length;
    const pct=Math.round((correct/questions.length)*100);
    const pts=pct===100?3:pct>=75?2:pct>=50?1:0;
    return(
      <div style={{textAlign:"center",padding:"28px 0"}}>
        <div style={{fontSize:56,marginBottom:10}}>{pct===100?"🏆":pct>=75?"🥇":pct>=50?"🎉":"😅"}</div>
        <h2 style={{fontSize:22,margin:"0 0 6px",background:"linear-gradient(135deg,#7C3AED,#38BDF8)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{t.quizResult}</h2>
        <div style={{fontSize:56,fontWeight:900,color:"#FFD700",margin:"10px 0"}}>{pct}%</div>
        <div style={{fontSize:15,color:"#aaa",marginBottom:4}}>{correct} / {questions.length}</div>
        <div style={{fontSize:14,color:"#666",marginBottom:8}}>≥50% = +1⭐ · ≥75% = +2⭐ · 100% = +3⭐</div>
        <div style={{fontSize:17,fontWeight:"bold",color:pts>0?"#10B981":"#FF6B6B",margin:"6px 0 22px"}}>{pct===100?t.quizPerfect:pct>=75?t.quizPass:pct>=50?`+1 ⭐`:t.quizFail}</div>
        <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
          <button onClick={()=>onDone(pts)} style={{padding:"12px 28px",borderRadius:14,background:"linear-gradient(135deg,#7C3AED,#4C1D95)",color:"#fff",border:"none",fontWeight:"bold",cursor:"pointer",fontSize:15}}>{t.finishQuiz}</button>
          <button onClick={loadQuiz} style={{padding:"12px 28px",borderRadius:14,background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.15)",color:"#aaa",cursor:"pointer",fontWeight:"bold",fontSize:15}}>🔄 Nochmal</button>
        </div>
      </div>
    );
  }

  const q=questions[qIdx];
  const colors=["#7C3AED","#0EA5E9","#10B981","#F59E0B"];
  const getBg=(i)=>{
    if(!showAnswer) return selected===i?`${colors[i]}22`:"rgba(255,255,255,0.04)";
    if(i===q.answer) return "rgba(16,185,129,0.2)";
    if(i===selected&&i!==q.answer) return "rgba(239,68,68,0.2)";
    return "rgba(255,255,255,0.03)";
  };
  const getBorder=(i)=>{
    if(!showAnswer) return `2px solid ${selected===i?colors[i]:"rgba(255,255,255,0.09)"}`;
    if(i===q.answer) return "2px solid #10B981";
    if(i===selected&&i!==q.answer) return "2px solid #EF4444";
    return "2px solid rgba(255,255,255,0.06)";
  };

  return(
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      {/* Progress */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{fontSize:13,color:"#888"}}>Frage {qIdx+1} / {questions.length}</span>
        <div style={{display:"flex",gap:3}}>{answers.map((a,i)=><div key={i} style={{width:8,height:8,borderRadius:"50%",background:a?"#10B981":"#FF6B6B"}}/>)}</div>
      </div>
      <div style={{height:5,background:"rgba(255,255,255,0.07)",borderRadius:4}}>
        <div style={{height:"100%",width:`${((qIdx)/questions.length)*100}%`,background:"linear-gradient(90deg,#7C3AED,#38BDF8)",borderRadius:4,transition:"width 0.4s"}}/>
      </div>

      {/* Question */}
      <div style={{background:"rgba(255,255,255,0.04)",borderRadius:16,border:"1px solid rgba(255,255,255,0.1)",padding:"18px 16px"}}>
        <p style={{fontSize:16,lineHeight:1.6,color:"#fff",margin:"0 0 16px",fontWeight:600}}>{q.q}</p>
        <div style={{display:"flex",flexDirection:"column",gap:9}}>
          {q.options.map((opt,i)=>(
            <button key={i} onClick={()=>handleAnswer(i)} style={{
              padding:"13px 16px",borderRadius:12,border:getBorder(i),background:getBg(i),
              color:"#fff",textAlign:"left",cursor:showAnswer?"default":"pointer",
              fontSize:13.5,display:"flex",alignItems:"center",gap:10,transition:"all 0.2s",
            }}>
              <span style={{width:28,height:28,borderRadius:"50%",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:"bold",fontSize:13,
                background:showAnswer&&i===q.answer?"#10B981":showAnswer&&i===selected&&i!==q.answer?"#EF4444":selected===i?colors[i]:"rgba(255,255,255,0.1)",
              }}>{showAnswer&&i===q.answer?"✓":showAnswer&&i===selected&&i!==q.answer?"✗":["A","B","C","D"][i]}</span>
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Next button – only shows after answer selected */}
      {showAnswer&&(
        <button onClick={next} style={{padding:"13px",borderRadius:14,background:"linear-gradient(135deg,#7C3AED,#4C1D95)",color:"#fff",border:"none",fontWeight:"bold",cursor:"pointer",fontSize:15,transition:"all 0.2s"}}>
          {qIdx+1===questions.length?t.finishQuiz:t.nextQ}
        </button>
      )}
    </div>
  );
}

// ── SUMMARY BOT (summary-only mode: requires answer. timed mode: just read + chat) ─────
function SummaryBot({subject,topic,lang,duration,onDone}) {
  const t=T[lang];
  const isTimed = duration.minutes > 0;
  const [phase,setPhase]=useState("loading");
  const [summary,setSummary]=useState("");
  const [answer,setAnswer]=useState("");
  const [feedback,setFeedback]=useState("");
  const [attempts,setAttempts]=useState(0);
  const ln={de:"German",en:"English",it:"Italian",fr:"French"}[lang];

  const langSubjectMap={"English":"english","German":"german","Italian":"italian","French":"french"};
  const isLangSubject=Object.values(langSubjectMap).some(k=>subject?.toLowerCase().includes(k));
  const subjectLang=Object.entries(langSubjectMap).find(([,k])=>subject?.toLowerCase().includes(k))?.[0];
  const isNativeLevel=isLangSubject&&subjectLang===ln;
  const levelNote=isLangSubject
    ?(isNativeLevel?`Write the summary in ${ln} at native/advanced level (C1-C2): rich vocabulary, complex sentences, idioms.`
      :`Write the summary in ${ln} at absolute beginner level (A1): extremely simple words, very short sentences, basic grammar only.`)
    :`Write in ${ln} clearly for a 10-15 year old.`;

  useEffect(()=>{
    (async()=>{
      try{
        const text=await callClaude(
          [{role:"user",content:`Give a clear, well-structured educational summary about "${topic}" (subject: ${subject}) for a 10-15 year old student. Include key concepts, important facts, and 2-3 questions the student should be able to answer. Keep it engaging. ${levelNote}`}],
          `You are a helpful teacher. Write clear summaries for young students.`,1000
        );
        setSummary(text); setPhase("reading");
      }catch{setSummary("Fehler beim Laden."); setPhase("reading");}
    })();
  },[]);

  const submitAnswer=async()=>{
    if(!answer.trim()) return;
    setPhase("checking");
    try{
      const result=await callClaude(
        [{role:"user",content:`A student (age 10-15) read a summary about "${topic}" and wrote this explanation in their own words:\n\n"${answer}"\n\nEvaluate if the student has understood the topic well enough (at least the main ideas).\n\nRespond ONLY in this exact JSON format (no markdown):\n{"approved": true/false, "feedback": "your encouraging feedback in ${ln}", "missing": "what key concepts are still missing (only if not approved), in ${ln}"}`}],
        "You are a strict but encouraging teacher. Be fair — if the student shows basic understanding of the main ideas, approve them.",600
      );
      const cleaned=result.replace(/```json|```/g,"").trim();
      const parsed=JSON.parse(cleaned);
      setFeedback(parsed.feedback+(parsed.missing?"\n\n❗ "+parsed.missing:""));
      setAttempts(a=>a+1);
      setPhase(parsed.approved?"approved":"rejected");
    }catch{ setFeedback("Gute Antwort! Weiter so!"); setPhase("approved"); }
  };

  const card={background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:16,padding:18};
  const gg={background:"linear-gradient(135deg,#7C3AED,#38BDF8)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"};

  if(phase==="loading") return(
    <div style={{textAlign:"center",padding:60,color:"#aaa"}}>
      <div style={{fontSize:40,marginBottom:12,animation:"spin 1s linear infinite"}}>⚙️</div>
      <div>Summary wird generiert…</div>
    </div>
  );

  // ── TIMED MODE: just read summary, then go ──
  if(isTimed) return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <div style={card}>
        <div style={{...gg,fontWeight:700,fontSize:15,marginBottom:10}}>{t.summaryTitle} – {topic}</div>
        <div style={{fontSize:13.5,lineHeight:1.75,color:"#ccc",whiteSpace:"pre-wrap",maxHeight:280,overflowY:"auto"}}>{summary}</div>
      </div>
      <button onClick={onDone} style={{padding:"14px",borderRadius:14,background:"linear-gradient(135deg,#7C3AED,#4C1D95)",color:"#fff",border:"none",fontWeight:"bold",cursor:"pointer",fontSize:16,width:"100%"}}>
        {t.startSession}
      </button>
    </div>
  );

  // ── SUMMARY-ONLY MODE: requires written answer + AI approval ──
  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <div style={card}>
        <div style={{...gg,fontWeight:700,fontSize:15,marginBottom:10}}>{t.summaryTitle} – {topic}</div>
        <div style={{fontSize:13.5,lineHeight:1.75,color:"#ccc",whiteSpace:"pre-wrap",maxHeight:260,overflowY:"auto"}}>{summary}</div>
      </div>
      {(phase==="reading")&&(
        <div style={card}>
          <div style={{fontSize:13,color:"#888",marginBottom:6}}>{t.summaryAnswer} ✍️{attempts>0&&<span style={{color:"#F59E0B",marginLeft:8}}>Versuch {attempts+1}</span>}</div>
          <textarea value={answer} onChange={e=>setAnswer(e.target.value)} placeholder={t.answerPlaceholder} rows={5}
            style={{width:"100%",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:12,padding:"12px 14px",color:"#fff",fontSize:14,outline:"none",resize:"vertical",lineHeight:1.6}}/>
          <button onClick={submitAnswer} disabled={!answer.trim()} style={{marginTop:10,width:"100%",padding:"13px",borderRadius:12,background:answer.trim()?"linear-gradient(135deg,#7C3AED,#4C1D95)":"rgba(255,255,255,0.07)",color:answer.trim()?"#fff":"#555",border:"none",fontWeight:"bold",cursor:answer.trim()?"pointer":"default",fontSize:15,transition:"all 0.2s"}}>
            {t.submitAnswer}
          </button>
        </div>
      )}
      {phase==="checking"&&(<div style={{...card,textAlign:"center",padding:28}}><div style={{fontSize:32,marginBottom:10,animation:"spin 1s linear infinite"}}>🔍</div><div style={{color:"#aaa",fontSize:14}}>KI überprüft deine Antwort…</div></div>)}
      {phase==="approved"&&(
        <div style={{...card,borderColor:"rgba(16,185,129,0.4)",background:"rgba(16,185,129,0.07)"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}><span style={{fontSize:24}}>✅</span><span style={{fontWeight:800,fontSize:15,color:"#10B981"}}>KI hat zugestimmt!</span></div>
          <div style={{fontSize:13.5,lineHeight:1.7,color:"#ccc",whiteSpace:"pre-wrap",marginBottom:14}}>{feedback}</div>
          <button onClick={onDone} style={{width:"100%",padding:"13px",borderRadius:12,background:"linear-gradient(135deg,#10B981,#059669)",color:"#fff",border:"none",fontWeight:"bold",cursor:"pointer",fontSize:15}}>{t.donePoints}</button>
        </div>
      )}
      {phase==="rejected"&&(
        <div style={{...card,borderColor:"rgba(239,68,68,0.4)",background:"rgba(239,68,68,0.07)"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}><span style={{fontSize:24}}>❌</span><span style={{fontWeight:800,fontSize:15,color:"#EF4444"}}>Noch nicht ganz richtig!</span></div>
          <div style={{fontSize:13.5,lineHeight:1.7,color:"#ccc",whiteSpace:"pre-wrap",marginBottom:14}}>{feedback}</div>
          <button onClick={()=>{setAnswer("");setPhase("reading");}} style={{width:"100%",padding:"13px",borderRadius:12,background:"linear-gradient(135deg,#F59E0B,#D97706)",color:"#fff",border:"none",fontWeight:"bold",cursor:"pointer",fontSize:15}}>🔄 Nochmal versuchen</button>
        </div>
      )}
    </div>
  );
}

// ── CHAT HELPER ───────────────────────────────────────────────────────────────
function ChatHelper({subject,topic,lang,phase,onPhaseComplete,onMessagesChange}) {
  const t=T[lang]; const ln={de:"German",en:"English",it:"Italian",fr:"French"}[lang];
  const [messages,setMessages]=useState([]); const [input,setInput]=useState(""); const [loading,setLoading]=useState(false); const [imgB64,setImgB64]=useState(null); const [imgFile,setImgFile]=useState(null);
  const fileRef=useRef(null); const bottomRef=useRef(null);

  const langSubjectMap={"English":"english","German":"german","Italian":"italian","French":"french"};
  const subjectLang=Object.entries(langSubjectMap).find(([,k])=>subject?.toLowerCase().includes(k))?.[0];
  const isNativeLevel = subjectLang && subjectLang===ln;
  const levelNote = subjectLang
    ? (isNativeLevel ? `Use native-level ${ln} (C1-C2): rich vocab, complex grammar, idioms.`
        : `Use ONLY beginner ${ln} (A1): the simplest words possible, very short sentences. Student is a beginner in ${ln}.`)
    : "";
  const sys=`You are a friendly, encouraging study assistant for students aged 10-15. Subject: "${subject}", Topic: "${topic}". Phase: ${phase}. Always respond in ${ln}. Be concise and supportive. ${levelNote}`;

  const updateMessages=(newMsgs)=>{ setMessages(newMsgs); onMessagesChange?.(newMsgs); };

  const send=useCallback(async(text,b64=null)=>{
    if(!text.trim()&&!b64)return;
    const newMsgs=[...messages,{role:"user",content:text,image:b64}];
    updateMessages(newMsgs); setInput(""); setImgB64(null); setImgFile(null); setLoading(true);
    try{
      const hist=newMsgs.map(m=>({role:m.role,content:m.image?[{type:"image",source:{type:"base64",media_type:"image/jpeg",data:m.image}},{type:"text",text:m.content}]:m.content}));
      const reply=await callClaude(hist,sys);
      const withReply=[...newMsgs,{role:"assistant",content:reply}];
      updateMessages(withReply);
      if((phase==="mid"||phase==="end")&&b64)setTimeout(()=>onPhaseComplete?.(),1500);
    }catch{updateMessages([...newMsgs,{role:"assistant",content:"⚠️ Fehler."}]);}
    setLoading(false);
  },[messages,sys,phase,onPhaseComplete]);

  useEffect(()=>{
    const init=phase==="mid"?`I'm halfway through studying "${topic}". Please give me feedback on my progress and tips for the second half.`:`I'm done studying "${topic}". Here is my final progress.`;
    send(init);
  },[]);

  useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:"smooth"});},[messages,loading]);
  const handleFile=e=>{const f=e.target.files[0];if(!f)return;setImgFile(f);const r=new FileReader();r.onload=ev=>setImgB64(ev.target.result.split(",")[1]);r.readAsDataURL(f);};

  return(<div style={{display:"flex",flexDirection:"column",height:"100%"}}>
    <div style={{flex:1,overflowY:"auto",padding:12,display:"flex",flexDirection:"column",gap:9}}>
      {messages.map((m,i)=><div key={i} style={{alignSelf:m.role==="user"?"flex-end":"flex-start",maxWidth:"82%",background:m.role==="user"?"linear-gradient(135deg,#7C3AED,#5B21B6)":"rgba(255,255,255,0.07)",border:m.role==="assistant"?"1px solid rgba(255,255,255,0.08)":"none",borderRadius:m.role==="user"?"18px 18px 4px 18px":"18px 18px 18px 4px",padding:"10px 14px",color:"#fff",fontSize:13.5,lineHeight:1.65,whiteSpace:"pre-wrap"}}>
        {m.image&&<div style={{fontSize:11,opacity:0.6,marginBottom:3}}>📷 {t.photoAttached}</div>}{m.content}
      </div>)}
      {loading&&<div style={{alignSelf:"flex-start",display:"flex",gap:5,paddingLeft:4}}>{[0,1,2].map(i=><div key={i} style={{width:7,height:7,borderRadius:"50%",background:"#7C3AED",animation:`pulse 1.2s ${i*0.2}s infinite`}}/>)}</div>}
      <div ref={bottomRef}/>
    </div>
    {(phase==="mid"||phase==="end")&&<div style={{padding:"7px 12px",background:"rgba(255,215,0,0.06)",borderTop:"1px solid rgba(255,215,0,0.12)"}}>
      <div style={{fontSize:11,color:"#FFD700",marginBottom:4}}>{t.photoLabel}</div>
      <button onClick={()=>fileRef.current?.click()} style={{padding:"5px 12px",borderRadius:8,border:"1px solid rgba(255,215,0,0.3)",background:"rgba(255,215,0,0.1)",color:"#FFD700",cursor:"pointer",fontSize:12}}>{imgFile?`✅ ${imgFile.name}`:t.choosePhoto}</button>
    </div>}
    <div style={{padding:"9px 12px",borderTop:"1px solid rgba(255,255,255,0.07)",display:"flex",gap:6}}>
      <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&send(input,imgB64)} placeholder={t.typeMsg} style={{flex:1,background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,padding:"8px 12px",color:"#fff",fontSize:13.5,outline:"none"}}/>
      {phase!=="chat"&&<button onClick={()=>fileRef.current?.click()} style={{padding:"8px 10px",borderRadius:9,border:"1px solid rgba(255,255,255,0.1)",background:"rgba(255,255,255,0.07)",color:"#fff",cursor:"pointer"}}>📷</button>}
      <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{display:"none"}}/>
      <button onClick={()=>send(input,imgB64)} disabled={loading} style={{padding:"8px 14px",borderRadius:9,background:"linear-gradient(135deg,#7C3AED,#4C1D95)",color:"#fff",border:"none",cursor:"pointer",fontWeight:"bold",fontSize:14}}>➤</button>
    </div>
  </div>);
}

// ── MIDPOINT QUIZ ─────────────────────────────────────────────────────────────
// 10-question quiz at halfway, tailored to topic + chat history
function MidpointQuiz({subject,topic,lang,chatHistory,onContinue}) {
  const t=T[lang];
  const ln={de:"German",en:"English",it:"Italian",fr:"French"}[lang];
  const [phase,setPhase]=useState("loading"); // loading | quiz | done
  const [questions,setQuestions]=useState([]);
  const [qIdx,setQIdx]=useState(0);
  const [selected,setSelected]=useState(null);
  const [showAnswer,setShowAnswer]=useState(false);
  const [answers,setAnswers]=useState([]);
  const [error,setError]=useState(null);

  useEffect(()=>{
    (async()=>{
      try{
        // Build context from chat history — extract user questions
        const userQs=chatHistory
          .filter(m=>m.role==="user"&&m.content?.trim().length>3)
          .map(m=>m.content).slice(-8).join(" | ");
        const chatCtx=userQs
          ? `The student asked these questions during their study session: "${userQs}". Focus some questions on the areas they asked about.`
          : "";

        const prompt=`Generate exactly 10 multiple-choice quiz questions about "${topic}" (subject: ${subject}) for a student aged 10-15. ${chatCtx}
Make the questions test understanding of the key concepts.
Language: ${ln}.
CRITICAL: Return ONLY a raw JSON array, no markdown, no code fences:
[{"q":"question","options":["A","B","C","D"],"answer":0}]
"answer" is the integer index (0-3) of the correct option.`;

        const res=await fetch("/api/gemini",{
          method:"POST",headers:{"Content-Type":"application/json"},
          body:JSON.stringify({system:"You are a quiz generator. Output ONLY valid raw JSON arrays. No markdown, no explanation.",messages:[{role:"user",content:prompt}]
          ,maxTokens:2000})
        });
        const data=await res.json();
        const raw=data.text||data.content?.map(c=>c.text||"").join("")||"";
        let parsed=null;
        try{parsed=JSON.parse(raw.trim());}catch{
          const s=raw.replace(/^```(?:json)?\s*/i,"").replace(/\s*```$/,"").trim();
          try{parsed=JSON.parse(s);}catch{
            const i=raw.indexOf("["),j=raw.lastIndexOf("]");
            if(i!==-1&&j>i)parsed=JSON.parse(raw.slice(i,j+1));
            else throw new Error("No JSON");
          }
        }
        const valid=parsed.filter(q=>q&&typeof q.q==="string"&&Array.isArray(q.options)&&q.options.length===4&&typeof q.answer==="number"&&q.answer>=0&&q.answer<=3);
        if(valid.length<3)throw new Error("Not enough questions");
        setQuestions(valid.slice(0,10));
        setPhase("quiz");
      }catch(e){
        setError(e.message);
      }
    })();
  },[]);

  const handleAnswer=(i)=>{
    if(showAnswer) return;
    setSelected(i); setShowAnswer(true);
  };

  const next=()=>{
    if(selected===null) return;
    const correct=selected===questions[qIdx].answer;
    const na=[...answers,correct];
    setAnswers(na);
    if(qIdx+1>=questions.length){ setPhase("done"); }
    else{ setQIdx(q=>q+1); setSelected(null); setShowAnswer(false); }
  };

  const card={background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.09)",borderRadius:16,padding:16};
  const gg={background:"linear-gradient(135deg,#7C3AED,#38BDF8)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"};
  const colors=["#7C3AED","#0EA5E9","#10B981","#F59E0B"];

  if(phase==="loading") return(
    <div style={{textAlign:"center",padding:48,color:"#aaa"}}>
      <div style={{fontSize:38,marginBottom:12,display:"inline-block",animation:"spin 1s linear infinite"}}>🧠</div>
      <div style={{fontSize:15}}>{lang==="de"?"Halbzeit-Quiz wird erstellt…":lang==="en"?"Creating midpoint quiz…":lang==="it"?"Creazione del quiz di metà…":"Création du quiz mi-parcours…"}</div>
      {chatHistory.filter(m=>m.role==="user").length>0&&(
        <div style={{fontSize:12,color:"#666",marginTop:6}}>{lang==="de"?"Deine Chatfragen werden einbezogen 🎯":lang==="en"?"Your chat questions are included 🎯":lang==="it"?"Le tue domande sono incluse 🎯":"Tes questions sont incluses 🎯"}</div>
      )}
    </div>
  );

  if(error) return(
    <div style={{textAlign:"center",padding:32}}>
      <div style={{fontSize:36,marginBottom:10}}>⚠️</div>
      <div style={{color:"#FF6B6B",fontSize:13,marginBottom:16}}>{error}</div>
      <button onClick={onContinue} style={{padding:"12px 28px",borderRadius:12,background:"linear-gradient(135deg,#10B981,#059669)",color:"#fff",border:"none",fontWeight:"bold",cursor:"pointer",fontSize:14}}>
        {t.continueBtn} →
      </button>
    </div>
  );

  if(phase==="done"){
    const correct=answers.filter(Boolean).length;
    const pct=Math.round((correct/questions.length)*100);
    const bonus=pct===100?2:pct>=70?1:0;
    const emoji=pct===100?"🏆":pct>=70?"🎉":pct>=50?"👍":"💪";
    return(
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div style={{...card,textAlign:"center",padding:24,border:`1px solid ${bonus>0?"rgba(255,215,0,0.3)":"rgba(124,58,237,0.3)"}`}}>
          <div style={{fontSize:48,marginBottom:8}}>{emoji}</div>
          <h3 style={{...gg,margin:"0 0 6px",fontSize:20}}>{lang==="de"?"Halbzeit-Quiz abgeschlossen!":lang==="en"?"Midpoint Quiz Done!":lang==="it"?"Quiz di metà completato!":"Quiz mi-parcours terminé!"}</h3>
          <div style={{fontSize:44,fontWeight:900,color:"#FFD700",margin:"8px 0"}}>{pct}%</div>
          <div style={{fontSize:14,color:"#aaa",marginBottom:6}}>{correct} / {questions.length}</div>
          {bonus>0&&(
            <div style={{display:"inline-block",background:"rgba(255,215,0,0.15)",border:"1px solid rgba(255,215,0,0.4)",borderRadius:12,padding:"8px 20px",marginBottom:10}}>
              <span style={{color:"#FFD700",fontWeight:900,fontSize:18}}>+{bonus} ⭐ Bonus!</span>
              <div style={{fontSize:11,color:"#888",marginTop:2}}>{pct===100?(lang==="de"?"Perfekt! 2 Extra-Sterne":lang==="en"?"Perfect! 2 bonus stars":lang==="it"?"Perfetto! 2 stelle extra":"Parfait! 2 étoiles bonus"):(lang==="de"?"≥70% – 1 Extra-Stern":lang==="en"?"≥70% – 1 bonus star":lang==="it"?"≥70% – 1 stella extra":"≥70% – 1 étoile bonus")}</div>
            </div>
          )}
          <div style={{fontSize:13,color:"#888",marginBottom:14}}>
            {pct>=70
              ?(lang==="de"?"Super! Mach weiter so 💪":lang==="en"?"Great job! Keep it up 💪":lang==="it"?"Ottimo lavoro! Continua così 💪":"Super boulot! Continue ainsi 💪")
              :(lang==="de"?"Fokussiere dich auf diese Themen!":lang==="en"?"Focus on these topics in the second half!":lang==="it"?"Concentrati su questi argomenti!":"Concentre-toi sur ces sujets!")}
          </div>
          {answers.some((a,i)=>!a)&&(
            <div style={{textAlign:"left",marginBottom:14}}>
              <div style={{fontSize:12,color:"#F59E0B",marginBottom:6}}>
                {lang==="de"?"❌ Diese Fragen waren falsch:":lang==="en"?"❌ These were wrong:":lang==="it"?"❌ Queste erano sbagliate:":"❌ Ces questions étaient fausses:"}
              </div>
              {questions.map((q,i)=>!answers[i]&&(
                <div key={i} style={{fontSize:12,color:"#aaa",padding:"6px 10px",background:"rgba(255,80,80,0.08)",borderRadius:8,marginBottom:4}}>
                  {q.q} → <span style={{color:"#10B981"}}>{q.options[q.answer]}</span>
                </div>
              ))}
            </div>
          )}
          <button onClick={()=>onContinue(bonus)} style={{width:"100%",padding:"13px",borderRadius:12,background:"linear-gradient(135deg,#10B981,#059669)",color:"#fff",border:"none",fontWeight:"bold",cursor:"pointer",fontSize:15}}>
            {t.continueBtn} ▶
          </button>
        </div>
      </div>
    );
  }

  const q=questions[qIdx];
  const getBg=(i)=>{if(!showAnswer)return selected===i?`${colors[i]}22`:"rgba(255,255,255,0.04)";if(i===q.answer)return"rgba(16,185,129,0.2)";if(i===selected&&i!==q.answer)return"rgba(239,68,68,0.2)";return"rgba(255,255,255,0.03)";};
  const getBorder=(i)=>{if(!showAnswer)return`2px solid ${selected===i?colors[i]:"rgba(255,255,255,0.09)"}`;if(i===q.answer)return"2px solid #10B981";if(i===selected&&i!==q.answer)return"2px solid #EF4444";return"2px solid rgba(255,255,255,0.06)";};

  return(
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{...gg,fontWeight:700,fontSize:15}}>
          🧠 {lang==="de"?"Halbzeit-Quiz":lang==="en"?"Midpoint Quiz":lang==="it"?"Quiz di Metà":"Quiz Mi-Parcours"}
        </div>
        <span style={{fontSize:13,color:"#888"}}>Frage {qIdx+1}/{questions.length}</span>
      </div>
      {chatHistory.filter(m=>m.role==="user").length>0&&(
        <div style={{fontSize:11,color:"#666",background:"rgba(124,58,237,0.08)",borderRadius:8,padding:"5px 10px"}}>
          🎯 {lang==="de"?"Basiert auf deinen Chatfragen":lang==="en"?"Based on your chat questions":lang==="it"?"Basato sulle tue domande":lang==="fr"?"Basé sur tes questions"||"Based on your questions":"Based on your questions"}
        </div>
      )}
      {/* Progress */}
      <div style={{height:5,background:"rgba(255,255,255,0.07)",borderRadius:4}}>
        <div style={{height:"100%",width:`${(qIdx/questions.length)*100}%`,background:"linear-gradient(90deg,#7C3AED,#38BDF8)",borderRadius:4,transition:"width 0.4s"}}/>
      </div>
      {/* Answer dots */}
      <div style={{display:"flex",gap:4}}>{answers.map((a,i)=><div key={i} style={{width:8,height:8,borderRadius:"50%",background:a?"#10B981":"#EF4444"}}/>)}</div>

      {/* Question card */}
      <div style={card}>
        <p style={{fontSize:16,lineHeight:1.6,color:"#fff",margin:"0 0 14px",fontWeight:600}}>{q.q}</p>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {q.options.map((opt,i)=>(
            <button key={i} onClick={()=>handleAnswer(i)} style={{padding:"12px 14px",borderRadius:12,border:getBorder(i),background:getBg(i),color:"#fff",textAlign:"left",cursor:showAnswer?"default":"pointer",fontSize:13.5,display:"flex",alignItems:"center",gap:10,transition:"all 0.2s"}}>
              <span style={{width:26,height:26,borderRadius:"50%",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:"bold",fontSize:12,
                background:showAnswer&&i===q.answer?"#10B981":showAnswer&&i===selected&&i!==q.answer?"#EF4444":selected===i?colors[i]:"rgba(255,255,255,0.1)"}}>
                {showAnswer&&i===q.answer?"✓":showAnswer&&i===selected&&i!==q.answer?"✗":["A","B","C","D"][i]}
              </span>
              {opt}
            </button>
          ))}
        </div>
      </div>

      {showAnswer&&(
        <button onClick={next} style={{padding:"13px",borderRadius:14,background:"linear-gradient(135deg,#7C3AED,#4C1D95)",color:"#fff",border:"none",fontWeight:"bold",cursor:"pointer",fontSize:15}}>
          {qIdx+1===questions.length?(lang==="de"?"Ergebnisse sehen":lang==="en"?"See Results":lang==="it"?"Vedi Risultati":"Voir Résultats"):"Weiter →"}
        </button>
      )}
    </div>
  );
}

// ── TIMER ─────────────────────────────────────────────────────────────────────
function StudyTimer({duration,secs,onAbort,lang,midDone,periodicCount}) {
  const total=duration.minutes*60; const t=T[lang];
  const pct=total>0?((total-secs)/total)*100:100,r=90,C=2*Math.PI*r,m=Math.floor(secs/60),s=secs%60;
  const isLow=secs<=60;
  return(<div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:16,padding:"20px 24px",background:"rgba(255,255,255,0.03)",borderRadius:24,border:`1px solid ${isLow?"rgba(239,68,68,0.3)":"rgba(255,255,255,0.08)"}`,transition:"border-color 0.5s"}}>
    <svg width={220} height={220}>
      <circle cx={110} cy={110} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={14}/>
      <circle cx={110} cy={110} r={r} fill="none" stroke={isLow?"url(#tgRed)":"url(#tg)"} strokeWidth={14} strokeDasharray={C} strokeDashoffset={C*(1-pct/100)} strokeLinecap="round" transform="rotate(-90 110 110)" style={{transition:"stroke-dashoffset 1s linear"}}/>
      <defs>
        <linearGradient id="tg" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#7C3AED"/><stop offset="100%" stopColor="#38BDF8"/></linearGradient>
        <linearGradient id="tgRed" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#EF4444"/><stop offset="100%" stopColor="#F97316"/></linearGradient>
      </defs>
      <text x={110} y={100} textAnchor="middle" fill={isLow?"#EF4444":"#fff"} fontSize={38} fontWeight="bold" fontFamily="monospace">{String(m).padStart(2,"0")}:{String(s).padStart(2,"0")}</text>
      <text x={110} y={135} textAnchor="middle" fill="#555" fontSize={13} fontFamily="monospace">remaining</text>
      <text x={110} y={158} textAnchor="middle" fill="#444" fontSize={11} fontFamily="monospace">{duration.points} ⭐ on completion</text>
    </svg>
    <div style={{fontSize:13,color:midDone?"#10B981":"#555",fontWeight:midDone?"600":"normal"}}>{midDone?"✅ Midpoint done":`⏱ Midpoint at ${Math.floor(duration.minutes/2)} min`}</div>
    {duration.minutes>=45&&<div style={{fontSize:11,color:"#a78bfa"}}>⚡ Quiz every 15 min · done: {periodicCount||0}</div>}
    <button onClick={onAbort} style={{padding:"7px 18px",borderRadius:10,border:"1px solid rgba(255,80,80,0.3)",background:"rgba(255,80,80,0.08)",color:"#FF6B6B",cursor:"pointer",fontSize:12,fontWeight:"bold"}}>{t.abort}</button>
  </div>);
}

// ── TOPIC PICKER ──────────────────────────────────────────────────────────────
function TopicPicker({subject,lang,onSelect}) {
  const t=T[lang];
  const [custom,setCustom]=useState("");
  const topics=SUBJECT_TOPICS[subject?.id]?.[lang]||SUBJECT_TOPICS[subject?.id]?.de||[];

  return(<div style={{display:"flex",flexDirection:"column",gap:14}}>
    <div style={{fontSize:13,color:"#888",marginBottom:2}}>{t.chooseTopic}</div>
    {/* Preset topics */}
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))",gap:8}}>
      {topics.map(tp=>(
        <button key={tp} onClick={()=>onSelect(tp)} style={{padding:"10px 12px",borderRadius:12,border:"1px solid rgba(124,58,237,0.3)",background:"rgba(124,58,237,0.1)",color:"#c4b5fd",cursor:"pointer",fontSize:13,fontWeight:600,textAlign:"left",transition:"all 0.15s"}}
          onMouseEnter={e=>{e.currentTarget.style.background="rgba(124,58,237,0.25)";e.currentTarget.style.borderColor="#7C3AED";}}
          onMouseLeave={e=>{e.currentTarget.style.background="rgba(124,58,237,0.1)";e.currentTarget.style.borderColor="rgba(124,58,237,0.3)";}}>
          {tp}
        </button>
      ))}
    </div>
    {/* Custom topic */}
    <div style={{display:"flex",gap:8,marginTop:4}}>
      <input value={custom} onChange={e=>setCustom(e.target.value)} onKeyDown={e=>e.key==="Enter"&&custom.trim()&&onSelect(custom.trim())}
        placeholder={t.topicPlaceholder}
        style={{flex:1,background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:11,padding:"10px 13px",color:"#fff",fontSize:13.5,outline:"none"}}/>
      <button onClick={()=>custom.trim()&&onSelect(custom.trim())} style={{padding:"10px 16px",borderRadius:11,background:"linear-gradient(135deg,#7C3AED,#4C1D95)",color:"#fff",border:"none",cursor:"pointer",fontWeight:"bold",fontSize:14}}>→</button>
    </div>
  </div>);
}

// ── FINAL QUIZ (20 questions, points awarded regardless of score) ─────────────
function FinalQuiz({topic,subject,lang,onDone,extended=false}) {
  const ln={de:"German",en:"English",it:"Italian",fr:"French"}[lang];
  const count=extended?25:20;
  const [questions,setQuestions]=useState(null);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState(null);
  const [qIdx,setQIdx]=useState(0);
  const [selected,setSelected]=useState(null);
  const [showAnswer,setShowAnswer]=useState(false);
  const [answers,setAnswers]=useState([]);
  const [finished,setFinished]=useState(false);

  const load=async()=>{
    setLoading(true);setError(null);setQuestions(null);
    setQIdx(0);setSelected(null);setShowAnswer(false);setAnswers([]);setFinished(false);
    try{
      const prompt=`Generate exactly ${count} multiple-choice quiz questions about "${topic}" (subject: ${subject}) for students aged 13-15. Make them varied: easy, medium and challenging. Language: ${ln}.
CRITICAL: Return ONLY a raw JSON array, no markdown, no code fences:
[{"q":"question","options":["A","B","C","D"],"answer":0}]
"answer" is the integer index (0-3) of the correct option.`;
      const res=await fetch("/api/gemini",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({system:"You are a quiz generator. Output ONLY valid raw JSON arrays. No markdown, no explanation.",messages:[{role:"user",content:prompt}],maxTokens:extended?6000:4000})
      });
      const data=await res.json();
      const raw=data.text||data.content?.map(c=>c.text||"").join("")||"";
      let parsed=null;
      try{parsed=JSON.parse(raw.trim());}catch{
        const s=raw.replace(/^```(?:json)?\s*/i,"").replace(/\s*```$/,"").trim();
        try{parsed=JSON.parse(s);}catch{
          const i=raw.indexOf("["),j=raw.lastIndexOf("]");
          if(i!==-1&&j>i)parsed=JSON.parse(raw.slice(i,j+1));
          else throw new Error("No JSON");
        }
      }
      const valid=parsed.filter(q=>q&&typeof q.q==="string"&&Array.isArray(q.options)&&q.options.length===4&&typeof q.answer==="number"&&q.answer>=0&&q.answer<=3);
      if(valid.length<5)throw new Error("Not enough questions");
      setQuestions(valid.slice(0,20));
    }catch(e){setError(e.message);}
    setLoading(false);
  };

  useEffect(()=>{load();},[topic,lang]);

  const handleAnswer=(i)=>{if(showAnswer)return;setSelected(i);setShowAnswer(true);};
  const next=()=>{
    if(selected===null)return;
    const correct=selected===questions[qIdx].answer;
    const na=[...answers,correct];
    setAnswers(na);
    if(qIdx+1>=questions.length)setFinished(true);
    else{setQIdx(q=>q+1);setSelected(null);setShowAnswer(false);}
  };

  const card={background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.09)",borderRadius:16,padding:16};
  const colors=["#7C3AED","#0EA5E9","#10B981","#F59E0B"];
  const gg={background:"linear-gradient(135deg,#10B981,#38BDF8)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"};

  if(loading)return(<div style={{textAlign:"center",padding:48,color:"#aaa"}}>
    <div style={{fontSize:38,marginBottom:12,display:"inline-block",animation:"spin 1s linear infinite"}}>📝</div>
    <div style={{fontSize:15}}>{lang==="de"?"Abschluss-Quiz wird erstellt…":lang==="en"?"Creating final quiz…":lang==="it"?"Creazione quiz finale…":"Création du quiz final…"}</div>
  </div>);

  if(error)return(<div style={{textAlign:"center",padding:32}}>
    <div style={{fontSize:36,marginBottom:10}}>⚠️</div>
    <div style={{color:"#FF6B6B",fontSize:13,marginBottom:16}}>{error}</div>
    <div style={{display:"flex",gap:10,justifyContent:"center"}}>
      <button onClick={load} style={{padding:"11px 22px",borderRadius:12,background:"linear-gradient(135deg,#7C3AED,#4C1D95)",color:"#fff",border:"none",fontWeight:"bold",cursor:"pointer"}}>🔄 Retry</button>
      <button onClick={onDone} style={{padding:"11px 22px",borderRadius:12,background:"linear-gradient(135deg,#10B981,#059669)",color:"#fff",border:"none",fontWeight:"bold",cursor:"pointer"}}>{lang==="de"?"Punkte erhalten →":lang==="en"?"Get points →":lang==="it"?"Prendi punti →":"Obtenir points →"}</button>
    </div>
  </div>);

  if(finished){
    const correct=answers.filter(Boolean).length;
    const pct=Math.round((correct/questions.length)*100);
    const bonus=extended?(pct===100?5:pct>=70?3:pct>=50?1:0):(pct===100?3:pct>=70?2:pct>=50?1:0);
    return(<div style={{textAlign:"center",padding:"24px 0"}}>
      <div style={{fontSize:52,marginBottom:10}}>{pct===100?"🏆":pct>=70?"🎉":pct>=50?"👍":"💪"}</div>
      <h2 style={{...gg,fontSize:22,margin:"0 0 6px"}}>{lang==="de"?"Quiz abgeschlossen!":lang==="en"?"Quiz Complete!":lang==="it"?"Quiz completato!":"Quiz terminé!"}</h2>
      <div style={{fontSize:48,fontWeight:900,color:"#FFD700",margin:"10px 0"}}>{pct}%</div>
      <div style={{fontSize:14,color:"#aaa",marginBottom:6}}>{correct} / {questions.length}</div>
      {extended&&<div style={{fontSize:11,color:"#888",marginBottom:8}}>≥50%=+1⭐ · ≥70%=+3⭐ · 100%=+5⭐</div>}
      {!extended&&<div style={{fontSize:11,color:"#888",marginBottom:8}}>≥50%=+1⭐ · ≥70%=+2⭐ · 100%=+3⭐</div>}
      {bonus>0&&(
        <div style={{display:"inline-block",background:"rgba(255,215,0,0.15)",border:"1px solid rgba(255,215,0,0.4)",borderRadius:12,padding:"8px 22px",marginBottom:12}}>
          <span style={{color:"#FFD700",fontWeight:900,fontSize:20}}>+{bonus} ⭐ Bonus!</span>
          <div style={{fontSize:11,color:"#888",marginTop:2}}>{pct===100?`Perfect! +${bonus} ⭐`:pct>=70?`≥70% → +${bonus} ⭐`:`≥50% → +${bonus} ⭐`}</div>
        </div>
      )}
      <div style={{fontSize:13,color:"#10B981",marginBottom:18,fontWeight:600}}>
        {lang==="de"?"Du erhältst deine Lern-Punkte auf jeden Fall! 🎁":lang==="en"?"You get your study points no matter what! 🎁":lang==="it"?"Ottieni i tuoi punti in ogni caso! 🎁":"Tu obtiens tes points quoi qu'il arrive! 🎁"}
      </div>
      <button onClick={()=>onDone(bonus)} style={{padding:"14px 36px",borderRadius:14,background:"linear-gradient(135deg,#10B981,#059669)",color:"#fff",border:"none",fontWeight:"bold",cursor:"pointer",fontSize:16}}>
        {lang==="de"?"Punkte kassieren 🏆":lang==="en"?"Claim Points 🏆":lang==="it"?"Prendi i punti 🏆":"Récupérer les points 🏆"}
      </button>
    </div>);
  }

  const q=questions[qIdx];
  const getBg=(i)=>{if(!showAnswer)return selected===i?`${colors[i]}22`:"rgba(255,255,255,0.04)";if(i===q.answer)return"rgba(16,185,129,0.2)";if(i===selected&&i!==q.answer)return"rgba(239,68,68,0.2)";return"rgba(255,255,255,0.03)";};
  const getBorder=(i)=>{if(!showAnswer)return`2px solid ${selected===i?colors[i]:"rgba(255,255,255,0.09)"}`;if(i===q.answer)return"2px solid #10B981";if(i===selected&&i!==q.answer)return"2px solid #EF4444";return"2px solid rgba(255,255,255,0.06)";};

  return(<div style={{display:"flex",flexDirection:"column",gap:12}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <span style={{fontSize:13,color:"#888"}}>{lang==="de"?"Frage":lang==="en"?"Question":lang==="it"?"Domanda":"Question"} {qIdx+1} / {questions.length}</span>
      <div style={{display:"flex",gap:3}}>{answers.map((a,i)=><div key={i} style={{width:8,height:8,borderRadius:"50%",background:a?"#10B981":"#EF4444"}}/>)}</div>
    </div>
    <div style={{height:5,background:"rgba(255,255,255,0.07)",borderRadius:4}}>
      <div style={{height:"100%",width:`${(qIdx/questions.length)*100}%`,background:"linear-gradient(90deg,#10B981,#38BDF8)",borderRadius:4,transition:"width 0.4s"}}/>
    </div>
    <div style={card}>
      <p style={{fontSize:16,lineHeight:1.6,color:"#fff",margin:"0 0 14px",fontWeight:600}}>{q.q}</p>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {q.options.map((opt,i)=>(
          <button key={i} onClick={()=>handleAnswer(i)} style={{padding:"12px 14px",borderRadius:12,border:getBorder(i),background:getBg(i),color:"#fff",textAlign:"left",cursor:showAnswer?"default":"pointer",fontSize:13.5,display:"flex",alignItems:"center",gap:10,transition:"all 0.2s"}}>
            <span style={{width:26,height:26,borderRadius:"50%",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:"bold",fontSize:12,
              background:showAnswer&&i===q.answer?"#10B981":showAnswer&&i===selected&&i!==q.answer?"#EF4444":selected===i?colors[i]:"rgba(255,255,255,0.1)"}}>
              {showAnswer&&i===q.answer?"✓":showAnswer&&i===selected&&i!==q.answer?"✗":["A","B","C","D"][i]}
            </span>
            {opt}
          </button>
        ))}
      </div>
    </div>
    {showAnswer&&(
      <button onClick={next} style={{padding:"13px",borderRadius:14,background:"linear-gradient(135deg,#10B981,#059669)",color:"#fff",border:"none",fontWeight:"bold",cursor:"pointer",fontSize:15}}>
        {qIdx+1===questions.length?(lang==="de"?"Ergebnis sehen →":lang==="en"?"See Result →":lang==="it"?"Vedi risultato →":"Voir résultat →"):`${lang==="de"?"Weiter":"Next"} →`}
      </button>
    )}
  </div>);
}


// ── PERIODIC QUIZ (every 15min for 45min+ sessions) ──────────────────────────
function PeriodicQuiz({subject,topic,lang,onFinish}){
  const [questions,setQuestions]=useState(null);const [loading,setLoading]=useState(true);const [error,setError]=useState(null);
  const [qIdx,setQIdx]=useState(0);const [selected,setSelected]=useState(null);const [showAns,setShowAns]=useState(false);const [answers,setAnswers]=useState([]);const [finished,setFinished]=useState(false);
  const ln={de:"German",en:"English",it:"Italian",fr:"French"}[lang];
  useEffect(()=>{(async()=>{
    try{
      const res=await fetch("/api/gemini",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({system:"You are a quiz generator. Output ONLY valid raw JSON arrays. No markdown.",messages:[{role:"user",content:`Generate exactly 10 multiple-choice quiz questions about "${topic}" (subject: ${subject}) for students aged 13-15. Language: ${ln}. Return ONLY raw JSON: [{"q":"question","options":["A","B","C","D"],"answer":0}]`}],maxTokens:2500})});
      const data=await res.json();
      const raw=data.text||data.content?.map(c=>c.text||"").join("")||"";
      let parsed=null;
      try{parsed=JSON.parse(raw.trim());}catch{const s=raw.replace(/^```(?:json)?\s*/i,"").replace(/\s*```$/,"").trim();try{parsed=JSON.parse(s);}catch{const i=raw.indexOf("["),j=raw.lastIndexOf("]");if(i!==-1&&j>i)parsed=JSON.parse(raw.slice(i,j+1));else throw new Error("No JSON");}}
      const valid=parsed.filter(q=>q&&typeof q.q==="string"&&Array.isArray(q.options)&&q.options.length===4&&typeof q.answer==="number");
      if(valid.length<3)throw new Error("Too few questions");
      setQuestions(valid.slice(0,10));
    }catch(e){setError(e.message);}
    setLoading(false);
  })();},[]);
  const handle=i=>{if(showAns)return;setSelected(i);setShowAns(true);};
  const next=()=>{if(selected===null)return;const correct=selected===questions[qIdx].answer;const na=[...answers,correct];setAnswers(na);if(qIdx+1>=questions.length)setFinished(true);else{setQIdx(q=>q+1);setSelected(null);setShowAns(false);}};
  const colrs=["#7C3AED","#0EA5E9","#10B981","#F59E0B"];
  const getBg=i=>{if(!showAns)return selected===i?`${colrs[i]}22`:"rgba(255,255,255,0.04)";if(i===questions[qIdx].answer)return"rgba(16,185,129,0.22)";if(i===selected&&i!==questions[qIdx].answer)return"rgba(239,68,68,0.22)";return"rgba(255,255,255,0.03)";};
  const getBdr=i=>{if(!showAns)return`2px solid ${selected===i?colrs[i]:"rgba(255,255,255,0.09)"}`;if(i===questions[qIdx].answer)return"2px solid #10B981";if(i===selected&&i!==questions[qIdx].answer)return"2px solid #EF4444";return"2px solid rgba(255,255,255,0.05)";};
  if(loading)return<div style={{textAlign:"center",padding:36,color:"#aaa"}}><div style={{fontSize:32,animation:"spin 1s linear infinite",display:"inline-block"}}>⚡</div><div style={{marginTop:10,fontSize:14}}>Loading 15-min quiz…</div></div>;
  if(error)return<div style={{textAlign:"center",padding:24}}><div style={{color:"#FF6B6B",marginBottom:12}}>{error}</div><button onClick={()=>onFinish(0)} style={{padding:"11px 22px",borderRadius:12,background:"linear-gradient(135deg,#10B981,#059669)",color:"#fff",border:"none",fontWeight:"bold",cursor:"pointer"}}>Continue anyway</button></div>;
  if(finished){
    const correct=answers.filter(Boolean).length,pct=Math.round((correct/questions.length)*100);
    const bonus=pct===100?3:pct>=70?1:0;
    return(<div style={{textAlign:"center",padding:"20px 0"}}>
      <div style={{fontSize:46,marginBottom:8}}>{pct===100?"🏆":pct>=70?"🎉":"💪"}</div>
      <h3 style={{background:"linear-gradient(135deg,#7C3AED,#38BDF8)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",fontSize:20,margin:"0 0 6px"}}>⚡ 15-Min Quiz Done!</h3>
      <div style={{fontSize:46,fontWeight:900,color:"#FFD700",margin:"8px 0"}}>{pct}%</div>
      <div style={{fontSize:13,color:"#aaa",marginBottom:8}}>{correct}/10 correct</div>
      {bonus>0&&<div style={{display:"inline-block",background:"rgba(255,215,0,0.15)",border:"1px solid rgba(255,215,0,0.4)",borderRadius:12,padding:"8px 18px",marginBottom:12}}>
        <span style={{color:"#FFD700",fontWeight:900,fontSize:17}}>+{bonus} ⭐ Bonus!</span>
        <div style={{fontSize:11,color:"#888",marginTop:2}}>{pct===100?"Perfect! +3 ⭐":"≥70% → +1 ⭐"}</div>
      </div>}
      {answers.some((a,i)=>!a)&&<div style={{textAlign:"left",marginBottom:12}}>{questions.map((q,i)=>!answers[i]&&<div key={i} style={{fontSize:11,color:"#aaa",padding:"4px 9px",background:"rgba(255,80,80,0.08)",borderRadius:7,marginBottom:3}}>{q.q} → <span style={{color:"#10B981"}}>{q.options[q.answer]}</span></div>)}</div>}
      <button onClick={()=>onFinish(bonus)} style={{padding:"12px 28px",borderRadius:13,background:"linear-gradient(135deg,#7C3AED,#4C1D95)",color:"#fff",border:"none",fontWeight:"bold",cursor:"pointer",fontSize:15}}>▶ Keep Studying</button>
    </div>);
  }
  const q=questions[qIdx];
  return(<div style={{display:"flex",flexDirection:"column",gap:11}}>
    <div style={{textAlign:"center",marginBottom:4}}><span style={{background:"linear-gradient(135deg,#7C3AED,#38BDF8)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",fontWeight:900,fontSize:16}}>⚡ 15-Min Quiz  ≥70%=+1⭐  100%=+3⭐</span></div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:12,color:"#888"}}>{qIdx+1}/10</span><div style={{display:"flex",gap:3}}>{answers.map((a,i)=><div key={i} style={{width:8,height:8,borderRadius:"50%",background:a?"#10B981":"#EF4444"}}/>)}</div></div>
    <div style={{height:4,background:"rgba(255,255,255,0.07)",borderRadius:4}}><div style={{height:"100%",width:`${(qIdx/10)*100}%`,background:"linear-gradient(90deg,#7C3AED,#38BDF8)",borderRadius:4,transition:"width 0.4s"}}/></div>
    <div style={{background:"rgba(255,255,255,0.04)",borderRadius:14,border:"1px solid rgba(255,255,255,0.1)",padding:16}}>
      <p style={{fontSize:15,lineHeight:1.6,color:"#fff",margin:"0 0 13px",fontWeight:600}}>{q.q}</p>
      <div style={{display:"flex",flexDirection:"column",gap:7}}>{q.options.map((opt,i)=><button key={i} onClick={()=>handle(i)} style={{padding:"11px 14px",borderRadius:11,border:getBdr(i),background:getBg(i),color:"#fff",textAlign:"left",cursor:showAns?"default":"pointer",fontSize:13,display:"flex",alignItems:"center",gap:9,transition:"all 0.18s"}}>
        <span style={{width:25,height:25,borderRadius:"50%",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:"bold",fontSize:11,background:showAns&&i===q.answer?"#10B981":showAns&&i===selected&&i!==q.answer?"#EF4444":selected===i?colrs[i]:"rgba(255,255,255,0.1)"}}>{showAns&&i===q.answer?"✓":showAns&&i===selected&&i!==q.answer?"✗":["A","B","C","D"][i]}</span>{opt}
      </button>)}</div>
    </div>
    {showAns&&<button onClick={next} style={{padding:"12px",borderRadius:13,background:"linear-gradient(135deg,#7C3AED,#4C1D95)",color:"#fff",border:"none",fontWeight:"bold",cursor:"pointer",fontSize:14}}>{qIdx===9?"See Results →":"Next →"}</button>}
  </div>);
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [splash,setSplash]=useState(true);
  const [lang,setLang]=useState(()=>localStorage.getItem("sq_lang")||"de");
  const [username,setUsername]=useState(()=>localStorage.getItem("sq_activeUser")||null);
  const [usernameInput,setUsernameInput]=useState("");
  const [allUsers,setAllUsers]=useState(()=>JSON.parse(localStorage.getItem("sq_users")||"{}"));
  const [screen,setScreen]=useState("home");
  const [subjects,setSubjects]=useState(()=>{const s=localStorage.getItem("sq_subjects");return s?JSON.parse(s):DEFAULT_SUBJECTS;});
  const [sel,setSel]=useState(null);
  const [topic,setTopic]=useState(null);
  const [dur,setDur]=useState(null);
  const [activeTab,setActiveTab]=useState("learn");

  // Per-user data helpers
  const userKey=(u,k)=>`sq_user_${u}_${k}`;

  // ── Auto-clear history older than 24h ──
  const clearOldHistory=(u)=>{
    const key=`sq_user_${u}_history`;
    const raw=localStorage.getItem(key);
    if(!raw) return;
    try{
      const h=JSON.parse(raw);
      const cutoff=Date.now()-24*60*60*1000;
      const fresh=h.filter(entry=>entry.ts&&entry.ts>cutoff);
      // If no timestamps (old format), clear all
      if(h.length>0&&!h[0].ts){ localStorage.removeItem(key); return; }
      localStorage.setItem(key,JSON.stringify(fresh));
    }catch{}
  };

  const getUserData=(u)=>{
    clearOldHistory(u);
    return {
      points: parseFloat(localStorage.getItem(userKey(u,"points"))||"0"),
      history: JSON.parse(localStorage.getItem(userKey(u,"history"))||"[]"),
    };
  };
  const [points,setPoints]=useState(()=>username?getUserData(username).points:0);
  const [history,setHistory]=useState(()=>username?getUserData(username).history:[]);

  const [newName,setNewName]=useState(""); const [newIcon,setNewIcon]=useState("📚"); const [newColor,setNewColor]=useState("#7C3AED");
  const [toast,setToast]=useState(null);
  const [game,setGame]=useState(null);
  const [gameTimerDone,setGameTimerDone]=useState(false);
  const [gameTimerSecs,setGameTimerSecs]=useState(180);
  const [cancelModal,setCancelModal]=useState(false);
  const [chatHistory,setChatHistory]=useState([]);
  const [studySecs,setStudySecs]=useState(0);
  const [studyMidDone,setStudyMidDone]=useState(false);
  const [char,setChar]=useState(()=>{try{return JSON.parse(localStorage.getItem("sq_char")||"null");}catch{return null;}});
  const [loginStep,setLoginStep]=useState("name");
  const [periodicQuizActive,setPeriodicQuizActive]=useState(false);
  const [periodicCount,setPeriodicCount]=useState(0);
  const periodicRef=useRef({count:0});
  const t=T[lang];

  const setLangS=l=>{setLang(l);localStorage.setItem("sq_lang",l);};

  // Daily login bonus
  useEffect(()=>{
    if(!username)return;
    const key=userKey(username,"lastBonus");
    const last=localStorage.getItem(key);
    const today=new Date().toDateString();
    if(last!==today){
      localStorage.setItem(key,today);
      setTimeout(()=>{addPts(1);toast_("🎁 Daily Bonus! +1 ⭐","#FFD700");},800);
    }
  },[username]);

  // Clear old history on mount and every hour
  useEffect(()=>{
    const clean=()=>{
      Object.keys(localStorage).filter(k=>k.endsWith("_history")).forEach(k=>{
        try{
          const h=JSON.parse(localStorage.getItem(k)||"[]");
          const cutoff=Date.now()-24*60*60*1000;
          const fresh=h.filter(e=>e.ts&&e.ts>cutoff);
          if(fresh.length!==h.length){
            localStorage.setItem(k,JSON.stringify(fresh));
            if(username&&k===userKey(username,"history")) setHistory(fresh);
          }
        }catch{}
      });
    };
    clean();
    const iv=setInterval(clean,60*60*1000);
    return()=>clearInterval(iv);
  },[username]);

  const savePoints=(p)=>{
    setPoints(p);
    if(username) localStorage.setItem(userKey(username,"points"),p.toString());
  };
  const saveHistory=(h)=>{
    setHistory(h);
    if(username) localStorage.setItem(userKey(username,"history"),JSON.stringify(h));
  };
  const addPts=p=>{const np=parseFloat((points+p).toFixed(1));savePoints(np);};
  const addHist=entry=>{saveHistory([...history,{...entry,ts:Date.now()}]);};
  const toast_=(msg,color="#7C3AED")=>{setToast({msg,color});setTimeout(()=>setToast(null),3000);};
  const subName=s=>typeof s.name==="object"?(s.name[lang]||s.name.de||s.name.en):s.name;
  const go=s=>setScreen(s);

  const loginUser=(u)=>{
    const name=u.trim();
    if(!name) return;
    const existing=JSON.parse(localStorage.getItem("sq_users")||"{}");
    if(!existing[name]) existing[name]={created:new Date().toLocaleDateString()};
    localStorage.setItem("sq_users",JSON.stringify(existing));
    setAllUsers(existing);
    localStorage.setItem("sq_activeUser",name);
    setUsername(name);
    const data=getUserData(name);
    setPoints(data.points);
    setHistory(data.history);
    setUsernameInput("");
    setScreen("home");
  };

  const logoutUser=()=>{
    localStorage.removeItem("sq_activeUser");
    setUsername(null);
    setScreen("home");
    setPoints(0);
    setHistory([]);
  };

  // Start game session
  const startGame=(id)=>{
    setGame(id); setGameTimerDone(false); setGameTimerSecs(180);
  };

  // Abort confirm flow
  const tryAbort=()=>setCancelModal(true);
  const confirmAbort=()=>{setCancelModal(false);toast_(t.abortMsg,"#FF6B6B");go("home");};
  const cancelAbort=()=>setCancelModal(false);

  // Game timer effect
  useEffect(()=>{
    if(screen!=="game"||gameTimerDone||game===null) return;
    const iv=setInterval(()=>{
      setGameTimerSecs(s=>{
        if(s<=1){
          clearInterval(iv);
          setGameTimerDone(true);
          playTimerBell();
          // Play ringtone
          
          return 0;
        }
        return s-1;
      });
    },1000);
    return()=>clearInterval(iv);
  },[screen,game,gameTimerDone]);

    // ── Global study timer – keeps ticking even during midpoint/quiz screens ──
  const studyTickRef=useRef(null);
  useEffect(()=>{
    const active=["learning","midpoint"].includes(screen)&&dur&&dur.minutes>0;
    if(!active){ clearInterval(studyTickRef.current); return; }
    studyTickRef.current=setInterval(()=>{
      setStudySecs(s=>{
        const n=s-1;
        const half=Math.floor(dur.minutes*60/2);
        if(n===half&&!studyMidDone){
          setStudyMidDone(true);
          playTimerBell();
          go("midpoint");
        }
        // Periodic quiz every 15min for 45min+ sessions (skip midpoint moment)
        if(dur.minutes>=45&&n>0&&n!==half){
          const elapsed=dur.minutes*60-n;
          const quizEvery=15*60;
          const shouldFire=elapsed>0&&elapsed%quizEvery===0;
          if(shouldFire&&screen==="learning"){
            periodicRef.current.count++;
            setPeriodicCount(periodicRef.current.count);
            playTimerBell();
            setPeriodicQuizActive(true);
          }
        }
        if(n<=0){ clearInterval(studyTickRef.current); playTimerBell(); go("endpoint"); return 0; }
        return n;
      });
    },1000);
    return()=>clearInterval(studyTickRef.current);
  },[screen,dur]);

  const icons=["📚","🔢","🌍","🎨","🎵","💻","⚗️","🏃","🌿","🧠","📊","🏛️","🎭","🔭","⚽"];
  const colorOpts=["#7C3AED","#0EA5E9","#10B981","#F59E0B","#EC4899","#EF4444","#8B5CF6","#14B8A6"];
  const games=[
    {id:0,name:"🌌 Gravity Dash",desc:"Platformer · flip gravity · collect 💎"},
    {id:1,name:"🐍 Neon Snake",desc:"Grow your snake · dodge yourself · grab 💎"},
    {id:2,name:"🔮 Matrix Breaker",desc:"Breakout · power-ups · multi-ball · 💎"},
    {id:3,name:"🔐 Cipher Rush",desc:"Decode Caesar ciphers against the clock · 💎"},
    {id:4,name:"⚡ Reflex Grid",desc:"Tap glowing cells · build combos · grab 💎"},
  ];

  const glowGrad={background:"linear-gradient(135deg,#7C3AED,#38BDF8,#10B981)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"};
  const card={background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.09)",borderRadius:20,backdropFilter:"blur(12px)"};
  const btnPrimary={padding:"13px",borderRadius:14,background:"linear-gradient(135deg,#7C3AED,#4C1D95)",color:"#fff",border:"none",fontWeight:"bold",cursor:"pointer",fontSize:15,width:"100%"};
  const btnBack={padding:"7px 16px",borderRadius:10,border:"1px solid rgba(255,255,255,0.1)",background:"rgba(255,255,255,0.05)",color:"#aaa",cursor:"pointer",marginBottom:18,fontSize:13};

  const gm=Math.floor(gameTimerSecs/60), gs=gameTimerSecs%60;

  return(
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#06061a 0%,#0d0a2e 30%,#080f2a 60%,#06061a 100%)",color:"#fff",fontFamily:"'Outfit','Segoe UI',sans-serif",position:"relative",overflow:"hidden"}}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;900&display=swap" rel="stylesheet"/>
      {splash&&<SplashScreen onDone={()=>setSplash(false)}/>}

      {/* ── AMBIENT BLUE-PURPLE GLOWS ── */}
      <div style={{position:"fixed",top:-200,left:-100,width:600,height:600,borderRadius:"50%",background:"radial-gradient(circle,rgba(99,102,241,0.22) 0%,rgba(79,70,229,0.08) 50%,transparent 75%)",pointerEvents:"none",zIndex:0}}/>
      <div style={{position:"fixed",top:"20%",right:-150,width:500,height:500,borderRadius:"50%",background:"radial-gradient(circle,rgba(124,58,237,0.18) 0%,rgba(91,33,182,0.07) 50%,transparent 75%)",pointerEvents:"none",zIndex:0}}/>
      <div style={{position:"fixed",bottom:-150,left:"30%",width:550,height:550,borderRadius:"50%",background:"radial-gradient(circle,rgba(59,130,246,0.16) 0%,rgba(37,99,235,0.06) 50%,transparent 75%)",pointerEvents:"none",zIndex:0}}/>
      <div style={{position:"fixed",bottom:"20%",right:"10%",width:400,height:400,borderRadius:"50%",background:"radial-gradient(circle,rgba(139,92,246,0.14) 0%,transparent 70%)",pointerEvents:"none",zIndex:0}}/>

      {/* ── WAVE + KM BACKGROUND ── */}
      <svg style={{position:"fixed",inset:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:0}} viewBox="0 0 1000 700" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="waveG1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.35"/>
            <stop offset="50%" stopColor="#34D399" stopOpacity="0.25"/>
            <stop offset="100%" stopColor="#059669" stopOpacity="0.15"/>
          </linearGradient>
          <linearGradient id="waveG2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.20"/>
            <stop offset="100%" stopColor="#10B981" stopOpacity="0.28"/>
          </linearGradient>
          <linearGradient id="kmGreen" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#34D399"/>
            <stop offset="50%" stopColor="#10B981"/>
            <stop offset="100%" stopColor="#059669"/>
          </linearGradient>
        </defs>
        {/* Thick green wave lines – layer 1 */}
        {[0,1,2,3,4,5,6,7].map(i=>(
          <path key={`a${i}`}
            d={`M 0 ${80+i*82} Q 180 ${40+i*82} 380 ${90+i*82} Q 580 ${140+i*82} 750 ${85+i*82} Q 880 ${50+i*82} 1000 ${90+i*82}`}
            stroke="url(#waveG1)" strokeWidth={i%3===0?"5":i%3===1?"3.5":"4.5"} fill="none" opacity={0.85-i*0.06}/>
        ))}
        {/* Thick green wave lines – layer 2 offset */}
        {[0,1,2,3,4,5].map(i=>(
          <path key={`b${i}`}
            d={`M 0 ${180+i*95} Q 250 ${220+i*95} 500 ${175+i*95} Q 720 ${130+i*95} 1000 ${180+i*95}`}
            stroke="url(#waveG2)" strokeWidth={i%2===0?"4":"5"} fill="none" opacity={0.75-i*0.07}/>
        ))}
        {/* Extra bold accent waves */}
        {[0,1,2].map(i=>(
          <path key={`c${i}`}
            d={`M 0 ${320+i*140} Q 300 ${280+i*140} 600 ${340+i*140} Q 800 ${380+i*140} 1000 ${320+i*140}`}
            stroke="#10B981" strokeWidth="6" fill="none" opacity={0.28-i*0.06}/>
        ))}
        {/* BIG K.M in center – full green */}
        <text x="500" y="420" textAnchor="middle" fontFamily="'Outfit',sans-serif" fontWeight="900" fontSize="310" opacity="0.07" letterSpacing="8">
          <tspan fill="url(#kmGreen)">K.M</tspan>
        </text>
      </svg>

      {toast&&<div style={{position:"fixed",top:20,left:"50%",transform:"translateX(-50%)",background:toast.color,color:"#fff",padding:"11px 24px",borderRadius:14,fontWeight:"bold",zIndex:9999,fontSize:15,boxShadow:`0 8px 30px ${toast.color}66`,animation:"slideDown 0.3s ease",whiteSpace:"nowrap"}}>{toast.msg}</div>}

      {/* ── MUSIC BUTTON (bottom-left, out of the way) ── */}
      <MusicButton/>

      {/* ── PERIODIC QUIZ OVERLAY (every 15min for 45min+ sessions) ── */}
      {periodicQuizActive&&username&&sel&&topic&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",zIndex:8500,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(8px)"}}>
          <div style={{background:"linear-gradient(135deg,#0d0d28,#0a1528)",border:"1px solid rgba(124,58,237,0.5)",borderRadius:22,padding:24,maxWidth:560,width:"94%",maxHeight:"88vh",overflowY:"auto",boxShadow:"0 0 60px rgba(124,58,237,0.3)"}}>
            <div style={{textAlign:"center",marginBottom:4}}><span style={{fontSize:13,color:"#a78bfa",fontWeight:700}}>⚡ 15-MIN CHECK #{periodicCount}</span></div>
            <div style={{fontSize:11,color:"#555",textAlign:"center",marginBottom:14}}>≥70% = +1 ⭐ · 100% = +3 ⭐</div>
            <PeriodicQuiz subject={subName(sel)} topic={topic} lang={lang} onFinish={bonus=>{setPeriodicQuizActive(false);if(bonus>0){addPts(bonus);toast_(`⚡ +${bonus} ⭐ Bonus!`,"#FFD700");}}}/>
          </div>
        </div>
      )}

      {/* ── CANCEL MODAL ── */}
      {cancelModal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",zIndex:8000,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(6px)"}}>
          <div style={{background:"#111128",border:"1px solid rgba(239,68,68,0.4)",borderRadius:20,padding:28,maxWidth:320,width:"90%",textAlign:"center",boxShadow:"0 20px 60px rgba(0,0,0,0.6)"}}>
            <div style={{fontSize:44,marginBottom:10}}>⚠️</div>
            <h3 style={{margin:"0 0 6px",fontSize:18,color:"#fff"}}>{t.cancelConfirm}</h3>
            <p style={{color:"#888",fontSize:13,margin:"0 0 20px"}}>Du verlierst deine Punkte für diese Einheit.</p>
            <div style={{display:"flex",gap:10}}>
              <button onClick={cancelAbort} style={{flex:1,padding:"12px",borderRadius:12,border:"1px solid rgba(255,255,255,0.15)",background:"rgba(255,255,255,0.07)",color:"#fff",cursor:"pointer",fontWeight:"bold",fontSize:14}}>{t.cancelNo}</button>
              <button onClick={confirmAbort} style={{flex:1,padding:"12px",borderRadius:12,border:"none",background:"linear-gradient(135deg,#EF4444,#DC2626)",color:"#fff",cursor:"pointer",fontWeight:"bold",fontSize:14}}>{t.cancelYes}</button>
            </div>
          </div>
        </div>
      )}

      <div style={{maxWidth:720,margin:"0 auto",padding:"20px 16px",position:"relative",zIndex:1,animation:"fadeUp 0.4s ease"}}>

        {/* ── LOGIN SCREEN ── */}
        {!username&&(
          <div style={{minHeight:"80vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:0}}>
            {/* Lang switcher on login */}
            <div style={{display:"flex",gap:6,marginBottom:28}}>
              {["de","en","it","fr"].map(l=><button key={l} onClick={()=>setLangS(l)} style={{padding:"6px 12px",borderRadius:8,border:`1px solid ${lang===l?"#7C3AED":"rgba(255,255,255,0.1)"}`,background:lang===l?"rgba(124,58,237,0.25)":"transparent",color:lang===l?"#a78bfa":"#666",cursor:"pointer",fontSize:12,fontWeight:lang===l?"bold":"normal"}}>{l.toUpperCase()}</button>)}
            </div>
            <div style={{fontSize:56,marginBottom:8}}>🦁</div>
            <h1 style={{background:"linear-gradient(135deg,#7C3AED,#38BDF8,#10B981)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",margin:"0 0 12px",fontSize:32,fontWeight:900,textAlign:"center",lineHeight:1.3,paddingBottom:4}}>{t.loginTitle}</h1>
            <p style={{color:"#555",fontSize:14,margin:"0 0 28px",textAlign:"center"}}>{t.loginSubtitle}</p>

            {/* Existing users */}
            {Object.keys(allUsers).length>0&&(
              <div style={{width:"100%",maxWidth:360,marginBottom:20}}>
                <div style={{fontSize:12,color:"#666",marginBottom:8,textAlign:"center"}}>{t.loginExisting}</div>
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {Object.keys(allUsers).map(u=>(
                    <div key={u} style={{display:"flex",gap:6,alignItems:"stretch"}}>
                      <button onClick={()=>loginUser(u)} style={{flex:1,display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 14px",borderRadius:13,border:"1px solid rgba(124,58,237,0.3)",background:"rgba(124,58,237,0.08)",color:"#fff",cursor:"pointer",transition:"all 0.15s"}}
                        onMouseEnter={e=>{e.currentTarget.style.background="rgba(124,58,237,0.2)";e.currentTarget.style.borderColor="#7C3AED";}}
                        onMouseLeave={e=>{e.currentTarget.style.background="rgba(124,58,237,0.08)";e.currentTarget.style.borderColor="rgba(124,58,237,0.3)";}}>
                        <div style={{display:"flex",alignItems:"center",gap:10}}>
                          <span style={{fontSize:22}}>👤</span>
                          <div>
                            <div style={{fontWeight:700,fontSize:14}}>{u}</div>
                            <div style={{fontSize:11,color:"#888"}}>{parseFloat(localStorage.getItem(`sq_user_${u}_points`)||"0")} ⭐ · {JSON.parse(localStorage.getItem(`sq_user_${u}_history`)||"[]").length} Sessions</div>
                          </div>
                        </div>
                        <span style={{color:"#a78bfa",fontSize:12,fontWeight:600}}>{t.loginContinue} →</span>
                      </button>
                      <button onClick={()=>{const ex=JSON.parse(localStorage.getItem("sq_users")||"{}");delete ex[u];localStorage.setItem("sq_users",JSON.stringify(ex));["points","history","lastBonus"].forEach(k=>localStorage.removeItem(`sq_user_${u}_${k}`));["gravity","snake","breaker","cipher","reflex"].forEach(gid=>localStorage.removeItem(`sq_game_${u}_${gid}_scores`));setAllUsers({...ex});if(username===u)logoutUser();}} style={{padding:"11px 12px",borderRadius:11,border:"1px solid rgba(239,68,68,0.35)",background:"rgba(239,68,68,0.1)",color:"#EF4444",cursor:"pointer",fontSize:16,fontWeight:"bold",flexShrink:0}} title="Delete account">🗑️</button>
                    </div>
                  ))}
                </div>
                <div style={{textAlign:"center",color:"#444",fontSize:12,margin:"14px 0 6px"}}>{t.loginOr}</div>
              </div>
            )}

            {/* New user input */}
            <div style={{width:"100%",maxWidth:360}}>
              <div style={{fontSize:12,color:"#666",marginBottom:8,textAlign:"center"}}>{t.loginCreate}</div>
              {loginStep==="name"&&<div style={{display:"flex",gap:8}}>
                <input
                  value={usernameInput}
                  onChange={e=>setUsernameInput(e.target.value)}
                  onKeyDown={e=>e.key==="Enter"&&usernameInput.trim()&&loginUser(usernameInput)}
                  placeholder={t.loginPlaceholder}
                  maxLength={20}
                  style={{flex:1,background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:12,padding:"13px 16px",color:"#fff",fontSize:15,outline:"none"}}
                />
                <button onClick={()=>usernameInput.trim()&&loginUser(usernameInput)} disabled={!usernameInput.trim()} style={{padding:"13px 18px",borderRadius:12,background:usernameInput.trim()?"linear-gradient(135deg,#7C3AED,#4C1D95)":"rgba(255,255,255,0.07)",color:usernameInput.trim()?"#fff":"#555",border:"none",fontWeight:"bold",cursor:usernameInput.trim()?"pointer":"default",fontSize:15,whiteSpace:"nowrap"}}>
                  →
                </button>
              </div>}
            </div>
          </div>
        )}

        {/* ── GAME SELECT ── */}
        {username&&screen==="game"&&game===null&&(
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            <button onClick={()=>go("home")} style={btnBack}>{t.back}</button>
            <h2 style={{...glowGrad,margin:"0 0 4px",fontSize:22}}>{t.gamesTitle}</h2>
            <p style={{color:"#555",fontSize:13,margin:"0 0 16px"}}>{t.selectGame}</p>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {games.map(g=>(
                <button key={g.id} onClick={()=>startGame(g.id)} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(124,58,237,0.25)",borderRadius:16,padding:"18px 20px",cursor:"pointer",color:"#fff",display:"flex",justifyContent:"space-between",alignItems:"center",transition:"all 0.15s"}}
                  onMouseEnter={e=>{e.currentTarget.style.background="rgba(124,58,237,0.15)";e.currentTarget.style.borderColor="#7C3AED";}}
                  onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.04)";e.currentTarget.style.borderColor="rgba(124,58,237,0.25)";}}>
                  <div>
                    <div style={{fontWeight:700,fontSize:17}}>{g.name}</div>
                    <div style={{fontSize:12,color:"#888",marginTop:2}}>{g.desc}</div>
                  </div>
                  <div style={{fontSize:12,color:"#FFD700",background:"rgba(255,215,0,0.1)",border:"1px solid rgba(255,215,0,0.25)",borderRadius:8,padding:"4px 10px"}}>⏱ 3 min</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── GAME PLAYING ── */}
        {username&&screen==="game"&&game!==null&&(
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div style={{...card,padding:"10px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:14,color:"#888"}}>{t.gameTimer}:</span>
                <span style={{fontFamily:"monospace",fontWeight:"bold",fontSize:18,color:gameTimerSecs<=30?"#EF4444":"#FFD700"}}>{String(gm).padStart(2,"0")}:{String(gs).padStart(2,"0")}</span>
              </div>
              <div style={{flex:1,margin:"0 14px",height:6,background:"rgba(255,255,255,0.08)",borderRadius:4,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${(gameTimerSecs/180)*100}%`,background:gameTimerSecs<=30?"#EF4444":"linear-gradient(90deg,#7C3AED,#38BDF8)",borderRadius:4,transition:"width 1s linear"}}/>
              </div>
              <button onClick={()=>{setGame(null);go("home");}} style={{padding:"5px 12px",borderRadius:8,border:"1px solid rgba(255,100,100,0.3)",background:"rgba(255,80,80,0.12)",color:"#FF6B6B",cursor:"pointer",fontSize:12,fontWeight:"bold"}}>{t.exitGame}</button>
            </div>
            {gameTimerDone&&(
              <div style={{...card,padding:28,textAlign:"center",border:"1px solid rgba(255,215,0,0.3)",background:"rgba(255,215,0,0.06)"}}>
                <div style={{fontSize:44,marginBottom:8}}>⏰</div>
                <h3 style={{color:"#FFD700",margin:"0 0 8px",fontSize:18}}>{t.gameTimerDone}</h3>
                {points>=1
                  ?<><p style={{color:"#888",fontSize:13,margin:"0 0 14px"}}>{t.needStar.replace("1","") /* reuse translated string */}</p>
                    <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
                      <button onClick={()=>{addPts(-1);setGame(null);go("game");}} style={{padding:"10px 20px",borderRadius:12,background:"linear-gradient(135deg,#FFD700,#F59E0B)",color:"#000",border:"none",fontWeight:"bold",cursor:"pointer",fontSize:13}}>{t.playAgain}</button>
                      <button onClick={()=>{setGame(null);go("home");}} style={{padding:"10px 20px",borderRadius:12,border:"1px solid rgba(255,255,255,0.15)",background:"rgba(255,255,255,0.07)",color:"#fff",cursor:"pointer",fontWeight:"bold",fontSize:13}}>{t.home}</button>
                    </div></>
                  :<><p style={{color:"#FF6B6B",fontSize:14,margin:"0 0 16px",fontWeight:"bold"}}>{t.needStar}</p>
                    <p style={{color:"#555",fontSize:12,margin:"0 0 16px"}}>{lang==="de"?"Lerne mehr um Sterne zu verdienen!":lang==="en"?"Study more to earn stars!":lang==="it"?"Studia di più per guadagnare stelle!":"Étudie plus pour gagner des étoiles!"}</p>
                    <button onClick={()=>{setGame(null);go("home");}} style={{padding:"10px 24px",borderRadius:12,background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.15)",color:"#fff",cursor:"pointer",fontWeight:"bold",fontSize:13}}>{t.home}</button>
                  </>
                }
              </div>
            )}
            {!gameTimerDone&&game===0&&<GravityDash onExit={()=>{setGame(null);go("home");}} lang={lang} char={char} username={username}/>}
            {!gameTimerDone&&game===1&&<NeonSnake onExit={()=>{setGame(null);go("home");}} lang={lang} char={char} username={username}/>}
            {!gameTimerDone&&game===2&&<MatrixBreaker onExit={()=>{setGame(null);go("home");}} lang={lang} char={char} username={username}/>}
            {!gameTimerDone&&game===3&&<CipherRush onExit={()=>{setGame(null);go("home");}} lang={lang} char={char} username={username}/>}
            {!gameTimerDone&&game===4&&<ReflexGrid onExit={()=>{setGame(null);go("home");}} lang={lang} char={char} username={username}/>}
          </div>
        )}

        {/* ── HOME ── */}
        {username&&screen==="home"&&<>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              {char&&<CharAvatarCanvas char={char} size={56}/>}
              <div>
                <h1 style={{...glowGrad,margin:0,fontSize:28,fontWeight:900,letterSpacing:-1}}>{t.appName}</h1>
                <div style={{display:"flex",alignItems:"center",gap:7,marginTop:3}}>
                  <span style={{fontSize:13,color:"#a78bfa",fontWeight:600}}>{username}</span>
                  <button onClick={logoutUser} style={{fontSize:10,color:"#444",background:"none",border:"none",cursor:"pointer",textDecoration:"underline",padding:0}}>{t.switchUser}</button>
                </div>
              </div>
            </div>
            <div style={{display:"flex",gap:5,alignItems:"center"}}>
              {["de","en","it","fr"].map(l=><button key={l} onClick={()=>setLangS(l)} style={{padding:"5px 9px",borderRadius:8,border:`1px solid ${lang===l?"#7C3AED":"rgba(255,255,255,0.07)"}`,background:lang===l?"rgba(124,58,237,0.25)":"transparent",color:lang===l?"#a78bfa":"#666",cursor:"pointer",fontSize:11,fontWeight:lang===l?"bold":"normal"}}>{l.toUpperCase()}</button>)}
            </div>
          </div>
          {/* Points */}
          <div style={{...card,padding:18,marginBottom:18,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div><div style={{fontSize:11,color:"#444",marginBottom:1}}>{t.myPoints}</div><div style={{fontSize:40,fontWeight:900,color:"#FFD700",lineHeight:1}}>{points} <span style={{fontSize:20}}>⭐</span></div></div>
            <button onClick={()=>{if(points<1){toast_(t.needStar,"#FF6B6B");return;}addPts(-1);setGame(null);go("game");}} style={{padding:"10px 18px",borderRadius:12,background:points>=1?"linear-gradient(135deg,#FFD700,#F59E0B)":"rgba(255,255,255,0.07)",color:points>=1?"#000":"#444",border:"none",fontWeight:"bold",cursor:points>=1?"pointer":"default",fontSize:13}}>🎮 {t.play}<div style={{fontSize:10,fontWeight:"normal",opacity:0.7}}>{t.playCost}</div></button>
          </div>
          {/* Subjects */}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <h2 style={{margin:0,fontSize:15,fontWeight:700,color:"#bbb"}}>{t.subjects}</h2>
            <button onClick={()=>go("addSubject")} style={{padding:"5px 13px",borderRadius:9,border:"1px solid rgba(124,58,237,0.4)",background:"rgba(124,58,237,0.12)",color:"#a78bfa",cursor:"pointer",fontSize:12,fontWeight:600}}>{t.addSubject}</button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:9,marginBottom:24}}>
            {subjects.map(s=><button key={s.id} onClick={()=>{setSel(s);setTopic(null);go("topic");}} style={{background:`linear-gradient(135deg,${s.color}18,${s.color}0c)`,border:`1px solid ${s.color}30`,borderRadius:16,padding:"16px 13px",cursor:"pointer",color:"#fff",textAlign:"left",transition:"transform 0.15s,border-color 0.15s,box-shadow 0.15s"}}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.borderColor=s.color;e.currentTarget.style.boxShadow=`0 8px 24px ${s.color}30`;}}
              onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.borderColor=`${s.color}30`;e.currentTarget.style.boxShadow="";}}>
              <div style={{fontSize:26,marginBottom:7}}>{s.icon}</div>
              <div style={{fontWeight:700,fontSize:12,lineHeight:1.3}}>{subName(s)}</div>
            </button>)}
          </div>
          {history.length>0&&<><h2 style={{margin:"0 0 10px",fontSize:15,fontWeight:700,color:"#bbb"}}>{t.history}</h2>
          <div style={{...card,padding:12}}>
            {history.slice(-5).reverse().map((h,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:i<Math.min(history.length,5)-1?"1px solid rgba(255,255,255,0.05)":"none",fontSize:12.5}}>
              <span style={{color:"#999"}}>{h.subject}{h.topic?" · "+h.topic:""} · {h.dur}</span>
              <span style={{color:"#FFD700",fontWeight:"bold"}}>+{h.pts} ⭐</span>
            </div>)}
          </div></>}
        </>}

        {/* ── TOPIC PICKER ── */}
        {username&&screen==="topic"&&sel&&<>
          <button onClick={()=>go("home")} style={btnBack}>{t.back}</button>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
            <span style={{fontSize:36}}>{sel.icon}</span>
            <div><h2 style={{...glowGrad,fontSize:22,margin:0,fontWeight:900}}>{subName(sel)}</h2><p style={{color:"#555",margin:"3px 0 0",fontSize:13}}>{t.chooseTopic}</p></div>
          </div>
          <div style={{...card,padding:20,marginBottom:14}}>
            <TopicPicker subject={sel} lang={lang} onSelect={tp=>{setTopic(tp);go("duration");}}/>
          </div>
        </>}

        {/* ── DURATION ── */}
        {username&&screen==="duration"&&sel&&topic&&<>
          <button onClick={()=>go("topic")} style={btnBack}>{t.back}</button>
          <div style={{textAlign:"center",marginBottom:22}}>
            <div style={{fontSize:42,marginBottom:6}}>{sel.icon}</div>
            <h2 style={{...glowGrad,fontSize:22,margin:"0 0 2px",fontWeight:900}}>{subName(sel)}</h2>
            <div style={{color:"#7C3AED",fontWeight:700,fontSize:14,marginBottom:4}}>📌 {topic}</div>
            <p style={{color:"#555",margin:0,fontSize:13}}>{t.howLong}</p>
          </div>
          {/* Tabs */}
          <div style={{display:"flex",gap:8,marginBottom:14}}>
            {["learn","quiz"].map(tab=><button key={tab} onClick={()=>setActiveTab(tab)} style={{flex:1,padding:"10px",borderRadius:12,border:`1px solid ${activeTab===tab?"#7C3AED":"rgba(255,255,255,0.08)"}`,background:activeTab===tab?"rgba(124,58,237,0.2)":"rgba(255,255,255,0.04)",color:activeTab===tab?"#a78bfa":"#666",fontWeight:activeTab===tab?"bold":"normal",cursor:"pointer",fontSize:13}}>
              {tab==="learn"?t.learnTab:t.quizBtn}
            </button>)}
          </div>
          {activeTab==="learn"&&<div style={{display:"flex",flexDirection:"column",gap:8}}>
            {DURATIONS.map(d=><button key={d.key} onClick={()=>{setDur(d);go("summary");}} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.09)",borderRadius:14,padding:"14px 16px",cursor:"pointer",color:"#fff",display:"flex",justifyContent:"space-between",alignItems:"center",transition:"all 0.15s"}}
              onMouseEnter={e=>{e.currentTarget.style.background=`${sel.color}18`;e.currentTarget.style.borderColor=sel.color;}}
              onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.04)";e.currentTarget.style.borderColor="rgba(255,255,255,0.09)";}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:20}}>{d.icon}</span><div><span style={{fontWeight:600,fontSize:14}}>{t[d.key]}</span>{d.minutes>=45&&<div style={{fontSize:10,color:"#a78bfa",marginTop:1}}>⚡ Quiz every 15 min · 25-Q final</div>}</div></div>
              <div style={{color:"#FFD700",fontWeight:"bold"}}>+{d.points} ⭐</div>
            </button>)}
          </div>}
          {activeTab==="quiz"&&<>
            <div style={{...card,padding:18,marginBottom:12,textAlign:"center"}}>
              <div style={{fontSize:38,marginBottom:6}}>🧠</div>
              <h3 style={{margin:"0 0 4px",fontSize:16}}>{t.quizTitle}: {topic}</h3>
              <p style={{color:"#555",fontSize:12,margin:0}}>20 Fragen · ≥50% = +1⭐ · ≥75% = +2⭐ · 100% = +3⭐</p>
            </div>
            <button onClick={()=>go("quiz")} style={btnPrimary}>{t.quizBtn}</button>
          </>}
        </>}

        {/* ── QUIZ ── */}
        {username&&screen==="quiz"&&sel&&topic&&<>
          <button onClick={()=>go("duration")} style={btnBack}>{t.back}</button>
          <h2 style={{...glowGrad,fontSize:18,marginBottom:14}}>{t.quizTitle} – {topic}</h2>
          <QuizSection topic={topic} subject={subName(sel)} lang={lang} onDone={pts=>{if(pts>0){addPts(pts);addHist({subject:subName(sel),topic,dur:"Quiz",pts,date:new Date().toLocaleDateString()});toast_(`+${pts} ⭐`,"#10B981");}go("done");}}/>
        </>}

        {/* ── SUMMARY (with required answer) ── */}
        {username&&screen==="summary"&&sel&&topic&&dur&&<>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <div><h2 style={{margin:0,fontSize:16,fontWeight:700}}>{sel.icon} {subName(sel)}</h2><div style={{color:"#7C3AED",fontSize:13,fontWeight:600}}>📌 {topic}</div></div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{color:"#FFD700",fontSize:13,fontWeight:"bold"}}>+{dur.points} ⭐</div>
              <button onClick={tryAbort} style={{padding:"5px 11px",borderRadius:8,border:"1px solid rgba(255,80,80,0.3)",background:"rgba(255,80,80,0.1)",color:"#FF6B6B",cursor:"pointer",fontSize:11,fontWeight:"bold"}}>✕</button>
            </div>
          </div>
          <SummaryBot subject={subName(sel)} topic={topic} lang={lang} duration={dur}
            onDone={()=>{if(dur.minutes===0){addPts(dur.points);addHist({subject:subName(sel),topic,dur:t[dur.key],pts:dur.points,date:new Date().toLocaleDateString()});toast_(`+${dur.points} ⭐`,"#10B981");go("done");}else{setChatHistory([]);setStudySecs(dur.minutes*60);setStudyMidDone(false);periodicRef.current={count:0};setPeriodicCount(0);setPeriodicQuizActive(false);go("learning");}}}/>
        </>}

        {/* ── LEARNING ── */}
        {username&&screen==="learning"&&sel&&topic&&dur&&<>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <div>
              <div style={{fontSize:13,color:"#a78bfa",fontWeight:700}}>{sel.icon} {subName(sel)} · {topic}</div>
              <div style={{fontSize:11,color:"#555",marginTop:2}}>+{dur.points} ⭐ bei Abschluss</div>
            </div>
            <button onClick={tryAbort} style={{padding:"5px 11px",borderRadius:8,border:"1px solid rgba(255,80,80,0.3)",background:"rgba(255,80,80,0.1)",color:"#FF6B6B",cursor:"pointer",fontSize:11,fontWeight:"bold"}}>✕ {t.abort}</button>
          </div>

          {/* Big centered timer */}
          <div style={{display:"flex",justifyContent:"center",marginBottom:16}}>
            <StudyTimer duration={dur} secs={studySecs} onAbort={tryAbort} lang={lang} midDone={studyMidDone} periodicCount={periodicCount}/>
          </div>

          {/* Chatbot below timer */}
          <div style={{...card,height:380,display:"flex",flexDirection:"column",overflow:"hidden"}}>
            <div style={{padding:"10px 14px",borderBottom:"1px solid rgba(255,255,255,0.07)",fontSize:12,color:"#888",display:"flex",alignItems:"center",gap:6}}>
              💬 <span>{lang==="de"?"Frag den Chatbot – er hilft dir beim Lernen!":lang==="en"?"Ask the chatbot – it helps you learn!":lang==="it"?"Chiedi al chatbot – ti aiuta a studiare!":"Demande au chatbot – il t'aide à apprendre!"}</span>
            </div>
            <ChatHelper subject={subName(sel)} topic={topic} lang={lang} phase="chat" onMessagesChange={msgs=>setChatHistory(msgs)}/>
          </div>
        </>}

        {/* ── MIDPOINT ── */}
        {username&&screen==="midpoint"&&sel&&topic&&<>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <h2 style={{...glowGrad,fontSize:20,margin:0}}>{t.midCheck}</h2>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{fontFamily:"monospace",fontSize:14,color:studySecs<=60?"#EF4444":"#FFD700",fontWeight:"bold",background:"rgba(0,0,0,0.3)",padding:"4px 10px",borderRadius:8,border:`1px solid ${studySecs<=60?"rgba(239,68,68,0.4)":"rgba(255,215,0,0.3)"}`}}>
                ⏱ {String(Math.floor(studySecs/60)).padStart(2,"0")}:{String(studySecs%60).padStart(2,"0")}
              </div>
              <button onClick={tryAbort} style={{padding:"5px 11px",borderRadius:8,border:"1px solid rgba(255,80,80,0.3)",background:"rgba(255,80,80,0.1)",color:"#FF6B6B",cursor:"pointer",fontSize:11,fontWeight:"bold"}}>✕ {t.abort}</button>
            </div>
          </div>
          <MidpointQuiz subject={subName(sel)} topic={topic} lang={lang} chatHistory={chatHistory} onContinue={(bonus)=>{if(bonus>0){addPts(bonus);toast_(`⭐ +${bonus} Bonus!`,"#FFD700");}setChatHistory([]);go("learning");}}/>
        </>}

        {/* ── ENDPOINT: FINAL QUIZ ── */}
        {username&&screen==="endpoint"&&sel&&topic&&dur&&<>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <div>
              <h2 style={{...glowGrad,fontSize:20,margin:0}}>🏁 {lang==="de"?"Abschluss-Quiz":lang==="en"?"Final Quiz":lang==="it"?"Quiz Finale":"Quiz Final"}</h2>
              <div style={{fontSize:12,color:"#555",marginTop:2}}>{dur.minutes>=45?"25 Questions – ≥50%=+1⭐ · ≥70%=+3⭐ · 100%=+5⭐":"20 Questions – ≥50%=+1⭐ · ≥70%=+2⭐ · 100%=+3⭐"}</div>
            </div>
            <div style={{color:"#FFD700",fontWeight:"bold",fontSize:13}}>+{dur.points} ⭐</div>
          </div>
          <FinalQuiz
            topic={topic} subject={subName(sel)} lang={lang} extended={dur.minutes>=45}
            onDone={(bonus)=>{
              const total=dur.points+(bonus||0);
              addPts(total);
              addHist({subject:subName(sel),topic,dur:t[dur.key],pts:total,date:new Date().toLocaleDateString()});
              toast_(`🏆 +${total} ⭐${bonus>0?` (inkl. +${bonus} Bonus!)`:""}`,bonus>0?"#FFD700":"#10B981");
              go("done");
            }}
          />
        </>}

        {/* ── DONE ── */}
        {username&&screen==="done"&&<div style={{textAlign:"center",padding:"44px 0"}}>
          <div style={{fontSize:60,marginBottom:12}}>🎉</div>
          <h2 style={{...glowGrad,fontSize:30,marginBottom:6,fontWeight:900}}>{t.great}</h2>
          <p style={{color:"#444",marginBottom:22,fontSize:14}}>{dur?.points||0} {t.earnedPoints}</p>
          <div style={{...card,padding:22,marginBottom:24,display:"inline-block",minWidth:160}}>
            <div style={{fontSize:48,color:"#FFD700",fontWeight:900}}>{points} ⭐</div>
            <div style={{color:"#444",fontSize:12,marginTop:2}}>{t.totalPoints}</div>
          </div>
          <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
            <button onClick={()=>go("home")} style={{padding:"11px 22px",borderRadius:12,background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",color:"#fff",cursor:"pointer",fontWeight:"bold",fontSize:13}}>{t.home}</button>
            {points>=1&&<button onClick={()=>{addPts(-1);setGame(null);go("game");}} style={{padding:"11px 22px",borderRadius:12,background:"linear-gradient(135deg,#FFD700,#F59E0B)",color:"#000",border:"none",fontWeight:"bold",cursor:"pointer",fontSize:13}}>{t.playNow}</button>}
          </div>
        </div>}

        {/* ── ADD SUBJECT ── */}
        {username&&screen==="addSubject"&&<>
          <button onClick={()=>go("home")} style={btnBack}>{t.back}</button>
          <h2 style={{...glowGrad,fontSize:22,marginBottom:18}}>{t.addSubject}</h2>
          <div style={{...card,padding:22,display:"flex",flexDirection:"column",gap:16}}>
            <div><label style={{fontSize:12,color:"#555",display:"block",marginBottom:5}}>{t.subjectName}</label>
              <input value={newName} onChange={e=>setNewName(e.target.value)} placeholder="z.B. Physik…" style={{width:"100%",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.11)",borderRadius:11,padding:"11px 13px",color:"#fff",fontSize:14.5,outline:"none"}}/></div>
            <div><label style={{fontSize:12,color:"#555",display:"block",marginBottom:7}}>{t.chooseIcon}</label>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>{icons.map(ic=><button key={ic} onClick={()=>setNewIcon(ic)} style={{width:38,height:38,borderRadius:9,border:newIcon===ic?"2px solid #7C3AED":"1px solid rgba(255,255,255,0.1)",background:newIcon===ic?"rgba(124,58,237,0.3)":"rgba(255,255,255,0.05)",fontSize:18,cursor:"pointer"}}>{ic}</button>)}</div></div>
            <div><label style={{fontSize:12,color:"#555",display:"block",marginBottom:7}}>{t.chooseColor}</label>
              <div style={{display:"flex",gap:7}}>{colorOpts.map(c=><button key={c} onClick={()=>setNewColor(c)} style={{width:32,height:32,borderRadius:"50%",background:c,border:newColor===c?"3px solid #fff":"2px solid transparent",cursor:"pointer"}}/>)}</div></div>
            <div style={{display:"flex",alignItems:"center",gap:10,padding:12,background:`${newColor}12`,borderRadius:11,border:`1px solid ${newColor}30`}}>
              <span style={{fontSize:26}}>{newIcon}</span><span style={{fontWeight:700,fontSize:14}}>{newName||t.preview}</span></div>
            <button onClick={()=>{if(!newName.trim())return;const ns={id:`c_${Date.now()}`,name:newName,icon:newIcon,color:newColor};const u=[...subjects,ns];setSubjects(u);localStorage.setItem("sq_subjects",JSON.stringify(u));toast_(`✅ "${newName}" hinzugefügt`,"#10B981");setNewName("");go("home");}} style={btnPrimary}>{t.addBtn}</button>
          </div>
        </>}

      </div>    </div>
  );
}
