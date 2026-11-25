# BubbleSort AI corporate landing page

Static responsive homepage for `bubblesortai.com`.

## Files
- `index.html` — homepage
- `styles.css` — responsive styling
- `script.js` — dynamic copyright year
- `assets/favicon.svg` — favicon

## Deploy using S3 + CloudFront
1. Keep the S3 bucket private with Block Public Access enabled.
2. Upload the contents of this folder to the bucket root.
3. Configure CloudFront with the S3 bucket as origin and Origin Access Control (OAC).
4. Set the CloudFront Default root object to `index.html`.
5. Add `bubblesortai.com` as an alternate domain name and attach an ACM certificate in `us-east-1` covering the apex domain.
6. In Route 53, create an Alias A record for the root/apex domain pointing to the CloudFront distribution. Add an Alias AAAA record if IPv6 is enabled.
7. Wait for CloudFront to deploy, then test `https://bubblesortai.com`.

## Before launch
- Confirm `hello@bubblesortai.com` is the correct monitored contact address; replace it in `index.html` if needed.
- Review the company description and product claims before publishing.
