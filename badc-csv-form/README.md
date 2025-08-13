# BADC CSV Form

A simple client-side JavaScript app to create self-describing BADC-CSV headers by filling out a web form. Generates a CSV metadata header file ready for download.

## Project Structure

badc-csv-form/
├─ src/
│  ├─ script.js             # javascript logic to render and validate form, genereate and download csv
│  ├─ index.html            # html file to run the form
│  ├─ styles.css            # styling for the form
├─ package.json             # Project metadata and build scripts
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
Open `index.html` in a browser.

To use it in a web page use:
```
<link rel="stylesheet" href="styles.css" />
<script src="script.js"></script>
<script>
  document.addEventListener("DOMContentLoaded", () => {
    FormToCSV.initFormToCSV(document.body);
  });
</script>

```