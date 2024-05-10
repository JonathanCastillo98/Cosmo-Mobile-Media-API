import dotenv from 'dotenv';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

dotenv.config();

const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME;
const AWS_BUCKET_REGION = process.env.AWS_BUCKET_REGION;
const AWS_PUBLIC_KEY = process.env.AWS_PUBLIC_KEY;
const AWS_SECRET_KEYGEN = process.env.AWS_SECRET_KEYGEN;

const client = new S3Client({
    region: AWS_BUCKET_REGION,
    credentials: {
        accessKeyId: AWS_PUBLIC_KEY,
        secretAccessKey: AWS_SECRET_KEYGEN
    }
})

export async function updloadFile(imgId, img) {
    const uploadParams = {
        Bucket: AWS_BUCKET_NAME,
        Key: imgId,
        Body: img
    };
    const commandCreate = new PutObjectCommand(uploadParams);
    await client.send(commandCreate);

    const urlImg = `https://${AWS_BUCKET_NAME}.s3.${AWS_BUCKET_REGION}.amazonaws.com/${imgId}`

    return urlImg
}

export async function deleteFile(imgId) {
    const deleteParams = {
        Bucket: AWS_BUCKET_NAME,
        Key: imgId
    };

    const commandDelete = new DeleteObjectCommand(deleteParams);
    await client.send(commandDelete);

    console.log(`El objeto ${imgId} ha sido eliminado del bucket ${AWS_BUCKET_NAME}`);
}

