"use client";

import React, { useRef } from "react";

const EssentialSupport = () => {
  const ref = useRef<HTMLDivElement>(null);

  // SVG Arrow component
  const ArrowSvg = () => (
    <svg className="w-full h-full absolute right-0 top-0" width="435" height="870" viewBox="0 0 435 870" fill="#a5cd39" opacity="0.8">
      <path d="M2.11156e-06 435.078C47.0011 388.077 280.87 154.13 435 0L435 29.3581L34.9961 434.867L435 847.715L435 869.733L2.11156e-06 435.078Z" fill="#a5cd39"></path>
      <path d="M22.0186 435.078C69.0197 388.077 280.87 183.488 435 29.3581V69.7254L64.3542 434.867L435 800.008L435 847.715L22.0186 435.078Z" fill="#a5cd39"></path>
    </svg>
  );

  const serviceCategories = [
    {
      title: "Registration Services",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
        </svg>
      ),
      services: [
        "Formation of a legal entity as an FZE and FZCO",
        "Formation of a branch of an entity lawfully existing outside of the free zone (branch of local company / foreign company)",
        "Transfer in from other jurisdictions in Dubai"
      ]
    },
    {
      title: "Licensing Services",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
        </svg>
      ),
      services: [
        "Issuance and renewal of licenses and Business Operating Permits (BOP)",
        "Amendment of licenses or BOP terms",
        "Cancellation of licenses and de-registration"
      ]
    },
    {
      title: "Visa Services",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z" />
        </svg>
      ),
      services: [
        "Issuance, renewals and cancellation of Residence Visas",
        "Issuance, renewals and cancellation of Temporary Work Permits",
        "Transfers and Medical Fitness arrangements"
      ]
    },
    {
      title: "Office Solutions",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
        </svg>
      ),
      services: [
        "Co-working Hubs and Flexi-Desks",
        "Private Executive Offices",
        "Business Centres and Serviced Offices",
        "Commercial Offices"
      ]
    },
    {
      title: "Value Added Services",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
        </svg>
      ),
      services: [
        "Bank Account Opening Assistance",
        "Corporate Accounting and Tax Services",
        "Mail Management",
        "Virtual Receptionist"
      ]
    }
  ];

  return (
    <section className="py-20 bg-gray-100 overflow-hidden relative" ref={ref}>
      {/* SVG Arrow on the right side */}
      <div className="absolute right-0 top-0 bottom-0 w-1/3 overflow-hidden z-10">
        <ArrowSvg />
      </div>

      <div className="container mx-auto px-4 relative z-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            Essential Support <span className="font-normal">Services</span>
          </h2>
          <div className="flex justify-center">
            <div className="h-1 bg-[#a5cd39] w-16 mt-2 mb-6"></div>
          </div>
          <p className="text-gray-600 max-w-3xl mx-auto">
            A range of essential and value-added services to support your operations, freeing you up to focus on what matters most - growing your business.
          </p>
        </div>

        {/* Top row with 4 cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 mb-8">
          {serviceCategories.slice(0, 4).map((category, index) => (
            <div
              key={index}
              className="flex flex-col bg-white p-6 border-r border-gray-200 last:border-r-0"
            >
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 rounded-full border-2 border-[#a5cd39] flex items-center justify-center text-[#a5cd39]">
                  {category.icon}
                </div>
                <div className="border-t border-gray-300 flex-grow ml-4"></div>
              </div>
              <h3 className="text-lg font-semibold mb-6">{category.title}</h3>
              <ul className="space-y-4">
                {category.services.map((service, serviceIndex) => (
                  <li key={serviceIndex} className="flex items-start">
                    <svg className="w-5 h-5 text-[#a5cd39] mr-2 mt-0.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-700">{service}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom row with Value Added Services card */}
        <div className="flex justify-start">
          <div className="flex flex-col bg-white p-6 border-r border-gray-200 w-full md:w-1/2 lg:w-1/4">
            <div className="flex items-center mb-6">
              <div className="w-14 h-14 rounded-full border-2 border-[#a5cd39] flex items-center justify-center text-[#a5cd39]">
                {serviceCategories[4].icon}
              </div>
              <div className="border-t border-gray-300 flex-grow ml-4"></div>
            </div>
            <h3 className="text-lg font-semibold mb-6">{serviceCategories[4].title}</h3>
            <ul className="space-y-4">
              {serviceCategories[4].services.map((service, serviceIndex) => (
                <li key={serviceIndex} className="flex items-start">
                  <svg className="w-5 h-5 text-[#a5cd39] mr-2 mt-0.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-700">{service}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex justify-center mt-16">
          <a
            href="#"
            className="bg-[#a5cd39] text-white px-10 py-3 rounded-md font-medium hover:bg-[#94b933] transition-colors duration-300 uppercase"
          >
            Learn More
          </a>
        </div>
      </div>
    </section>
  );
};

export default EssentialSupport;
