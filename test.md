# Gem verification guide

Use this checklist on your phone or in the browser to confirm the changes are working end to end.

## 1) Sign in and open the app

1. Open the Gem web app in Safari or the browser where it is running.
2. Sign in with your normal Gem account.
3. If you are on iPhone, use the Share > Add to Home Screen flow if you want the app to feel native.
4. Confirm the app loads the inbox and you can see the main navigation.

## 2) Check the sync page

1. Open the Settings page.
2. Tap the new Sync & device keys link.
3. You should land on the /sync page.
4. Enter a device name like “iPhone 14” and tap Generate.
5. Confirm a device token is created and shown on the page.
6. Tap Copy endpoint to copy the ingest URL.
7. Verify the endpoint is the public ingest URL for Gem.

## 3) Generate a device key and keep it safe

1. On the /sync page, copy the generated key.
2. Keep it somewhere private because it is the secret that authorizes ingest requests.
3. If you want to rotate it, tap Revoke on an old key and generate a new one.

## 4) Test the ingest endpoint with a real POST

Choose one of these methods:

### Option A: use a browser tool or curl

1. Open a terminal or another browser environment.
2. Run a request like this:

```bash
curl -X POST "https://YOUR_APP_URL/api/public/ingest" \
  -H "Content-Type: application/json" \
  -d '{
    "device_key": "PASTE_YOUR_DEVICE_KEY_HERE",
    "text": "Instagram\nChloe: hey are you up?"
  }'
```

3. The response should be JSON with ok: true and a contact_id.
4. If it returns an invalid device key or error, re-check the token and the app URL.

### Option B: use the website or a test script

1. Open the debugging tools in the browser.
2. Send a POST request to /api/public/ingest with the same JSON body.
3. Check the response quickly to confirm the message was accepted.

## 5) Confirm the new message appears in the inbox

1. Return to the main inbox page.
2. Refresh once if needed.
3. Look for the matching person in the list.
4. Open that person’s thread.
5. Confirm the new message appears under the right contact and with the correct platform badge.

## 6) Verify duplicate prevention in Capture

1. Go to the Capture page.
2. Paste a message from a person already in your contacts, such as:

```text
Instagram
Chloe: hey are you up?
```

3. Tap File it in Gem.
4. Confirm that Gem matches the existing person instead of creating a duplicate.
5. Check the person’s thread and verify the message landed in the same conversation.

## 7) Verify the live realtime update

1. Open the app on one signed-in device or browser tab.
2. Open the same app in another tab or another signed-in device.
3. Send a new ingest request using the device key.
4. Confirm the other open app updates automatically without a manual refresh.
5. You should see the new message show up in the inbox and thread list live.

## 8) Verify a brand new contact is created when needed

1. On the Capture page, paste a message from someone not already in your contacts.
2. Use a new sender name or handle that does not match any current person.
3. Tap File it in Gem.
4. Confirm a new contact appears in the inbox.
5. Open the thread and verify the message exists there.

## 9) Verify the matching logic works for common cases

Try a few variations to confirm matching is smart enough:

- `Chloe` matches the same person as `@chloe`
- `+1 (415) 555-0101` matches the same contact as an SMS/iMessage number
- `@alex` matches a stored Instagram handle for Alex
- a first-name fallback matches a person whose name is “Alex Carter” when the incoming sender says “Alex”

## 10) Final sanity check

Before you call it done, confirm all of these are true:

- Settings has a link to Sync
- /sync page loads
- device key generation works
- ingest endpoint accepts a valid key
- message lands in the correct contact
- duplicates are avoided
- message appears live across signed-in devices
- the thread view shows the right platform badge and content

## Quick summary

If everything passes, the system is working as intended:

- capture saves into the correct contact
- ingest works from phone shortcuts or any POST client
- new messages sync live across devices
- people are matched instead of duplicated

If one of the checks fails, re-check the device key, the public URL, and whether the person already exists in the contact list before trying again.
