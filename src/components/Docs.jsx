import React, { useEffect, useRef, useState } from 'react'
import ModalComponent from './ModalComponent';
import { useNavigate } from 'react-router-dom';
import { addDoc, collection, onSnapshot } from 'firebase/firestore';

export default function Docs({ database }) {

  const [title, setTitle] = useState('');
  const [open, setOpen] = useState(false);
  const [docsData, setDocsData] = useState([]);
  const handleOpen = () => setOpen(true);
  const isMounted = useRef();
  let navigate = useNavigate();
  const collectionRef = collection(database, 'docsData')

  const addData = () => {
    addDoc(collectionRef, {
      title: title,
    }).then(() => {
      alert('Data Added')
    }).catch(() => {
      alert('Cannot add data')
    })
  }

  const getData = () => {
    onSnapshot(collectionRef, (data) => {
      setDocsData(data.docs.map((doc) => {
        return { ...doc.data(), id: doc.id }
      }))
    })
  }

  const getID = (id) => {
    navigate(`/editDocs/${id}`)
  }

  useEffect(() => {
    if (isMounted.current) {
      return
    }

    isMounted.current = true;
    getData()
  }, [])

  return (
    <div className="docs-main">
      <h1>DocHub</h1>
      <p>Google docs like text editor with real-time data store</p>
      <button className='add-docs' onClick={handleOpen}> Add a Document</button>
      <ModalComponent open={open} setOpen={setOpen} title={title} setTitle={setTitle} addData={addData} />
      <div className="grid-main">
        {docsData.map((doc) => {
          return (
            <div key={doc.id} className='grid-child' onClick={() => getID(doc.id)}>
              <p>{doc.title}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
