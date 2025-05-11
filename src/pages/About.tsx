import React from 'react';
import { Award, Users, Clock } from 'lucide-react';

function About() {
  return (
    <div className="bg-gradient-to-b from-teal-50 to-white">
      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Meet Our Expert
              <span className="text-teal-600"> Practitioner</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              With over 15 years of experience in homeopathic medicine, we're dedicated to providing 
              natural and effective healthcare solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute -top-10 -left-10 w-48 h-48 bg-teal-200 rounded-full opacity-20"></div>
              <img 
                src="https://res.cloudinary.com/dmhqod2t0/image/upload/v1744967256/PHOTO-2025-04-15-11-25-39_rw0te6.jpg"
                alt="Dr. Bandarupalli Ekaveera"
                className="relative z-10 rounded-full shadow-xl"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Dr. Bandarupalli Ekaveera</h2>
              <p className="text-gray-600 mb-6">
                Dr. Bandarupalli Ekaveera is a certified homeopathic practitioner with extensive experience in treating 
                Homepathy. Her approach combines traditional homeopathic principles 
                with modern medical knowledge.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Award className="h-6 w-6 text-teal-600 mr-3" />
                  <span>Bachelor of Homeopathic Medicine and Surgery</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-6 w-6 text-teal-600 mr-3" />
                  <span>Over 1,000 patients treated successfully</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-6 w-6 text-teal-600 mr-3" />
                  <span>5+ years of clinical experience</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { number: "15+", label: "Years Experience" },
              { number: "5,000+", label: "Patients Treated" },
              { number: "98%", label: "Patient Satisfaction" }
            ].map((stat, index) => (
              <div key={index} className="bg-teal-50 p-8 rounded-lg">
                <div className="text-4xl font-bold text-teal-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Our Mission</h2>
            <p className="text-gray-600 text-center max-w-3xl mx-auto">
              We are committed to providing personalized, natural healthcare solutions that address 
              the root cause of illness rather than just treating symptoms. Our goal is to help 
              our patients achieve optimal health through gentle, effective homeopathic treatments 
              and lifestyle guidance.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;