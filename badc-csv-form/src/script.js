// script.js

// Render the form HTML into #app
function renderForm() {
  document.getElementById('app').innerHTML = `
    <h1>Create BADC-CSV header</h1>
      <p>
        Fill out this form to create a template to convert your CSV data to self-describing BADC-CSV format. <br>
        This form assumes your data is organised in columns. <br>
        - Add creators and contributors to the dataset <br>
        - Add information to describe each column of the dataset (long_name, column number, units,standard_name (optional), type (optional))<br>
        - Add any additional metadata or comments <br>
        When you are ready click 'Submit' to download your BADC-CSV header.
      </p>

    <form id="badc-csv-form" novalidate>
      <h2>Dataset title</h2>
      <label for="title">Title:</label>
      <input type="text" name="title" required />

      <h2>Creators and Contributors</h2>
      <p>
        Add individuals who created or contributed to the dataset and the columns that they contributed to (if all put 'G' for global)
      </p>
      <div id="creators-container">
        <div class="creator-entry">
          <label>Role:</label>
          <select name="person_role">
            <option value="creator">Creator</option>
            <option value="contributor">Contributor</option>
          </select>

          <label>Column Number:</label>
          <input type="text" name="person_column_number" required placeholder="e.g. 3 or G" />

          <label>Name:</label>
          <input type="text" name="person_name" />

          <label>Institution:</label>
          <input type="text" name="institution" placeholder="e.g. UK Met Office" />

          <label>Additional Info:</label>
          <input type="text" name="additional_creator_info" placeholder="Optional" />
        </div>
      </div>
      <button type="button" id="add-creator-btn">+ Add Person</button>

      <h2>Column metadata</h2>
      <p>
        Add column metadata here to describe each column of the CSV dataset
      </p>
      <div id="variables-container">
        <div class="variable-entry">
          <p>
            Please provide a long name, column number and units, and optionally a standard name and type.
          </p>
          <label>Long Name:</label>
          <input type="text" name="long_name" required placeholder="e.g. Air Temperature" />

          <label>Column Number:</label>
          <input type="number" name="column_number" required placeholder="e.g. 3" />

          <label>Units:</label>
          <input type="text" name="units" required placeholder="e.g. K" />

          <label>Standard Name (optional):</label>
          <input type="text" name="standard_name" placeholder="e.g. air_temperature" />

          <label>Type (optional):</label>
          <input type="text" name="type" placeholder="e.g. float" />
        </div>
      </div>
      <button type="button" id="add-variable-btn">+ Add Column</button>

      <h2>Additional Metadata</h2>
      <p>Add additional metadata here.</p>
      <div id="metadata-container">
        <div class="metadata-entry">
          <label>Metadata Type:</label>
          <select name="metadata_type">
            <option value="comment">Comment</option>
            <option value="coordinate_variable">coordinate_variable</option>
            <option value="start_time">Start time</option>
            <option value="end_time">End time</option>
            <option value="rights">Rights</option>
            <option value="source">Source</option>
            <option value="reference">Reference</option>
            <option value="last_revised_date">Last revised date</option>
            <option value="history">History</option>
          </select>

          <label>Column Number:</label>
          <input type="text" name="metadata_column_number" required placeholder="e.g. 3 or G" />

          <label>Value:</label>
          <textarea name="metadata_value" rows="3" placeholder="Useful information about dataset"></textarea>
        </div>
      </div>
      <button type="button" id="add-metadata-btn">+ Add Metadata</button>

      <div class="error" id="error-msg"></div>

      <button type="submit">Submit</button>
    </form>
  `;
}

