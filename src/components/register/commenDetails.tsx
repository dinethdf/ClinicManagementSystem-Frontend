"use client";
import React, { useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import { ChevronDownIcon, EyeCloseIcon, EyeIcon, TimeIcon } from "@/icons";

import DatePicker from "@/components/form/date-picker";

export default function CommenDetailsForm() {
  const [showPassword, setShowPassword] = useState(false);
  const options = [
    { value: "marketing", label: "Marketing" },
    { value: "template", label: "Template" },
    { value: "development", label: "Development" },
  ];

  const genderOption = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
  ];
  const handleSelectChange = (value: string) => {
    console.log("Selected value:", value);
  };
  return (
    <ComponentCard title="Patient Details">
      <div className="space-y-6">
        <div>
          <Label>First Name</Label>
          <Input type="text" name="firstName" placeholder="Enter First Name" />
        </div>
        <div>
          <Label>Last Name</Label>
          <Input type="text" name="lastName" placeholder="Enter Last Name" />
        </div>
        <div>
          <Label>Name with Initials</Label>
          <Input type="text" name="nameWithInit" placeholder="A.B.C Perera" />
        </div>
        <div>
          <DatePicker
            id="date-picker"
            label="Date Of Birth"
            placeholder="Select a date"
            onChange={(dates, currentDateString) => {
              console.log({ dates, currentDateString });
            }}
          />
        </div>
        <div>
          <Label>Gender</Label>
          <div className="relative">
            <Select
              options={genderOption}
              placeholder="Select an option"
              onChange={handleSelectChange}
              className="dark:bg-dark-900"
            />
            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
              <ChevronDownIcon />
            </span>
          </div>
        </div>
        <div>
          <Label>Address</Label>
          <Input type="text" name="address" placeholder="Enter Address" />
        </div>
      </div>
    </ComponentCard>
  );
}
