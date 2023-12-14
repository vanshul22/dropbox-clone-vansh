"use client"
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from "@/components/ui/dialog";
import { db, storage } from "@/firebase";
import { useAppStore } from "@/store/store";
import { useUser } from "@clerk/nextjs";
import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import toast from 'react-hot-toast';


export function DeleteModal() {
  const { user } = useUser();
  const [isDeleteModalOpen, setIsDeleteModalOpen, fileId, setFileId] = useAppStore(state => [state.isDeleteModalOpen, state.setIsDeleteModalOpen, state.fileId, state.setFileId]);

  const deleteFileFunc = async () => {
    if (!user || !fileId) return;
    const toastId = toast.loading("Deleting file");

    const fileRef = ref(storage, `users/${user.id}/files/${fileId}`);
    try {
      await deleteObject(fileRef);
      await deleteDoc(doc(db, "users", user.id, "files", fileId));
      toast.success("Deleted Successfully", { id: toastId });
    } catch (error) {
      console.log(error);
      toast.error("Error Deleting File", { id: toastId });
    }
  }


  return (
    <Dialog open={isDeleteModalOpen} onOpenChange={(isOpen) => setIsDeleteModalOpen(isOpen)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Are you sure you want to delete?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your file!
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="sm:justify-start">
          <DialogClose asChild >
            <div className="flex gap-x-2  flex-1">
              <Button variant="outline" size="sm" className="px-3 flex-1" onClick={() => setIsDeleteModalOpen(false)}>
                <span className="sr-only">Cancel</span>
                <span className="">Cancel</span>
              </Button>
              <Button variant="destructive" size="sm" className="px-3 flex-1" onClick={() => deleteFileFunc()}>
                <span className="sr-only">Delete</span>
                <span className="">Delete</span>
              </Button>
            </div>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}