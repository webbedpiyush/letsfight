import { Skeleton } from "./ui/skeleton";

export default function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-start space-x-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[100px]"/>
            <Skeleton className="h-4 w-full"/>
          </div>
        </div>
      ))}
    </div>
  );
}
