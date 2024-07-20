import { useState } from 'react'

import { createRecord } from '@/actions'
import { Button } from '@/components/ui/button'
import {
    arrayBufferToBase64,
    encryptString,
    exportKey,
    generateKey,
} from '@/crypto'


const maxLength = 200

interface SaveButtonProps {
    textareaId: string
    onLinkUpdated: (link: string) => void
    onErrorUpdated: (errorMessage: string) => void
}

export function SaveButton({
    textareaId,
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
            // TODO: Add max length check
            setIsUpdating(true)

            const key = await generateKey()

            const encryptedData = await encryptString(text, key)
            const exportedKey = await exportKey(key)

            const id = await createRecord({
                text: arrayBufferToBase64(encryptedData.cipherText),
                ttlSeconds: 5 * 60,
                isOneTime: true,
            })

            onLinkUpdated(`/${id}#${arrayBufferToBase64(encryptedData.iv)}_${arrayBufferToBase64(exportedKey)}`)
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
