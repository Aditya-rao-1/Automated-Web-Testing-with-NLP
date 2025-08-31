import os
import json
import base64
import subprocess
from io import BytesIO
from datetime import datetime
from typing import Any, Dict, List, Optional, Tuple

from flask import Flask, request, jsonify
from flask_cors import CORS

# --- Third-party runtimes used by actions ---
# pip install playwright pillow
from playwright.sync_api import sync_playwright
from PIL import Image

# ----------------------------
# Config (env-overridable)
# ----------------------------
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "tinyllama")
HEADLESS = os.getenv("HEADLESS", "false").lower() in ("1", "true", "yes")
TARGET_URL = os.getenv("TARGET_URL", "https://automationdemo.vercel.app/")
HISTORY_LIMIT = int(os.getenv("HISTORY_LIMIT", "50"))

# ----------------------------
# App + CORS
# ----------------------------
app = Flask(__name__)
CORS(app)

# ----------------------------
# In-memory history
# ----------------------------
HISTORY: List[Dict[str, Any]] = []

def add_history(entry: Dict[str, Any]) -> None:
    global HISTORY
    HISTORY.append(entry)
    if len(HISTORY) > HISTORY_LIMIT:
        HISTORY = HISTORY[-HISTORY_LIMIT:]

# ----------------------------
# Model caller (merged client.py)
# ----------------------------
def call_ollama_model(user_prompt: str) -> str:
    system_prompt = f"""
You are a task instruction generator for car rental automation testing.

Your job is to convert the user's natural language prompt into a strict JSON instruction based on the intent.

Use only one of the following formats:

1. For searching cars:
{{
  "action": "search_car",
  "query": "BMW"
}}

2. For filling booking form:
{{
  "action": "fill_booking_form",
  "form_data": {{
    "name": "Keerthana",
    "email": "keer@example.com",
    "start_date": "2025-08-01",
    "end_date": "2025-08-07",
    "car_type": "VAN",
    "cdw": true,
    "terms": true
  }}
}}

3. For submitting booking:
{{ "action": "submit_booking" }}

4. For resetting form:
{{ "action": "reset_form" }}

5. For navigating to a section:
{{ "action": "navigate_to_section", "section": "#cars" }}

6. For testing contact links:
{{ "action": "test_contact_links" }}

7. For checking pricing:
{{ "action": "check_pricing", "car_type": "Luxury" }}

8. For validating empty form:
{{ "action": "validate_empty_form" }}

9. For checking car details:
{{ "action": "check_car_details", "car_type": "SUV" }}

Now read the user's instruction below and reply **only** with a valid JSON object matching one of the above formats. Do not add any explanation or comments.

If dates or car type are not mentioned, you can use default values.

User Instruction: {user_prompt}
"""
    # Use ollama CLI (local) as in your original client.py
    result = subprocess.run(
        ["ollama", "run", OLLAMA_MODEL, system_prompt],
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="ignore",
    )
    return (result.stdout or "").strip()

# ----------------------------
# Parser (merged parse.py)
# ----------------------------
def extract_all_json_objects(text: str) -> List[Dict[str, Any]]:
    json_objects: List[Dict[str, Any]] = []
    i = 0
    while i < len(text):
        if text[i] == "{":
            brace_count = 0
            start = i
            while i < len(text):
                if text[i] == "{":
                    brace_count += 1
                elif text[i] == "}":
                    brace_count -= 1
                    if brace_count == 0:
                        json_str = text[start : i + 1]
                        try:
                            parsed = json.loads(json_str)
                            if isinstance(parsed, dict):
                                json_objects.append(parsed)
                        except json.JSONDecodeError:
                            pass
                        break
                i += 1
        else:
            i += 1
    return json_objects

