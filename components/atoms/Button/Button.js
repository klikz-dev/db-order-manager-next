import React from 'react'
import NextLink from 'next/link'
import PropTypes from 'prop-types'
import cn from 'classnames'
import styles from './Button.module.css'

export default function Button({
  attributes,
  className,
  disabled,
  onClick,
  size,
  weight,
  style,
  tag,
  type,
  href,
  urlExternal,
  children,
}) {
  const buttonClassNames = cn(
    styles.button,
    className,
    disabled && styles.disabled,
    styles[size],
    styles[weight],
    styles[type]
  )

  if (href) {
    return urlExternal ? (
      <a
        href={href}
        className={buttonClassNames}
        style={style}
        {...attributes}
        target='_blank'
        rel='noreferrer'
      >
        {children}
      </a>
    ) : (
      <NextLink href={href}>
        <a className={buttonClassNames} style={style} {...attributes}>
          {children}
        </a>
      </NextLink>
    )
  } else {
    return (
      // Render element with default button tag.
      React.createElement(
        `${tag}`,
        {
          className: buttonClassNames,
          onClick,
          ...attributes,
          disabled,
          style,
        },
        children
      )
    )
  }
}

Button.propTypes = {
  attributes: PropTypes.object,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  tag: PropTypes.string,
  type: PropTypes.oneOf(['primary', 'secondary', 'tertiary', 'custom']),
  href: PropTypes.string,
  urlExternal: PropTypes.bool,
}

Button.defaultProps = {
  disabled: false,
  size: 'md',
  tag: 'button',
  type: 'primary',
  weight: 'medium',
  urlExternal: false,
}
