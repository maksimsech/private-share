'use client'

import {
    useState,
    useId,
} from 'react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { formatDate } from '@/utils/date'

import type { Link } from './models'
import { SaveButton } from './save-button'


interface FormProps {
    textareaId: string
}

export function Form ({
    textareaId,
}: FormProps) {
    const checkboxId = useId()

    const [link, setLink] = useState<Link | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [isOneTime, setIsOneTime] = useState(false)
    const { toast } = useToast()

    const copyToClipboard = async () => {
        if (!link) {
            return
        }
        toast({
            title: 'Text copied to clipboard.',
        })
        // TODO: Revisit
        const text = `${location.origin}${link.url}`
        await navigator.clipboard.writeText(text)
        toast({
            title: 'Text copied to clipboard.',
        })
    }

    return (
        <>
            <div className='items-top flex space-x-2'>
                <Checkbox
                    id={checkboxId}
                    checked={isOneTime}
                    onCheckedChange={v => setIsOneTime(v === 'indeterminate' ? false : v)}
                />
                <div className='grid gap-1.5 leading-none'>
                    <label
                        htmlFor={checkboxId}
                        className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                    >
                        Create one-time text
                    </label>
                    <p className='text-muted-foreground text-sm'>
                        A one-time text will be automatically deleted when user sees it.
                    </p>
                </div>
            </div>
            <SaveButton
                textareaId={textareaId}
                isOneTime={isOneTime}
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
                        value={link.url}
                        onClick={copyToClipboard}
                    />
                    <p className='text-muted-foreground text-[0.8rem]'>
                        Link will expire {formatDate(link.expireAt)}
                    </p>
                    {link.isOneTime && (
                        <p className='text-muted-foreground text-[0.8rem]'>
                            Warning! This is one-time link.
                        </p>
                    )}
                    <Button
                        onClick={copyToClipboard}
                    >
                        Copy
                    </Button>
                </div>
            )}
        </>
    )
}
