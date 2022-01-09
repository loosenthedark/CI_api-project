const API_KEY = 'Ro9l9j2WNptBQgD_mM5AcTxHGDo';
const API_URL = 'https://ci-jshint.herokuapp.com/api';
const resultsModal = new bootstrap.Modal(document.getElementById('resultsModal'));

document.getElementById('status').addEventListener('click', e => getStatus(e));

async function getStatus(e) {
  const queryString = `${API_URL}?api_key=${API_KEY}`;

  const response = await fetch(queryString);

  const data = await response.json();

  if (response.ok) {
    displayStatus(data.expiry);
  } else {
    displayException(data);
    throw new Error(data.error);
  }
}

function displayStatus(data) {
  document.getElementById('resultsModalTitle').textContent = 'API Key Status';
  document.getElementById('results-content').innerHTML = `<div class='key-status'>Your key is valid until ${data}</div>`;
  resultsModal.show();
}

document.getElementById('submit').addEventListener('click', e => postForm(e))

function processOptions(form) {
  let optionsArray = [];

  for (let entry of form.entries()) {
    if (entry[0] === 'options') {
      optionsArray.push(entry[1]);
    }
  }

  form.delete('options');

  form.append('options', optionsArray.join());

  return form;
}

async function postForm(e) {
  const form = processOptions(new FormData(document.getElementById('checksform')));

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Authorization": API_KEY,
    },
    body: form
  });

  const data = await response.json();

  if (response.ok) {
    displayErrors(data);
  } else {
    displayException(data);
    throw new Error(data.error);
  }
}

function displayErrors(data) {
  let heading = `JSHint results for ${data.file}`;

  if (data.total_errors === 0) {
    results = `<div class='no-errors'>No errors reported!</div>`;
  } else {
    results = `<div>Total errors: <span class='error-count'>${data.total_errors}</span></div>`;
    for (let error of data.error_list) {
      results += `<div>At line <span class='line'>${error.line}</span>, `;
      results += `column <span class='column'>${error.col}</span>:</div> `;
      results += `<div class='error'>${error.error}</div>`;
    }
  }

  document.getElementById('resultsModalTitle').textContent = heading;
  document.getElementById('results-content').innerHTML = results;
  resultsModal.show();
}

function displayException(data) {
  let heading = 'An Exception Occurred';

  results = `<div> The API returned status code ${data.status_code}</div>`;
  results += `<div>Error number: <strong>${data.error_no}</strong></div>`;
  results += `<div>Error text: <strong>${data.error}</strong></div>`;

  document.getElementById('resultsModalTitle').textContent = heading;
  document.getElementById('results-content').innerHTML = results;
  resultsModal.show();
}
