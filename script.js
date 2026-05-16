const chats = [
  { id: 1, name: 'Alice Freeman', avatar: 'https://ui-avatars.com/api/?name=Alice+Freeman&background=random', last: 'Hey! Are we still on for today?', time: '10:35', unread: 3, online: true, messages: [
    { text: 'Hey! Are we still on for today?', time: '10:35', sent: false },
    { text: 'Yes, absolutely.', time: '10:36', sent: true }
  ]},
  { id: 2, name: 'Bob Smith', avatar: 'https://ui-avatars.com/api/?name=Bob+Smith&background=random', last: 'Sent the files.', time: '09:15', unread: 0, online: false, messages: [
    { text: 'Sent the files.', time: '09:15', sent: false },
    { text: 'Thanks, got them.', time: '09:20', sent: true }
  ]},
  { id: 3, name: 'Charlie Team', avatar: 'https://ui-avatars.com/api/?name=Charlie+Team&background=random', last: 'Meeting at 3 PM', time: 'Yesterday', unread: 1, online: true, messages: [
    { text: 'Meeting at 3 PM', time: 'Yesterday', sent: false }
  ]}
];

let activeId = 1;
const chatListEl = document.getElementById('chatList');
const chatBodyEl = document.getElementById('chatBody');
const headerName = document.getElementById('headerName');
const headerStatus = document.getElementById('headerStatus');
const headerAvatar = document.getElementById('headerAvatar');
const msgInput = document.getElementById('msgInput');
const sendBtn = document.getElementById('sendBtn');

function fmtTime() {
  const d = new Date();
  return d.getHours().toString().padStart(2,'0') + ':' + d.getMinutes().toString().padStart(2,'0');
}

function renderList() {
  chatListEl.innerHTML = '';
  chats.forEach(c => {
    const el = document.createElement('div');
    el.className = 'chat-item' + (c.id === activeId ? ' active' : '');
    el.innerHTML = `<img src="${c.avatar}" alt=""><div class="chat-details"><div class="chat-row"><div class="chat-title">${c.name}</div><div class="chat-time">${c.time}</div></div><div class="chat-row2"><div class="chat-preview">${c.last}</div>${c.unread ? `<div class="chat-badge">${c.unread}</div>` : ''}</div></div>`;
    el.onclick = () => switchChat(c.id);
    chatListEl.appendChild(el);
  });
}

function switchChat(id) {
  activeId = id;
  const c = chats.find(x => x.id === id);
  headerName.textContent = c.name;
  headerStatus.textContent = c.online ? 'online' : 'last seen recently';
  headerStatus.style.color = c.online ? '#25d366' : '#667781';
  headerAvatar.src = c.avatar;
  renderList();
  renderMessages();
}

function renderMessages() {
  const c = chats.find(x => x.id === activeId);
  chatBodyEl.innerHTML = '';
  c.messages.forEach(m => {
    const div = document.createElement('div');
    div.className = 'msg ' + (m.sent ? 'sent' : 'received');
    div.innerHTML = `${m.text}<div class="msg-meta"><span class="msg-time">${m.time}</span>${m.sent ? '<span class="msg-status">✓✓</span>' : ''}</div>`;
    chatBodyEl.appendChild(div);
  });
  chatBodyEl.scrollTop = chatBodyEl.scrollHeight;
}

function sendMessage() {
  const text = msgInput.value.trim();
  if (!text) return;
  const c = chats.find(x => x.id === activeId);
  const t = fmtTime();
  c.messages.push({ text, time: t, sent: true });
  c.last = text;
  c.time = t;
  c.unread = 0;
  msgInput.value = '';
  updateSendIcon();
  renderMessages();
  renderList();
  setTimeout(() => {
    const reply = { text: 'Okay, noted!', time: fmtTime(), sent: false };
    c.messages.push(reply);
    c.last = reply.text;
    c.time = reply.time;
    renderMessages();
    renderList();
  }, 2000);
}

function updateSendIcon() {
  sendBtn.textContent = msgInput.value.trim() ? '➤' : '🎤';
}

sendBtn.onclick = sendMessage;
msgInput.addEventListener('keypress', e => { if (e.key === 'Enter') sendMessage(); });
msgInput.addEventListener('input', updateSendIcon);

renderList();
switchChat(activeId);