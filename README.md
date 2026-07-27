# Donghui Jeong — Academic Homepage

A dependency-free static site for GitHub Pages, migrated from the former Penn State WordPress site.

## Preview locally

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Refresh migrated content

The snapshot imported from WordPress lives in `content/wordpress-pages.json`. After replacing that file with a newer WordPress REST API export, rebuild the HTML pages with:

```bash
node scripts/build.mjs
```

## Publish with GitHub Pages

1. Create a public GitHub repository.
2. Push this directory to its `main` branch.
3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment**, select **Deploy from a branch**, choose `main` and `/ (root)`, then save.

For a personal site at `https://USERNAME.github.io`, name the repository `USERNAME.github.io`.
