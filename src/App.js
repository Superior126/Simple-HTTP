import { useEffect, useState } from 'react';
import './App.css';
import './spinners.css';
import logo from './assets/logo.png';

function RequestBody({ method, bodyFormat, setBodyFormat }) {
  // Hold form data entries
  const [formDataEntries, setFormDataEntries] = useState([]);

  // Set active button based on body format
  useEffect(() => {
    // Check if method is POST
    if (method === "POST" || method === "PUT") {
      if (bodyFormat === 'JSON') {
        document.getElementById('json-format-button').style.borderColor = 'white';
        document.getElementById('formData-format-button').style.borderColor = 'transparent';
        document.getElementById('xml-format-button').style.borderColor = 'transparent';

      } else if (bodyFormat === 'Form Data') {
        document.getElementById('json-format-button').style.borderColor = 'transparent';
        document.getElementById('xml-format-button').style.borderColor = 'transparent';
        document.getElementById('formData-format-button').style.borderColor = 'white';

      } else if (bodyFormat === 'XML') {
        document.getElementById('json-format-button').style.borderColor = 'transparent';
        document.getElementById('xml-format-button').style.borderColor = 'white';
        document.getElementById('formData-format-button').style.borderColor = 'transparent';
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

  function isValidXML(xmlString) {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, 'application/xml');
  
      // Serialize the parsed XML document back to a string
      const serializer = new XMLSerializer();
      const serializedXml = serializer.serializeToString(xmlDoc);
  
      // Compare the serialized XML with the original XML
      return serializedXml === xmlString;
    } catch (error) {
      return false; // Return false for parsing errors
    }
  }
  
  // Check if body xml is valid
  function check_body_xml() {
    // Get xml from input
    const xml_string = document.getElementById('xml-body').value;
  
    // Get xml validator
    const xml_validator = document.getElementById('xml-body-validator');
  
    // Check if any data exists
    if (xml_string === "") {
      xml_validator.innerHTML = "";
      return;
    }
  
    if (isValidXML(xml_string)) {
      // Update xml validator for valid XML
      xml_validator.innerHTML = "XML is valid!";
      xml_validator.style.color = "green";
    } else {
      // Update xml validator for invalid XML
      xml_validator.innerHTML = "XML is not valid!";
      xml_validator.style.color = "red";
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

  // Check if method is POST
  if (method === "POST" || method === "PUT") {
    return(
      <div className='request-body'>
        <ul className='format-options'>
          <li onClick={() => setBodyFormat('JSON')} id='json-format-button'>JSON</li>
          <li onClick={() => setBodyFormat('Form Data')} id='formData-format-button'>Form Data</li>
          <li onClick={() => setBodyFormat('XML')} id='xml-format-button'>XML</li>
        </ul>
        {bodyFormat === "JSON" ? (
          <>
            <textarea id='json-body' placeholder='{"key2": "value2"}' className='json-body-entry' onChange={check_body_json} />
            <span style={{ 'paddingLeft': "15px" }} className='json-validate' id='json-body-validator' />
          </>
        ) : bodyFormat === "Form Data" ? (
          <>
            <form id='form-body' className='form-body-entry'>
              {formDataEntries.map((entry, index) => (
                <div className='form-data-entry' key={index}>
                  <span>{entry}</span>
                  <input type='text' name={entry} />
                  <button onClick={() => setFormDataEntries(formDataEntries.filter(e => e !== entry))} type='button'> x </button>
                </div>
              ))}
            </form>
            <div className='add-form-entry'>
              <input id='form-entry-value' placeholder='example123' />
              <button onClick={() => add_form_entry()}> Add +</button>
            </div>
          </>
        ) : (
          <>
            <textarea id='xml-body' placeholder='<key3>value3</key3>' className='xml-body-entry' onChange={check_body_xml} />
            <span style={{ 'paddingLeft': "15px" }} className='xml-validate' id='xml-body-validator' />
          </>
        )}
      </div>
    );
  } else {
    return <p className='message'>Request body not available with {method}.</p>
  }
}

function UserInterface({ setRequestState }) {
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

  // Handle request execution
  function execute_request() {
    // Get request URL
    const request_url = document.getElementById('request-url').value;

    // Prepare request details
    let request_details = {
      method: method
    }

    // Get user provided request headers
    const user_request_headers = document.getElementById('headers-input').value;
    
    // Define request headers
    let request_headers = {};

    // Check if user provided request headers
    if (user_request_headers !== "") {
      // Parse user headers and merge them into the request headers object
      const parsedHeaders = JSON.parse(user_request_headers);
      request_headers = { ...request_headers, ...parsedHeaders };
    }

    // Check if method is POST or PUT
    if (method === 'POST' || method === 'PUT') {
      if (bodyFormat === 'JSON') {
        request_details['body'] = document.getElementById('json-body').value;
        request_headers['Content-Type'] = 'application/json';

      } else if (bodyFormat === 'Form Data') {
        request_details['body'] = new FormData(document.getElementById("form-body"));
        // No need to set Content-Type for FormData

      } else {
        request_details['body'] = document.getElementById('xml-body').value;
        request_headers['Content-Type'] = 'text/xml';
      }
    }

    // Add headers to request
    request_details['headers'] = request_headers;

    console.log(request_details);

    setRequestState('loading');
    
    // Get main ui element
    const main_ui = document.getElementById('main-user-interface');

    // Disable main ui during request execution
    for (let child of main_ui.querySelectorAll('*')) {
      child.disabled = true;
    }

    // Execute http request
    fetch(request_url, request_details)
      .then(response => {
        // Store response status for further use
        const statusCode = response.status;

        // Get response text as a Promise
        return response.text().then(responseText => {
          // Extracting response headers
          const responseHeaders = Object.fromEntries(response.headers.entries());

          if (!response.ok) {
            // If response not OK, throw an error with response information
            // eslint-disable-next-line
            throw { statusCode, responseText, responseHeaders };
          }

          return { statusCode, responseText, responseHeaders };
        });
      })
      .then(({ statusCode, responseText, responseHeaders }) => {
        // Update request status for successful responses
        setRequestState({
          'status_code': statusCode,
          'content': responseText,
          'response_headers': responseHeaders,
        });
      })
      .catch(error => {
        // Update request status for errors
        setRequestState({
          'status_code': error.statusCode || 'Unknown', // Set error status or error string
          'content': error.responseText || null, // Set responseText or null
          'response_headers': error.responseHeaders || {}, // Set responseHeaders or an empty object
        });
      });

    // Enable main ui after request execution
    for (let child of main_ui.querySelectorAll('*')) {
      child.disabled = false;
    }
  }

  return(
    <div className='ui'>
      <h1>URL</h1>
      <div className='url'>
        <select id='request-method' onChange={() => setMethod(document.getElementById('request-method').value)}>
          <option>GET</option>
          <option>POST</option>
          <option>DELETE</option>
          <option>PUT</option>
        </select>
        <input placeholder='https://example.com' type='url' id='request-url' />
      </div>
      <h1>Headers</h1>
      <textarea className='headers-input' placeholder='{"key1": "value1"}' id='headers-input' onChange={check_header_json} />
      <span className='json-validate' id='json-validator' />
      <h1>Body</h1>
      <RequestBody method={method} bodyFormat={bodyFormat} setBodyFormat={setBodyFormat} />
      <button className='execute-button' onClick={() => execute_request()}>Execute</button>
    </div>
  );
}

function RequestResults({ requestState }) {

  // Scroll to request response
  useEffect(() => {
    if (requestState !== 'loading' && requestState !== 'error' && requestState !== 'hidden') {
      window.location.href = "#request-results-section";

      // Get http status code element
      const http_status_code = document.getElementById('http-status-code');

      // Color http status code
      if (requestState.status_code >= 200 && requestState.status_code <= 299) {
        http_status_code.style.color = 'green';

      } else {
        http_status_code.style.color = 'red';
      }
    }
  }, [requestState]);
  
  if (requestState === 'loading') {
    return(
      <div className='request-results'>
        <div className="lds-dual-ring" />
      </div>
    );
  } else if (requestState === 'hidden') {
    // Return nothing if request results are hidden
    return;

  } else if (requestState === 'error') {
      return(
        <div className='request-results'>
          <div className='request-error-panel'>
            <h1>Something Went Wrong!</h1>
            <span>An error accrued and we were unable to fulfill your request.</span>
          </div>
        </div>
      );
  } else {
    return(
      <div className='request-results' id='request-results-section'>
        <h1>Request Results</h1>
        <h3>Status Code: <span id='http-status-code'>{requestState.status_code}</span></h3>
        {requestState.status_code !== "Unknown" ? (
          <>
            {/*eslint-disable-next-line*/}
            <span>Don't recognize this status code? <a href={`https://www.bing.com/search?q=http+${requestState.status_code}+status+code`} target='_blank'>Look it up!</a></span>
          </>
        ) : (
          <>
            <span>Status code is not available!</span>
          </>
        )}
        <h3>Request Headers</h3>
        <p>{JSON.stringify(requestState.response_headers, null, 2)}</p>
        <h3>Request Body</h3>
        <p>{requestState.content}</p>
      </div>
    );
  }
}

function App() {
  // Store request state
  const [requestState, setRequestState] = useState('hidden');

  return (
    <div className='app' id='main-user-interface'>
      <div className='header'>
        <img src={logo} alt='logo' className='logo' />
        <h1>Simple HTTP</h1>
        <p>Simple HTTP is a web app that allows you to send http requests to any URL of your choice.</p>
      </div>
      <UserInterface setRequestState={setRequestState} />
      <RequestResults requestState={requestState} />
    </div>
  );
}

export default App;
