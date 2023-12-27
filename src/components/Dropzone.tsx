"use client"
import { db, storage } from '@/firebase';
import { cn } from '@/lib/utils';
import { useUser } from '@clerk/nextjs';
import { serverTimestamp } from 'firebase/database';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useState } from 'react';
import DropzoneComponent from 'react-dropzone'
import toast from 'react-hot-toast';

const Dropzone = () => {
    const [loading, setLoading] = useState(false);
    const { isLoaded, isSignedIn, user } = useUser();

    const onDrop = (acceptedFiles: File[]) => {
        acceptedFiles.forEach(file => {
            const reader = new FileReader();
            reader.onabort = () => console.log("File reading was aborted.")
            reader.onerror = () => console.log("File reading has failed.");
            reader.onload = async () => await uploadPost(file)
            reader.readAsArrayBuffer(file);
        });
    }

    const uploadPost = async (selectedFile: File) => {
        if (loading) return;
        if (!user) return;

        const toastId = toast.loading("Uploading file");
        setLoading(true);

        const data = { userId: user.id, fullname: user.fullName, profileImg: user.imageUrl, timestamp: serverTimestamp(), filename: selectedFile.name, type: selectedFile.type, size: selectedFile.size };

        // Add doc => users/user123/files
        const docRef = await addDoc(collection(db, "users", user.id, "files"), data);

        const imageRef = ref(storage, `users/${user.id}/files/${docRef.id}`);
        const snapshot = await uploadBytes(imageRef, selectedFile);
        const downloadurl = await getDownloadURL(imageRef);
        await updateDoc(doc(db, "users", user.id, "files", docRef.id), { downloadurl })
        setLoading(false);
        toast.success("Uploaded Successfully", { id: toastId });
    };

    // Max file size is 20mb;
    const maxFileSize = 20971520;

    return (
        <DropzoneComponent minSize={0} maxSize={maxFileSize} onDrop={onDrop}>
            {({ getRootProps, getInputProps, isDragActive, isDragReject, fileRejections }) => {

                const isFileTooLarge = fileRejections.length > 0 && fileRejections[0].file.size > maxFileSize;
                return (
                    <section className='m-4'>
                        <div {...getRootProps()} className={cn("w-full h-52 flex justify-center items-center p-5 border border-dashed rounded-lg text-center", isDragActive ? "bg-[#035FFE] text-white animate-pulse" : "bg-slate-100/50 dark:bg-slate-800/80 text-slate-400")}>
                            <input {...getInputProps()} />
                            {!isDragActive && "Click here or drop a file... to upload!"}
                            {isDragActive && !isDragReject && "Drop to upload this file"}
                            {isDragReject && "File type not supported"}
                            {isFileTooLarge && <div className='text-red-500 mt-2'>File is too large</div>}
                        </div>
                    </section>
                )
            }}
        </DropzoneComponent>
    )
}

export default Dropzone;