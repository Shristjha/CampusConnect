
import { useMemo, useState } from 'react'
import './App.css'

const initialEvents = [
  { id: 1, title: 'Campus CodeFest', category: 'Technical', date: '2026-11-05', time: '10:00 AM', place: 'Innovation Lab', emoji: '💻', color: 'violet', description: 'Build creative solutions, meet developers, and learn from fellow students.' },
  { id: 2, title: 'Design Showcase', category: 'Design', date: '2026-11-08', time: '02:00 PM', place: 'Design Studio', emoji: '🎨', color: 'peach', description: 'Explore student creativity, digital art, and design projects.' },
  { id: 3, title: 'Open Mic Night', category: 'Cultural', date: '2026-11-12', time: '05:00 PM', place: 'Main Auditorium', emoji: '🎤', color: 'mint', description: 'Share your talent and connect with the campus community.' },
  { id: 4, title: 'Career Connect', category: 'Career', date: '2026-11-15', time: '11:00 AM', place: 'Seminar Hall', emoji: '🚀', color: 'blue', description: 'Explore career paths, internships, and professional opportunities.' },
]

const initialTasks = [
  { id: 1, title: 'Complete OS assignment', subject: 'Operating Systems', due: '2026-11-02', done: false },
  { id: 2, title: 'Prepare ML lab record', subject: 'Machine Learning', due: '2026-11-04', done: false },
  { id: 3, title: 'Revise Java arrays', subject: 'Data Structures', due: '2026-11-06', done: true },
]

const initialNotes = [
  { id: 1, title: 'Operating Systems — Unit 2', subject: 'Operating Systems', semester: 'Semester 3', type: 'PDF', emoji: '📘' },
  { id: 2, title: 'Java Programming Notes', subject: 'Java', semester: 'Semester 3', type: 'PDF', emoji: '☕' },
  { id: 3, title: 'Machine Learning Revision', subject: 'Machine Learning', semester: 'Semester 3', type: 'DOC', emoji: '🧠' },
]

const navItems = [
  { id: 'overview', label: 'Overview', icon: '◫' },
  { id: 'events', label: 'Campus events', icon: '▦' },
  { id: 'clubs', label: 'Student clubs', icon: '♧' },
  { id: 'notes', label: 'Study resources', icon: '▤' },
  { id: 'deadlines', label: 'My deadlines', icon: '◷' },
  { id: 'admin', label: 'Demo admin', icon: '⚙' },
]

function App() {
  const [page, setPage] = useState('overview')
  const [dark, setDark] = useState(false)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [events, setEvents] = useState(initialEvents)
  const [saved, setSaved] = useState([])
  const [registered, setRegistered] = useState([])
  const [tasks, setTasks] = useState(initialTasks)
  const [notes, setNotes] = useState(initialNotes)
  const [taskTitle, setTaskTitle] = useState('')
  const [taskSubject, setTaskSubject] = useState('')
  const [noteQuery, setNoteQuery] = useState('')
  const [message, setMessage] = useState('')
  const [showEventForm, setShowEventForm] = useState(false)
  const [eventTitle, setEventTitle] = useState('')
  const [eventCategory, setEventCategory] = useState('Technical')
  const [eventDate, setEventDate] = useState('2026-11-20')
  const [eventPlace, setEventPlace] = useState('')
  const [eventDescription, setEventDescription] = useState('')

  const filteredEvents = useMemo(() => events.filter(event => {
    const matchesText = `${event.title} ${event.category} ${event.place}`.toLowerCase().includes(query.toLowerCase())
    return matchesText && (category === 'All' || event.category === category)
  }), [events, query, category])

  const filteredNotes = notes.filter(note =>
    `${note.title} ${note.subject}`.toLowerCase().includes(noteQuery.toLowerCase())
  )

  const completedTasks = tasks.filter(task => task.done).length
  const upcomingTasks = tasks.filter(task => !task.done).length

  function notify(text) {
    setMessage(text)
    window.setTimeout(() => setMessage(''), 2800)
  }

  function toggleSaved(id) {
    const isSaved = saved.includes(id)
    setSaved(old => isSaved ? old.filter(item => item !== id) : [...old, id])
    notify(isSaved ? 'Removed from saved events' : 'Event saved successfully')
  }

  function toggleRegistration(id) {
    const isRegistered = registered.includes(id)
    setRegistered(old => isRegistered ? old.filter(item => item !== id) : [...old, id])
    notify(isRegistered ? 'Registration cancelled' : 'You are registered in this demo!')
  }

  function addTask(e) {
    e.preventDefault()
    if (!taskTitle.trim()) return
    setTasks(old => [...old, {
      id: Date.now(),
      title: taskTitle.trim(),
      subject: taskSubject.trim() || 'General',
      due: '2026-11-20',
      done: false,
    }])
    setTaskTitle('')
    setTaskSubject('')
    notify('Deadline task added')
  }

  function addEvent(e) {
    e.preventDefault()
    if (!eventTitle.trim() || !eventPlace.trim()) {
      notify('Please enter an event name and venue')
      return
    }
    setEvents(old => [...old, {
      id: Date.now(),
      title: eventTitle.trim(),
      category: eventCategory,
      date: eventDate,
      time: '10:00 AM',
      place: eventPlace.trim(),
      emoji: '✨',
      color: 'blue',
      description: eventDescription.trim() || 'A new campus community event.',
    }])
    setEventTitle('')
    setEventPlace('')
    setEventDescription('')
    setShowEventForm(false)
    setPage('events')
    notify('Demo event created')
  }

  function handleNoteUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const allowed = /\.(pdf|doc|docx|ppt|pptx|txt)$/i.test(file.name)
    if (!allowed) {
      notify('Choose a PDF, Word, PowerPoint, or TXT file')
      e.target.value = ''
      return
    }
    setNotes(old => [...old, {
      id: Date.now(),
      title: file.name,
      subject: 'My uploads',
      semester: 'Uploaded by you',
      type: file.name.split('.').pop().toUpperCase(),
      emoji: '📎',
      file,
    }])
    notify('File added to this session')
    e.target.value = ''
  }

  
