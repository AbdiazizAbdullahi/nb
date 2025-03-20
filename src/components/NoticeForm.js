import { useState, useEffect } from 'react';

export default function NoticeForm({ notice, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    startingDate: '',
    endingDate: '',
  });

  useEffect(() => {
    if (notice) {
      setFormData({
        title: notice.title,
        description: notice.description,
        location: notice.location,
        startingDate: new Date(notice.startingDate).toISOString().split('T')[0],
        endingDate: new Date(notice.endingDate).toISOString().split('T')[0],
      });
    }
  }, [notice]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white text-gray-900 placeholder-gray-400"
            required
            minLength={5}
            maxLength={100}
            placeholder="Enter notice title"
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-1">
            Location
          </label>
          <div className="relative">
            <input
              type="text"
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white text-gray-900 placeholder-gray-400 pl-10"
              required
              minLength={3}
              maxLength={100}
              placeholder="Enter location"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </span>
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white text-gray-900 placeholder-gray-400 resize-none"
            required
            minLength={10}
            maxLength={1000}
            rows={4}
            placeholder="Enter notice description"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="startingDate" className="block text-sm font-semibold text-gray-700 mb-1">
              Start Date
            </label>
            <div className="relative">
              <input
                type="date"
                id="startingDate"
                value={formData.startingDate}
                onChange={(e) => setFormData({ ...formData, startingDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white text-gray-900"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="endingDate" className="block text-sm font-semibold text-gray-700 mb-1">
              End Date
            </label>
            <div className="relative">
              <input
                type="date"
                id="endingDate"
                value={formData.endingDate}
                onChange={(e) => setFormData({ ...formData, endingDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white text-gray-900"
                required
                min={formData.startingDate}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
        >
          {notice ? 'Update Notice' : 'Create Notice'}
        </button>
      </div>
    </form>
  );
}