(function(){
  const CART_KEY='jacquet_cart_v1';
  const PRODUCTS={
    'Performance Tee':{price:68,image:'https://images.pexels.com/photos/15326698/pexels-photo-15326698.jpeg?auto=compress&cs=tinysrgb&w=1000',size:'M',color:'Bone'},
    'Training Shorts':{price:54,image:'https://images.pexels.com/photos/21923387/pexels-photo-21923387.jpeg?auto=compress&cs=tinysrgb&w=1000',size:'M',color:'Slate Grey'},
    'Zip Hoodie':{price:108,image:'https://images.pexels.com/photos/38719294/pexels-photo-38719294.jpeg?auto=compress&cs=tinysrgb&w=1000',size:'L',color:'Black'},
    'Quarter-Zip Pullover':{price:92,image:'https://images.pexels.com/photos/28757997/pexels-photo-28757997.jpeg?auto=compress&cs=tinysrgb&w=1000'},
    'Compression Leggings':{price:64,image:'https://images.pexels.com/photos/19406134/pexels-photo-19406134.jpeg?auto=compress&cs=tinysrgb&w=1000'},
    'Team Jersey':{price:76,image:'https://images.pexels.com/photos/8289430/pexels-photo-8289430.jpeg?auto=compress&cs=tinysrgb&w=1000'}
  };
  function getCart(){try{return JSON.parse(localStorage.getItem(CART_KEY)||'[]')}catch(e){return []}}
  function saveCart(c){localStorage.setItem(CART_KEY,JSON.stringify(c)); updateCartBadge();}
  function money(n){return '$'+Number(n).toFixed(2)}
  function toast(msg){
    let t=document.getElementById('jacquet-toast');
    if(!t){t=document.createElement('div');t.id='jacquet-toast';t.style.cssText='position:fixed;left:50%;bottom:28px;transform:translateX(-50%);background:#111;color:#fff;padding:14px 20px;font:600 12px Arial,sans-serif;letter-spacing:.5px;z-index:9999;box-shadow:0 8px 30px rgba(0,0,0,.18);';document.body.appendChild(t)}
    t.textContent=msg;t.style.opacity='1';clearTimeout(t._timer);t._timer=setTimeout(()=>t.style.opacity='0',2200);
  }
  function updateCartBadge(){
    const count=getCart().reduce((n,i)=>n+i.qty,0);
    document.querySelectorAll('a[href="cart.html"]').forEach(a=>{
      if(a.querySelector('.icon-btn')){a.setAttribute('aria-label','Cart ('+count+' items)');}
    });
  }
  window.toggleNav=function(){
    const links=document.querySelector('.nav-links'), btn=document.querySelector('.nav-toggle');
    if(!links)return; links.classList.toggle('open'); if(btn)btn.classList.toggle('open');
  };
  function bindProduct(){
    const add=[...document.querySelectorAll('a.btn-primary')].find(a=>a.textContent.includes('ADD TO CART'));
    if(!add)return;
    add.addEventListener('click',function(e){
      e.preventDefault();
      const name=document.querySelector('h1')?.textContent.trim()||'Performance Tee';
      const p=PRODUCTS[name]||PRODUCTS['Performance Tee'];
      const selects=[...document.querySelectorAll('select')];
      const size=selects[0]?.value||p.size||'M', color=selects[1]?.value||p.color||'Bone';
      const qty=Math.max(1,parseInt(document.querySelector('input[type=number]')?.value||'1',10));
      const cart=getCart();
      const found=cart.find(i=>i.name===name&&i.size===size&&i.color===color);
      if(found)found.qty+=qty; else cart.push({name,price:p.price,image:p.image,size,color,qty});
      saveCart(cart); toast(name+' added to cart'); setTimeout(()=>location.href='cart.html',450);
    });
  }
  function bindCart(){
    if(!location.pathname.endsWith('/cart.html'))return;
    let cart=getCart();
    const rows=[...document.querySelectorAll('.cart-row')];
    rows.forEach((row,idx)=>{
      const title=row.querySelector('h3')?.textContent.trim(); if(!title)return;
      const minus=row.querySelector('.qty button:first-child'), plus=row.querySelector('.qty button:last-child'), span=row.querySelector('.qty span');
      const item=cart.find(i=>i.name===title)||cart[idx];
      if(item){if(!cart.includes(item))cart.push(item); span.textContent=item.qty; const priceEl=row.lastElementChild; if(priceEl)priceEl.textContent=money(item.price*item.qty);}
      const change=(delta)=>{
        const i=cart.find(x=>x.name===title); if(!i)return;
        i.qty=Math.max(1,i.qty+delta); saveCart(cart); span.textContent=i.qty;
        const priceEl=row.lastElementChild;if(priceEl)priceEl.textContent=money(i.price*i.qty); recalc();
      };
      minus?.addEventListener('click',()=>change(-1));plus?.addEventListener('click',()=>change(1));
    });
    function recalc(){
      const subtotal=cart.reduce((n,i)=>n+i.price*i.qty,0);
      const lines=[...document.querySelectorAll('.summary-line')];
      const sub=lines.find(x=>x.firstElementChild?.textContent.trim()==='Subtotal');
      const total=lines.find(x=>x.classList.contains('total'));
      if(sub)sub.lastElementChild.textContent=money(subtotal);if(total)total.lastElementChild.textContent=money(subtotal);
    }
    // Keep the demo cart internally consistent if the user refreshes.
    if(cart.length){recalc();}
  }
  function bindSearch(){
    if(!location.pathname.endsWith('/search.html'))return;
    const input=document.querySelector('input[placeholder*="Search products"]'); if(!input)return;
    const cards=[...document.querySelectorAll('.grid.grid-4 .card')];
    const label=document.querySelector('.results-label');
    const run=()=>{const q=input.value.trim().toLowerCase();let visible=0;cards.forEach(c=>{const ok=!q||c.textContent.toLowerCase().includes(q);c.style.display=ok?'':'none';if(ok)visible++});if(label)label.textContent=q?'RESULTS FOR "'+input.value.toUpperCase()+'"':'RESULTS FOR "PERFORMANCE TEE"';};
    input.addEventListener('input',run);
    input.addEventListener('keydown',e=>{if(e.key==='Enter')run()});
  }
  function bindForms(){
    document.querySelectorAll('form').forEach(form=>{
      form.addEventListener('submit',function(e){e.preventDefault();
        if(!form.checkValidity()){form.reportValidity();return;}
        toast('Thanks — your request has been received.');form.reset();
      });
    });
    document.querySelectorAll('form + button, form button[type="button"]').forEach(btn=>{
      btn.addEventListener('click',function(){const form=btn.closest('form');if(form){if(!form.checkValidity()){form.reportValidity();return;}toast('Thanks — your request has been received.');form.reset();}});
    });
  }
  function bindAccount(){
    if(!location.pathname.endsWith('/account.html'))return;
    document.querySelectorAll('.tab-panel button').forEach(btn=>btn.addEventListener('click',()=>toast('Demo account: changes are saved locally for this prototype.')));
  }
  function bindReveal(){
    const els=document.querySelectorAll('.reveal, .reveal-stagger');
    if(!els.length) return;
    if(!('IntersectionObserver' in window)){ els.forEach(el=>el.classList.add('is-visible')); return; }
    const io=new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){ entry.target.classList.add('is-visible'); io.unobserve(entry.target); }
      });
    }, { threshold:0.15, rootMargin:'0px 0px -40px 0px' });
    els.forEach(el=>io.observe(el));
  }
  bindProduct();bindCart();bindSearch();bindForms();bindAccount();updateCartBadge();bindReveal();
})();
