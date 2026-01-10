import http from "./httpservice";

const pdfService = {
  downloadPDF: function(appointmentId) {
    // Dynamically insert appointmentId into the API URL
    const apiURL = `http://localhost:8000/api/pdf/getpdf/${appointmentId}`;

    return http.get(apiURL, {
      responseType: "blob", // The response type is a blob (binary data)
      headers: {
        "Accept": "application/pdf" // Expecting a PDF in the response
      }
    });
  }
};

export default pdfService;
