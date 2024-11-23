'use client'

import { useState } from "react"
const WS_URL = 'ws://localhost:3000';

type ChatType = {
  type: string,
  message: string
}

function Page() {

  const [content, setContent] = useState<string>("")

  const [chat, setChat] = useState<ChatType[]>([
    {
        type: "AI",
        message: "Hello! How can I help you?"
    },
  ])

  const send = ()=>{
    const ws = new WebSocket(WS_URL);
    setChat((prev)=>[...prev, {type: "USER", message: content}])
    ws.onopen = ()=>{
        const message = {
            type: "chat",
            content: [...chat, {type: "USER", message: content}]
        }
        ws.send(JSON.stringify(message))
        setContent("");
    }

    ws.onmessage = (event)=>{
       if(event.data!=='\n\n'){
        setChat((prev)=>[...prev, {type: "AI", message: event.data}])
       }
    }
  }

  return (
    <div className="w-1/3 bg-slate-100  p-4 rounded-xl">
        <div className="w-full flex flex-col gap-4 ">
            <div className="font-semibold text-xl bg-gray-900 p-2 rounded-lg flex justify-center">NextstepAI</div>
            <div className="w-full flex flex-col gap-3 text-base">
                {
                    chat.map((data, index)=>(
                        <div key={index} className={`w-full flex flex-row ${data.type==="AI"?"justify-start":"justify-end"}`}>
                            <div className={`w-fit ${data.type==="AI"?"bg-gray-600":"bg-green-700"} p-1 rounded-lg px-3 `}>{data.message}</div>
                        </div>
                    ))
                }
            </div>
            <div className="flex w-full justify-between gap-5 text-base">
                <div className="w-full"><input type="text" value={content} className="bg-gray-600 py-1 px-3 rounded-lg w-full" placeholder="Message" onChange={(e)=>{
                    e.preventDefault();
                    setContent(e.target.value);
                }}/></div>
                <div><button className="bg-green-800 py-1 px-4 font-semibold rounded-lg" onClick={send}>Send</button></div>
            </div>
        </div>
    </div>
  )
}

export default Page