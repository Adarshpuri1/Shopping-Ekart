import React, { useState } from 'react'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

const ProductImg = ({ image }) => {
  if (!image || image.length === 0) {
    return <p>No image available</p>
  }

  const [mainImg, setMainImg] = useState(image[0].url)

  return (
    <div className="flex gap-5 w-max">
      <div className="gap-5 flex flex-col">
        {image.map((img, index) => (
          <img
            key={index}
            onClick={() => setMainImg(img.url)}
            src={img.url}
            alt="product"
            className="cursor-pointer w-20 h-20 shadow-lg"
          />
        ))}
      </div>

      <Zoom>
        <img
          src={mainImg}
          alt="main product"
          className="w-[500px] h-[500px] object-contain shadow-lg"
        />
      </Zoom>
    </div>
  )
}

export default ProductImg
