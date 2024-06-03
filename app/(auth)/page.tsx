import db from "@/lib/db";
import getSession from "@/lib/session";
import { notFound, redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import AddTweet from "@/components/add-tweet";
import TweetList from "@/components/tweet-list";

async function getUser() {
  const session = await getSession();
  if (session.id) {
    const user = await db.user.findUnique({
      where: {
        id: session.id,
      },
    });
    if (user) {
      return user;
    }
  }
  notFound;
}

async function getInitialTweets() {
  const tweets = await db.tweet.findMany({
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
    take: 2,
    orderBy: {
      created_at: "desc",
    },
  });
  return tweets;
}
export type InitialTweets = Prisma.PromiseReturnType<typeof getInitialTweets>;

export default async function Home() {
  const user = await getUser();

  const logOut = async () => {
    "use server";
    const session = await getSession();
    await session.destroy();
    redirect("/log-in");
  };

  const initialTweets = await getInitialTweets();

  return (
    <div className="flex flex-col min-h-screen p-6">
      <header className="flex flex-col py-10 *:font-medium">
        <h1 className="text-4xl">Welcome, {user?.username} !</h1>
        <form action={logOut}>
          <button className=" text-blue-500 underline-offset-4 hover:underline">
            로그아웃
          </button>
        </form>
      </header>

      <AddTweet />

      <TweetList initialTweets={initialTweets} />
    </div>
  );
}
