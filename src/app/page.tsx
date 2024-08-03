import { useId } from 'react'

import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

import { Form } from './_components/form'


export const runtime = 'edge'

export default function Home() {
    const textareaId = useId()

    return (
        <main className='flex flex-col gap-2 px-2'>
            <Label htmlFor={textareaId}>Your text:</Label>
            <Textarea id={textareaId} />
            <Form textareaId={textareaId} />
        </main>
    )
}
