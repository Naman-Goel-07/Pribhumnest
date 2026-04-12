import { Helmet } from "react-helmet-async";

function Services() {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <Helmet>
        <title>Our Services | Pribhumnest</title>
        <link rel="canonical" href="https://pribhumnest.in/services" />
        <meta
          name="description"
          content="Pribhumnest provides secure and easy PG management. Property owners can add, update, and manage PGs, while tenants can browse verified listings effortlessly with facilities for boys, coliving, small lock-in period, and no brokerage."
        />
      </Helmet>

      <section className="text-center py-16 bg-gradient-to-r from-teal-600 via-green-600 to-emerald-600 text-white shadow-lg">
        <h1 className="text-5xl font-extrabold drop-shadow-md">Our Services</h1>
        <p className="text-lg mt-4 max-w-2xl mx-auto opacity-90">
          Simplifying PG management for property owners and making PG discovery seamless for tenants.
        </p>
      </section>

      <div className="p-10 max-w-6xl mx-auto">
        {/* Services for Owners */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-10 text-center text-gray-800">
            🚀 Services for Property Owners
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition">
              <h3 className="text-xl font-semibold text-teal-600">🏠 Add PG Listings</h3>
              <p className="text-gray-600 mt-3">
                Showcase your PG properties with details like rent, facilities, and location.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition">
              <h3 className="text-xl font-semibold text-green-600">✏️ Update & Manage PGs</h3>
              <p className="text-gray-600 mt-3">
                Edit property details anytime to keep your listings updated and accurate.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition">
              <h3 className="text-xl font-semibold text-emerald-600">❌ Delete PGs</h3>
              <p className="text-gray-600 mt-3">
                Instantly remove PGs that are no longer available with one click.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition md:col-span-2 lg:col-span-1">
              <h3 className="text-xl font-semibold text-lime-600">🔑 Secure Authentication</h3>
              <p className="text-gray-600 mt-3">
                Protect your listings and data with secure login and account access.
              </p>
            </div>
          </div>
        </section>

        {/* Services for Tenants */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-10 text-center text-gray-800">
            🌟 Services for Tenants
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition">
              <h3 className="text-xl font-semibold text-teal-700">🔍 Browse PG Listings</h3>
              <p className="text-gray-600 mt-3">
                Explore verified PGs with full details before making your decision.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition">
              <h3 className="text-xl font-semibold text-green-700">✅ Verified Listings</h3>
              <p className="text-gray-600 mt-3">
                Access trusted PG listings for a safe and hassle-free experience.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition">
              <h3 className="text-xl font-semibold text-indigo-600">👦 Facilities for Boys </h3>
              <p className="text-gray-600 mt-3">
                Special facilities and PG options tailored for boys’ comfort and lifestyle.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition">
              <h3 className="text-xl font-semibold text-purple-600">🤝 Co-Living Spaces</h3>
              <p className="text-gray-600 mt-3">
                Enjoy community living with shared spaces, networking, and modern amenities.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition">
              <h3 className="text-xl font-semibold text-pink-600">🚚 Easy Shifting</h3>
              <p className="text-gray-600 mt-3">
                Hassle-free shifting between PGs with quick support and minimal downtime.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition">
              <h3 className="text-xl font-semibold text-red-600">📅 Small Lock-in Period</h3>
              <p className="text-gray-600 mt-3">
                Flexible stay options with short lock-in periods, perfect for students and professionals.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition md:col-span-2 lg:col-span-1">
              <h3 className="text-xl font-semibold text-yellow-600">💸 No Brokerage</h3>
              <p className="text-gray-600 mt-3">
                Book your PG directly with owners through Pribhumnest and save brokerage fees.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Services;
