import React, { useState, useEffect } from 'react';
import { Search, Edit, Eye, X, CheckCircle, Users, Clipboard, ThumbsUp, ThumbsDown, Calendar, ChevronLeft, ChevronRight, Trash2, Mail } from 'lucide-react';
import axios from 'axios';
import AdminForm from './Form';
import { Delete } from 'lucide-react';
import Success from '../components/success';
import Failure from '../components/failure';

// Consistent interface definition with single ID property
interface MonthlyData {
  name: string;
  patients: number;
  goodReviews: number;
  badReviews: number;
}

interface Prescription {
  tablets: string;
  dosage: string;
  duration: string;
  id: string; // Unified to 'id' instead of '_id'
  date: string;
}

interface Patient {
  id: string; // Unified to 'id' instead of '_id'
  name: string;
  email: string;
  phno: string;
  age: string;
  address: string;
  sex: string;
  medicalConcern: string[];
  isCompleted: boolean;
  prescription: Prescription[];
  newPrescription?: Prescription[]; // Made optional using ?
  createdAt: string;
}

// Main Dashboard Component
export default function Test(): JSX.Element {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showPatientModal, setShowPatientModal] = useState<boolean>(false);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState<boolean>(false);
  const [good, setGood] = useState(0);
  const [bad, setBad] = useState(0);
  const [newPrescription, setNewPrescription] = useState<Omit<Prescription, 'id' | 'date'>>({
    tablets: '',
    dosage: '',
    duration: ''
  });
  const [activeTab, setActiveTab] = useState<'all' | 'completed' | 'pending'>('all');
  const [alertComponent, setAlertComponent] = useState<JSX.Element | null>(null);
  const [isEmailSending, setIsEmailSending] = useState<boolean>(false);
  const [isMarkingComplete, setIsMarkingComplete] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Function to get month name
  const getMonthName = (monthIndex: number) =>
    new Date(0, monthIndex).toLocaleString('default', { month: 'short' });

  // Function to fetch patients data with standardized ID handling
  const fetchPatients = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:3000/api/userDetails');
      
      // Normalize response data to use 'id' consistently
      const normalizedData = response.data.map((patient: any) => ({
        ...patient,
        id: patient.id || patient._id, // Prefer 'id', fallback to '_id'
        prescription: patient.prescription?.map((p: any) => ({
          ...p,
          id: p.id || p._id
        })) || [],
        newPrescription: patient.newPrescription?.map((p: any) => ({
          ...p,
          id: p.id || p._id
        })) || undefined
      }));
      
      setPatients(normalizedData);
      setFilteredPatients(normalizedData);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching patients:', error);
      setIsLoading(false);
    }
  };

  // Filter patients based on search term
  useEffect(() => {
    const filtered = patients.filter(patient => 
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phno.includes(searchTerm)
    );
    setFilteredPatients(filtered);
  }, [searchTerm, patients]);

  // Filter patients based on active tab
  useEffect(() => {
    if (activeTab === 'all') {
      setFilteredPatients(
        patients.filter(patient => 
          patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.phno.includes(searchTerm)
        )
      );
    } else if (activeTab === 'completed') {
      setFilteredPatients(
        patients.filter(patient => 
          patient.isCompleted && (
            patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.phno.includes(searchTerm)
          )
        )
      );
    } else if (activeTab === 'pending') {
      setFilteredPatients(
        patients.filter(patient => 
          !patient.isCompleted && (
            patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.phno.includes(searchTerm)
          )
        )
      );
    }
  }, [activeTab, searchTerm, patients]);

  // Mark patient as completed
  const markAsComplete = async (patientId: string): Promise<void> => {
    try {
      setIsMarkingComplete(true);
      await axios.put(`http://localhost:3000/api/userDetails/${patientId}/complete`, { isCompleted: true });
      
      // Update local state
      const updatedPatients = patients.map(patient => 
        patient.id === patientId ? {...patient, isCompleted: true} : patient
      );
      setPatients(updatedPatients);
      
      // Update selected patient if it's currently viewed
      if (selectedPatient && selectedPatient.id === patientId) {
        setSelectedPatient({...selectedPatient, isCompleted: true});
      }
      
      setIsMarkingComplete(false);
      
      // Show success message
      setAlertComponent(<Success head={"Success"} message={"Patient marked as complete"} />);
      setTimeout(() => {
        setAlertComponent(null);
        window.location.reload();
      }, 3000);
    } catch (error) {
      console.error('Error marking patient as complete:', error);
      setIsMarkingComplete(false);
      
      // Show error message
      setAlertComponent(<Failure head={"Error"} message={"Failed to update patient status"} />);
      setTimeout(() => {
        setAlertComponent(null);
      }, 3000);
    }
  };

  // Handle prescription submission
  const handlePrescriptionSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
  
    console.log('Submitting prescription:', newPrescription);
    console.log('Selected patient:', selectedPatient?.id);
  
    // Validation
    if (!newPrescription.tablets || !newPrescription.dosage || !newPrescription.duration) {
      setAlertComponent(<Failure head="Error" message="Please fill all fields" />);
      setTimeout(() => setAlertComponent(null), 3000);
      return;
    }
  
    if (!selectedPatient || !selectedPatient.id) {
      setAlertComponent(<Failure head="Error" message="No patient selected" />);
      setTimeout(() => setAlertComponent(null), 3000);
      return;
    }
  
    try {
      // Send new prescription to backend
      await axios.put(`http://localhost:3000/api/userDetails/${selectedPatient.id}`, {
        newPrescription: [
          {
            tablets: newPrescription.tablets,
            dosage: newPrescription.dosage,
            duration: newPrescription.duration,
            date: new Date().toISOString()
          }
        ]
      });
  
      // Fetch updated user
      const res = await axios.get(`http://localhost:3000/api/userDetails/${selectedPatient.id}`);
      const updatedUser = res.data;
  
      // Normalize updated user data
      const normalizedUser = {
        ...updatedUser,
        id: updatedUser.id || updatedUser._id,
        prescription: updatedUser.prescription?.map((p: any) => ({
          ...p,
          id: p.id || p._id
        })) || []
      };
  
      // Update state
      const updatedPatients = patients.map((p) =>
        p.id === normalizedUser.id ? normalizedUser : p
      );
  
      setPatients(updatedPatients);
      setSelectedPatient(normalizedUser);
      setNewPrescription({ tablets: '', dosage: '', duration: '' });
      setShowPrescriptionModal(false);
      setShowPatientModal(true);
  
      // Show success
      setAlertComponent(<Success head="Success" message="Prescription added successfully" />);
      setTimeout(() => setAlertComponent(null), 3000);
    } catch (error) {
      console.error('Error adding prescription:', error);
      setAlertComponent(<Failure head="Error" message="Failed to add prescription" />);
      setTimeout(() => setAlertComponent(null), 3000);
    }
  };
  
  // Delete prescription 
  const deletePrescription = async (
    patientId: string,
    prescriptionId: string,
    isPrevious: boolean
  ): Promise<void> => {
    try {
      const endpoint = isPrevious
        ? `http://localhost:3000/api/userDetails/${patientId}/prescription/${prescriptionId}`
        : `http://localhost:3000/api/userDetails/${patientId}/newPrescription/${prescriptionId}`;
  
      await axios.delete(endpoint);
  
      // Update local state
      if (selectedPatient) {
        const updatedPatient = { ...selectedPatient };
  
        if (isPrevious) {
          updatedPatient.prescription = updatedPatient.prescription.filter(
            (p) => p.id !== prescriptionId
          );
        } else if (updatedPatient.newPrescription) {
          updatedPatient.newPrescription = updatedPatient.newPrescription.filter(
            (p) => p.id !== prescriptionId
          );
        }
  
        setSelectedPatient(updatedPatient);
  
        const updatedPatients = patients.map((p) =>
          p.id === patientId ? updatedPatient : p
        );
  
        setPatients(updatedPatients);
      }
  
      setAlertComponent(
        <Success head={"Success"} message={"Prescription deleted successfully"} />
      );
      setTimeout(() => setAlertComponent(null), 3000);
    } catch (error) {
      console.error('Error deleting prescription:', error);
      setAlertComponent(
        <Failure head={"Error"} message={"Failed to delete prescription"} />
      );
      setTimeout(() => setAlertComponent(null), 3000);
    }
  };

  // Fetch reviews
  async function fetchReviews() {
    try {
      const res = await axios.get('http://localhost:3000/api/reviews');
      
      if (Array.isArray(res.data)) {
        const reviews = res.data;
  
        const result = reviews.reduce(
          (acc: { good: number; bad: number }, review: { rating: number }) => {
            // Rating >= 4 is considered good
            if (review.rating >= 4) {
              acc.good++;
            } else {
              acc.bad++;
            }
            return acc;
          },
          { good: 0, bad: 0 }
        );
  
        setGood(result.good);
        setBad(result.bad);
      } else {
        console.log("No review data available");
        setGood(0);
        setBad(0);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setGood(0);
      setBad(0);
    }
  }

  // Load initial data
  useEffect(() => {
    fetchPatients();
    fetchReviews();
  }, []);
  
  // Get total counts for stats cards
  const getTotalPatients = () => patients.length;
  const getCompletedCheckups = () => patients.filter(p => p.isCompleted).length;

  // Download patient data as Excel
  const handleDownload = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/download-excel', {
        responseType: 'blob', 
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'patientDetails.xlsx'); 
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      setAlertComponent(<Success head={"Success"} message={"File downloaded successfully"} />);
      setTimeout(() => {
        setAlertComponent(null);
      }, 3000);
    } catch (error) {
      console.error('Error downloading the file', error);
      setAlertComponent(<Failure head={"Error"} message={"Failed to download file"} />);
      setTimeout(() => {
        setAlertComponent(null);
      }, 3000);
    }
  };

  // Send email to patient
  const sendEmail = async (patientId: string) => {
    try {
      setIsEmailSending(true);
      const response = await axios.post(`http://localhost:3000/api/send-email/${patientId}`);
      
      if (response.status >= 200 && response.status < 300) {
        setAlertComponent(<Success head={"Success"} message={"Email sent successfully"} />);
        
        await markAsComplete(patientId);
      } else {
        setAlertComponent(<Failure head={"Error"} message={"Failed to send email"} />);
      }

      setTimeout(() => {
        setAlertComponent(null);
      }, 3000);
      
      setIsEmailSending(false);
    } catch (error) {
      console.error('Error sending email:', error);
      setAlertComponent(<Failure head={"Error"} message={"Failed to send email"} />);
      setTimeout(() => {
        setAlertComponent(null);
      }, 3000);
      setIsEmailSending(false);
    }
  };

  // Delete patient
  const deletePatient = async (patientId: string) => {
    try {
      await axios.delete(`http://localhost:3000/api/userDetails/${patientId}`);
      
      // Update state by removing deleted patient
      const updatedPatients = patients.filter(p => p.id !== patientId);
      setPatients(updatedPatients);
      setFilteredPatients(updatedPatients);
      
      // Close modal if the deleted patient was being viewed
      if (selectedPatient?.id === patientId) {
        setSelectedPatient(null);
        setShowPatientModal(false);
      }
      
      // Show success message
      setAlertComponent(<Success head={"Success"} message={"Patient deleted successfully"} />);
      setTimeout(() => {
        setAlertComponent(null);
      }, 3000);
    } catch (error) {
      console.error('Error deleting patient:', error);
      
      // Show error message
      setAlertComponent(<Failure head={"Error"} message={"Failed to delete patient"} />);
      setTimeout(() => {
        setAlertComponent(null);
      }, 3000);
    }
  }

  // Function to open prescription modal
  const openPrescriptionModal = () => {
    setShowPrescriptionModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Alert component */}
      {alertComponent}
      
      {/* Header */}
      <header className="bg-white shadow">
      <div className="flex max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Medical Admin Dashboard</h1>
        <button 
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          onClick={handleDownload}
        >
          Download
        </button>
      </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-blue-100 rounded-lg shadow-sm p-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Patients</p>
                <p className="text-3xl font-bold mt-2">{getTotalPatients()}</p>
              </div>
              <div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </div>
          </div>
          <div className="bg-green-100 rounded-lg shadow-sm p-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Checkups</p>
                <p className="text-3xl font-bold mt-2">{getCompletedCheckups()}</p>
              </div>
              <div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </div>
          </div>
          <div className="bg-indigo-100 rounded-lg shadow-sm p-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Good Reviews</p>
                <p className="text-3xl font-bold mt-2">{good}</p>
              </div>
              <div>
                <ThumbsUp className="h-8 w-8 text-indigo-500" />
              </div>
            </div>
          </div>
          <div className="bg-red-100 rounded-lg shadow-sm p-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Bad Reviews</p>
                <p className="text-3xl font-bold mt-2">{bad}</p>
              </div>
              <div>
                <ThumbsDown className="h-8 w-8 text-red-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Patients Tab and Search */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div className="flex space-x-4 mb-4 md:mb-0">
              <button 
                onClick={() => setActiveTab('all')} 
                className={`px-4 py-2 font-medium ${activeTab === 'all' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
              >
                All Patients
              </button>
              <button 
                onClick={() => setActiveTab('pending')} 
                className={`px-4 py-2 font-medium ${activeTab === 'pending' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
              >
                Pending Checkups
              </button>
              <button 
                onClick={() => setActiveTab('completed')} 
                className={`px-4 py-2 font-medium ${activeTab === 'completed' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
              >
                Completed Checkups
              </button>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search patients..."
                className="pl-10 pr-4 py-2 border rounded-lg w-full md:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Patients Table */}
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-pulse text-gray-600">Loading patients...</div>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medical Concerns</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPatients.length > 0 ? (
                    filteredPatients.map((patient) => (
                      <tr key={patient.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                          <div className="text-sm text-gray-500">Age: {patient.age}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{patient.email}</div>
                          <div className="text-sm text-gray-500">{patient.phno}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {patient.medicalConcern.map((concern, index) => (
                              <span key={index} className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                                {concern}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {patient.isCompleted ? (
                            <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                              Completed
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => {
                                setSelectedPatient(patient);
                                setShowPatientModal(true);
                              }}
                              className="p-1 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded"
                              title="View patient details"
                            >
                              <Eye className="h-5 w-5" />
                            </button>
                            <button 
                              onClick={() => deletePatient(patient.id)}
                              className="p-1 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
                              title="Delete patient"
                            >
                              <Delete className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                        No patients found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
        <AdminForm/>
      </main>

      {/* Patient Details Modal */}
      {showPatientModal && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-40">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-auto">
            <div className="flex justify-between items-center border-b p-4">
              <h2 className="text-xl font-bold">Patient Details</h2>
              <button onClick={() => setShowPatientModal(false)} className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4 text-indigo-700">Personal Information</h3>
                  <div className="space-y-3">
                    <p><span className="font-medium">Name:</span> {selectedPatient.name}</p>
                    <p><span className="font-medium">Age:</span> {selectedPatient.age}</p>
                    <p><span className="font-medium">Sex:</span> {selectedPatient.sex}</p>
                    <p><span className="font-medium">Email:</span> {selectedPatient.email}</p>
                    <p><span className="font-medium">Phone:</span> {selectedPatient.phno}</p>
                    <p><span className="font-medium">Address:</span> {selectedPatient.address}</p>
                    <p><span className="font-medium">Registered:</span> {new Date(selectedPatient.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4 text-indigo-700">Medical Information</h3>
                  <div className="space-y-3">
                    <p><span className="font-medium">Medical Concerns:</span></p>
                    <div className="flex flex-wrap gap-2">
                      {selectedPatient.medicalConcern.map((concern, index) => (
                        <span key={index} className="px-3 py-1 rounded-full bg-blue-100 text-blue-800">
                          {concern}
                        </span>
                      ))}
                    </div>
                    <p className="mt-4"><span className="font-medium">Status:</span> 
                      {selectedPatient.isCompleted ? (
                        <span className="ml-2 px-3 py-1 rounded-full bg-green-100 text-green-800">Completed</span>
                      ) : (
                        <span className="ml-2 px-3 py-1 rounded-full bg-yellow-100 text-yellow-800">Pending</span>
                      )}
                    </p>
                    
                    {/* Action buttons for patient status */}
                    {!selectedPatient.isCompleted && (
                      <div className="flex mt-4 space-x-3">
                        <button 
                          onClick={() => sendEmail(selectedPatient.id)}
                          disabled={isEmailSending}
                          className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                          <Mail className="h-4 w-4 mr-2" /> 
                          {isEmailSending ? 'Sending...' : 'Send Email'}
                        </button>
                        
                        <button 
                          onClick={() => markAsComplete(selectedPatient.id)}
                          disabled={isMarkingComplete}
                          className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" /> 
                          {isMarkingComplete ? 'Updating...' : 'Mark as Complete'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mb-6 bg-white p-4 rounded-lg border">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-indigo-700">Prescription History</h3>
                  <button 
                    onClick={openPrescriptionModal}
                    className="px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
                  >
                    <Clipboard className="h-4 w-4 mr-2" /> 
                    Add Prescription
                  </button>
                </div>
                {selectedPatient.prescription.length > 0 ? (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medication</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dosage</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedPatient.prescription.map((prescription) => (
                        <tr key={prescription.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">{prescription.tablets}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{prescription.dosage}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{prescription.duration}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{new Date(prescription.date).toLocaleDateString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button 
                              onClick={() => deletePrescription(selectedPatient.id, prescription.id, true)}
                              className="p-1 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
                              title="Delete prescription"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center p-4">No prescriptions found</div>
                )}
              </div>
              </div>
              
              {/* New Prescription History */}
              <div className="mb-6 bg-white p-4 rounded-lg border">
                <h3 className="text-lg font-semibold mb-4 text-indigo-700">New Prescription History</h3>
                {selectedPatient.newPrescription && selectedPatient.newPrescription.length > 0 ? (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medication</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dosage</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedPatient.newPrescription.map((prescription) => (
                        <tr key={prescription.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">{prescription.tablets}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{prescription.dosage}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{prescription.duration}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{new Date(prescription.date).toLocaleDateString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button 
                              onClick={() => deletePrescription(selectedPatient.id, prescription.id, false)}
                              className="p-1 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
                              title="Delete prescription"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center p-4">No new
 prescriptions found</div>
                )}
              </div>
            </div>
          </div>
      )}

      {/* Prescription Modal */}
      {showPrescriptionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-40">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="flex justify-between items-center border-b p-4">
              <h2 className="text-xl font-bold">Add Prescription</h2>
              <button onClick={() => setShowPrescriptionModal(false)} className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handlePrescriptionSubmit} className="p-6 space-y-4">
              <div>
                <label htmlFor="tablets" className="block text-sm font-medium text-gray-700">Tablets</label>
                <input
                  type="text"
                  id="tablets"
                  value={newPrescription.tablets}
                  onChange={(e) => setNewPrescription({ ...newPrescription, tablets: e.target.value })}
                  required
                  className="mt-1 block w-full text-lg p-3 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="dosage" className="block text-sm font-medium text-gray-700">Dosage</label>
                <input
                  type="text"
                  id="dosage"
                  value={newPrescription.dosage}
                  onChange={(e) => setNewPrescription({ ...newPrescription, dosage: e.target.value })}
                  required
                  className="mt-1 block w-full text-lg p-3 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700">Duration</label>
                <input
                  type="text"
                  id="duration"
                  value={newPrescription.duration}
                  onChange={(e) => setNewPrescription({ ...newPrescription, duration: e.target.value })}
                  required
                  className="mt-1 block w-full text-lg p-3 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div className="flex justify-end">
                <button 
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                >
                  Add Prescription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
function updateNewPrescription(
  prescription: Omit<Prescription, 'id' | 'date'>,
  setNewPrescription: React.Dispatch<React.SetStateAction<Omit<Prescription, 'id' | 'date'>>>
): void {
  setNewPrescription(prescription);
}
