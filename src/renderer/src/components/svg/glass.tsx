import type { SVGProps } from 'react'
export function Glass(props: SVGProps<SVGSVGElement>): React.JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
      />
    </svg>
  )
}

// const BetterAuth = () => (
//   <svg {...props} fill="none" viewBox="0 0 500 500">
//     <path fill="#000" d="M0 0h500v500H0z" />
//     <path fill="#fff" d="M69 121h86.988v259H69zM337.575 121H430v259h-92.425z" />
//     <path fill="#fff" d="M427.282 121v83.456h-174.52V121zM430 296.544V380H252.762v-83.456z" />
//     <path fill="#fff" d="M252.762 204.455v92.089h-96.774v-92.089z" />
//   </svg>
// )
