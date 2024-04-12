'use client' 
 
import { useEffect,useState } from 'react'
export default function Error({ error, reset,onClose }) {
  useEffect(() => {
    console.log(error)
  }, [error])



  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center',overflow:"scroll" }}>
      <div style={{  padding: '20px', borderRadius: '5px', textAlign: 'left',width:"100%" }}>
      <button style={{ position: 'fixed', top: '10px', right: '10px', cursor: 'pointer', border: 'none', background: 'transparent', fontSize: '18px',color:"white",fontWeight:"700" }} onClick={onClose}>X</button>
        <h1 style={{color:"red",fontWeight:"bolder"}}>Compiled With Problem :</h1>
        <pre>{error.stack}</pre> {/* Display full error stack */}
        <button style={{color:"blue"}} onClick={() => reset()}>Try again</button>
      </div>
    </div>
    )
}