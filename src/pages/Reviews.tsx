import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import axios from 'axios';
import { Star, Send } from 'lucide-react';
import Success from '../components/success';
import Failure from '../components/failure';
import { JSX } from 'react/jsx-runtime';

function ReviewCard({ name, rating, date, comment }: { name: string; rating: number; date: string; comment: string }) {

  return (
    <div className="relative bg-white p-6 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition duration-300 ease-in-out overflow-hidden">
    {/* Bubbles */}
    <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-teal-300 rounded-full opacity-40 blur-2xl"></div>
  
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-semibold text-sm ">
            {name?.charAt(0).toUpperCase()}
          </div>
          <h3 className="text-base font-semibold text-gray-900">{name}</h3>
        </div>
        <span className="text-xs text-gray-400">{date}</span>
      </div>
  
      <div className="flex items-center mb-3">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-5 w-5 transition-all duration-150 ${
              i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
  
      <p className="text-gray-600 text-sm leading-relaxed">{comment}</p>
    </div>
  </div>
  );
}

function Reviews() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [loading, setLoading] = useState(true);
  const [highRatedRecentReviews, setHighRatedRecentReviews] = useState<Review[]>([]);
  const [allReviews,setAllReviews]=useState([]);
  const [alertComponent, setAlertComponent] = useState<JSX.Element | null>(null);


  interface Review {
    name: string;
    rating: number;
    date: string;
    comment: string;
  }

  useEffect(() => {
    axios.get('https://ekaveera-backend.onrender.com/api/reviews')
      .then((res) => {
  
        const reviews = Array.isArray(res.data) ? res.data : res.data.data;
  
        setAllReviews(reviews);
  
       
  
        setHighRatedRecentReviews(reviews);
      })
      .catch((err) => {
        console.error('Error fetching reviews:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    comment: '',
    rating: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        rating: rating,
        comment: formData.comment,
      };

      const response = await axios.post('https://ekaveera-backend.onrender.com/api/reviews',  payload );
      if (response.status >= 200 && response.status < 300) {
        setAlertComponent(<Success head={"Success"} message={"Your review submitted successfully"} />);
      } else {
        setAlertComponent(<Failure head={"Error"} message={"Your review submission failed"} />);
      }

      setTimeout(() => {
        setAlertComponent(null);
        window.location.reload();
      }, 3000);
      console.log('Review submitted:', response.data);

      
      setFormData({ name: '', email: '', comment: '', rating: '' });
      setRating(0);
    } catch (error) {
      console.error('Failed to submit review:', error);
    }
  };

  return (
    <div className="bg-gradient-to-b from-teal-50 to-white">
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Patient <span className="text-teal-600">Reviews</span>
          </h1>

          {loading ? (
            // <p className="text-center text-gray-600 text-lg">Loading reviews...</p>
            <div className="flex flex-col gap-4 w-full items-center justify-center relative">
            {/* Spinning Border with Custom Speed */}
            <div className="w-28 h-28 border-8 border-gray-300 border-t-teal-600 rounded-full custom-spin absolute"></div>
      
            {/* Centered Heart with Heartbeat Animation */}
            <div className="w-28 h-28 flex items-center justify-center">
              <Heart className="h-10 w-10 text-teal-600 animate-heartbeat" />
            </div>
      
            {/* Custom CSS for animations */}
            <style jsx>{`
              @keyframes heartbeat {
                0%, 100% {
                  transform: scale(1);
                  opacity: 1;
                }
                50% {
                  transform: scale(1.2);
                  opacity: 0.6;
                }
              }
      
              .animate-heartbeat {
                animation: heartbeat 1s infinite;
              }
      
              @keyframes slowSpin {
                0% {
                  transform: rotate(0deg);
                }
                100% {
                  transform: rotate(360deg);
                }
              }
      
              .custom-spin {
                animation: slowSpin 2s linear infinite; /* Change 3s to control speed */
              }
            `}</style>
          </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
              {highRatedRecentReviews.slice(0, 3).map((review, index) => (
                <ReviewCard key={index} {...review} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {alertComponent && (
          <div className="fixed top-5 right-5 z-50">
            {alertComponent}
          </div>
        )}
          <div className="bg-teal-50 rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Share Your Experience</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-8 w-8 cursor-pointer ${
                        star <= (hover || rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                      onMouseEnter={() => setHover(star)}
                      onMouseLeave={() => setHover(0)}
                      onClick={() => setRating(star)}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
                <textarea
                  name="comment"
                  value={formData.comment}
                  onChange={handleChange}
                  rows={4}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Share your experience with us..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition duration-300 flex items-center justify-center"
              >
                Submit Review <Send className="ml-2 h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Reviews;

function setAlertComponent(arg0: JSX.Element) {
  throw new Error('Function not implemented.');
}

