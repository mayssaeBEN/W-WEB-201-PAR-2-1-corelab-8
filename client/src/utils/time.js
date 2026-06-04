export function estimateReadTime(htmlContent) {
  const text = (htmlContent || '').replace(/<[^>]+>/g, ' ')
  const words = text.trim().split(/\s+/).filter(Boolean).length
  const minutes = Math.ceil(words / 200)
  return minutes < 1 ? 1 : minutes
}
