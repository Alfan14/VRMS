"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Button from "../button/Button"; 
import { Printer, FileText, Download, Loader2, X } from "lucide-react";
import { PDFViewer, Document, Page, Text, View, StyleSheet, PDFDownloadLink, Image } from "@react-pdf/renderer";
import * as XLSX from 'xlsx';

// Definisi Style untuk PDF
const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: 'Helvetica' },
  header: { 
    borderBottom: 2, 
    borderColor: '#000', 
    marginBottom: 20, 
    paddingBottom: 10, 
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'space-between' 
  },
  logo: { width: 50, height: 50 }, 
  headerText: { flex: 1, textAlign: 'center' },
  headerTitle: { fontSize: 16, fontWeight: 'bold', textTransform: 'uppercase' },
  headerSubtitle: { fontSize: 8, marginTop: 2, color: '#374151' },
  
  reportTitle: { fontSize: 12, fontWeight: 'bold', textAlign: 'center', marginBottom: 5, textDecoration: 'underline' },
  reportDate: { fontSize: 8, textAlign: 'center', marginBottom: 15, color: '#6b7280' },

  table: { display: 'flex', width: 'auto', borderStyle: 'solid', borderWidth: 1, borderRightWidth: 0, borderBottomWidth: 0 },
  tableRow: { flexDirection: 'row' },
  // FIX: Menggunakan flex: 1 agar kolom memenuhi lebar halaman secara merata
  tableColHeader: { flex: 1, borderStyle: 'solid', borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0, backgroundColor: '#f3f4f6', padding: 6 },
  tableCol: { flex: 1, borderStyle: 'solid', borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0, padding: 6 },
  tableCellHeader: { fontWeight: 'bold', fontSize: 9 },
  tableCell: { fontSize: 9 },

  signatureSection: { marginTop: 40, flexDirection: 'row', justifyContent: 'space-between' },
  signatureBox: { width: '40%', textAlign: 'center' },
  sigLine: { borderTop: 1, borderColor: '#000', marginTop: 45, paddingTop: 5 }
});

interface PrintExportModalProps {
  triggerButton?: React.ReactNode;
  title: string;
  data: any[]; 
  columns: { header: string; accessor: string }[];
}