def select_best_json(response_text: str, json_objects: List[Dict[str, Any]]) -> Dict[str, Any]:
    response_lower = response_text.lower()
    scored_objects: List[Tuple[int, Dict[str, Any]]] = []
    for json_obj in json_objects:
        score = 0
        action = json_obj.get("action", "")
        json_str = json.dumps(json_obj)
        json_position = response_text.find(json_str)
        if json_position > -1:
            preceding_text = response_text[:json_position].lower()
            if action == "fill_booking_form":
                if any(p in preceding_text for p in ["filling booking", "booking form", "for filling"]):
                    score += 10
                if json_position > len(response_text) * 0.5:
                    score += 5
            elif action == "search_car":
                if any(p in preceding_text for p in ["searching cars", "search car", "for searching"]):
                    score += 10
                if json_position > len(response_text) * 0.5:
                    score += 5
            if any(p in preceding_text for p in ["example", "format", "use only"]):
                score -= 5
        scored_objects.append((score, json_obj))
    scored_objects.sort(key=lambda x: x[0], reverse=True)
    return scored_objects[0][1] if scored_objects else json_objects[0]

def parse_response(response: str) -> Optional[Dict[str, Any]]:
    try:
        json_objects = extract_all_json_objects(response)
        if not json_objects:
            return None
        if len(json_objects) == 1:
            return json_objects[0]
        return select_best_json(response, json_objects)
    except Exception:
        return None

# ----------------------------
# Playwright actions (merged playwright_actions.py)
# ----------------------------
def capture_screenshot(page, max_width=1200) -> Optional[bytes]:
    try:
        screenshot_bytes = page.screenshot(full_page=True)
        image = Image.open(BytesIO(screenshot_bytes))
        if image.width > max_width:
            ratio = max_width / image.width
            new_height = int(image.height * ratio)
            image = image.resize((max_width, new_height), Image.Resampling.LANCZOS)
        buf = BytesIO()
        image.save(buf, format="PNG")
        buf.seek(0)
        return buf.getvalue()
    except Exception:
        return None

