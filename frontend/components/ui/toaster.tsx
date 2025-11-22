'use client'

import { Toaster as HotToaster } from 'react-hot-toast'

export function Toaster() {
  return (
    <HotToaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        // Define default options
        className: '',
        duration: 4000,
        style: {
          background: '#363636',
          color: '#fff',
        },

        // Default options for specific types
        success: {
          duration: 3000,
          theme: {
            primary: 'rgb(34, 197, 94)',
            secondary: 'white',
          },
        },
        error: {
          duration: 5000,
          theme: {
            primary: 'rgb(239, 68, 68)',
            secondary: 'white',
          },
        },
      }}
    />
  )
}
