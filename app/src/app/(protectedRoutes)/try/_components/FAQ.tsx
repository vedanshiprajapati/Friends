"use client";

import React, { useRef, useState } from "react";

export const FAQ = () => {
  const faqs = [
    {
      question: "Lorem ipsum dolor sit amet consectetur?",
      answer:
        "Lorem ipsum dolor sit amet consectetur. Vulputate amet aliquet morbi suspendisse convallis. Urna a urna lectus donec felis risus duis pellentesque. Pellentesque ultricies ipsum.",
      isOpen: false,
    },
    {
      question: "Lorem ipsum dolor sit amet consectetur?",
      answer:
        "Lorem ipsum dolor sit amet consectetur. Vulputate amet aliquet morbi suspendisse convallis. Urna a urna lectus donec felis risus duis pellentesque. Pellentesque ultricies ipsum.",
      isOpen: false,
    },
    {
      question: "Lorem ipsum dolor sit amet consectetur",
      answer:
        "Lorem ipsum dolor sit amet consectetur. Vulputate amet aliquet morbi suspendisse convallis. Urna a urna lectus donec felis risus duis pellentesque. Pellentesque ultricies ipsum.",
      isOpen: false,
    },
    {
      question: "Lorem ipsum dolor sit amet consectetur?",
      answer:
        "Lorem ipsum dolor sit amet consectetur. Vulputate amet aliquet morbi suspendisse convallis. Urna a urna lectus donec felis risus duis pellentesque. Pellentesque ultricies ipsum.",
      isOpen: false,
    },
    {
      question: "Lorem ipsum dolor sit amet consectetur?",
      answer:
        "Lorem ipsum dolor sit amet consectetur. Vulputate amet aliquet morbi suspendisse convallis. Urna a urna lectus donec felis risus duis pellentesque. Pellentesque ultricies ipsum.",
      isOpen: false,
    },
  ];

  return (
    <section className="flex flex-col pt-11 pr-36 pb-24 pl-24 bg-zinc-50 max-md:px-5">
      <h1 className="self-start text-5xl font-bold tracking-tighter uppercase text-neutral-800 max-md:max-w-full">
        FREQUENTLY ASKED QUESTIONS (FAQs)
      </h1>
      <div className="mt-28 w-full text-lg text-black max-md:mt-10 max-md:max-w-full">
        <div className="w-full max-md:max-w-full">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={faq.isOpen}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
}

export const FAQItem: React.FC<FAQItemProps> = ({
  question,
  answer,
  isOpen: initialIsOpen,
}) => {
  const [isOpen, setIsOpen] = useState(initialIsOpen);
  const contentRef = useRef<HTMLDivElement>(null);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <article className="flex flex-wrap gap-10 justify-between items-start px-10 py-8 w-full border-t border-neutral-900 border-opacity-20 max-md:px-5 max-md:max-w-full">
      <div className="self-stretch min-w-60 w-[1015px] max-md:max-w-full">
        <h2 className="font-semibold leading-none">{question}</h2>
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
          ref={contentRef}
        >
          {answer && (
            <p className="mt-2.5 leading-6 max-md:max-w-full transition-opacity duration-300">
              {answer}
            </p>
          )}
        </div>
      </div>
      <button
        onClick={toggleOpen}
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${question}`}
        className="focus:outline-none transition-transform duration-300 ease-in-out"
        style={{
          transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
        }}
      >
        <img
          loading="lazy"
          src={
            isOpen
              ? "https://cdn.builder.io/api/v1/image/assets/TEMP/1c45d68c3d95f28ecd4a50eb57606a0c9d86f830743b2c95415aca5aa425a5be?placeholderIfAbsent=true&apiKey=4a9f9f2f63444dc59963932547b4ea70"
              : "https://cdn.builder.io/api/v1/image/assets/TEMP/72054dd18705552e5f0e30a496c940a2d33a8011f04a0f908c9e09e6b5bd210f?placeholderIfAbsent=true&apiKey=4a9f9f2f63444dc59963932547b4ea70"
          }
          alt={isOpen ? "Collapse answer" : "Expand answer"}
          className="object-contain shrink-0 w-6 aspect-square"
        />
      </button>
    </article>
  );
};
