"use client";

import InputField from "../common/InputField";
import Button from "../common/Button";
import { useState } from "react";

const ChangePassword: React.FC = () => {
  const [new_password, setNewPassword] = useState("");
  const [confirm_password, setConfirmPassword] = useState("");
  return (
    <form className="space-y-6">
      <InputField
        id="new_password"
        label="New Password"
        placeholder=""
        value={new_password}
        onChange={(e) => setNewPassword(e.target.value)}
      />

      <InputField
        id="new_password"
        label="New Password"
        placeholder=""
        value={confirm_password}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <Button label="Update Password" type="submit" />
    </form>
  );
};

export default ChangePassword;
