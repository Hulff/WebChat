import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./styles/missingSignIn.css"
const noSignIn = ({}) => {
    const navigate = useNavigate()
    const goSignIn = () => {
        navigate("/")
    }
    return ( <>
    <h1>You need to be signed in</h1>
    <button className='btn-link' onClick={goSignIn}>Click here to go sign in</button>
    </> );
}
 
export default noSignIn;