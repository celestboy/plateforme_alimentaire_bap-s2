import React from "react";
import { X } from "lucide-react";
import { ValidateSchema } from "@/app/schema";
import { ValidateSchemaType } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import validateForm from "@/actions/validate-form";
import { toast } from "sonner";
import { cn } from "@/utils/cn";

const ValidationForm = ({
  onSendForm,
}: {
  onSendForm: (validationMessage: { lieu: string; heure: string }) => void;
}) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting, isValid },
  } = useForm<ValidateSchemaType>({
    resolver: zodResolver(ValidateSchema),
    mode: "onChange",
  });

  const lieu = watch("lieu");
  const heure = watch("heure");

  const handleSubmitForm = async (data: ValidateSchemaType) => {
    const response = await validateForm(data, id_don);
    if (response.success) {
      onSendForm({ lieu, heure });
    } else {
      toast.error(response.message || response.errors?.[0]?.message, {
        icon: <X className="text-white" />,
        className: "bg-red-500 border border-red-200 text-white text-base",
      });
    }
  };

  return (
    <div className="mx-auto bg-black w-full h-[200px] z-40">
      <form
        onSubmit={handleSubmit(handleSubmitForm)}
        className="bg-white w-[700px] z-50 p-4"
      >
        <div>
          <label>Lieu</label>
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
        <div>
          <label>Heure</label>
          <input
            type="datetime-local"
            {...register("heure", { required: true })}
          />
        </div>
        <button
          type="submit"
          className={cn(
            (isSubmitting || !isValid) && "!cursor-not-allowed opacity-40"
          )}
          disabled={isSubmitting || !isValid}
        >
          Je valide l&apos;heure et le lieu
        </button>
      </form>
    </div>
  );
};

export default ValidationForm;
