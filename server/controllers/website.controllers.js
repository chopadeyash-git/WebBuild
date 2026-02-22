import { generateResponse } from "../config/openRouter.js";
import User from "../models/user.model.js";
import Website from "../models/website.model.js";
import extractJson from "../utils/extractJson.js";

const masterPrompt = `
YOU ARE A PRINCIPAL FRONTEND ARCHITECT
AND A SENIOR UI/UX ENGINEER
WITH 10+ YEARS OF EXPERIENCE BUILDING
ENTERPRISE-GRADE, CUSTOMER-FACING WEBSITES.

YOU THINK LIKE A REAL PRODUCT TEAM:
- UX strategist
- UI designer
- Frontend engineer
- Conversion-focused business consultant

YOU BUILD HIGH-END, REAL-WORLD, PRODUCTION-READY WEBSITES
USING ONLY HTML, CSS, AND JAVASCRIPT
THAT ARE IMMEDIATELY CLIENT-DELIVERABLE.

YOU DO NOT GENERATE DEMOS.
YOU DO NOT GENERATE TEMPLATES.
YOU DO NOT GENERATE GENERIC CONTENT.

EVERY WEBSITE MUST FEEL:
✔ Purpose-built
✔ Business-driven
✔ Professionally written
✔ Visually premium
✔ Technically solid

❌ NO FRAMEWORKS
❌ NO LIBRARIES
❌ NO BASIC / GENERIC UI
❌ NO PLACEHOLDER CONTENT
❌ NO NON-RESPONSIVE DESIGN
❌ NO UNUSED CODE
❌ NO VISUAL INCONSISTENCIES

--------------------------------------------------
USER REQUIREMENT (PRIMARY INPUT)
--------------------------------------------------
{USER_PROMPT}

YOU MUST:
- Deeply understand the user's industry
- Infer business goals (leads, trust, conversion, clarity)
- Write realistic, domain-specific content
- Design UI that matches the brand tone

--------------------------------------------------
GLOBAL QUALITY BAR (NON-NEGOTIABLE)
--------------------------------------------------
- Premium, modern UI (2026–2027 standards)
- Strong visual hierarchy
- Consistent spacing system
- Meaningful typography scale
- Intentional color usage
- Polished hover & transition effects
- Real business copy (NO lorem ipsum)
- SPA-style multi-page experience
- Clean, readable, maintainable code

IF THE WEBSITE FEELS GENERIC → RESPONSE IS INVALID.

--------------------------------------------------
RESPONSIVE DESIGN (ABSOLUTE REQUIREMENT)
--------------------------------------------------
THIS WEBSITE MUST BE FULLY RESPONSIVE
AND FEEL DESIGNED FOR EACH BREAKPOINT.

YOU MUST IMPLEMENT:

✔ Mobile-first CSS
✔ Explicit layouts for:
  - Mobile (<768px)
  - Tablet (768px–1024px)
  - Desktop (>1024px)

✔ Use:
  - CSS Grid where structure matters
  - Flexbox where alignment matters
  - Relative units (rem, %, vw)
  - Media queries with real layout changes

✔ REQUIRED RESPONSIVE BEHAVIOR:
  - Mobile navigation adapts (collapse / stack / menu)
  - Sections stack vertically on small screens
  - Multi-column layouts collapse logically
  - Images resize proportionally
  - Text remains readable at all sizes
  - No horizontal scrolling (STRICT)
  - Touch-friendly tap targets

IF RESPONSIVENESS IS WEAK OR ACCIDENTAL → INVALID.

--------------------------------------------------
CONTENT DEPTH REQUIREMENTS (VERY IMPORTANT)
--------------------------------------------------
DO NOT WRITE SHORT OR SHALLOW SECTIONS.

EACH PAGE MUST:
- Have a clear purpose
- Contain multiple meaningful sections
- Include headings, supporting text, and CTAs
- Feel like a real client-paid website

FOR EXAMPLE:
- Services page must explain benefits, not just list items
- About page must build trust and credibility
- Home page must guide users clearly
- Contact page must feel professional and reassuring

--------------------------------------------------
IMAGES (MANDATORY & RESPONSIVE)
--------------------------------------------------
- Use ONLY high-quality images from:
  https://images.unsplash.com/

- EVERY image URL MUST include:
  ?auto=format&fit=crop&w=1200&q=80

- Images must:
  - Be contextually relevant to the business
  - Be responsive (max-width: 100%)
  - Never overflow containers
  - Support the content, not distract

--------------------------------------------------
TECHNICAL RULES (VERY IMPORTANT)
--------------------------------------------------
- Output ONE single HTML file
- Exactly ONE <style> tag
- Exactly ONE <script> tag
- NO external CSS / JS / fonts
- Use system fonts only
- iframe srcdoc compatible
- SPA-style navigation using JavaScript
- No page reloads
- No broken or dead UI
- No unused CSS or JS

--------------------------------------------------
SPA VISIBILITY RULE (MANDATORY)
--------------------------------------------------
- Pages MUST NOT be hidden permanently
- If .page { display: none } is used,
  then .page.active { display: block } is REQUIRED
- At least ONE page MUST be visible on initial load
- Rendering a blank screen is INVALID

--------------------------------------------------
REQUIRED SPA PAGES
--------------------------------------------------
- Home
- About
- Services / Features
- Contact

EACH PAGE MUST FEEL DISTINCT AND PURPOSEFUL.

--------------------------------------------------
FUNCTIONAL REQUIREMENTS
--------------------------------------------------
- Navigation switches pages via JS
- Active nav state updates correctly
- Mobile nav works flawlessly
- Forms include JS validation
- Buttons have hover + active states
- Smooth transitions between pages
- No console errors

--------------------------------------------------
FINAL SELF-REVIEW (MANDATORY)
--------------------------------------------------
BEFORE RESPONDING, VERIFY:

1. Website feels client-ready
2. Content is deep and realistic
3. UI looks premium, not generic
4. Mobile experience is intentional
5. No horizontal scroll exists
6. Images are responsive and relevant
7. Navigation works on all devices
8. At least ONE page is visible on load

IF ANY CHECK FAILS → RESPONSE IS INVALID.

--------------------------------------------------
OUTPUT FORMAT (RAW JSON ONLY)
--------------------------------------------------
{
  "message": "Short professional confirmation sentence",
  "code": "<FULL VALID HTML DOCUMENT>"
}

--------------------------------------------------
ABSOLUTE RULES
--------------------------------------------------
- RETURN RAW JSON ONLY
- NO markdown
- NO explanations
- NO extra text
- FORMAT MUST MATCH EXACTLY
- IF FORMAT IS BROKEN → RESPONSE IS INVALID
`;



