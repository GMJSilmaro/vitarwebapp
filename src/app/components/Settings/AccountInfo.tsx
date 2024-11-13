"use client";

import { useState } from "react";
import InputField from "../common/InputField";
import Button from "../common/Button";

const AccountInfo: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");

  const [emailAdd, setEmailAddress] = useState("");

  return (
    <form className="space-y-6">
      <InputField
        id="first_name"
        label="First Name"
        placeholder="ex. Contact Details"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />

      <InputField
        id="middle_name"
        label="Middle Name"
        placeholder="ex. Contact Details"
        value={middleName}
        onChange={(e) => setMiddleName(e.target.value)}
      />

      <InputField
        id="last_name"
        label="Last Name"
        placeholder="ex. Contact Details"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      />

      <InputField
        id="email_address"
        label="Email Address"
        placeholder="ex. Contact Details"
        value={emailAdd}
        onChange={(e) => setEmailAddress(e.target.value)}
      />
      <Button label="Save Changes" type="submit" />
    </form>
  );
};

export default AccountInfo;
