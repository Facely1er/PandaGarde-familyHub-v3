"""Generate Forest Stories narrative posts (editorial Journal only)."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parent
POSTS = ROOT / "posts"
ASSET_VERSION = "20260528"
SITE = "https://journal.pandagarde.com"

STORIES = [
    {
        "slug": "the-whispering-notifications",
        "title": "The Whispering Notifications",
        "theme": "Attention, boundaries, and choosing when to answer",
        "characters": ["Po", "Ruby"],
        "description": "A forest tale about lantern pings that buzz at every meal—and learning which signals deserve a reply.",
        "excerpt_lead": "Lantern signals start buzzing at every meal until Po learns that not every ping deserves a reply.",
        "prev": None,
        "next": "the-shadow-behind-the-screen.html",
        "paragraphs": [
            "Po loved the Harmony Campfire circle. Friends shared drawings, silly riddles, and photos of lantern festivals. Every message arrived with a soft chime, like fireflies tapping bamboo.",
            "At first, the whispers felt friendly. Then they came during breakfast. During homework. During the quiet walk to Tao's Hollow. Po's tablet glowed before his eyes had fully opened.",
            "Ruby noticed first. She had turned her own lantern to \"gentle mode\" after a week when messages stacked up like unread leaves. \"Your signals never rest,\" she told Po. \"Even the forest needs dawn without noise.\"",
            "Po tried to answer everyone at once. He laughed at a joke while brushing his teeth. He replied to a game invite while Tao was explaining how lantern paths are repaired. He missed the part about trust entirely because three new whispers arrived mid-sentence.",
            "That evening, the campfire felt far away though Po was sitting beside it. His mind was still in the other clearing—checking, checking, checking. Ruby slid a smooth stone into his paw. \"The stone stays when the pings leave,\" she said. \"Try one quiet minute with me.\"",
            "They listened to real wind in the bamboo. No chimes. Po's shoulders dropped. He realized the whispers had been asking for urgency he did not owe them.",
            "The next morning, Po walked with Tao along the Crystal Stream. Tao did not scold him. \"Lanterns are meant to guide,\" Tao said, \"not to pull you from every path you are on. You may choose when to open the gate.\"",
            "Po adjusted his settings—not to disappear from friends, but to let messages wait until he was ready. He told Ruby, \"I will answer you after dinner. That is a promise I can keep.\"",
            "At the campfire that night, Po was fully there. The whispers still came, but they no longer whispered over his life. They waited, politely, until he invited them in.",
        ],
        "reflection": "When does a notification pull you away from something you care about in real life? What would \"inviting a ping in\" look like for your family?",
        "questions": [
            "Which apps or devices send the most \"urgent\" feeling signals in our home?",
            "When do we want messages to wait—meals, homework, bedtime, family walks?",
            "How can we tell friends our reply time without sounding like we are ignoring them?",
            "What is one small setting change that would make evenings calmer?",
        ],
    },
    {
        "slug": "the-shadow-behind-the-screen",
        "title": "The Shadow Behind the Screen",
        "theme": "Trust signals and what is hidden online",
        "characters": ["Po", "Tao", "Ruby"],
        "description": "Ruby follows a friendly voice behind glowing glass and learns to ask who is really on the other side.",
        "excerpt_lead": "A glowing invitation feels kind—until Ruby learns to look for the trust behind the screen.",
        "prev": "the-whispering-notifications.html",
        "next": "the-forgotten-password-gate.html",
        "paragraphs": [
            "Ruby was quick to trust kindness. A new profile appeared in the Open Clearing: bright colors, flattering words, and a promise to make her the forest's \"special collaborator.\"",
            "The voice behind the screen knew her favorite games. It knew she had been sad about a lost lantern craft. It felt like a friend who had been listening for a long time.",
            "Po watched Ruby share a little more each day—her schedule, her school grove, a photo of her little brother's birthday lantern. Something in Po's chest tightened. The friend had no shared history in the forest. No animal had seen them at the Harmony Campfire. No elder had greeted them at the Bamboo Gate.",
            "Ruby disagreed at first. \"They are just excited,\" she said. But when the voice asked for a private video \"only between us,\" Ruby paused.",
            "She told Tao. He listened without alarm, which helped Ruby breathe. \"Screens can show faces that are borrowed,\" Tao said. \"Trust is built slowly, like a lantern path—one verified step at a time.\"",
            "Together they checked the signs: a brand-new account, flattery that moved fast, questions that wanted private answers, and a push to leave the public clearing for a hidden chat.",
            "Ruby did not accuse herself for feeling hopeful. Po stayed beside her. They reported the profile using the forest's safety ritual and told a trusted adult in the human world, just as Tao taught.",
            "The shadow behind the screen flickered and went quiet. Ruby was shaken, but not ashamed. \"Kindness is real,\" she told Po later. \"And so is asking who is holding the lantern.\"",
        ],
        "reflection": "What are three slow-trust signs of a real friend online—and three fast-pressure signs that deserve a pause?",
        "questions": [
            "Who are the trusted adults we can tell if an online friend feels \"too perfect\" or too fast?",
            "What information should stay out of public profiles in our family?",
            "How do we verify someone we met online without being rude?",
            "What did Ruby do right when the voice asked for something private?",
        ],
    },
    {
        "slug": "the-forgotten-password-gate",
        "title": "The Forgotten Password Gate",
        "theme": "Passwords, gates, and protecting private spaces",
        "characters": ["Po", "Tao", "Billy"],
        "description": "Billy keeps one short key for every door until a Smoke Fox slips through the garden gate.",
        "excerpt_lead": "One short password opened every gate in Billy's garden—until the forest taught the Bamboo Lock.",
        "prev": "the-shadow-behind-the-screen.html",
        "next": "the-mirror-lake-algorithm.html",
        "paragraphs": [
            "Billy the beaver collected passwords the way other animals collected smooth river stones—except he only kept one. \"bamboo1\" opened his game den, his message burrow, and the little workshop where he stored works-in-progress.",
            "Po visited the Privacy Garden and admired Billy's bamboo gate. \"Strong locks look boring,\" Billy laughed. \"Nobody will guess bamboo1.\"",
            "That night, a Smoke Fox drifted along the path where gates were left easy to open. Billy's workshop lantern flickered. A comment appeared on a drawing he had not shared publicly. A settings page showed a login he did not remember.",
            "Billy's stomach sank. He wanted to hide, but Po had once hidden in his own den for a week—and knew that secrecy made the forest darker.",
            "Tao met them at the gate at dawn. He placed a hand on the bamboo lock. \"A password is not a decoration,\" Tao said. \"It is the first wall of your garden. Short words are short walls.\"",
            "Mika the owl joined them with a scroll of common guesses the Smoke Foxes loved: pet names, favorite foods, \"12345,\" seasons, and yes—\"bamboo1.\" Billy's ears flattened, then lifted. He was ready to learn.",
            "Tao taught the Bamboo Lock method: long enough to tire a guesser, strange enough that it is not a story everyone knows, and different for each door so one lost key cannot open every room.",
            "Billy changed his locks with help from a trusted adult. He wrote nothing on a sticky note taped to the screen. He stored keys in a safe place only he could reach.",
            "The Smoke Fox did not return to that garden. Billy still loved simple things—but his gates were no longer simple to break.",
        ],
        "reflection": "Why is one reused password like carrying a single key for every door in your life?",
        "questions": [
            "Which accounts in our family need the strongest gates (email, school, games with chat)?",
            "What makes a Bamboo Lock strong without being impossible to remember?",
            "Who is allowed to help children store passwords safely?",
            "What should we do first if we think someone entered an account?",
        ],
    },
    {
        "slug": "the-mirror-lake-algorithm",
        "title": "The Mirror Lake Algorithm",
        "theme": "Recommendation loops and seeing beyond reflection",
        "characters": ["Po", "Mika", "Lumi"],
        "description": "The pond shows Po only what he already liked—until Mika teaches him to look up from the mirror surface.",
        "excerpt_lead": "The Reflection Pond kept showing Po his own favorites—until he learned to step back from the mirror.",
        "prev": "the-forgotten-password-gate.html",
        "next": None,
        "paragraphs": [
            "Beyond the Great Bamboo Archive lies the Reflection Pond. Its surface is calm, but it is not ordinary water. The pond remembers what you watched, clicked, and lingered on—and shows you more of the same.",
            "Po sat on the mossy bank after school. One funny clip led to another. Then another. The pond rippled with the same jokes, the same music, the same opinions. It felt comforting, like a path that never asked him to turn.",
            "Mika landed on a branch above him. \"You have been here a long time,\" she said. \"Do you remember choosing the last three reflections—or did they choose you?\"",
            "Po blinked. He could not recall deciding. The pond had been feeding him reflections before he asked for them.",
            "Lumi the firefly drifted down, her light steady. \"Algorithms are forest currents,\" she said softly. \"They carry what is popular downstream. They are not evil—but they are not wise on their own.\"",
            "Mika spread a wing toward the far bank, where older stories and quieter crafts waited in shade. \"Balance is not banning the pond,\" she said. \"It is sometimes standing up and walking to a different shore.\"",
            "Po tried it. He searched a topic he had never explored. He watched a slow documentary about how lantern paths are built. He asked Lumi about her favorite book in the human world. The pond flickered, surprised, then offered something new.",
            "Po still enjoyed silly clips. But he made a ritual: three reflections from the pond, then one choice he made himself—offline or on a trusted site his family agreed on.",
            "The mirror lake still shimmered. Po was no longer only looking at himself looking back.",
        ],
        "reflection": "When have you noticed a feed showing you the same kind of content again and again? What is one intentional choice that breaks the loop?",
        "questions": [
            "How do recommendation feeds decide what to show us?",
            "What is one topic we could explore together that the feed has never suggested?",
            "When does \"comfortable scrolling\" stop feeling like a real choice?",
            "How can families balance fun videos with slower, deeper media?",
        ],
    },
]


def seo_head(title: str, description: str, canonical: str) -> str:
    return (
        f'<title>{title} | PandaGarde</title>'
        f'<meta name="description" content="{description}">'
        f'<link rel="canonical" href="{SITE}/{canonical}">'
        f'<meta property="og:title" content="{title} | Digital Bamboo Journal">'
        f'<meta property="og:description" content="{description}">'
    )


def character_pills(chars: list[str]) -> str:
    return '<div class="pill-list">' + "".join(f'<span class="pill">{c}</span>' for c in chars) + "</div>"


def story_nav(prev: str | None, next_slug: str | None) -> str:
    prev_link = (
        f'<a class="story-nav-prev" href="{prev}">← Previous story</a>'
        if prev
        else '<span class="story-nav-prev" aria-hidden="true"></span>'
    )
    next_href = f"{next_slug}" if next_slug else ""
    next_link = (
        f'<a class="story-nav-next" href="{next_href}">Next story →</a>'
        if next_slug
        else '<span class="story-nav-next" aria-hidden="true"></span>'
    )
    return (
        '<nav class="story-nav" aria-label="Forest Stories navigation">'
        f"{prev_link}"
        '<a class="story-nav-archive" href="../forest-stories.html">All Forest Stories</a>'
        f"{next_link}"
        "</nav>"
    )


def render_post(story: dict) -> str:
    body = "\n".join(f"<p>{p}</p>" for p in story["paragraphs"])
    questions = "\n".join(f"<li>{q}</li>" for q in story["questions"])
    nav = story_nav(story["prev"], story["next"])
    canonical = f"posts/{story['slug']}.html"
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
{seo_head(story["title"], story["description"], canonical)}
<link rel="icon" type="image/png" href="../assets/LogoPandagarde.png">
<link rel="stylesheet" href="../assets/styles.css?v={ASSET_VERSION}">
<script defer src="../assets/main.js?v={ASSET_VERSION}"></script>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="site-header ite-header">
<div class="wrap topbar">
<a class="brand" href="../index.html">
<span class="logo"><img src="../assets/LogoPandagarde.png" alt="PandaGarde logo"></span>
<span class="brand-lockup">
<span class="brand-title">Digital Bamboo</span><br>
<span class="brand-title">Forest Journal</span><br>
<span class="brand-by">by <span class="highlight">PandaGarde</span></span>
</span>
</a>
<button class="menu-btn" aria-label="Toggle navigation">Menu</button>
<nav class="nav" aria-label="Main navigation"></nav>
</div>
</header>
<main id="main">
<article class="article-body story-article">
<div class="breadcrumb">
<a href="../index.html">Journal</a> /
<a href="../forest-stories.html">Forest Stories</a>
</div>
<span class="tag">Forest Story</span>
<h1>{story["title"]}</h1>
<div class="story-meta">
<p><strong>Theme:</strong> {story["theme"]}</p>
<p><strong>Character focus:</strong></p>
{character_pills(story["characters"])}
</div>
<p class="lead">{story["excerpt_lead"]}</p>
<div class="story-narrative">
{body}
</div>
<div class="callout story-reflection" id="reflection">
<h2>Reflection prompt</h2>
<p>{story["reflection"]}</p>
</div>
<h2 id="discussion">Family discussion questions</h2>
<ol>
{questions}
</ol>
{nav}
</article>
</main>
<footer class="site-footer"><div class="wrap footer-grid"></div></footer>
</body>
</html>
"""


def main() -> None:
    POSTS.mkdir(exist_ok=True)
    for story in STORIES:
        path = POSTS / f"{story['slug']}.html"
        path.write_text(render_post(story), encoding="utf-8")
        print("Wrote", path.relative_to(ROOT))
    print(f"Generated {len(STORIES)} Forest Story posts.")


if __name__ == "__main__":
    main()
