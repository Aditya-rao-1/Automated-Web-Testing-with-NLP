export const features = [
  {
    id: "0",
    icon: "/images/feature-1.png",
    caption: "No-code, natural-language automation ",
    title: "Test smarter, not harder",
    text: "Why write scripts when you can just say what you want? Tell our AI:Check if the login page rejects wrong passwords — and it just works.",
    button: {
      icon: "/images/magictouch.svg",
      title: "Watch the demo",
    },
  },
  {
    id: "1",
    icon: "/images/feature-2.png",
    caption: "Readable, beautiful reports",
    title: "Visual feedback you can trust",
    text: "From screenshots to smart summaries, see exactly what was tested and what broke — all in an elegant, shareable dashboard.",
    button: {
      icon: "/images/docs.svg",
      title: "Read the docs",
    },
  },
];

export const details = [
  {
    id: "0",
    icon: "/images/detail-1.png",
    title: "AI automated web testing",
  },
  {
    id: "1",
    icon: "/images/detail-2.png",
    title: "Collaborate with your team",
  },
  {
    id: "2",
    icon: "/images/detail-3.png",
    title: "Ultra fast Model",
  },
  {
    id: "3",
    icon: "/images/detail-4.png",
    title: "24 / 7 Customer support",
  },
];

export const faq = [
  {
    id: "0",
    question: "What is the main purpose of this system?",
    answer:
      "Our goal is to enable anyone — technical or not — to test web applications simply by typing what they want in plain English. The system translates natural language into executable test cases using advanced AI, including LLMs and Playwright automation.",
  },
  {
    id: "1",
    question: "How does it understand what I want to test?",
    answer:
      "We use a Large Language Model (LLM) combined with a Retrieval-Augmented Generation (RAG) system to understand your natural language commands. The model converts your instructions into structured actions that the robot can execute on real websites.",
  },
  {
    id: "2",
    question: "What is Playwright and how is it used here?",
    answer:
      "Playwright is an open-source tool for browser automation. We use it as the robot that clicks buttons, fills out forms, and checks behavior on web apps — all triggered by natural language commands.",
  },
  {
    id: "3",
    question: "What role does MCP (Model Context Protocol) play?",
    answer:
      "MCP acts like a smart assistant for the AI. It helps our system maintain the right context for each prompt, making the AI more accurate and consistent when interpreting testing instructions.",
  },
  {
    id: "4",
    question: "Can this tool generate detailed reports?",
    answer:
      "Yes! After each test, our system generates a visual report — complete with pass/fail status, screenshots, and readable logs — so you know exactly what was tested and what broke.",
  },
  {
    id: "5",
    question: "Do I need to know programming to use it?",
    answer:
      "Not at all. This platform is designed for anyone to use. Just type instructions like 'Test if the login page works with wrong password' — and the system does the rest.",
  },
  {
    id: "6",
    question: "How scalable is the system for team or enterprise use?",
    answer:
      "Our platform supports multi-user collaboration, version control, and integration with CI/CD tools — making it ideal for individuals, teams, or entire QA departments.",
  },
  {
    id: "7",
    question: "Can it handle complex testing flows?",
    answer:
      "Yes, the AI can interpret multi-step test scenarios like 'Go to signup page, fill out the form, submit, then verify the success message' — and execute them without writing a single line of test code.",
  },
  {
    id: "8",
    question: "How fast is the testing process?",
    answer:
      "Very fast. Our Playwright-based execution engine is optimized for speed and concurrency, allowing tests to run as quickly as — or faster than — manual testers.",
  },
  {
    id: "9",
    question: "What happens when it doesn’t understand a prompt?",
    answer:
      "The system is built to provide feedback and suggestions when it’s unsure. You can rephrase your command, or the AI will attempt to interpret similar intents using its knowledge base.",
  },
];




export const resources = [
  {
    id: "0",
    name: "Playwright",
    role: "Official Guide",
    avatarUrl: "https://playwright.dev/img/playwright-logo.svg",
    comment: "Learn the basics of browser automation using Playwright. Great starting point for testing workflows.",
    link: "https://playwright.dev/docs/intro",
  },
  {
    id: "1",
    name: "Test Automation University",
    role: "Best Practices",
    avatarUrl: "https://ui-avatars.com/api/?name=TAU&background=0D8ABC&color=fff",
    comment: "Explore industry best practices, tools, and tips for writing efficient automated tests.",
    link: "https://testautomationu.applitools.com/",
  },
  {
    id: "2",
    name: "Mozilla Developer Network",
    role: "JavaScript for Beginners",
    avatarUrl: "https://ui-avatars.com/api/?name=MDN&background=4B5563&color=fff",
    comment: "Start learning JavaScript from scratch with this trusted MDN tutorial.",
    link: "https://developer.mozilla.org/en-US/docs/Learn/JavaScript",
  },
  {
    id: "3",
    name: "MCP Docs",
    role: "Model Context Protocol",
    avatarUrl: "https://ui-avatars.com/api/?name=MCP&background=10B981&color=fff",
    comment: "Understand how smart assistants can help language models interact with apps better.",
    link: "https://modelcontextprotocol.io/introduction",
  },
  {
    id: "4",
    name: "NLTK Book",
    role: "NLP Basics",
    avatarUrl: "https://ui-avatars.com/api/?name=NLTK&background=F59E0B&color=fff",
    comment: "Learn the foundations of Natural Language Processing using Python’s NLTK library.",
    link: "https://www.nltk.org/book/",
  },
  {
    id: "5",
    name: "Express.js",
    role: "Web API Starter",
    avatarUrl: "https://ui-avatars.com/api/?name=Express&background=1F2937&color=fff",
    comment: "A quick way to start building APIs with Node.js and Express — great for backend integration.",
    link: "https://expressjs.com/en/starter/hello-world.html",
  },
];


import { FaGithub,FaLaptopCode} from "react-icons/fa";
import { SiGmail } from "react-icons/si";

export const socialMedia = [
  {
    id: 1,
    icon: FaGithub,
    url: "https://github.com/Aditya-rao-1",
  },
  {
    id: 2,
    icon: SiGmail,
    copy: true,
    email: "raoaditya840@gmail.com",
  },
  {
    id: 3,
    icon: FaLaptopCode,
    url: "https://adi-portfolio-beta.vercel.app/",
  },
];
