"use client";

import { useState } from "react";
import { LoginSchema } from "@/app/schema";
import { LoginSchemaType } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import submitLoginForm from "@/actions/login-form";
import { toast } from "sonner";
import { redirect } from "next/navigation";
import { Mail, KeyRound, Eye, EyeOff, X } from "lucide-react";
import { useAuth } from "@/app/_context/AuthContext";

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const { register, handleSubmit } = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
  });

  const handleSubmitForm = async (data: LoginSchemaType) => {
    const response = await submitLoginForm(data);
    if (response.success) {
      localStorage.setItem("token", response.token as string);
      login(response.token as string);
      redirect("/");
    } else {
      toast.error(
        response.message ? response.message : response.errors?.[0].message,
        {
          icon: <X className="text-white" />,
          className: "bg-red-500 border border-red-200 text-white text-base",
        }
      );
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <div className="w-[600px] mx-auto">
        <form
          method="POST"
          id="loginform"
          className="w-[600px]"
          onSubmit={handleSubmit(handleSubmitForm)}
        >
          <div className="relative text-center w-[600px]">
            <span className="font-semibold font-Montserrat text-gray-600 flex items-center font-futuraPTMedium">
              <Mail className="mr-4" />
              Adresse Mail :
            </span>
            <input
              {...register("email")}
              className="w-[600px] my-4 py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-sm"
              placeholder="Adresse Mail"
            />
          </div>
          <div className="relative text-center w-[600px]">
            <span className="font-semibold font-Montserrat text-gray-600 flex items-center font-futuraPTMedium">
              <KeyRound className="mr-4" />
              Mot de passe :
            </span>
            <input
              type={showPassword ? "text" : "password"}
              {...register("password")}
              className="w-[600px] my-4 py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-sm"
              placeholder="Mot de passe"
            />
            <span
              onClick={togglePasswordVisibility}
              className="cursor-pointer absolute top-14 right-5"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </span>
          </div>

          <div className="flex justify-center items-center">
            <button
              type="submit"
              className="bg-slate-300 hover:bg-slate-400 py-4 px-8 rounded-full duration-200"
            >
              Se connecter
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default LoginForm;
