export default function NoticeCard({ notice, onEdit, onDelete, isAdmin, archived = false }) {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleExport = async () => {
    const { generateNoticePDF } = await import('@/lib/pdf/generateNoticePDF');
    generateNoticePDF(notice);
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 mb-4 ${archived ? 'opacity-75' : ''}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{notice.title}</h3>
          <div className="text-sm text-gray-500 mb-2">
            <span className="inline-flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {notice.location}
            </span>
          </div>
          <p className="text-gray-600 mb-4">{notice.description}</p>
          <div className="text-sm text-gray-500">
            <p>Start: {formatDate(notice.startingDate)}</p>
            <p>End: {formatDate(notice.endingDate)}</p>
            {archived && <p className="mt-2 text-amber-600">Archived</p>}
          </div>
        </div>
        <div className="flex flex-row justify-center items-center space-x-2">
          <button
            onClick={handleExport}
            className="text-sm text-blue-600 hover:text-blue-800"
            title="Export as PDF"
          >
            Export
          </button>
          {isAdmin && !archived && (
            <button
              onClick={() => onDelete(notice._id)}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}