declare module 'react' {
  import * as React from 'react'
  export = React
  export as namespace React
  
  export function useState<T>(initialState: T | (() => T)): [T, (value: T | ((prev: T) => T)) => void]
  export function useEffect(effect: () => void | (() => void), deps?: any[]): void
  export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: any[]): T
  export function useMemo<T>(factory: () => T, deps: any[]): T
  export function useRef<T>(initialValue: T): { current: T }
  
  export interface HTMLAttributes<T> {
    className?: string
    children?: ReactNode
    onClick?: (event: MouseEvent<T>) => void
    onChange?: (event: ChangeEvent<T>) => void
    onSubmit?: (event: FormEvent<T>) => void
    [key: string]: any
  }

  export interface FormEvent<T = Element> {
    preventDefault: () => void
    target: T
  }

  export interface ChangeEvent<T = Element> {
    target: T & { value: string }
  }

  export interface MouseEvent<T = Element> {
    preventDefault: () => void
    target: T
  }

  export type ReactNode = any
  export type ComponentType<P = {}> = (props: P) => JSX.Element
}

declare namespace React {
  type FormEvent<T = Element> = {
    preventDefault: () => void
    target: T
  }
  
  type ChangeEvent<T = Element> = {
    target: T & { value: string }
  }
  
  type MouseEvent<T = Element> = {
    preventDefault: () => void
    target: T
  }
}

declare module 'next/link' {
  import { ComponentType, AnchorHTMLAttributes } from 'react'
  interface LinkProps {
    href: string
    as?: string
    replace?: boolean
    scroll?: boolean
    shallow?: boolean
    passHref?: boolean
    prefetch?: boolean
    locale?: string | false
    legacyBehavior?: boolean
    onMouseEnter?: () => void
    onTouchStart?: () => void
    onClick?: () => void
    children?: React.ReactNode
    className?: string
  }
  const Link: ComponentType<LinkProps>
  export default Link
}

declare module 'next/navigation' {
  export function useRouter(): {
    push: (href: string) => void
    replace: (href: string) => void
    back: () => void
    forward: () => void
    refresh: () => void
    pathname: string
    query: Record<string, string | string[]>
  }
  
  export function useSearchParams(): {
    get: (name: string) => string | null
    getAll: (name: string) => string[]
    has: (name: string) => boolean
    keys: () => IterableIterator<string>
    values: () => IterableIterator<string>
    entries: () => IterableIterator<[string, string]>
    forEach: (callbackfn: (value: string, key: string, parent: URLSearchParams) => void, thisArg?: any) => void
  }
  
  export function usePathname(): string
}

declare module 'lucide-react' {
  import { ComponentType } from 'react'
  
  interface IconProps {
    size?: number | string
    color?: string
    strokeWidth?: number
    className?: string
    style?: React.CSSProperties
  }
  
  export const ArrowLeft: ComponentType<IconProps>
  export const ArrowRight: ComponentType<IconProps>
  export const Search: ComponentType<IconProps>
  export const User: ComponentType<IconProps>
  export const ShoppingBag: ComponentType<IconProps>
  export const Heart: ComponentType<IconProps>
  export const Bell: ComponentType<IconProps>
  export const Menu: ComponentType<IconProps>
  export const X: ComponentType<IconProps>
  export const Star: ComponentType<IconProps>
  export const Plus: ComponentType<IconProps>
  export const Minus: ComponentType<IconProps>
  export const Trash2: ComponentType<IconProps>
  export const Eye: ComponentType<IconProps>
  export const EyeOff: ComponentType<IconProps>
  export const Mail: ComponentType<IconProps>
  export const Phone: ComponentType<IconProps>
  export const MapPin: ComponentType<IconProps>
  export const Lock: ComponentType<IconProps>
  export const Package: ComponentType<IconProps>
  export const Truck: ComponentType<IconProps>
  export const CheckCircle: ComponentType<IconProps>
  export const XCircle: ComponentType<IconProps>
  export const AlertCircle: ComponentType<IconProps>
  export const Filter: ComponentType<IconProps>
  export const Grid: ComponentType<IconProps>
  export const List: ComponentType<IconProps>
  export const SortAsc: ComponentType<IconProps>
  export const Share2: ComponentType<IconProps>
  export const Download: ComponentType<IconProps>
  export const MessageCircle: ComponentType<IconProps>
  export const RotateCcw: ComponentType<IconProps>
  export const Calendar: ComponentType<IconProps>
  export const Edit: ComponentType<IconProps>
  export const Save: ComponentType<IconProps>
  export const Settings: ComponentType<IconProps>
  export const Shield: ComponentType<IconProps>
  export const CreditCard: ComponentType<IconProps>
  export const Users: ComponentType<IconProps>
  export const ShieldCheck: ComponentType<IconProps>
  export const Award: ComponentType<IconProps>
  export const ShoppingCart: ComponentType<IconProps>
  export const Zap: ComponentType<IconProps>
  export const TrendingUp: ComponentType<IconProps>
  export const Gift: ComponentType<IconProps>
  export const Shirt: ComponentType<IconProps>
  export const UtensilsCrossed: ComponentType<IconProps>
  export const Store: ComponentType<IconProps>
}

declare module 'class-variance-authority' {
  export function cva(base: string, options?: any): any
  export type VariantProps<T> = any
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any
    }
  }
}
