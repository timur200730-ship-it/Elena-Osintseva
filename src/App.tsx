import { useMemo, useState } from 'react'
import {
  Home, Flower2, BookHeart, MessageCircle, UserRound, Heart, Sparkles,
  Wind, CalendarDays, ChevronRight, Send, ShieldCheck, Sun, Moon,
  Smile, Meh, Frown, X, ArrowLeft, Check, Menu
} from 'lucide-react'

type Tab = 'home' | 'practices' | 'journal' | 'chat' | 'profile'
type Mood = 'тяжело' | 'не очень' | 'нормально' | 'хорошо' | 'прекрасно'

const CONTACTS = {
  // Add Elena's real contact links here before publishing.
  max: '',
  telegram: '',
  whatsapp: ''
}

const practices = [
  { title: 'Вернуться в настоящий момент', tag: 'Когда много тревожных мыслей', time: '3 минуты', icon: Wind, description: 'Мягко переключить внимание с тревожных мыслей на то, что происходит здесь и сейчас.' },
  { title: 'Дать чувствам место', tag: 'Когда эмоции переполняют', time: '5 минут', icon: Heart, description: 'Заметьте чувство, назовите его и попробуйте понять, о чём оно может вам сообщать.' },
  { title: 'Найти внутреннюю опору', tag: 'Когда нужна уверенность', time: '7 минут', icon: Sun, description: 'Вспомните собственные ресурсы, людей и события, которые помогают вам справляться.' },
  { title: 'Мягкие личные границы', tag: 'Когда трудно сказать «нет»', time: '8 минут', icon: Flower2, description: 'Исследуйте, что для вас приемлемо, а что хотелось бы изменить в общении.' }
]

const moodFaces: { mood: Mood; icon: typeof Smile; color: string }[] = [
  { mood: 'тяжело', icon: Frown, color: '#b77a75' },
  { mood: 'не очень', icon: Meh, color: '#c69b75' },
  { mood: 'нормально', icon: Smile, color: '#a8a17d' },
  { mood: 'хорошо', icon: Smile, color: '#82a68d' },
  { mood: 'прекрасно', icon: Heart, color: '#bd8a9c' }
]

