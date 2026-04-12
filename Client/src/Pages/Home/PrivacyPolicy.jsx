import { ShieldCheck, Lock, Trash2, Cookie, User } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-8 md:p-12">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-indigo-600 mb-8 flex items-center justify-center gap-2">
          <ShieldCheck className="w-8 h-8 text-indigo-500" />
          Privacy Policy
        </h1>
        <p className="text-center text-gray-600 mb-10">
          🔐 Your privacy matters to us at <span className="font-semibold">Pribhum Nest</span>.  
          Here’s how we handle your data with care and transparency.
        </p>

        <div className="space-y-8">
          <section className="bg-gradient-to-r from-indigo-100 to-indigo-50 p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-indigo-700 flex items-center gap-2 mb-3">
              <User className="w-6 h-6 text-indigo-500" />
              1. What We Collect
            </h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>Student name, email, phone, college name</li>
              <li>PG owner name, contact details, property information</li>
              <li>Information required to match PGs with the right students</li>
            </ul>
          </section>

          <section className="bg-gradient-to-r from-purple-100 to-purple-50 p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-purple-700 mb-3">2. Why We Collect It</h2>
            <p className="text-gray-700">
              To provide personalized listings, ensure transparency, and support smooth 
              communication between students and PG providers.
            </p>
          </section>

          <section className="bg-gradient-to-r from-pink-100 to-pink-50 p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-pink-700 mb-3">3. Data Sharing</h2>
            <p className="text-gray-700">
              We <span className="font-semibold">do not sell</span> or share your personal data with third parties.
            </p>
          </section>

          <section className="bg-gradient-to-r from-green-100 to-green-50 p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-green-700 flex items-center gap-2 mb-3">
              <Lock className="w-6 h-6 text-green-600" />
              4. Data Security
            </h2>
            <p className="text-gray-700">
              All user data is stored securely and protected using encryption and strict security protocols.
            </p>
          </section>

          <section className="bg-gradient-to-r from-yellow-100 to-yellow-50 p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-yellow-700 flex items-center gap-2 mb-3">
              <Trash2 className="w-6 h-6 text-yellow-600" />
              5. Requesting Deletion
            </h2>
            <p className="text-gray-700">
              Users may contact us to have their data removed. We process such requests within{" "}
              <span className="font-semibold">7 working days</span>.
            </p>
          </section>

          <section className="bg-gradient-to-r from-orange-100 to-orange-50 p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-orange-700 flex items-center gap-2 mb-3">
              <Cookie className="w-6 h-6 text-orange-600" />
              6. Cookies
            </h2>
            <p className="text-gray-700">
              We use minimal cookies to improve your website experience. No sensitive or personally 
              identifiable tracking is done.
            </p>
          </section>
        </div>

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

export default PrivacyPolicy;
