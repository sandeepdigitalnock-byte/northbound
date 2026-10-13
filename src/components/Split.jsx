// Splits text into masked words so GSAP can slide `.w > span` up from below.
export default function Split({ text, className = '' }) {
  return (
    <span className={className} aria-label={text}>
      {text.split(' ').map((w, i) => (
        <span key={i} className="w" aria-hidden="true"><span>{w}</span></span>
      ))}
    </span>
  )
}
