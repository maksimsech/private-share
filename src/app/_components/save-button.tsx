import { useState } from 'react'

import { createRecord } from '@/actions'
import { Button } from '@/components/ui/button'
import {
    arrayBufferToBase64,
    encryptString,
    exportKey,
    generateKey,
} from '@/crypto'

import type { Link } from './models'


const maxLength = 200

interface SaveButtonProps {
    textareaId: string
    isOneTime: boolean
    onLinkUpdated: (link: Link) => void
    onErrorUpdated: (errorMessage: string) => void
}

export function SaveButton({
    textareaId,
    isOneTime: isOneTimeProp,
    onLinkUpdated,
    onErrorUpdated,
}: SaveButtonProps) {
    const [isUpdating, setIsUpdating] = useState(false)

    const clickHandler = async () => {
        try {
            const textarea = document.getElementById(textareaId) as HTMLTextAreaElement
            const text = textarea.value
            if (text.length > maxLength) {
                onErrorUpdated(`Text is longer than ${maxLength}`)
                return
            }
            setIsUpdating(true)
            const isOneTime = isOneTimeProp

            const key = await generateKey()

            const encryptedData = await encryptString(text, key)
            const exportedKey = await exportKey(key)

            const id = await createRecord({
                text: arrayBufferToBase64(encryptedData.cipherText),
                ttlSeconds: 5 * 60,
                isOneTime,
            })

            onLinkUpdated({
                url: `/${id}#${arrayBufferToBase64(encryptedData.iv)}_${arrayBufferToBase64(exportedKey)}`,
                isOneTime,
            })
        }
        finally {
            setIsUpdating(false)
        }
    }

    return (
        <Button
            disabled={isUpdating}
            onClick={clickHandler}
        >
            Save
        </Button>
    )
}
