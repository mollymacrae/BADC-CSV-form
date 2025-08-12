# BADC CSV Form

Insert description of app here ...

## Project Structure

badc-csv-form/
├─ src/
│  ├─ index.js              # main entry point
│  ├─ formUI.js             # code to render and handle the form
│  ├─ csvExport.js          # CSV conversion + download logic
├─ dist/
│  ├─ badc-csv-form.min.js  # built & bundled output
├─ package.json             # file to package up the JS app
├─ README.md                # README file with instructions
├─ .gitignore               # Things for git to ignore
├─ .npmignore               # Things for npm to ignore


## How to use

Clone the respository:
```
git clone git@github.com:mollymacrae/BADC-CSV-form.git
```
Change into the directory:
```
cd BADC-CSV-FORM/basc-csv-form
```
Install the app:
```
npm install
```
Build the app:
```
npm run build
```

To run it you can just open the index.html file in your browser.
For live reload for development, run:
```
npm run dev
```

To use it in a web page use:
```
<script src="badc-csv-form.min.js"></script>
<script>
  document.addEventListener("DOMContentLoaded", () => {
    FormToCSV.initFormToCSV(document.body); 
  });
</script>

```