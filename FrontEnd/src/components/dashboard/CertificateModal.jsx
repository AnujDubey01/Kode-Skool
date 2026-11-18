import React from 'react';
import logo from '../../Assets/Img/logo.png';

export default function CertificateModal({ studentName = 'Student', courseName = 'Full-Stack Web & C Programming', onClose }) {
    const handlePrint = () => {
        window.print();
    };

    const certId = `KS-${Math.floor(100000 + Math.random() * 900000)}`;
    const issueDate = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    return (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl p-4 sm:p-6 max-w-4xl w-full shadow-2xl relative my-auto">
                {/* Toolbar */}
                <div className="flex justify-between items-center mb-4">
                    <button
                        type="button"
                        onClick={handlePrint}
                        className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-[#414D8E] via-[#5D74BD] to-[#169BDF] hover:opacity-95 shadow-md flex items-center gap-2 cursor-pointer transition-all"
                    >
                        <i className="fa-solid fa-print"></i>
                        <span>Print / Save as PDF</span>
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900 flex items-center justify-center transition-colors cursor-pointer"
                    >
                        <i className="fa-solid fa-xmark text-sm"></i>
                    </button>
                </div>

                {/* Printable Certificate Frame */}
                <div className="bg-[#fffdfa] border-8 sm:border-[12px] border-slate-900 rounded-lg p-2 sm:p-3 shadow-inner" id="printable-certificate">
                    <div className="border-2 border-[#c8a14e] rounded p-6 sm:p-12 text-center relative overflow-hidden bg-gradient-to-b from-white via-amber-50/20 to-[#faf8f5]">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-12 text-6xl sm:text-8xl font-black text-[#414D8E]/[0.03] pointer-events-none tracking-widest whitespace-nowrap select-none">
                            Kode-Skool
                        </div>

                        <div className="mb-6">
                            <img src={logo} alt="KodeSkool" className="w-28 sm:w-36 mx-auto mb-2.5 object-contain" />
                            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-wide uppercase">
                                Certificate of Achievement
                            </h2>
                            <p className="text-xs sm:text-sm text-slate-500 font-medium">Official Kode-Skool Coding Certification</p>
                        </div>

                        <div className="mb-8">
                            <p className="text-xs sm:text-sm text-slate-500 italic mb-2">This is proudly presented to</p>
                            <h1 className="text-2xl sm:text-4xl font-bold text-[#414D8E] mb-3 border-b-2 border-[#c8a14e] inline-block px-6 sm:px-10 pb-1.5 font-poppins">
                                {studentName}
                            </h1>
                            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed mt-2 mb-3">
                                for successfully completing all coursework, practical coding modules,
                                and passing the standardized assessment examination in
                            </p>
                            <h3 className="text-base sm:text-xl font-bold text-slate-900">{courseName}</h3>
                        </div>

                        {/* Certificate Footer */}
                        <div className="flex flex-row justify-between items-end pt-4 sm:pt-6 border-t border-amber-200/40">
                            <div className="text-center w-28 sm:w-36">
                                <div className="border-t border-slate-400 mb-1.5"></div>
                                <p className="text-xs font-semibold text-slate-800">Program Director</p>
                                <span className="text-[10px] text-slate-500">Kode-Skool Academy</span>
                            </div>

                            <div className="flex flex-col items-center gap-1">
                                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-[#c8a14e] to-[#f5d77f] flex flex-col items-center justify-center text-white shadow-md border-2 border-white">
                                    <i className="fa-solid fa-ribbon text-xs sm:text-sm"></i>
                                    <span className="text-[8px] font-bold tracking-wider">VERIFIED</span>
                                </div>
                                <p className="text-[9px] font-mono text-slate-400">ID: {certId}</p>
                            </div>

                            <div className="text-center w-28 sm:w-36">
                                <div className="border-t border-slate-400 mb-1.5"></div>
                                <p className="text-xs font-semibold text-slate-800">Date of Issue</p>
                                <span className="text-[10px] text-slate-500">{issueDate}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
