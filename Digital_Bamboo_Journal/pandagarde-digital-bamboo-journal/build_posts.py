"""Regenerate Digital Bamboo Journal article pages from a single content model.

Produces, for every post:
  - unique <meta name="description">
  - Open Graph + Twitter Card tags and a canonical link
  - JSON-LD BlogPosting structured data (author, dates, section)
  - byline with author, publish date and reading time
  - expanded, unique body copy (no shared boilerplate)

Run:  python build_posts.py
Then: python verify_links.py   (sanity check internal links)

Landing/category pages and the homepage are patched by enhance_pages.py.
"""
from __future__ import annotations

import html
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
POSTS_DIR = ROOT / "posts"
ASSET_VERSION = "20260528"
BASE_URL = "https://journal.pandagarde.com"
DEFAULT_AUTHOR = "PandaGarde Editorial Team"
OG_IMAGE = f"{BASE_URL}/assets/LogoPandagarde.png"

CATEGORY_URL = {
    "Family Digital Life": "family-digital-life.html",
    "Inside the Forest": "inside-the-forest.html",
    "Parent Guides": "parent-guides.html",
    "Digital Resilience": "digital-resilience.html",
    "Research": "research-insights.html",
    "Educator Corner": "educator-corner.html",
}

HEADER = """<a class="skip" href="#main">Skip to content</a><header class="site-header"><div class="wrap topbar"><a class="brand" href="../index.html"><span class="logo"><img src="../assets/LogoPandagarde.png" alt="PandaGarde logo"></span><span class="brand-lockup"><span class="brand-title">Digital Bamboo</span><br><span class="brand-title">Forest Journal</span><br><span class="brand-by">by <span class="highlight">PandaGarde</span></span></span></a><button class="menu-btn" aria-label="Toggle navigation">Menu</button><nav class="nav" aria-label="Main navigation"><a href="../index.html"><span>Home</span></a><a href="../family-digital-life.html"><span>Family Digital Life</span></a><a href="../inside-the-forest.html"><span>Inside the Forest</span></a><a href="../parent-guides.html"><span>Parent Guides</span></a><a href="../digital-resilience.html"><span>Digital Resilience</span></a><a href="../educator-corner.html"><span>Educator Corner</span></a></nav></div></header>"""

FOOTER = """<footer class="site-footer"><div class="wrap footer-grid"><div><h3>Digital Bamboo Journal</h3><p class="notice">A calm family digital resilience publication by PandaGarde. Designed to support children, parents, and educators without shame, fear, or surveillance-first messaging.</p></div><div><h3>More from the Journal</h3><a href="../research-insights.html"><span>Research Insights</span></a><a href="../seasonal-challenges.html"><span>Seasonal Challenges</span></a><a href="../pandagarde-news.html"><span>PandaGarde News</span></a><a href="../campfire-conversations.html"><span>Campfire Conversations</span></a></div><div><h3>Ecosystem Links</h3><a href="../socialcaution-bridge.html"><span>SocialCaution Family Privacy Tools</span></a><a href="../edusoluce-bridge.html"><span>EduSoluce School Programs</span></a><a href="../summer-camp.html"><span>Privacy Panda Summer Camp pilot</span></a></div></div></footer>"""

