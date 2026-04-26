(function(){
  var html=document.documentElement;
  var btn=document.querySelector('[data-theme-toggle]');
  var stored=null;
  try{stored=sessionStorage.getItem('cv_theme');}catch(e){}
  var dark=window.matchMedia('(prefers-color-scheme:dark)').matches;
  var theme=stored||(dark?'dark':'light');
  html.setAttribute('data-theme',theme);
  update(theme);
  if(btn)btn.addEventListener('click',function(){
    theme=theme==='dark'?'light':'dark';
    html.setAttribute('data-theme',theme);
    update(theme);
    try{sessionStorage.setItem('cv_theme',theme);}catch(e){}
  });
  function update(t){
    if(!btn)return;
    btn.innerHTML=t==='dark'
      ?'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
      :'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    btn.setAttribute('aria-label',t==='dark'?'Светлая тема':'Тёмная тема');
  }
}());


var toast=document.getElementById('save-toast');
var toastTimer=null;
function showToast(){
  toast.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer=setTimeout(function(){toast.classList.remove('visible');},1800);
}


function saveAll(){
  var data={};
  document.querySelectorAll('[contenteditable="true"]').forEach(function(el){
    if(el.id && !el.closest('#skills-list') && !el.closest('#languages-list') && 
       !el.closest('#experience-list') && !el.closest('#education-list') && !el.closest('#projects-list')){
      data[el.id]=el.innerHTML;
    }
  });
  data['skills-html'] = document.getElementById('skills-list').innerHTML;
  data['langs-html'] = document.getElementById('languages-list').innerHTML;
  data['experience-html'] = document.getElementById('experience-list').innerHTML;
  data['education-html'] = document.getElementById('education-list').innerHTML;
  data['projects-html'] = document.getElementById('projects-list').innerHTML;
  
  try{localStorage.setItem('resume_v2',JSON.stringify(data));}catch(e){}
  showToast();
}


function loadAll(){
  var raw=null;
  try{raw=localStorage.getItem('resume_v2');}catch(e){}
  if(!raw)return;
  try{
    var data = JSON.parse(raw);
    Object.keys(data).forEach(function(k){
      if(k === 'skills-html'){
        document.getElementById('skills-list').innerHTML = data[k];
      } else if (k === 'langs-html') {
        document.getElementById('languages-list').innerHTML = data[k];
      } else if (k === 'experience-html') {
        document.getElementById('experience-list').innerHTML = data[k];
      } else if (k === 'education-html') {
        document.getElementById('education-list').innerHTML = data[k];
      } else if (k === 'projects-html') {
        document.getElementById('projects-list').innerHTML = data[k];
      } else {
        var el=document.getElementById(k);
        if(el) el.innerHTML=data[k];
      }
    });
  }catch(e){}
}


function debounce(fn,d){var t;return function(){clearTimeout(t);t=setTimeout(fn,d);};}
var dSave=debounce(saveAll,600);


document.addEventListener('input', function(e){
  if(e.target.getAttribute('contenteditable') === 'true') {
    dSave();
    if(!e.target.closest('.resume-header')){
      e.target.classList.remove('saved');
      void e.target.offsetWidth;
      e.target.classList.add('saved');
    }
  }
});


document.addEventListener('animationend', function(e){
  if(e.target.classList.contains('saved')) {
    e.target.classList.remove('saved');
  }
});


document.addEventListener('click', function(e){
  if(e.target.closest('.delete-btn')){
    var item = e.target.closest('.skill-tag, .lang-item, .exp-item, .edu-item');
    if(item) {
      item.remove();
      dSave();
    }
  }
  if(e.target.closest('.clickable-bar')){
    var bar = e.target.closest('.clickable-bar');
    var rect = bar.getBoundingClientRect();
    var percent = Math.max(5, Math.min(100, Math.round(((e.clientX - rect.left) / rect.width) * 100)));
    bar.querySelector('.lang-fill').style.width = percent + '%';
    dSave();
  }
});


document.getElementById('add-skill-btn').addEventListener('click', function(){
  var ul = document.getElementById('skills-list');
  var li = document.createElement('li');
  li.className = 'skill-tag wave-effect';
  li.innerHTML = '<span contenteditable="true">Новый навык</span><button class="delete-btn" contenteditable="false" aria-label="Удалить">&times;</button>';
  ul.appendChild(li);
  dSave();
  li.querySelector('span').focus();
});


document.getElementById('add-lang-btn').addEventListener('click', function(){
  var list = document.getElementById('languages-list');
  var div = document.createElement('div');
  div.className = 'lang-item';
  div.innerHTML = '<div class="lang-header"><div><span class="lang-name" contenteditable="true">Язык</span><span class="lang-level" contenteditable="true">Уровень</span></div><button class="delete-btn" contenteditable="false" aria-label="Удалить">&times;</button></div><div class="lang-bar clickable-bar" title="Кликните для изменения уровня"><div class="lang-fill" style="width:50%"></div></div>';
  list.appendChild(div);
  dSave();
  div.querySelector('.lang-name').focus();
});


