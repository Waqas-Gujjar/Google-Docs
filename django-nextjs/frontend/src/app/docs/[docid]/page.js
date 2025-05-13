"use client"


import { useAuth } from "@/components/authProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
import fetcher from "@/lib/fetcher";
// import Link from "next/link";
import { useParams } from "next/navigation";
import { useRef, useState } from 'react';
import dynamic from 'next/dynamic';


const DocEditor = dynamic( () => import( '@/components/editor/docEditer' ), { ssr: false } );

import useSWR from "swr";

export default function DocDetailPage() {
  const {docid} = useParams()
  const editorRef = useRef(null)
  const apiEndPoint = `/api/documents/${docid}`
  const submitBtnRef = useRef(null)
  const {isAuthenticated} = useAuth()
  const {data:doc , isLoading , error , mutate} = useSWR(apiEndPoint, fetcher)
  const [formError, setFormError] = useState("")

  if (isLoading){
    return <div className="text-center mt-52 font-extrabold text-red-600">Loading...</div>
  }
 

  if (error) {
    if (!isAuthenticated && error.status === 401) {
      window.location.href='/login'
    }
    if (!isAuthenticated && error.status === 401){
      return <div> inveted requezt</div>
    }
    if (error.status === 404){
      return <div> doc not found   </div>
    }
    return <div>{error.message} {error.status}</div>
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setFormError("")
    const formData = new FormData(event.target)
    const content = editorRef.current.editor.getData()
    const objectFromForm = Object.fromEntries(formData)
    objectFromForm ['content'] = content
    const jsonData = JSON.stringify(objectFromForm)
    const response = await fetch(apiEndPoint, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: jsonData,
    })
    let data = {}
    try {
      data = await response.json()
    } catch (error) {}

    if (response.ok) {
      mutate()
    } else {
      setFormError(data.message || "Save Faild  ")
    }
  }

  const onSaveHandle = (editor) => {

    console.log(editor)
    submitBtnRef.current.click()

  }

  const title = doc?.title ? doc.title : "Document"

  return <>
  <div className=" px-4 mt-3">
    <h1 className='text-4xl font-bold mb-4'>{title}</h1>
   <form onSubmit={handleSubmit} className="space-y-4">
   {formError && (
              <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
                {formError}
              </div>
        )}
      <Input type="text" className='font-semibold h-12 text-xl' defaultValue={doc.title} name='title' />
      <DocEditor docId={docid} onSave={onSaveHandle} className="prose" ref={editorRef} initialData={doc.content} name="content" placeholder='Write you content here!' />
      <Button ref={submitBtnRef} type='submit' >Save Doc</Button>
   </form>
    </div>
  </>
}