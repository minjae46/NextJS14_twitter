"use client";

import { addTweet } from "@/app/(auth)/actions";
import { useFormState } from "react-dom";
import Button from "./button";

export default function AddTweet() {
  const [state, action] = useFormState(addTweet, null);
  const errors = state?.fieldErrors.tweet;
  return (
    <div className="py-10 flex flex-col">
      <form action={action}>
        <textarea
          name="tweet"
          placeholder="What is happening?"
          maxLength={110}
          required
          className="p-1 placeholder:text-neutral-400 bg-transparent rounded-md w-full h-20 focus:outline-none ring-2 focus:ring-4 transition ring-neutral-200 focus:ring-blue-500 border-none resize-none"
        ></textarea>
        {errors?.map((error, index) => (
          <span key={index} className="text-red-500 font-medium">
            {error}
          </span>
        ))}
        <Button text="Post Tweet" />
      </form>
    </div>
  );
}
