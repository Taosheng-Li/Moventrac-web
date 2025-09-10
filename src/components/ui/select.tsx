import * as React from 'react'
import { cn } from '@/components/utils/cn'

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

export function Select({ className, ...props }: SelectProps) {
  return <select className={cn('h-9 rounded-md border border-input bg-white px-3 py-2 text-sm', className)} {...props} />
}

