-- Storage RLS policies for event-images bucket
-- Allow public (anon + authenticated) to INSERT and SELECT in event-images bucket

-- INSERT policy: enable client-side uploads to the "event-images" bucket
CREATE POLICY "Insert event-images (public)"
ON storage.objects
FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'event-images');

-- SELECT policy: ensure reads work in code paths that query via the client
CREATE POLICY "Read event-images (public)"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (bucket_id = 'event-images');