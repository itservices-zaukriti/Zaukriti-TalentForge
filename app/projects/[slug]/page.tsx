'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Code, Layout, Database, Cpu, Users, Target, Zap } from 'lucide-react';
import { notFound } from 'next/navigation';

// Data Source for Projects (Micro-CMS style)
// Updated with Vision & Self-Explanatory Details from DPR
// Updated Skills as per User Request
const PROJECTS: Record<string, any> = {
    'ai-ml': {
        title: "AI & Intelligence Systems",
        subtitle: "Build the Brains of Tomorrow",
        vision: "Part of Zaukriti's 'AI Technology Development & Deployment Center', this track focuses on building proprietary Large Language Models (LLMs) and computer vision pipelines that power our core products like Olivia. You aren't just tuning models; you are building the cognitive engine of our ecosystem.",
        problem: "Enterprises are drowning in unstructured data (PDFs, Images, Audio) but lack reliable pipelines to extract structured intelligence. Existing tools are generic and fail in specialized domains like law and medicine.",
        whatYouBuild: "You will build 'Olivia', a multi-modal AI agent capable of reading medical records, parsing legal contracts, or analyzing financial audits with >95% accuracy. This involves setting up RAG pipelines, fine-tuning Llama-3/Mistral models, and deploying high-throughput inference servers.",
        output: "A working API and Dashboard where users upload documents and get JSON output + Chat Interface for Q&A.",
        skills: ["AI", "Prompt Engineering", "Python", "PyTorch/TensorFlow", "OpenAI/Anthropic APIs", "RAG (Vector DBs)", "FastAPI", "LangChain"],
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
        skills: ["Full Stack", "Content Management", "React / Next.js 14", "TypeScript", "TailwindCSS", "Supabase / PostgreSQL", "Real-time State Management", "WebSockets"],
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
        skills: ["Leads", "Financial", "Content Management", "Figma / UI/UX", "Copywriting", "Video Editing (Premiere/DaVinci)", "Social Media Analytics", "Community Building", "SEO/SEM"],
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

export default function ProjectDetail({ params }: { params: { slug: string } }) {
    const project = PROJECTS[params.slug];

    if (!project) {
        return (
            <main style={{ padding: '100px 20px', textAlign: 'center' }}>
                <h1>Project Not Found</h1>
                <Link href="/" className="cta-button">Go Home</Link>
            </main>
        )
    }

    return (
        <main style={{ background: 'var(--secondary-bg)', minHeight: '100vh', padding: '40px 0' }}>
            <div className="container" style={{ maxWidth: '900px' }}>
                <Link href="/#hackathon" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', marginBottom: '30px', textDecoration: 'none', fontWeight: 500 }}>
                    <ArrowLeft size={20} /> Back to Tracks
                </Link>

                {/* Header */}
                <div className="glass-card" style={{ padding: '40px', marginBottom: '30px', borderLeft: '6px solid var(--brand-primary)', background: 'white' }}>
                    <div style={{ textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.85rem', color: 'var(--brand-primary)', fontWeight: 700, marginBottom: '10px' }}>
                        Track / Project
                    </div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '10px', color: 'var(--text-primary)' }}>{project.title}</h1>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>{project.subtitle}</p>
                </div>

                {/* Vision Section (New) */}
                <div className="glass-card" style={{ padding: '30px', marginBottom: '30px', background: 'linear-gradient(to right, #4f46e5, #4338ca)', color: 'white', border: 'none' }}>
                    <h3 style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px', color: 'white' }}>
                        <Target size={24} /> Strategic Vision
                    </h3>
                    <p style={{ lineHeight: 1.6, fontSize: '1.05rem', color: 'rgba(255,255,255,0.9)' }}>{project.vision}</p>
                </div>

                {/* Problem & Solution */}
                <div style={{ display: 'grid', gap: '30px', marginBottom: '40px' }}>
                    <div className="glass-card" style={{ padding: '30px' }}>
                        <h3 style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '1.5rem' }}>🧐</span> The Problem
                        </h3>
                        <p style={{ lineHeight: 1.6, color: 'var(--text-secondary)', fontSize: '1.05rem' }}>{project.problem}</p>
                    </div>

                    <div className="glass-card" style={{ padding: '30px', background: 'white' }}>
                        <h3 style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '1.5rem' }}>🚀</span> What You Will Build
                        </h3>
                        <p style={{ lineHeight: 1.6, color: 'var(--text-primary)', fontSize: '1.05rem', fontWeight: 500 }}>{project.whatYouBuild}</p>
                        <div style={{ marginTop: '20px', padding: '15px', background: 'var(--secondary-bg)', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                            <strong style={{ color: 'var(--brand-primary)' }}>Expected Output:</strong> <br />
                            {project.output}
                        </div>
                    </div>
                </div>

                {/* Skills & Roles */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                    <div className="glass-card" style={{ padding: '30px' }}>
                        <h4 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Code size={20} color="var(--brand-primary)" /> Required Skills
                        </h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                            {project.skills.map((skill: string) => (
                                <span key={skill} style={{ padding: '8px 16px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--brand-primary)', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 600 }}>
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="glass-card" style={{ padding: '30px' }}>
                        <h4 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Users size={20} color="var(--brand-primary)" /> Who We Need
                        </h4>
                        <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                            {project.roles.map((role: string) => (
                                <li key={role} style={{ marginBottom: '8px' }}>{role}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* CTA */}
                <div style={{ marginTop: '50px', textAlign: 'center' }}>
                    <Link href={`/apply?track=${params.slug}`} className="cta-button" style={{ fontSize: '1.2rem', padding: '16px 48px' }}>
                        Apply for {project.title}
                    </Link>
                    <p style={{ marginTop: '16px', color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>
                        Limited seats available for the upcoming cohort.
                    </p>
                </div>

            </div>
        </main>
    )
}
