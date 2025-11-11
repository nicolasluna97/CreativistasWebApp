import React from 'react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'

export default function Link(props) {
  const {
    route,
    href,
    params,
    className,
    activeClassName,
    sublink,            // 👈 la tomamos acá
    children,
    ...rest
  } = props

  const router = useRouter()

  const resolvedHref = resolveHref({ route, href, params })
  const isActive = activeClassName && router?.pathname === stripQuery(resolvedHref)

  // 👇 agregamos 'sublink' como clase si viene true, y NO lo pasamos al DOM
  const classes = [
    className,
    isActive ? activeClassName : null,
    sublink ? 'sublink' : null
  ].filter(Boolean).join(' ') || undefined

  if (React.isValidElement(children) && children.type === 'a') {
    const { children: inner, className: aClass, ...aRest } = children.props || {}
    const mergedClass = [classes, aClass].filter(Boolean).join(' ') || undefined
    return (
      <NextLink href={resolvedHref} className={mergedClass} {...aRest} {...rest}>
        {inner}
      </NextLink>
    )
  }

  return (
    <NextLink href={resolvedHref} className={classes} {...rest}>
      {children}
    </NextLink>
  )
}

function resolveHref({ route, href, params }) {
  let out = href || route || '/'
  if (params && typeof params === 'object') {
    Object.entries(params).forEach(([k, v]) => {
      out = out.replace(`:${k}`, encodeURIComponent(String(v)))
    })
  }
  return out
}
function stripQuery(u) {
  const i = u.indexOf('?')
  return i >= 0 ? u.slice(0, i) : u
}