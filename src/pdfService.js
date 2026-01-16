import http from "./httpservice";

const pdfService = {
  downloadPDF: function(appointmentId) {
    // Dynamically insert appointmentId into the API URL
    const apiURL = `https://monprova-server-b72d8846b-tanjim-rooms-projects.vercel.app//getpdf/${appointmentId}`;

    return http.get(apiURL, {
      responseType: "blob", // The response type is a blob (binary data)
      headers: {
        "Accept": "application/pdf" // Expecting a PDF in the response
      }
    });
  }
};

export default pdfService;
