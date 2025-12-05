// React Imports
import type { SVGAttributes } from 'react'

const Logo = (props: SVGAttributes<SVGElement>) => {
  return (
    <svg
      width="1.5em"
      height="1em"
      viewBox="0 0 40 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Shield shape */}
      <path
        d="M20 0L34 4V10C34 17 27 22 20 24C13 22 6 17 6 10V4L20 0Z"
        fill="currentColor"
      />

      {/* Cross symbol (medical) */}
      <path
        d="M17 9H15V13H17V15H21V13H23V9H21V7H17V9Z"
        fill="white"
      />
    </svg>
  )
}

export default Logo
