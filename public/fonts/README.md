# Self-hosted fonts

Drop the following woff2 files here. Until they are present, the UI falls back
to `local()` installed copies, then to the system sans stack — fully legible.

| File | Source |
|------|--------|
| `geist-400.woff2` `geist-500.woff2` `geist-600.woff2` `geist-700.woff2` | https://github.com/vercel/geist-font (Geist Sans) |
| `geist-mono-400.woff2` `geist-mono-500.woff2` | https://github.com/vercel/geist-font (Geist Mono) |
| `noto-sans-tamil-400.woff2` `noto-sans-tamil-500.woff2` `noto-sans-tamil-600.woff2` `noto-sans-tamil-700.woff2` | https://fonts.google.com/noto/specimen/Noto+Sans+Tamil |

The `@font-face` declarations live in `src/styles/fonts.css`.
Government intranet deployment: self-hosting avoids any external font CDN call.
