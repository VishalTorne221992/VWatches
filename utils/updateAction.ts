"use server"

import { connectDB } from "@/app/api/db/connectDB";
import cloudinary from "./cloudinary";
import Product from "@/app/api/models/product.model";

export async function updateAction(formData : FormData, id: string){

    try{
        const image = formData.get("image") as File;
        const name = formData.get("name");
        const price = formData.get("price");
        const link = formData.get("link");
        const description = formData.get("description")

        if(!name || !price || !link || !description){
            console.log("All Fields are required.")

            return {
                error: "All Fields are required."
            }
        }

        await connectDB();

        const product = await Product.findById(id);

        if(!product){
            return {
                error: "No Product found"
            }
        }

        if(image.size === 0){
            // update without the image

            await Product.findByIdAndUpdate( id, {
            name,
            price,
            link,
            description
            });

            return {
                success: "Product updated successfully"
            }
        }else{
            // Delete the previous img first

            const parts = product.image.split("/");
            const fileName = parts[parts.length - 1];

            const imageId = fileName.split(".")[0];

            cloudinary.uploader.destroy(`vwatches/${imageId}`).then((result) => console.log(result));

            // Image processes

            const arrayBuffer = await image.arrayBuffer();
            const buffer = new Uint8Array(arrayBuffer);
            const imageResponse: any = await new Promise((resolve, reject) => {
                cloudinary.uploader
                .upload_stream({
                    resource_type: "auto",
                    folder: "vwatches"
                },
                async (error, result) => {
                    if(error){
                        return reject(error.message)
                    }
                    return resolve(result)
                }
                )
                .end(buffer)
            })

            console.log("Image response: ", imageResponse);


            // store in DB

            await Product.findByIdAndUpdate( id, {
                image: imageResponse.secure_url,
                name,
                price,
                link,
                description
            })

            return {
                success: "Product updated successfully... !"
            };
        }


    }catch(error){
        
         return {
            error: "Something went wrong.."
         }
    }
}