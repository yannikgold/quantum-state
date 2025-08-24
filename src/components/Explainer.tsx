export const Explainer = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">
      <h2 className="text-2xl font-bold mb-6">Steal Now, Decrypt Later (SN/DL)</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="border-2 border-gray-200 rounded-xl p-4 text-center">
          <h3 className="font-bold mb-2">Today</h3>
          <p className="text-sm">Data encrypted with classical algorithms (RSA/ECC) is transmitted and stored</p>
        </div>
        
        <div className="border-2 border-gray-200 rounded-xl p-4 text-center">
          <h3 className="font-bold mb-2">Harvest</h3>
          <p className="text-sm">Adversaries collect and store encrypted data for future decryption</p>
        </div>
        
        <div className="border-2 border-gray-200 rounded-xl p-4 text-center">
          <h3 className="font-bold mb-2">Tomorrow</h3>
          <p className="text-sm">Quantum computers break classical crypto, revealing historical data</p>
        </div>
      </div>

      <h3 className="font-bold mb-4">Why Act Now?</h3>
      <ul className="list-disc list-inside space-y-2">
        <li>Long-lived data requires protection beyond quantum timeline</li>
        <li>Regulatory requirements and compliance frameworks</li>
        <li>Contract and intellectual property protection</li>
        <li>Reputational risks from future breaches</li>
      </ul>
    </div>
  );
};
