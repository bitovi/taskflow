"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { ThumbsUp, ThumbsDown } from "lucide-react"
import { toggleReaction } from "@/app/(dashboard)/tasks/actions"
import type { TaskReaction } from "@/app/generated/prisma/client"

interface TaskReactionsProps {
  taskId: number
  reactions: TaskReaction[]
  currentUserId?: number
}

export function TaskReactions({ taskId, reactions, currentUserId }: TaskReactionsProps) {
  const [isPending, startTransition] = useTransition()
  const [optimisticReactions, setOptimisticReactions] = useState(reactions)

  // Calculate counts
  const likes = optimisticReactions.filter(r => r.type === "like").length
  const dislikes = optimisticReactions.filter(r => r.type === "dislike").length

  // Check current user's reaction
  const userReaction = currentUserId 
    ? optimisticReactions.find(r => r.userId === currentUserId)
    : null

  const handleReaction = async (type: "like" | "dislike") => {
    startTransition(async () => {
      // Optimistic update
      if (userReaction) {
        if (userReaction.type === type) {
          // Remove reaction
          setOptimisticReactions(prev => prev.filter(r => r.userId !== currentUserId))
        } else {
          // Change reaction
          setOptimisticReactions(prev => 
            prev.map(r => r.userId === currentUserId ? { ...r, type } : r)
          )
        }
      } else if (currentUserId) {
        // Add new reaction
        setOptimisticReactions(prev => [
          ...prev,
          { id: Date.now(), taskId, userId: currentUserId, type, createdAt: new Date() }
        ])
      }

      // Server update
      const result = await toggleReaction(taskId, type)
      if (result.error) {
        // Revert optimistic update on error
        setOptimisticReactions(reactions)
      }
    })
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={userReaction?.type === "like" ? "default" : "outline"}
        size="sm"
        onClick={() => handleReaction("like")}
        disabled={isPending}
        className="gap-1.5"
      >
        <ThumbsUp className="h-4 w-4" />
        <span className="text-xs">{likes}</span>
      </Button>
      <Button
        variant={userReaction?.type === "dislike" ? "default" : "outline"}
        size="sm"
        onClick={() => handleReaction("dislike")}
        disabled={isPending}
        className="gap-1.5"
      >
        <ThumbsDown className="h-4 w-4" />
        <span className="text-xs">{dislikes}</span>
      </Button>
    </div>
  )
}