// Validation function
function validateForm(form) {
  const errors = [];
  const title = form.querySelector('input[name="title"]').value.trim();
  if (!title) errors.push('Dataset title is required.');

  // Check creators
  form.querySelectorAll('.creator-entry').forEach((entry, i) => {
    const col = entry.querySelector('input[name="person_column_number"]').value.trim();
    if (!col) errors.push(`Creator #${i + 1}: Column Number required.`);
  });

  // Check variables
  form.querySelectorAll('.variable-entry').forEach((entry, i) => {
    const longName = entry.querySelector('input[name="long_name"]').value.trim();
    const colNum = entry.querySelector('input[name="column_number"]').value.trim();
    const units = entry.querySelector('input[name="units"]').value.trim();

    if (!longName) errors.push(`Variable #${i + 1}: Long Name required.`);
    if (!colNum) errors.push(`Variable #${i + 1}: Column Number required.`);
    if (!units) errors.push(`Variable #${i + 1}: Units required.`);
  });

  // Check metadata
  form.querySelectorAll('.metadata-entry').forEach((entry, i) => {
    const colNum = entry.querySelector('input[name="metadata_column_number"]').value.trim();
    if (!colNum) errors.push(`Metadata #${i + 1}: Column Number required.`);
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Build CSV string (BADC header format)
function generateBADCHeaderCSV(form) {
  const lines = [];
  lines.push(`Conventions,G,BADC-CSV,1`);
  // Title line
  lines.push(`title,G,${form.querySelector('input[name="title"]').value.trim()}`);

  // Creators
  form.querySelectorAll('.creator-entry').forEach(entry => {
    const role = entry.querySelector('select[name="person_role"]').value.trim();
    const colNum = entry.querySelector('input[name="person_column_number"]').value.trim();
    const name = entry.querySelector('input[name="person_name"]').value.trim();
    const institution = entry.querySelector('input[name="institution"]').value.trim();
    const addInfo = entry.querySelector('input[name="additional_creator_info"]').value.trim();

    lines.push(`${role},${colNum},${name},${institution},${addInfo}`);
  });

  // Variables (columns)
  form.querySelectorAll('.variable-entry').forEach(entry => {
    const longName = entry.querySelector('input[name="long_name"]').value.trim();
    const colNum = entry.querySelector('input[name="column_number"]').value.trim();
    const units = entry.querySelector('input[name="units"]').value.trim();
    const standardName = entry.querySelector('input[name="standard_name"]').value.trim();
    const type = entry.querySelector('input[name="type"]').value.trim();

    lines.push(`long_name,${colNum},${longName},${units}`);
    if (standardName) lines.push(`standard_name,${colNum},${standardName}`);
    if (type) lines.push(`type,${colNum},${type}`);
  });

  // Metadata
  form.querySelectorAll('.metadata-entry').forEach(entry => {
    const type = entry.querySelector('select[name="metadata_type"]').value.trim();
    const colNum = entry.querySelector('input[name="metadata_column_number"]').value.trim();
    const value = entry.querySelector('textarea[name="metadata_value"]').value.trim();

    lines.push(`${type},${colNum},${value}`);
  });

  lines.push(`data`);
  lines.push(`[Paste data here]`);
  lines.push(`end_data`);


  return lines.join('\n');
}

// Download CSV file
function downloadCSV(content, filename = 'badc-header.csv') {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);
}

// Add event listeners for dynamic buttons and form submit
function setupEventListeners() {
  const form = document.getElementById('badc-csv-form');

  // Add Creator button
  document.getElementById('add-creator-btn').addEventListener('click', () => {
    const container = document.getElementById('creators-container');
    const clone = container.querySelector('.creator-entry').cloneNode(true);
    clone.querySelectorAll('input').forEach(input => (input.value = ''));
    container.appendChild(clone);
  });

  // Add Variable button
  document.getElementById('add-variable-btn').addEventListener('click', () => {
    const container = document.getElementById('variables-container');
    const clone = container.querySelector('.variable-entry').cloneNode(true);
    clone.querySelectorAll('input').forEach(input => (input.value = ''));
    container.appendChild(clone);
  });

  // Add Metadata button
  document.getElementById('add-metadata-btn').addEventListener('click', () => {
    const container = document.getElementById('metadata-container');
    const clone = container.querySelector('.metadata-entry').cloneNode(true);
    clone.querySelectorAll('input, textarea').forEach(el => (el.value = ''));
    container.appendChild(clone);
  });

  // On form submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const errorMsg = document.getElementById('error-msg');
    errorMsg.textContent = '';

    const { isValid, errors } = validateForm(form);
    if (!isValid) {
      errorMsg.textContent = errors.join(' ');
      return;
    }

    const csvContent = generateBADCHeaderCSV(form);
    downloadCSV(csvContent);
  });
}

// Initialize app
function init() {
  renderForm();
  setupEventListeners();
}

window.addEventListener('DOMContentLoaded', init);
