declare module 'react' {
  export default React
  export = React
  export as namespace React
  
  namespace React {
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
}
