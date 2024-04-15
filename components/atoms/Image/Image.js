import cn from 'classnames'
import { PropTypes } from 'prop-types'
import styles from './Image.module.css'

export default function DisplayImage({ src, alt, className }) {
  function HtmlImage() {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        width='100%'
        height='auto'
        alt={alt}
        className={cn(styles.cover, className)}
      />
    )
  }

  if (!src) return <></>

  return <HtmlImage />
}

DisplayImage.propTypes = {
  src: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  alt: PropTypes.string,
  fill: PropTypes.bool,
  cover: PropTypes.bool,
  overlay: PropTypes.oneOf(['no', 'light', 'dark']),
  className: PropTypes.string,
}

DisplayImage.defaultProps = {
  fill: false,
  cover: false,
  overlay: 'no',
}
