import React, { useEffect, useState } from 'react';
import { seedAPI } from '../utils/api';
import { Loader2, Database, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';

export const DatabaseInitializer: React.FC = () => {
  const [status, setStatus] = useState<'checking' | 'seeding' | 'seeded' | 'error' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [credentials, setCredentials] = useState<any>(null);

  useEffect(() => {
    checkAndSeedDatabase();
  }, []);

  const checkAndSeedDatabase = async () => {
    const hasSeeded = localStorage.getItem('gamisaviya_db_seeded');
    
    if (hasSeeded) {
      setStatus('seeded');
      return;
    }

    setStatus('checking');

    try {
      // Try to seed the database
      setStatus('seeding');
      const response = await seedAPI.seedDatabase();
      
      if (response.success) {
        setCredentials(response.credentials);
        localStorage.setItem('gamisaviya_db_seeded', 'true');
        setStatus('seeded');
      } else {
        // Database already seeded by another user/session
        localStorage.setItem('gamisaviya_db_seeded', 'true');
        setStatus('seeded');
      }
    } catch (err: any) {
      console.error('Database initialization error:', err);
      setError(err.message || 'Failed to initialize database');
      setStatus('error');
    }
  };

  const retryInitialization = () => {
    setError(null);
    localStorage.removeItem('gamisaviya_db_seeded');
    checkAndSeedDatabase();
  };

  // Don't render anything if successfully seeded
  if (status === 'seeded' && !credentials) {
    return null;
  }

  // Show credentials modal if available
  if (status === 'seeded' && credentials) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Database Initialized Successfully!
            </h2>
            <p className="text-gray-600">
              Your GamiSaviya.lk database has been set up with sample data.
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
            <h3 className="font-bold text-green-900 mb-4 flex items-center gap-2">
              <Database className="w-5 h-5" />
              Test Credentials
            </h3>
            
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">Admin Account:</p>
                <p className="text-sm text-gray-600">Email: <code className="bg-gray-100 px-2 py-1 rounded">{credentials.admin.email}</code></p>
                <p className="text-sm text-gray-600">Password: <code className="bg-gray-100 px-2 py-1 rounded">{credentials.admin.password}</code></p>
              </div>

              <div className="bg-white rounded-lg p-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">Seller Accounts:</p>
                {credentials.sellers.map((seller: any, index: number) => (
                  <div key={index} className="mb-2">
                    <p className="text-sm text-gray-600">
                      {index + 1}. Email: <code className="bg-gray-100 px-2 py-1 rounded">{seller.email}</code> / 
                      Password: <code className="bg-gray-100 px-2 py-1 rounded ml-2">{seller.password}</code>
                    </p>
                  </div>
                ))}
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800">
                  <strong>Note:</strong> The database includes sample products, sellers, and test data for demonstration purposes.
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={() => setCredentials(null)}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            Continue to Application
          </Button>
        </div>
      </div>
    );
  }

  // Show loading/error states
  if (status === 'checking' || status === 'seeding') {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-green-50 to-amber-50 flex items-center justify-center z-50">
        <div className="text-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
            <Loader2 className="w-10 h-10 text-green-600 animate-spin" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {status === 'checking' ? 'Checking Database...' : 'Initializing Database...'}
          </h2>
          <p className="text-gray-600">
            {status === 'checking' 
              ? 'Verifying database status...' 
              : 'Setting up GamiSaviya.lk with sample data...'}
          </p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-red-50 to-amber-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Initialization Failed
            </h2>
            <p className="text-gray-600 mb-6">
              {error || 'Unable to initialize the database. Please try again.'}
            </p>
            <Button
              onClick={retryInitialization}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              Retry Initialization
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
