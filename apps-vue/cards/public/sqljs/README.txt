Place sql-wasm.js and sql-wasm.wasm here to enable SQL.js (WASM) backend.

How to obtain:
- Download from the official SQL.js releases (https://github.com/sql-js/sql.js/)
- Copy the built files from dist/ (sql-wasm.js and sql-wasm.wasm) into this folder.

App config:
- Set VITE_USE_SQLJS=true in .env (build-time), or
- At runtime, Settings → Database Backend → "Use SQL.js (WASM)" (sets LC_DB_BACKEND in localStorage), or
- In DevTools: window.__USE_SQLJS = true (temporary until reload).

Notes:
- Current adapter keeps the database in memory unless OPFS/file persistence is implemented.
- For persistence, extend src/lib/db/sqljs.js to save/load the DB to the Origin Private File System.