export const PrintExportModal = ({ triggerButton, title, data, columns }: PrintExportModalProps) => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [format, setFormat] = useState<"PDF" | "Excel" | null>(null);
  const [mounted, setMounted] = useState(false);

  const [sigData, setSigData] = useState({
    signerName: "", 
    signerPosition: "Kasir", 
    location: "Jakarta", 
    date: new Date().toISOString().split('T')[0]
  });

  // Untuk menghindari error hydration di Next.js/Vite
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDownloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data.map(item => {
      let row: any = {};
      columns.forEach(col => row[col.header] = item[col.accessor]);
      return row;
    }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Laporan");
    XLSX.writeFile(wb, `Laporan_${title}_${new Date().toLocaleDateString()}.xlsx`);
    closeModal();
  };

  const closeModal = () => {
    setOpen(false);
    setTimeout(() => {
      setStep(1);
      setFormat(null);
    }, 200);
  };

  const handleNext = () => {
    if (format === "Excel" && step === 1) {
      handleDownloadExcel();
    } else {
      setStep(step + 1);
    }
  };

  // Komponen Dokumen PDF
  const MyDocument = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>MART MODERN SUPERMARKET</Text>
            <Text style={styles.headerSubtitle}>Sistem Point of Sale (POS) - Laporan Operasional</Text>
            <Text style={styles.headerSubtitle}>Jl. Niaga Utama No. 88, Jakarta | Telp: (021) 555-0123</Text>
          </View>
        </View>

        <Text style={styles.reportTitle}>LAPORAN DATA: {title.toUpperCase()}</Text>
        <Text style={styles.reportDate}>Dicetak pada: {new Date().toLocaleString('id-ID')}</Text>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            {columns.map(col => (
              <View key={col.header} style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>{col.header}</Text>
              </View>
            ))}
          </View>
          {data.map((row, i) => (
            <View style={styles.tableRow} key={i}>
              {columns.map(col => (
                <View key={col.header} style={styles.tableCol}>
                  <Text style={styles.tableCell}>{row[col.accessor] || '-'}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>

        <View style={styles.signatureSection}>
          <View style={styles.signatureBox}>
            <Text>Dibuat Oleh,</Text>
            <View style={styles.sigLine}>
              <Text>{sigData.signerName || "..................."}</Text>
            </View>
            <Text>{sigData.signerPosition}</Text>
          </View>
          <View style={styles.signatureBox}>
            <Text>{sigData.location}, {new Date(sigData.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</Text>
            <Text>Mengetahui,</Text>
            <View style={styles.sigLine}>
              <Text>...................</Text>
            </View>
            <Text>Manager Operasional</Text>
          </View>
        </View>
      </Page>
    </Document>
  );

  return (
    <>
      <div onClick={() => setOpen(true)} className="inline-block">
        {triggerButton || (
          <Button variant="outline" size="sm">
            <Printer className="mr-2 h-4 w-4 inline" /> Cetak Laporan
          </Button>
        )}
      </div>

      {/* PORTAL: Memastikan modal muncul di paling depan body */}
      {open && mounted && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl dark:bg-gray-900 border border-gray-200 dark:border-white/10 flex flex-col max-h-[95vh]">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-white/5">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {step === 1 && "Pilih Format Export"}
                  {step === 2 && "Konfigurasi Laporan"}
                  {step === 3 && "Preview Dokumen"}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">Langkah {step} dari 3</p>
              </div>
              <button onClick={closeModal} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
              {step === 1 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button 
                    className={`p-6 flex flex-col items-center justify-center rounded-2xl border-2 transition-all group ${format === "PDF" ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10" : "border-gray-100 dark:border-gray-800 hover:border-gray-200"}`}
                    onClick={() => setFormat("PDF")}
                  >
                    <div className={`p-4 rounded-full mb-3 ${format === "PDF" ? "bg-blue-500 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-500 group-hover:text-blue-500"}`}>
                      <Printer size={32} />
                    </div>
                    <span className={`font-bold ${format === "PDF" ? "text-blue-700 dark:text-blue-400" : "text-gray-700 dark:text-gray-300"}`}>Dokumen PDF</span>
                    <p className="text-xs text-center text-gray-500 mt-2">Cocok untuk cetak fisik & arsip resmi</p>
                  </button>

                  <button 
                    className={`p-6 flex flex-col items-center justify-center rounded-2xl border-2 transition-all group ${format === "Excel" ? "border-green-500 bg-green-50 dark:bg-green-500/10" : "border-gray-100 dark:border-gray-800 hover:border-gray-200"}`}
                    onClick={() => setFormat("Excel")}
                  >
                    <div className={`p-4 rounded-full mb-3 ${format === "Excel" ? "bg-green-500 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-500 group-hover:text-green-500"}`}>
                      <FileText size={32} />
                    </div>
                    <span className={`font-bold ${format === "Excel" ? "text-green-700 dark:text-green-400" : "text-gray-700 dark:text-gray-300"}`}>Spreadsheet Excel</span>
                    <p className="text-xs text-center text-gray-500 mt-2">Mudah untuk pengolahan data lanjut</p>
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase ml-1">Nama Petugas</label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
                        value={sigData.signerName} 
                        onChange={e => setSigData({...sigData, signerName: e.target.value})} 
                        placeholder="Contoh: Musharof" 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase ml-1">Jabatan</label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
                        value={sigData.signerPosition} 
                        onChange={e => setSigData({...sigData, signerPosition: e.target.value})} 
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase ml-1">Lokasi</label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
                        value={sigData.location} 
                        onChange={e => setSigData({...sigData, location: e.target.value})} 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase ml-1">Tanggal Laporan</label>
                      <input 
                        type="date" 
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
                        value={sigData.date} 
                        onChange={e => setSigData({...sigData, date: e.target.value})} 
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="h-[60vh] min-h-[400px] border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-inner bg-gray-100">
                  <PDFViewer width="100%" height="100%" className="border-none">
                    <MyDocument />
                  </PDFViewer>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-gray-100 dark:border-white/5 flex items-center justify-end gap-3">
              {step > 1 && (
                <Button variant="outline" onClick={() => setStep(step - 1)}>
                  Kembali
                </Button>
              )}
              
              {step === 1 && (
                <Button variant="primary" onClick={handleNext} disabled={!format}>
                  Lanjutkan
                </Button>
              )}

              {step === 2 && (
                <Button variant="primary" onClick={handleNext}>
                  Lihat Preview
                </Button>
              )}

              {step === 3 && (
                <PDFDownloadLink document={<MyDocument />} fileName={`Report_${title}_${sigData.date}.pdf`}>
                  {({ loading }) => (
                    <Button variant="primary" disabled={loading}>
                      {loading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Download className="mr-2 h-4 w-4" />
                      )}
                      Unduh PDF
                    </Button>
                  )}
                </PDFDownloadLink>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};