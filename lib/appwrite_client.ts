import { Client } from "appwrite";

const client = new Client();

client
    .setEndpoint(process.env.APPWRITE_ENDPOINT as string)
    .setProject(process.env.APPWRITE_PROJECT as string);


export default client 