import { useEffect, useState } from 'react';
import './App.css';

function RequestBody({ method, bodyFormat, setBodyFormat }) {
  // Hold form data entries
  const [formDataEntries, setFormDataEntries] = useState([]);

  // Set active button based on body format
  useEffect(() => {
    // Check if method is POST
    if (method === "POST") {
      if (bodyFormat === 'JSON') {
        document.getElementById('json-format-button').style.borderColor = 'white';
        document.getElementById('formData-format-button').style.borderColor = 'transparent';

      } else if (bodyFormat === 'Form Data') {
        document.getElementById('json-format-button').style.borderColor = 'transparent';
        document.getElementById('formData-format-button').style.borderColor = 'white';
      }
    }
  }, [bodyFormat, method]);

  // Check if body json is valid
  function check_body_json() {
    // Get json from input
    const json_string = document.getElementById('json-body').value;

    // Get json validator
    const json_validator = document.getElementById('json-body-validator');

    // Check if any data exists
    if (json_string === "") {
      json_validator.innerHTML = "";
      return;
    }

    // Parse json to validate it
    try {
      JSON.parse(json_string);

      // Update json validator
      json_validator.innerHTML = "JSON is valid!";
      json_validator.style.color = "green";

    } catch {

      // Update json validator
      json_validator.innerHTML = "JSON not is valid!";
      json_validator.style.color = "red";
    }
  }

  // Handle adding new form entries to request body
  function add_form_entry() {
    // Get entry name
    const entry_name = document.getElementById('form-entry-value').value;

    // Add new form entry
    setFormDataEntries([...formDataEntries, entry_name]);

    // Clear entry box
    document.getElementById('form-entry-value').value = "";
  }

  // for testing
  useEffect(() => {
    console.log(formDataEntries);
  }, [formDataEntries]);

  // Check if method is POST
  if (method === "POST") {
    return(
      <div className='request-body'>
        <ul className='format-options'>
          <li onClick={() => setBodyFormat('JSON')} id='json-format-button'>JSON</li>
          <li onClick={() => setBodyFormat('Form Data')} id='formData-format-button'>Form Data</li>
        </ul>
        {bodyFormat === "JSON" ? (
          <>
            <textarea id='json-body' placeholder='{"key2": "value2"}' className='json-body-entry' onChange={check_body_json} />
            <span style={{'padding-left': "15px"}} className='json-validate' id='json-body-validator' />
          </>
        ) : (
          <>
            <form id='form-body' className='form-body-entry'>
              {formDataEntries.map((entry, index) => (
                <div className='form-data-entry' key={index}>
                  <span>{entry}</span>
                  <input type='text' name={entry} />
                  <button onClick={() => setFormDataEntries(formDataEntries.filter(e => e !== entry))}> x </button>
                </div>
              ))}
            </form>
            <div className='add-form-entry'>
              <input id='form-entry-value' placeholder='example123' />
              <button onClick={() => add_form_entry()}> Add +</button>
            </div>
          </>
        )}
      </div>
    );
  } else {
    return <p className='message'>Request body not available with GET.</p>
  }
}

function UserInterface() {
  // Hold the method for the request
  const [method, setMethod] = useState('GET');

  // Hold formatting type for request body
  const [bodyFormat, setBodyFormat] = useState('JSON');

  // Check if header json is valid
  function check_header_json() {
    // Get json from input
    const json_string = document.getElementById('headers-input').value;

    // Get json validator
    const json_validator = document.getElementById('json-validator');

    // Check if any data exists
    if (json_string === "") {
      json_validator.innerHTML = "";
      return;
    }

    // Parse json to validate it
    try {
      JSON.parse(json_string);

      // Update json validator
      json_validator.innerHTML = "JSON is valid!";
      json_validator.style.color = "green";

    } catch {

      // Update json validator
      json_validator.innerHTML = "JSON not is valid!";
      json_validator.style.color = "red";
    }
  }

  return(
    <div className='ui'>
      <h1>URL</h1>
      <div className='url'>
        <select id='request-method' onChange={() => setMethod(document.getElementById('request-method').value)}>
          <option>GET</option>
          <option>POST</option>
        </select>
        <input placeholder='https://example.com' type='url' />
      </div>
      <h1>Headers</h1>
      <textarea className='headers-input' placeholder='{"key1": "value1"}' id='headers-input' onChange={check_header_json} />
      <span className='json-validate' id='json-validator' />
      <h1>Body</h1>
      <RequestBody method={method} bodyFormat={bodyFormat} setBodyFormat={setBodyFormat} />
      <button className='execute-button'>Execute</button>
    </div>
  );
}

function App() {
  return (
    <div className='app'>
      <div className='header'>
        <h1>Simple HTTP</h1>
        <p>Simple HTTP is a web app that allows you to send http requests to any URL of your choice.</p>
      </div>
      <UserInterface />
    </div>
  );
}

export default App;
