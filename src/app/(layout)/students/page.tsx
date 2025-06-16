'use client'

import React from 'react'


import { Tab, Tabs } from '@/components/custom/tabs/tab'



const PatientAdmission = () => {
  return (
    <React.Fragment>
    
      <div className="grid grid-cols-12 gap-x-space">
        <div className="col-span-12 xl:col-span-8 2xl:col-span-9">
          <div className="card">
            <div className="card-header">
              <Tabs
                ulProps="overflow-x-auto tabs-pills"
                otherClass="nav-item [&.active]:bg-primary-500 [&.active]:text-primary-50"
                activeTabClass="bg-primary-500 text-primary-50"
                inactiveTabClass="text-gray-500 hover:text-primary-500"
                contentProps="mt-4">
                <Tab label="Personal Details">
                  <div>dasdasd</div>
                </Tab>
                <Tab label="Guardian Details">
              <div>fgedgert</div>
                </Tab>
                <Tab label="Educational Background">
                  <div>dasdasdasd</div>
                </Tab>
                <Tab label="Documents">
                <div>asdasdasd</div>
                </Tab>
                <Tab label="Application Overview">
                <div>sdfsdfsdf</div>
                </Tab>
              </Tabs>
            </div>
          </div>
        </div>
       
      </div>
    </React.Fragment>
  )
}

export default PatientAdmission
