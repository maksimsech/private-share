import type { Metadata } from 'next'
import { unstable_noStore } from 'next/cache'
import { notFound } from 'next/navigation'

import { getRecord } from '@/mongo'
import { isMessenger } from '@/utils/is-messenger'

import { Text } from './_text'


export const metadata: Metadata = {
    description: 'Private message for you.',
}

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

interface PageProps {
    params: {
        id: string
    }
}

export default async function Page({
    params: {
        id,
    },
}: PageProps) {
    unstable_noStore()

    if (isMessenger()) {
        return null
    }

    const record = await getRecord(id)
    if (!record) {
        notFound()
    }

    return (
        <Text
            encodedText={record.text}
            isOneTime={record.isOneTime}
            expireAt={record.expireAt}
        />
    )
}
