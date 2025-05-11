import * as React from 'react';
import { useState } from 'react';
import axios from 'axios';
import Success  from '../components/success';
import { ChevronRight, Calendar, Clock } from 'lucide-react';
import Failure  from '../components/failure';

function AdminForm() {
    const [medicalConcern, setmedicalConcern] = useState([""]);
  const [name, setname] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [phno, setphno] = useState("");
  const [address, setAddress] = useState("");
  const [sex, setSex] = useState("");
  const [submittedData, setSubmittedData] = useState<any>(null);
  const [alertComponent, setAlertComponent] = useState<JSX.Element | null>(null);

  const addConcern = () => {
    setmedicalConcern([...medicalConcern, ""]);
  };

  const handleConcernChange = (index: number, value: string) => {
    const updated = [...medicalConcern];
    updated[index] = value;
    setmedicalConcern(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = {
      name,
      age,
      email,
      phno,
      address,
      sex,
      medicalConcern,
    };

    try {
      const response = await axios.post('http://localhost:3000/api/userDetails', formData);
      setSubmittedData(response.data);
      if (response.status >= 200 && response.status < 300) {
        setAlertComponent(<Success head={"Success"} message={"Your request submitted successfully"} />);
        window.location.reload();
      } else {
        setAlertComponent(<Failure head={"Error"} message={"Your request failed"} />);
        window.location.reload();
      }

      // Clear form
      setname("");
      setAge("");
      setEmail("");
      setphno("");
      setAddress("");
      setSex("");
      setmedicalConcern([""]);
      setSubmittedData(null);

      setTimeout(() => {
        setAlertComponent(null);
      }, 3000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setAlertComponent(<Failure head={"Error"} message={"Submission failed. Please try again."} />);
      setTimeout(() => {
        setAlertComponent(null);
      }, 3000);
    }
  }
    return ( 
        <div>
             <section className="py-20 bg-gradient-to-b from-white to-teal-50">
        {alertComponent && (
          <div className="fixed top-5 right-5 z-50">
            {alertComponent}
          </div>
        )}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Offline Request Consultation</h2>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setname(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number</label>
                <input
                  type="tel"
                  value={phno}
                  onChange={(e) => setphno(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="gender" value="Male" checked={sex === "Male"} onChange={(e) => setSex(e.target.value)} />
                    Male
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="gender" value="Female" checked={sex === "Female"} onChange={(e) => setSex(e.target.value)} />
                    Female
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="gender" value="Other" checked={sex === "Other"} onChange={(e) => setSex(e.target.value)} />
                    Other
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Medical Concern</label>
                {medicalConcern.map((concern, index) => (
                  <input
                    key={index}
                    type="text"
                    value={concern}
                    onChange={(e) => handleConcernChange(index, e.target.value)}
                    placeholder={`Concern ${index + 1}`}
                    className="w-full mb-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                ))}
                <button
                  type="button"
                  onClick={addConcern}
                  className="text-teal-600 text-sm mt-2 hover:underline"
                >
                  + Add More
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition duration-300 flex items-center justify-center"
              >
                Schedule Consultation <Calendar className="ml-2 h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      </section>
        </div>
     );
}

export default AdminForm;