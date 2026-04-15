const express = require('express');
const router  = express.Router();
require('dotenv').config();
 
router.post('/', async (req, res) => {
  const { from, to, budget, days, people, type, preferences } = req.body;
 
  if (!from || !to)
    return res.status(400).json({ error: 'From and To cities are required!' });
 
  if (!process.env.GROQ_API_KEY)
    return res.status(500).json({ error: 'GROQ_API_KEY is not set in .env file!' });
 
  console.log(`AI Request: ${from} → ${to}, ₹${budget}, ${days} days, ${people} people`);
 
  const prompt = `You are a helpful and friendly Indian travel assistant. Plan a ${days}-day trip from ${from} to ${to} for ${people || 1} person(s) with a total budget of ₹${budget}. Trip type: ${type || 'budget'}. ${preferences ? 'Special preferences: ' + preferences : ''}
 
Reply in this exact structure:
 
### 1. 🌐 Ways to Reach ${to}
 
List 2-3 real transport options (train, bus, car, flight if applicable).
For each option write:
* **By Train** (or Bus/Car/Flight): description, duration, cost per person, and a booking link like [Check Trains](https://www.irctc.co.in) or [Book Bus](https://www.redbus.in) or [Book Flight](https://www.makemytrip.com)
 
### 2. 🏨 Where to Stay in ${to}
 
Give exactly 3 hotel options based on real hotels in ${to}:
* **Budget Stay: Hotel Name** 🏨
* Price: Approx ₹X - ₹Y per night
* Why it's good: one line reason
* [View Details & Book](https://www.booking.com)
 
* **Comfort Stay: Hotel Name** 🏨
* Price: Approx ₹X - ₹Y per night
* Why it's good: one line reason
* [View Details & Book](https://www.booking.com)
 
* **Luxury Stay: Hotel Name** 🏨
* Price: Approx ₹X - ₹Y per night
* Special Experience: one line
* [View Details & Book](https://www.booking.com)
 
### 3. 🗓️ Your ${days}-Day Itinerary
 
Give a day-by-day plan with real places, temples, restaurants, experiences.
 
**Day 1: Title ✨**
* Activity with real place name
* Activity with real place name
* Activity with real place name
 
(continue for all ${days} days)
 
### ✅ Booking & Reservation Summary
 
* ✈️ **Flight Booking** — [Book Flight](https://www.makemytrip.com/flights)
* 🏨 **Hotel Booking** — [Compare and Book](https://www.booking.com)
* 🚌 **Bus/Train Booking** — [Book Here](https://www.irctc.co.in)
 
End with one warm encouraging line about the trip.`;
 
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful Indian travel planning assistant. Give practical, budget-conscious advice with real place names, real hotel names, and real booking links. Always be warm and encouraging.'
          },
          { role: 'user', content: prompt }
        ],
        max_tokens: 2500,
        temperature: 0.7
      })
    });
 
    const data = await response.json();
 
    if (!response.ok) {
      console.error('Groq error:', data.error);
      return res.status(502).json({ error: 'Groq API error: ' + (data.error?.message || 'Unknown error') });
    }
 
    const text = data.choices[0].message.content;
    console.log('AI response received, length:', text.length);
    res.json({ text });
 
  } catch (err) {
    console.error('AI route error:', err.message);
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});
 
module.exports = router;
 