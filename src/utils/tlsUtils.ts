// src/utils/tlsAnalyzer.ts

export interface TLSInfo {
  host: string;
  status: "ERROR" | "IN_PROGRESS" | "READY" | "UNKNOWN";
  protocols: string[];            // e.g., ["TLS 1.3", "HTTP/2"]
  cipher: string | null;         // best-guess primary cipher suite (string)
  keyExchange?: string | null;   // key exchange / KEM / group hint if available
  certInfo: {
    subject: string | null;
    issuer: string | null;
    validFrom: string | null;
    validTo: string | null;
    signatureAlgorithm: string | null;
    keySize?: number | null;
  };
  pqStatus: "green" | "yellow" | "red"; // conservative PQ readiness heuristic
  raw?: any; // optional: raw SSL Labs response for debugging
  cryptography: {
    keyExchange: CryptoDetails | null;
    signature: CryptoDetails | null;
    symmetric: CryptoDetails | null;
  };
}

// Detailed cryptographic information
interface CryptoDetails {
  family: string;
  algorithm: string;
  strength: 'classical' | 'hybrid' | 'quantum';
  details?: string;
}

// Constants for PQ detection
const PQ_INDICATORS = {
  keyExchange: ['kyber', 'ml-kem', 'crystals-kyber', 'sike', 'ntru'],
  signatures: ['dilithium', 'falcon', 'sphincs', 'ml-dsa', 'slh-dsa'],
  symmetric: ['aes-256-gcm', 'chacha20-poly1305']
};

// Crypto families for detailed analysis
const CRYPTO_FAMILIES = {
  keyExchange: {
    classical: ['p256', 'p384', 'p521', 'x25519', 'secp256k1'],
    quantum: ['kyber', 'ml-kem', 'sike', 'ntru'],
    hybrid: ['p384_kyber768', 'x25519_kyber768']
  },
  signature: {
    classical: ['rsa', 'ecdsa', 'ed25519'],
    quantum: ['dilithium', 'falcon', 'sphincs', 'ml-dsa', 'slh-dsa']
  },
  symmetric: {
    classical: ['aes-128', 'aes-256', 'chacha20'],
    quantum: [] // All current symmetric algorithms are considered quantum-safe
  }
};

// Helper to extract TLS info from response headers
const extractTLSInfo = (headers: Headers): {
  protocols: string[];
  tlsVersion: string | null;
  cipher: string | null;
} => {
  const altSvc = headers.get('alt-svc');
  const secTransport = headers.get('strict-transport-security');
  
  // Check for HTTP/3 and TLS 1.3 support
  const hasH3 = altSvc?.includes('h3');
  const hasTLS13 = hasH3 || headers.get('x-tls-version')?.includes('1.3');
  
  return {
    protocols: [
      hasTLS13 ? 'TLS 1.3' : 'TLS',
      hasH3 ? 'HTTP/3' : 'HTTP/2'
    ],
    tlsVersion: hasTLS13 ? '1.3' : null,
    cipher: headers.get('x-tls-cipher') || null
  };
};

// JSONP fetch helper for CORS-compatible SSL Labs API access
const fetchJsonp = (url: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const callbackName = 'ssllabs_' + Math.random().toString(36).substring(7);
    let timeoutId: number;

    // Create callback
    (window as any)[callbackName] = (response: any) => {
      cleanup();
      resolve(response);
    };

    // Create script
    const script = document.createElement('script');
    script.src = `${url}&callback=${callbackName}`;
    script.onerror = () => {
      cleanup();
      reject(new Error('JSONP request failed'));
    };

    // Cleanup function
    const cleanup = () => {
      if (timeoutId) window.clearTimeout(timeoutId);
      document.body.removeChild(script);
      delete (window as any)[callbackName];
    };

    // Set timeout
    timeoutId = window.setTimeout(() => {
      cleanup();
      reject(new Error('JSONP request timed out'));
    }, 30000);

    // Append script
    document.body.appendChild(script);
  });
};

const API_ENDPOINTS = {
  // Certificate Transparency logs (CORS-enabled)
  CT_LOG: 'https://api.certspotter.com/v1/issuances',
  // Mozilla TLS Observatory (CORS-enabled)
  MOZILLA: 'https://tls-observatory.services.mozilla.com/api/v1'
};

