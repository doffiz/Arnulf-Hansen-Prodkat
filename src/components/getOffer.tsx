import React, { useState } from "react";
import { useForm } from "react-hook-form";

interface FormValues {
  name: string;
  email: string;
  message: string;
  telephone: string;
}

interface ContactFormProps {
  productName: string;
}

const ContactForm: React.FC<ContactFormProps> = ({ productName }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);

  const onSubmit = (data: FormValues) => {
    fetch("http://localhost:5000/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        telefon: data.telephone,
        message: data.message,
        subject: `Forespørsel om ${productName} fra arnulfhansen.no`,
      }),
    }).then(() => {
      setFormSubmitted(true);
    });
  };

  return (
    <div className="mt-4">
      <button
        onClick={() => setButtonClicked(true)}
        className="bg-slate-500 hover:bg-slate-700 border-2 transition-all duration-300 ease-in-out text-white px-4 py-2 w-full rounded"
      >
        Kontakt oss om denne varen
      </button>
      {buttonClicked &&
        (formSubmitted ? (
          <p>
            Takk for forespørselen! Vi tar kontakt så raskt det lar seg gjøre.
          </p>
        ) : (
          <form
            className="flex flex-col gap-2 my-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex flex-col">
              <label className="text-sm" htmlFor="name">
                Navn <span className="text-red-500">*</span>
              </label>
              <input
                className="border border-gray-300 p-2"
                {...register("name", { required: true })}
                placeholder="Ditt navn"
              />
              {errors.name && <span className="bg-red-500 text-white px-4 py-2 mt-2">Dette feltet er påkrevd</span>}
            </div>
            <div className="flex flex-col">
              <label htmlFor="email">
                E-post <span className="text-red-500">*</span>
              </label>
              <input
                className="border border-gray-300 p-2"
                {...register("email", { required: true })}
                placeholder="Din e-postadresse"
              />
              {errors.email && <span className="bg-red-500 text-white px-4 py-2 mt-2">Dette feltet er påkrevd</span>}
            </div>
            <div className="flex flex-col">
              <label htmlFor="telephone">
                Telefon <span className="text-red-500">*</span>
              </label>
              <input
                className="border border-gray-300 p-2"
                {...register("telephone", { required: true })}
                placeholder="Ditt telefonnummer"
              />
              {errors.telephone && <span className="bg-red-500 text-white px-4 py-2 mt-2">Dette feltet er påkrevd</span>}
            </div>
            <div className="flex flex-col">
              <label htmlFor="message">Melding</label>
              <textarea
                className="border border-gray-300 p-2"
                {...register("message")}
                placeholder="Din melding"
              />
            </div>
            <input
              className="cursor-pointer bg-slate-500 hover:bg-slate-700 border-2 transition-all duration-300 ease-in-out text-white px-4 py-2 w-full rounded"
              type="submit"
            />
          </form>
        ))}
    </div>
  );
};

export default ContactForm;
