import React from 'react'
import './Message.css'


function Message({user,text,uri}) {

 
  
  return (
    
      <p className={user==="me"?'text_other':"text"}>
        <img  className='user_img' style={{
          color: "aliceblue", marginRight: "5px"}} src={uri} />
        {text}
      </p>

   
  )
}

export default Message
