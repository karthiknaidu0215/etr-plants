/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useWebsiteContent() {
  const [content, setContent] = useState<Record<string, any>>({
    logo_url: '/logo.png',
    website_name: 'ETR Plants',
    tagline: 'Premium Nursery & Farm Design',
    phone: '+91 99999 99999',
    email: 'contact@etrplants.com',
    address: 'Hyderabad, Telangana, India',
    hero_heading: 'Design Your Dream Farm',
    hero_subheading: 'Professional plantation planning, premium plants, and end-to-end farm design services.',
    about_text: 'ETR Plants is a premium nursery specializing in commercial and ornamental plantations.',
    copyright: '© 2026 ETR Plants. All rights reserved.'
  })

  useEffect(() => {
    const fetchContent = async () => {
      const supabase = createClient()
      const { data } = await supabase.from('website_content').select('key, value')
      if (data && data.length > 0) {
        const newContent: Record<string, any> = {}
        data.forEach(row => {
          newContent[row.key] = row.value
        })
        setContent(prev => ({ ...prev, ...newContent }))
      }
    }
    fetchContent()
  }, [])

  return content
}
