import ClientLayout from "../client-layout";
import PublishDonForm from "./_components/PublishDonForm";

export default function PublierDon() {
  return (
    <ClientLayout>
      <div>
        <h3 className="bg-[#B0C482] mb-12 p-8 text-center text-white text-4xl font-futuraPTBook">
          Je veux donner
        </h3>
        <div>
          <PublishDonForm />
        </div>
      </div>
    </ClientLayout>
  );
}