document.getElementById('add-exp-btn').addEventListener('click', function(){
  var list = document.getElementById('experience-list');
  var article = document.createElement('article');
  article.className = 'exp-item';
  article.innerHTML = '<div class="exp-header"><span class="exp-role wave-effect" contenteditable="true">Должность</span><span class="exp-date wave-effect" contenteditable="true">Период</span></div><p class="exp-company wave-effect" contenteditable="true">Компания, Город</p><p class="exp-desc wave-effect" contenteditable="true">Описание</p><button class="delete-btn" contenteditable="false" aria-label="Удалить" style="margin-top:8px;">&times;</button>';
  list.appendChild(article);
  dSave();
  article.querySelector('.exp-role').focus();
});


document.getElementById('add-proj-btn').addEventListener('click', function(){
  var list = document.getElementById('projects-list');
  var article = document.createElement('article');
  article.className = 'exp-item';
  article.innerHTML = '<div class="exp-header"><span class="exp-role wave-effect" contenteditable="true">Проект</span><span class="exp-date wave-effect" contenteditable="true">Дата</span></div><p class="exp-desc wave-effect" contenteditable="true">Описание</p><button class="delete-btn" contenteditable="false" aria-label="Удалить" style="margin-top:8px;">&times;</button>';
  list.appendChild(article);
  dSave();
  article.querySelector('.exp-role').focus();
});


document.getElementById('add-edu-btn').addEventListener('click', function(){
  var list = document.getElementById('education-list');
  var div = document.createElement('div');
  div.className = 'edu-item';
  div.innerHTML = '<p class="edu-degree wave-effect" contenteditable="true">Специальность</p><p class="edu-school wave-effect" contenteditable="true">Учреждение</p><p class="edu-year wave-effect" contenteditable="true">Годы</p><button class="delete-btn" contenteditable="false" aria-label="Удалить" style="margin-top:4px;">&times;</button>';
  list.appendChild(div);
  dSave();
  div.querySelector('.edu-degree').focus();
});


loadAll();


document.getElementById('reset-btn').addEventListener('click',function(){
  if(!confirm('Сбросить все изменения и очистить списки?'))return;
  try{localStorage.removeItem('resume_v2');}catch(e){}
  location.reload();
});


function ripple(e){
  var el=e.currentTarget;
  if(e.target.closest('.delete-btn') || e.target.closest('.clickable-bar')) return;
  var onDark=!!el.closest('.resume-header');
  var c=document.createElement('span');
  var d=Math.max(el.offsetWidth,el.offsetHeight);
  c.style.width=c.style.height=d+'px';
  var r=el.getBoundingClientRect();
  var cx=e.clientX||(r.left+r.width/2);
  var cy=e.clientY||(r.top+r.height/2);
  c.style.left=(cx-r.left-d/2)+'px';
  c.style.top=(cy-r.top-d/2)+'px';
  c.classList.add('ripple',onDark?'ripple-light':'ripple-dark');
  var old=el.querySelector('.ripple');if(old)old.remove();
  el.appendChild(c);
  c.addEventListener('animationend',function(){c.remove();});
}
document.addEventListener('mousedown', function(e){
  var waveEl = e.target.closest('.wave-effect');
  if(waveEl) ripple({currentTarget: waveEl, clientX: e.clientX, clientY: e.clientY, target: e.target});
});


document.getElementById('download-btn').addEventListener('click',function(){
  var btn=this;
  btn.disabled=true;
  btn.textContent='Генерация...';
  
  document.body.classList.add('pdf-mode');
  
  var el=document.getElementById('resume-container');
  html2pdf().set({
    margin:[8,8,8,8],
    filename:'resume.pdf',
    image:{type:'jpeg',quality:.98},
    html2canvas:{scale:2,useCORS:true,backgroundColor:'#ffffff'},
    jsPDF:{unit:'mm',format:'a4',orientation:'portrait'}
  }).from(el).save().then(function(){
    document.body.classList.remove('pdf-mode');
    btn.disabled=false;
    btn.innerHTML='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Скачать PDF';
  });
});





// TOUCH SUPPORT
document.addEventListener('touchstart', function(e){
  var waveEl = e.target.closest('.wave-effect');
  if(waveEl) {
    var touch = e.touches[0];
    ripple({
      currentTarget: waveEl,
      clientX: touch.clientX,
      clientY: touch.clientY,
      target: e.target
    });
  }
});

document.addEventListener('touchend', function(e){
  if(e.target.getAttribute('contenteditable') === 'true') {
    e.target.focus();
  }
});

document.addEventListener('touchmove', function(e){
  if(e.target.closest('.clickable-bar')){
    e.preventDefault();
    var bar = e.target.closest('.clickable-bar');
    var touch = e.touches[0];
    var rect = bar.getBoundingClientRect();
    var percent = Math.max(5, Math.min(100, Math.round(((touch.clientX - rect.left) / rect.width) * 100)));
    bar.querySelector('.lang-fill').style.width = percent + '%';
    dSave();
  }
});