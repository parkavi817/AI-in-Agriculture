import sys
import json
import argostranslate.package
import argostranslate.translate

def ensure_model(to_lang):
    from_lang = "en"
    # Check if model already installed
    installed = argostranslate.translate.get_installed_languages()
    from_inst = next((l for l in installed if l.code == from_lang), None)
    to_inst = next((l for l in installed if l.code == to_lang), None)
    if from_inst and to_inst:
        return from_inst.get_translation(to_inst)

    # Install missing model
    available = argostranslate.package.get_available_packages()
    pkg = next((p for p in available if p.from_code == from_lang and p.to_code == to_lang), None)
    if not pkg:
        raise RuntimeError(f"No Argos model for {from_lang}->{to_lang}")
    download_path = pkg.download()
    argostranslate.package.install_from_path(download_path)

    # Reload languages after install
    refreshed = argostranslate.translate.get_installed_languages()
    from_ref = next(l for l in refreshed if l.code == from_lang)
    to_ref = next(l for l in refreshed if l.code == to_lang)
    return from_ref.get_translation(to_ref)

def main():
    # Expect JSON on stdin: {"targetLang":"hi","strings":{"key":"text",...}}
    data = json.load(sys.stdin)
    target = data.get("targetLang")
    strings = data.get("strings", {})

    if not target or not isinstance(strings, dict):
        print(json.dumps({"error": "Invalid input"}))
        sys.exit(1)

    translator = ensure_model(target)
    translated = {}
    for k, txt in strings.items():
        try:
            translated[k] = translator.translate(txt)
        except Exception as e:
            translated[k] = txt  # fallback
    print(json.dumps({"translated": translated}))

if __name__ == "__main__":
    main()
