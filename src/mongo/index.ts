import { getRequestContext } from '@cloudflare/next-on-pages'
import Hashids from 'hashids'

import { getDatabase } from './client'
import type { Record as RecordModel } from './models'


interface Record extends RecordModel {
    _id: string
}

interface GetRecordResponse extends Pick<RecordModel, 'text'> {
    isOneTime: boolean
}

const maxTtlSeconds = 5 * 60
const maxSaveAttempts = 10
const oneTimePrefix = 'o'
const expirationPrefix = 'e'

export async function getRecord(id: string): Promise<GetRecordResponse | null> {
    const recordIsOneTime = isOneTime(id)
    const collection = await getCollection(recordIsOneTime)

    // TODO: realm-web have bug and findOneAndDelete isn't working as intended.
    // https://github.com/realm/realm-js/issues/6497
    const record = await collection.findOne({
        _id: id,
    }, {
        projection: {
            text: 1,
        },
    })

    if (!record) {
        return null
    }

    if (recordIsOneTime) {
        await collection.deleteOne({
            _id: id,
        })
    }

    return {
        text: record.text,
        isOneTime: recordIsOneTime,
    }
}

export async function createRecord(record: Pick<RecordModel, 'text' > & {
    ttlSeconds: number
    isOneTime: boolean
}) {
    if (record.ttlSeconds > maxTtlSeconds) {
        throw new Error('invalid ttl')
    }

    const expireAt = new Date()
    expireAt.setSeconds(expireAt.getSeconds() + record.ttlSeconds)

    const collection = await getCollection(record.isOneTime)

    let attempts = 0
    while (true) {
        try {
            const id = generateId(record.isOneTime)

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


function getCollection(isOneTime: boolean) {
    return isOneTime
        ? getOneTimeCollection()
        : getExpireCollection()
}

async function getExpireCollection() {
    const client = await getDatabase()

    return client.collection<Record>('records')
}

async function getOneTimeCollection() {
    const client = await getDatabase()

    return client.collection<Record>('one-time-records')
}

function generateId(isOneTime: boolean) {
    const { env } = getRequestContext()

    const array = crypto.getRandomValues(new Int8Array(4))
    const hashids = new Hashids(env.HASHIDS_SALT)
    const id = hashids.encode(Array.from(array.map(n => Math.abs(n))))

    const prefix = isOneTime
        ? oneTimePrefix
        : expirationPrefix

    return prefix + id
}

function isOneTime(id: string) {
    if (id.startsWith(oneTimePrefix)) {
        return true
    }

    if (id.startsWith(expirationPrefix)) {
        return false
    }

    throw new Error(`Unknown id format. Id: ${id}`)
}
