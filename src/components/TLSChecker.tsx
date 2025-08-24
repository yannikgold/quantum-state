import { useState } from 'react';
import { analyzeTLS } from '../utils/tlsUtils';

type Strength = 'classical' | 'hybrid' | 'quantum';

type CryptoDetails = {
  algorithm: string;
  strength: Strength;
  details?: string;
};

const CryptoDetail = ({ detail, title }: { detail: CryptoDetails | null, title: string }) => {
  if (!detail) return null;
  
  const strengthColors: Record<Strength, string> = {
    classical: 'text-yellow-600',
    hybrid: 'text-blue-600',
    quantum: 'text-green-600'
  };

  return (
    <div className="mb-4">
      <h4 className="font-medium text-sm">{title}</h4>
      <div className="ml-2">
        <div className={`${strengthColors[detail.strength as Strength]} font-mono text-sm`}>
          {detail.algorithm}
        </div>
        {detail.details && (
          <div className="text-xs text-gray-600 mt-1">
            {detail.details}
          </div>
        )}
      </div>
    </div>
  );
};

export const TLSChecker = () => {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tlsInfo, setTlsInfo] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const info = await analyzeTLS(domain);
      setTlsInfo(info);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4">TLS Domain Check</h2>
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="example.com"
            className="flex-1 px-4 py-2 border rounded-lg"
            aria-label="Domain to check"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg disabled:bg-blue-300"
          >
            {loading ? 'Checking...' : 'Run TLS Check'}
          </button>
        </div>
      </form>
      
      {tlsInfo && (
        <div className="mt-6 space-y-6">
          <div>
            <h3 className="font-medium">Protocol Version</h3>
            <p className="text-sm text-gray-600">{tlsInfo.protocols.join(', ')}</p>
          </div>
          
          <div>
            <h3 className="font-medium">Certificate Info</h3>
            <div className="text-sm text-gray-600">
              <p>Subject: {tlsInfo.certInfo.subject}</p>
              <p>Issuer: {tlsInfo.certInfo.issuer}</p>
              <p>Signature Algorithm: {tlsInfo.certInfo.signatureAlgorithm}</p>
            </div>
          </div>

          <div>
            <h3 className="font-medium">PQ Status</h3>
            <span className={`inline-block px-2 py-1 rounded-full text-sm ${
              tlsInfo.pqStatus === 'green' ? 'bg-green-100 text-green-800' :
              tlsInfo.pqStatus === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {tlsInfo.pqStatus === 'green' ? 'PQ Ready' :
               tlsInfo.pqStatus === 'yellow' ? 'Classical TLS 1.3' :
               'Legacy/Classical Only'}
            </span>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-bold mb-4">Cryptographic Details</h3>
            
            <CryptoDetail 
              title="Key Exchange" 
              detail={tlsInfo.cryptography.keyExchange} 
            />
            <CryptoDetail 
              title="Certificate Signature" 
              detail={tlsInfo.cryptography.signature} 
            />
            <CryptoDetail 
              title="Symmetric Cipher" 
              detail={tlsInfo.cryptography.symmetric} 
            />
            
            <div className="mt-4 text-sm text-gray-600">
              <span className="font-medium">Overall PQ Status: </span>
              <span className={
                tlsInfo.pqStatus === 'green' ? 'text-green-600' :
                tlsInfo.pqStatus === 'yellow' ? 'text-yellow-600' :
                'text-red-600'
              }>
                {tlsInfo.pqStatus === 'green' ? 'PQ Ready' :
                 tlsInfo.pqStatus === 'yellow' ? 'Classical TLS 1.3' :
                 'Not PQ Ready'}
              </span>
            </div>
          </div>
        </div>
      )}
      
      {error && <div className="text-red-600 mb-4">{error}</div>}
    </div>
  );
};
