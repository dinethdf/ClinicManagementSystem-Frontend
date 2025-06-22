"use client";
import React, { useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import { ChevronDownIcon, EyeCloseIcon, EyeIcon, TimeIcon } from "@/icons";

import { EnvelopeIcon } from "@/icons";
import PhoneInput from "@/components/form/group-input/PhoneInput";

import DatePicker from "@/components/form/date-picker";
import ContactDetails from "./ContactDetails";
import InputGroup from "../form/form-elements/InputGroup";

export default function PatientRegistrationForm() {
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

  const countries = [
    { code: "LKA", label: "+94" },
    { code: "US", label: "+1" },
    { code: "AU", label: "+61" },
  ];
  const handlePhoneNumberChange = (phoneNumber: string) => {
    console.log("Updated phone number:", phoneNumber);
  };

  const handleSelectChange = (value: string) => {
    console.log("Selected value:", value);
  };
  return (
<>
      <div className="col-span-1 lg:col-span-1 space-y-6">
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
      </div>

      <div className="col-span-1 space-y-6">
        <ComponentCard title="Input Group">
          <div className="space-y-6">
            <div>
              <Label>Email</Label>
              <div className="relative">
                <Input
                  placeholder="info@gmail.com"
                  type="text"
                  className="pl-[62px]"
                />
                <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
                  <EnvelopeIcon />
                </span>
              </div>
            </div>
            <div>
              <Label>Phone</Label>
              <PhoneInput
                selectPosition="start"
                countries={countries}
                placeholder="+94 71-000-0000"
                onChange={handlePhoneNumberChange}
              />
            </div>
          </div>
        </ComponentCard>

        <ComponentCard title="Input Group">
          <div className="space-y-6">
            <div className="-mt-4">
              <Label>Email</Label>
              <div className="relative">
                <Input
                  placeholder="info@gmail.com"
                  type="text"
                  className="pl-[62px]"
                />
                <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
                  <EnvelopeIcon />
                </span>
              </div>
            </div>
            <div>
              <Label>Phone</Label>
              <PhoneInput
                selectPosition="start"
                countries={countries}
                placeholder="+1 (555) 000-0000"
                onChange={handlePhoneNumberChange}
              />
            </div>{" "}
            <div>
              <Label>Phone</Label>
              <PhoneInput
                selectPosition="end"
                countries={countries}
                placeholder="+1 (555) 000-0000"
                onChange={handlePhoneNumberChange}
              />
            </div>
          </div>
       </ComponentCard>
      </div> 
</>
  );
}
