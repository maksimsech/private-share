'use client'

import {
    useState,
    type ReactNode,
} from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'

import { SaveButton } from './save-button'


interface FormProps {
    textareaId: string
    children: ReactNode
}

export function Form ({
    textareaId,
    children,
}: FormProps) {
    const [link, setLink] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const { toast } = useToast()

    const copyToClipboard = async () => {
        if (!link) {
            return
        }
        toast({
            title: 'Text copied to clipboard.',
        })
        // TODO: Revisit
        const text = `${location.origin}${link}`
        await navigator.clipboard.writeText(text)
        toast({
            title: 'Text copied to clipboard.',
        })
    }

    return (
        <main className='flex flex-col gap-2 px-2'>
            {children}
            <SaveButton
                textareaId={textareaId}
                onLinkUpdated={(link) => {
                    setError(null)
                    setLink(link)
                }}
                onErrorUpdated={setError}
            />
            {error && (
                <p className='text-destructive'>
                    {error}
                </p>
            )}
            {link && (
                <div className='flex flex-col gap-2 rounded border-2 p-2'>
                    <Input
                        readOnly
                        value={link}
                        onClick={copyToClipboard}
                    />
                    <p className='text-muted-foreground text-[0.8rem]'>
                        Warning! This is one-time link.
                    </p>
                    <Button
                        onClick={copyToClipboard}
                    >
                        Copy
                    </Button>
                </div>
            )}
        </main>
    )
}
