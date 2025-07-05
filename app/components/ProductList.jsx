"use client"

import Link from 'next/link'
import Image from "next/image"
import axios from "axios"
import React, { useEffect, useState } from 'react';


const ProductList = () => {

    const [products, setProducts] = useState([])

    useEffect(() => {
 
      axios.get("/api/fetch-products").then((response) => setProducts(response.data.products))
        
    },[])

  return (
    <div id="product" className="px-4 md:px-12 py-5 md:py-10 grid flex justify-center">
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5'>
            {products.map((product, index) => (
                <Link href={`/product/${product._id}`} key={index}>
                   <Image src={`${product.image}`} alt="img" width={1000} height={1000} 
                   className="max-w-[17rem] h-72 object-cover object-center rounded-lg"/>

                   <div>
                    <h2 className="font-semibold text-lg">{product.name}</h2>
                    <p className="font-medium text-sm mt-1">{product.price}</p>  
                    </div>
                </Link>
            ))}
        </div>
    </div>
  )
}

export default ProductList