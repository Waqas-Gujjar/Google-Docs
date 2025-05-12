"use client"


import { useAuth } from "@/components/authProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import fetcher from "@/lib/fetcher";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from 'react';


import useSWR from "swr";

export default function DocDetailPage() {
  
  const apiEndPoint = `/api/documents/`
//   const {isAuthenticated} = useAuth()
  const [formError, setFormError] = useState("")
  

  async function handleSubmit(event) {
    event.preventDefault()
    setFormError("")
    const formData = new FormData(event.target)
    const objectFromForm = Object.fromEntries(formData)
    const jsonData = JSON.stringify(objectFromForm)
    const response = await fetch(apiEndPoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: jsonData,
    })
    let data = {}
    try {
      data = await response.json()
    } catch (error) {}

    if (response.ok) {
      window.location.href=`/docs/${data.id}`
    } else {
      setFormError(data.message || "Save Faild  ")
    }
  }

  const title = "Create New  Document"

  return <>
  <div className=" px-4 mt-3">
    <h1 className='text-4xl font-bold mb-4'>{title}</h1>
   <form onSubmit={handleSubmit} className="space-y-4">
   {formError && (
              <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
                {formError}
              </div>
        )}
      <Input type="text" className='font-semibold h-12 text-xl' placeholder="Create New Doc"  name='title' />
      <Button type='submit' >Create</Button>
   </form>
    </div>
  </>
}