/* One MP3 per reading step. Artwork, text and CSS bubbles stay separate. */
(() => {
  "use strict";
  const album = window.BD_ALBUM, $ = s => document.querySelector(s);
  const state = {pageIndex:0, step:0, complete:false, auto:false, audioEnabled:false};
  const pad = n => String(n).padStart(2,"0");
  let story, steps, timer = null;
  const player=document.createElement("audio");
  player.id="voicePlayer";player.preload="auto";player.hidden=true;
  document.body.append(player);
  let playbackToken=0, loadedKey=null;
  function audioStatus(status){
    player.dataset.status=status;
    $("#autoPlay").setAttribute("aria-pressed",String(state.auto));
    $("#autoPlay").textContent=status==="error"?"↻ Réessayer la voix":state.auto?"Ⅱ Pause":"▷ Lecture auto";
  }
  function pauseAudio(){
    playbackToken++;cancelTimer();player.pause();
    if(loadedKey)audioStatus("paused");
  }
  function resetAudio(){
    pauseAudio();loadedKey=null;
    player.removeAttribute("src");player.load();audioStatus("idle");
  }
  function playCurrent(){
    if(!state.audioEnabled||state.complete||document.hidden)return;
    const current=steps[state.step],key=current.id;
    if(loadedKey!==key){
      player.src=current.audio;loadedKey=key;player.dataset.layer=key;
      player.dataset.voice=current.performerId;player.dataset.role=current.voiceId;
    }else if(player.error||player.dataset.status==="error"){player.load()}
    else if(player.ended){player.currentTime=0}
    if(!player.paused)return;
    const token=++playbackToken;
    audioStatus("loading");
    player.play().then(()=>{
      if(token===playbackToken)audioStatus("playing");
    }).catch(()=>{
      if(token!==playbackToken)return;
      audioFailed();
    });
  }
  function audioFailed(){
    playbackToken++;cancelTimer();player.pause();state.auto=false;
    audioStatus("error");
    $("#liveMessage").textContent="La voix n’a pas pu démarrer. Appuyez sur Réessayer la voix.";
  }
  player.addEventListener("error",()=>{if(loadedKey)audioFailed()});
  player.addEventListener("ended",()=>{
    audioStatus("ended");
    if(state.auto&&!state.complete&&!document.hidden){
      const key=loadedKey;
      cancelTimer();
      timer=setTimeout(()=>{timer=null;if(state.auto&&loadedKey===key)next()},450);
    }
  });
  const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
  function element(tag, cls, text) {
    const el = document.createElement(tag);
    if(cls) el.className = cls;
    if(text) el.textContent = text;
    return el;
  }
  function collectSteps(page) {
    return page.panels.flatMap((panel,panelIndex) => panel.layers.map((layer,layerIndex) => ({
      ...layer, ...window.BD_VOICES[layer.id], panel, panelIndex,
      spokenText:panel.branch ? panel.branch.label+". "+layer.text : layer.text,
      voiceFile:`p${pad(page.page)}-c${pad(panelIndex+1)}-t${pad(layerIndex+1)}.mp3`
    }))).sort((a,b)=>a.step-b.step);
  }
  function createPanel(panel,index) {
    const figure=element("figure",`panel ${panel.shape}`);
    figure.dataset.panel=panel.id;
    figure.setAttribute("aria-label",`Case ${index+1} : ${panel.title}`);
    const img=element("img","art-layer");
    img.src=panel.image; img.alt=panel.alt;
    img.width=panel.shape==="wide"?1983:1122;
    img.height=panel.shape==="wide"?793:panel.shape==="third"?2805:1402;
    img.decoding="async";
    if(index===0) img.fetchPriority="high";
    figure.append(img);
    if(panel.branch) figure.append(element("h3",`branch-title ${panel.branch.color}`,panel.branch.label));
    panel.layers.forEach(layer=>{
      const node=element(layer.kind==="speech"?"blockquote":"p",`text-layer ${layer.kind} ${layer.placement}`,layer.text);
      node.dataset.step=layer.step; node.dataset.layer=layer.id;
      if(layer.speaker) node.setAttribute("aria-label",`${layer.speaker} : ${layer.text}`);
      figure.append(node);
    });
    img.onclick=()=>{setAuto(false);state.audioEnabled=true;if(steps[state.step].panel.id===panel.id)next();else goTo(panel.layers[0].step)};
    return figure;
  }
  function buildPage() {
    story=album[state.pageIndex]; steps=collectSteps(story);
    state.step=Math.min(Math.max(0,state.step),steps.length-1);
    $("#comic").replaceChildren(...story.panels.map(createPanel));
    $("#comic").setAttribute("aria-label",`Planche ${story.page} : ${story.title}`);
    $("#comic").classList.toggle("epilogue",state.pageIndex===album.length-1);
    document.title=`${story.title} — L’Héritage de Renaissance`;
    if(state.pageIndex<album.length-1){const img=new Image();img.src=album[state.pageIndex+1].panels[0].image}
  }
  function getState() {
    const step=steps[state.step];
    return {page:story.page,pageCount:album.length,id:story.id,step:state.step,stepCount:steps.length,panel:step.panel.id,panelIndex:step.panelIndex,
      complete:state.complete,auto:state.auto,text:step.text,spokenText:step.spokenText,speaker:step.speaker||"Narrateur",voiceId:step.voiceId,character:step.character,audio:step.audio,voiceFile:step.voiceFile,audioStatus:player.dataset.status};
  }
  function savePosition() {
    try{history.replaceState(null,"",`#page-${story.page}/etape-${state.step+1}`)}catch{}
    try{localStorage.setItem("renaissance-album-position",JSON.stringify({page:story.page,step:state.step}))}catch{}
  }
  function cancelTimer(){if(timer!==null){clearTimeout(timer);timer=null}}
  function setAuto(enabled) {
    state.auto=Boolean(enabled);cancelTimer();
    if(state.auto){state.audioEnabled=true;$("#nextLabel").textContent="pour avancer";playCurrent()}
    else pauseAudio();
    audioStatus(player.dataset.status||"idle");
    document.dispatchEvent(new CustomEvent("bd:autoplaychange",{detail:{auto:state.auto}}));
  }
  function render(announce=true) {
    const current=steps[state.step];
    document.querySelectorAll("#comic .panel").forEach((node,i)=>{
      node.classList.toggle("future",i>current.panelIndex);
      node.classList.toggle("active",i===current.panelIndex);
      const title=node.querySelector(".branch-title");
      if(title)title.setAttribute("aria-hidden",String(i>current.panelIndex));
    });
    document.querySelectorAll("#comic .text-layer").forEach(node=>{
      const n=Number(node.dataset.step),hidden=n>state.step;
      node.classList.toggle("unrevealed",hidden);
      node.classList.toggle("current-text",n===state.step);
      node.setAttribute("aria-hidden",String(hidden));
    });
    $("#nextLabel").textContent=state.complete?"pour recommencer":state.audioEnabled?"pour avancer":"pour écouter";
    if(announce)$("#liveMessage").textContent=state.complete?"Fin de la bande dessinée.":current.spokenText;
    savePosition();resetAudio();
    if(!state.complete)playCurrent();
    document.dispatchEvent(new CustomEvent("bd:stepchange",{detail:getState()}));
  }
  function scrollCurrent() {
    const panel=$(`#comic [data-panel="${steps[state.step].panel.id}"]`);
    const box=panel.getBoundingClientRect(),layer=panel.querySelector(`[data-step="${state.step}"]`);
    const target=box.height>innerHeight-80&&layer ? layer : panel;
    target.scrollIntoView({behavior:reducedMotion()?"instant":"smooth",block:box.height>innerHeight-80?"center":"start"});
  }
  function goTo(index,{scroll=true}={}) {
    if(!Number.isInteger(index)||index<0||index>=steps.length)return false;
    state.step=index;state.complete=false;render();
    if(scroll)scrollCurrent();
    return true;
  }
  function goToPage(number,{step=0,scroll=true}={}) {
    if(!Number.isInteger(number)||number<1||number>album.length||!Number.isInteger(step)||step<0)return false;
    state.pageIndex=number-1;state.step=step;state.complete=false;
    buildPage();render();
    if(scroll){window.scrollTo({top:0,behavior:"instant"});if(step>0)scrollCurrent()}
    document.dispatchEvent(new CustomEvent("bd:pagechange",{detail:getState()}));
    return true;
  }
  function next() {
    if(state.complete){restartAlbum();return}
    if(state.step<steps.length-1){goTo(state.step+1);return}
    document.dispatchEvent(new CustomEvent("bd:pageend",{detail:{page:story.page,id:story.id}}));
    if(state.pageIndex<album.length-1){goToPage(story.page+1);return}
    state.complete=true;setAuto(false);render();
    document.dispatchEvent(new CustomEvent("bd:albumend",{detail:getState()}));
  }
  function previous() {
    setAuto(false);
    if(state.complete){state.complete=false;render();return}
    if(state.step>0){goTo(state.step-1);return}
    if(state.pageIndex>0){const page=album[state.pageIndex-1];goToPage(page.page,{step:collectSteps(page).length-1})}
  }
  function restart(){setAuto(false);goTo(0)}
  function restartAlbum(){setAuto(false);goToPage(1)}
  function manualNext(){
    const first=!state.audioEnabled;
    setAuto(false);state.audioEnabled=true;
    $("#nextLabel").textContent="pour avancer";
    if(first&&!state.complete)playCurrent();else next();
  }
  $("#nextStep").onclick=manualNext;
  $("#autoPlay").onclick=()=>{if(state.complete)restartAlbum();setAuto(!state.auto)};
  document.addEventListener("keydown",e=>{
    if(e.ctrlKey||e.metaKey||e.altKey||e.repeat||/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)||e.target.isContentEditable)return;
    // The first Space starts the current phrase; subsequent presses advance.
    if(e.code==="Space"){e.preventDefault();manualNext()}
    else if(e.key==="ArrowRight"){e.preventDefault();setAuto(false);state.audioEnabled=true;next()}
    else if(e.key==="ArrowLeft"){e.preventDefault();previous()}
    else if(e.key==="Escape"){e.preventDefault();setAuto(false)}
  });
  document.addEventListener("visibilitychange",()=>{if(document.hidden)setAuto(false)});
  window.addEventListener("pagehide",()=>setAuto(false));
  function readHash() {
    const m=location.hash.match(/^#page-(\d+)(?:\/etape-(\d+))?(?:\/entiere)?$/);
    if(!m)return null;
    const page=Number(m[1]),step=Math.max(0,Number(m[2]||1)-1);
    return page>=1&&page<=album.length?{page,step}:null;
  }
  let initial=readHash();
  if(!initial&&!location.hash){try{const saved=JSON.parse(localStorage.getItem("renaissance-album-position"));if(saved&&Number.isInteger(saved.page)&&saved.page>=1&&saved.page<=album.length&&Number.isInteger(saved.step)&&saved.step>=0)initial=saved}catch{}}
  if(initial){state.pageIndex=initial.page-1;state.step=initial.step}
  buildPage();render(false);
  window.addEventListener("hashchange",()=>{const target=readHash();if(target){setAuto(false);state.audioEnabled=false;goToPage(target.page,{step:target.step})}});
  window.BDReader=Object.freeze({next,previous,goTo,goToPage,restart,restartAlbum,setAuto,getState});
})();
