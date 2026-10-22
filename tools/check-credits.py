#!/usr/bin/env python3
"""Vérifie les crédits images du site LEF-T.

Liste :
  - les images affichées par le site (data/projects.json : couvertures et
    galeries, y compris projets en brouillon) qui n'ont pas d'auteur dans
    data/credits.json ;
  - les entrées de credits.json qui pointent vers un fichier inexistant.

Usage (depuis la racine du site) : python tools/check-credits.py
Code de sortie 0 si tout est crédité, 1 sinon.
"""
import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def load(path):
    with open(os.path.join(ROOT, path), encoding="utf-8") as f:
        return json.load(f)


def main():
    credits = load("data/credits.json").get("images", {})
    projects = load("data/projects.json").get("projects", [])

    missing = []
    for p in projects:
        for img in [p.get("image")] + list(p.get("gallery") or []):
            if not img:
                continue
            entry = credits.get(img) or {}
            if not entry.get("author"):
                tag = " (brouillon)" if p.get("draft") else ""
                missing.append(f"{p['id']}{tag} : {img}")

    dangling = [k for k in credits if not os.path.isfile(os.path.join(ROOT, k))]

    if missing:
        print(f"{len(missing)} image(s) sans crédit :")
        for m in missing:
            print("  - " + m)
    if dangling:
        print(f"{len(dangling)} entrée(s) de credits.json sans fichier :")
        for d in dangling:
            print("  - " + d)
    if not missing and not dangling:
        print("OK : toutes les images des projets sont créditées.")
        return 0
    return 1


if __name__ == "__main__":
    sys.exit(main())
