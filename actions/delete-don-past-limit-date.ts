import cron from "node-cron";
import DonsControllerInstance from "@/controllers/DonsController";

// Exécute tous les jours à minuit
cron.schedule("0 0 * * *", async () => {
  try {
    await DonsControllerInstance.deletePastLimitDate();
  } catch (error) {
    console.error("Erreur lors de la suppression des dons expirés:", error);
  }
});
