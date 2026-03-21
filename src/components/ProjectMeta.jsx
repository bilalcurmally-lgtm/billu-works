export default function ProjectMeta({ project, color = '#888', valueColor = '#ddd' }) {
  return (
    <div
      className="font-mono"
      style={{ fontSize: '11px', color, lineHeight: 2, letterSpacing: '0.08em' }}
    >
      <div><span style={{ color }}>CLIENT ————</span>{' '}<span style={{ color: valueColor }}>{project.client}</span></div>
      {project.year && <div><span style={{ color }}>YEAR ——————</span>{' '}<span style={{ color: valueColor }}>{project.year}</span></div>}
      <div><span style={{ color }}>TYPE ———————</span>{' '}<span style={{ color: valueColor }}>{project.type}</span></div>
    </div>
  )
}
