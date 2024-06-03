"use client";

import Link from "next/link";
import { InitialTweets } from "@/app/(auth)/page";
import { useState } from "react";
import { getNextTweets } from "@/app/(auth)/actions";
import { getPrevTweets } from "@/app/(auth)/actions";

interface TweetListProps {
  initialTweets: InitialTweets;
}

export default function TweetList({ initialTweets }: TweetListProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [tweets, setTweets] = useState(initialTweets);
  const [page, setPage] = useState(1);
  const [cursorId, setCursorId] = useState(
    initialTweets[initialTweets.length - 1].id
  );
  const [isLastPage, setIsLastPage] = useState(false);

  const onLoadNextClick = async () => {
    setIsLoading(true);
    const nextTweets = await getNextTweets(cursorId);
    const newCursorId = nextTweets[nextTweets.length - 1]?.id;
    if (nextTweets.length === 0) {
      setIsLastPage(true);
    }
    if (nextTweets.length === 1) {
      setTweets([...nextTweets]);
      setPage((prev) => prev + 1);
      setCursorId(newCursorId);
      setIsLastPage(true);
    }
    if (nextTweets.length === 2) {
      setTweets([...nextTweets]);
      setPage((prev) => prev + 1);
      setCursorId(newCursorId);
    }
    setIsLoading(false);
  };

  const onLoadPrevClick = async () => {
    setIsLoading(true);
    const prevTweets = await getPrevTweets(cursorId, tweets.length);
    const newCursorId = prevTweets[prevTweets.length - 1].id;
    setTweets([...prevTweets]);
    setPage((prev) => prev - 1);
    setCursorId(newCursorId);
    setIsLastPage(false);
    setIsLoading(false);
  };

  return (
    <div className="py-10 flex flex-col gap-5">
      {tweets.map((tweet) => (
        <Link
          key={tweet.id}
          href={`/tweets/${tweet.id}`}
          className="flex gap-5"
        >
          <div className="flex flex-col gap-1">
            <span className="text-md font-semibold">{tweet.user.username}</span>
            <span className="text-lg text-black">{tweet.tweet}</span>
            <span className="text-sm text-neutral-500">
              {tweet.created_at.toLocaleString("ko-KR", {
                timeZone: "Asia/Seoul",
              })}
            </span>
          </div>
        </Link>
      ))}
      <div className="flex justify-between">
        {page === 1 ? (
          <button
            disabled={true}
            className="text-sm bg-gray-500 w-fit mx-0 px-3 py-2 rounded-md "
          >
            First page
          </button>
        ) : (
          <button
            onClick={onLoadPrevClick}
            disabled={isLoading}
            className="text-sm bg-blue-500 w-fit mx-0 px-3 py-2 rounded-md hover:opacity-90 active:scale-95"
          >
            {isLoading ? "로딩 중" : "Load prev"}
          </button>
        )}
        {isLastPage ? (
          <button
            disabled={true}
            className="text-sm bg-gray-500 w-fit mx-0 px-3 py-2 rounded-md "
          >
            Last page
          </button>
        ) : (
          <button
            onClick={onLoadNextClick}
            disabled={isLoading}
            className="text-sm bg-blue-500 w-fit mx-0 px-3 py-2 rounded-md hover:opacity-90 active:scale-95"
          >
            {isLoading ? "로딩 중" : "Load next"}
          </button>
        )}
      </div>
    </div>
  );
}
