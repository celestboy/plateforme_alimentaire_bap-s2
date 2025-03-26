import ContactForm from "./_components/ContactForm";

export default function Contact() {
  return (
    <>
      <div className="w-screen h-20 bg-base-green flex items-center justify-center">
        <h3 className="font-futuraPTMedium text-white text-3xl">
          Nous contacter
        </h3>
      </div>

      <div className="w-screen flex items-center justify-center my-10">
        <ContactForm />
      </div>
    </>
  );
}
