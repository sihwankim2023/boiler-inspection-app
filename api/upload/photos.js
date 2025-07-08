import { createClient } from '@supabase/supabase-js'
import { v4 as uuidv4 } from 'uuid'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}

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
    const { file, inspectionId } = req.body
    
    if (!file || !inspectionId) {
      return res.status(400).json({ error: 'File and inspection ID required' })
    }

    // Base64 디코딩
    const fileBuffer = Buffer.from(file.split(',')[1], 'base64')
    const fileName = `${inspectionId}/${uuidv4()}.jpg`

    // Supabase Storage에 업로드
    const { data, error } = await supabase.storage
      .from('inspection-photos')
      .upload(fileName, fileBuffer, {
        contentType: 'image/jpeg',
        upsert: false
      })

    if (error) {
      throw error
    }

    // 공개 URL 생성
    const { data: { publicUrl } } = supabase.storage
      .from('inspection-photos')
      .getPublicUrl(fileName)

    return res.status(200).json({ 
      success: true, 
      fileName: data.path,
      publicUrl 
    })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}