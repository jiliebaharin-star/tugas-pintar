const KEY = 'tugas-pintar:v1';
let tasks = JSON.parse(localStorage.getItem(KEY) || '[]');
let currentFilter = 'all';
const $ = id => document.getElementById(id);
const save = () => localStorage.setItem(KEY, JSON.stringify(tasks));
const labels = {high:'Tinggi', medium:'Sederhana', low:'Rendah'};
function render(){
  let visible = tasks.filter(t => currentFilter === 'all' || (currentFilter === 'active' && !t.done) || (currentFilter === 'done' && t.done) || (currentFilter === 'high' && t.priority === 'high' && !t.done));
  $('taskList').innerHTML = visible.map(t => '<article class="task '+(t.done?'done':'')+'"><input class="check" type="checkbox" '+(t.done?'checked':'')+' data-id="'+t.id+'"><div><p class="task-title">'+t.title.replace(/</g,'&lt;')+'</p><div class="meta"><span class="badge '+t.priority+'">'+labels[t.priority]+'</span>'+(t.due?'<span>📅 '+t.due+'</span>':'')+'</div></div><button class="delete" data-delete="'+t.id+'">×</button></article>').join('');
  $('emptyState').classList.toggle('hidden', visible.length > 0); $('totalCount').textContent=tasks.length; $('activeCount').textContent=tasks.filter(t=>!t.done).length; $('doneCount').textContent=tasks.filter(t=>t.done).length;
}
function add(){ const title=$('taskInput').value.trim(); if(!title)return $('taskInput').focus(); tasks.unshift({id:Date.now().toString(),title,priority:$('priorityInput').value,due:$('dateInput').value,done:false}); save(); $('taskInput').value=''; $('dateInput').value=''; render(); $('taskInput').focus(); }
$('addTask').onclick=add; $('taskInput').addEventListener('keydown',e=>{if(e.key==='Enter')add()});
document.querySelector('.filters').onclick=e=>{const b=e.target.closest('.filter');if(!b)return;currentFilter=b.dataset.filter;document.querySelectorAll('.filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');render()};
$('taskList').onclick=e=>{const id=e.target.dataset.id||e.target.dataset.delete;if(!id)return;if(e.target.matches('.check'))tasks.find(t=>t.id===id).done=e.target.checked;else if(e.target.matches('.delete'))tasks=tasks.filter(t=>t.id!==id);save();render()};
$('clearCompleted').onclick=()=>{tasks=tasks.filter(t=>!t.done);save();render()}; render();
