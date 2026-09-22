import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { navigation, services } from './data'
import type { Project, ServiceId } from './data'

export type IconName = 'arrow' | 'menu' | 'close' | 'building' | 'plan' | 'tools' | 'layers' | 'check' | 'plus' | 'phone' | 'mail' | 'pin'
export function Icon({ name, className = '' }: { name: IconName; className?: string }) {
  const paths: Record<IconName, ReactNode> = {
    arrow: <path d="M5 19 19 5M5 5h14v14" />,
    menu: <path d="M3 7h18M3 12h18M3 17h18" />,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    building: <><path d="M4 21V7l8-4v18M12 9l8 3v9M2 21h20M7 9v2m0 3v2m9-2v2" /></>,
    plan: <><rect x="3" y="3" width="18" height="18" /><path d="M3 10h7V3m0 7v5h11M10 21v-2" /></>,
    tools: <><path d="m4 20 10-10m-7 7 3 3M14 10l-4-4 3-3 4 4m0 0 4 4-3 3-4-4M3 21l4-1-3-3-1 4Z" /></>,
    layers: <><path d="m12 3 10 5-10 5L2 8l10-5ZM2 12l10 5 10-5M2 16l10 5 10-5" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    plus: <path d="M12 4v16M4 12h16" />,
    phone: <path d="m7 3 3 5-3 3a17 17 0 0 0 6 6l3-3 5 3-1 4C10 22 2 14 3 4l4-1Z" />,
    mail: <><rect x="3" y="5" width="18" height="14" /><path d="m3 6 9 7 9-7" /></>,
    pin: <><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
  }
  return <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" aria-hidden="true">{paths[name]}</svg>
}
export function Logo() {
  return <a className="logo" href="#home" aria-label="NOMAD Build — Нүүр"><svg width="37" height="40" viewBox="0 0 37 40" fill="none" aria-hidden="true"><path d="M2 38V3h7l19 27V3h7v35h-7L9 11v27H2Z" stroke="currentColor" strokeWidth="2" /><path d="M2 28h7M28 12h7" stroke="currentColor" strokeWidth="2" /></svg><span>NOMAD<small>BUILD</small></span></a>
}
export function Label({ children, number }: { children: ReactNode; number?: string }) {
  return <p className="eyebrow">{number && <span>{number} /</span>}{children}</p>
}
export function QuoteLink({ children = 'Үнийн санал авах', onClick, className = '' }: { children?: ReactNode; onClick?: () => void; className?: string }) {
  return <a className={'button ' + className} href="#contact" onClick={onClick}>{children}<Icon name="arrow" /></a>
}
export function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const node = ref.current!
    const media = matchMedia('(prefers-reduced-motion: reduce)')
    if (!media.matches && node.getBoundingClientRect().top > innerHeight) node.classList.add('is-pending')
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { node.classList.remove('is-pending'); observer.disconnect() } }, { threshold: .06 })
    observer.observe(node)
    const update = () => { if (media.matches) node.classList.remove('is-pending') }
    media.addEventListener('change', update)
    return () => { observer.disconnect(); media.removeEventListener('change', update) }
  }, [])
  return <div ref={ref} className={'reveal ' + className}>{children}</div>
}
export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    let previous: boolean | undefined
    const scroll = () => { const next = scrollY > 30; if (next !== previous) { previous = next; setScrolled(next) } }
    scroll()
    const media = matchMedia('(min-width: 1100px)')
    const resize = () => { if (media.matches) setOpen(false) }
    window.addEventListener('scroll', scroll, { passive: true })
    media.addEventListener('change', resize)
    return () => { window.removeEventListener('scroll', scroll); media.removeEventListener('change', resize) }
  }, [])
  useEffect(() => {
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape' && open) { setOpen(false); toggleRef.current?.focus() } }
    window.addEventListener('keydown', escape)
    return () => window.removeEventListener('keydown', escape)
  }, [open])
  return <header className={'site-header' + (scrolled ? ' is-scrolled' : '') + (open ? ' is-open' : '')}>
    <div className="wrap nav-inner"><Logo /><nav className="desktop-nav" aria-label="Үндсэн цэс">{navigation.map(item => <a href={item.href} key={item.href}>{item.label}</a>)}</nav><div className="nav-actions"><QuoteLink className="nav-quote" onClick={() => setOpen(false)} /><button type="button" className="menu-toggle" ref={toggleRef} aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? 'Цэс хаах' : 'Цэс нээх'} onClick={() => setOpen(!open)}><Icon name={open ? 'close' : 'menu'} /></button></div></div>
    <nav id="mobile-nav" className="mobile-nav" aria-label="Гар утасны цэс" hidden={!open}>{navigation.map((item, i) => <a href={item.href} key={item.href} onClick={() => setOpen(false)}><span>0{i + 1}</span>{item.label}<Icon name="arrow" /></a>)}<QuoteLink className="mobile-quote" onClick={() => setOpen(false)} /><p>Төлөвлөлтөөс гүйцэтгэл хүртэл.</p></nav>
  </header>
}
export function ProjectDialog({ project, onClose, onQuote }: { project: Project; onClose: () => void; onQuote: (service: ServiceId) => void }) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const dialog = ref.current!
    const previous = document.activeElement as HTMLElement
    const overflow = document.body.style.overflow
    dialog.showModal()
    document.body.style.overflow = 'hidden'
    return () => { dialog.close(); document.body.style.overflow = overflow; previous?.focus() }
  }, [])
  return <dialog ref={ref} className="project-dialog" aria-labelledby="project-dialog-title" onCancel={event => { event.preventDefault(); onClose() }} onClick={event => { if (event.target === event.currentTarget) onClose() }} onKeyDown={event => {
    if (event.key !== 'Tab') return
    const nodes = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('a[href],button'))
    const first = nodes[0], last = nodes[nodes.length - 1]
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
  }}>
    <button type="button" className="dialog-close" aria-label="Төслийн цонх хаах" onClick={onClose} autoFocus><Icon name="close" /></button>
    <img className="dialog-photo" src={project.image} alt={project.alt} />
    <div className="dialog-content"><Label>ТӨСЛИЙН ТАНИЛЦУУЛГА / {project.id}</Label><h2 id="project-dialog-title">{project.name}</h2><dl className="project-facts"><div><dt>Байршил</dt><dd>{project.location}</dd></div><div><dt>Талбай</dt><dd>{project.area}</dd></div><div><dt>Он</dt><dd>{project.year}</dd></div></dl><p>{project.description}</p><h3>Ажлын хүрээ</h3><ul>{project.scope.map(item => <li key={item}><Icon name="check" />{item}</li>)}</ul><QuoteLink onClick={() => { onClose(); onQuote(project.group) }}>Ижил төслийн санал авах</QuoteLink><p className="demo-note">Портфолиод зориулсан загвар төсөл. Зураг нь жишээ болно.</p></div>
  </dialog>
}
type Fields = { name: string; phone: string; email: string; type: string; message: string }
type FieldName = keyof Fields
const initialFields: Fields = { name: '', phone: '', email: '', type: '', message: '' }
export function ContactForm({ selectedService, onServiceChange }: { selectedService: ServiceId | ''; onServiceChange: (service: ServiceId | '') => void }) {
  const [fields, setFields] = useState<Fields>({ ...initialFields, type: selectedService })
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({})
  const [success, setSuccess] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const update = (field: FieldName, value: string) => { if (field === 'type') onServiceChange(value as ServiceId | ''); else setFields(previous => ({ ...previous, [field]: value })); setErrors(previous => ({ ...previous, [field]: undefined })); setSuccess(false) }
  const visibleError = (field: FieldName) => field === 'type' && selectedService ? undefined : errors[field]
  const error = (field: FieldName) => visibleError(field) ? <span id={field + '-error'} className="field-error">{errors[field]}</span> : null
  const props = (field: FieldName) => ({ id: 'quote-' + field, name: field, value: field === 'type' ? selectedService : fields[field], 'aria-invalid': Boolean(visibleError(field)), 'aria-describedby': visibleError(field) ? field + '-error' : undefined })
  return <form ref={formRef} className="contact-form" noValidate onSubmit={event => {
    event.preventDefault()
    const next: Partial<Record<FieldName, string>> = {}
    if (!fields.name.trim()) next.name = 'Нэрээ оруулна уу.'
    const phone = fields.phone.replace(/[\s()-]/g, '')
    if (!/^(?:\+976)?\d{8}$/.test(phone)) next.phone = '8 оронтой утасны дугаар оруулна уу.'
    if (fields.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) next.email = 'И-мэйл хаягаа шалгана уу.'
    if (!services.some(service => service.id === selectedService)) next.type = 'Төслийн төрлөө сонгоно уу.'
    if (!fields.message.trim()) next.message = 'Хийлгэх ажлаа товч тайлбарлана уу.'
    setErrors(next)
    if (Object.keys(next).length) { formRef.current?.querySelector<HTMLElement>('#quote-' + Object.keys(next)[0])?.focus(); setSuccess(false) }
    else setSuccess(true)
  }}>
    <div className="form-heading"><span className="status-dot" /><h3>Төслийнхөө талаар ярилцъя.</h3></div>
    <p className="form-intro">Хийлгэх ажил, талбай, төлөвлөсөн хугацаагаа бичээрэй.</p>
    <div className="form-grid">
      <div className="field"><label htmlFor="quote-name">Нэр <span aria-hidden="true">*</span></label><input {...props('name')} autoComplete="name" required maxLength={100} placeholder="Таны нэр" onChange={event => update('name', event.target.value)} />{error('name')}</div>
      <div className="field"><label htmlFor="quote-phone">Утас <span aria-hidden="true">*</span></label><input {...props('phone')} type="tel" autoComplete="tel" required maxLength={20} placeholder="9911 2233" onChange={event => update('phone', event.target.value)} />{error('phone')}</div>
      <div className="field"><label htmlFor="quote-email">И-мэйл <small>(заавал биш)</small></label><input {...props('email')} type="email" autoComplete="email" maxLength={150} placeholder="name@example.com" onChange={event => update('email', event.target.value)} />{error('email')}</div>
      <div className="field"><label htmlFor="quote-type">Төслийн төрөл <span aria-hidden="true">*</span></label><select {...props('type')} required onChange={event => update('type', event.target.value)}><option value="">Сонгох</option>{services.map(service => <option key={service.id} value={service.id}>{service.title}</option>)}</select>{error('type')}</div>
      <div className="field field-wide"><label htmlFor="quote-message">Тайлбар <span aria-hidden="true">*</span></label><textarea {...props('message')} rows={4} required maxLength={2000} placeholder="Жишээ нь: 80 м² орон сууцны иж бүрэн засвар…" onChange={event => update('message', event.target.value)} />{error('message')}</div>
    </div>
    <div className="form-submit"><button type="submit" className="button">Илгээх<Icon name="arrow" /></button><p>* Тэмдэгтэй талбарыг бөглөнө үү.</p></div>
    <div className="form-status" role="status">{success && <div className="success-message"><Icon name="check" /><div><strong>Мэдээллийг шалгалаа.</strong><p>Энэ нь загвар маягт тул таны хүсэлтийг илгээгээгүй. Мэдээлэл хадгалагдахгүй.</p><button type="button" onClick={() => { setFields(initialFields); onServiceChange(''); setErrors({}); setSuccess(false); formRef.current?.querySelector<HTMLInputElement>('#quote-name')?.focus() }}>Шинээр бөглөх</button></div></div>}</div>
    <p className="demo-note">Загвар маягт · Бодит хүсэлт илгээхгүй.</p>
  </form>
}