def perform_action(instruction: Dict[str, Any], take_screens: bool = True) -> Tuple[str, Optional[bytes]]:
    action = instruction.get("action")
    screenshots: List[bytes] = []
    result_message = ""

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=HEADLESS)
        page = browser.new_page()
        page.goto(TARGET_URL)
        page.wait_for_timeout(2000)

        if take_screens:
            sc = capture_screenshot(page)
            if sc: screenshots.append(sc)

        try:
            if action == "search_car":
                query = instruction.get("query", "BMW")
                search_input = page.locator('form.search-bar input[name="search"]')
                search_button = page.locator('form.search-bar button')
                search_input.fill(query)
                page.wait_for_timeout(500)
                if take_screens:
                    sc = capture_screenshot(page)
                    if sc: screenshots.append(sc)
                with page.context.expect_page() as new_page_info:
                    search_button.click()
                new_page = new_page_info.value
                new_page.wait_for_timeout(2000)
                if take_screens:
                    sc = capture_screenshot(new_page)
                    if sc: screenshots.append(sc)
                result_message = f"Search completed for '{query}'. New page: {new_page.url}"
                new_page.close()

            elif action == "fill_booking_form":
                page.locator('a[href="#booking"]').click()
                page.wait_for_timeout(1000)
                if take_screens:
                    sc = capture_screenshot(page)
                    if sc: screenshots.append(sc)

                fd = instruction.get("form_data", {})
                page.locator('#fn').fill(fd.get("name", "John Doe"))
                page.locator('#email').fill(fd.get("email", "john@example.com"))
                page.locator('input[name="start"]').fill(fd.get("start_date", "2025-08-01"))
                page.locator('input[name="end"]').fill(fd.get("end_date", "2025-08-07"))
                page.locator('#type').select_option(fd.get("car_type", "SUV"))
                if fd.get("cdw", True):
                    page.locator('#cdw').check()
                if fd.get("terms", True):
                    page.locator('#term1').check()
                page.wait_for_timeout(500)
                if take_screens:
                    sc = capture_screenshot(page)
                    if sc: screenshots.append(sc)
                result_message = "Booking form filled successfully"

            elif action == "submit_booking":
                page.locator('a[href="#booking"]').click()
                page.wait_for_timeout(1000)
                if take_screens:
                    sc = capture_screenshot(page)
                    if sc: screenshots.append(sc)
                with page.context.expect_page() as new_page_info:
                    page.locator('#submit').click()
                new_page = new_page_info.value
                new_page.wait_for_timeout(2000)
                if take_screens:
                    sc = capture_screenshot(new_page)
                    if sc: screenshots.append(sc)
                result_message = f"Booking submitted. Redirect page: {new_page.url}"
                new_page.close()

            elif action == "reset_form":
                page.locator('a[href="#booking"]').click()
                page.wait_for_timeout(1000)
                if take_screens:
                    sc = capture_screenshot(page)
                    if sc: screenshots.append(sc)
                page.locator('#reset').click()
                page.wait_for_timeout(500)
                if take_screens:
                    sc = capture_screenshot(page)
                    if sc: screenshots.append(sc)
                result_message = "Form reset completed"

            elif action == "navigate_to_section":
                section = instruction.get("section", "#home")
                if take_screens:
                    sc = capture_screenshot(page)
                    if sc: screenshots.append(sc)
                page.locator(f'a[href="{section}"]').click()
                page.wait_for_timeout(1000)
                if take_screens:
                    sc = capture_screenshot(page)
                    if sc: screenshots.append(sc)
                result_message = f"Navigated to section: {section}"

            elif action == "test_contact_links":
                page.locator('#contact').scroll_into_view_if_needed()
                page.wait_for_timeout(500)
                if take_screens:
                    sc = capture_screenshot(page)
                    if sc: screenshots.append(sc)
                dialog_message = {"text": ""}
                def handle_dialog(dialog):
                    dialog_message["text"] = dialog.message
                    dialog.accept()
                page.on("dialog", handle_dialog)
                page.locator('.footer-section a').first.click()
                page.wait_for_timeout(1000)
                if take_screens:
                    sc = capture_screenshot(page)
                    if sc: screenshots.append(sc)
                result_message = f"Contact link tested. Dialog: {dialog_message['text']}"

            elif action == "check_pricing":
                page.locator('a[href="#price"]').click()
                page.wait_for_timeout(1000)
                if take_screens:
                    sc = capture_screenshot(page)
                    if sc: screenshots.append(sc)
                car_type = instruction.get("car_type", "SUV")
                rows = page.locator('tbody tr')
                price_per_day = ""
                if car_type == "SUV":
                    price_per_day = rows.nth(0).locator('td').nth(1).text_content()
                elif car_type == "VAN":
                    price_per_day = rows.nth(1).locator('td').nth(1).text_content()
                elif car_type == "Luxury":
                    price_per_day = rows.nth(2).locator('td').nth(1).text_content()
                result_message = f"{car_type} price per day: {price_per_day}"

            elif action == "validate_empty_form":
                page.locator('a[href="#booking"]').click()
                page.wait_for_timeout(1000)
                if take_screens:
                    sc = capture_screenshot(page)
                    if sc: screenshots.append(sc)
                validation_message = {"text": ""}
                def handle_dialog(dialog):
                    validation_message["text"] = dialog.message
                    dialog.accept()
                page.on("dialog", handle_dialog)
                page.locator('#submit').click()
                page.wait_for_timeout(1000)
                if take_screens:
                    sc = capture_screenshot(page)
                    if sc: screenshots.append(sc)
                result_message = f"Empty form validation tested. Message: {validation_message['text']}"

            elif action == "check_car_details":
                page.locator('a[href="#cars"]').click()
                page.wait_for_timeout(1000)
                if take_screens:
                    sc = capture_screenshot(page)
                    if sc: screenshots.append(sc)
                car_type = instruction.get("car_type", "SUV")
                car_items = page.locator('.car-item')
                car_name = ""
                if car_type == "SUV":
                    car_name = car_items.nth(0).locator('p').text_content()
                elif car_type == "VAN":
                    car_name = car_items.nth(1).locator('p').text_content()
                elif car_type == "Luxury":
                    car_name = car_items.nth(2).locator('p').text_content()
                result_message = f"Car type: {car_name}"

            else:
                result_message = f"Unsupported action: {action}"

        except Exception as e:
            if take_screens:
                sc = capture_screenshot(page)
                if sc: screenshots.append(sc)
            result_message = f"Error: {str(e)}"

        finally:
            if take_screens:
                sc = capture_screenshot(page)
                if sc: screenshots.append(sc)
            browser.close()

    main_screenshot = None
    if screenshots:
        main_screenshot = screenshots[-2] if len(screenshots) > 1 else screenshots[0]
    return result_message, main_screenshot

