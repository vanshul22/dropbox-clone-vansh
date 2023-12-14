"use client";
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from "@/components/ui/dialog";
import { db } from "@/firebase";
import { useAppStore } from "@/store/store";
import { useUser } from "@clerk/nextjs";
import { doc, updateDoc } from "firebase/firestore";
import toast from 'react-hot-toast';
import { Input } from "@/components/ui/input"

const RenameModal = () => {

    const { user } = useUser();
    const [input, setInput] = useState('');
    const [isRenameModalOpen, setIsRenameModalOpen, fileId, filename] = useAppStore(state => [state.isRenameModalOpen, state.setIsRenameModalOpen, state.fileId, state.filename]);

    const renameFileFunc = async () => {
        // taking state in variable to remove extra spaces.
        let nameWithSpaces = input;
        // Defensive Programming...
        if (!user || !fileId) return;
        const toastId = toast.loading("Renaming file");

        if (/[^a-zA-Z0-9 ._]/.test(nameWithSpaces)) { alert("Please change file name, Special characters are not allowed..."); return };
        // Replacing the extra spaces with the space.
        let nameWithoutSpaces = nameWithSpaces.replace(/\s+/g, ' ').trim();
        if (nameWithoutSpaces.length < 3) { alert("Please change file name, Its not accepted..."); return };

        await updateDoc(doc(db, "users", user.id, "files", fileId), { filename: nameWithoutSpaces });
        toast.success("Renamed Successfully", { id: toastId });
        setInput("");
        setIsRenameModalOpen(false);
    };

    return (
        <Dialog open={isRenameModalOpen} onOpenChange={(isOpen) => setIsRenameModalOpen(isOpen)}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Rename the file</DialogTitle>
                    <Input id="link" defaultValue={filename} onChange={e => setInput(e.target.value)} onKeyDownCapture={e => e.key === "Enter" ? renameFileFunc() : ""} />
                </DialogHeader>

                <DialogFooter className="sm:justify-start">
                    <DialogClose asChild >
                        <div className="flex gap-x-2  flex-1">
                            <Button variant="outline" size="sm" className="px-3 flex-1" onClick={() => setIsRenameModalOpen(false)}>
                                <span className="sr-only">Cancel</span>
                                <span className="">Cancel</span>
                            </Button>
                            <Button variant="default" size="sm" className="px-3 flex-1" onClick={() => renameFileFunc()}>
                                <span className="sr-only">Rename</span>
                                <span className="">Rename</span>
                            </Button>
                        </div>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default RenameModal;