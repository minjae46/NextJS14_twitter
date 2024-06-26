"use client";

import Link from "next/link";
import Button from "@/components/button";
import Input from "@/components/input";
import { useFormState } from "react-dom";
import { logIn } from "./actions";

export default function LogIn() {
  const [state, action] = useFormState(logIn, null);
  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">안녕하세요!</h1>
        <h2 className="text-xl">Log in with username, email and password.</h2>
      </div>
      <form action={action} className="flex flex-col gap-3">
        <Input
          name="username"
          type="text"
          placeholder="Username"
          required
          errors={state?.fieldErrors?.username}
        />
        <Input
          name="email"
          type="email"
          placeholder="Email"
          required
          errors={state?.fieldErrors?.email}
        />
        <Input
          name="password"
          type="password"
          placeholder="Password"
          required
          errors={state?.fieldErrors?.password}
        />
        <Button text="Log in" />
      </form>
      <div className="flex gap-2 justify-center w-full">
        <span>계정이 없으신가요?</span>
        <Link href="/create-account" className="hover:underline">
          계정 생성
        </Link>
      </div>
    </div>
  );
}
