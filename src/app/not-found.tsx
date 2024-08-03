import type { Metadata } from 'next'

export const runtime = 'edge'

export const metadata: Metadata = {
    title: 'privateshare - 404',
}

export default function NotFound() {
    return (
        <div className='fixed left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2'>
            <h1>
                404
            </h1>
            <h2 className='ml-2 border-l pl-2'>
                This page could not be found.
            </h2>
        </div>
    )
}
