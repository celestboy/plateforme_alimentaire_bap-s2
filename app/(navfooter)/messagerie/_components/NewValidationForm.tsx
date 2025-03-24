import React, { useEffect } from "react";
import { X } from "lucide-react";
import { ValidateSchema } from "@/app/schema";
import { ValidateSchemaType } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import updateFormStatus from "@/actions/update-form-status";

export default function ValidationForm({
  donId,
  chatId,
  onSendForm,
  onClose,
}: {
  donId: number | null;
  chatId: number;
  onSendForm: (validationMessage: { lieu: string; heure: string }) => void;

  onClose: () => void;
}) {
  const { register, handleSubmit, setValue, watch, formState } =
    useForm<ValidateSchemaType>({
      resolver: zodResolver(ValidateSchema),
      mode: "onChange",
    });

  const lieu = watch("lieu");
  const heure = watch("heure");

  useEffect(() => {
    if (donId !== null) {
      setValue("id_don", donId);
    }
  }, [donId, chatId, setValue]);

  const handleSubmitForm = async (data: ValidateSchemaType) => {
    if (!donId) {
      toast.error("Erreur : Aucun ID de don trouvé.", {
        icon: <X className="text-white" />,
        className: "bg-red-500 border border-red-200 text-white text-base",
      });
      return;
    }

    await updateFormStatus(donId, chatId);
    console.log("updated status");

    onSendForm({ lieu: data.lieu, heure: data.heure });
  };

  useEffect(() => {
    Object.values(formState.errors).forEach((error) => {
      if (error && "message" in error) {
        toast.error(error.message as string, {
          icon: <X className="text-white" />,
          className:
            "bg-red-500 !important border border-red-200 text-white text-base",
        });
      }
    });
  }, [formState.errors]);

  return (
    <div
      className="absolute mx-auto bg-nav-overlay-color w-full h-full top-0 left-0 z-[70]"
      onClick={onClose}
    >
      <div
        className="z-[60] h-screen w-screen flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <form
          onSubmit={handleSubmit(handleSubmitForm)}
          className="bg-white w-[700px] h-[400px] p-4 relative"
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-600 hover:text-black"
          >
            <X size={24} />
          </button>
          <h3 className="text-center uppercase font-futuraPTBold text-2xl">
            Formulaire de validation du don
          </h3>
          <div className="my-4 w-[85%] mx-auto flex flex-col gap-4">
            <div className="flex flex-col justify-center gap-2">
              <input type="hidden" {...register("id_don")} />
              <label className="font-futuraPTBook text-lg">Lieu*</label>
              <select
                {...register("lieu", { required: true })}
                defaultValue={undefined}
              >
                <option value="">Sélectionnez un lieu</option>
                <option value="Option A">Option A</option>
                <option value="Option B">Option B</option>
                <option value="Option C">Option C</option>
                <option value="Option D">Option D</option>
              </select>
            </div>
            <div className="flex flex-col justify-center gap-2">
              <label className="font-futuraPTBook text-lg">Heure*</label>
              <input
                type="datetime-local"
                {...register("heure", { required: true })}
              />
            </div>

            <button type="submit">Je valide l&apos;heure et le lieu</button>
          </div>
        </form>
      </div>
    </div>
  );
}
