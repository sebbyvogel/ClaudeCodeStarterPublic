# My API Learnings

What I learned on my way to becoming an integration architect, built around my **Bayern Match API**.
Updated after every session. For git and Claude Code commands, see [CHEATSHEET.md](CHEATSHEET.md).

## Progress

| Level | Topic | Status |
|---|---|---|
| 1 | API basics: endpoints, JSON, HTTP, status codes | ✅ done |
| 2 | Build my own API (FastAPI, GET/POST/PUT/PATCH/DELETE, Postman) | ✅ done |
| 3 | Use external APIs (live Bayern data, data mapping) | ⏳ next |
| 4 | Security (API keys, authentication) | |
| 5 | Integration patterns | |
| 6 | Architecture and documentation | |

## The big picture: how my project fits together

```
 Postman  ──PUT/POST/DELETE──▶  FastAPI server  ──writes──▶  api/matches.json
 (client)                       (server/main.py)                   │
                                 only on my Mac             git push
                                                                   ▼
 Browser  ◀──GET api/matches.json──  GitHub Pages  (only hands out files)
 (script.js shows the match cards)
```

- **Locally**, the FastAPI server can *change* data.
- **Online**, GitHub Pages can only *hand out* files (GET). Changes go live with `git push`.

---

## 1. API basics

**API** (Application Programming Interface): a way for programs to talk to each other.
**Endpoint**: a URL that returns data instead of a web page.
Example: https://sebbyvogel.github.io/ClaudeCodeStarterPublic/api/matches.json

**Client and server**:
- The **server** has the data and answers requests (FastAPI, GitHub Pages).
- The **client** asks for data and uses it (my website's `script.js`, Postman, `curl`).

### JSON

The format almost every API uses. My match looks like this:

```json
{
  "id": 3,
  "date": "2026-10-10T15:30:00+02:00",
  "competition": "Bundesliga",
  "opponent": "FC Augsburg",
  "venue": "away",
  "score": null,
  "stadium": "WWK Arena"
}
```

JSON rules that tripped me up or almost did:
- Text in **double quotes**, numbers **without** quotes.
- Commas **between** items, **never after the last one**.
- `null` means "no value", for example no score yet.
- Dates in the ISO 8601 format with time zone: `2026-10-10T15:30:00+02:00`. Use `+02:00` for German summer time and `+01:00` for winter time.
- Every object gets a unique `id`.
- Check a file with: `python3 -m json.tool api/matches.json`

## 2. The data contract

The **contract** is the agreed structure of the data: which fields exist, what type they have, and which values are allowed.
- The client relies on it. **Renaming a field breaks every client** that uses it.
- **Adding a field changes nothing** until a client uses it. I added `stadium` to the JSON, and it only appeared after I changed `script.js`.
- My FastAPI server **enforces** the contract. `"venue": "neutral"` is rejected because only `home` or `away` are allowed.

## 3. Missing data: the client must handle it

When a field is missing, JavaScript returns `undefined`, and my page literally showed the word "undefined".
The fix is the **condition ? yes : no** pattern:

```js
const stadium = match.stadium
  ? match.stadium          // field exists → show it
  : "Stadium unknown";     // field missing → fallback
```

Lessons:
- When reusing this pattern, **replace all three parts**: the question, the "yes" part and the "no" part. My first try still showed the score, because I copied the template without changing it.
- **Use the new variable afterwards.** My second try created `stadium` but still displayed `match.stadium`.

## 4. HTTP methods

| Method | Meaning | Example | Body needed? |
|---|---|---|---|
| **GET** | read | `GET /matches/3` | no |
| **POST** | create new; the server picks the id | `POST /matches` | yes, the new match |
| **PUT** | replace an existing one **completely** | `PUT /matches/2` | yes, **all** fields |
| **PATCH** | change **single fields** only | `PATCH /matches/2` | only the changed fields |
| **DELETE** | remove | `DELETE /matches/3` | no |

What I learned the hard way:
- To change an existing match, use **PUT, not POST**. POST would create a new one.
- The **id goes in the URL** (`/matches/2`), not in the body.
- **PUT needs the whole object.** Sending only `stadium` failed with 422.
- Easy workflow: **GET** the match, copy the response, change one field, send it back with **PUT** (without the `id` line).
- **PATCH is easier for small changes**: `PATCH /matches/3` with only `{ "score": null }` reset my Augsburg test score.
  I added it to `server/main.py` myself. Every field is optional (`= None`), and `exclude_unset=True` uses only the fields I actually sent.

## 5. Status codes

The first thing to check when something goes wrong.

| Code | Meaning | When I saw it |
|---|---|---|
| **200** OK | worked | GET or PUT succeeded |
| **201** Created | new thing created | POST succeeded |
| **204** No Content | worked, nothing to return | DELETE succeeded |
| **404** Not Found | this doesn't exist | `GET /matches/99` |
| **405** Method Not Allowed | wrong method for this URL | `POST /matches/3` |
| **422** Unprocessable Entity | the data breaks the contract | missing fields, `"venue": "neutral"` |

Rule of thumb: **2xx** means OK, **4xx** means the client (me) did something wrong, and **5xx** means the server broke.

## 6. Static API vs. real server

| | Static file (GitHub Pages) | Server (FastAPI) |
|---|---|---|
| Methods | GET only | GET, POST, PUT, PATCH, DELETE |
| Answer | always the same file | computed on each request |
| Validation | none | checks the contract |
| Runs where | online, free | on my Mac (for now) |

## 7. Caching

Servers tell browsers how long they may keep a file. GitHub Pages sends `cache-control: max-age=600`, which means 10 minutes.
- After a push, my browser still showed the old page.
- Fix: a hard refresh with **Cmd + Shift + R**, or an incognito window.
- Why it matters: with "live" data, caching means users may see **outdated data**. A goal could show up minutes late.

## 8. Testing an API

- **Postman**: build requests by clicking. Choose the method and URL, then the body as **raw → JSON**, and read the status code on the right.
- **curl** in the terminal: `curl -i http://localhost:8000/matches/3` (`-i` also shows the status and headers).
- **FastAPI docs**: http://localhost:8000/docs is interactive documentation, generated automatically in the industry-standard **OpenAPI** format.
- **Test with care**: test changes are real changes. My Augsburg 1:1 test was saved to the file, and I had to undo it before publishing.

---

## How to run things

| What | Command (in the Terminal app, in `~/Desktop/ClaudeCode`) |
|---|---|
| Start my API server and website | `.venv/bin/fastapi dev server/main.py` |
| Open the website | http://localhost:8000 |
| Open the API docs | http://localhost:8000/docs |
| Stop the server | `Ctrl + C` |

Long-running commands like servers belong in the **Terminal app**, not after `!` in the Claude chat, because they never finish and block the chat.

## Words to know

- **Endpoint**: a URL of an API, for example `/matches/3`.
- **Request / response**: the question a client sends / the answer the server returns.
- **Body**: the data sent along with a request (POST, PUT, PATCH).
- **Header**: extra information on a request or response, for example `Content-Type: application/json`.
- **Contract / schema**: the agreed structure of the data.
- **Validation**: the server checking that data follows the contract.
- **Data mapping**: translating one system's format into another's.
- **OpenAPI**: the standard format for describing REST APIs, which FastAPI generates for me.
- **Virtual environment (`.venv`)**: a private Python setup for one project.

## Next steps

- [x] Add a **PATCH** endpoint myself, to change only single fields.
- [ ] Fetch **live Bayern matches** from an external API (candidate: OpenLigaDB) and map them to my format.
