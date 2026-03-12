# Portfolio AI Knowledge Base

Drop supporting documents for the portfolio chatbot in this folder.

Recommended files:
- `resume.md`
- `resume.tex`
- `transcript.md`
- `notes.md`

Supported formats right now:
- `.md`
- `.txt`
- `.json`
- `.tex`

How it works:
- The chatbot always reads structured portfolio data from the app.
- It also scans this folder for extra documents.
- If you add `GEMINI_API_KEY` or `OPENAI_API_KEY`, the chat will use an AI model with retrieval over this folder and the portfolio data.
- Without an API key, it still works as a local retrieval assistant.

Notes:
- LaTeX resumes are supported, so `resume.tex` is fine.
- Keep document content reasonably clean and text-focused for best retrieval quality.
- PDFs are not automatically indexed by the runtime route, so paste their contents into markdown/text files here.
- Replace the placeholder files with your real content whenever you're ready.
