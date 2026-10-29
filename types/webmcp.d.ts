import 'react'
import type { HTMLAttributes } from 'react'

declare module 'react' {
  interface FormHTMLAttributes<T> {
    toolname?: HTMLAttributes<T>['title']
    tooldescription?: HTMLAttributes<T>['title']
    toolautosubmit?: HTMLAttributes<T>['title']
  }
  interface InputHTMLAttributes<T> { toolparamdescription?: HTMLAttributes<T>['title'] }
  interface SelectHTMLAttributes<T> { toolparamdescription?: HTMLAttributes<T>['title'] }
}
