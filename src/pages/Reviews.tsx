import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Star, Send } from 'lucide-react';
import Success from '../components/success';
import Failure from '../components/failure';
import { JSX } from 'react/jsx-runtime';

function ReviewCard({ name, rating, date, comment }: { name: string; rating: number; date: string; comment: string }) {

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
        <span className="text-sm text-gray-500">{date}</span>
      </div>
      <div className="flex items-center mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-5 w-5 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
          />
        ))}
      </div>
      <p className="text-gray-600">{comment}</p>
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
            <p className="text-center text-gray-600 text-lg">Loading reviews...</p>
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

