import React from 'react'
import NextLink from 'next/link'
import PropTypes from 'prop-types'

export default function TextLink({
  attributes,
  className,
  style,
  href,
  urlExternal,
  children,
}) {
  return urlExternal || href.includes('recommends') ? (
    <a
      href={href}
      className={className}
      style={style}
      target='_blank'
      rel='noreferrer'
      {...attributes}
    >
      {children}
    </a>
  ) : (
    <NextLink href={href}>
      <a className={className} style={style} {...attributes}>
        {children}
      </a>
    </NextLink>
  )
}

TextLink.propTypes = {
  attributes: PropTypes.object,
  className: PropTypes.string,
  href: PropTypes.string.isRequired,
  urlExternal: PropTypes.bool,
  style: PropTypes.object,
}

TextLink.defaultProps = {
  disabled: false,
  urlExternal: false,
}
