import React from 'react'
import NextLink from 'next/link'
import PropTypes from 'prop-types'
import cn from 'classnames'
import Icon from '@/components/atoms/Icon'
import styles from './Button.module.scss'

/**
 * Render the common inner part of the button component.
 *
 * @param  {object}  props          The props object.
 * @param  {string}  props.icon     Optional icon.
 * @param  {string}  props.text     Button text or aria-label.
 * @return {Element}                The inside of the Button component.
 */
export function ButtonInner({ icon, text }) {
  return (
    <>
      {icon && (
        <Icon
          icon={icon}
          title={text}
          ariaHidden={text ? true : false}
          className={styles.icon}
        />
      )}
      <span className={styles.text}>{text}</span>
    </>
  )
}

ButtonInner.propTypes = {
  icon: PropTypes.string,
  text: PropTypes.string,
}

/**
 * @param  {object}   props              The props object.
 * @param  {string}   props.attributes   Optional attributes to add to the button.
 * @param  {string}   props.className    Optional classNames.
 * @param  {boolean}  props.disabled     Whether the button is disabled.
 * @param  {string}   props.icon         Icon to render inside the button.
 * @param  {Function} props.onClick      Button onClick function.
 * @param  {string}   props.size         Button size.
 * @param  {object}   props.style        Custom button styles.
 * @param  {string}   props.tag          The wrapper tag.
 * @param  {string}   props.text         Button text.
 * @param  {string}   props.type         Button type.
 * @param  {string}   props.href          Button link href.
 * @param  {boolean}  props.urlExternal  Whether the url on this button links to an external site.
 * @return {Element}                     The button component.
 */
export default function Button({
  attributes,
  className,
  disabled,
  icon,
  onClick,
  size,
  weight,
  style,
  tag,
  text,
  type,
  href,
  urlExternal,
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
        aria-label={text}
        style={style}
        {...attributes}
      >
        <ButtonInner icon={icon} text={text} />
      </a>
    ) : (
      <NextLink href={href}>
        <a
          className={buttonClassNames}
          aria-label={text}
          style={style}
          {...attributes}
        >
          <ButtonInner icon={icon} text={text} />
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
          'aria-label': text,
          onClick,
          ...attributes,
          disabled,
          style,
        },
        <ButtonInner icon={icon} text={text} />
      )
    )
  }
}

Button.propTypes = {
  attributes: PropTypes.object,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  icon: PropTypes.string,
  onClick: PropTypes.func,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  style: PropTypes.shape({
    backgroundColor: PropTypes.string,
    color: PropTypes.string,
  }),
  tag: PropTypes.string,
  text: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['primary', 'secondary', 'tertiary', 'custom']),
  weight: PropTypes.oneOf(['light', 'medium', 'semi', 'bold']),
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
