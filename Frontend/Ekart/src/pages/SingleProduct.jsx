import Breadcrums from '@/components/Breadcrums';
import ProdocutDesc from '@/components/ProdocutDesc';
import ProductImg from '@/components/ProductImg';
import React from 'react'
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'

const SingleProduct = () => {
    const params = useParams();
    const productId = params.id;
    const { products } = useSelector(store => store.product);
    const product = products.find(p => p._id === productId);
  return (
    <div className='pt-30 py-10 mx-w-7xl mx-auto'>
        
      <Breadcrums product={product}/>
       <div className='mt-10 grid grid-cols-2 items-start'>
        <ProductImg image={product.productImg}/>
        <ProdocutDesc product={product}/>
       </div>
    </div>
  )
}

export default SingleProduct
