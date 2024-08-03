'use client'

import {
    useState,
    useEffect,
} from 'react'


import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import {
    base64ToArrayBuffer,
    decryptString,
    importKey,
} from '@/crypto'
import { formatDate } from '@/utils/date'


interface TextProps {
    encodedText: string
    isOneTime: boolean
    expireAt: Date
}

export function Text({
    encodedText,
    isOneTime,
    expireAt,
}: TextProps) {
    const anchor = window.location.hash

    const [text, setText] = useState<string | null>(null)
    const [error, setError] = useState<boolean>(false)

    const { toast } = useToast()

    useEffect(() => {
        const func = async () => {
            if (!anchor) {
                return
            }
            try {
                const decryptedText = await decryptText(encodedText, anchor.substring(1))
                setText(decryptedText)
            } catch {
                setError(true)
            }
        }
        func()
    }, [anchor, encodedText])

    const copyToClipboard = async () => {
        await navigator.clipboard.writeText(text!)
        toast({
            title: 'Text copied to clipboard.',
        })
    }

    if (!anchor) {
        return (
            <main className='p-2'>
                <p>
                    Link You used don&apos;t have correct format. Link should include # symbol and text after it.
                </p>
                {isOneTime && (
                    <p>
                        As it is one-time link, please ask for new correct link, because existing link will stop working.
                    </p>
                )}
            </main>
        )
    }

    if (error) {
        return (
            <main className='p-2'>
                <p>
                    We encountered error during processing of Your text.
                </p>
                {isOneTime && (
                    <p>
                        As it is one-time link, please ask for new correct link, because existing link will stop working.
                    </p>
                )}
            </main>
        )
    }

    if (text === null) {
        return (
            <main>
                <p>
                    Loading...
                </p>
            </main>
        )
    }

    return (
        <main className='flex flex-col gap-2 p-2'>
            <Textarea
                readOnly
                value={text}
            />
            {!isOneTime && (
                <p className='text-muted-foreground text-[0.8rem]'>
                    Link will expire {formatDate(expireAt)}
                </p>
            )}
            {isOneTime && (
                <p className='text-muted-foreground text-[0.8rem]'>
                    Warning! This is one-time link.
                </p>
            )}
            <Button
                onClick={copyToClipboard}
            >
                Copy
            </Button>
        </main>
    )
}

async function decryptText(encodedText: string, anchor: string) {
    const [iv, keyStr] = anchor.split('_')
    const importedKey = await importKey(base64ToArrayBuffer(keyStr))
    return await decryptString(
        base64ToArrayBuffer(encodedText),
        base64ToArrayBuffer(iv),
        importedKey,
    )
}

