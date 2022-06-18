import React, { useState } from 'react'
import cn from 'classnames'
import { MenuIcon, XIcon } from '@heroicons/react/outline'
import styles from './SideNav.module.css'

export default function index() {
  const [show, setShow] = useState(false)

  return (
    <div className={styles.root}>
      <div aria-label='toggler' className={styles.toggle}>
        <button
          aria-label='open'
          onClick={() => setShow(true)}
          className={show ? styles.hide : undefined}
        >
          <MenuIcon width={24} height={24} />
        </button>

        <button
          aria-label='close'
          onClick={() => setShow(false)}
          className={!show && styles.hide}
        >
          <XIcon width={24} height={24} />
        </button>
      </div>

      <div className={cn(show && styles.collapse, styles.wrap)}></div>
    </div>
  )
}
