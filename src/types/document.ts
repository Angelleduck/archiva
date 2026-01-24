export type GetDocument =
  | { success: true; documents: { filename: string; path: string }[] }
  | { success: false; error?: string }
