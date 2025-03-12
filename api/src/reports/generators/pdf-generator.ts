import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import { Report } from '../entities/report.entity';

/**
 * Generates a PDF document from report data
 * @param report The report entity with data to convert to PDF
 * @returns Buffer containing the PDF document
 */
export async function generatePdf(report: Report): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const buffers = [];
    
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdfData = Buffer.concat(buffers);
      resolve(pdfData);
    });
    
    // Add report title
    doc.fontSize(20).text(report.title, { align: 'center' });
    doc.moveDown();
    
    // Add generation date
    doc.fontSize(10).text(Generated on: , { align: 'center' });
    doc.moveDown(2);
    
    // Process different report types
    switch (report.type) {
      case 'appointment':
        generateAppointmentReportPdf(doc, report.data);
        break;
      case 'revenue':
        generateRevenueReportPdf(doc, report.data);
        break;
      case 'client':
        generateClientReportPdf(doc, report.data);
        break;
      case 'staff-performance':
        generateStaffPerformanceReportPdf(doc, report.data);
        break;
      default:
        doc.text('Report data not recognized');
    }
    
    doc.moveDown(2);
    
    // Add filters section
    if (report.filters) {
      doc.fontSize(12).text('Filters:', { underline: true });
      doc.moveDown(0.5);
      
      for (const [key, value] of Object.entries(report.filters)) {
        if (key === 'startDate' || key === 'endDate') {
          const date = new Date(value as string);
          doc.fontSize(10).text(${key}: );
        } else {
          doc.fontSize(10).text(${key}: );
        }
      }
    }
    
    doc.end();
  });
}

function generateAppointmentReportPdf(doc, data) {
  // Add summary section
  doc.fontSize(16).text('Summary', { underline: true });
  doc.moveDown(0.5);
  
  for (const [key, value] of Object.entries(data.summary)) {
    doc.fontSize(12).text(${formatKey(key)}: );
  }
  
  doc.moveDown();
  
  // Add services section
  doc.fontSize(16).text('Services', { underline: true });
  doc.moveDown(0.5);
  
  // Simple table for services
  const serviceTableTop = doc.y;
  let serviceTableY = serviceTableTop;
  
  // Table headers
  doc.fontSize(10).text('Service', 50, serviceTableY, { width: 150 });
  doc.text('Count', 200, serviceTableY, { width: 50 });
  doc.text('Percentage', 250, serviceTableY, { width: 100 });
  
  serviceTableY += 20;
  
  // Table rows
  for (const service of data.byService) {
    doc.fontSize(10).text(service.serviceName, 50, serviceTableY, { width: 150 });
    doc.text(service.count.toString(), 200, serviceTableY, { width: 50 });
    doc.text(service.percentage, 250, serviceTableY, { width: 100 });
    
    serviceTableY += 20;
  }
  
  doc.y = serviceTableY + 20;
}

function generateRevenueReportPdf(doc, data) {
  // Similar implementation for revenue report
  doc.fontSize(16).text('Revenue Summary', { underline: true });
  doc.moveDown(0.5);
  
  for (const [key, value] of Object.entries(data.summary)) {
    doc.fontSize(12).text(${formatKey(key)}: c:\taly\dir-taly\api_createContent.ps1{value.toFixed(2)});
  }
  
  doc.moveDown();
  
  // More sections would be implemented here
}

function generateClientReportPdf(doc, data) {
  // Similar implementation for client report
  doc.fontSize(16).text('Client Summary', { underline: true });
  doc.moveDown(0.5);
  
  for (const [key, value] of Object.entries(data.summary)) {
    doc.fontSize(12).text(${formatKey(key)}: );
  }
  
  doc.moveDown();
  
  // More sections would be implemented here
}

function generateStaffPerformanceReportPdf(doc, data) {
  // Similar implementation for staff performance report
  doc.fontSize(16).text('Staff Performance Summary', { underline: true });
  doc.moveDown(0.5);
  
  for (const [key, value] of Object.entries(data.summary)) {
    doc.fontSize(12).text(${formatKey(key)}: );
  }
  
  doc.moveDown();
  
  // More sections would be implemented here
}

function formatKey(key: string): string {
  return key
    .replace(/([A-Z])/g, ' ')
    .replace(/^./, (str) => str.toUpperCase())
    .replace(/([a-z])([A-Z])/g, ' ');
}
