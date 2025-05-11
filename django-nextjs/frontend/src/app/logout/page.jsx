"use client"

import { useAuth } from "@/components/authProvider"

const LOGOUT_URL = "/api/logout/"

export default function Page() {
    const auth = useAuth()

    async function handleClick(event) {
        event.preventDefault()
        const requestOptions = {
            method: "POST", 
            headers: {
                "Content-Type": "application/json",
            },
            body: "",
        }
        const response = await fetch(LOGOUT_URL, requestOptions)
        if (response.ok) {
            auth.logout()
        }
    }

    return (
        <div className="flex items-center justify-center h-[95vh] bg-gray-50">
            <div className="bg-white p-8 rounded-2xl shadow-md text-center max-w-md w-full">
                <h1 className="text-2xl font-semibold mb-6 text-gray-800">
                    Are you sure you want to logout?
                </h1>
                <button
                    onClick={handleClick}
                    className="bg-red-500 hover:bg-red-600 text-white font-medium px-5 py-2 rounded-xl transition-colors duration-200"
                >
                    Yes, Logout
                </button>
            </div>
        </div>
    )
}
