# encrypted-markdown
Client-side "password protected" markdown viewer/editor, use google drive as cloud storage

## What does it do.

### Put your private data on google drive and protect them by password only known by you!

This webapp allows you to store encrypted markdown on google drive. The data stored at google drive are encrypted.
This webapp is also pure client-side, decryption and encryption are done at your local browser.

## Demo website

* Visit https://smallptsai.github.io/encrypted-markdown/
* (First time only) Click "Authorize" to bring up Google Drive window. 
  * This site request per-app permission, that is, it can ONLY create or open files created by this webapp
  * Encrypted data will be stored at `Encrypted Markdown` folder, the contents of each file are encrypted.
* At Password dialog, input an password only known by you
  * This password will be used to encrypt all markdown data created by this webapp 
  
## 3rd-party library leveraged

* jQuery
* bootstrap
* codemirror (as markdown-editor)
* markdown-it (convert markdown to html)
  * highlight.js
* sjcl (for encryption)

