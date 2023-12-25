import { useEffect, useState, useRef } from 'react';
import './App.css';
import './spinners.css';
import logo from './assets/logo.png';

function RequestBody({ method, bodyFormat, setBodyFormat, formBody, jsonBody }) {
  const jsonBodyButton = useRef();
  const formBodyButton = useRef();
  const jsonBodyValidator = useRef();
  const formEntryValue = useRef();

  // Hold form data entries
  const [formDataEntries, setFormDataEntries] = useState([]);

  // Set active button based on body format
  useEffect(() => {
    // Check if method is POST
    if (method === "POST" || method === "PUT") {
      if (bodyFormat === 'JSON') {
        jsonBodyButton.current.style.borderColor = 'white';
        formBodyButton.current.style.borderColor = 'transparent';

      } else if (bodyFormat === 'Form Data') {
        jsonBodyButton.current.style.borderColor = 'transparent';
        formBodyButton.current.style.borderColor = 'white';
      }
    }
  }, [bodyFormat, method]);

  // Check if body json is valid
  function check_body_json() {
    // Get json from input
    const json_string = jsonBody.current.value;

    // Check if any data exists
    if (json_string === "") {
      jsonBodyValidator.current.innerHTML = "";
      return;
    }

    // Parse json to validate it
    try {
      JSON.parse(json_string);

      // Update json validator
      jsonBodyValidator.current.innerHTML = "JSON is valid!";
      jsonBodyValidator.current.style.color = "green";

    } catch {

      // Update json validator
      jsonBodyValidator.current.innerHTML = "JSON not is valid!";
      jsonBodyValidator.current.style.color = "red";
    }
  }

  // Handle adding new form entries to request body
  function add_form_entry() {
    // Get entry name
    const entry_name = formEntryValue.current.value;

    // Add new form entry
    setFormDataEntries([...formDataEntries, entry_name]);

    // Clear entry box
    formEntryValue.current.value = "";
  }

  // Check if method is POST
  if (method === "POST" || method === "PUT") {
    return(
      <div className='request-body'>
        <ul className='format-options'>
          <li onClick={() => setBodyFormat('JSON')} ref={jsonBodyButton}>JSON</li>
          <li onClick={() => setBodyFormat('Form Data')} ref={formBodyButton}>Form Data</li>
        </ul>
        {bodyFormat === "JSON" ? (
          <>
            <textarea ref={jsonBody} placeholder='{"key2": "value2"}' className='json-body-entry' onChange={check_body_json} />
            <span style={{'paddingLeft': "15px"}} className='json-validate' ref={jsonBodyValidator} />
          </>
        ) : (
          <>
            <form ref={formBody} className='form-body-entry'>
              {formDataEntries.map((entry, index) => (
                <div className='form-data-entry' key={index}>
                  <span>{entry}</span>
                  <input type='text' name={entry} />
                  <button onClick={() => setFormDataEntries(formDataEntries.filter(e => e !== entry))} type='button'> x </button>
                </div>
              ))}
            </form>
            <div className='add-form-entry'>
              <input ref={formEntryValue} placeholder='example123' />
              <button onClick={() => add_form_entry()}> Add +</button>
            </div>
          </>
        )}
      </div>
    );
  } else {
    return <p className='message'>Request body not available with {method}.</p>
  }
}

function UserInterface({ setRequestState }) {
  const jsonValidator = useRef();
  const headersInput = useRef();
  const requestURL = useRef();
  const requestMethod = useRef();
  const formBody = useRef();
  const jsonBody = useRef();

  // Hold the method for the request
  const [method, setMethod] = useState('GET');

  // Hold formatting type for request body
  const [bodyFormat, setBodyFormat] = useState('JSON');

  // Check if header json is valid
  function check_header_json() {
    // Get json from input
    const json_string = headersInput.current.value;

    // Check if any data exists
    if (json_string === "") {
      jsonValidator.current.innerHTML = "";
      return;
    }

    // Parse json to validate it
    try {
      JSON.parse(json_string);

      // Update json validator
      jsonValidator.current.innerHTML = "JSON is valid!";
      jsonValidator.current.style.color = "green";

    } catch {
      // Update json validator
      jsonValidator.current.innerHTML = "JSON not is valid!";
      jsonValidator.current.style.color = "red";
    }
  }

  // Handle request execution
  function execute_request() {
    // Prepare request details
    let request_details = {
      method: method
    }

    // Get request headers
    const request_headers = headersInput.current.value;

    // Check if headers has a value
    if (request_headers !== "") {
      request_details['headers'] = JSON.parse(request_headers);
    }
    
    // Check if method is POST
    if (method === 'POST' || method === 'PUT') {
      // Check body format
      if (bodyFormat === 'JSON') {
        request_details['body'] = jsonBody.current.value;
      } else {
        request_details['body'] = new FormData(formBody.current);
      }
    }

    setRequestState('loading');

    // Execute http request
    fetch(requestURL.current.value, request_details)
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
  }

  return(
    <div className='ui'>
      <h1>URL</h1>
      <div className='url'>
        <select ref={requestMethod} onChange={() => setMethod(requestMethod.current.value)}>
          <option>GET</option>
          <option>POST</option>
          <option>DELETE</option>
          <option>PUT</option>
        </select>
        <input placeholder='https://example.com' type='url' ref={requestURL} />
      </div>
      <h1>Headers</h1>
      <textarea className='headers-input' placeholder='{"key1": "value1"}' ref={headersInput} onChange={check_header_json} />
      <span className='json-validate' ref={jsonValidator} />
      <h1>Body</h1>
      <RequestBody method={method} bodyFormat={bodyFormat} setBodyFormat={setBodyFormat} formBody={formBody} jsonBody={jsonBody} />
      <button className='execute-button' onClick={() => execute_request()}>Execute</button>
    </div>
  );
}

function RequestResults({ requestState }) {
  const requestResultsSection = useRef();
  const httpStatusCode = useRef();

  // Scroll to request response
  useEffect(() => {
    if (requestResultsSection.current) {
      requestResultsSection.current.scrollIntoView({behavior: 'smooth'});
    }
  }, [requestState])
  
  // Color http status code
  useEffect(() => {
    if (httpStatusCode.current) {

      if (requestState.status_code >= 200 && requestState.status_code <= 299) {
        httpStatusCode.current.style.color = 'green';

      } else {
        httpStatusCode.current.style.color = 'red';
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
      <div className='request-results' ref={requestResultsSection}>
        <h1>Request Results</h1>
        <h3>Status Code: <span ref={httpStatusCode}>{requestState.status_code}</span></h3>
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
    <div className='app'>
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
