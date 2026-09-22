'use client'

import { useMemo, useState } from 'react'
import { projectDomain, type Project } from '@/data/projects'
import { rowHue, rowHueLight } from '@/lib/ramp'
import styles from './ProjectTable.module.css'

type SortKey = 'title' | 'type' | 'year'
type Direction = 'asc' | 'desc'
/** `null` is the authored order in data/projects.ts, which is the default view. */
type Sort = { key: SortKey; direction: Direction } | null

/** Year opens descending (newest first); the text columns open A–Z. */
const OPENING_DIRECTION: Record<SortKey, Direction> = {
  title: 'asc',
  type: 'asc',
  year: 'desc',
}

const compare = (a: Project, b: Project, key: SortKey) =>
  key === 'year' ? a.year - b.year : a[key].localeCompare(b[key])

export default function ProjectTable({ projects }: { projects: Project[] }) {
  const [sort, setSort] = useState<Sort>(null)

  const rows = useMemo(() => {
    if (!sort) return projects
    const sorted = [...projects].sort((a, b) => compare(a, b, sort.key))
    return sort.direction === 'desc' ? sorted.reverse() : sorted
  }, [projects, sort])

  /**
   * Third click on the same column returns to the authored order rather than
   * cycling asc/desc forever — otherwise the default view, which is the one
   * that was actually designed, becomes unreachable without a reload.
   */
  const toggle = (key: SortKey) =>
    setSort((current) => {
      if (current?.key !== key) return { key, direction: OPENING_DIRECTION[key] }
      if (current.direction === OPENING_DIRECTION[key]) {
        return { key, direction: current.direction === 'asc' ? 'desc' : 'asc' }
      }
      return null
    })

  return (
    <div className={styles.table}>
      <div className={styles.head}>
        <span className={styles.headCell} aria-hidden="true" />
        <SortButton label="Project" sortKey="title" sort={sort} onClick={toggle} />
        <SortButton label="Type" sortKey="type" sort={sort} onClick={toggle} />
        <SortButton label="Year" sortKey="year" sort={sort} onClick={toggle} />
        <span className={styles.headCell} aria-hidden="true" />
      </div>

      {/* Phone: the sort controls above cannot survive at 390px, so the whole
          header collapses to this one control. It drives the same state. */}
      <div className={styles.phoneSort}>
        <button type="button" className={styles.phoneSortButton} onClick={() => toggle('year')}>
          Sort: {sort ? `${sort.key} ${sort.direction === 'asc' ? '▴' : '▾'}` : 'Default'}
        </button>
      </div>

      <ol className={styles.rows}>
        {rows.map((project, index) => {
          const number = String(index + 1).padStart(2, '0')
          const domain = projectDomain(project)
          // Both ramps ride on the row; the stylesheet picks one per theme,
          // because a light-mode hue cannot be resolved here on the server.
          const hues = {
            '--row-hue': rowHue(index, rows.length),
            '--row-hue-light': rowHueLight(index, rows.length),
          } as React.CSSProperties

          const cells = (
            <>
              <span className={styles.number}>{number}</span>
              <span className={styles.main}>
                <span className={styles.title}>{project.title}</span>
                <span className={styles.description}>{project.description}</span>
                {domain && <span className={styles.domain}>{domain}</span>}
              </span>
              {/* `display: contents` on desktop and tablet, so these three sit
                  in their own grid columns; a real flex row on a phone, where
                  they collapse to one line. Grouping them in the DOM is what
                  lets the phone layout avoid absolute positioning. */}
              <span className={styles.metaGroup}>
                <span className={`${styles.meta} ${styles.type}`}>{project.type}</span>
                <span className={`${styles.meta} ${styles.year}`}>{project.year}</span>
                {project.status === 'soon' ? (
                  <span className={styles.soon}>Coming soon</span>
                ) : (
                  <span className={styles.cta} aria-hidden="true">
                    →
                  </span>
                )}
              </span>
            </>
          )

          return (
            <li key={project.slug} id={project.slug} className={styles.item}>
              {project.status === 'soon' ? (
                // A div, not a link: there is nowhere to go yet, and a link that
                // does nothing is worse than an obviously inert row.
                <div className={`${styles.row} ${styles.rowSoon}`} style={hues}>
                  {cells}
                </div>
              ) : (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.row}
                  style={hues}
                >
                  {cells}
                </a>
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}

function SortButton({
  label,
  sortKey,
  sort,
  onClick,
}: {
  label: string
  sortKey: SortKey
  sort: Sort
  onClick: (key: SortKey) => void
}) {
  const active = sort?.key === sortKey
  const direction = active ? sort?.direction : undefined

  /* Not a real <table>, so `aria-sort` has nothing valid to sit on — the state
     goes in the label instead, which is what actually gets announced. */
  const state = direction ? `, sorted ${direction === 'asc' ? 'ascending' : 'descending'}` : ''

  return (
    <button
      type="button"
      className={`${styles.headCell} ${styles.sortButton}`}
      onClick={() => onClick(sortKey)}
      aria-label={`Sort by ${label.toLowerCase()}${state}`}
    >
      {label}
      <span className={styles.arrows} aria-hidden="true">
        <span data-on={direction === 'asc'}>▲</span>
        <span data-on={direction === 'desc'}>▼</span>
      </span>
    </button>
  )
}
