import React from 'react';

export default function PageDescriptionCard({ eyebrow, title, description, items }) {
  return (
    <section className="mb-8 overflow-hidden rounded-[6px] border border-[#F0C8CD] bg-[#FFF7F8]">
      <div className="flex flex-col gap-5 px-6 py-6 md:flex-row md:items-end md:justify-between md:px-8">
        <div className="min-w-0">
          <p className="text-[13px] font-900 uppercase tracking-normal text-[#FF4854]">{eyebrow}</p>
          <h1 className="mt-2 text-[26px] font-900 leading-tight text-[#171717] md:text-[34px]">
            {title}
          </h1>
          <p className="mt-3 max-w-[720px] text-[15px] font-600 leading-[26px] text-[#596575]">
            {description}
          </p>
        </div>

        {items?.length ? (
          <div className="grid shrink-0 grid-cols-3 divide-x divide-[#F0C8CD] rounded-[4px] border border-[#F0C8CD] bg-white">
            {items.map(item => (
              <div key={item.label} className="min-w-[96px] px-4 py-3 text-center">
                <p className="text-[18px] font-900 text-[#FF4854]">{item.value}</p>
                <p className="mt-1 whitespace-nowrap text-[11px] font-800 text-[#7B8491]">{item.label}</p>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
