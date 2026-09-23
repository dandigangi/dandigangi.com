import { genPageMetadata } from 'app/seo'
import PrintMode from '@/components/PrintMode'
import ResumeDocument from '../ResumeDocument'
import PaperBar from './PaperBar'

export const metadata = genPageMetadata({
  title: 'Résumé (print)',
  description: "Dan DiGangi's résumé, laid out for printing or saving as a PDF.",
  // A duplicate of /resume for search purposes; only the page itself should rank.
  alternates: { canonical: '/resume' },
  robots: { index: false, follow: true },
})

export default function ResumeDownload() {
  return (
    // One wrapper on purpose: on client navigation Next scrolls to the page's
    // first element that isn't hidden or sticky. Without it that was the sheet,
    // landing 96px down under the bar instead of at the top.
    <div>
      <PrintMode always />
      <PaperBar />
      <div data-print-sheet>
        <ResumeDocument />
      </div>
    </div>
  )
}
