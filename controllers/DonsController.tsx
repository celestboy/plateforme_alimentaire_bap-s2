import { DonSchemaType, ValidateSchemaType } from "@/types/forms";
import prisma from "../prisma/prisma";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

class DonsController {
  async getDonInfo(id_don: number) {
    const don = await prisma.dons.findUnique({
      where: { don_id: id_don },
    });
    return don;
  }

  async index() {
    const dons = await prisma.dons.findMany();
    return dons;
  }

  async store(data: DonSchemaType, donneur_id: number, file: File) {
    let img_url = "";

    try {
      console.log("Données reçues dans store:", data, donneur_id, file);
      // Vérification du type et de la taille du fichier
      const MAX_SIZE = 5 * 2048 * 2048; // 5 Mo
      const ALLOWED_TYPES = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/webp",
      ];

      if (file.size > MAX_SIZE) {
        throw new Error(
          "Le fichier est trop grand. La taille maximale est de 5 Mo."
        );
      }

      if (!ALLOWED_TYPES.includes(file.type)) {
        throw new Error(
          "Type de fichier non autorisé. Veuillez télécharger une image JPEG, PNG, JPG ou WEBP."
        );
      }

      // Créer le répertoire si nécessaire
      const uploadDir = path.join(process.cwd(), "/public/uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Générer un nom de fichier unique pour éviter les conflits
      const fileExtension = path.extname(file.name);
      const fileName = `${uuidv4()}${fileExtension}`;
      const filePath = path.join(uploadDir, fileName);

      // Écrire le fichier sur le serveur
      const buffer = await file.arrayBuffer();
      fs.writeFileSync(filePath, Buffer.from(buffer));

      // URL du fichier téléchargé
      img_url = `/uploads/${fileName}`;

      const { title, description, category, quantity, limit_date, rdv_pts } =
        data;

      const parsedLimitDate = new Date(limit_date);
      if (isNaN(parsedLimitDate.getTime())) {
        throw new Error(
          "Date invalide, assurez-vous qu'elle est au format ISO-8601."
        );
      }
      const parsedPts =
        typeof rdv_pts === "string" ? JSON.parse(rdv_pts) : rdv_pts;

      try {
        const don = await prisma.dons.create({
          data: {
            title,
            description,
            category,
            quantity,
            limit_date: parsedLimitDate,
            rdv_pts: parsedPts,
            donneur_id,
            img_url,
          },
        });
        return don;
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.stack);
      }
    } catch (err: unknown) {
      console.error(err);
      const error = err as Error;
      console.error(error.stack);
    }
  }

  async show(id_don: number) {
    const result = await prisma.dons.findUnique({
      where: {
        don_id: id_don,
      },
    });
    return result;
  }

  async update(data: DonSchemaType, id_don: number) {
    const don = await prisma.dons.update({
      where: { don_id: id_don },
      data: { ...data },
    });
    return don;
  }

  async destroy(id_don: number) {
    const don = await prisma.dons.delete({
      where: { don_id: id_don },
    });
    return don;
  }

  async filter(location: string) {
    const dons = await prisma.dons.findMany({
      where: {
        lieu: {
          contains: location,
        },
      },
      orderBy: {
        publishedAt: "desc",
      },
    });
    return dons;
  }

  async validateRDV(info: ValidateSchemaType) {
    const id_don = info.id_don;

    const parsedHeureValid = new Date(info.heure);
    if (isNaN(parsedHeureValid.getTime())) {
      throw new Error(
        "Date invalide, assurez-vous qu'elle est au format ISO-8601."
      );
    }

    const changeStatus = await prisma.dons.update({
      where: {
        don_id: id_don,
      },
      data: {
        archived: true,
        lieu: info.lieu,
        Heure: parsedHeureValid,
      },
    });

    return changeStatus;
  }

  async pastLimitDate(id_don: number) {
    const currentDate = new Date();

    const don = await prisma.dons.deleteMany({
      where: {
        don_id: id_don,
        limit_date: {
          lt: currentDate,
        },
      },
    });
    return don;
  }
}

const DonsControllerInstance = new DonsController();
export default DonsControllerInstance;
