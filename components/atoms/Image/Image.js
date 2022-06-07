import cn from 'classnames'
import Image from 'next/image'
import { PropTypes } from 'prop-types'
import styles from './Image.module.css'

export default function DisplayImage({
  src,
  width,
  height,
  alt,
  fill,
  cover,
  overlay,
  className,
}) {
  const sourceDomain = src && src?.includes('http') ? new URL(src) : undefined

  let domains = process.env.NEXT_PUBLIC_IMAGE_DOMAINS

  domains = !domains || !domains.length ? [] : domains.split('|')

  function NextImage() {
    const imageProps = {
      alt: alt,
      src: src,
    }

    if (fill) {
      imageProps.layout = 'fill'
    } else {
      imageProps.height = height
      imageProps.width = width
    }

    return sourceDomain?.host ? (
      <Image
        {...imageProps}
        className={cn(fill ? (cover ? styles.cover : styles.contain) : null)}
        placeholder='blur'
        blurDataURL='/images/blur.png'
      />
    ) : (
      <Image
        {...imageProps}
        className={cn(fill ? (cover ? styles.cover : styles.contain) : null)}
      />
    )
  }

  function HtmlImage() {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        width='100%'
        height='auto'
        alt={alt}
        className={cn(styles.image, className)}
      />
    )
  }

  if (!src) return <></>

  if (domains.includes(sourceDomain?.host) || !sourceDomain) {
    return (
      <div className={cn(styles.image, className)}>
        <NextImage />

        {overlay !== 'no' && (
          <div
            className={
              overlay === 'light' ? styles.overlay : styles.overlay_dark
            }
          ></div>
        )}
      </div>
    )
  }

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
