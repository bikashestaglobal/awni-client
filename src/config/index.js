const hostname = window.location.hostname;

// const SERVER_URL = "http://54.201.100.185:5000/api/v1";

//
const SERVER_URL =
  hostname == "localhost"
    ? "http://localhost:5000/api/v1"
    : "http://35.92.116.43/api/v1";

// Local Server
// const SERVER_URL = "http://35.92.116.43/api/v1";

export { SERVER_URL };
