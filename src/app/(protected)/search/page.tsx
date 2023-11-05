import { Metadata } from 'next'
import Main from '~/components/pages/search/Main'

export async function generateMetadata({
  searchParams: { q }
}: {
  searchParams: {
    q: string
  }
}): Promise<Metadata> {
  return {
    title: `${q} - search `
  }
}
export default function Search() {
  return <Main />
}
