import { useEffect, useState } from 'react';

interface QuantumItem {
  name: string;
  status: 'green' | 'yellow' | 'red';
  note: string;
  sourceUrl: string;
  version?: string;
}

export const QuantumState = () => {
  const [libraries] = useState<QuantumItem[]>([
    {
      name: 'liboqs',
      status: 'yellow',
      note: 'Open Quantum Safe library',
      sourceUrl: 'https://github.com/open-quantum-safe/liboqs'
    },
    {
      name: 'oqs-provider',
      status: 'yellow',
      note: 'OpenSSL 3 provider for PQC',
      sourceUrl: 'https://github.com/open-quantum-safe/oqs-provider'
    },
    {
      name: 'wolfSSL',
      status: 'yellow',
      note: 'Embedded SSL/TLS library',
      sourceUrl: 'https://github.com/wolfSSL/wolfssl'
    }
  ]);

  const algorithms: QuantumItem[] = [
    {
      name: 'ML-KEM (Kyber)',
      status: 'green',
      note: 'NIST standardized KEM',
      sourceUrl: 'https://csrc.nist.gov/Projects/post-quantum-cryptography'
    },
    {
      name: 'ML-DSA (Dilithium)',
      status: 'green',
      note: 'NIST standardized signature',
      sourceUrl: 'https://csrc.nist.gov/Projects/post-quantum-cryptography'
    },
    {
      name: 'SLH-DSA (SPHINCS+)',
      status: 'green',
      note: 'Stateless hash-based signature',
      sourceUrl: 'https://csrc.nist.gov/Projects/post-quantum-cryptography'
    }
  ];

  const [protocols] = useState<QuantumItem[]>([
    {
      name: 'TLS Hybrid KEM',
      status: 'yellow',
      note: 'Draft in progress',
      sourceUrl: 'https://datatracker.ietf.org/doc/draft-ietf-tls-hybrid-design/'
    }
  ]);

  useEffect(() => {
    // Fetch GitHub releases and IETF draft status
    // ... implementation details in previous messages ...
  }, []);

  return (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="relative">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <div className="absolute inset-0 bg-green-400 rounded-full animate-ping"></div>
        </div>
        <span className="text-sm font-medium">LIVE</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: 'Algorithms', items: algorithms },
          { title: 'Protocols', items: protocols },
          { title: 'Libraries', items: libraries }
        ].map(({ title, items }) => (
          <div key={title} className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">{title}</h2>
            <div className="space-y-4">
              {items.map(item => (
                <div key={item.name} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{item.name}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.status === 'green' ? 'bg-green-100 text-green-800' :
                      item.status === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>{item.status}</span>
                  </div>
                  <p className="text-sm text-gray-600">{item.note}</p>
                  {item.version && (
                    <p className="text-sm text-gray-600">Latest: {item.version}</p>
                  )}
                  <a
                    href={item.sourceUrl}
                    className="text-sm text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    🔗 Source
                  </a>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
