'use client'

// Next Imports
import Link from 'next/link'

// Third-party Imports
import classnames from 'classnames'

// Hook Imports
import useHorizontalNav from '@menu/hooks/useHorizontalNav'

// Util Imports
import { horizontalLayoutClasses } from '@layouts/utils/layoutClasses'

const FooterContent = () => {
  // Hooks
  const { isBreakpointReached } = useHorizontalNav()

  return (
    <div
      className={classnames(horizontalLayoutClasses.footerContent, 'flex items-center justify-between flex-wrap gap-4')}
    >
      <p>
        <span className='text-textSecondary'>{`© ${new Date().getFullYear()}, Made with `}</span>
        <span>{`❤️`}</span>
        <span className='text-textSecondary'>{` by `}</span>
        <Link href='https://pixinvent.com/' target='_blank' className='text-primary uppercase'>
          CureGuard
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
          <Link href='/front-pages/terms-and-conditions' className='text-textSecondary> hover:text-primary'>
            Terms & Conditions
          </Link>
        </div>
      )}
    </div>
  )
}

export default FooterContent
