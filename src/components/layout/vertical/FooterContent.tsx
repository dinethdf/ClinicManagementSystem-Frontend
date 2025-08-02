'use client'

// Next Imports
import Link from 'next/link'

// Third-party Imports
import classnames from 'classnames'

// Hook Imports
import useVerticalNav from '@/@core/hooks/useVerticalNav'

// Util Imports
import { verticalLayoutClasses } from '@layouts/utils/layoutClasses'

const FooterContent = () => {
  // Hooks
  const { isBreakpointReached } = useVerticalNav()

  return (
    <div
      className={classnames(verticalLayoutClasses.footerContent, 'flex items-center justify-between flex-wrap gap-4')}
    >
      <p>
        <span className='text-textSecondary'>{`© ${new Date().getFullYear()}, Made with `}</span>
        
        <span className='text-textSecondary'>{` by `}</span>
        <Link href='#' target='_blank' className='text-primary uppercase'>
          DDF
        </Link>
      </p>
      {!isBreakpointReached && (
        <div className='flex items-center gap-4'>
          <Link href='/front-pages/about-us' className='text-textSecondary hover:text-primary'>
            About Us
          </Link>
          <Link href='/front-pages/contact-us' className='text-textSecondary hover:text-primary'>
            Contact Us
          </Link>
          <Link href='/front-pages/terms-and-conditions' className='text-textSecondary hover:text-primary'>
            Terms & Conditions
          </Link>
        </div>
      )}
    </div>
  )
}

export default FooterContent