export const analyzeTLS = async (domain: string): Promise<TLSInfo> => {
  try {
    console.group(`🔍 Analyzing TLS for ${domain}`);
    
    // 1. Try Certificate Transparency logs
    console.log('Fetching certificate data...');
    const certResponse = await fetch(`${API_ENDPOINTS.CT_LOG}?domain=${domain}&expand=dns_names,cert_der&include_subdomains=false`, {
      headers: { Accept: 'application/json' }
    });
    const certData = await certResponse.json();
    console.log('Certificate data:', certData[0] || 'No data');

    // 2. Try Mozilla Observatory
    console.log('Fetching TLS Observatory data...');
    const mozResponse = await fetch(`${API_ENDPOINTS.MOZILLA}/scan?target=${domain}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    const scanId = await mozResponse.json();
    console.log('Scan initiated:', scanId);

    // Wait for scan results
    await new Promise(resolve => setTimeout(resolve, 3000));
    const resultsResponse = await fetch(`${API_ENDPOINTS.MOZILLA}/results?id=${scanId.scan_id}`);
    const tlsData = await resultsResponse.json();
    console.log('TLS data:', tlsData);

    // Combine and analyze results
    const cryptoAnalysis = {
      keyExchange: tlsData.connection_info?.cipher?.kex || null,
      signature: certData[0]?.cert?.signature_algorithm || null,
      symmetric: tlsData.connection_info?.cipher?.name || null
    };
    
    console.log('Crypto analysis:', cryptoAnalysis);

    const result: TLSInfo = {
      host: domain,
      status: 'READY',
      protocols: tlsData.connection_info?.protocols || [],
      cipher: cryptoAnalysis.symmetric,
      certInfo: {
        subject: certData[0]?.dns_names?.[0] || domain,
        issuer: certData[0]?.cert?.issuer?.name || null,
        validFrom: certData[0]?.cert?.not_before || null,
        validTo: certData[0]?.cert?.not_after || null,
        signatureAlgorithm: cryptoAnalysis.signature,
        keySize: tlsData.connection_info?.cert?.key?.size || null
      },
      pqStatus: analyzePQStatus(cryptoAnalysis),
      cryptography: analyzeCryptoDetails(cryptoAnalysis)
    };

    console.log('Final analysis:', result);
    console.groupEnd();
    return result;

  } catch (error) {
    console.error('❌ Analysis failed:', error);
    console.groupEnd();
    return {
      host: domain,
      status: 'ERROR',
      protocols: ['Connection failed', 'Domain might not exist'],
      cipher: null,
      certInfo: {
        subject: domain,
        issuer: null,
        validFrom: null,
        validTo: null,
        signatureAlgorithm: null,
        keySize: null
      },
      pqStatus: 'red',
      cryptography: {
        keyExchange: null,
        signature: null,
        symmetric: null
      }
    };
  }
};

// Improve analysis functions with logging
const analyzePQStatus = (cryptoAnalysis: any): "green" | "yellow" | "red" => {
  const analysis = {
    hasQuantumKex: PQ_INDICATORS.keyExchange.some(ind => 
      cryptoAnalysis.keyExchange?.toLowerCase().includes(ind)),
    hasQuantumSig: PQ_INDICATORS.signatures.some(ind => 
      cryptoAnalysis.signature?.toLowerCase().includes(ind)),
    hasStrongSymm: PQ_INDICATORS.symmetric.some(ind => 
      cryptoAnalysis.symmetric?.toLowerCase().includes(ind))
  };
  
  console.log('PQ status analysis:', analysis);
  
  if (analysis.hasQuantumKex || analysis.hasQuantumSig) return 'green';
  if (analysis.hasStrongSymm) return 'yellow';
  return 'red';
};

// Analyze cryptographic details for key exchange, signature, and symmetric algorithms
const analyzeCryptoDetails = (cryptoAnalysis: any): {
  keyExchange: CryptoDetails | null;
  signature: CryptoDetails | null;
  symmetric: CryptoDetails | null;
} => {
  const analyze = (type: 'keyExchange' | 'signature' | 'symmetric', value: string | null): CryptoDetails | null => {
    if (!value) return null;
    const val = value.toLowerCase();
    let family = 'unknown';
    let strength: 'classical' | 'hybrid' | 'quantum' = 'classical';

    if (CRYPTO_FAMILIES[type].quantum.some(q => val.includes(q))) {
      family = 'quantum';
      strength = 'quantum';
    } else if ((CRYPTO_FAMILIES[type] as any).hybrid && (CRYPTO_FAMILIES[type] as any).hybrid.some((h: string) => val.includes(h))) {
      family = 'hybrid';
      strength = 'hybrid';
    } else if (CRYPTO_FAMILIES[type].classical.some(c => val.includes(c))) {
      family = 'classical';
      strength = 'classical';
    }

    return {
      family,
      algorithm: value,
      strength,
      details: undefined
    };
  };

  return {
    keyExchange: analyze('keyExchange', cryptoAnalysis.keyExchange),
    signature: analyze('signature', cryptoAnalysis.signature),
    symmetric: analyze('symmetric', cryptoAnalysis.symmetric)
  };
};