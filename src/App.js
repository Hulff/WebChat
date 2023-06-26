import { useState, useRef } from "react";
import { v4 as uuid } from "uuid";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import {
  getFirestore,
  collection,
  getDocs,
  orderBy,
  limit,
  query,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  useCollection,
  useCollectionData,
} from "react-firebase-hooks/firestore";
import { BiSend } from "react-icons/bi";
import { PiSignInBold } from "react-icons/pi";
import { FcGoogle } from "react-icons/fc";
import "./App.css";

const firebaseConfig = {
  apiKey: "AIzaSyBjhzML-N5DjEW1DHwkbS2vYi5h8HJhUF8",
  authDomain: "webchatbyhulff.firebaseapp.com",
  projectId: "webchatbyhulff",
  storageBucket: "webchatbyhulff.appspot.com",
  messagingSenderId: "972828551178",
  appId: "1:972828551178:web:823d0843820f84f18e97f3",
  measurementId: "G-GQW3KQNN8X",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

function App() {
  const [user] = useAuthState(auth);
  return (
    <div className="Main">
      <section>{user ? <ChatRoom /> : <SignIn />}</section>
    </div>
  );
}
function SignIn() {
  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).then((result) => {
      const username = result.user;
    });
  };
  return (
    <>
      <div className="container-signin">
        <h1>MyChat</h1>
        <button onClick={signInWithGoogle}>
          Sign in with <FcGoogle />
        </button>
      </div>
    </>
  );
}
function SignOut() {
  const signInOutGoogle = () => {
    auth.signOut();
  };
  return (
    <>
      <div className="container-signout">
        <button onClick={signInOutGoogle}>
          <PiSignInBold /> Sign out
        </button>
      </div>
    </>
  );
}
function ChatRoom() {
  const messagesRef = collection(db, "messages");
  const queryRef = query(messagesRef, orderBy("createdAt"), limit(25));
  const [messages] = useCollectionData(queryRef, { idField: "id" });
  const [formValue, setFormValue] = useState("");
  const endOfChat = useRef();

  const sendMessage = async (e) => {
    let textvl = formValue;
    const uid = auth.currentUser.uid;
    console.log(auth);
    e.preventDefault();
    setFormValue("");
    await addDoc(messagesRef, {
      text: textvl,
      createdAt: serverTimestamp(),
      uid,
      user: auth.currentUser.displayName,
    });
    endOfChat.current.scrollIntoView({ behavior: "smooth", block: "end" });
  };

  return (
    <>
      <SignOut />
      <div className="div-messages">
        {messages &&
          messages.map((msg) => <ChatMessage key={uuid()} message={msg} />)}

        <div ref={endOfChat}></div>
      </div>
      <form onSubmit={sendMessage}>
        <input
          placeholder="Type here! :)"
          type="text"
          onChange={(e) => setFormValue(e.target.value)}
          value={formValue}
        />
        <button type="submit">
          <BiSend />
        </button>
      </form>
    </>
  );
}
function ChatMessage({ message }) {
  console.log(message);
  const { text, uid, user } = message;
  const messageClass = uid === auth.currentUser.uid ? "sent" : "recieved";
  return (
    <div className={messageClass}>
      <h2>{user}</h2>
      <p>{text}</p>
    </div>
  );
}

export default App;
