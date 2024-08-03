import { headers } from 'next/headers'


const messengerAgents = [
    /FBAN|FBAV/, // Facebook Messenger
    /Telegram/, // Telegram
    /WhatsApp/, // WhatsApp
]

export function isMessenger() {
    const clientHeaders = headers()
    const userAgent = clientHeaders.get('user-agent')
    if (!userAgent) {
        return false
    }

    return messengerAgents.some(pattern => pattern.test(userAgent))
}