# ----------------------------
# Helpers
# ----------------------------
def b64(data: Optional[bytes]) -> Optional[str]:
    if data is None:
        return None
    return base64.b64encode(data).decode("utf-8")

def timestamp() -> str:
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")

# ----------------------------
# API Routes
# ----------------------------
@app.get("/api/health")
def health():
    return jsonify({"ok": True, "model": OLLAMA_MODEL, "headless": HEADLESS, "target": TARGET_URL})

@app.get("/api/history")
def get_history():
    return jsonify({"history": HISTORY})

@app.post("/api/clear-history")
def clear_history():
    global HISTORY
    HISTORY = []
    return jsonify({"ok": True})

@app.post("/api/test-command")
def test_command():
    data = request.get_json(force=True)
    prompt = (data or {}).get("prompt", "").strip()
    if not prompt:
        return jsonify({"error": "prompt is required"}), 400

    raw_output = call_ollama_model(prompt)
    parsed_instruction = parse_response(raw_output)

    add_history({
        "timestamp": timestamp(),
        "command": prompt,
        "parsed_action": parsed_instruction,
        "status": "success" if parsed_instruction else "error",
        "result": "Parsed successfully" if parsed_instruction else "Could not parse instruction",
        "raw_output": raw_output,
    })

    return jsonify({
        "raw_output": raw_output,
        "parsed_instruction": parsed_instruction
    })

@app.post("/api/execute")
def execute_automation():
    data = request.get_json(force=True)
    prompt = (data or {}).get("prompt", "").strip()
    take_screens = bool((data or {}).get("take_screenshots", True))
    if not prompt:
        return jsonify({"error": "prompt is required"}), 400

    # Step 1: model
    raw_output = call_ollama_model(prompt)
    if not raw_output:
        entry = {
            "timestamp": timestamp(),
            "command": prompt,
            "parsed_action": None,
            "status": "error",
            "result": "No response from Ollama model",
            "raw_output": raw_output,
        }
        add_history(entry)
        return jsonify(entry), 500

    # Step 2: parse
    parsed_instruction = parse_response(raw_output)
    if not parsed_instruction:
        entry = {
            "timestamp": timestamp(),
            "command": prompt,
            "parsed_action": None,
            "status": "error",
            "result": "Could not parse instruction",
            "raw_output": raw_output,
        }
        add_history(entry)
        return jsonify(entry), 400

    # Step 3: perform
    result, screenshot = perform_action(parsed_instruction, take_screens)
    entry = {
        "timestamp": timestamp(),
        "command": prompt,
        "parsed_action": parsed_instruction,
        "status": "success" if not result.lower().startswith("error") else "error",
        "result": result,
        "raw_output": raw_output,
        "screenshot_b64": b64(screenshot),
    }
    add_history(entry)

    return jsonify({
        "result": result,
        "parsed_action": parsed_instruction,
        "screenshot_b64": b64(screenshot),
    })

@app.post("/api/execute-direct")
def execute_direct():
    payload = request.get_json(force=True)
    if not isinstance(payload, dict):
        return jsonify({"error": "Body must be a JSON object instruction"}), 400
    take_screens = bool(payload.pop("take_screenshots", True))
    result, screenshot = perform_action(payload, take_screens)
    entry = {
        "timestamp": timestamp(),
        "command": "Direct custom action",
        "parsed_action": payload,
        "status": "success" if not result.lower().startswith("error") else "error",
        "result": result,
        "raw_output": None,
        "screenshot_b64": b64(screenshot),
    }
    add_history(entry)
    return jsonify({
        "result": result,
        "screenshot_b64": b64(screenshot),
    })

# ----------------------------
# Main
# ----------------------------
if __name__ == "__main__":
    # Typical dev run: python app.py
    # Serve on 5000 by default; set PORT env to override
    port = int(os.getenv("PORT", "5000"))
    app.run(host="0.0.0.0", port=port, debug=True)