function App() {
  const [tab, setTab] = useState<Tab>('home')
  const [mood, setMood] = useState<Mood | ''>('')
  const [note, setNote] = useState('')
  const [saved, setSaved] = useState(false)
  const [activePractice, setActivePractice] = useState<number | null>(null)
  const [chatInput, setChatInput] = useState('')
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; text: string }[]>([
    { role: 'assistant', text: 'Здравствуйте. Я бережный цифровой помощник пространства Елены. Могу помочь вам немного разобраться в своих чувствах и подобрать простую практику. С чего вам хотелось бы начать?' }
  ])
  const [menuOpen, setMenuOpen] = useState(false)

  const today = useMemo(() => new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long' }).format(new Date()), [])
  const savedEntries = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('elena-journal') || '[]') as { date: string; mood: Mood; note: string }[] }
    catch { return [] }
  }, [saved])

  function saveJournal() {
    if (!mood) return
    const current = [...savedEntries, { date: new Date().toISOString(), mood, note }]
    localStorage.setItem('elena-journal', JSON.stringify(current))
    setSaved(true)
    setNote('')
    setMood('')
  }

  function sendMessage() {
    const value = chatInput.trim()
    if (!value) return
    setMessages(prev => [...prev, { role: 'user', text: value }])
    setChatInput('')
    // Demo response only. Connect a reviewed, privacy-aware AI backend before public launch.
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'assistant', text: 'Спасибо, что поделились. Давайте не будем торопиться с выводами. Попробуйте заметить: что сейчас для вас самое важное в этой ситуации? Где это ощущается в теле? Если хотите, я могу предложить короткую практику. Я не заменяю психолога и не являюсь экстренной службой.' }])
    }, 450)
  }

  function contactLink() {
    return CONTACTS.max || CONTACTS.telegram || CONTACTS.whatsapp
  }

  function openBooking() {
    const link = contactLink()
    if (link) window.open(link, '_blank', 'noopener,noreferrer')
    else setTab('profile')
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-mark"><Heart size={21} /></div>
        <div className="brand-copy"><strong>Можно быть собой</strong><span>Елена Осинцева · психолог</span></div>
        <button className="icon-button" aria-label="Меню" onClick={() => setMenuOpen(!menuOpen)}><Menu size={21}/></button>
      </header>

      {menuOpen && <div className="menu-pop"><button onClick={() => { setTab('profile'); setMenuOpen(false) }}>О Елене</button><button onClick={() => { setTab('journal'); setMenuOpen(false) }}>Мой дневник</button><button onClick={() => { setTab('chat'); setMenuOpen(false) }}>ИИ-помощник</button></div>}

      <main>
        {tab === 'home' && <section className="home-view">
          <div className="hero">
            <img src={`${import.meta.env.BASE_URL}images/elena-osintseva.jpg`} alt="Елена Осинцева" className="hero-photo"/>
            <div className="hero-shade"/>
            <div className="hero-content">
              <span className="eyebrow">ПРОСТРАНСТВО ЗАБОТЫ О СЕБЕ</span>
              <h1>Можно быть<br/><em>собой.</em></h1>
              <p>Место, где можно остановиться, услышать себя и найти внутреннюю опору.</p>
              <button className="primary-button" onClick={() => setTab('chat')}><MessageCircle size={19}/> Мне нужна поддержка</button>
            </div>
          </div>

          <div className="welcome-row"><div><span className="eyebrow">ВАШ МАЛЕНЬКИЙ ШАГ</span><h2>С чего начнём сегодня?</h2></div><span className="date-pill">{today}</span></div>

          <div className="feature-grid">
            <button className="feature-card" onClick={() => setTab('practices')}><span className="feature-icon peach"><Flower2/></span><strong>Практики</strong><small>Небольшие упражнения для себя</small><ChevronRight className="feature-arrow"/></button>
            <button className="feature-card" onClick={() => setTab('journal')}><span className="feature-icon lilac"><BookHeart/></span><strong>Дневник чувств</strong><small>Замечать и понимать эмоции</small><ChevronRight className="feature-arrow"/></button>
            <button className="feature-card" onClick={() => setTab('chat')}><span className="feature-icon blue"><Sparkles/></span><strong>ИИ-помощник</strong><small>Бережный диалог без оценок</small><ChevronRight className="feature-arrow"/></button>
            <button className="feature-card" onClick={openBooking}><span className="feature-icon green"><CalendarDays/></span><strong>Консультация</strong><small>Связаться с Еленой</small><ChevronRight className="feature-arrow"/></button>
          </div>

          <div className="quote-card"><span>«</span><p>Не обязательно иметь все ответы прямо сейчас. Иногда достаточно сделать один бережный шаг.</p><small>Пространство Елены Осинцевой</small></div>
          <button className="booking-banner" onClick={openBooking}><span><strong>Хотите поговорить с Еленой?</strong><small>Выберите удобный способ связи</small></span><Send size={20}/></button>
        </section>}

        {tab === 'practices' && <section className="page-view">
          <button className="back-link" onClick={() => setTab('home')}><ArrowLeft size={16}/> На главную</button>
          <span className="eyebrow">БЕРЕЖНО К СЕБЕ</span><h1 className="page-title">Практики<br/><em>для себя</em></h1>
          <p className="page-intro">Выберите то, что сейчас откликается. Можно идти в своём темпе и остановиться в любой момент.</p>
          <div className="practice-list">
            {practices.map((p, i) => { const Icon = p.icon; return <button className="practice-card" key={p.title} onClick={() => setActivePractice(i)}><span className="practice-icon"><Icon/></span><span className="practice-copy"><strong>{p.title}</strong><small>{p.tag}</small><small className="duration">{p.time}</small></span><ChevronRight/></button> })}
          </div>
          {activePractice !== null && <div className="modal-backdrop" onClick={() => setActivePractice(null)}><div className="modal-card" onClick={e => e.stopPropagation()}><button className="modal-close" onClick={() => setActivePractice(null)}><X/></button><span className="eyebrow">НЕБОЛЬШАЯ ПРАКТИКА</span><h2>{practices[activePractice].title}</h2><p>{practices[activePractice].description}</p><div className="practice-instruction">Устройтесь поудобнее. Сделайте спокойный вдох и мягкий выдох. Не нужно добиваться особого состояния — просто побудьте рядом с собой несколько минут.</div><button className="primary-button full" onClick={() => setActivePractice(null)}>Я попробую</button></div></div>}
        </section>}

        {tab === 'journal' && <section className="page-view">
          <button className="back-link" onClick={() => setTab('home')}><ArrowLeft size={16}/> На главную</button>
          <span className="eyebrow">МОЁ ЛИЧНОЕ ПРОСТРАНСТВО</span><h1 className="page-title">Дневник<br/><em>чувств</em></h1>
          <p className="page-intro">Здесь не нужно быть правильным. Можно честно отметить то, что происходит внутри.</p>
          <div className="journal-card"><label>Как вы себя чувствуете сегодня?</label><div className="mood-row">{moodFaces.map(({mood: m, icon: Icon, color}) => <button key={m} className={`mood-choice ${mood === m ? 'selected' : ''}`} onClick={() => setMood(m)}><Icon style={{color}}/><small>{m}</small></button>)}</div><label htmlFor="journal-note">Что хотелось бы записать?</label><textarea id="journal-note" value={note} onChange={e => setNote(e.target.value)} placeholder="Мысли, чувства, события или просто несколько слов о себе…"/><button className="primary-button full" disabled={!mood} onClick={saveJournal}><Check size={18}/> Сохранить запись</button><small className="privacy-note"><ShieldCheck size={14}/> Записи сохраняются локально на этом устройстве в демоверсии.</small></div>
          <div className="entries"><h3>Мои заметки</h3>{savedEntries.length === 0 ? <p className="empty-state">Пока здесь тихо. Первая запись появится, когда вы решите ею поделиться.</p> : [...savedEntries].reverse().map((entry, i) => <div className="entry" key={i}><div><strong>{entry.mood}</strong><small>{new Date(entry.date).toLocaleString('ru-RU')}</small></div><p>{entry.note || 'Без дополнительной заметки'}</p></div>)}</div>
        </section>}

        {tab === 'chat' && <section className="page-view chat-view">
          <button className="back-link" onClick={() => setTab('home')}><ArrowLeft size={16}/> На главную</button>
          <div className="assistant-heading"><span className="assistant-avatar"><Sparkles/></span><div><span className="eyebrow">БЕРЕЖНЫЙ ДИАЛОГ</span><h1 className="page-title">Рядом,<br/><em>чтобы услышать</em></h1></div></div>
          <p className="page-intro">Можно начать с любого вопроса. Вы сами решаете, чем делиться и когда остановиться.</p>
          <div className="chat-disclaimer"><ShieldCheck size={17}/> Это демонстрационный помощник. Он не заменяет консультацию психолога, не ставит диагнозы и не предназначен для кризисной помощи.</div>
          <div className="messages">{messages.map((m, i) => <div className={`message ${m.role}`} key={i}>{m.text}</div>)}</div>
          <div className="chat-compose"><input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()} placeholder="Напишите, что сейчас важно…"/><button onClick={sendMessage} aria-label="Отправить"><Send size={19}/></button></div>
          <p className="crisis-note">Если вы или кто-то рядом в непосредственной опасности, обратитесь в местную экстренную службу или к человеку, который может помочь прямо сейчас.</p>
        </section>}

        {tab === 'profile' && <section className="page-view">
          <button className="back-link" onClick={() => setTab('home')}><ArrowLeft size={16}/> На главную</button>
          <div className="profile-hero"><img src={`${import.meta.env.BASE_URL}images/elena-osintseva.jpg`} alt="Елена Осинцева"/><span className="eyebrow">ПСИХОЛОГ</span><h1>Елена<br/><em>Осинцева</em></h1><p>Помогаю внимательнее относиться к себе, понимать свои чувства и находить собственные решения.</p></div>
          <div className="about-card"><h3>О консультациях</h3><p>Здесь появится информация о подходе Елены, направлениях работы, форматах и продолжительности консультаций.</p><p className="muted">Текст и профессиональные сведения необходимо согласовать с Еленой перед публикацией.</p></div>
          <div className="about-card"><h3>Связаться с Еленой</h3><p>Выберите удобный мессенджер. Ссылки добавляются в настройках проекта перед запуском.</p><div className="messenger-buttons">{(['MAX','Telegram','WhatsApp'] as const).map((name, i) => <button key={name} onClick={() => { const url = [CONTACTS.max, CONTACTS.telegram, CONTACTS.whatsapp][i]; if (url) window.open(url, '_blank', 'noopener,noreferrer') }} disabled={!([CONTACTS.max, CONTACTS.telegram, CONTACTS.whatsapp][i])}>{name}<ChevronRight size={16}/></button>)}</div><small className="privacy-note">Контактные ссылки пока не подключены.</small></div>
        </section>}
      </main>

      <nav className="bottom-nav">
        {([
          ['home', Home, 'Главная'], ['practices', Flower2, 'Практики'], ['journal', BookHeart, 'Дневник'], ['chat', MessageCircle, 'Помощник'], ['profile', UserRound, 'Елена']
        ] as const).map(([id, Icon, label]) => <button key={id} className={tab === id ? 'active' : ''} onClick={() => setTab(id)}><Icon size={20}/><small>{label}</small></button>)}
      </nav>
      <footer className="footer-note">Пространство заботы о себе <span>·</span> Елена Осинцева</footer>
    </div>
  )
}
export default App
