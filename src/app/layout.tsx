'use client'

import '~/app/style/globals.css'
import WrraperLayout from '~/components/layout/Wrapper'

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body className="text-txt-primary">
        <WrraperLayout>{children}</WrraperLayout>

        <div id="data-modal"></div>
      </body>
    </html>
  )
}
