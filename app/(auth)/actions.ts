"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { z } from "zod";
import { redirect } from "next/navigation";

export async function getNextTweets(cursorId: number) {
  const nextTweets = await db.tweet.findMany({
    select: {
      id: true,
      tweet: true,
      created_at: true,
      user: {
        select: {
          username: true,
        },
      },
    },
    cursor: { id: cursorId },
    skip: cursorId ? 1 : 0,
    take: 2,
    orderBy: {
      created_at: "desc",
    },
  });
  return nextTweets;
}

export async function getPrevTweets(cursorId: number, length: number) {
  const prevTweets = await db.tweet.findMany({
    select: {
      id: true,
      tweet: true,
      created_at: true,
      user: {
        select: {
          username: true,
        },
      },
    },
    cursor: { id: cursorId },
    skip: length === 1 ? 1 : 2,
    take: -2,
    orderBy: {
      created_at: "desc",
    },
  });
  return prevTweets;
}

const tweetSchema = z.object({
  tweet: z
    .string()
    .min(5, "Tweet should be at least 5 characters long.")
    .max(100, "The character limit has been exceeded."),
});

export async function addTweet(prevState: any, formData: FormData) {
  const data = {
    tweet: formData.get("tweet"),
  };
  const result = await tweetSchema.safeParse(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    const session = await getSession();
    if (session.id) {
      const tweet = await db.tweet.create({
        data: {
          tweet: result.data.tweet,
          user: {
            connect: {
              id: session.id,
            },
          },
        },
      });
      redirect(`tweets/${tweet.id}`);
    }
  }
}