function downloadNote(note) {
  if (note.file) {
    const url = URL.createObjectURL(note.file)
    const link = document.createElement('a')
    link.href = url
    link.download = note.file.name
    document.body.appendChild(link)
    link.click()
    link.remove()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  } else {
    notify('This is a sample resource. Upload the actual PDF first.')
  }
}


  const today = new Date('2026-10-23T12:00:00')
  const dateLabel = new Intl.DateTimeFormat('en', {
    weekday: 'long', month: 'long', day: 'numeric'
  }).format(today)

  return (
    <div className={`app-shell ${dark ? 'dark' : ''}`}>
      <aside className="sidebar">
        <button className="brand" onClick={() => setPage('overview')}>
          <span className="brand-mark">c.</span>
          <span>campus<span className="brand-light">connect</span></span>
        </button>

        <div className="workspace-label">YOUR CAMPUS</div>
        <nav className="side-nav">
          {navItems.map(item => (
            <button
              key={item.id}
              className={`nav-item ${page === item.id ? 'active' : ''}`}
              onClick={() => {
                setPage(item.id)
                setQuery('')
                setMessage('')
              }}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
              {item.id === 'deadlines' && upcomingTasks > 0 && (
                <span className="nav-count">{upcomingTasks}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="help-card">
            <span className="help-emoji">💡</span>
            <strong>Make campus life count.</strong>
            <p>Learn together. Grow together.</p>
          </div>
          <button className="profile-button" onClick={() => notify('Profile editing will be connected with authentication in the next stage.')}>
            <span className="avatar">S</span>
            <span className="profile-copy"><strong>Student profile</strong><small>Demo account</small></span>
            <span className="profile-dots">•••</span>
          </button>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="breadcrumb">Workspace <span>/</span> <strong>{navItems.find(n => n.id === page)?.label || 'Overview'}</strong></div>
          <div className="topbar-actions">
            <span className="date-label">{dateLabel}</span>
            <button className="icon-button" aria-label="Toggle dark mode" onClick={() => setDark(v => !v)}>{dark ? '☀' : '☾'}</button>
            <button className="top-avatar" onClick={() => notify('You are viewing the demo account.')}>S</button>
          </div>
        </header>

        <div className="content">
          {page === 'overview' && (
            <>
              <section className="welcome-row">
                <div>
                  <div className="eyebrow"><span className="live-dot" /> YOUR STUDENT SPACE</div>
                  <h1>Good day, <span className="gradient-text">student.</span> ✨</h1>
                  <p className="subheading">Your campus life, organized in one place.</p>
                </div>
                <button className="primary-button" onClick={() => setPage('events')}>Explore campus <span>↗</span></button>
              </section>

              <section className="stat-grid">
                <div className="stat-card"><div className="stat-top"><span>Upcoming events</span><span className="stat-icon violet-bg">▦</span></div><strong>{events.length}</strong><small>Across campus categories</small></div>
                <div className="stat-card"><div className="stat-top"><span>Saved events</span><span className="stat-icon peach-bg">♡</span></div><strong>{saved.length}</strong><small>Your personal shortlist</small></div>
                <div className="stat-card"><div className="stat-top"><span>Open deadlines</span><span className="stat-icon blue-bg">◷</span></div><strong>{upcomingTasks}</strong><small>{completedTasks} tasks completed</small></div>
                <div className="stat-card"><div className="stat-top"><span>Study resources</span><span className="stat-icon mint-bg">▤</span></div><strong>{notes.length}</strong><small>Resources in this session</small></div>
              </section>

              <section className="hero-banner">
                <div className="hero-copy">
                  <span className="banner-tag">YOUR NEXT CHAPTER STARTS HERE</span>
                  <h2>More than a campus.<br />It's your community.</h2>
                  <p>Find your people, discover opportunities, and make every semester count.</p>
                  <button className="banner-button" onClick={() => setPage('clubs')}>Discover student clubs <span>→</span></button>
                </div>
                <div className="hero-art" aria-hidden="true">
                  <div className="art-orbit orbit-one" />
                  <div className="art-orbit orbit-two" />
                  <div className="art-card art-card-one">🎓<span>Learn</span></div>
                  <div className="art-card art-card-two">💡<span>Create</span></div>
                  <div className="art-card art-card-three">🌱<span>Grow</span></div>
                  <div className="art-center">c.</div>
                </div>
              </section>

              <div className="section-heading">
                <div><div className="eyebrow">DON'T MISS OUT</div><h2>Upcoming events</h2></div>
                <button className="text-button" onClick={() => setPage('events')}>View all events ↗</button>
              </div>
              <div className="event-grid">
                {events.slice(0, 3).map(event => (
                  <EventCard key={event.id} event={event} saved={saved.includes(event.id)} registered={registered.includes(event.id)} onSave={toggleSaved} onRegister={toggleRegistration} />
                ))}
              </div>

              <div className="bottom-grid">
                <section className="panel">
                  <div className="panel-heading"><div><div className="eyebrow">STAY ON TRACK</div><h2>Your deadlines</h2></div><button className="text-button" onClick={() => setPage('deadlines')}>See all →</button></div>
                  {tasks.filter(t => !t.done).slice(0, 3).map(task => <TaskRow key={task.id} task={task} onToggle={id => setTasks(old => old.map(t => t.id === id ? {...t, done: !t.done} : t))} />)}
                  {upcomingTasks === 0 && <p className="empty-text">You're all caught up! 🎉</p>}
                </section>
                <section className="panel">
                  <div className="panel-heading"><div><div className="eyebrow">LEARN SOMETHING</div><h2>Study corner</h2></div><span className="panel-emoji">📚</span></div>
                  {notes.slice(0, 3).map(note => <button className="resource-row" key={note.id} onClick={() => {setPage('notes'); setNoteQuery('')}}><span className="resource-icon">{note.emoji}</span><span className="resource-copy"><strong>{note.title}</strong><small>{note.subject}</small></span><span className="row-arrow">↗</span></button>)}
                </section>
              </div>
            </>
          )}

          {page === 'events' && (
            <>
              <PageTitle eyebrow="DISCOVER YOUR CAMPUS" title="Campus events" subtitle="Find something exciting to learn, build, or experience." />
              <div className="search-toolbar">
                <div className="search-box"><span>⌕</span><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search events, venues, categories..." /></div>
                <select value={category} onChange={e => setCategory(e.target.value)} aria-label="Filter events by category">
                  {['All', 'Technical', 'Design', 'Cultural', 'Career'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <p className="result-label">{filteredEvents.length} event{filteredEvents.length === 1 ? '' : 's'} found</p>
              <div className="event-grid">
                {filteredEvents.map(event => <EventCard key={event.id} event={event} saved={saved.includes(event.id)} registered={registered.includes(event.id)} onSave={toggleSaved} onRegister={toggleRegistration} />)}
              </div>
              {filteredEvents.length === 0 && <EmptyState title="No events found" text="Try a different search or category." />}
            </>
          )}

          {page === 'clubs' && (
            <>
              <PageTitle eyebrow="FIND YOUR PEOPLE" title="Student clubs" subtitle="Explore interests, meet collaborators, and discover new opportunities." />
              <div className="club-feature-grid">
                {[
                  {emoji:'💻',name:'Technology Club',category:'Coding · AI · Hackathons',desc:'Build projects, learn programming, and collaborate on technical challenges.',color:'violet'},
                  {emoji:'🎨',name:'Design Collective',category:'UI/UX · Art · Creativity',desc:'Explore visual design, user experience, and creative projects.',color:'peach'},
                  {emoji:'📸',name:'Photography Club',category:'Photography · Film',desc:'Capture campus life, practice storytelling, and share your work.',color:'blue'},
                  {emoji:'🎭',name:'Cultural Society',category:'Music · Dance · Theatre',desc:'Celebrate culture and express yourself through performances.',color:'mint'},
                  {emoji:'🌱',name:'Green Campus',category:'Sustainability · Volunteering',desc:'Take part in campus cleanups and sustainability initiatives.',color:'mint'},
                  {emoji:'🚀',name:'Entrepreneurship Cell',category:'Startups · Ideas · Business',desc:'Explore startup ideas, pitch solutions, and learn from peers.',color:'peach'},
                ].map(club => <article className="club-card" key={club.name}><div className={`club-art ${club.color}`}>{club.emoji}</div><div className="club-card-body"><span className="club-category">{club.category}</span><h3>{club.name}</h3><p>{club.desc}</p><button className="outline-button" onClick={() => notify(`${club.name}: demo club. Connect real membership and club admins in the backend stage.`)}>Explore club ↗</button></div></article>)}
              </div>
            </>
          )}

          {page === 'notes' && (
            <>
              <PageTitle eyebrow="LEARN TOGETHER" title="Study resources" subtitle="Keep your study materials organized and easy to find." />
              <div className="upload-banner"><div><strong>Have useful notes?</strong><p>Share a PDF, Word document, PowerPoint, or text file in this demo session.</p></div><label className="primary-button upload-label">＋ Upload notes<input type="file" accept=".pdf,.doc,.docx,.ppt,.pptx,.txt" onChange={handleNoteUpload} hidden /></label></div>
              <div className="search-toolbar"><div className="search-box"><span>⌕</span><input value={noteQuery} onChange={e => setNoteQuery(e.target.value)} placeholder="Search subjects and resources..." /></div><span className="result-label">{filteredNotes.length} resources</span></div>
              <div className="resource-grid">{filteredNotes.map(note => <article className="resource-card" key={note.id}><div className="resource-card-icon">{note.emoji}</div><span className="file-type">{note.type}</span><h3>{note.title}</h3><p>{note.subject} · {note.semester}</p><button className="outline-button" onClick={() => downloadNote(note)}>{note.file ? 'Download file ↓' : 'View details ↗'}</button></article>)}</div>
              {filteredNotes.length === 0 && <EmptyState title="No resources found" text="Try searching for another subject." />}
              <p className="notice">Demo mode: uploaded files are available only in this browser session. Shared cloud storage will be added with Supabase.</p>
            </>
          )}

          {page === 'deadlines' && (
            <>
              <PageTitle eyebrow="PLAN YOUR SEMESTER" title="My deadlines" subtitle="Keep assignments and study tasks under control." />
              <div className="deadline-summary"><div><span>To do</span><strong>{upcomingTasks}</strong></div><div><span>Completed</span><strong>{completedTasks}</strong></div><div><span>Total tasks</span><strong>{tasks.length}</strong></div></div>
              <form className="task-form" onSubmit={addTask}><div className="field"><label htmlFor="task-title">Task name</label><input id="task-title" value={taskTitle} onChange={e => setTaskTitle(e.target.value)} placeholder="e.g. Complete DBMS assignment" required /></div><div className="field"><label htmlFor="task-subject">Subject</label><input id="task-subject" value={taskSubject} onChange={e => setTaskSubject(e.target.value)} placeholder="e.g. DBMS" /></div><button className="primary-button" type="submit">＋ Add task</button></form>
              <section className="panel deadline-panel"><div className="panel-heading"><h2>All tasks</h2><span className="result-label">{upcomingTasks} remaining</span></div>{tasks.map(task => <TaskRow key={task.id} task={task} onToggle={id => setTasks(old => old.map(t => t.id === id ? {...t, done: !t.done} : t))} onDelete={id => setTasks(old => old.filter(t => t.id !== id))} />)}{tasks.length === 0 && <EmptyState title="Your list is empty" text="Add a task above to get started." />}</section>
            </>
          )}

          {page === 'admin' && (
            <>
              <PageTitle eyebrow="MANAGE YOUR COMMUNITY" title="Demo admin panel" subtitle="Preview how authorized organizers could manage campus events." />
              <div className="admin-warning">⚠ Demo mode only. This is not a secure admin account; changes exist only in the current session.</div>
              <div className="stat-grid admin-stats"><div className="stat-card"><span>Events in this demo</span><strong>{events.length}</strong></div><div className="stat-card"><span>Registrations in this demo</span><strong>{registered.length}</strong></div><div className="stat-card"><span>Saved by this session</span><strong>{saved.length}</strong></div></div>
              <section className="panel"><div className="panel-heading"><div><div className="eyebrow">EVENT MANAGEMENT</div><h2>Manage events</h2></div><button className="primary-button" onClick={() => setShowEventForm(v => !v)}>{showEventForm ? 'Cancel' : '＋ Create event'}</button></div>
                {showEventForm && <form className="event-form" onSubmit={addEvent}><div className="field"><label>Event name</label><input value={eventTitle} onChange={e => setEventTitle(e.target.value)} placeholder="Enter event name" required /></div><div className="field"><label>Category</label><select value={eventCategory} onChange={e => setEventCategory(e.target.value)}>{['Technical','Design','Cultural','Career'].map(c => <option key={c}>{c}</option>)}</select></div><div className="field"><label>Date</label><input type="date" value={eventDate} onChange={e => setEventDate(e.target.value)} required /></div><div className="field"><label>Venue</label><input value={eventPlace} onChange={e => setEventPlace(e.target.value)} placeholder="Enter venue" required /></div><div className="field full-field"><label>Description</label><textarea value={eventDescription} onChange={e => setEventDescription(e.target.value)} placeholder="What is this event about?" rows="3" /></div><button className="primary-button" type="submit">Create demo event</button></form>}
                <div className="admin-event-list">{events.map(event => <div className="admin-event-row" key={event.id}><span className="resource-icon">{event.emoji}</span><span className="resource-copy"><strong>{event.title}</strong><small>{event.category} · {event.date} · {event.place}</small></span><button className="delete-button" onClick={() => {setEvents(old => old.filter(e => e.id !== event.id)); setSaved(old => old.filter(id => id !== event.id)); setRegistered(old => old.filter(id => id !== event.id)); notify('Demo event deleted')}}>Delete</button></div>)}</div>
              </section>
            </>
          )}

          <footer className="footer"><span><strong>campusconnect</strong> · Built for student life.</span><span>Student community platform · Demo prototype</span></footer>
        </div>
      </main>
      {message && <div className="toast" role="status"><span>✓</span> {message}</div>}
    </div>
  )
}

function PageTitle({ eyebrow, title, subtitle }) {
  return <section className="page-title"><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{subtitle}</p></section>
}

function EventCard({ event, saved, registered, onSave, onRegister }) {
  const date = new Date(`${event.date}T12:00:00`)
  const dateText = Number.isNaN(date.getTime()) ? event.date : new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(date)
  return (
    <article className="event-card">
      <div className={`event-art ${event.color}`}><span className="event-art-emoji">{event.emoji}</span><span className="event-category">{event.category}</span><button className={`save-button ${saved ? 'saved' : ''}`} onClick={() => onSave(event.id)} aria-label={saved ? 'Remove saved event' : 'Save event'}>{saved ? '♥' : '♡'}</button></div>
      <div className="event-card-body"><div className="event-meta"><span>▦ {dateText}</span><span>◷ {event.time}</span></div><h3>{event.title}</h3><p>{event.description}</p><div className="event-place">⌖ {event.place}</div><button className={`event-action ${registered ? 'registered' : ''}`} onClick={() => onRegister(event.id)}>{registered ? '✓ Registered' : 'Register for event'} <span>{registered ? '' : '→'}</span></button></div>
    </article>
  )
}

function TaskRow({ task, onToggle, onDelete }) {
  return (
    <div className={`task-row ${task.done ? 'task-done' : ''}`}>
      <button className={`task-check ${task.done ? 'checked' : ''}`} onClick={() => onToggle(task.id)} aria-label={task.done ? 'Mark incomplete' : 'Mark complete'}>{task.done ? '✓' : ''}</button>
      <span className="task-copy"><strong>{task.title}</strong><small>{task.subject} · Due {task.due}</small></span>
      {onDelete && <button className="delete-button" onClick={() => onDelete(task.id)}>Delete</button>}
    </div>
  )
}

function EmptyState({ title, text }) {
  return <div className="empty-state"><div>🔎</div><h3>{title}</h3><p>{text}</p></div>
}

export default App
