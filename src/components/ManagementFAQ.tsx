export const ManagementFAQ = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">
      <h2 className="text-2xl font-bold mb-6">Management FAQ</h2>

      <div className="space-y-4">
        <details className="group">
          <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
            <span>Why invest now?</span>
            <span className="transition group-open:rotate-180">▼</span>
          </summary>
          <p className="mt-3 text-gray-600">
            SN/DL risks are immediate, supply chains need lead time, and emergency migrations are costly.
          </p>
        </details>

        <details className="group">
          <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
            <span>What's a practical next-steps plan?</span>
            <span className="transition group-open:rotate-180">▼</span>
          </summary>
          <p className="mt-3 text-gray-600">
            1. Form core team
            2. Create crypto inventory
            3. Prioritize long-lived data protection
            4. Start pilots with liboqs/oqs-provider
            5. Develop roadmap with clear milestones
          </p>
        </details>
      </div>
    </div>
  );
};