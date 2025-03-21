import { jsPDF } from 'jspdf';

export function generateNoticePDF(notice) {
  const doc = new jsPDF();
  
  // Set up fonts and styling
  doc.setFontSize(20);
  doc.text(notice.title, 20, 20);
  
  doc.setFontSize(12);
  doc.text(`Location: ${notice.location}`, 20, 35);
  
  doc.text(`Start Date: ${formatDate(notice.startingDate)}`, 20, 45);
  doc.text(`End Date: ${formatDate(notice.endingDate)}`, 20, 55);
  
  // Add description with word wrap
  doc.setFontSize(12);
  const splitDescription = doc.splitTextToSize(notice.description, 170);
  doc.text(splitDescription, 20, 70);
  
  // Save the PDF
  doc.save(`notice-${notice._id}.pdf`);
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}