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
import type { Theme } from '@mui/material/styles'

// Third-party Imports
import classnames from 'classnames'

// Util Imports
import { frontLayoutClasses } from '@layouts/utils/layoutClasses'

// Styles Imports
import styles from './styles.module.css'

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Services', href: '#services' },
  { label: 'Specialists', href: '#specialists' },
  { label: 'About Us', href: '#about' },
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
          <Link href='/' className={styles.cgLogo} aria-label='New Senara home'>
            <div className={classnames(styles.cgLogoIcon, 'text-primary')} aria-hidden='true'>🏥</div>
            <span className={styles.cgLogoText} style={{ fontFamily: "'Playfair Display', serif" }}>
              New Senara
            </span>
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
                sx={{ borderRadius: 50, fontWeight: 700 }}
              >
                Staff Login
              </Button>
              <Button
                component={Link}
                href='/login?type=patient'
                variant='contained'
                size='medium'
                color='primary'
                className={styles.cgBtnTrial}
                sx={{ borderRadius: 50, fontWeight: 700, boxShadow: '0 4px 14px rgba(0,150,136,0.35)' }}
              >
                Patient Portal
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
            aria-label='New Senara home'
          >
            <div className={classnames(styles.cgLogoIcon, 'text-primary')} aria-hidden='true'>🏥</div>
            <span className={styles.cgLogoText} style={{ fontFamily: "'Playfair Display', serif" }}>
              New Senara
            </span>
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
            sx={{ borderRadius: 50, fontWeight: 700 }}
          >
            Staff Login
          </Button>
          <Button
            component={Link}
            href='/login?type=patient'
            variant='contained'
            color='primary'
            fullWidth
            className={styles.cgBtnTrial}
            onClick={() => setIsDrawerOpen(false)}
            sx={{ borderRadius: 50, fontWeight: 700 }}
          >
            Patient Portal
          </Button>
        </div>
      </Drawer>
    </header>
  )
}

export default Header