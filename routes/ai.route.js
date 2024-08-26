const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/place-description/:place/:location", async (req, res) => {
  const { place, location } = req.params;

  try {
    // Send a request to the Hugging Face model
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/EleutherAI/gpt-neo-2.7B", // Use the GPT-Neo model
      {
        inputs: `Describe the ${place} in ${location}. Include its history, design, and significance. Provide information in 5 bullet points.`,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGING_FACE_API_TOKEN}`, // Your Hugging Face API token
          "Content-Type": "application/json",
        },
      }
    );

    // Check if the response contains generated text
    if (response.data && response.data[0] && response.data[0].generated_text) {
      const description = response.data[0].generated_text;

      // Return the description as JSON to be processed by frontend
      res.json({ description });
    } else {
      res.status(500).json({ error: "No description found in the response." });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred while fetching the description." });
  }
});

module.exports = router;
