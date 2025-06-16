export default function Services() {
  return (
    <>
      <div className="bg-gray-950 h-[2rem]">{""}</div>
      <section
        id="programs"
        className="py-20 px-4 bg-background"
        style={{ backgroundImage: "url('/abstract1.png')" }}
      >
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-12 text-white">
            Programs & Pricing
          </h2>

          {/* Responsive Cards Layout */}
          <div className="flex flex-col md:flex-row flex-wrap gap-8 justify-center mb-16">
            {/* Non-Members */}
            <div className="relative p-6 rounded-xl text-white bg-black border border-red-500 shadow-[0_0_10px_2px_rgba(255,0,0,0.8)] before:content-[''] before:absolute before:inset-0 before:rounded-xl before:border before:border-red-500/50 before:pointer-events-none before:blur-sm w-full md:w-[30%] transition-transform duration-300 transform hover:scale-105
">
              <h3 className="text-xl text-white mb-4">Regular Rates (Non-Members)</h3>
              <ul className="text-white text-left space-y-2">
                <li className="flex justify-between"><span>• Daily Session</span><span>₱ 80.00</span></li>
                <li className="flex justify-between"><span>○ Senior/Student</span><span>₱ 70.00</span></li>
                <li className="flex justify-between"><span>• Half Month</span><span>₱ 400.00</span></li>
                <li className="flex justify-between"><span>• Monthly</span><span>₱ 800.00</span></li>
                <li className="flex justify-between"><span>○ Senior/Student</span><span>₱ 700.00</span></li>
              </ul>
            </div>

            {/* Members */}
            <div className="relative p-6 rounded-xl text-white bg-black border border-gray-400 shadow-[0_0_10px_2px_rgba(160,160,160,0.6)] before:content-[''] before:absolute before:inset-0 before:rounded-xl before:border before:border-gray-400/50 before:pointer-events-none before:blur-sm w-full md:w-[30%] transition-transform duration-300 transform hover:scale-105
">
              <h3 className="text-xl text-white mb-4">Regular Rates (Members)</h3>
              <ul className="text-white text-left space-y-2">
                <li className="flex justify-between"><span>• Daily Session</span><span>₱ 70.00</span></li>
                <li className="flex justify-between"><span>○ Senior/Student</span><span>₱ 60.00</span></li>
                <li className="flex justify-between"><span>• Half Month</span><span>₱ 350.00</span></li>
                <li className="flex justify-between"><span>• Monthly</span><span>₱ 700.00</span></li>
                <li className="flex justify-between"><span>○ Senior/Student</span><span>₱ 650.00</span></li>
              </ul>
            </div>

            {/* Training Sessions */}
            <div className="relative p-6 rounded-xl text-white bg-black border border-[#00bfff] shadow-[0_0_12px_2px_rgba(0,191,255,0.7)] before:content-[''] before:absolute before:inset-0 before:rounded-xl before:border before:border-[#00bfff]/40 before:pointer-events-none before:blur-sm w-full md:w-[30%] transition-transform duration-300 transform hover:scale-105
">
              <h3 className="text-2xl text-white mb-6">Training Sessions</h3>
              <div className="space-y-6 text-left text-white">
                <div>
                  <p className="font-medium flex justify-between">
                    <span>• 1-on-1 Training (12 Sessions)</span>
                    <span>₱3,000.00</span>
                  </p>
                  <ul className="list-disc ml-6 text-sm">
                    <li>2-hour session with Personal Trainer</li>
                    <li>Customized Workout Plan</li>
                    <li>Meal Plan</li>
                    <li>Calorie Tracker</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium flex justify-between">
                    <span>• Walk-in Training</span>
                    <span>₱150.00</span>
                  </p>
                  <ul className="list-disc ml-6 text-sm">
                    <li>2-hour session with Personal Trainer</li>
                    <li>Targeted Workout Plan</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Membership Fee */}
        <div className="relative mx-auto w-full md:w-[50%] mt-8 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 border border-gray-600 rounded-xl p-6 shadow-[0_0_20px_rgba(255,255,255,0.1)] overflow-hidden transition-transform duration-300 transform hover:scale-105 group">
  {/* Shine overlay */}
  <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
    <div className="absolute inset-y-0 left-[-100%] w-[200%] bg-gradient-to-r from-transparent via-white/30 to-transparent transform skew-x-[-20deg] transition-all duration-700 ease-in-out group-hover:left-[100%]" />
  </div>

  <h3 className="text-xl text-white font-semibold mb-2">One-Time Membership Fee</h3>
  <p className="text-3xl font-bold text-red-400 mb-2">₱ 200.00</p>
  <p className="text-gray-300 text-sm italic">
    Lifetime access to discounted member rates. <br className="lg:hidden" />
    Non-refundable (admin coverage).
  </p>
</div>
        </div>
      </section>
    </>
  );
}
