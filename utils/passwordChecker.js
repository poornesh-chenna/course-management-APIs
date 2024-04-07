export const isStrongPassword = (password) => {
  const minLength = 8
  const requiresUppercase = true
  const requiresLowercase = true
  const requiresDigit = true
  const requiresSpecialChar = true

  const hasMinLength = password.length >= minLength
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasDigit = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  return (
    hasMinLength &&
    (requiresUppercase ? hasUppercase : true) &&
    (requiresLowercase ? hasLowercase : true) &&
    (requiresDigit ? hasDigit : true) &&
    (requiresSpecialChar ? hasSpecialChar : true)
  )
}
