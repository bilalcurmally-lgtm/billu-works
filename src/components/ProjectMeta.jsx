// Label + dash rule padded to a fixed width so every value starts in the same mono column
const LABEL_WIDTH = 11
const rule = (label) => `${label} ${'—'.repeat(LABEL_WIDTH - label.length)}`

export default function ProjectMeta({ project, color = '#888', valueColor = '#ddd' }) {
  const rows = [
    ['CLIENT', project.client],
    ['ROLE', project.role],
    ['YEAR', project.year],
    ['TYPE', project.type],
    ['VIEWS', project.views],
  ].filter(([, value]) => value)

  return (
    <div
      className="font-mono"
      style={{ fontSize: '11px', color, lineHeight: 2, letterSpacing: '0.08em' }}
    >
      {rows.map(([label, value]) => (
        <div key={label}>
          <span style={{ color }}>{rule(label)}</span>{' '}
          <span style={{ color: valueColor }}>{value}</span>
        </div>
      ))}
    </div>
  )
}
