import os
import json
import sys
import argparse
import argostranslate.package
import argostranslate.translate

# ----------------------------------------------------------------------
# Configuration
# ----------------------------------------------------------------------
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "public", "locales"))
SOURCE_LANG = "en"
TARGET_LANGS = [
    ("en", "hi"),
    ("en", "ta"),
    ("en", "te"),
    ("en", "kn"),
    ("en", "ml"),
    ("en", "mr"),
    ("en", "pa"),
    ("en", "bn"),
    ("en", "as"),
]

# ----------------------------------------------------------------------
# Helper: ensure all required models are installed
# ----------------------------------------------------------------------
def install_models():
    print("🔍 Checking for required Argos Translate packages...")
    available = argostranslate.package.get_available_packages()
    for from_code, to_code in TARGET_LANGS:
        pkg = next((p for p in available if p.from_code == from_code and p.to_code == to_code), None)
        if pkg:
            # Check if already installed
            installed = any(
                (l.code == from_code and any(t.code == to_code for t in l.get_translations()))
                for l in argostranslate.translate.get_installed_languages()
            )
            if installed:
                print(f"✅ Model already installed: {from_code} → {to_code}")
                continue
            print(f"⬇ Installing model: {from_code} → {to_code}")
            try:
                download_path = pkg.download()
                argostranslate.package.install_from_path(download_path)
                print(f"✅ Installed {from_code} → {to_code}")
            except Exception as e:
                print(f"❌ Failed to install {from_code} → {to_code}: {e}")
        else:
            print(f"❌ No package found for {from_code} → {to_code}")

# ----------------------------------------------------------------------
# Helper: preload translation objects for each target language
# ----------------------------------------------------------------------
def preload_translators():
    translators = {}
    installed = argostranslate.translate.get_installed_languages()
    for from_code, to_code in TARGET_LANGS:
        from_lang = next((l for l in installed if l.code == from_code), None)
        to_lang = next((l for l in installed if l.code == to_code), None)
        if not from_lang or not to_lang:
            raise RuntimeError(f"Model not installed for {from_code} → {to_code}")
        translators[to_code] = from_lang.get_translation(to_lang)
    return translators

# ----------------------------------------------------------------------
# Main batch translation logic
# ----------------------------------------------------------------------
def batch_translate():
    # 1. Ensure models are present
    install_models()

    # 2. Load source JSON
    source_path = os.path.join(BASE_DIR, SOURCE_LANG, "complete.json")
    if not os.path.isfile(source_path):
        print(f"❌ Source file not found: {source_path}")
        sys.exit(1)

    with open(source_path, "r", encoding="utf-8") as f:
        source_strings = json.load(f)

    # 3. Preload translators
    translators = preload_translators()

    # 4. Translate for each target language
    for _, to_code in TARGET_LANGS:
        print(f"\n🔁 Translating to {to_code}...")
        translate_obj = translators[to_code]
        translated = {}
        for key, text in source_strings.items():
            try:
                translated[key] = translate_obj.translate(text)
            except Exception as e:
                print(f"⚠️ Error translating key '{key}': {e}")
                translated[key] = text  # fallback to original

        # 5. Write output JSON
        target_dir = os.path.join(BASE_DIR, to_code)
        os.makedirs(target_dir, exist_ok=True)
        out_path = os.path.join(target_dir, "complete.json")
        with open(out_path, "w", encoding="utf-8") as out_f:
            json.dump(translated, out_f, ensure_ascii=False, indent=2)
        print(f"✅ Saved: {out_path}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Batch translate UI strings using Argos Translate.")
    parser.add_argument(
        "--force-install",
        action="store_true",
        help="Force re-download and install of all language models.",
    )
    args = parser.parse_args()
    if args.force_install:
        # Remove any existing installed packages to force fresh install
        # (Argos Translate does not provide a direct uninstall, so we just reinstall)
        print("⚠️ Force reinstall requested. Proceeding to reinstall models.")
    batch_translate()
