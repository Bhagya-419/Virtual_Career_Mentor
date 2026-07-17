import { useEffect, useState } from "react"
import API from "../services/api"

export default function ChatHistory() {

const [chats,setChats]=useState([])
const [search,setSearch]=useState("")

const fetchChats=async()=>{

try{

const token=localStorage.getItem("token")

const res=await API.get("/chat/history",{
headers:{
Authorization:`Bearer ${token}`
}
})

setChats(res.data)

}catch(error){

console.log(error)

}

}

useEffect(()=>{
fetchChats()
},[])

const deleteChat=async(id)=>{

try{

const token=localStorage.getItem("token")

await API.delete(`/chat/${id}`,{
headers:{
Authorization:`Bearer ${token}`
}
})

fetchChats()

}catch(error){

console.log(error)

}

}

const clearHistory=async()=>{

if(!window.confirm("Clear all chat history?")) return

try{

const token=localStorage.getItem("token")

await API.delete("/chat/clear",{
headers:{
Authorization:`Bearer ${token}`
}
})

setChats([])

}catch(error){

console.log(error)

}

}

const filteredChats=chats.filter(chat=>
chat.question.toLowerCase().includes(search.toLowerCase())||
chat.answer.toLowerCase().includes(search.toLowerCase())
)

return(

<div
style={{
maxWidth:"950px",
margin:"30px auto",
padding:"20px"
}}
>

<div
style={{
display:"flex",
justifyContent:"space-between",
alignItems:"center",
marginBottom:"20px"
}}
>

<h1>Chat History</h1>

<button
onClick={clearHistory}
style={{
background:"#f44336",
color:"white",
border:"none",
padding:"10px 16px",
borderRadius:"6px",
cursor:"pointer"
}}
>
Clear All
</button>

</div>

<input
type="text"
placeholder="🔍 Search history..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
style={{
width:"100%",
padding:"12px",
marginBottom:"25px",
borderRadius:"8px",
border:"1px solid #ccc"
}}
/>

{
filteredChats.length===0?

<p>No chat history found.</p>

:

filteredChats.map(chat=>(

<div
key={chat._id}
style={{
border:"1px solid #ddd",
borderRadius:"12px",
padding:"18px",
marginBottom:"20px",
background:"#fff",
boxShadow:"0 2px 8px rgba(0,0,0,0.08)"
}}
>

<p>
<strong>You:</strong> {chat.question}
</p>

<p>
<strong>AI:</strong> {chat.answer}
</p>

{
chat.resources&&chat.resources.length>0&&(

<div
style={{
marginTop:"15px"
}}
>

<h4 style={{marginBottom:"10px"}}>
📚 Resources
</h4>

{
chat.resources.map((resource,index)=>(

<div
key={index}
style={{
marginBottom:"12px"
}}
>

<a
href={resource.url}
target="_blank"
rel="noopener noreferrer"
style={{
fontWeight:"bold",
color:"#1976d2",
textDecoration:"none"
}}
>
{resource.title}
</a>

</div>

))
}

</div>

)
}

<small
style={{
color:"gray"
}}
>
{new Date(chat.createdAt).toLocaleString()}
</small>

<br/>

<button
onClick={()=>deleteChat(chat._id)}
style={{
marginTop:"12px",
background:"#e53935",
color:"white",
border:"none",
padding:"8px 14px",
borderRadius:"6px",
cursor:"pointer"
}}
>
Delete
</button>

</div>

))

}

</div>

)

}