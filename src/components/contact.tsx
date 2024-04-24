import React from "react";
import { urlFor } from "@/lib/sanityImageBuilder";
import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { ContactProps } from "@/types";
import CustomPortableText from "@/helpers/CustomPortableText";

const Contact: React.FC<ContactProps> = ({ contact }) => {
  const flexDirection = contact.isReverse
    ? "md:flex-row-reverse"
    : "md:flex-row";

  return (
    <section className="w-screen p-4 md:p-12">
      <div className={`flex ${flexDirection} max-w-[1300px] mx-auto`}>
        <div className="flex-1 flex flex-col gap-4 md:p-4">
          {contact.title && (
            <h2 className="text-5xl font-bold">{contact.title}</h2>
          )}
          {contact.ingress && <p className="text-xl">{contact.ingress}</p>}
          {contact.content && <CustomPortableText content={contact.content} />}
        </div>
        <div className="flex-1 p-4">
          {contact.felt && (
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-2">
                <h2 className="text-3xl">Send oss en melding</h2>
                <p className="text-xl">
                  <span className="text-red-600 mr-2">*</span>obligatorisk felt
                  som du må fylle ut
                </p>
              </div>
              <form className="flex flex-col gap-4">
                {contact.felt.map((felt) => {
                  switch (felt.type) {
                    case "text":
                    case "number":
                    case "email":
                      return (
                        <div key={felt._key} className="flex flex-col gap-2">
                          <label
                            className="text-xl font-bold"
                            htmlFor={felt._key}
                          >
                            {felt.label}
                            {felt.required && (
                              <span className="ml-2 text-red-600">*</span>
                            )}
                          </label>
                          <input
                            type={felt.type}
                            id={felt._key}
                            name={felt.name}
                            placeholder={felt.placeholder}
                            className="border border-gray-400 p-4 text-xl"
                          />
                        </div>
                      );
                    case "textarea":
                      return (
                        <div key={felt._key} className="flex flex-col gap-2">
                          <label 
                          className="text-xl font-bold"
                          htmlFor={felt._key}>
                            {felt.label}
                            {felt.required && (
                              <span className="text-red-600 ml-2">*</span>
                            )}
                          </label>
                          <textarea
                            className="border border-gray-400 p-4 text-xl"
                            id={felt._key}
                            name={felt.name}
                            placeholder={felt.placeholder}
                          />
                        </div>
                      );
                    default:
                      return null;
                  }
                })}
                <button
                  type="submit"
                  className="bg-black font-bold text-xl w-fit px-12 text-white p-4 rounded-full"
                >
                  Send melding
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Contact;
