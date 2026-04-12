import React from "react";
import { FileText, Home, UserCheck, AlertTriangle } from "lucide-react";

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 py-12 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-8 md:p-12">
        {/* Header */}
        <h1 className="text-3xl md:text-4xl font-bold text-center text-purple-700 mb-8 flex items-center justify-center gap-2">
          <FileText className="w-8 h-8 text-purple-600" />
          Terms & Conditions
        </h1>
        <p className="text-center text-gray-600 mb-10">
          📜 Please read these Terms & Conditions carefully.  
          By using <span className="font-semibold">Pribhum Nest</span>, you agree to follow these rules.
        </p>

        {/* Sections */}
        <div className="space-y-8">
          {/* Platform Use */}
          <section className="bg-gradient-to-r from-indigo-100 to-indigo-50 p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-indigo-700 flex items-center gap-2 mb-3">
              <Home className="w-6 h-6 text-indigo-600" />
              1. Platform Use
            </h2>
            <p className="text-gray-700">
              Pribhum Nest is a student-focused platform that connects students with PG owners.  
              We help with verified listings and smoother communication, but we are{" "}
              <span className="font-semibold">not responsible</span> for rental agreements or legal disputes between parties.
            </p>
          </section>

          {/* Listing Accuracy */}
          <section className="bg-gradient-to-r from-purple-100 to-purple-50 p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-purple-700 flex items-center gap-2 mb-3">
              <AlertTriangle className="w-6 h-6 text-purple-600" />
              2. Listing Accuracy
            </h2>
            <p className="text-gray-700">
              PG owners are responsible for providing{" "}
              <span className="font-semibold">accurate and updated information</span> such as rent, meals, photos, and facilities.  
              Any misleading listings may be removed without prior notice.
            </p>
          </section>

          {/* Student Responsibility */}
          <section className="bg-gradient-to-r from-pink-100 to-pink-50 p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-pink-700 flex items-center gap-2 mb-3">
              <UserCheck className="w-6 h-6 text-pink-600" />
              3. Student Responsibility
            </h2>
            <p className="text-gray-700">
              Students are advised to{" "}
              <span className="font-semibold">personally visit and verify</span> the PG property before making any payments.  
              Pribhum Nest provides filtered and verified listings, but the{" "}
              <span className="font-semibold">final decision</span> lies with the user.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            📅 Last Updated: August 2025 <br />
            © {new Date().getFullYear()} Pribhum Nest. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