# slug -> content model
POSTS: dict[str, dict] = {
    "why-children-hide-online-problems": {
        "title": "Why Children Hide Online Problems From Parents",
        "category": "Family Digital Life",
        "date": "2026-02-03",
        "read": 5,
        "description": "Children stay quiet about online problems when they fear punishment or losing their device. Here is how families build a safer path to early disclosure.",
        "lead": "Children often stay silent about online problems because they fear punishment, shame, or losing access to their device. The goal is not to frighten children away from technology, but to give them language, confidence, and a trusted path when something feels wrong.",
        "sections": [
            {"h2": "Why children go quiet", "type": "p", "body": [
                "When a child meets something upsetting online, their first calculation is rarely about the problem itself. It is about what will happen at home if they tell. If past mistakes were met with anger or a confiscated tablet, the child quietly learns that secrecy feels safer than honesty.",
                "Silence is not defiance. It is risk management by a young person who does not yet have the words for what happened and is afraid of the cost of saying it out loud.",
            ]},
            {"h2": "What changes the odds", "type": "ul", "intro": "Disclosure becomes far more likely when a few things are reliably true in your home:", "body": [
                "Digital mistakes are treated first as teachable moments, not as proof a child is irresponsible.",
                "Your first reaction is calm. The opening seconds of a conversation teach the child whether honesty was a good idea.",
                "There is a simple way to ask for help. A family code word lets a child signal “I need you” without having to explain everything at once.",
            ]},
            {"h2": "Try this week", "type": "ul", "intro": "Pick one small, repeatable habit rather than one big lecture:", "body": [
                "Say the sentence out loud before anything ever goes wrong: “If something online upsets you, you will not be in trouble for telling me.”",
                "Agree on a code word together and let your child choose it.",
                "Hold one calm five-minute check-in each week. Consistency matters more than intensity.",
            ]},
        ],
        "next": {"text": "Use a family conversation script to plan a calm, shame-free disclosure routine before you need it.", "primary": ("View Parent Guides", "../parent-guides.html"), "secondary": ("How to Talk About Mistakes", "talk-online-mistakes-without-shame.html")},
    },
    "screen-time-fight-not-about-screens": {
        "title": "The Screen-Time Fight Is Not Really About Screens",
        "category": "Family Digital Life",
        "date": "2026-02-10",
        "read": 5,
        "description": "Most screen-time conflict is really about boredom, autonomy, connection, and unclear boundaries. Swap the power struggle for predictable family rituals.",
        "lead": "Most screen-time conflict is not actually about screens. Underneath it sits boredom, a need for autonomy, a wish for connection, or simply rules that were never clear in the first place.",
        "sections": [
            {"h2": "What the fight is really about", "type": "p", "body": [
                "When a request to put the tablet away triggers a meltdown, the screen is the flashpoint, not the cause. A child who is bored, lonely, or abruptly interrupted mid-game experiences the same frustration any of us would. The conflict is about the feeling, not the device.",
                "Naming that out loud lowers the temperature: “It is hard to stop in the middle of something fun.” You are not surrendering the boundary; you are acknowledging the person inside it.",
            ]},
            {"h2": "Move from rules to rituals", "type": "ul", "intro": "Predictable rhythms cause far less conflict than rules invented on the spot:", "body": [
                "Replace vague rules (“not too much”) with predictable rituals (“screens off when dinner starts”).",
                "Separate content quality from total minutes. Thirty minutes of creating is not the same as thirty minutes of doom-scrolling.",
                "Build offline anchors the whole family keeps: reading, drawing, a walk, device-free meals.",
            ]},
            {"h2": "Try this week", "type": "ul", "intro": "Small structure removes most of the daily negotiation:", "body": [
                "Give a five-minute warning before any transition so stopping is not a surprise.",
                "Decide screen times together once, then let the schedule do the enforcing instead of you.",
                "Notice what your child reaches for when bored, and offer a satisfying offline alternative.",
            ]},
        ],
        "next": {"text": "A short family check-in helps you find where the conflict is really coming from before you change the rules.", "primary": ("View Parent Guides", "../parent-guides.html"), "secondary": ("Why Resilience Beats Limits", "why-digital-resilience-matters.html")},
    },
    "talk-online-mistakes-without-shame": {
        "title": "How to Talk About Online Mistakes Without Shame",
        "category": "Family Digital Life",
        "date": "2026-02-17",
        "read": 4,
        "description": "A shame-free response helps children disclose problems earlier and recover faster. A simple three-step script for talking about online mistakes.",
        "lead": "How you respond to the first online mistake shapes whether your child brings you the next one. A shame-free response helps children disclose problems earlier and learn from them faster.",
        "sections": [
            {"h2": "Why shame backfires", "type": "p", "body": [
                "Shame tells a child that the mistake is who they are, not just something that happened. A shamed child hides the next problem to protect themselves, which is the opposite of what we want.",
                "The aim is not to ignore mistakes. It is to keep the relationship open enough that you stay the person your child turns to when something is wrong.",
            ]},
            {"h2": "A three-step script", "type": "ul", "intro": "When your child tells you something difficult, move through these in order:", "body": [
                "Start with safety: “You are not in trouble for telling me.” Say it first, and mean it.",
                "Ask what happened before giving any advice. Curiosity now, coaching later.",
                "End with one concrete next step that the child helps choose, so they leave with agency, not just a verdict.",
            ]},
            {"h2": "Try this week", "type": "ul", "intro": "Rehearse the calm response before you need it:", "body": [
                "Practice your opening line out loud so it is automatic in a tense moment.",
                "Share an age-appropriate mistake of your own and how you handled it.",
                "Thank your child for telling you, even when the news is hard to hear.",
            ]},
        ],
        "next": {"text": "A simple family privacy agreement turns these conversations into a shared, repeatable habit.", "primary": ("View Parent Guides", "../parent-guides.html"), "secondary": ("Why Children Hide Problems", "why-children-hide-online-problems.html")},
    },
    "family-device-privacy-checklist": {
        "title": "Family Device Privacy Checklist",
        "category": "Parent Guides",
        "date": "2026-02-24",
        "read": 6,
        "description": "A practical, do-it-together checklist for app permissions, location sharing, passwords, and privacy settings—plus a quarterly family review ritual.",
        "lead": "A short, repeatable review keeps your family's devices in good shape without turning privacy into a one-time chore. Do this together so children learn the why, not just the what.",
        "sections": [
            {"h2": "Why do it together", "type": "p", "body": [
                "Privacy settings drift. Apps update, new ones get installed, and permissions quietly accumulate. A regular review keeps the picture current and, just as importantly, teaches children to make these choices themselves over time.",
                "Doing it side by side reframes privacy as ordinary family maintenance, like checking smoke detectors, rather than a punishment or a sign of distrust.",
            ]},
            {"h2": "The checklist", "type": "ul", "intro": "Walk through each device together:", "body": [
                "Review which apps can see your location, and switch unnecessary ones off.",
                "Turn off microphone and camera permissions for apps that do not genuinely need them.",
                "Check new app downloads together and talk about why each one was added.",
                "Use a password manager for the parent-controlled accounts.",
                "Schedule a quarterly family privacy review so this never becomes a crisis fix.",
            ]},
            {"h2": "Try this week", "type": "ul", "intro": "You do not have to do everything at once:", "body": [
                "Pick one device and review just its location permissions today.",
                "Put a recurring 20-minute “privacy review” on the family calendar.",
                "Let an older child lead the next review while you watch.",
            ]},
        ],
        "next": {"text": "Want a snapshot of your family's overall digital exposure? The SocialCaution tools build on this checklist.", "primary": ("Family Privacy Tools", "../socialcaution-bridge.html"), "secondary": ("Parent Guide to Roblox", "roblox-safety-guide.html")},
    },
    "roblox-safety-guide": {
        "title": "Parent Guide to Roblox Safety",
        "category": "Parent Guides",
        "date": "2026-03-03",
        "read": 6,
        "description": "A calm, practical guide to Roblox for parents: account and chat settings, friend requests, purchase limits, and teaching reporting and blocking as normal skills.",
        "lead": "Roblox is a social platform as much as a game, which is exactly why a calm, practical setup matters. This guide covers accounts, chat, friends, purchases, and reporting—without the panic.",
        "sections": [
            {"h2": "Set it up with your child", "type": "p", "body": [
                "The strongest safety setting is the conversation you have while you adjust the others. Sit down together, open the account settings, and explain each choice as you make it so your child understands the reasoning, not just the restriction.",
                "Account age matters: Roblox applies stricter defaults for younger accounts, so make sure the birthdate on the account is accurate.",
            ]},
            {"h2": "The practical setup", "type": "ul", "intro": "Work through these settings together:", "body": [
                "Review communication and chat settings, and decide together who can message your child.",
                "Talk about strangers, and role-play a suspicious request so the response is practiced, not theoretical.",
                "Set spending limits and turn off saved payment details to prevent surprise purchases.",
                "Teach reporting and blocking as normal, confident safety behaviors—not tattling.",
            ]},
            {"h2": "Try this week", "type": "ul", "intro": "Make safety a shared skill:", "body": [
                "Have your child show you how to report and block a player.",
                "Agree on what to do if a stranger asks to chat off-platform.",
                "Play together for ten minutes so you understand the world they are in.",
            ]},
        ],
        "next": {"text": "Practice safe responses to tricky situations using PandaGarde's scenario-based conversation cards.", "primary": ("View Parent Guides", "../parent-guides.html"), "secondary": ("Family Privacy Checklist", "family-device-privacy-checklist.html")},
    },
    "children-need-safe-adults": {
        "title": "Children Need Safe Adults More Than Perfect Rules",
        "category": "Parent Guides",
        "date": "2026-03-10",
        "read": 4,
        "description": "Rules help, but relationships are what make children ask for help when something goes wrong online. What it means to be a child's safe adult.",
        "lead": "Rules help, but they are not what make a frightened child reach out. Relationships are. Being a safe adult matters more than having a perfect rulebook.",
        "sections": [
            {"h2": "Rules run out; relationships do not", "type": "p", "body": [
                "No rulebook can anticipate every situation a child will meet online. When something new and worrying happens, the deciding factor is not whether a rule covered it, but whether the child believes an adult will help rather than punish.",
                "A safe adult is the safety net that catches the situations the rules missed.",
            ]},
            {"h2": "What a safe adult does", "type": "ul", "intro": "Children read these behaviors clearly:", "body": [
                "A safe adult listens before correcting.",
                "A safe adult does not make the child regret having told them.",
                "A safe adult helps turn fear into a next action the child can take.",
            ]},
            {"h2": "Try this week", "type": "ul", "intro": "Small signals build the trust:", "body": [
                "When your child shares something minor, respond the way you hope you would to something major.",
                "Name the trusted adults in your child's life out loud, so they know who else they can go to.",
                "Catch yourself before reacting, and lead with a question instead of a verdict.",
            ]},
        ],
        "next": {"text": "Help your child map the trusted adults around them with the Trusted Circle activity.", "primary": ("View Parent Guides", "../parent-guides.html"), "secondary": ("Meet Elder Turtle", "meet-elder-turtle.html")},
    },
    "first-time-child-asked-privacy": {
        "title": "The First Time a Child Asks About Privacy",
        "category": "Parent Guides",
        "date": "2026-03-17",
        "read": 4,
        "description": "A reflective guide to turning a child's first privacy question into a lasting family value—with simple language that respects their growing sense of dignity.",
        "lead": "The first time a child asks why something is private is a small moment with a long reach. A thoughtful answer can quietly become a family value.",
        "sections": [
            {"h2": "Privacy begins with dignity", "type": "p", "body": [
                "Before privacy is a technical concept, it is an emotional one. A child who wants to close the bathroom door is already reasoning about privacy. Connecting the digital idea to that lived feeling makes it intuitive rather than abstract.",
                "Privacy framed as dignity—“you get to decide who sees certain things about you”—lands far better than privacy framed as fear of strangers.",
            ]},
            {"h2": "Meet the question where they are", "type": "ul", "intro": "Match the answer to the age, not the textbook:", "body": [
                "Children need simple language long before they need technical rules.",
                "A short, honest answer beats a lecture they will tune out.",
                "Treat the question as a beginning, not a one-time briefing.",
            ]},
            {"h2": "Try this week", "type": "ul", "intro": "Plant the value early:", "body": [
                "Use an everyday example—a closed door, a sealed letter—to explain a private setting.",
                "Ask your child what they think should stay private, and listen to their reasoning.",
                "Revisit the topic lightly in a few weeks; values grow through repetition.",
            ]},
        ],
        "next": {"text": "Explore the Privacy Panda stories to give younger children a gentle, story-world entry point to privacy.", "primary": ("Inside the Forest", "../inside-the-forest.html"), "secondary": ("Po's Journal", "po-journal-lanterns-went-dark.html")},
    },
    "po-journal-lanterns-went-dark": {
        "title": "Po’s Journal: Why the Lanterns Went Dark",
        "category": "Inside the Forest",
        "date": "2026-01-20",
        "read": 4,
        "description": "A gentle story-world article from the Digital Bamboo Forest, introducing children to the emotional meaning of privacy, trust, and asking for help.",
        "lead": "In the Digital Bamboo Forest, the lanterns glow when friends treat each other with care. This is Po's journal entry about the day they went dark—and how trust was repaired.",
        "sections": [
            {"h2": "The story", "type": "p", "body": [
                "Po loved the warm light of the forest lanterns. They glowed brightest when friends kept each other's secrets safe and asked before sharing. One afternoon, Po passed along a friend's secret without permission, and the nearest lanterns dimmed.",
                "Po felt the change before understanding it. The forest was not punishing anyone—it was simply reflecting how trust feels when it is bruised.",
            ]},
            {"h2": "What Po learns", "type": "ul", "intro": "Po discovers that the light comes back, but only one way:", "body": [
                "The lanterns dim when something is shared without permission.",
                "Hiding the mistake keeps them dim; the light does not return on its own.",
                "Telling the truth—and saying sorry—is what brings the glow back.",
            ]},
            {"h2": "Talk about it together", "type": "ul", "intro": "Use the story as a gentle conversation starter:", "body": [
                "Ask your child why they think the lanterns went dark.",
                "Wonder together what Po could do to make the light return.",
                "Connect it to real life: “What helps us feel trusted again after a mistake?”",
            ]},
        ],
        "next": {"text": "Meet the forest's gentlest guide, who shows the young rangers how trust is rebuilt.", "primary": ("Inside the Forest", "../inside-the-forest.html"), "secondary": ("Meet Elder Turtle", "meet-elder-turtle.html")},
    },
    "meet-elder-turtle": {
        "title": "Meet Elder Turtle, Keeper of the Quiet Grove",
        "category": "Inside the Forest",
        "date": "2026-01-27",
        "read": 4,
        "description": "A character profile from the Digital Bamboo Forest. Elder Turtle shows children and parents why a calm, trusted adult matters more than a perfect rule.",
        "lead": "Deep in the Quiet Grove lives Elder Turtle, the forest's gentlest guide. He is slow, patient, and never in a hurry—which is exactly why the young rangers trust him with their hardest worries.",
        "sections": [
            {"h2": "Who Elder Turtle is", "type": "p", "body": [
                "Elder Turtle is a character children can hold onto: the embodiment of the safe adult. He does not race to judgment or react with alarm. When a young ranger brings him a mistake, his first response is to listen.",
                "For parents, Elder Turtle is a useful model. The qualities children find reassuring in him are the same ones that keep real children talking to us.",
            ]},
            {"h2": "What he teaches", "type": "ul", "intro": "Across the stories, Elder Turtle shows a steady pattern:", "body": [
                "He listens first, before offering any advice.",
                "He does not punish honest mistakes, so honesty stays safe.",
                "He helps the young rangers slow down before deciding what to share.",
            ]},
            {"h2": "Bring him home", "type": "ul", "intro": "Children love borrowing a character's wisdom:", "body": [
                "Ask, “What would Elder Turtle do?” when a tricky online moment comes up.",
                "Name the Elder Turtles in your child's real life—the adults they can always go to.",
                "Practice listening first the way he does, even with small everyday worries.",
            ]},
        ],
        "next": {"text": "Explore why trusted adults matter more than perfect rules in a child's digital life.", "primary": ("View Parent Guides", "../parent-guides.html"), "secondary": ("Children Need Safe Adults", "children-need-safe-adults.html")},
    },
    "summer-highest-risk-screen-season": {
        "title": "Why Summer Is the Highest-Risk Screen-Time Season",
        "category": "Research",
        "date": "2026-04-07",
        "read": 5,
        "description": "Summer removes school structure and increases unstructured digital time—but it is also the best moment for families to build a calmer routine.",
        "lead": "Summer removes the scaffolding of the school day and opens long, unstructured stretches of digital time. That same loss of routine, though, makes summer the best moment of the year to build a calmer one.",
        "sections": [
            {"h2": "Why the risk rises", "type": "p", "body": [
                "During the school year, the day's structure quietly limits screen time. Remove that structure and the hours open up, boredom climbs, and peer activity online intensifies—all at once. It is less that summer is dangerous and more that it removes the guardrails families relied on without noticing.",
                "The upside: a fresh season is a natural reset, and parents tend to be most open to a new routine right when the old one disappears.",
            ]},
            {"h2": "What the pattern shows", "type": "ul", "intro": "A few dynamics tend to repeat each summer:", "body": [
                "Boredom, reduced routine, and peer pressure together increase digital exposure.",
                "Parents are most receptive to structured alternatives right when school ends.",
                "A light weekly ritual turns vague anxiety into something achievable.",
            ]},
            {"h2": "Try this summer", "type": "ul", "intro": "Replace the lost structure with something gentle:", "body": [
                "Set a simple daily rhythm—mornings active, afternoons flexible, evenings device-light.",
                "Pick one weekly family activity that everyone looks forward to.",
                "Decide screen expectations together at the start of the break, not in the middle of an argument.",
            ]},
        ],
        "next": {"text": "PandaGarde's Summer Camp is a planned pilot that turns the summer reset into a weekly family ritual.", "primary": ("Summer Camp pilot", "../summer-camp.html"), "secondary": ("Why Resilience Beats Limits", "why-digital-resilience-matters.html")},
    },
    "why-digital-resilience-matters": {
        "title": "Why Digital Resilience Matters More Than Screen Limits",
        "category": "Digital Resilience",
        "date": "2026-03-24",
        "read": 5,
        "description": "Limits matter, but children also need the skills, language, and confidence to navigate digital spaces. Why resilience outlasts any rule.",
        "lead": "Screen limits matter, but they are a fence, not a skill. Children also need the judgment, language, and confidence to handle the moments a fence never anticipated.",
        "sections": [
            {"h2": "Limits manage; resilience equips", "type": "p", "body": [
                "A limit controls the environment around a child. Resilience builds capacity inside the child. Both are useful, but only one travels with them when you are not in the room and the rule does not apply.",
                "A child who only knows rules may freeze the first time something new and confusing appears. A resilient child has practiced what to do.",
            ]},
            {"h2": "What resilience looks like", "type": "ul", "intro": "Digital resilience is a set of learnable skills:", "body": [
                "Recognizing when something feels off or unsafe.",
                "Knowing how and whom to ask for help.",
                "Setting a boundary and recovering after a mistake.",
            ]},
            {"h2": "Try this week", "type": "ul", "intro": "Resilience grows through low-stakes practice:", "body": [
                "Talk through a “what would you do if…” scenario at dinner.",
                "Praise good judgment when you see it, not just rule-following.",
                "Let small, safe mistakes become teaching moments instead of crackdowns.",
            ]},
        ],
        "next": {"text": "Schools can use this same framing to shape digital citizenship programs that build skills, not just restrictions.", "primary": ("School Programs", "../edusoluce-bridge.html"), "secondary": ("The Science of Story Learning", "science-story-based-learning.html")},
    },
    "science-story-based-learning": {
        "title": "The Science Behind Story-Based Digital Safety Learning",
        "category": "Digital Resilience",
        "date": "2026-03-31",
        "read": 5,
        "description": "Stories help children understand consequences through empathy rather than lectures. Why narrative-based learning sticks—and how families can use it.",
        "lead": "Lectures tell children what to do; stories let them feel why. That difference is why narrative is one of the most effective ways to teach digital safety to young children.",
        "sections": [
            {"h2": "Why stories teach", "type": "p", "body": [
                "A direct warning asks a child to imagine a consequence in the abstract. A story lets them experience it safely through a character, at a comfortable emotional distance. That distance is what makes the lesson feel safe enough to absorb rather than resist.",
                "Narrative also bundles the lesson with emotion and sequence, which is how memory naturally encodes meaning—so the insight is easier to recall later.",
            ]},
            {"h2": "What makes it work", "type": "ul", "intro": "Three mechanisms do the heavy lifting:", "body": [
                "Characters let children examine conflict from a safe distance.",
                "Narrative structure supports empathy and memory better than rules alone.",
                "Family discussion afterward converts story insight into real-world behavior.",
            ]},
            {"h2": "Try this week", "type": "ul", "intro": "Turn a story into a lesson:", "body": [
                "Read or watch a story together and pause to ask how a character feels.",
                "Ask, “What would you have done?” rather than explaining the moral.",
                "Connect the story gently to a real situation a day or two later.",
            ]},
        ],
        "next": {"text": "Educators can adapt these stories into classroom discussion circles for whole-class learning.", "primary": ("Educator Corner", "../educator-corner.html"), "secondary": ("Po's Journal", "po-journal-lanterns-went-dark.html")},
    },
    "digital-resilience-elementary-schools": {
        "title": "Building Digital Resilience in Elementary Schools",
        "category": "Educator Corner",
        "date": "2026-04-14",
        "read": 6,
        "description": "One-time assemblies do not build digital resilience. Children need progressive, family-reinforced learning. A practical framing for elementary schools.",
        "lead": "A single assembly cannot build a skill. Digital resilience grows the way reading does—through progressive, reinforced practice that connects classroom and home.",
        "sections": [
            {"h2": "Why one-off events fall short", "type": "p", "body": [
                "The annual internet-safety assembly is well-intentioned, but skills built in a single session rarely survive to the moment a child actually needs them. Resilience requires repetition, age-appropriate progression, and reinforcement outside school walls.",
                "The schools that see real change treat digital resilience as a thread woven through the year, not a box checked once.",
            ]},
            {"h2": "What works in practice", "type": "ul", "intro": "Effective elementary programs tend to share these features:", "body": [
                "Multi-session lessons that build on each other rather than a single talk.",
                "Classroom instruction paired with simple family activities at home.",
                "Reporting and trusted adults normalized before any crisis appears.",
                "Engagement measured, not just completion logged.",
            ]},
            {"h2": "For your classroom", "type": "ul", "intro": "Start small and reinforce:", "body": [
                "Open with a story or character to anchor the concept emotionally.",
                "Send one short, no-prep prompt home so families echo the same language.",
                "Revisit the theme across the term so it becomes familiar, not novel.",
            ]},
        ],
        "next": {"text": "EduSoluce offers structured pilots and educator kits for bringing this into your school.", "primary": ("School Programs", "../edusoluce-bridge.html"), "secondary": ("Family Engagement & Outcomes", "family-engagement-student-outcomes.html")},
    },
    "family-engagement-student-outcomes": {
        "title": "Why Family Engagement Changes Student Outcomes",
        "category": "Educator Corner",
        "date": "2026-04-21",
        "read": 5,
        "description": "Digital safety education works best when families reinforce the same language at home. How schools can invite parents into the learning loop—without blame.",
        "lead": "The most effective digital safety education does not stop at the classroom door. It works best when families echo the same language at home, turning one lesson into a reinforced habit.",
        "sections": [
            {"h2": "Why the home connection matters", "type": "p", "body": [
                "Children spend far more of their digital lives at home than at school. When the vocabulary and expectations match across both settings, the lesson stops feeling like a school topic and starts feeling like how the world works.",
                "The goal is partnership, not homework for parents—and certainly not blame when something goes wrong.",
            ]},
            {"h2": "How to engage families well", "type": "ul", "intro": "A few practices make engagement realistic:", "body": [
                "Send short conversation prompts home that take minutes, not hours.",
                "Use activities that need no special tools or logins.",
                "Invite parents into the learning loop without implying they are failing.",
            ]},
            {"h2": "For your school", "type": "ul", "intro": "Make participation easy:", "body": [
                "Offer prompts in plain language and, where possible, more than one language.",
                "Celebrate family participation publicly to build momentum.",
                "Give families a simple way to ask questions back.",
            ]},
        ],
        "next": {"text": "EduSoluce's Family Companion Pack gives schools a ready-made bridge between classroom and home.", "primary": ("School Programs", "../edusoluce-bridge.html"), "secondary": ("Resilience in Elementary Schools", "digital-resilience-elementary-schools.html")},
    },
}


