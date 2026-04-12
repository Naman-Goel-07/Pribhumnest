import React from "react";
import { Helmet } from "react-helmet-async";
import { FaHandshake, FaHome, FaUserFriends, FaShieldAlt, FaMoneyBillWave } from "react-icons/fa";

const About = () => {
  return (
    <>
    <Helmet>
      <title>About us | Pribhumnest</title>
      <link rel="canonical" href="https://pribhumnest.in/about" />
      <meta 
      name="description"
          content="Pribhumnest provides secure and easy PG management. Property owners can add, update, and manage PGs, while tenants can browse verified listings effortlessly."/>
    </Helmet>
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-blue-50 px-6 py-16 text-gray-800">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Title Section */}
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-teal-700 mb-4">
            About <span className="text-green-600">Pribhum Nest</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A student-first platform to simplify your PG journey in Delhi & beyond.
          </p>
        </div>

        {/* Our Story */}
        <div className="bg-white rounded-3xl shadow-xl p-10">
          <h2 className="text-3xl font-bold text-teal-700 mb-6 flex items-center gap-2">
            🧡 Our Story – How It All Began
          </h2>
          <p className="text-lg leading-relaxed mb-4 italic">
            “We didn’t just build a platform — we built a solution we once needed.”
          </p>
          <p className="text-lg leading-relaxed mb-6">
            I’m <strong>Prince Kanojia</strong>, a student of Dyal Singh College, Delhi University.  
            And I’m <strong>Bhumika Joshi</strong>, a student from Haryana, who came to Delhi to pursue coding classes.  
          </p>
          <p className="text-lg leading-relaxed mb-6">
            When Bhumika first arrived in Delhi, finding a PG felt like the toughest part of settling in.  
            From poor food to unsafe localities and mismatched roommates — every day was a new challenge.  
          </p>
          <div className="bg-teal-50 border-l-4 border-teal-400 px-6 py-4 rounded-lg mb-6">
            <p className="text-lg leading-relaxed">
              She finally shifted to a flat… but it came with:  
              <span className="block">💸 High brokerage fees</span>
              <span className="block">🚚 Shifting expenses</span>
              <span className="block">🔄 Constantly changing flats</span>
            </p>
          </div>
          <p className="text-lg leading-relaxed">
            That’s when we realized — if <strong>we</strong> as connected students faced this much hassle,  
            what about others?  
          </p>
          <p className="text-lg leading-relaxed mt-4 font-semibold text-teal-700">
            That’s how <strong>Pribhum Nest</strong> was born: A platform built by students, for students —  
            to make living in Delhi easier, safer, and more homely.
          </p>
        </div>

        {/* Who We Are */}
        <div className="bg-gradient-to-r from-teal-600 to-green-500 text-white rounded-3xl shadow-xl p-10">
          <h2 className="text-3xl font-bold mb-6">🏠 Who We Are</h2>
          <p className="text-lg leading-relaxed mb-4">
            Pribhum Nest is a <strong>student-first platform</strong> designed to make PG finding easier, safer, and more personalized for All University students.
          </p>
          <p className="text-lg leading-relaxed">
            We stand for <strong>comfort, community, and clarity</strong>.  
            Our aim is to build a space where students feel at home — even miles away from home.
          </p>
        </div>

        {/* Mission */}
        <div className="bg-white rounded-3xl shadow-xl p-10">
          <h2 className="text-3xl font-bold text-teal-700 mb-6">🎯 Our Mission</h2>
          <ul className="space-y-3 text-lg list-disc list-inside text-gray-700">
            <li>Help students settle in Delhi with the right people, in the right place, at the right price.</li>
            <li>Build a stress-free living environment.</li>
            <li>Match students with PGs based on <strong>college, comfort & culture</strong>.</li>
            <li>Ensure <strong>verified & transparent</strong> PG listings.</li>
            <li>Empower students to rate & review their PGs — making life easier for the next student.</li>
          </ul>
        </div>

        {/* Why Choose Us */}
        <div className="bg-gradient-to-br from-yellow-50 to-orange-100 rounded-3xl shadow-xl p-10">
          <h2 className="text-3xl font-bold text-orange-600 mb-6">💙 Why Choose Us?</h2>
          <div className="grid md:grid-cols-2 gap-6 text-lg">
            <div className="flex items-start gap-3">
              <FaUserFriends className="text-orange-500 text-2xl mt-1" />
              <p><strong>Match with same-college students</strong></p>
            </div>
            <div className="flex items-start gap-3">
              <FaHome className="text-orange-500 text-2xl mt-1" />
              <p><strong>Verified PGs</strong> with transparent rent & food details</p>
            </div>
            <div className="flex items-start gap-3">
              <FaHandshake className="text-orange-500 text-2xl mt-1" />
              <p><strong>No brokers, no hidden fees</strong></p>
            </div>
            <div className="flex items-start gap-3">
              <FaMoneyBillWave className="text-orange-500 text-2xl mt-1" />
              <p><strong>Value for money</strong> – affordable, clean, and reliable PGs</p>
            </div>
            <div className="flex items-start gap-3">
              <FaShieldAlt className="text-orange-500 text-2xl mt-1" />
              <p><strong>Safe & supportive</strong> environment</p>
            </div>
          </div>
        </div>

        {/* Closing */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-teal-700">
            🤝 Not Just PGs, We Build Relationships
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Share your space. Share your journey. Build your college squad from Day 1.  
          </p>
          <p className="mt-6 text-gray-500">
            📍 Delhi NCR | 📧 <a href="mailto:support@Pribhumnest.in" className="text-teal-600 font-medium">support@Pribhumnest.in</a>
          </p>
        </div>
      </div>
    </div>
    </>
    
  );
};

export default About;
