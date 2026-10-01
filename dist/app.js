const journey=document.querySelector('.journey');
const scenes=[...document.querySelectorAll('.scene')];
const photos=[...document.querySelectorAll('.scene-photo')];
const stops=[...document.querySelectorAll('.map-stop')];
const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function updateJourney(progress){
 const active=Math.min(3,Math.floor(progress*4));
 document.querySelector('.map-fill').style.height=`${Math.max(3,progress*100)}%`;
 stops.forEach((stop,i)=>{stop.classList.toggle('is-active',i===active);if(i===active)stop.setAttribute('aria-current','step');else stop.removeAttribute('aria-current');});
 scenes.forEach((scene,i)=>scene.setAttribute('aria-hidden',String(!reduceMotion&&i!==active)));
}
stops.forEach((stop,i)=>stop.addEventListener('click',()=>{
 const distance=journey.offsetHeight-window.innerHeight;
 window.scrollTo({top:journey.offsetTop+distance*(i/4+.02),behavior:reduceMotion?'auto':'smooth'});
}));
if(journey){
if(reduceMotion){scenes.forEach(scene=>scene.setAttribute('aria-hidden','false'));}
else if(window.gsap&&window.ScrollTrigger){
 gsap.registerPlugin(ScrollTrigger);
 gsap.set(scenes.slice(1),{autoAlpha:0});gsap.set(photos,{scale:1.12});
 const tl=gsap.timeline({scrollTrigger:{trigger:journey,start:'top top',end:'bottom bottom',scrub:.55,onUpdate:self=>updateJourney(self.progress)}});
 scenes.forEach((scene,i)=>{
  tl.to(photos[i],{scale:1,xPercent:i%2?-2:2,ease:'none',duration:1},i);
  if(i<3){tl.to(scene,{autoAlpha:0,duration:.22,ease:'power1.inOut'},i+.78);tl.fromTo(scenes[i+1],{autoAlpha:0},{autoAlpha:1,duration:.22,ease:'power1.inOut'},i+.78);}
 });
}else{
 let scheduled=false;
 function render(){scheduled=false;const p=Math.max(0,Math.min(1,(window.scrollY-journey.offsetTop)/(journey.offsetHeight-window.innerHeight)));updateJourney(p);const active=Math.min(3,Math.floor(p*4));scenes.forEach((scene,i)=>{scene.style.opacity=i===active?'1':'0';scene.style.visibility=i===active?'visible':'hidden';});photos[active].style.transform=`scale(${1.12-(p*4-active)*.12})`;}
 window.addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(render);}},{passive:true});window.addEventListener('resize',render);render();
}

}

const sectionLinks=[...document.querySelectorAll('.visit-nav a')];
if(sectionLinks.length&&'IntersectionObserver' in window){
 const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){sectionLinks.forEach(link=>{const active=link.hash==='#'+entry.target.id;link.classList.toggle('active',active);if(active)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});}});},{rootMargin:'-20% 0px -65% 0px',threshold:0});
 sectionLinks.forEach(link=>{const section=document.querySelector(link.hash);if(section)observer.observe(section);});
}

const kitSection=document.querySelector('.kit-scroll');
if(kitSection){
 const kitCanvas=kitSection.querySelector('.kit-canvas');
 const kitCaptions=[...kitSection.querySelectorAll('.kit-caption')];
 const kitControls=[...kitSection.querySelectorAll('button[data-kit]')];
 const kitAreas=[{x:52,y:44,rx:25,ry:27},{x:75,y:44,rx:12,ry:12},{x:42,y:92,rx:25,ry:10}];
 let currentKit=-1,scheduledKit=false;
 function lightKit(index){
  if(index===currentKit)return;
  currentKit=index;
  const area=kitAreas[index];
  kitCanvas.style.setProperty('--kit-x',area.x+'%');kitCanvas.style.setProperty('--kit-y',area.y+'%');kitCanvas.style.setProperty('--kit-rx',area.rx+'%');kitCanvas.style.setProperty('--kit-ry',area.ry+'%');
  kitCaptions.forEach((caption,i)=>{caption.hidden=i!==index;caption.classList.toggle('is-active',i===index);});
  kitControls.forEach(control=>{const active=Number(control.dataset.kit)===index;control.classList.toggle('is-active',active);control.setAttribute('aria-pressed',String(active));});
 }
 function kitScrollProgress(){
  const top=kitSection.getBoundingClientRect().top+window.scrollY;
  const stickyTop=parseFloat(getComputedStyle(kitSection.querySelector('.kit-stage')).top)||0;
  const stageHeight=kitSection.querySelector('.kit-stage').offsetHeight;
  const distance=Math.max(1,kitSection.offsetHeight-stageHeight);
  return Math.max(0,Math.min(1,(window.scrollY-top+stickyTop)/distance));
 }
 function renderKit(){scheduledKit=false;lightKit(Math.min(2,Math.floor(kitScrollProgress()*3)));}
 kitControls.forEach(control=>control.addEventListener('click',()=>{
  const index=Number(control.dataset.kit);
  lightKit(index);
  if(!reduceMotion){const stage=kitSection.querySelector('.kit-stage');const top=kitSection.getBoundingClientRect().top+window.scrollY;const stickyTop=parseFloat(getComputedStyle(stage).top)||0;const distance=kitSection.offsetHeight-stage.offsetHeight;window.scrollTo({top:top-stickyTop+distance*(index/3+.12),behavior:'smooth'});}
 }));
 if(!reduceMotion){window.addEventListener('scroll',()=>{if(!scheduledKit){scheduledKit=true;requestAnimationFrame(renderKit);}},{passive:true});window.addEventListener('resize',renderKit);renderKit();}else lightKit(0);
}

