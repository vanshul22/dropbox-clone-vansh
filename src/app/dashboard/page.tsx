import Dropzone from '@/components/Dropzone';
import TableWrapper from '@/components/Table/TableWrapper';
import { db } from '@/firebase';
import { auth } from '@clerk/nextjs'
import { collection, getDocs } from 'firebase/firestore';
import { DeleteModal } from '@/components/DeleteModal';
import RenameModal from '@/components/RenameModal';

const Dashboard = async () => {

  const { userId } = auth();

  const docsResults = await getDocs(collection(db, "users", userId!, "files"));

  const skeletonFiles = docsResults.docs.map(doc => ({
    id: doc.id,
    filename: doc.data().filename || doc.id,
    timestamp: new Date(doc.data().timestamp?.seconds * 1000) || undefined ,
    fullname: doc.data().fullname.toString(),
    downloadurl: doc.data().downloadurl,
    type: doc.data().type,
    size: doc.data().size,
    userId: doc.data().userId,
  }));


  return (
    <div className='border-t'>
      <Dropzone />

      <section className='container space-y-5'>
        <h2 className='font-bold'>All Files</h2>
        <div className="">
          {/* table Wrapper */}
          <TableWrapper skeletonFiles={skeletonFiles} />
          {/* Models */}
          <DeleteModal/>
          <RenameModal/>
        </div>
      </section>
    </div>
  )
}

export default Dashboard;