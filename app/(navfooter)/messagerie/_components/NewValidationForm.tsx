import React, { useEffect } from "react";
import { X } from "lucide-react";
import { ValidateSchema } from "@/app/schema";
import { ValidateSchemaType } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import validateForm from "@/actions/validate-form";
import { toast } from "sonner";

export default function ValidationForm({
  onSendForm,
  donId,
  onClose,
}: {
  onSendForm: (validationMessage: { lieu: string; heure: string }) => void;
  donId: number | null;
  onClose: () => void;
}) {
  const { register, handleSubmit, watch, formState } =
    useForm<ValidateSchemaType>({
      resolver: zodResolver(ValidateSchema),
      mode: "onChange",
    });

  const lieu = watch("lieu");
  const heure = watch("heure");

  const handleSubmitForm = async (data: ValidateSchemaType) => {
    if (!donId) {
      toast.error("Erreur : Aucun ID de don trouvé.", {
        icon: <X className="text-white" />,
        className: "bg-red-500 border border-red-200 text-white text-base",
      });
      return;
    }

    const response = await validateForm(data, donId);
    if (response.success) {
      onSendForm({ lieu, heure });
      onClose();
    } else {
      toast.error(response.message || response.errors?.[0]?.message, {
        icon: <X className="text-white" />,
        className: "bg-red-500 border border-red-200 text-white text-base",
      });
    }
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
