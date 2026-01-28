import { useEffect, useState } from 'react';
import { TLSChecker } from './TLSChecker';

interface QuantumItem {
  name: string;
  status: 'final' | 'green' | 'yellow' | 'red';
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
    },
    {
      name: 'BoringSSL',
      status: 'yellow',
      note: 'Google\'s fork of OpenSSL with PQ support',
      sourceUrl: 'https://github.com/google/boringssl'
    },
    {
      name: 'OpenSSL',
      status: 'yellow',
      note: 'Native Kyber support coming in 3.5',
      sourceUrl: 'https://github.com/openssl/openssl'
    },
    {
      name: 's2n-tls',
      status: 'yellow',
      note: 'AWS lightweight TLS implementation',
      sourceUrl: 'https://github.com/aws/s2n-tls'
    }
  ]);

  const algorithms: QuantumItem[] = [
    {
      name: 'ML-KEM (NIST FIPS 203)',
      status: 'final',
      note: 'Module-Lattice-Based Key-Encapsulation Mechanism Standard',
      sourceUrl: 'https://csrc.nist.gov/pubs/fips/203/final'
    },
    {
      name: 'ML-DSA (NIST FIPS 204)',
      status: 'final',
      note: 'Module-Lattice-Based Digital Signature Standard',
      sourceUrl: 'https://csrc.nist.gov/pubs/fips/204/final'
    },
    {
      name: 'SLH-DSA (NIST FIPS 205)',
      status: 'final',
      note: 'Stateless Hash-Based Digital Signature Standard',
      sourceUrl: 'https://csrc.nist.gov/pubs/fips/205/final'
    }
  ];

  const [protocols] = useState<QuantumItem[]>([
    {
      name: 'TLS Hybrid KEM',
      status: 'yellow',
      note: 'Draft in progress',
      sourceUrl: 'https://datatracker.ietf.org/doc/draft-ietf-tls-hybrid-design/'
    },
    {
      name: 'JOSE/JWT',
      status: 'red',
      note: 'PQ extensions needed for JWS/JWE',
      sourceUrl: 'https://www.ietf.org/archive/id/draft-prorock-cose-post-quantum-signatures-01.html'
    },
    {
      name: 'SSH',
      status: 'yellow',
      note: 'Draft for hybrid key exchange',
      sourceUrl: 'https://github.com/open-quantum-safe/openssh-portable'
    },
    {
      name: 'X.509',
      status: 'yellow',
      note: 'Support for PQ algorithms',
      sourceUrl: 'https://datatracker.ietf.org/doc/draft-ietf-lamps-dilithium-certificates/'
    }
  ]);

  const [ecosystem] = useState<QuantumItem[]>([
    {
      name: 'Chrome Browser',
      status: 'yellow',
      note: 'Experimental PQ support',
      sourceUrl: 'https://blog.chromium.org/2023/08/protecting-chrome-traffic-with-hybrid.html'
    },
    {
      name: 'Cloudflare',
      status: 'green',
      note: 'PQ TLS in production',
      sourceUrl: 'https://blog.cloudflare.com/post-quantum-crypto-deployment'
    },
    {
      name: 'DigiCert',
      status: 'yellow',
      note: 'PQ certificate testing',
      sourceUrl: 'https://www.digicert.com/post-quantum-cryptography'
    },
    {
      name: 'Google Trust Services',
      status: 'yellow',
      note: 'PQ certificate experiments',
      sourceUrl: 'https://cloud.google.com/blog/products/identity-security/google-trust-services-and-post-quantum-tls'
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

      <div className="space-y-6">
        {/* First row: 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'Algorithms', items: algorithms },
            { title: 'Protocols & Standards', items: protocols },
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
                        (item.status === 'green' || item.status === 'final') ? 'bg-green-100 text-green-800' :
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

        {/* Second row: 2 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TLSChecker />

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Ecosystem Support</h2>
            <div className="space-y-4">
              {ecosystem.map(item => (
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
          
        </div>
      </div>
    </div>
  );
};
