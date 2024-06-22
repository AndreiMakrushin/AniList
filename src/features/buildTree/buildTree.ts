import type { Item } from '@/stores/types'

export const buildTree = (comments: Item[]): Item[] => {
  const commentsMap: Record<number, Item & { children: Item[] }> = {}

  comments.forEach((comment) => {
    commentsMap[comment.randomId] = { ...comment, children: [] }
  })

  const rootComments: Item[] = []

  comments.forEach((comment) => {
    if (comment.parentId === null) {
      rootComments.push(commentsMap[comment.randomId])
    } else {
      const parentComment = commentsMap[comment.parentId]
      if (parentComment) {
        parentComment.children.push(commentsMap[comment.randomId])
      }
    }
  })

  return rootComments
}
