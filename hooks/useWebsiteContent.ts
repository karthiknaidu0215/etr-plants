/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

const YEAR = new Date().getFullYear()

export const CMS_DEFAULTS: Record<string, string> = {
  website_name: 'ETR Plants',
  logo_url: '',
  tagline: 'Premium Nursery & Farm Design',
  phone: '+91 99999 99999',
  whatsapp: '+91 99999 99999',
  email: 'contact@etrplants.com',
  address: 'Hyderabad, Telangana, India',
  facebook_url: '#',
  instagram_url: '#',
  youtube_url: '#',
  twitter_url: '#',
  hero_heading: 'Design Your Farm. Plan Your Plantation. Grow Smarter.',
  hero_subheading: 'Create a customized plantation plan for your land with the right plants, spacing, investment estimate and expected returns.',
  about_title: 'Your Partner in Smart Farm Planning',
  about_text: 'ETR Plants is a professional plantation planning and plant supply company serving farmers and landowners across Andhra Pradesh, Telangana, and Tamil Nadu. We combine agricultural expertise with technology to help you make the best decisions for your land.',
  about_subtext: 'Our interactive plantation planner takes the guesswork out of farming ? from choosing the right plants for your region to calculating your exact investment and expected income.',
  footer_tagline: 'Your trusted partner for plantation planning, farm design, and expert agricultural guidance across Andhra Pradesh, Telangana, and Tamil Nadu.',
  copyright: `? ${YEAR} ETR Plants. All rights reserved.`,
  disclaimer: 'Income and yield figures shown on this platform are estimates based on configured assumptions and may vary depending on climate, soil, maintenance, and market conditions.',
}

export function useWebsiteContent(): Record<string, any> {
  const [content, setContent] = useState<Record<string, any>>(CMS_DEFAULTS)

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('website_content')
      .select('key, value')
      .then(({ data }) => {
        if (data && data.length > 0) {
          const fetched: Record<string, any> = {}
          data.forEach((row) => { fetched[row.key] = row.value })
          setContent((prev) => ({ ...prev, ...fetched }))
        }
      })
  }, [])

  return content
}
