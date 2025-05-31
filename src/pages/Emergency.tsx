import React from 'react'
import Layout from '../components/Layout'

function Emergency() {
    const contacts = [
      {
        service: "National Emergency Helpline",
        number: "📞 112",
        description: "Police, Fire, Medical (all-in-one emergency number)",
      },
      {
        service: "Fire Brigade",
        number: "📞 101",
        description: "Fire emergencies",
      },
      {
        service: "Ambulance Services",
        number: "📞 102",
        description: "Medical emergencies",
      },
      {
        service: "Police Helpline",
        number: "📞 100",
        description: "Law enforcement & security",
      },
      {
        service: "Madhya Pradesh Emergency Response",
        number: "📞 1070 / 0755-2441444",
        description: "Emergency response in Madhya Pradesh",
      },
      {
        service: "Chhattisgarh Disaster Helpline",
        number: "📞 1070 / 0771-2223471",
        description: "Disaster response in Chhattisgarh",
      },
      {
        service: "Rajasthan Disaster Control Room",
        number: "📞 0141-2385700",
        description: "Disaster control in Rajasthan",
      },
      {
        service: "Gujarat Emergency Helpline",
        number: "📞 1070 / 079-23259222",
        description: "Emergency helpline in Gujarat",
      },
      {
        service: "Maharashtra Disaster Helpline",
        number: "📞 022-22027990",
        description: "Disaster response in Maharashtra",
      },
    ];
  
    return (
      <Layout>
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-balance">Emergency Contacts</h1>
            <div className="mt-8">
              {contacts.map((contact, index) => (
                <div key={index} className="mb-4 p-4 border rounded shadow">
                  <h2 className="text-xl font-semibold">{contact.service}</h2>
                  <p>{contact.number}</p>
                  <p className="text-gray-600">{contact.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

export default Emergency