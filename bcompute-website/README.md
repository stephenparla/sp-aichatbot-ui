# bCompute website — deployment guide

Static responsive website built with HTML, CSS and JavaScript. No build process, framework, database or web server required.

## Before publishing
1. Edit `config.js` and replace `hello@YOUR-DOMAIN.com` with an inbox you control.
2. Review all wording in `index.html`. Capabilities are deliberately described as under development; don't add customer logos, testimonials, certifications, performance claims or production-readiness claims until verified.
3. Preview locally: run `python3 -m http.server 8000` in this folder and visit `http://localhost:8000`.

## AWS hosting recommendation: private S3 + CloudFront

This architecture serves the static site over HTTPS while keeping the S3 bucket private.

### 1. Create an S3 bucket
- Choose a globally unique bucket name, e.g. `www-example-com-bcompute`.
- Keep **Block all public access** enabled.
- Do not enable S3 static website hosting; use the S3 REST origin through CloudFront.
- Upload the contents of this folder to the bucket root.

AWS CLI alternative (run from this directory):

```bash
aws s3 sync . s3://YOUR_BUCKET_NAME --exclude '.git/*' --exclude 'README.md' --delete
```

### 2. Request an ACM certificate
- Open AWS Certificate Manager in **us-east-1 (N. Virginia)**.
- Request a public certificate for the exact hostname you will serve, e.g. `www.your-domain.com` (and the apex domain too only if you plan to serve it).
- Choose DNS validation, add the CNAME validation record at your DNS provider, and wait for status **Issued**.
- CloudFront requires its ACM certificate in us-east-1, regardless of the S3 bucket region.

### 3. Create the CloudFront distribution
- Origin: select the S3 bucket's regional REST endpoint.
- Create/attach Origin Access Control (OAC), signing behavior **Sign requests (recommended)** / always.
- Keep the bucket private. Allow CloudFront to update the bucket policy, or apply the policy CloudFront provides.
- Viewer protocol policy: **Redirect HTTP to HTTPS**.
- Allowed methods: **GET, HEAD**.
- Default root object: `index.html`.
- Add your hostname under Alternate domain names (CNAMEs).
- Select the ACM certificate issued in us-east-1.
- Enable compression and create the distribution. Wait until deployed.
- For initial content updates, a default TTL around 300 seconds is convenient; invalidate after uploads.

### 4. Point your domain to CloudFront
At the DNS provider that currently hosts your domain:
- For `www`, create a CNAME to the CloudFront distribution domain name.
- For the apex/root domain, use Route 53 Alias A/AAAA if DNS is in Route 53, or your DNS provider's ALIAS/ANAME/flattening feature if supported.
- If apex aliasing is not supported, use `www` as the canonical hostname and configure a redirect from the apex.
- Do not change nameservers unless you intend to move all DNS hosting to Route 53.

### 5. Verify
- `https://YOUR_HOSTNAME` loads and the certificate is valid.
- No `YOUR-DOMAIN` placeholder remains.
- Contact email is correct; contact form opens a prefilled email.
- Mobile navigation works.

## Updating after launch

```bash
aws s3 sync . s3://YOUR_BUCKET_NAME --exclude '.git/*' --exclude 'README.md' --delete
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths '/*'
```

## Contact form behavior
The current form uses `mailto:`. It opens the visitor's email client with their details prefilled; it does not send form data to a server. A later production enhancement can use API Gateway + Lambda + SES, with spam protection, rate limiting, and appropriate privacy disclosures.

## Before broader marketing
- Publish a privacy policy and collect only information you need.
- Decide whether to self-host fonts; Google Fonts are currently loaded remotely.
- Add social preview image metadata, if desired.
- Add analytics only after selecting a privacy-conscious approach and updating the privacy notice.
- Verify domain/name rights and any trademark considerations.

## Scope
No backend, database, analytics, tracking pixels, cookies, or server-side form handler are included. This is an early-stage product website, not a representation of an available production service.
