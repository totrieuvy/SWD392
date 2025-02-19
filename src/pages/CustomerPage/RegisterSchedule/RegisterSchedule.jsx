import React from 'react'
import PatientSection from '../../../components/RegisterSchedule/PatientSection/PatientSection'
import GuardianSection from '../../../components/RegisterSchedule/GuardianSection/GuardianSection'
import ServiceSection from '../../../components/RegisterSchedule/ServiceSection/ServiceSection'

export default function RegisterSchedule() {
  return (
    <>
    <br/>
      <PatientSection/>
     
      <br/>
      <ServiceSection/>
    </>
  
  )
}
