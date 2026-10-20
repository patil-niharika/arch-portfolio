import { FULL_ORIGINAL_PDF_URL } from './site-config.js';

const CDN = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/';
const BASE = new URL('./', import.meta.url);
const path = (relative) => new URL(relative, BASE).href;
const pad = (n) => String(n).padStart(2, '0');
const sheetURL = (n) => path(`pages/sheet-${pad(n)}.pdf`);
const thumbURL = (n) => path(`assets/thumbnails/page-${pad(n)}.webp`);
const PAGE_COUNT = 24;

const chapters = [
  {id:'introduction',number:'00',title:'Introduction',short:'INTRODUCTION',start:1,end:3,category:'PORTFOLIO / PROFILE'},
  {id:'exoskeletal-circuit',number:'01',title:'Exoskeletal Circuit',short:'EXOSKELETAL CIRCUIT',start:4,end:8,category:'STADIUM DESIGN', semester:'SEM 07',location:'BENGALURU',
    titleLines:['EXOSKELETAL','CIRCUIT'],summary:'Reimagining a 40,000-seat football stadium through exposed circulation towers, crowd behaviour and an exoskeletal system.',tagline:'CIRCULATION AS ARCHITECTURE',image:'exoskeletal.webp'},
  {id:'samvedana',number:'02',title:'Samvedana',short:'SAMVEDANA',start:9,end:12,category:'INSTITUTIONAL DESIGN',semester:'SEM 06',location:'BENGALURU',
    titleLines:['SAMVEDANA'],summary:'An arts institute for the visually impaired, shaped by sensory cues, interconnected levels and independent navigation.',tagline:'DESIGNING THROUGH THE SENSES',image:'samvedana.webp'},
  {id:'mitti',number:'03',title:'Mitti',short:'MITTI',start:13,end:15,category:'CULTURAL DESIGN',semester:'SEM 05',location:'BENGALURU',
    titleLines:['MITTI'],summary:'A community centre and gallery dedicated to sustaining pottery, its artisans and the evolving experience of craft.',tagline:'THE ARCHITECTURE OF MAKING',image:'mitti.webp'},
  {id:'saanidhya',number:'04',title:'Saanidhya',short:'SAANIDHYA',start:16,end:18,category:'URBAN DESIGN',semester:'SEM 08',location:'MELUKOTE',
    titleLines:['SAANIDHYA'],summary:'Reactivating a neglected waterbody and translating Melukote’s living heritage into spaces of cultural exchange.',tagline:'MEMORY, CULTURE AND PLACE',image:'saanidhya.webp'},
  {id:'working-drawings',number:'05',title:'Working Drawings',short:'WORKING DRAWINGS',start:19,end:20,category:'TECHNICAL DRAFTING',semester:'SEM 06—07',location:'ACADEMIC',
    titleLines:['WORKING','DRAWINGS'],summary:'Technical drawing sets exploring the detail and coordination underlying the built form.',tagline:'FROM CONCEPT TO DETAIL',image:'working-drawings.webp'},
  {id:'selected-explorations',number:'06',title:'Selected Explorations',short:'SELECTED EXPLORATIONS',start:21,end:23,category:'RESEARCH & CREATIVE WORK',semester:'ONGOING',location:'VARIOUS',
    titleLines:['SELECTED','EXPLORATIONS'],summary:'Physical models, sketching, photography, painting and ongoing research into the spatial translation of experience.',tagline:'BEYOND THE DRAWING BOARD',image:'selected-explorations.webp'},
  {id:'closing',number:'—',title:'Contact',short:'CONTACT',start:24,end:24,category:'CONTACT'}
];
const projects = chapters.slice(1,7);
const chapterFor = (n) => chapters.find(ch => n>=ch.start && n<=ch.end) || chapters[0];
const $ = (id) => document.getElementById(id);
const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

