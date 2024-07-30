import client from "@/lib/appwrite_client";
import { Databases, ID, Query } from "appwrite";
import { NextResponse } from "next/server";

const database = new Databases(client);

export async function createInterpretation(data: { term: string; explanation: string }) {
    try {
        const response = await database.createDocument(
            process.env.DB_ID as string,
            process.env.COLLECTION_ID as string,
            ID.unique(),
            data
        );
        return response;
    } catch (error) {
        console.error("Error creating the interpretation", error);
        throw new Error("Failed to create interpretation");
    }
}

export async function fetchInterpretations() {
    try {
        const response = await database.listDocuments(
            process.env.DB_ID as string,
            process.env.COLLECTION_ID as string,
            [Query.orderDesc("$createdAt")]
        );
        return response.documents;
    } catch (error) {
        console.error("Error fetching the interpretations", error);
        throw new Error("Failed to fetch interpretations");
    }
}

export async function POST(req: Request) {
    try {
        const { term, explanation } = await req.json();
        const data = { term, explanation };
        const response = await createInterpretation(data);
        return NextResponse.json({ message: "Created successfully", data: response });
    } catch (error) {
        console.error("Error creating interpretation", error);
        return NextResponse.json({ error: "Error creating interpretation" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const interpretations = await fetchInterpretations();
        return NextResponse.json(interpretations);
    } catch (error) {
        console.error("Error fetching interpretations", error);
        return NextResponse.json({ error: "Error fetching interpretations" }, { status: 500 });
    }
}
