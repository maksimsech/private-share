'use server'

import {
    createRecord as createRecordMongo,
    getRecord as getRecordMongo,
} from '@/mongo'


export async function createRecord(record: Parameters<typeof createRecordMongo>[0]) {
    return await createRecordMongo(record)
}

export async function getRecord(id: Parameters<typeof getRecordMongo>[0]) {
    return await getRecordMongo(id)
}
