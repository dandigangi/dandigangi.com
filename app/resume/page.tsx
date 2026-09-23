import { genPageMetadata } from 'app/seo'
import PrintMode from '@/components/PrintMode'
import ResumeDocument from './ResumeDocument'

export const metadata = genPageMetadata({
  title: 'Résumé',
  description:
    "Dan DiGangi's engineering leadership experience — Postmark, ActiveCampaign, Arrive Logistics, DocuSign, and OpenLane.",
  alternates: { canonical: '/resume' },
})

export default function Resume() {
  return (
    <>
      <PrintMode />
      <ResumeDocument />
    </>
  )
}
