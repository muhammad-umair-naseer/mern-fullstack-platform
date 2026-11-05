import { h, button, run, result, section, outName, notice, dropzone, select } from '../core/ui.js';
import { openRenderedPdf, renderPdfPage, rasterRedact } from '../core/pdf-raster-redact.js';
export function mount(root) {
  let pdf, file, index = 0, controller, revision = 0;
  const marks = new Map(), host = h('div'), out = h('div'), status = h('p', { role: 'status' });
  const picker = select([], '');
  const draw = async () => {
    const version = ++revision;
    const canvas = await renderPdfPage(pdf, index, 1);
    if (version !== revision) return;
    canvas.style.cssText = 'width:100%;display:block;pointer-events:none';
    const box = h('div', { style: { position:'relative', maxWidth:'600px', touchAction:'none', border:'1px solid #ccc', cursor:'crosshair' }, 'aria-label':'Drag on this page to mark information for removal' }, canvas);
    const rects = marks.get(index) || []; marks.set(index, rects);
    const overlay = () => { box.querySelectorAll('.redaction-mark').forEach(e=>e.remove()); for(const r of rects)box.append(h('div.redaction-mark',{style:{position:'absolute',left:r.x*100+'%',top:r.y*100+'%',width:r.w*100+'%',height:r.h*100+'%',background:'#000',pointerEvents:'none'}})); };
    const point = e => { const b=box.getBoundingClientRect();return {x:Math.max(0,Math.min(1,(e.clientX-b.left)/b.width)),y:Math.max(0,Math.min(1,(e.clientY-b.top)/b.height))}; };
    let start, active;
    box.onpointerdown=e=>{start=point(e);active={...start,w:0,h:0};rects.push(active);box.setPointerCapture(e.pointerId);};
    box.onpointermove=e=>{if(!start)return;const p=point(e);Object.assign(active,{x:Math.min(start.x,p.x),y:Math.min(start.y,p.y),w:Math.abs(p.x-start.x),h:Math.abs(p.y-start.y)});overlay();};
    box.onpointerup=()=>{if(active&&(active.w<0.002||active.h<0.002))rects.splice(rects.indexOf(active),1);start=null;active=null;overlay();};
    overlay(); host.replaceChildren(box);
  };
  picker.onchange=()=>{index=Number(picker.value);draw().catch(e=>{status.textContent=e.message;});};
  const go=button('Create redacted PDF',()=>run(go,async()=>{
    if(!pdf)throw new Error('Choose a PDF first.');controller=new AbortController();
    const data=await rasterRedact(pdf,new Map([...marks].map(([page, rects]) => [page, rects.map(r => ({...r}))])),{signal:controller.signal,progress:(n,total)=>{status.textContent=`Processed ${n}/${total} pages`;}});
    out.replaceChildren(result({title:'Redacted PDF',data,name:outName(file,'redacted','pdf'),mime:'application/pdf'}));
  },out),'primary big');
  root.append(h('div.tool.two',h('div.stack',section('1. PDF',notice('Redaction creates a new image-only PDF. Text search, links, forms and digital signatures are removed on ALL pages. Review every marked page before sharing.'),dropzone({accept:'.pdf,application/pdf',onFiles:async([f])=>{
    if(f.size>50*1024*1024)throw new Error('Use a PDF up to 50 MB.');
    const next=await openRenderedPdf(new Uint8Array(await f.arrayBuffer()));if(next.numPages>100){await next.destroy();throw new Error('Use a PDF with at most 100 pages.');}
    await pdf?.destroy();pdf=next;file=f;index=0;marks.clear();out.replaceChildren();picker.replaceChildren(...Array.from({length:pdf.numPages},(_,i)=>h('option',{value:i},`Page ${i+1}`)));await draw();
  }})),section('2. Mark and export',picker,button('Redact entire page',()=>{marks.set(index,[{x:0,y:0,w:1,h:1}]);draw().catch(e=>{status.textContent=e.message;});}),button('Clear this page',()=>{marks.set(index,[]);draw().catch(e=>{status.textContent=e.message;});}),go,button('Cancel',()=>controller?.abort()),status)),h('div',host,out)));
  return ()=>{revision++;controller?.abort();pdf?.destroy();};
}