function setupMainSite(){
  $('copyright-year').textContent=String(new Date().getFullYear());
  $('project-list').innerHTML = projects.map(project => `
    <article class="project-row" role="button" tabindex="0" data-open-page="${project.start}" aria-label="Open ${project.title} project, ${project.end-project.start+1} sheets">
      <span class="project-number">${project.number}</span>
      <div class="project-picture"><img src="${path('assets/'+project.image)}" alt="Original imagery from the ${project.title} architecture portfolio project" loading="lazy"/><span class="picture-index">FIG. ${project.number} / ${project.tagline}</span></div>
      <div class="project-info"><span class="project-type">${project.category}</span><h3>${project.titleLines.map(t=>`<span>${t}</span>`).join('')}</h3><p class="project-description">${project.summary}</p><div class="project-facts"><span>${project.semester}</span><span>${project.location}</span><span>${pad(project.end-project.start+1)} SHEETS</span></div></div>
      <span class="project-open" aria-hidden="true">↗</span>
    </article>`).join('');

  for (const row of document.querySelectorAll('[data-open-page]')) {
    row.addEventListener('click',()=>navigateToPage(Number(row.dataset.openPage)));
    row.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();navigateToPage(Number(row.dataset.openPage));}});
  }
  document.querySelectorAll('[data-page]').forEach(btn=>btn.addEventListener('click',()=>navigateToPage(Number(btn.dataset.page))));
  $('open-deck').addEventListener('click',()=>navigateToPage(1));
  $('footer-open').addEventListener('click',()=>navigateToPage(1));
  const menu=$('mobile-menu-button');
  menu.addEventListener('click',()=>{const active=document.querySelector('.site-navigation').classList.toggle('is-open');menu.setAttribute('aria-expanded',String(active));});
  document.querySelectorAll('.site-navigation a').forEach(a=>a.addEventListener('click',()=>{document.querySelector('.site-navigation').classList.remove('is-open');menu.setAttribute('aria-expanded','false');}));
  const onScroll=()=>{
    $('site-header').classList.toggle('scrolled',scrollY>80);
    const max=Math.max(document.documentElement.scrollHeight-innerHeight,1);
    $('reading-progress').style.width=`${Math.min(100,scrollY/max*100)}%`;
  };
  addEventListener('scroll',onScroll,{passive:true});onScroll();
  if ('IntersectionObserver' in window){
    const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-revealed');observer.unobserve(entry.target);}});},{rootMargin:'0px 0px -9% 0px',threshold:0.05});
    document.querySelectorAll('[data-reveal]').forEach(el=>observer.observe(el));
    document.body.classList.add('js-ready');
  }
  if (!prefersReducedMotion && matchMedia('(hover: hover) and (pointer: fine)').matches){
    const art=document.querySelector('.hero-art');
    art.addEventListener('pointermove',e=>{const box=art.getBoundingClientRect();const dx=(e.clientX-box.left)/box.width-.5;const dy=(e.clientY-box.top)/box.height-.5;art.querySelectorAll('[data-depth]').forEach(el=>{const scale=Number(el.dataset.depth);el.style.setProperty('--mx',`${(dx*scale).toFixed(1)}px`);el.style.setProperty('--my',`${(dy*scale).toFixed(1)}px`);});},{passive:true});
    art.addEventListener('pointerleave',()=>art.querySelectorAll('[data-depth]').forEach(el=>{el.style.setProperty('--mx','0px');el.style.setProperty('--my','0px');}));
  }
}

let currentPage=1;
let zoom=1;
let isOpen=false;
let lastFocused=null;
let pdfjsPromise=null;
const documentCache=new Map();
let renderTask=null;
let renderToken=0;
let resizeTimer=null;
let toastTimeout=null;

