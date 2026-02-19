import { main } from "../service.js/aiService.js";

export const AiController = async (req, resp) => {
  try {

    const { messes } = req.body;

    if (!messes) {
      return resp.status(400).json({ error: "Prompt is required" });
    }

    const response = await main(messes);

    resp.status(200).json({
      success: true,
      reply: response
    });

  } catch (error) {
    console.error("Controller Error:", error);
    return resp.status(500).json({
      error: "Internal Server Error",
      message: error.message
    });
  }
};
