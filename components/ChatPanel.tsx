import Image from "next/image";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import LoadingSkeleton from "./LoadingSkeleton";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Message } from "@/app/page";
import { useEffect, useRef } from "react";

export default function ChatPanel({
  title,
  logo,
  color,
  messages,
  newMessage,
  onNewMessageChange,
  onSendMessage,
  onLoadMore,
  hasMore,
  supporterCount,
  isLoading,
}: {
  title: string;
  logo: string;
  color: "one-side" | "second-side";
  messages: Message[];
  newMessage: string;
  onNewMessageChange: (value: string) => void;
  onSendMessage: () => void;
  onLoadMore: () => void;
  hasMore: boolean;
  supporterCount: number;
  isLoading: boolean;
}) {
  const themeColor = color === "one-side" ? "#5A67D8" : "#E63CB6";
  const lightThemeColour = color === "one-side" ? "#EEF0FF" : "#FFF0FA";
  const ScrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ScrollAreaRef.current) {
      const scrollContainer = ScrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);
  return (
    <div
      className="flex flex-col p-4 rounded-lg shadow-sm m-2 z-10 mb-10 max-h-[78vh] bg-background max-w-[500px]"
      style={{ borderColor: themeColor, borderWidth: "1px" }}
    >
      <div className="flex items-center justify-center mb-4 ">
        <div className="flex items-center gap-3">
          <Image
            src={logo}
            alt="logo"
            width={20}
            height={20}
            className="h-10 w-10 object-cover rounded-full"
          />
          <h2 className="text-xl font-semibold">{title} Supporting niggas</h2>
        </div>
        <div className=" ml-1 text-sm font-bold" style={{ color: themeColor }}>
          {supporterCount} {title} peep{supporterCount !== 1 ? "s" : ""}
        </div>
      </div>
      {hasMore && (
        <Button variant="outline" className="w-full mb-4 " onClick={onLoadMore}>
          Load More
        </Button>
      )}
      <ScrollArea className="flex-grow mb-4 max-h-[70vh] overflow-y-auto" ref={ScrollAreaRef}>
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          messages.map((message, index) => {
            const isBoy = index % 2 === 0;
            const gender = isBoy ? "boy" : "girl";
            return (
              <div className="flex items-center gap-3 mb-4">
                <Avatar>
                  <AvatarImage
                    src={`https://avatar.iran.liara.run/public/${gender}?username=${message._id}`}
                  />
                  <AvatarFallback>?</AvatarFallback>
                </Avatar>
                <div className="rounded-lg p-3 flex-1">
                  <p className="font-semibold text-sm">{message.sender}</p>
                  <p className="text-gray-700">{message.text}</p>
                </div>
              </div>
            );
          })
        )}
      </ScrollArea>
      <div className="z-10 flex items-center gap-2">
        <Input
          placeholder={`I support ${title} because...`}
          className="flex-1"
          value={newMessage}
          onChange={(e) => onNewMessageChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSendMessage()}
          style={{ borderColor: themeColor }}
        />
        <Button onClick={onSendMessage} style={{ backgroundColor: themeColor }}>
          Send
        </Button>
      </div>
    </div>
  );
}
