import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Construction } from 'lucide-react';

interface PlaceholderPageProps {
  title: string;
  description?: string;
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title, description }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="text-center max-w-md">
        <Construction className="w-20 h-20 text-green-600 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
        <p className="text-gray-600 mb-8">
          {description || 'This page is part of the prototype demonstration.'}
        </p>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};
