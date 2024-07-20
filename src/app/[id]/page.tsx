import {unstable_noStore} from 'next/cache'
import { notFound } from 'next/navigation'

import { getRecord } from '@/mongo'

import { Text } from './_text'


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

    const record = await getRecord(id)
    if (!record) {
        notFound()
    }

    return (
        <Text
            encodedText={record.text}
        />
    )
}
