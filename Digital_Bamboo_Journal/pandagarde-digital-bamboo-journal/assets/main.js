
const btn=document.querySelector('.menu-btn');const nav=document.querySelector('.nav');if(btn){btn.addEventListener('click',()=>nav.classList.toggle('open'));}
const search=document.querySelector('[data-search]');if(search){search.addEventListener('input',e=>{const q=e.target.value.toLowerCase();document.querySelectorAll('[data-card]').forEach(c=>{c.style.display=c.innerText.toLowerCase().includes(q)?'flex':'none'});});}
