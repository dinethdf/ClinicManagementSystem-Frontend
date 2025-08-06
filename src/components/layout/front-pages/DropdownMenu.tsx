// React Imports
import { Fragment, useEffect, useState } from 'react'
import type { CSSProperties, MouseEvent, ReactNode } from 'react'

// Next Imports
import { usePathname } from 'next/navigation'

// MUI Imports
import Typography from '@mui/material/Typography'
import Collapse from '@mui/material/Collapse'

// Third-party Imports
import classnames from 'classnames'
import {
  useFloating,
  useDismiss,
  useRole,
  useInteractions,
  useHover,
  offset,
  flip,
  size,
  autoUpdate,
  FloatingPortal,
  safePolygon,
  useTransitionStyles
} from '@floating-ui/react'

// Type Imports
import type { Mode } from '@core/types'

// Component Imports
import Link from '@components/Link'
import CustomAvatar from '@core/components/mui/Avatar'

type Props = {
  mode: Mode
  isBelowLgScreen: boolean
  isDrawerOpen: boolean
  setIsDrawerOpen: (open: boolean) => void
}

type MenuWrapperProps = {
  children: ReactNode
  refs: any
  isBelowLgScreen: boolean
  isOpen: boolean
  getFloatingProps: any
  top: number
  floatingStyles: CSSProperties
  isMounted: boolean
  styles: CSSProperties
}

// Constants
const pageData = [
  {
    title: 'Pricing',
    href: '/pricing'
  },
  {
    title: 'Payment',
    href: '/payment'
  },
  {
    title: 'Checkout',
    href: '/checkout'
  },
  {
    title: 'Help Center',
    href: '/help-center'
  }
]

const authData = [
  {
    title: 'Login (Basic)',
    href: '/login-v1'
  },
  {
    title: 'Login (Cover)',
    href: '/login-v2'
  },
  {
    title: 'Register (Basic)',
    href: '/register-v1'
  },
  {
    title: 'Register (Cover)',
    href: '/register-v2'
  },
  {
    title: 'Register (Multi-steps)',
    href: '/register-multi-steps'
  },
  {
    title: 'Forgot Password (Basic)',
    href: '/forgot-password-v1'
  },
  {
    title: 'Forgot Password (Cover)',
    href: '/forgot-password-v2'
  },
  {
    title: 'Reset Password (Basic)',
    href: '/reset-password-v1'
  },
  {
    title: 'Reset Password (Cover)',
    href: '/reset-password-v2'
  }
]

const othersData = [
  {
    title: 'Under Maintenance',
    href: '/misc/under-maintenance'
  },
  {
    title: 'Coming Soon',
    href: '/misc/coming-soon'
  },
  {
    title: 'Not Authorized',
    href: '/misc/401-not-authorized'
  },
  {
    title: 'Verify Email (Basic)',
    href: '/auth/verify-email-v1'
  },
  {
    title: 'Verify Email (Cover)',
    href: '/auth/verify-email-v2'
  },
  {
    title: 'Two Steps (Basic)',
    href: '/auth/two-steps-v1'
  },
  {
    title: 'Two Steps (Cover)',
    href: '/auth/two-steps-v2'
  }
]

const MenuWrapper = (props: MenuWrapperProps) => {
  // Props
  const { children, refs, isBelowLgScreen, isOpen, getFloatingProps, top, floatingStyles, isMounted, styles } = props

  if (!isBelowLgScreen) {
    return (
      <FloatingPortal>
        {isMounted && (
          <div ref={refs.setFloating} className='z-[1201] lg:z-[11]' {...getFloatingProps()} style={floatingStyles}>
asda
          </div>
        )}
      </FloatingPortal>
    )
  }

  return (
    <Collapse in={isOpen}>
      <div className='flex flex-col gap-6 mbs-3'>{children}</div>
    </Collapse>
  )
}

const DropdownMenu = (props: Props) => {
  // Props
  const { isBelowLgScreen, isDrawerOpen, setIsDrawerOpen } = props

  // states
  const [isOpen, setIsOpen] = useState(false)

  // hooks
  const pathname = usePathname()

  const { y, refs, floatingStyles, context } = useFloating<HTMLElement>({
    placement: 'bottom',
    open: isOpen,
    ...(!isBelowLgScreen && { onOpenChange: setIsOpen }),
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(14),
      flip({ padding: 10 }),
      size({
        apply({ rects, elements, availableHeight }) {
          Object.assign(elements.floating.style, {
            maxHeight: `${availableHeight}px`,
            minWidth: `${rects.reference.width}px`
          })
        },
        padding: 10
      })
    ]
  })

  // Floating UI Transition Styles
  const { isMounted, styles } = useTransitionStyles(context, {
    // Configure both open and close durations:
    duration: 300,

    initial: {
      opacity: 0,
      transform: 'translateY(10px)'
    },
    open: {
      opacity: 1,
      transform: 'translateY(0px)'
    },
    close: {
      opacity: 0,
      transform: 'translateY(10px)'
    }
  })

  const hover = useHover(context, {
    handleClose: safePolygon({
      blockPointerEvents: true
    }),
    restMs: 25,
    delay: { open: 75 }
  })

  const dismiss = useDismiss(context)
  const role = useRole(context, { role: 'menu' })

  const { getReferenceProps, getFloatingProps } = useInteractions([dismiss, role, hover])

  const Tag = isBelowLgScreen ? 'div' : Fragment

  const handleLinkClick = () => {
    if (isBelowLgScreen) {
      isDrawerOpen && setIsDrawerOpen(false)
    } else {
      setIsOpen(false)
    }
  }

  useEffect(() => {
    if (!isDrawerOpen && isOpen) {
      setIsOpen(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDrawerOpen])

  return (
    <Tag {...(isBelowLgScreen && { className: 'flex flex-col' })}>


    </Tag>
  )
}

export default DropdownMenu
