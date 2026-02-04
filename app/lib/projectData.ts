export const PROJECTS: Record<string, any> = {
    'ai-ml': {
        title: "AI & Intelligence Systems",
        subtitle: "Build the Brains of Tomorrow",
        vision: "Part of Zaukriti's 'AI Technology Development & Deployment Center', this track focuses on building proprietary Large Language Models (LLMs) and computer vision pipelines that power our core products like Olivia. You aren't just tuning models; you are building the cognitive engine of our ecosystem.",
        problem: "Enterprises are drowning in unstructured data (PDFs, Images, Audio) but lack reliable pipelines to extract structured intelligence. Existing tools are generic and fail in specialized domains like law and medicine.",
        whatYouBuild: "You will build 'Olivia', a multi-modal AI agent capable of reading medical records, parsing legal contracts, or analyzing financial audits with >95% accuracy. This involves setting up RAG pipelines, fine-tuning Llama-3/Mistral models, and deploying high-throughput inference servers.",
        output: "A working API and Dashboard where users upload documents and get JSON output + Chat Interface for Q&A.",
        skills: ["Content Management", "Prompt Engineering", "Python", "PyTorch/TensorFlow", "OpenAI/Anthropic APIs", "RAG (Vector DBs)", "FastAPI", "LangChain"],
        roles: [
            "AI/ML Engineer (Model Tuning, RAG, Prompt Engineering)",
            "Backend Developer (Python/FastAPI, Async Queues)",
            "Data Engineer (ETL Pipelines, Vector Database Mgmt)",
            "Full-Stack Developer (Integration & UI)",
            "Prompt Engineer"
        ]
    },
    'fullstack': {
        title: "Full-Stack Engineering",
        subtitle: "Scalable SaaS Architectures",
        vision: "The backbone of our 'SaaS Subscription Platforms'. This track is about building high-performance, real-time operating systems for businesses. We treat web apps as mission-critical software, not just websites.",
        problem: "Traditional hospital/business management systems are clunky, slow, and offline. The world needs real-time, collaborative, and beautiful SaaS interfaces that work seamlessly across devices.",
        whatYouBuild: "You will build 'VitalHalo Dashboard' or 'Chef2Restro OS', real-time command centers for doctors/restaurants handling live appointments, KOTs, and inventory. Focus on optimistic UI updates, offline-first architecture, and role-based access control.",
        output: "A deployed Next.js application with Supabase backend, featuring role-based access control (RBAC), Real-time WebSocket updates, and PWA capabilities.",
        skills: ["Full Stack", "React / Next.js 14", "TypeScript", "TailwindCSS", "Supabase / PostgreSQL", "Real-time State Management", "WebSockets"],
        roles: [
            "Frontend Developer (React/UI, Animation Libraries)",
            "Backend Developer (Node/Supabase, SQL Optimization)",
            "Full-Stack Architect (System Design)",
            "UI/UX Designer (Figma to Code)"
        ]
    },
    'iot': {
        title: "IoT & Smart Systems",
        subtitle: "Bridging Physical and Digital",
        vision: "Core to our 'Smart Restaurant & Clinic Solutions'. We don't just write software; we touch the physical world. This track bridges hardware sensors with cloud intelligence to automate physical workflows.",
        problem: "Remote health monitoring and restaurant table management are expensive and disconnected. We need affordable, connected devices (Smart Tables, Vitals Monitors) that push data directly to the cloud without manual entry.",
        whatYouBuild: "You will build the firmware and data pipeline for a 'Smart Vitals Monitor' or 'NFC Table Puck'. This involves reading sensor data (Heart Rate/NFC), processing it on edge (ESP32), and sending it securely to our cloud via MQTT.",
        output: "A working physical prototype (or simulation) sending live sensor data to a dashboard, triggering real-time alerts for abnormal readings.",
        skills: ["IoT", "C/C++", "Arduino/ESP32", "MQTT / WebSockets", "Circuit Design", "Edge Computing", "3D Printing/Prototyping"],
        roles: [
            "Embedded Systems Engineer (Firmware)",
            "IoT Cloud Developer (MQTT, brokers)",
            "Hardware Prototyper (PCB, Soldering)",
            "Backend Developer (Data Ingestion)"
        ]
    },
    'cloud': {
        title: "Cloud & DevOps",
        subtitle: "Infrastructure as Code",
        vision: "The foundation of our 'Enterprise Scale' roadmap. We aim to serve 100+ enterprise clients, which requires an infrastructure that is secure, compliant (HIPAA/GDPR), and auto-scalable.",
        problem: "AI applications are resource-intensive. Scaling them securely and cost-effectively is the biggest challenge. A single downtime event destroys trust in healthcare/fintech.",
        whatYouBuild: "You will design and deploy the 'Infinity Scale' architecture—a serverless environment that auto-scales GPUs for AI inference and handles secure patient data storage with zero-trust security.",
        output: "A Terraform/Pulumi script set that provisions a secure AWS/GCP environment with CI/CD pipelines, automated backups, and Prometheus/Grafana monitoring.",
        skills: ["Cloud", "AWS / Google Cloud", "Docker & Kubernetes", "Terraform / IaC", "CI/CD (GitHub Actions)", "Cybersecurity", "Networking"],
        roles: [
            "DevOps Engineer (CI/CD, Infrastructure)",
            "Cloud Architect (High Availability Design)",
            "Security Analyst (Pen-testing, Compliance)"
        ]
    },
    'marketing': {
        title: "Product, Growth & Design",
        subtitle: "Storytelling & User Experience",
        vision: "The engine for our 'Franchise-Ready Scalable Modules'. Great tech fails without distribution. This track turns our platforms (TalentForge, Angadi.ai) into household names through strategic growth hacking and brand building.",
        problem: "Great tech fails without great distribution and user experience. We need to translate complex AI capabilities into human value and build a community of 10,000+ users.",
        whatYouBuild: "You will run the 'Launchpad' campaign—designing the brand identity, high-conversion landing pages, and executing a go-to-market strategy. You will analyze user behavior to optimize retention and sales funnels.",
        output: "High-fidelity Figma prototypes, a live marketing website, viral video assets, and a growth strategy deck backed by real data.",
        skills: ["Leads", "Financial", "Figma / UI/UX", "Copywriting", "Video Editing (Premiere/DaVinci)", "Social Media Analytics", "Community Building", "SEO/SEM"],
        roles: [
            "UI/UX Designer (Product Design)",
            "Product Manager (Roadmap, User Research)",
            "Digital Marketer (Ads, SEO, Growth)",
            "Content Writer (Blogs, Whitepapers)",
            "Social Media / Reels Creator (Viral Content)",
            "Community / Campus Ambassador (Events)",
            "Travel Blogger (for Lifestyle/Nomad Tech)"
        ]
    },
    'fashion-tech': {
        title: "Fashion & Beauty Tech (VelvetLens)",
        subtitle: "AI Personal Styling & Virtual Try-Ons",
        vision: "Core to our 'VelvetLens' platform. We are building the future of D2C fashion where users don't just browse clothes; they try them on digitally. We aim to reduce return rates by 40% using Generative AI.",
        problem: "Online fashion has a 30-40% return rate because users can't visualize fit or style. Existing virtual try-ons are cartoonish and inaccurate.",
        whatYouBuild: "You will build the 'VelvetLens VTO Engine'—a pipeline that takes a user's photo and a garment image, then uses diffusion models to realistically generate the user wearing the garment. Also, an 'AI Skin Analyzer' using computer vision.",
        output: "A Next.js PWA where users upload photos to get a 'Style Score' and VTO results.",
        skills: ["AI", "Generative AI", "stable-diffusion / Midjourney API", "Computer Vision (OpenCV)", "Python", "Next.js", "Three.js (Optional)"],
        roles: [
            "Generative AI Engineer (Diffusion Models)",
            "Computer Vision Engineer (Face/Body Mesh)",
            "Frontend Developer (Canvas/Image Processing)",
            "Fashion Tech Researcher"
        ]
    }
}