const mapButtons=[...document.querySelectorAll('[data-map]')];
const mapPanels=[...document.querySelectorAll('[data-map-panel]')];
mapButtons.forEach(button=>button.addEventListener('click',()=>{
 mapButtons.forEach(other=>{const active=other===button;other.classList.toggle('active',active);other.setAttribute('aria-pressed',String(active));});
 mapPanels.forEach(panel=>panel.hidden=panel.dataset.mapPanel!==button.dataset.map);
}));

const wallSection=document.querySelector('.wall-scroll');
if(wallSection){
 const stage=wallSection.querySelector('.wall-stage');
 const captions=[...wallSection.querySelectorAll('.wall-caption')];
 captions.forEach(caption=>{
  const heading=caption.querySelector('h3');
  const text=heading.lastChild;
  if(text.nodeType===Node.TEXT_NODE&&text.textContent.endsWith('.')){
   text.textContent=text.textContent.slice(0,-1);
   const period=document.createElement('span');
   period.className='rule-period';
   period.textContent='.';
   heading.append(period);
  }
 });
 const pictures=[...wallSection.querySelectorAll('.wall-photo')];
 const controls=[...wallSection.querySelectorAll('button[data-wall]')];
 let activeWall=-1,wallScheduled=false;
 function showWall(index){
  if(index===activeWall)return;
  activeWall=index;
  captions.forEach((caption,i)=>caption.hidden=i!==index);
  pictures.forEach((picture,i)=>{const visible=i<=index;picture.classList.toggle('is-active',visible);picture.setAttribute('aria-hidden',String(!visible));});
  controls.forEach((control,i)=>{control.classList.toggle('is-active',i===index);control.setAttribute('aria-pressed',String(i===index));});
 }
 function wallGeometry(){return {top:wallSection.getBoundingClientRect().top+window.scrollY,offset:parseFloat(getComputedStyle(stage).top)||0,distance:Math.max(1,wallSection.offsetHeight-stage.offsetHeight)};}
 function renderWall(){wallScheduled=false;const g=wallGeometry();const progress=Math.max(0,Math.min(1,(window.scrollY-g.top+g.offset)/g.distance));showWall(Math.min(3,Math.floor(progress*4)));}
 controls.forEach((control,i)=>control.addEventListener('click',()=>{showWall(i);if(!reduceMotion){const g=wallGeometry();window.scrollTo({top:g.top-g.offset+g.distance*(i/4+.08),behavior:'smooth'});}}));
 if(!reduceMotion){window.addEventListener('scroll',()=>{if(!wallScheduled){wallScheduled=true;requestAnimationFrame(renderWall);}},{passive:true});window.addEventListener('resize',renderWall);renderWall();}else showWall(0);
}


// Reveal ordinary content once as it enters the viewport.
if(!reduceMotion&&'IntersectionObserver' in window){
 const revealTargets=[...document.querySelectorAll([
  '.visit-invitation > div',
  '.quotes-heading','.quote-grid > figure','.home-location > div',
  '.sponsors > h2','.sponsor-grid > div','.prices-heading','.price-group > h3',
  '.price-card','.price-extra','.membership-note',
  '.arrival-title','.arrival-guide','.inside-guide > div',
  '.inside-guide > a','.grade-heading','.grade-group','.question-grid > article',
  '.question-contact','.reception-visual > div'
 ].join(','))];
 const revealObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-revealed');revealObserver.unobserve(entry.target);}});
 },{threshold:.08,rootMargin:'0px 0px -35px 0px'});
 revealTargets.forEach(target=>{
  const siblingIndex=[...target.parentElement.children].indexOf(target);
  target.style.setProperty('--reveal-delay',Math.min(siblingIndex,3)*75+'ms');
  target.classList.add('scroll-reveal');revealObserver.observe(target);
 });
 document.addEventListener('focusin',event=>{
  const target=event.target.closest('.scroll-reveal');
  if(target){target.classList.add('is-revealed');revealObserver.unobserve(target);}
 });
}