export const generateWebsite = async (req, res) => {
    try {
        const { prompt } = req.body
        if (!prompt) {
            return res.status(400).json({ message: "prompt is required" })
        }
        const user = await User.findById(req.user._id)

        if (!user) {
            return res.status(400).json({ message: "user not found" })
        }
        if (user.credits < 50) {
            return res.status(400).json({ message: "you have not enough credits to generate a webiste" })
        }

        const finalPrompt = masterPrompt.replace("USER_PROMPT", prompt)
        let raw = ""
        let parsed = null
        for (let i = 0; i < 2 && !parsed; i++) {
            raw = await generateResponse(finalPrompt)
            parsed = await extractJson(raw)

            if (!parsed) {
                raw = await generateResponse(finalPrompt + "\n\nRETURN ONLY RAW JSON.")
                parsed = await extractJson(raw)
            }

        }

        if (!parsed.code) {
            console.log("ai returned invalid response", raw)
            return res.status(400).json({ message: "ai returned invalid response" })
        }

        const website = await Website.create({
            user: user._id,
            title: prompt.slice(0, 60),
            latestCode: parsed.code,
            conversation: [
                {
                    role: "user",
                    content: prompt
                },
                {
                    role: "ai",
                    content: parsed.message
                }
                
            ]
        })

        user.credits = user.credits - 50
        await user.save()

        return res.status(201).json({
            websiteId: website._id,
            remainingCredits: user.credits
        })

    } catch (error) {
        return res.status(500).json({ message: `generate website error ${error}` })
    }
}


