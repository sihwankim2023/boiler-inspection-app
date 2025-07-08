import nodemailer from 'nodemailer'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).json({ error: 'No authorization header' })
  }

  const token = authHeader.replace('Bearer ', '')
  const { data: { user }, error: authError } = await supabase.auth.getUser(token)
  
  if (authError || !user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const { inspectionId, recipientEmail, pdfBuffer, subject } = req.body

    // 이메일 전송 설정
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    // PDF를 첨부파일로 설정
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: recipientEmail,
      subject: subject || '보일러 점검 보고서',
      html: `
        <h2>보일러 점검 보고서</h2>
        <p>첨부된 PDF 파일을 확인해주세요.</p>
        <p>문의사항이 있으시면 연락 바랍니다.</p>
      `,
      attachments: [
        {
          filename: `점검보고서_${new Date().toISOString().split('T')[0]}.pdf`,
          content: Buffer.from(pdfBuffer, 'base64'),
          contentType: 'application/pdf'
        }
      ]
    }

    // 이메일 발송
    await transporter.sendMail(mailOptions)

    // 발송 기록 저장
    await supabase
      .from('email_records')
      .insert({
        inspection_id: inspectionId,
        recipient_email: recipientEmail,
        subject: subject || '보일러 점검 보고서'
      })

    return res.status(200).json({ success: true, message: '이메일이 성공적으로 발송되었습니다.' })
  } catch (err) {
    console.error('Email send error:', err)
    return res.status(500).json({ error: '이메일 발송 중 오류가 발생했습니다.' })
  }
}