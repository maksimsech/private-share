import { getRequestContext } from '@cloudflare/next-on-pages'
import {
    App,
    Credentials,
} from 'realm-web'


export async function getDatabase() {
    const client = await createMongoClient()

    return client.db('core')
}


async function createMongoClient() {
    const { env } = getRequestContext()

    const app = new App(env.ATLAS_APP_ID)
    const credentials = Credentials.apiKey(env.ATLAS_API_KEY)
    const user = await app.logIn(credentials)

    return user.mongoClient('mongodb-atlas')
}
