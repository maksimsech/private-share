import { GitHubLogoIcon } from '@radix-ui/react-icons'
import Link from 'next/link'

import { cn } from '@/utils/tw'

import { ModeToggle } from './theme/edit-button'
import { buttonVariants } from './ui/button'


export function Header() {
    return (
        <header className='flex w-full flex-none items-center justify-between border-b border-b-slate-700 p-2 shadow-inner dark:border-b-slate-300'>
            <Link
                href='/'
                className='py-2 font-bold'
            >
                privateshare&nbsp;
                <span className='text-muted-foreground text-[0.8rem]'>
                    by mngapp
                </span>
            </Link>
            <div className='flex items-center gap-2'>
                <Link
                    className={cn(buttonVariants({ variant: 'outline'}), 'p-2')}
                    href='https://github.com/maksimsech/private-share'
                    target='_blank'
                >
                    <GitHubLogoIcon />
                    <span className='sr-only'>GitHub project</span>
                </Link>
                <ModeToggle />
            </div>
        </header>
    )
}
