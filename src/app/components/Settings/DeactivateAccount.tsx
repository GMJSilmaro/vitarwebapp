"use client";

import Button from "../common/Button";

const DeactivateAccount: React.FC = () => {
  return (
    <div className="space-y-4 text-gray-900">
      <p>Once you deactivate your account, you will lose access to all data.</p>
      <Button label="Deactivate Account" type="button" />
    </div>
  );
};

export default DeactivateAccount;
