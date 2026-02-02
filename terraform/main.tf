# Define where your Customer Media will live
resource "aws_s3_bucket" "media_storage" {
  bucket = "my-secure-django-media-2026"
}

# This is the "Security Guard" - It blocks public access
resource "aws_s3_bucket_public_access_block" "media_security" {
  bucket = aws_s3_bucket.media_storage.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}