import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ivpfaitqeojbyulslqde.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2cGZhaXRxZW9qYnl1bHNscWRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTg0OTIxNTcsImV4cCI6MjAxNDA2ODE1N30.UEynD52D7x8N0k3B22XxLwrbAXzLeggcZu57F1Rv20U'

export const supabase = createClient(supabaseUrl, supabaseKey)