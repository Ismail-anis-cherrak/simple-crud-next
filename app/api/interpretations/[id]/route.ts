import client from "@/lib/appwrite_client";
import { Databases } from "appwrite";
import { NextResponse } from "next/server";

const database = new Databases(client)

//? fetch a single interpretation

async function fetchSingleInterpretation(id:string) {
    try {
        const interpretation = await database.getDocument(
            process.env.DB_ID as string,
            process.env.COLLECTION_ID as string,
            id
        )
        return interpretation
    } catch (error) {
        console.error('error fetching this interpretation', error)
        throw new Error('failed to fetch interpretation')
    }    
}

//? delete an interpretation


async function deleteInterpretation(id:string) {
    try {
        const responce = await database.deleteDocument(
            process.env.DB_ID as string,
            process.env.COLLECTION_ID as string,
            id
        )
        return responce
    } catch (error) {
        console.error('error deleting this interpretation', error)
        throw new Error('failed to delete interpretation')
    }    
}


//? update an interpretation


async function updateInterpretation(id:string, data:{term:string, explanation:string}) {
    try {
        const responce = await database.updateDocument(
            process.env.DB_ID as string,
            process.env.COLLECTION_ID as string,
            id,
            data
        )
        return responce
    } catch (error) {
        console.error('error updating this interpretation', error)
        throw new Error('failed to update interpretation')
    }    
}


//! GET, DELETE AND POST REQUESTS

export async function GET(req:Request,{params}:{params: {id:string}}){

    try {
        const id = params.id
        const interpretation = await fetchSingleInterpretation(id)
        return NextResponse.json(interpretation)
    } catch (error) {
        return NextResponse.json({error:'failed fetching this interpretation'},{status:500})
    }

}


export async function DELETE(req:Request,{params}:{params: {id:string}}){

    try {
        const id = params.id
        await deleteInterpretation(id)
        return NextResponse.json({message:'interpretation deleted successfully'})
    } catch (error) {
        return NextResponse.json({error:'failed to delete this interpretation'},{status:500})
    }

}

export async function PUT(req:Request,{params}:{params: {id:string}}){

    try {
        const id = params.id
        const data = await req.json()
        const interpretation = await updateInterpretation(id, data)
        return NextResponse.json(interpretation)
    } catch (error) {
        return NextResponse.json({error:'failed to update this interpretation'},{status:500})
    }

}