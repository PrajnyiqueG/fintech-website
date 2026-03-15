
export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export function validatePassword(password: string): { valid: boolean; message?: string } {
  if (password.length < 8) return { valid: false, message: 'Password must be at least 8 characters' }
  if (!/[A-Z]/.test(password)) return { valid: false, message: 'Password must contain an uppercase letter' }
  if (!/[0-9]/.test(password)) return { valid: false, message: 'Password must contain a number' }
  return { valid: true }
}

export function sanitizeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

export function validateContactForm(data: {
  name: string
  email: string
  message: string
  honeypot?: string
}): { valid: boolean; message?: string } {
  // Honeypot check
  if (data.honeypot) return { valid: false, message: 'Spam detected' }

  if (!data.name || data.name.trim().length < 2) 
    return { valid: false, message: 'Name must be at least 2 characters' }
  if (!validateEmail(data.email))
    return { valid: false, message: 'Invalid email address' }
  if (!data.message || data.message.trim().length < 10)
    return { valid: false, message: 'Message must be at least 10 characters' }
  if (data.message.length > 5000)
    return { valid: false, message: 'Message too long (max 5000 characters)' }

  return { valid: true }
}
