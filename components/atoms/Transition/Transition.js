import { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Transition } from '@headlessui/react'

/**
 * Render the Transition component.
 *
 * @author Murrell Johnson
 * @param  {object}  props           The component attributes as props.
 * @param  {any}     props.children  Child component(s) to render.
 * @return {Element}                 The Transition component.
 */
export default function TransitionComponent({ children }) {
  return (
    <Transition
      as={Fragment}
      enter='transition ease-out duration-200'
      enterFrom='opacity-0 translate-y-1'
      enterTo='opacity-100 translate-y-0'
      leave='transition ease-in duration-150'
      leaveFrom='opacity-100 translate-y-0'
      leaveTo='opacity-0 translate-y-1'
    >
      {children}
    </Transition>
  )
}

TransitionComponent.propTypes = {
  children: PropTypes.any.isRequired,
}
