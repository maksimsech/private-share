export async function generateKey() {
    return crypto.subtle.generateKey(
        {
            name: 'AES-GCM',
            length: 256,
        },
        true,
        ['encrypt', 'decrypt'],
    )
}

export async function encryptString(text: string, key: CryptoKey) {
    const encoder = new TextEncoder()
    const data = encoder.encode(text)

    // TODO: IV can by public. So as an option it can be stored in db.
    const iv = crypto.getRandomValues(new Uint8Array(12))

    const cipherText = await crypto.subtle.encrypt(
        {
            name: 'AES-GCM',
            iv: iv,
        },
        key,
        data,
    )

    return {
        cipherText: new Uint8Array(cipherText),
        iv: iv,
    }
}

export async function exportKey(key: CryptoKey) {
    const exported = await crypto.subtle.exportKey(
        'raw',
        key,
    )
    return new Uint8Array(exported)
}

export async function importKey(rawKey: ArrayBuffer) {
    return crypto.subtle.importKey(
        'raw',
        rawKey,
        {
            name: 'AES-GCM',
            length: 256,
        },
        true,
        ['encrypt', 'decrypt'],
    )
}

export async function decryptString(cipherText: ArrayBuffer, iv: ArrayBuffer, key: CryptoKey) {
    const decrypted = await crypto.subtle.decrypt(
        {
            name: 'AES-GCM',
            iv: iv,
        },
        key,
        cipherText,
    )

    const decoder = new TextDecoder()
    return decoder.decode(decrypted)
}

export function base64ToArrayBuffer(base64: string) {
    const binaryString = atob(base64)
    const len = binaryString.length
    const bytes = new Uint8Array(len)
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i)
    }
    return bytes.buffer
}

export function arrayBufferToBase64(buffer: Uint8Array) {
    let binary = ''
    const bytes = new Uint8Array(buffer)
    const len = bytes.byteLength
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i])
    }
    return window.btoa(binary)
}
