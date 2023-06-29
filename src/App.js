import { useState, useRef, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import {
  getFirestore,
  collection,
  orderBy,
  limit,
  query,
  getDoc,
  doc,
  addDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { BiSend } from "react-icons/bi";
import { PiSignInBold } from "react-icons/pi";
import { FiCopy } from "react-icons/fi";
import { AiOutlineLoading3Quarters, AiOutlineUser } from "react-icons/ai";
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
  const [userIdentifier, setUserIdentifier] = useState(null);
  useEffect(() => {
    const setUserData = async () => {
      const usersCollection = collection(db, "users");
      const userDocRef = doc(usersCollection, auth.currentUser.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        // User already exists, do not create a new document
        setUserIdentifier(userDoc.data().identifier);
        return;
      }
    };
    if (user) {
      setUserData();
    }
  }, [user]);
  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="Main">
            <section>
              <SignIn setUserIdentifier={setUserIdentifier} />
            </section>
          </div>
        }
      />
      <Route
        path="/ChatRoom"
        element={
          <div className="Main">
            <section>
              {user ? (
                <ChatRoom />
              ) : (
                <>
                  <div className="loading-indicator">
                    <AiOutlineLoading3Quarters />
                  </div>
                </>
              )}
            </section>
          </div>
        }
      />
      <Route
        path="/AccountInfo"
        element={
          <div className="Main">
            {user ? (
              <>
                <section>
                  <SignOut />
                  <AccountInfo userIdentifier={userIdentifier} />
                </section>
              </>
            ) : (
              <></>
            )}
          </div>
        }
      />
    </Routes>
  );
}
function SignIn({ setUserIdentifier }) {
  const navigate = useNavigate();
  const usersCollection = collection(db, "users");
  const generateRandomCode = (length) => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let code = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters[randomIndex];
    }

    return code;
  };
  const createUser = async () => {
    const userDocRef = doc(usersCollection, auth.currentUser.uid);
    try {
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        // User already exists, do not create a new document
        setUserIdentifier(userDoc.data().identifier);
        return;
      }
      let userData = {
        name: auth.currentUser.displayName,
        email: auth.currentUser.email,
        uid: auth.currentUser.uid,
        identifier: "@" + generateRandomCode(10),
      };
      await setDoc(userDocRef, userData);
      setUserIdentifier(userData.identifier);
      console.log("User created successfully");
    } catch (error) {
      console.error("Error creating user: ", error);
    }
  };
  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        createUser().then(() => {
          navigate("/ChatRoom");
        });
      })
      .catch((err) => {
        console.log(err);
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
  const navigate = useNavigate();
  const signInOutGoogle = () => {
    auth.signOut();
    navigate("/");
  };
  const openAccountInfo = () => {
    navigate("/AccountInfo");
  };
  return (
    <>
      <div className="container-signout">
        <button onClick={openAccountInfo}>
          <AiOutlineUser />
        </button>
        <button onClick={signInOutGoogle}>
          <PiSignInBold />
        </button>
      </div>
    </>
  );
}
function ChatRoom() {
  const messagesRef = collection(db, "messages");
  const queryRef = query(messagesRef, orderBy("createdAt", "desc"), limit(25));
  const [messages, loading] = useCollectionData(queryRef, { idField: "id" });
  const [chatHeight, setHeight] = useState("30vh");
  const [formValue, setFormValue] = useState("");
  const endOfChat = useRef();
  const btnSend = useRef();
  useEffect(() => {
    if (loading) {
    } else {
      setHeight("67vh");
    }
  }, [loading]);

  const sendMessage = async (e) => {
    const uid = auth.currentUser.uid;
    btnSend.current.children[0].style.opacity = "0";
    btnSend.current.children[1].style.opacity = "1";
    e.preventDefault();
    setFormValue("");
    await addDoc(messagesRef, {
      text: formValue,
      createdAt: serverTimestamp(),
      uid,
      user: auth.currentUser.displayName,
    });
    //hide send button
    btnSend.current.children[0].style.opacity = "1";
    btnSend.current.children[1].style.opacity = "0";
    btnSend.current.style.width = "0vh";
    btnSend.current.style.padding = "1vh 0vh";
    endOfChat.current.scrollIntoView({ behavior: "smooth", block: "end" });
  };
  const handleInputMsgChange = (e) => {
    setFormValue(e.target.value);
    //show send button
    if (e.target.value.length == 0) {
      btnSend.current.style.width = "0vh";
      btnSend.current.style.padding = "1vh 0vh";
      return;
    }
    btnSend.current.style.width = "5vh";
    btnSend.current.style.padding = "1vh 1vh";
  };

  return (
    <>
      <SignOut />
      <div className="div-messages">
        <div className="chat" style={{ "--start-height": `${chatHeight}` }}>
          {loading ? (
            <div className="loading-indicator">
              <AiOutlineLoading3Quarters />
            </div>
          ) : (
            <>
              <div className="loaded-indicator">
                <div ref={endOfChat}></div>
                {messages &&
                  messages.map((msg) => (
                    <ChatMessage key={uuid()} message={msg} />
                  ))}
              </div>
            </>
          )}
        </div>
      </div>
      <form onSubmit={sendMessage}>
        <input
          placeholder="Type here! :)"
          type="text"
          onChange={handleInputMsgChange}
          value={formValue}
        />
        <button ref={btnSend} type="submit">
          <BiSend />
          <AiOutlineLoading3Quarters />
        </button>
      </form>
    </>
  );
}
function ChatMessage({ message }) {
  const { text, uid, user } = message;
  const messageClass = uid === auth.currentUser.uid ? "sent" : "recieved";
  return (
    <div className={messageClass}>
      <h2>{user}</h2>
      <p>{text}</p>
    </div>
  );
}
function AccountInfo({ userIdentifier }) {
  useEffect(() => {
    console.log(auth);
  }, []);
  const idInput = useRef();
  const copyToClipboard = () => {
    navigator.clipboard.writeText(idInput.current.innerText);
  };
  return (
    <>
      <div className="container-account">
        {userIdentifier ? (
          <>
            <div className="container-account-header">
              <AiOutlineUser />
            </div>
            <div className="container-account-img">
              <img src={auth.currentUser.photoURL} />
            </div>
            <div className="container-account-info">
              <h4 ref={idInput}>
                {userIdentifier}
                <button onClick={copyToClipboard}>
                  <FiCopy />
                </button>
              </h4>
              <h2>{auth.currentUser.displayName}</h2>
              <h3>{auth.currentUser.email}</h3>
            </div>
          </>
        ) : (
          <>
            <div className="loading-indicator">
              <AiOutlineLoading3Quarters />
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default App;
