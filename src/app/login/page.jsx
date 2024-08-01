"use client"
import { signIn } from "next-auth/react";
import { useFormState } from "react-dom";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect } from "react";

const initialState = {
    message: null,
  };

export default function LoginPage(){
    const {status} = useSession()
    useEffect(() => {
        if(status == "authenticated"){
            redirect("/dashboard/map")
        }
    }, [status])
    const login = async (prevState, formData) => {
        
        try {
            const status = await signIn("credentialsAuth", {
                redirect: false,
                username: formData.get("username"),
                password: formData.get("password"),
                // callbackUrl: "/login"
            });
            if(status?.error){
                console.log(status?.error)
                return { message: status?.error };
            }
            console.log("success")
            return { message: "Success" };
        } catch (e) {
            console.log(e)
            return { messasge: "Login failed" };
        }
    }
    const [state, loginAction] = useFormState(login, initialState);
    return(
        <div className="w-full flex justify-center items-center bg-[#00840D] min-h-[100vh]">
            <div
                className="p-5 rounded-lg bg-[#4AFF92] min-w-[400px]"
            >
                <p className="text-xl text-center font-bold">Login Admin</p>
                <form className="w-full flex flex-col items-center" action={loginAction}>
                <div
                    className="flex flex-col w-full mt-5 gap-3"
                >
                    <div
                        className="flex flex-col w-full gap-2"
                    >
                        <p>Username</p>
                        <input className="w-full rounded-md shadow-xl p-1" placeholder="Masukkan username" name="username" type="text" />
                    </div>
                    <div
                        className="flex flex-col w-full gap-2"
                    >
                        <p>Password</p>
                        <input className="w-full rounded-md shadow-xl p-1" placeholder="Masukkan password" name="password" type="password" />
                    </div>
                </div>
                <button type="submit" className="bg-[#00840D] mt-5 min-w-[200px] py-1 text-white font-bold rounded-md">
                    Login
                </button>
                </form>
            </div>
        </div>
    )
}