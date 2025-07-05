"use client"


import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { ChangeEvent, useEffect, useState } from "react"
import Image from "next/image"
import axios from "axios"
import { updateAction } from "@/utils/updateAction"

interface Product {
    image: string;
    _id: string;
    name: string;
    price: string;
    link:string;
    description: string;
}


const UpdateForm = ({ productId }: { productId: string }) => {

     const router = useRouter();
     const [imageURL, setImageURL] = useState('')
     const [product, setProduct] = useState<Product>();

     useEffect(() => {
        axios.get(`/api/product/${productId}`)
             .then((response) => setProduct(response.data.product));
     },[])

     useEffect(() => {
        if(product){
            setImageURL(product.image)
        }
     },[product])

    async function clientAddAction(formData: FormData) {

        const {error , success} = await updateAction(formData, productId)

        if(error){
            toast.error(error);
        }

        if(success){
            toast.success(success)

            router.push("/")

            setImageURL('')
        }
    }

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if(file){
            const filesize = file.size;

            if(Math.round(filesize / 1024) > 1024){
                toast.error('Image greater than 1mb is not allowed.')
            }else{
                setImageURL(URL.createObjectURL(file))
            }
        }
    }

  return (
    <form action={clientAddAction} className='w-full max-w-xl mx-auto flex flex-col justify-center items-center space-y-4 mt-3 md:mt-5'>
        {imageURL && (<Image src={imageURL} alt="imgurl" 
        width={1000} height={1000} className="max-w-full max-h-72 object-cover object-center rounded-lg"/>)}
        <div className='flex flex-col w-full'>
            <label htmlFor="">Product Image: </label>
            <input type="file" accept="image/*" name="image" id="image" onChange={handleImageChange}
            className="w-full px-3 py-1.5 md:py-2 text-[#252422] rounded-lg bg-white border border-gray-500" />
        </div>

        <div className='flex flex-col w-full'>
            <label htmlFor="">Name: </label>
            <input type="text" name="name" defaultValue={product?.name} placeholder='Enter the product name' 
            className="w-full px-3 py-1.5 md:py-2 text-[#252422] rounded-lg bg-white border border-gray-500" />
        </div>

        <div className='flex flex-col w-full'>
            <label htmlFor="">Price: </label>
            <input type="number" name="price" defaultValue={product?.price} placeholder='Enter the product price' 
            className="w-full px-3 py-1.5 md:py-2 text-[#252422] rounded-lg bg-white border border-gray-500" />
        </div>

        <div className='flex flex-col w-full'>
            <label htmlFor="">Sellers Link: </label>
            <input type="text" name="link" defaultValue={product?.link} placeholder='Link wherer buyers can find you' 
            className="w-full px-3 py-1.5 md:py-2 text-[#252422] rounded-lg bg-white border border-gray-500" />
        </div>

        <div className='flex flex-col w-full'>
            <label htmlFor="">Description: </label>
            <textarea name="description" defaultValue={product?.description} placeholder='Enter the product description' rows={4}
            className="w-full px-3 py-1.5 md:py-2 text-[#252422] rounded-lg bg-white border border-gray-500"></textarea>
        </div>

        <button type="submit" className='w-full bg-[#212529] text-white px-3 py-2 rounded-md cursor-pointer'>
            Update Product
        </button>

    </form>
  )
}

export default UpdateForm