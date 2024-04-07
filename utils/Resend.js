import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendEmail = async (to, subject, body) => {
  try {
    const data = {
      from: '209x1a0541@gprec.ac.in',
      to,
      subject,
      html: body,
    }
    console.log('Sending email:', data)

    const response = await resend.emails.send(data)
    console.log(`Email sent successfully: ${response}`)
  } catch (error) {
    console.error('Failed to send email:', error)
  }
}