function navigateToPage(page){
  page=Math.max(1,Math.min(PAGE_COUNT,page));
  const target=`#sheet/${page}`;
  if(location.hash===target){showViewer(page);}else{location.hash=target;}
}
function updateHash(page){history.replaceState(null,'',`#sheet/${page}`);}
function handleRoute(){
  const m=location.hash.match(/^#sheet\/(\d{1,2})$/);
  if(m){showViewer(Math.max(1,Math.min(PAGE_COUNT,Number(m[1]))));}
  else if(isOpen){closeViewer(false);}
}
function showViewer(page){
  if(!isOpen){
    isOpen=true;lastFocused=document.activeElement;
    $('viewer').inert=false;$('viewer').setAttribute('aria-hidden','false');$('viewer').classList.add('is-open');
    document.body.classList.add('viewer-open');
    $('viewer-close').focus({preventScroll:true});
  }
  if(page!==currentPage||!$('pdf-frame').classList.contains('is-visible')){
    currentPage=page;zoom=1;updateViewer();renderPage();
  }
}
function closeViewer(restoreHash=true){
  if(!isOpen)return;
  isOpen=false;renderToken++;
  if(renderTask){try{renderTask.cancel();}catch(_){}renderTask=null;}
  $('viewer').classList.remove('is-open');$('viewer').setAttribute('aria-hidden','true');$('viewer').inert=true;
  document.body.classList.remove('viewer-open');
  if(restoreHash){location.hash='projects';}
  if(lastFocused && typeof lastFocused.focus==='function')lastFocused.focus({preventScroll:true});
}
function changePage(page){
  page=Math.max(1,Math.min(PAGE_COUNT,page));
  if(page===currentPage)return;
  currentPage=page;zoom=1;updateHash(page);updateViewer();renderPage();
}
function updateViewer(){
  const ch=chapterFor(currentPage);
  $('viewer-breadcrumb-project').textContent=ch.short;
  $('viewer-breadcrumb-page').textContent=`SHEET ${pad(currentPage)}`;
  $('viewer-sheet-label').textContent=`${ch.category} / SHEET ${pad(currentPage)}`;
  $('viewer-page-count').innerHTML=`${pad(currentPage)} <span>/</span> ${PAGE_COUNT}`;
  $('pdf-canvas').setAttribute('aria-label',`Original architecture portfolio PDF sheet ${currentPage} of ${PAGE_COUNT}`);
  $('viewer-prev').disabled=currentPage<=1;$('viewer-next').disabled=currentPage>=PAGE_COUNT;
  $('download-sheet').href=sheetURL(currentPage);
  $('download-sheet').download=`Niharika-Patil-Sheet-${pad(currentPage)}.pdf`;
  $('zoom-label').textContent=zoom===1?'FIT':`${Math.round(zoom*100)}%`;
  const full=$('download-full');
  if(FULL_ORIGINAL_PDF_URL && /^https?:\/\//.test(FULL_ORIGINAL_PDF_URL)){full.href=FULL_ORIGINAL_PDF_URL;full.hidden=false;}
  else full.hidden=true;
  const nav=$('viewer-chapters');
  nav.innerHTML=chapters.map(item=>`<button class="chapter-btn ${item.id===ch.id?'active':''}" type="button" data-chapter-page="${item.start}" ${item.id===ch.id?'aria-current="true"':''}><span>${item.number}</span><strong>${item.title.toUpperCase()}</strong><span class="chapter-arrow">↗</span></button>`).join('');
  nav.querySelectorAll('[data-chapter-page]').forEach(btn=>btn.addEventListener('click',()=>changePage(Number(btn.dataset.chapterPage))));
  const thumbs=$('viewer-thumbs');
  thumbs.innerHTML=Array.from({length:ch.end-ch.start+1},(_,j)=>ch.start+j).map(n=>`<button type="button" class="thumb-btn ${n===currentPage?'active':''}" data-thumb-page="${n}" aria-label="View sheet ${n}" ${n===currentPage?'aria-current="page"':''}><img src="${thumbURL(n)}" alt="Preview of sheet ${pad(n)}" /><span class="thumb-number">${pad(n)}</span></button>`).join('');
  thumbs.querySelectorAll('[data-thumb-page]').forEach(btn=>btn.addEventListener('click',()=>changePage(Number(btn.dataset.thumbPage))));
  thumbs.querySelector('.thumb-btn.active')?.scrollIntoView({block:'nearest',inline:'nearest'});
}

async function getPdfLib(){
  if(!pdfjsPromise){
    pdfjsPromise=Promise.race([
      import(`${CDN}pdf.min.mjs`),
      new Promise((_,reject)=>setTimeout(()=>reject(new Error('PDF renderer unavailable; switching to native viewer')),6000))
    ]).then(lib=>{lib.GlobalWorkerOptions.workerSrc=`${CDN}pdf.worker.min.mjs`;return lib;});
  }
  return pdfjsPromise;
}
async function getPageDocument(page){
  if(documentCache.has(page)){const val=documentCache.get(page);documentCache.delete(page);documentCache.set(page,val);return val;}
  const lib=await getPdfLib();
  const loading=lib.getDocument({url:sheetURL(page),cMapPacked:true,enableXfa:false});
  const promise=loading.promise;
  documentCache.set(page,promise);
  try{
    const result=await promise;
    while(documentCache.size>4){const first=documentCache.keys().next().value;if(first===page)break;const stale=documentCache.get(first);documentCache.delete(first);Promise.resolve(stale).then(doc=>doc.destroy()).catch(()=>{});}
    return result;
  }catch(err){documentCache.delete(page);throw err;}
}
async function renderPage(){
  const token=++renderToken;
  if(renderTask){try{renderTask.cancel();}catch(_){}renderTask=null;}
  const pageNumber=currentPage;
  const frame=$('pdf-frame');
  const loading=$('viewer-loading');
  const stage=$('viewer-stage');
  const canvas=$('pdf-canvas');
  frame.classList.remove('is-visible');
  $('pdf-fallback').hidden=true;
  canvas.hidden=false;
  loading.hidden=false;
  stage.scrollTop=0;stage.scrollLeft=0;
  try{
    const pdf=await getPageDocument(pageNumber);
    if(token!==renderToken || !isOpen)return;
    const page=await pdf.getPage(1);
    if(token!==renderToken || !isOpen)return;
    const baseViewport=page.getViewport({scale:1});
    const availableWidth=Math.max(150,stage.clientWidth-(innerWidth<640?24:64));
    const availableHeight=Math.max(130,stage.clientHeight-(innerWidth<640?24:56));
    const fit=Math.min(availableWidth/baseViewport.width,availableHeight/baseViewport.height);
    const cssScale=fit*zoom;
    const viewport=page.getViewport({scale:cssScale});
    const dpr=Math.min(devicePixelRatio||1,2);
    // Limit canvas area to control memory on older office laptops, while keeping detail on zoom.
    const maxPixels=28e6;
    const oversample=Math.min(dpr,Math.sqrt(maxPixels/(viewport.width*viewport.height)));
    const raster=page.getViewport({scale:cssScale*oversample});
    canvas.width=Math.max(1,Math.floor(raster.width));
    canvas.height=Math.max(1,Math.floor(raster.height));
    canvas.style.width=`${viewport.width}px`;
    canvas.style.height=`${viewport.height}px`;
    frame.style.width=`${viewport.width}px`;
    frame.style.height=`${viewport.height}px`;
    const ctx=canvas.getContext('2d',{alpha:false});
    ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);
    renderTask=page.render({canvasContext:ctx,viewport:raster,background:'rgb(255,255,255)'});
    await renderTask.promise;
    if(token!==renderToken||!isOpen)return;
    frame.classList.add('is-visible');
    loading.hidden=true;
    $('viewer-meta').textContent='A3 LANDSCAPE · HIGH-FIDELITY PDF';
  }catch(err){
    if(token!==renderToken||!isOpen)return;
    if(err?.name==='RenderingCancelledException')return;
    // Native browser PDF rendering retains vector content even if the CDN is blocked.
    showNativeFallback(pageNumber);
  }finally{if(token===renderToken)renderTask=null;}
}
function showNativeFallback(page){
  const frame=$('pdf-frame'),stage=$('viewer-stage'),iframe=$('pdf-fallback');
  const ratio=1190.25/842.25;
  const maxWidth=Math.max(150,stage.clientWidth-52);
  const maxHeight=Math.max(150,stage.clientHeight-52);
  const width=Math.min(maxWidth,maxHeight*ratio);
  const height=width/ratio;
  frame.style.width=`${width}px`;frame.style.height=`${height}px`;
  $('pdf-canvas').hidden=true;iframe.hidden=false;
  iframe.src=`${sheetURL(page)}#toolbar=0&navpanes=0&scrollbar=0&view=Fit`;
  frame.classList.add('is-visible');$('viewer-loading').hidden=true;
  $('viewer-meta').textContent='ORIGINAL PDF · NATIVE BROWSER VIEWER';
  notify('Using your browser’s original PDF viewer.');
}
function zoomTo(value){
  if(!isOpen)return;
  zoom=Math.max(1,Math.min(4,Math.round(value*4)/4));
  $('zoom-label').textContent=zoom===1?'FIT':`${Math.round(zoom*100)}%`;
  renderPage();
}
function notify(text){
  const node=$('toast');node.textContent=text;node.classList.add('visible');
  clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>node.classList.remove('visible'),3500);
}
function setupViewer(){
  $('viewer-close').addEventListener('click',()=>closeViewer());
  $('viewer-prev').addEventListener('click',()=>changePage(currentPage-1));
  $('viewer-next').addEventListener('click',()=>changePage(currentPage+1));
  $('zoom-in').addEventListener('click',()=>zoomTo(zoom+.25));
  $('zoom-out').addEventListener('click',()=>zoomTo(zoom-.25));
  $('zoom-reset').addEventListener('click',()=>zoomTo(1));
  $('viewer-fullscreen').addEventListener('click',async()=>{
    try{
      if(document.fullscreenElement){await document.exitFullscreen();}
      else if($('viewer').requestFullscreen){await $('viewer').requestFullscreen();}
      else notify('Fullscreen is not supported in this browser.');
    }catch(_){notify('Fullscreen could not be opened.');}
  });
  addEventListener('hashchange',handleRoute);
  addEventListener('resize',()=>{
    if(!isOpen)return;
    clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>renderPage(),220);
  });
  document.addEventListener('fullscreenchange',()=>{if(isOpen)setTimeout(()=>renderPage(),120);});
  document.addEventListener('keydown',e=>{
    if(!isOpen)return;
    if(e.key==='Escape'){if(!document.fullscreenElement)closeViewer();return;}
    // Keep focus inside the modal for keyboard and screen-reader users.
    if(e.key==='Tab'){
      const focusables=[...$('viewer').querySelectorAll('button:not([disabled]),a[href]')].filter(el=>el.getClientRects().length && !el.hidden);
      if(!focusables.length)return;
      const first=focusables[0],last=focusables.at(-1);
      if(e.shiftKey && document.activeElement===first){e.preventDefault();last.focus();}
      else if(!e.shiftKey && document.activeElement===last){e.preventDefault();first.focus();}
      return;
    }
    if(e.target?.tagName==='INPUT')return;
    if(e.key==='ArrowRight'){e.preventDefault();changePage(currentPage+1);}
    if(e.key==='ArrowLeft'){e.preventDefault();changePage(currentPage-1);}
    if(e.key==='+'||e.key==='='){e.preventDefault();zoomTo(zoom+.25);}
    if(e.key==='-'){e.preventDefault();zoomTo(zoom-.25);}
    if(e.key==='0'){e.preventDefault();zoomTo(1);}
    if(e.key.toLowerCase()==='f'){e.preventDefault();$('viewer-fullscreen').click();}
    if(e.key==='Home'){e.preventDefault();changePage(1);}
    if(e.key==='End'){e.preventDefault();changePage(PAGE_COUNT);}
  });
  const stage=$('viewer-stage');
  stage.addEventListener('wheel',e=>{
    if(!e.ctrlKey && !e.metaKey)return;
    e.preventDefault();zoomTo(zoom+(e.deltaY<0?.25:-.25));
  },{passive:false});
  // Swipe to turn sheets when at fit size; pinch gestures are handled by the browser.
  let touchStart=null;
  stage.addEventListener('touchstart',e=>{if(e.touches.length===1 && zoom===1)touchStart={x:e.touches[0].clientX,y:e.touches[0].clientY};else touchStart=null;},{passive:true});
  stage.addEventListener('touchend',e=>{
    if(!touchStart||!e.changedTouches.length)return;
    const dx=e.changedTouches[0].clientX-touchStart.x,dy=e.changedTouches[0].clientY-touchStart.y;
    if(Math.abs(dx)>75&&Math.abs(dx)>Math.abs(dy)*1.5)changePage(currentPage+(dx<0?1:-1));
    touchStart=null;
  },{passive:true});
  handleRoute();
}

setupMainSite();
setupViewer();
