import db from "@/lib/db";
import getSession from "@/lib/session";
import { notFound } from "next/navigation";
import Link from "next/link";

async function getIsOwner(userId: number) {
  const session = await getSession();
  if (session.id) {
    return session.id === userId;
  }
  return false;
}

async function getTweet(id: string) {
  const tweet = await db.tweet.findUnique({
    where: {
      id: +id,
    },
    include: {
      user: {
        select: {
          username: true,
          email: true,
        },
      },
    },
  });
  return tweet;
}

export default async function TweetDetail({
  params: { id },
}: {
  params: { id: string };
}) {
  const tweet = await getTweet(id);
  if (!tweet) {
    return notFound();
  }
  const isOwner = await getIsOwner(tweet.userId);
  return (
    <div className="flex flex-col">
      <Link href={"/"} className="hover:underline">
        Go Home
      </Link>
      <div className="p-5 flex items-center gap-3">
        <h3 className="text-blue-500 font-bold text-xl">
          {tweet.user.username}
        </h3>
        <span className="text-sm text-neutral-700">{tweet.user.email}</span>
      </div>
      <div className="p-5">
        <p className="text-2xl">{tweet.tweet}</p>
      </div>
      <span className="px-5 text-sm text-neutral-500">
        {tweet.created_at.toLocaleString("ko-KR", {
          timeZone: "Asia/Seoul",
        })}
      </span>
      {isOwner ? (
        <button className="bg-red-500 w-40 my-10 px-5 py-2.5 rounded-md text-white font-semibold">
          Delete Tweet
        </button>
      ) : null}
    </div>
  );
}
