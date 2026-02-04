import { Suspense } from 'react'
import ApplyClient from './ApplyClient'

export const dynamic = 'force-dynamic'

export default function ApplyPage() {
  return (
    <Suspense
      fallback={
        <main style={{ padding: 100, textAlign: 'center' }}>
          Loading Zaukriti Ecosystem…
        </main>
      }
    >
      <ApplyClient />
    </Suspense>
  )
}