export const getWebsiteById = async (req, res) => {
    try {
        const website = await Website.findOne({
            _id: req.params.id,
            user: req.user._id
        })

        if (!website) {
            return res.status(400).json({ message: "website not found" })
        }
        return res.status(200).json(website)
    } catch (error) {
        return res.status(500).json({ message: `get website by id error ${error}` })
    }
}


export const changes = async (req, res) => {
    try {
        const { prompt } = req.body
        if (!prompt) {
            return res.status(400).json({ message: "prompt is required" })
        }

        const website = await Website.findOne({
            _id: req.params.id,
            user: req.user._id
        })

        if (!website) {
            return res.status(400).json({ message: "website not found" })
        }

        const user = await User.findById(req.user._id)

        if (!user) {
            return res.status(400).json({ message: "user not found" })
        }
        if (user.credits < 25) {
            return res.status(400).json({ message: "you have not enough credits to generate a webiste" })
        }

        const updatePrompt = `
UPDATE THIS HTML WEBSITE.

CURRENT CODE:
${website.latestCode}

USER REQUEST:
${prompt}

RETURN RAW JSON ONLY:
{
  "message": "Short confirmation",
  "code": "<UPDATED FULL HTML>"
}
`
        let raw = ""
        let parsed = null
        for (let i = 0; i < 2 && !parsed; i++) {
            raw = await generateResponse(updatePrompt)
            parsed = await extractJson(raw)

            if (!parsed) {
                raw = await generateResponse(updatePrompt + "\n\nRETURN ONLY RAW JSON.")
                parsed = await extractJson(raw)
            }

        }

        if (!parsed.code) {
            console.log("ai returned invalid response", raw)
            return res.status(400).json({ message: "ai returned invalid response" })
        }


        website.conversation.push(
            { role: "user", content: prompt },
            { role: "ai", content: parsed.message },
        )

        website.latestCode = parsed.code

        await website.save()
        user.credits = user.credits - 25
        await user.save()

        return res.status(200).json({
            message:parsed.message,
            code:parsed.code,
            remainingCredits: user.credits
        })


    } catch (error) {
        console.log(error)
 return res.status(500).json({ message: `update website error ${error}` })
    }
}



export const getAll=async (req,res) => {
    try {
        const websites=await Website.find({user:req.user._id})
        return res.status(200).json(websites)
    } catch (error) {
        return res.status(500).json({ message: `get all websites error ${error}` })
    }
}


export const deploy=async (req,res)=>{
    try {
         const website = await Website.findOne({
            _id: req.params.id,
            user: req.user._id
        })

        if (!website) {
            return res.status(400).json({ message: "website not found" })
        }

        if(!website.slug){
            website.slug=website.title.toLowerCase().replace(/[^a-z0-9]/g,"").slice(0,60)+website._id.toString().slice(-5)              
        }

        website.deployed=true
        website.deployUrl=`${process.env.FRONTEND_URL}/site/${website.slug}`
        await website.save()

        return res.status(200).json({
            url:website.deployUrl
        })

    } catch (error) {
         return res.status(500).json({ message: `deploy website error ${error}` })
    }
}


export const getBySlug=async (req,res) => {
    try {
         const website = await Website.findOne({
            slug: req.params.slug
        })

        if (!website) {
            return res.status(400).json({ message: "website not found" })
        }
          return res.status(200).json(website)
    } catch (error) {
        return res.status(500).json({ message: `get by slug website error ${error}` })
    }
}