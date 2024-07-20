import { getRequestContext } from '@cloudflare/next-on-pages'
import Hashids from 'hashids'

import { getDatabase } from './client'
import type { Record as RecordModel } from './models'


interface Record extends RecordModel {
    _id: string
}

const maxTtlSeconds = 5 * 60
const maxSaveAttempts = 10

// TODO: Return here only what needed to show to reduce used traffic
export async function getRecord(id: string): Promise<RecordModel | null> {
    const collection = await getCollection()

    // TODO: realm-web have bug and findOneAndDelete isn't working as intended.
    // https://github.com/realm/realm-js/issues/6497
    const record = await collection.findOne({
        _id: id,
    })

    if (!record) {
        return null
    }

    await collection.deleteOne({
        _id: id,
    })

    return {
        id: record._id,
        text: record.text,
        expireAt: record.expireAt,
    }
}

export async function createRecord(record: Pick<RecordModel, 'text' > & {
    ttlSeconds: number
    isOneTime: boolean
}) {
    // TODO: isOneTime will be different by non-onetime by storing documents to different collection
    // and querying by findOne and key to understand one-time / non-one-time will be character in key
    if (record.ttlSeconds > maxTtlSeconds) {
        throw new Error('invalid ttl')
    }

    const expireAt = new Date()
    expireAt.setSeconds(expireAt.getSeconds() + record.ttlSeconds)

    const collection = await getCollection()

    let attempts = 0
    while (true) {
        try {
            const id = generateId()

            await collection.insertOne({
                _id: id,
                text: record.text,
                expireAt: expireAt,
            })

            return id
        }

        catch (e) {
            if (attempts === maxSaveAttempts) {
                throw e
            }

            attempts++
        }
    }
}


async function getCollection() {
    const client = await getDatabase()

    return client.collection<Omit<Record, 'id'>>('records')
}

function generateId() {
    const { env } = getRequestContext()

    const array = crypto.getRandomValues(new Int8Array(4))
    const hashids = new Hashids(env.HASHIDS_SALT)
    return hashids.encode(Array.from(array.map(n => Math.abs(n))))
}
