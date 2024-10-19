"use client";

import BgGrid from "@/components/BgGrid";
import ChatPanel from "@/components/ChatPanel";
import RotatedText from "@/components/RotatedText";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useMutation, usePaginatedQuery, useQuery } from "convex/react";
import { Info, MessageSquare, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

export type Message = {
  _id: Id<"message">;
  _creationTime: number;
  text: string;
  sender: string;
  supportSide: "one-side" | "second-side";
  createdAt: number;
};

export default function Page() {
  // const router = useRouter();
  // const id = router.query;
  const [fightData, setFightData] = useState(null);
  const [clientIp, setClientIp] = useState("");
  const supporterCount = useQuery(api.messages.groupingNiggasCount);

  const [newMessageOneSide, setNewMessageOneSide] = useState("");
  const [newMessageSecondSide, setNewMessageSecondSide] = useState("");

  const [MessageOneSide, setMessageOneSide] = useState<Message[]>([]);
  const [MessageSecondSide, setMessageSecondSide] = useState<Message[]>([]);

  const {
    results: serverMessagesOneSide,
    status: statusOneSide,
    loadMore: loadMoreOneSide,
  } = usePaginatedQuery(
    api.messages.messages,
    { supportSide: "one-side" },
    { initialNumItems: 15 }
  );

  const {
    results: serverMessagesSecondSide,
    status: statusSecondSide,
    loadMore: loadMoreSecondSide,
  } = usePaginatedQuery(
    api.messages.messages,
    { supportSide: "second-side" },
    { initialNumItems: 15 }
  );

  useEffect(function () {
    async function fetchjson() {
      const res = await fetch("https://api.ipify.org?format=json");
      const data = await res.json();
      setClientIp(data.ip);
    }

    fetchjson();
  }, []);

  const sendMessage = useMutation(api.messages.send);

  const isLoadingOneSide = statusOneSide === "LoadingFirstPage";
  const isLoadingSecondSide = statusSecondSide === "LoadingFirstPage";

  async function handleSendMessage(supportSide: "one-side" | "second-side") {
    const messageText =
      supportSide === "one-side" ? newMessageOneSide : newMessageSecondSide;
    if (messageText.trim()) {
      const tempId = `temp-${Date.now()}`;
      const userMessage: Message = {
        _id: tempId as Id<"message">,
        _creationTime: Date.now(),
        text: messageText,
        sender: "Niggas",
        supportSide,
        createdAt: Date.now(),
      };

      // based on supportSide we will set the setter function
      const setUserMessage =
        supportSide === "one-side" ? setMessageOneSide : setMessageSecondSide;
      setUserMessage((prev) => [...prev, userMessage]);

      if (supportSide === "one-side") {
        setNewMessageOneSide("");
      } else {
        setNewMessageSecondSide("");
      }

      try {
        const serverMessageId = await sendMessage({
          text: messageText,
          sender: "Niggas",
          supportSide,
        });

        setUserMessage((prev) =>
          prev.map((message) =>
            message._id === tempId
              ? {
                  ...message,
                  _id: serverMessageId as Id<"message">,
                  _creationTime: Date.now(),
                }
              : message
          )
        );
      } catch (error) {
        setUserMessage((prev) =>
          prev.filter((message) => message._id !== tempId)
        );
        if (error instanceof Error) {
          toast({
            variant: "destructive",
            title: "we have Error",
            description: error.message,
          });
        } else {
          toast({
            variant: "destructive",
            title: "failed something",
            description: "Failed to send Messages. Please try again",
          });
        }
      }
    }
  }

  const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false);

  const allMessagesOneSide = useMemo(() => {
    const combined = [...(serverMessagesOneSide || []), ...MessageOneSide];

    return combined
      .filter(
        (message, index, self) =>
          index === self.findIndex((item) => item._id === message._id)
      )
      .sort((a, b) => a._creationTime - b._creationTime);
  }, [serverMessagesOneSide, MessageOneSide]);

  const allMessagesSecondSide = useMemo(() => {
    const combined = [
      ...(serverMessagesSecondSide || []),
      ...MessageSecondSide,
    ];

    return combined.filter(
      (message, index, self) =>
        index === self.findIndex((item) => item._id === message._id)
    );
  }, [serverMessagesSecondSide, MessageSecondSide]);

  return (
    <main className="relative flex flex-col items-center h-screen overflow-y-auto sm:overflow-hidden">
      <BgGrid />
      <div className=" z-10 p-4 text-center">
        <h1 className="font-bold">
          <span className="block font-extrabold uppercase my-2">
            Let&apos;s settle the debate
          </span>
          <span className="text-5xl">
            <RotatedText className="bg-gradient-to-br from-[#5A67D8] via-[#7A77D8] to-[#DD3CBE]" textsize={true}>
              one-side
            </RotatedText>
            {" vs "}
            <RotatedText
              className="bg-gradient-to-tl from-[#DD3CBE] via-[#AD52CB] to-[#5A67D8]"
              tilt="right"
            >
              Second-side
            </RotatedText>
          </span>
          <span className="block text-sm text-muted-foreground mt-2">
            built by{" "}
            <Link
              href="https://x.com/_webbedpiyush"
              target="_blank"
              rel="noopener noreferrer"
              className="mx-1 underline hover:text-gray-700 transition-colors duration-200"
            >
              <span>Piyush</span>
            </Link>
          </span>
        </h1>
        <div className="mt-4 absolute top-4 right-4 flex items-center space-x-2">
          <Dialog open={isInfoDialogOpen} onOpenChange={setIsInfoDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                onClick={() => setIsInfoDialogOpen(true)}
              >
                <Info className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Powered by :</DialogTitle>
              </DialogHeader>
              <div className="flex items-center justify-around gap-4 py-1">
                <Link href="/" className="text-center ">
                  <Image
                    src="/landscape-placeholder.svg"
                    alt="me"
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                  <p className="mt-2 font-bold">Me</p>
                </Link>
                <Link href="/" className="text-center">
                  <Image
                    src="/landscape-placeholder.svg"
                    alt="me"
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                  <p className="mt-2 font-bold">Myself</p>
                </Link>
                <Link href="/" className="text-center">
                  <Image
                    src="/landscape-placeholder.svg"
                    alt="me"
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                  <p className="mt-2 font-bold">I</p>
                </Link>
              </div>
              <div className="flex flex-col items-center space-x-2">
                <MessageSquare className="size-6 text-gray-500" />
                <p>You have 5 messages per day , use it </p>
                <RotatedText className="bg-sky-500" tilt="right">
                  carefully nigga
                </RotatedText>
              </div>
            </DialogContent>
          </Dialog>
          <ThemeSwitcher />
          <Link
            href="https://github.com/webbedpiyush/letsfight"
            target="_blank"
            className={
              (cn(
                "bg-gray-900 hover:bg-gray-800 transition-colors duration-200"
              ),
              buttonVariants({ size: "sm" }))
            }
          >
            <Star />
            Star on GitHub
          </Link>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row">
        <ChatPanel
          title="one-side"
          logo="/landscape-placeholder.svg"
          color="one-side"
          messages={allMessagesOneSide}
          newMessage={newMessageOneSide}
          onNewMessageChange={setNewMessageOneSide}
          onSendMessage={() => handleSendMessage("one-side")}
          onLoadMore={() => loadMoreOneSide(15)}
          hasMore={statusOneSide === "CanLoadMore"}
          supporterCount={supporterCount?.oneside || 0}
          isLoading={isLoadingOneSide}
        />
        <div className="w-px bg-gray-200 mx-2" />
        <ChatPanel
          title="second-side"
          logo="/landscape-placeholder.svg"
          color="second-side"
          messages={allMessagesSecondSide}
          newMessage={newMessageSecondSide}
          onNewMessageChange={setNewMessageSecondSide}
          onSendMessage={() => handleSendMessage("second-side")}
          onLoadMore={() => loadMoreSecondSide(15)}
          hasMore={statusSecondSide === "CanLoadMore"}
          supporterCount={supporterCount?.secondside || 0}
          isLoading={isLoadingSecondSide}
        />
      </div>
    </main>
  );
}
