import React, { useEffect, useState } from "react";
import { Clock, Pin, X } from "lucide-react";
import { ValidateSchema } from "@/app/schema";
import { ValidateSchemaType } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import updatePendingStatus from "@/actions/update-is-don-pending";
import { DonStatus } from "@prisma/client";
import { socket } from "@/lib/socketClient";

interface Filters {
  id: number;
  type: string;
  name: string;
  value: string;
}

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

  const [lieux, setLieux] = useState<Filters[]>([]);

  const lieu = watch("lieu");
  const heure = watch("heure");

  useEffect(() => {
    if (donId !== null) {
      setValue("id_don", donId);
    }
  }, [donId, chatId, setValue]);

  useEffect(() => {
    fetch("/data/filters.json")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setLieux(data);
        } else {
          throw new Error("Invalid data format");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleSubmitForm = async (data: ValidateSchemaType) => {
    if (!donId) {
      toast.error("Erreur : Aucun ID de don trouvé.", {
        icon: <X className="text-white" />,
        className: "bg-red-500 border border-red-200 text-white text-base",
      });
      return;
    }
    console.log("data", data);

    // Emit the status update via socket FIRST for immediate UI feedback
    socket.emit("status_update", {
      room: chatId,
      donId: donId,
      status: DonStatus.PENDING,
      updatedAt: new Date().toISOString(),
    });
    console.log("status update emitted for immediate feedback");

    // Then update the database
    const updateResult = await updatePendingStatus(donId, chatId);
    console.log("updateResult", updateResult);

    onSendForm({ lieu: data.lieu, heure: data.heure });
    onClose();
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
          <div className="my-4 w-[85%] mx-auto flex flex-col gap-10">
            <input type="hidden" {...register("id_don")} />
            <div className="flex flex-col justify-center gap-2">
              <span className="font-semibold text-gray-600 flex items-center font-futuraPTMedium">
                <Pin className="mr-4" size={22} />
                Lieu*
              </span>
              <select
                {...register("lieu", { required: true })}
                defaultValue=""
                className="appearance-none 
                    w-full 
                    pl-6 
                    py-2 
                    border 
                    border-gray-300 
                    rounded-full 
                    bg-white 
                    text-gray-900 
                    focus:outline-none 
                    focus:ring-2 
                    focus:ring-base-green 
                    focus:border-base-green
                    pr-10
                    bg-transparent
                    bg-no-repeat
                    bg-right
                    bg-[length:1.5rem_1.5rem]
                  "
              >
                <option value="">Sélectionnez un lieu</option>
                {lieux
                  .filter((lieu) => lieu.type === "location")
                  .map((lieu) => (
                    <option
                      key={lieu.id}
                      value={lieu.value}
                      className="bg-white"
                    >
                      {lieu.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="flex flex-col justify-center gap-2">
              <span className="font-semibold font-futuraPTBook text-gray-600 flex items-center">
                <Clock className="mr-4" size={22} />
                Heure*
              </span>
              <input
                type="datetime-local"
                className="w-full 
                    px-6 
                    py-2 
                    border 
                    border-gray-300 
                    rounded-full"
                {...register("heure", { required: true })}
              />
            </div>
          </div>
          <div className="flex justify-center items-center">
            <button
              type="submit"
              className="bg-base-green px-6 py-3 rounded-full transition-colors hover:bg-dark-blue hover:text-white"
            >
              Je valide l&apos;heure et le lieu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
