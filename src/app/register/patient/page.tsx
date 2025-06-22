import PageBreadcrumb from "@/components/old-comp/common/PageBreadCrumb";
import CheckboxComponents from "@/components/form/form-elements/CheckboxComponents";
import DefaultInputs from "@/components/form/form-elements/DefaultInputs";
import DropzoneComponent from "@/components/form/form-elements/DropZone";
import FileInputExample from "@/components/form/form-elements/FileInputExample";
import InputGroup from "@/components/form/form-elements/InputGroup";
import InputStates from "@/components/form/form-elements/InputStates";
import RadioButtons from "@/components/form/form-elements/RadioButtons";
import SelectInputs from "@/components/form/form-elements/SelectInputs";
import TextAreaInput from "@/components/form/form-elements/TextAreaInput";
import ToggleSwitch from "@/components/form/form-elements/ToggleSwitch";
import { Metadata } from "next";
import React from "react";
import CommenDetailsForm from "@/components/register/CommenDetails";
import ContactDetails from "@/components/register/ContactDetails";
import PatientRegistrationForm from "@/components/register/PatientRegistrationForm";

const PatientRegister: React.FC = () => {
  return (
    <div>
      <PageBreadcrumb pageTitle="From Elements" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <PatientRegistrationForm />

        
    {/*    <div className="col-span-1 lg:col-span-1 space-y-6">
          <CommenDetailsForm /> 
        </div>
        <div className="col-span-1 space-y-6">
          <ContactDetails />
           <InputGroup />
        </div>

        <div className="col-span-1 space-y-6">
          <InputGroup />
        </div> 

         <div className="space-y-6">
          <DefaultInputs />
          <SelectInputs />
          <TextAreaInput />
          <InputStates />
        </div>
        <div className="space-y-6">
          <InputGroup />
          <FileInputExample />
          <CheckboxComponents />
          <RadioButtons />
          <ToggleSwitch />
          <DropzoneComponent />
        </div> */}
      </div>
    </div>
  );
};

export default PatientRegister;
