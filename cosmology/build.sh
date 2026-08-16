#!/bin/sh
# Rebuild the HTML pages from the markdown sources.
# Requires pandoc.  Run from this directory:  sh build.sh
set -e
for p in index syllabus topics assignments policies; do
  h1=$(head -1 "$p.md" | sed 's/^# //')
  if [ "$p" = "index" ]; then t="ASTRO/PHYS 545: Cosmology"; else t="$h1 — ASTRO/PHYS 545 Cosmology"; fi
  pandoc "$p.md" \
    -f markdown+tex_math_dollars+raw_html+pipe_tables \
    -t html5 --mathjax \
    --template=template.html \
    --metadata pagetitle="$t" \
    --metadata "$p"=true \
    -o "$p.html"
  echo "built $p.html"
done
