
import {
    type LabelHTMLAttributes,
    forwardRef,
} from 'react'

import {
    cva,
    type VariantProps,
} from 'class-variance-authority'

import { cn } from '@/utils/tw'


const labelVariants = cva(
    'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
)

export interface LabelProps
    extends LabelHTMLAttributes<HTMLLabelElement> {}

const Label = forwardRef<
    HTMLLabelElement,
    LabelProps & VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
    <label
        ref={ref}
        className={cn(labelVariants(), className)}
        {...props}
    />
))
Label.displayName = 'Label'

export { Label }
