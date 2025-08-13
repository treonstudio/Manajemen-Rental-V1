import { createClient } from 'npm:@supabase/supabase-js@2'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

const BUCKET_NAME = 'make-8c47b332-vehicle-photos'

export async function initStorage() {
  const { data: buckets } = await supabase.storage.listBuckets()
  const bucketExists = buckets?.some(bucket => bucket.name === BUCKET_NAME)
  
  if (!bucketExists) {
    await supabase.storage.createBucket(BUCKET_NAME, { public: false })
    console.log(`Created storage bucket: ${BUCKET_NAME}`)
  }
}

export async function uploadPhoto(file: File, checkId: string) {
  const fileName = `${checkId}/${Date.now()}-${file.name}`
  
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(fileName, file)
  
  if (error) {
    return { data: null, error }
  }
  
  const { data: urlData } = await supabase.storage
    .from(BUCKET_NAME)
    .createSignedUrl(fileName, 60 * 60 * 24 * 365) // 1 year
  
  return { 
    data: { path: fileName, url: urlData?.signedUrl }, 
    error: null 
  }
}