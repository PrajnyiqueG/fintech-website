interface SpamCheckResult {
  isSpam: boolean
  score: number
  reasons: string[]
}

export function checkSpam(data: {
  name: string
  email: string
  message: string
  honeypot?: string
  submittedAt?: number
}): SpamCheckResult {
  const reasons: string[] = []
  let score = 0

  // Honeypot field filled = bot
  if (data.honeypot && data.honeypot.trim() !== '') {
    return { isSpam: true, score: 100, reasons: ['Honeypot triggered'] }
  }

  // Too fast submission (under 3 seconds)
  if (data.submittedAt && Date.now() - data.submittedAt < 3000) {
    score += 40
    reasons.push('Submitted too quickly')
  }

  // Suspicious keywords
  const spamKeywords = ['casino', 'viagra', 'lottery', 'winner', 'click here', 'free money', 'guaranteed']
  const messageLC = data.message.toLowerCase()
  for (const kw of spamKeywords) {
    if (messageLC.includes(kw)) {
      score += 20
      reasons.push(`Spam keyword: ${kw}`)
    }
  }

  // Too many URLs
  const urlCount = (data.message.match(/https?:\/\//g) || []).length
  if (urlCount > 2) {
    score += 20
    reasons.push('Too many URLs')
  }

  // Very short message
  if (data.message.trim().length < 10) {
    score += 15
    reasons.push('Message too short')
  }

  // All caps
  if (data.message === data.message.toUpperCase() && data.message.length > 20) {
    score += 10
    reasons.push('All caps message')
  }

  return { isSpam: score >= 50, score, reasons }
}