def fmt_date(iso: str) -> str:
    y, m, d = iso.split("-")
    months = ["January", "February", "March", "April", "May", "June", "July",
              "August", "September", "October", "November", "December"]
    return f"{months[int(m) - 1]} {int(d)}, {y}"


def render_section(sec: dict) -> str:
    out = [f'<h2>{html.escape(sec["h2"])}</h2>']
    if sec["type"] == "p":
        for p in sec["body"]:
            out.append(f"<p>{p}</p>")
    else:
        if sec.get("intro"):
            out.append(f"<p>{sec['intro']}</p>")
        out.append("<ul>" + "".join(f"<li>{li}</li>" for li in sec["body"]) + "</ul>")
    return "".join(out)


def render_post(slug: str, data: dict) -> str:
    url = f"{BASE_URL}/posts/{slug}.html"
    cat = data["category"]
    cat_url = CATEGORY_URL[cat]
    desc = data["description"]
    title = data["title"]
    pretty_date = fmt_date(data["date"])

    ld = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": title,
        "description": desc,
        "datePublished": data["date"],
        "dateModified": data["date"],
        "author": {"@type": "Organization", "name": DEFAULT_AUTHOR},
        "publisher": {
            "@type": "Organization",
            "name": "PandaGarde Digital Bamboo Journal",
            "logo": {"@type": "ImageObject", "url": f"{BASE_URL}/assets/LogoPandagarde.png"},
        },
        "image": OG_IMAGE,
        "articleSection": cat,
        "mainEntityOfPage": {"@type": "WebPage", "@id": url},
        "isAccessibleForFree": True,
    }
    ld_json = json.dumps(ld, ensure_ascii=False, separators=(",", ":"))

    head = (
        '<!doctype html><html lang="en"><head><meta charset="utf-8">'
        '<meta name="viewport" content="width=device-width, initial-scale=1">'
        f"<title>{html.escape(title)} | PandaGarde</title>"
        f'<meta name="description" content="{html.escape(desc)}">'
        f'<meta name="author" content="{DEFAULT_AUTHOR}">'
        f'<link rel="canonical" href="{url}">'
        '<meta property="og:type" content="article">'
        '<meta property="og:site_name" content="Digital Bamboo Journal">'
        f'<meta property="og:title" content="{html.escape(title)}">'
        f'<meta property="og:description" content="{html.escape(desc)}">'
        f'<meta property="og:url" content="{url}">'
        f'<meta property="og:image" content="{OG_IMAGE}">'
        f'<meta property="article:published_time" content="{data["date"]}">'
        f'<meta property="article:section" content="{html.escape(cat)}">'
        '<meta name="twitter:card" content="summary_large_image">'
        f'<meta name="twitter:title" content="{html.escape(title)}">'
        f'<meta name="twitter:description" content="{html.escape(desc)}">'
        f'<meta name="twitter:image" content="{OG_IMAGE}">'
        f'<link rel="alternate" type="application/rss+xml" title="Digital Bamboo Journal" href="{BASE_URL}/rss.xml">'
        '<link rel="icon" type="image/png" href="../assets/LogoPandagarde.png">'
        f'<link rel="stylesheet" href="../assets/styles.css?v={ASSET_VERSION}">'
        f'<script defer src="../assets/main.js?v={ASSET_VERSION}"></script>'
        f'<script type="application/ld+json">{ld_json}</script>'
        "</head><body>"
    )

    toc_links = "".join(
        f'<a href="#s{i}">{html.escape(sec["h2"])}</a>'
        for i, sec in enumerate(data["sections"])
    )
    sections_html = "".join(
        render_section({**sec, "h2": sec["h2"]}).replace("<h2>", f'<h2 id="s{i}">', 1)
        for i, sec in enumerate(data["sections"])
    )

    nxt = data["next"]
    pl, ph = nxt["primary"]
    sl, sh = nxt["secondary"]
    callout = (
        '<div class="callout" id="next"><h2>Recommended next step</h2>'
        f"<p>{nxt['text']}</p>"
        '<div class="btns">'
        f'<a class="btn primary" href="{ph}">{html.escape(pl)}</a>'
        f'<a class="btn secondary" href="{sh}">{html.escape(sl)}</a>'
        "</div></div>"
    )

    meta_line = (
        '<p class="article-meta">'
        f'<span>{html.escape(DEFAULT_AUTHOR)}</span>'
        '<span class="dot">·</span>'
        f'<time datetime="{data["date"]}">{pretty_date}</time>'
        '<span class="dot">·</span>'
        f'<span>{data["read"]} min read</span>'
        "</p>"
    )

    article = (
        '<main id="main"><article class="article-body">'
        f'<div class="breadcrumb"><a href="../index.html">Journal</a> / '
        f'<a href="../{cat_url}"><span>{html.escape(cat)}</span></a></div>'
        f'<span class="tag">{html.escape(cat)}</span>'
        f"<h1>{html.escape(title)}</h1>"
        f"{meta_line}"
        f'<p class="lead">{data["lead"]}</p>'
        f'<div class="toc"><strong>In this guide</strong>{toc_links}</div>'
        f"{sections_html}"
        f"{callout}"
        "</article></main>"
    )

    return head + HEADER + article + FOOTER + "</body></html>"


def main() -> None:
    for slug, data in POSTS.items():
        path = POSTS_DIR / f"{slug}.html"
        path.write_text(render_post(slug, data), encoding="utf-8")
    print(f"Rebuilt {len(POSTS)} post(s) with SEO metadata and expanded content.")


if __name__ == "__main__":
    main()
