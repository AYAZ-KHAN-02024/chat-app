import React, { useEffect, useState } from 'react'
import Message from './message/Message'
import { signOut, onAuthStateChanged, getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { app } from './firebase/Firebase'
import {
  getFirestore,
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore'
import { useRef } from 'react';

const auth = getAuth(app)
const dataBase = getFirestore(app)


const login = () => {
  const Provider = new GoogleAuthProvider()
  signInWithPopup(auth, Provider)
}

const logOut = () => {
  signOut(auth)
}



function App() {
 
  const [user, setUser] = useState(false);
  const [Messages, setMessages] = useState('');
  const [allMessages,setAllMessages]=useState([ ]);
  const ForAutoScroll=useRef(null)


  const Submit = async (e) => {
    e.preventDefault();
    try {
      setMessages('');
      await addDoc(collection(dataBase, "message"), {
        text: Messages,
        uid: user.uid,
        uri: user.photoURL,
        timeOf_Creation: serverTimestamp(),
      })

      ForAutoScroll.current.scrollIntoView({behavior:"smooth"})

    } catch (error) {
      alert(error)
    }
  }



useEffect(() => {
  let isMounted = true;
  const q =query(collection(dataBase,"message"),orderBy('timeOf_Creation',"asc"))

  const unsubscribe = onAuthStateChanged(auth, (data) => {
    if (isMounted) {
      setUser(data);
     
    }
  });

  const unSubscribeMessage = onSnapshot(q, (snap) => {
    if (isMounted) {
      setAllMessages(
        snap.docs.map((val) => {
          const id = val.id;
          return { id, ...val.data() };
        })
      );
    }
  });

  return () => {
    isMounted = false;
    unsubscribe();
    unSubscribeMessage();
  };

},[]);



  return (
    <>
      {
        user ? (<>
          <div className='app'>

          <div className="header">
            <button onClick={logOut}>LogOut</button>
          </div>


          <div className='user_message ' >
           {
            allMessages.map((item)=>{
              return(
              <Message key={item.id} user={item.uid===user.uid?"me":"other"} {...item} />)
            })
           }
            
            
          </div>

          <form onSubmit={Submit} action="" className="typing">
            <input type="text" placeholder='type here...'
              value={Messages} onChange={(e) => {e.target.value.length >= 1 ?setMessages(e.target.value):null }}
            />
            <button type='submit'>Submit</button>

          </form>
        </div>

        <div ref={ForAutoScroll} >

        </div></>
        ) :
          (
            <div className='app' >
              <div className="header" style={{ justifyContent: "center", alignItems: "center" }}>
                <button onClick={login}>Sign up with Google</button>
              </div>
            </div>
          )
      }

    </>
  )
}

export default App