// Scroll sideways through rock-shaped programme cards.
const coursesSection=document.querySelector('.learn');
if(coursesSection){
 const stage=coursesSection.querySelector('.courses-stage');
 const viewport=coursesSection.querySelector('.course-window');
 const track=coursesSection.querySelector('.course-track');
 const cards=[...track.querySelectorAll('.rock-course-card')];
 const position=coursesSection.querySelector('.course-position');
 const buttons=[...coursesSection.querySelectorAll('[data-course-direction]')];
 let distance=0,activeCourse=0;
 function measureCourses(){distance=Math.max(0,track.scrollWidth-viewport.clientWidth);}
 function courseGeometry(){return {top:coursesSection.getBoundingClientRect().top+window.scrollY,offset:parseFloat(getComputedStyle(stage).top)||0,length:Math.max(1,coursesSection.offsetHeight-stage.offsetHeight)};}
 function updateCoursePosition(progress){
  const active=Math.min(cards.length-1,Math.round(progress*(cards.length-1)));
  if(active!==activeCourse||position.textContent===''){activeCourse=active;position.textContent=String(active+1).padStart(2,'0')+' / 04';}
  cards.forEach((card,i)=>card.classList.toggle('course-current',i===active));
  buttons.forEach(button=>button.disabled=Number(button.dataset.courseDirection)<0?active===0:active===cards.length-1);
 }
 measureCourses();updateCoursePosition(0);
 if(!reduceMotion){
  coursesSection.classList.add('courses-carousel');
  if(window.gsap&&window.ScrollTrigger){
   gsap.registerPlugin(ScrollTrigger);
   gsap.to(track,{x:()=>-distance,ease:'none',scrollTrigger:{trigger:coursesSection,start:()=>`top top+=${courseGeometry().offset}`,end:'bottom bottom',scrub:.2,invalidateOnRefresh:true,onRefreshInit:measureCourses,onUpdate:self=>updateCoursePosition(self.progress)}});
  }else{
   let scheduled=false;
   function renderCourses(){scheduled=false;const g=courseGeometry();const p=Math.max(0,Math.min(1,(window.scrollY-g.top+g.offset)/g.length));track.style.transform=`translate3d(${-distance*p}px,0,0)`;updateCoursePosition(p);}
   window.addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(renderCourses);}},{passive:true});renderCourses();
  }
 }else{
  viewport.addEventListener('scroll',()=>updateCoursePosition(distance?viewport.scrollLeft/distance:0),{passive:true});
 }
 function goToCourse(index){
  index=Math.max(0,Math.min(cards.length-1,index));
  if(reduceMotion){viewport.scrollTo({left:distance*index/(cards.length-1),behavior:'auto'});}
  else{const g=courseGeometry();window.scrollTo({top:g.top-g.offset+g.length*index/(cards.length-1),behavior:'smooth'});}
 }
 buttons.forEach(button=>button.addEventListener('click',()=>goToCourse(activeCourse+Number(button.dataset.courseDirection))));
 cards.forEach((card,i)=>card.addEventListener('focus',()=>goToCourse(i)));
 window.addEventListener('resize',measureCourses);
 if('IntersectionObserver' in window){const preload=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting)){cards.forEach(card=>{const image=card.querySelector('img');image.loading='eager';if(image.decode)image.decode().catch(()=>{});});preload.disconnect();}},{rootMargin:'800px 0px'});preload.observe(coursesSection);}
}

// Add one entry step at a time while the payment guide stays in view.
const entrySection=document.querySelector('.visual-entry');
if(entrySection&&!reduceMotion){
 const stage=entrySection.querySelector('.entry-stage');
 const steps=[...entrySection.querySelectorAll('.entry-flow > article')];
 const alternative=entrySection.querySelector('.entry-alternative');
 entrySection.classList.add('entry-scroll');
 let entryScheduled=false,activeEntry=-1;
 function renderEntry(){
  entryScheduled=false;
  const top=entrySection.getBoundingClientRect().top+window.scrollY;
  const offset=parseFloat(getComputedStyle(stage).top)||0;
  const distance=Math.max(1,entrySection.offsetHeight-stage.offsetHeight);
  const progress=Math.max(0,Math.min(1,(window.scrollY-top+offset)/distance));
  const active=Math.min(steps.length-1,Math.floor(progress*steps.length));
  if(active===activeEntry)return;
  activeEntry=active;
  steps.forEach((step,i)=>{const visible=i<=active;step.classList.toggle('entry-visible',visible);step.setAttribute('aria-hidden',String(!visible));});
  alternative.classList.toggle('entry-visible',active===steps.length-1);
 }
 window.addEventListener('scroll',()=>{if(!entryScheduled){entryScheduled=true;requestAnimationFrame(renderEntry);}},{passive:true});
 window.addEventListener('resize',renderEntry);renderEntry();
}
