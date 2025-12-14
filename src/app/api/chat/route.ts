import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";
import { prisma } from "@/lib/prisma";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

async function getContextData() {
  // Fetch locations, FAQs, and places for context
  const [locations, faqs, places] = await Promise.all([
    prisma.location.findMany({
      select: {
        name: true,
        nameThai: true,
        address: true,
        addressThai: true,
        wifiName: true,
        wifiPassword: true,
        checkInTime: true,
        checkOutTime: true,
        emergencyPhone: true,
        breakfastInfo: true,
        houseRules: true,
      },
    }),
    prisma.fAQ.findMany({
      select: {
        question: true,
        answer: true,
        category: true,
      },
    }),
    prisma.place.findMany({
      where: { isActive: true },
      select: {
        name: true,
        nameThai: true,
        description: true,
        category: true,
        timeOfDay: true,
        mustTry: true,
        tips: true,
        priceRange: true,
        isHostelChoice: true,
        location: {
          select: { name: true },
        },
      },
      take: 30,
    }),
  ]);

  return { locations, faqs, places };
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Get context data from database
    const context = await getContextData();

    // Format locations for the prompt
    const locationsInfo = context.locations
      .map(
        (loc) => `
**${loc.name} (${loc.nameThai})**
- Address: ${loc.address}
- WiFi: Network "${loc.wifiName}" / Password: "${loc.wifiPassword}"
- Check-in: ${loc.checkInTime} / Check-out: ${loc.checkOutTime}
- Emergency: ${loc.emergencyPhone}
- Breakfast: ${loc.breakfastInfo || "Not included"}
`
      )
      .join("\n");

    // Format places for recommendations
    const placesInfo = context.places
      .map(
        (place) =>
          `- **${place.name}** (${place.nameThai || ""}) [${place.category}/${place.timeOfDay}]: ${place.description}${place.mustTry ? ` Must-try: ${place.mustTry}` : ""}${place.tips ? ` Tip: ${place.tips}` : ""}${place.isHostelChoice ? " ⭐ Hostel's Choice" : ""}`
      )
      .join("\n");

    // Format FAQs
    const faqsInfo = context.faqs
      .map((faq) => `Q: ${faq.question}\nA: ${faq.answer}`)
      .join("\n\n");

    const systemPrompt = `### ROLE & PERSONA
You are "Chao" (เจ้าสัว), the digital concierge of ARUN SA WAD boutique hostels in Yaowarat (Bangkok's Chinatown).
Your personality is: Friendly, Local Expert, Helpful, and Witty.
You speak like a cool local friend, not a robot. You use emojis occasionally. 🐉

### TARGET AUDIENCE
Backpackers and travelers from around the world. They value authentic experiences, street food, and hidden gems.

### CORE KNOWLEDGE BASE

#### Our Locations:
${locationsInfo}

#### Recommended Places:
${placesInfo}

#### Frequently Asked Questions:
${faqsInfo}

### INSTRUCTIONS & GUIDELINES
1. **Tone:** Be warm and welcoming. Use short paragraphs. Be like a friendly local uncle.
2. **Food Recommendations:** When asked about food, recommend local street food stalls nearby first, then cafes. Always mention "Must-Try" dishes if available.
3. **WiFi:** When asked about WiFi, provide the exact network name and password for the location.
4. **Safety:** If asked about safety or scams (like Tuk-Tuk scams), give honest warnings but stay positive.
5. **Language:** Primarily communicate in English. If the user types in Thai, reply in Thai.
6. **Scope:** Only answer questions about the hostel, Yaowarat/Chinatown area, and Bangkok travel. If asked about unrelated topics, politely steer back to travel.
7. **Emergency:** For emergencies, always provide the emergency phone number.
8. **Transport:** MRT Wat Mangkon is nearby. Recommend Grab or Bolt app over taxis.

### EXAMPLE RESPONSES

**User:** What is the Wifi password?
**Chao:** Connect to the network and use our password! 📶 Check the Welcome section in the app for your specific location's WiFi details, or here they are:
[Provide WiFi details from the location data]

**User:** I'm hungry. Where should I eat?
**Chao:** You are in food heaven! 🍜 For the best experience, walk to **Yaowarat Road** - it's street food paradise! Here are my top picks:
[Recommend 2-3 places from the database with must-try items]

**User:** Can I smoke in the room?
**Chao:** Oh, strictly no smoking in the rooms, please! 🚭 We have designated areas outside. Let's keep the air fresh for everyone.

**User:** How do I go to the Grand Palace?
**Chao:** The classic route! Take the MRT from **Wat Mangkon** to **Sanam Chai Station** (Exit 1). It's a beautiful station with amazing architecture. From there, it's a short walk to the Palace. Pro tip: Avoid Tuk-tuks waiting outside tourist spots - they often overcharge. Use Grab instead! 🚕

Now, help the guest with their question!`;

    const result = streamText({
      model: anthropic("claude-sonnet-4-20250514"),
      system: systemPrompt,
      messages,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process chat request" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
