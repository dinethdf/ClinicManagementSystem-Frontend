'use client'

// React Imports
import { useState } from 'react'

// Next Imports
import Link from 'next/link'

// MUI Imports
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Drawer from '@mui/material/Drawer'
import useMediaQuery from '@mui/material/useMediaQuery'
import useScrollTrigger from '@mui/material/useScrollTrigger'
import Typography from '@mui/material/Typography'
import type { Theme } from '@mui/material/styles'

// Third-party Imports
import classnames from 'classnames'

// Util Imports
import { frontLayoutClasses } from '@layouts/utils/layoutClasses'

// Styles Imports
import styles from './styles.module.css'

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'For Your Team', href: '#roles' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' }
]

const Header = () => {
  // States
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // Hooks
  const isBelowLgScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'))

  const trigger = useScrollTrigger({
    threshold: 10,
    disableHysteresis: true
  })

  return (
    <header className={classnames(frontLayoutClasses.header, styles.cgHeader)}>
      <div
        className={classnames(
          frontLayoutClasses.navbar,
          styles.cgNavbar,
          { [styles.cgNavbarScrolled]: trigger }
        )}
      >
        <div className={classnames(frontLayoutClasses.navbarContent, styles.cgNavbarContent)}>

          {/* ─── Logo ─── */}
          <Link href='/' className={styles.cgLogo} aria-label='CureGuard home'>
            <div className={styles.cgLogoIcon} aria-hidden='true'>✦</div>
            <span className={styles.cgLogoText}>CureGuard</span>
          </Link>

          {/* ─── Desktop Nav Links ─── */}
          {!isBelowLgScreen && (
            <nav aria-label='Main navigation'>
              <ul className={styles.cgNavLinks}>
                {navLinks.map(link => (
                  <li key={link.href}>
                    <Link href={link.href} className={styles.cgNavLink}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          {/* ─── Desktop CTAs ─── */}
          {!isBelowLgScreen && (
            <div className='flex items-center gap-3'>
              <Button
                component={Link}
                href='/login'
                variant='outlined'
                size='medium'
                className={styles.cgBtnLogin}
              >
                Login
              </Button>
              <Button
                component={Link}
                href='/register'
                variant='contained'
                size='medium'
                color='primary'
                className={styles.cgBtnTrial}
              >
                Start Free Trial
              </Button>
            </div>
          )}

          {/* ─── Mobile: Hamburger ─── */}
          {isBelowLgScreen && (
            <IconButton
              onClick={() => setIsDrawerOpen(true)}
              aria-label='Open menu'
              className={styles.cgHamburger}
            >
              <i className='tabler-menu-2' />
            </IconButton>
          )}

        </div>
      </div>

      {/* ─── Mobile Drawer ─── */}
      <Drawer
        anchor='left'
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        PaperProps={{ className: styles.cgDrawer }}
      >
        {/* Drawer Header */}
        <div className={styles.cgDrawerHeader}>
          <Link
            href='/'
            className={styles.cgLogo}
            onClick={() => setIsDrawerOpen(false)}
            aria-label='CureGuard home'
          >
            <div className={styles.cgLogoIcon} aria-hidden='true'>✦</div>
            <span className={styles.cgLogoText}>CureGuard</span>
          </Link>
          <IconButton
            onClick={() => setIsDrawerOpen(false)}
            aria-label='Close menu'
            className={styles.cgDrawerClose}
          >
            <i className='tabler-x' />
          </IconButton>
        </div>

        {/* Drawer Nav Links */}
        <nav aria-label='Mobile navigation' className={styles.cgDrawerNav}>
          <ul className={styles.cgDrawerLinks}>
            {navLinks.map(link => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={styles.cgDrawerLink}
                  onClick={() => setIsDrawerOpen(false)}
                >
                  {link.label}
                  <i className='tabler-chevron-right text-sm opacity-40' />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Drawer CTAs */}
        <div className={styles.cgDrawerCtas}>
          <Button
            component={Link}
            href='/login'
            variant='outlined'
            fullWidth
            className={styles.cgBtnLogin}
            onClick={() => setIsDrawerOpen(false)}
          >
            Login
          </Button>
          <Button
            component={Link}
            href='/register'
            variant='contained'
            color='primary'
            fullWidth
            className={styles.cgBtnTrial}
            onClick={() => setIsDrawerOpen(false)}
          >
            Start Free Trial
          </Button>
        </div>
      </Drawer>
    </header>
  )
}

export default Header