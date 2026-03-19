import React, { useMemo, useState } from "react";
import {
  Download,
  Plus,
  Trash2,
  FileText,
  Briefcase,
  GraduationCap,
  Sparkles,
  Moon,
  Sun,
  CheckCircle2,
  LayoutTemplate,
  ShieldCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const emptyExperience = () => ({
  role: "",
  company: "",
  location: "",
  startDate: "",
  endDate: "",
  achievements: "",
});

const emptyEducation = () => ({
  degree: "",
  school: "",
  location: "",
  startDate: "",
  endDate: "",
  details: "",
});

const templates = {
  modern: {
    id: "modern",
    name: "Modern",
    subtitle: "Premium with soft visual accents",
  },
  executive: {
    id: "executive",
    name: "Executive",
    subtitle: "Elegant and refined for senior roles",
  },
  ats: {
    id: "ats",
    name: "ATS-Friendly",
    subtitle: "Minimal formatting for applicant tracking systems",
  },
};

const initialData = {
  fullName: "Alex Johnson",
  title: "Marketing Manager",
  email: "alex.johnson@email.com",
  phone: "+44 7123 456789",
  address: "London, United Kingdom",
  linkedin: "linkedin.com/in/alexjohnson",
  website: "alexjohnson.dev",
  summary:
    "Results-driven professional with experience leading cross-functional teams, improving processes, and delivering measurable business outcomes. Skilled in communication, planning, and stakeholder management.",
  skills: "Leadership, Project Management, Communication, Data Analysis, Team Collaboration",
  certifications: "Google Analytics Certification, HubSpot Content Marketing, Meta Ads Certification",
  experience: [
    {
      role: "Senior Marketing Executive",
      company: "BrightWave Media",
      location: "London",
      startDate: "Jan 2022",
      endDate: "Present",
      achievements:
        "Led multi-channel campaigns that increased lead generation by 28%.\nManaged a team of 4 and improved project delivery timelines.\nCollaborated with sales and design teams to launch new brand assets.",
    },
  ],
  education: [
    {
      degree: "B.A. in Business Management",
      school: "University of Manchester",
      location: "Manchester",
      startDate: "2016",
      endDate: "2019",
      details: "Graduated with Honors.",
    },
  ],
};

function SectionTitle({ icon: Icon, children, darkMode = false }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className={`rounded-2xl p-2 ${darkMode ? "bg-slate-800 text-slate-100" : "bg-slate-100 text-slate-900"}`}>
        <Icon className="h-4 w-4" />
      </div>
      <h2 className="text-lg font-semibold tracking-tight">{children}</h2>
    </div>
  );
}

function PreviewSection({ title, children, darkMode = false, template = "modern" }) {
  return (
    <div className="mb-6">
      <div
        className={`pb-1 mb-3 ${
          template === "executive"
            ? darkMode
              ? "border-b border-amber-500/40"
              : "border-b border-amber-600/40"
            : darkMode
              ? "border-b border-slate-700"
              : "border-b border-slate-300"
        }`}
      >
        <h3
          className={`text-sm font-bold uppercase tracking-[0.2em] ${
            template === "executive"
              ? darkMode
                ? "text-amber-300"
                : "text-amber-800"
              : darkMode
                ? "text-slate-300"
                : "text-slate-700"
          }`}
        >
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}

export default function CVBuilderWebsite() {
  const [data, setData] = useState(initialData);
  const [downloadMode, setDownloadMode] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [template, setTemplate] = useState("modern");
  
  const skillList = useMemo(
    () => data.skills.split(",").map((s) => s.trim()).filter(Boolean),
    [data.skills]
  );
  const certificationList = useMemo(
    () => data.certifications.split(",").map((s) => s.trim()).filter(Boolean),
    [data.certifications]
  );

  const atsSuggestions = useMemo(() => {
    const suggestions = [];
    if (!data.summary.trim()) suggestions.push("Add a short professional summary.");
    if (skillList.length < 5) suggestions.push("Include at least 5 relevant skills for stronger keyword coverage.");
    if (!data.experience.some((item) => /\d/.test(item.achievements))) {
      suggestions.push("Use measurable achievements with numbers, percentages, or outcomes.");
    }
    if (!data.title.trim()) suggestions.push("Add a clear job title that matches your target role.");
    if (!data.experience.some((item) => item.role.trim() && item.company.trim())) {
      suggestions.push("Complete role and company names in your work history.");
    }
    return suggestions;
  }, [data, skillList]);

  const updateField = (field, value) => setData((prev) => ({ ...prev, [field]: value }));

  const updateExperience = (index, field, value) => {
    setData((prev) => {
      const next = [...prev.experience];
      next[index] = { ...next[index], [field]: value };
      return { ...prev, experience: next };
    });
  };

  const updateEducation = (index, field, value) => {
    setData((prev) => {
      const next = [...prev.education];
      next[index] = { ...next[index], [field]: value };
      return { ...prev, education: next };
    });
  };

  const addExperience = () => setData((prev) => ({ ...prev, experience: [...prev.experience, emptyExperience()] }));
  const addEducation = () => setData((prev) => ({ ...prev, education: [...prev.education, emptyEducation()] }));

  const removeExperience = (index) => {
    setData((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  };

  const removeEducation = (index) => {
    setData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  const escapeHtml = (value = "") =>
    value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");

  const buildWordHtml = () => {
    const contacts = [data.email, data.phone, data.address, data.linkedin, data.website].filter(Boolean).join(" | ");
    const isATS = template === "ats";
    const isExecutive = template === "executive";

    const pageBackground = isExecutive ? "#fffdf8" : "#ffffff";
    const pageBorder = isExecutive ? "#e7d9b0" : "#e5e7eb";
    const accent = isExecutive ? "#92400e" : "#334155";
    const muted = "#64748b";
    const headingBorder = isExecutive ? "#d6b46d" : "#cbd5e1";
    const skillBg = isExecutive ? "#fff7e6" : isATS ? "#ffffff" : "#f8fafc";
    const skillBorder = isExecutive ? "#e7d9b0" : "#cbd5e1";
    const radius = isATS ? "0px" : isExecutive ? "12px" : "18px";
    const titleAlign = template === "modern" ? "left" : "center";

    const experienceHtml = data.experience
      .map((item) => {
        const bullets = (item.achievements || "")
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean)
          .map(
            (line) => `
              <tr>
                <td style="width:16px; padding:0 8px 8px 0; vertical-align:top; font-size:14px; line-height:1.7; color:#334155;">&#8226;</td>
                <td style="padding:0 0 8px 0; vertical-align:top; font-size:14px; line-height:1.7; color:#334155;">${escapeHtml(line)}</td>
              </tr>
            `
          )
          .join("");

        return `
          <div style="margin:0 0 22px 0;">
            <table role="presentation" style="width:100%; border-collapse:collapse;">
              <tr>
                <td style="vertical-align:top; padding:0;">
                  <div style="font-size:16px; font-weight:700; color:#0f172a;">${escapeHtml(item.role || "Role")}</div>
                  <div style="font-size:14px; color:#334155; margin-top:4px;">${escapeHtml(item.company || "Company")}</div>
                </td>
                <td style="vertical-align:top; padding:0; text-align:right; width:180px; font-size:13px; color:${muted};">
                  <div>${escapeHtml(item.location || "")}</div>
                  <div style="margin-top:4px;">${escapeHtml([item.startDate, item.endDate].filter(Boolean).join(" - "))}</div>
                </td>
              </tr>
            </table>
            ${
              bullets
                ? `<div style="height:10px; line-height:10px; font-size:10px;">&nbsp;</div><table role="presentation" style="width:100%; border-collapse:collapse; margin:0;">${bullets}</table>`
                : ""
            }
          </div>
        `;
      })
      .join("");

    const educationHtml = data.education
      .map(
        (item) => `
          <div style="margin:0 0 22px 0;">
            <table role="presentation" style="width:100%; border-collapse:collapse;">
              <tr>
                <td style="vertical-align:top; padding:0;">
                  <div style="font-size:16px; font-weight:700; color:#0f172a;">${escapeHtml(item.degree || "Degree")}</div>
                  <div style="font-size:14px; color:#334155; margin-top:4px;">${escapeHtml(item.school || "Institution")}</div>
                  ${item.details ? `<div style="font-size:14px; color:${muted}; margin-top:6px;">${escapeHtml(item.details)}</div>` : ""}
                </td>
                <td style="vertical-align:top; padding:0; text-align:right; width:180px; font-size:13px; color:${muted};">
                  <div>${escapeHtml(item.location || "")}</div>
                  <div style="margin-top:4px;">${escapeHtml([item.startDate, item.endDate].filter(Boolean).join(" - "))}</div>
                </td>
              </tr>
            </table>
          </div>
        `
      )
      .join("");

    const measureSkillWidth = (skill) => {
      if (typeof document === "undefined") {
        return skill.length * 8 + 44;
      }

      const canvas = measureSkillWidth.canvas || (measureSkillWidth.canvas = document.createElement("canvas"));
      const context = canvas.getContext("2d");
      if (!context) {
        return skill.length * 8 + 44;
      }

      context.font = "13px Arial";
      return Math.ceil(context.measureText(skill).width) + 44;
    };

    const maxSkillRowWidth = 724;
    const skillGap = 10;
    const skillRows = [];
    let currentSkillRow = [];
    let currentSkillRowWidth = 0;

    skillList.forEach((skill) => {
      const pillWidth = measureSkillWidth(skill);
      const nextWidth = currentSkillRow.length ? currentSkillRowWidth + skillGap + pillWidth : pillWidth;

      if (currentSkillRow.length && nextWidth > maxSkillRowWidth) {
        skillRows.push(currentSkillRow);
        currentSkillRow = [skill];
        currentSkillRowWidth = pillWidth;
      } else {
        currentSkillRow.push(skill);
        currentSkillRowWidth = nextWidth;
      }
    });

    if (currentSkillRow.length) {
      skillRows.push(currentSkillRow);
    }

    const certificationRows = [];
    let currentCertificationRow = [];
    let currentCertificationRowWidth = 0;

    certificationList.forEach((certification) => {
      const pillWidth = measureSkillWidth(certification);
      const nextWidth = currentCertificationRow.length ? currentCertificationRowWidth + skillGap + pillWidth : pillWidth;

      if (currentCertificationRow.length && nextWidth > maxSkillRowWidth) {
        certificationRows.push(currentCertificationRow);
        currentCertificationRow = [certification];
        currentCertificationRowWidth = pillWidth;
      } else {
        currentCertificationRow.push(certification);
        currentCertificationRowWidth = nextWidth;
      }
    });

    if (currentCertificationRow.length) {
      certificationRows.push(currentCertificationRow);
    }

    const renderWordPill = (text) => {
      const pillWidthPx = measureSkillWidth(text);
      const pillWidthPt = Math.max(Math.round(pillWidthPx * 0.75), 72);

      return `
        <v:roundrect
          arcsize="${isATS ? "0%" : "50%"}"
          strokecolor="${skillBorder}"
          fillcolor="${skillBg}"
          style="height:28pt; width:${pillWidthPt}pt; v-text-anchor:middle;"
        >
          <w:anchorlock/>
          <center style="color:#334155; font-family:Arial, Helvetica, sans-serif; font-size:13px; line-height:16px; mso-line-height-rule:exactly; white-space:nowrap;">
            ${escapeHtml(text)}
          </center>
        </v:roundrect>
      `;
    };

    const skillsHtml = skillList.length
      ? skillRows
          .map(
            (row) => `
              <table role="presentation" style="border-collapse:separate; border-spacing:0; margin:0 0 10px 0;">
                <tr>
                  ${row
                    .map(
                      (skill) => `
                        <td style="padding:0 10px 0 0; vertical-align:top;">
                          ${renderWordPill(skill)}
                        </td>
                      `
                    )
                    .join("")}
                </tr>
              </table>
            `
          )
          .join("")
      : `<div style="font-size:14px; color:${muted};">Add your skills to display them here.</div>`;

    const certificationsHtml = certificationList.length
      ? certificationRows
          .map(
            (row) => `
              <table role="presentation" style="border-collapse:separate; border-spacing:0; margin:0 0 10px 0;">
                <tr>
                  ${row
                    .map(
                      (certification) => `
                        <td style="padding:0 10px 0 0; vertical-align:top;">
                          ${renderWordPill(certification)}
                        </td>
                      `
                    )
                    .join("")}
                </tr>
              </table>
            `
          )
          .join("")
      : `<div style="font-size:14px; color:${muted};">Add your certifications to display them here.</div>`;

    const summaryTitle = isATS ? "Summary" : "Professional Summary";
    const experienceTitle = isATS ? "Experience" : "Work Experience";

    return `
      <html xmlns:o="urn:schemas-microsoft-com:office:office"
            xmlns:w="urn:schemas-microsoft-com:office:word"
            xmlns:v="urn:schemas-microsoft-com:vml"
            xmlns="http://www.w3.org/TR/REC-html40">
        <head>
          <meta charset="utf-8" />
          <meta name="ProgId" content="Word.Document" />
          <meta name="Generator" content="Microsoft Word 15" />
          <meta name="Originator" content="Microsoft Word 15" />
          <style>
            @page WordSection {
              size: 8.27in 11.69in;
              margin: 0.55in;
              mso-page-border-surround-header: no;
              mso-page-border-surround-footer: no;
              mso-border-top-alt: solid ${pageBorder} 1pt;
              mso-border-right-alt: solid ${pageBorder} 1pt;
              mso-border-bottom-alt: solid ${pageBorder} 1pt;
              mso-border-left-alt: solid ${pageBorder} 1pt;
              mso-border-top-space: 18pt;
              mso-border-right-space: 18pt;
              mso-border-bottom-space: 18pt;
              mso-border-left-space: 18pt;
            }
            html, body {
              margin:0;
              padding:0;
              background:${pageBackground};
              font-family: Arial, Helvetica, sans-serif;
              mso-page-fill:${pageBackground};
              mso-page-fill-color:${pageBackground};
            }
            .word-section { page: WordSection; }
            * { box-sizing: border-box; }
          </style>
        </head>
        <body>
          <div class="word-section" style="padding:24px; background:${pageBackground};">
            <div style="max-width:800px; margin:0 auto; background:${pageBackground}; padding:34px 38px;">
              <div style="padding-bottom:20px; margin-bottom:24px; border-bottom:1px solid ${headingBorder}; text-align:${titleAlign};">
                <div style="font-size:32px; line-height:1.2; font-weight:700; color:#0f172a;">${escapeHtml(data.fullName || "Your Name")}</div>
                <div style="font-size:20px; color:${isExecutive ? accent : muted}; margin-top:8px;">${escapeHtml(data.title || "Professional Title")}</div>
                <div style="font-size:13px; color:${muted}; margin-top:14px; line-height:1.7;">${escapeHtml(contacts)}</div>
              </div>

              ${data.summary.trim() ? `
                <div style="margin-bottom:24px;">
                  <div style="padding-bottom:6px; margin-bottom:12px; border-bottom:1px solid ${headingBorder}; font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:2px; color:${accent};">${summaryTitle}</div>
                  <div style="font-size:14px; line-height:1.8; color:#334155;">${escapeHtml(data.summary)}</div>
                </div>
              ` : ""}

              <div style="margin-bottom:24px;">
                <div style="padding-bottom:6px; margin-bottom:12px; border-bottom:1px solid ${headingBorder}; font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:2px; color:${accent};">${experienceTitle}</div>
                ${experienceHtml}
              </div>

              <div style="margin-bottom:24px;">
                <div style="padding-bottom:6px; margin-bottom:12px; border-bottom:1px solid ${headingBorder}; font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:2px; color:${accent};">Education</div>
                ${educationHtml}
              </div>

              <div>
                <div style="padding-bottom:6px; margin-bottom:12px; border-bottom:1px solid ${headingBorder}; font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:2px; color:${accent};">Skills</div>
                <div>${skillsHtml}</div>
              </div>

              <div style="margin-top:24px;">
                <div style="padding-bottom:6px; margin-bottom:12px; border-bottom:1px solid ${headingBorder}; font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:2px; color:${accent};">Certifications</div>
                <div>${certificationsHtml}</div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
  };

  const downloadCV = async () => {
    try {
      setDownloading(true);

      const wordHtml = buildWordHtml();
      const blob = new Blob(["﻿", wordHtml], {
        type: "application/msword;charset=utf-8",
      });

      const safeName = (data.fullName || "cv").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const fileName = `${safeName || "cv"}-${template}-cv.doc`;
      const url = window.URL.createObjectURL(blob);
      const link = window.document.createElement("a");
      link.href = url;
      link.download = fileName;
      window.document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        window.document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error("Failed to generate Word file:", error);
      alert("Something went wrong while generating the Word file.");
    } finally {
      setDownloading(false);
    }
  };

  const buildFileName = (extension) => {
    const safeName = (data.fullName || "cv").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
    return `${safeName || "cv"}-${template}-cv.${extension}`;
  };

  const downloadWordCV = async () => {
    try {
      setDownloadMode("word");

      const wordHtml = buildWordHtml();
      const blob = new Blob(["\uFEFF", wordHtml], {
        type: "application/msword;charset=utf-8",
      });

      const url = window.URL.createObjectURL(blob);
      const link = window.document.createElement("a");
      link.href = url;
      link.download = buildFileName("doc");
      window.document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        window.document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error("Failed to generate Word file:", error);
      alert("Something went wrong while generating the Word file.");
    } finally {
      setDownloadMode(null);
    }
  };


  const appShell = darkMode
    ? "min-h-screen bg-slate-950 text-slate-100"
    : "min-h-screen bg-slate-50 text-slate-900";

  const mutedText = darkMode ? "text-slate-400" : "text-slate-600";
  const cardBase = darkMode ? "rounded-3xl shadow-sm border border-slate-800 bg-slate-900" : "rounded-3xl shadow-sm border-0 bg-white";
  const softPanel = darkMode ? "bg-slate-900/70 border border-slate-800" : "bg-white border border-slate-200";
  const previewPillClass =
    template === "ats"
      ? darkMode
        ? "inline-flex h-8 items-center justify-center border border-slate-700 px-4 leading-none align-middle text-slate-300"
        : "inline-flex h-8 items-center justify-center border border-slate-300 px-4 leading-none align-middle text-slate-700"
      : template === "executive"
        ? darkMode
          ? "inline-flex h-8 items-center justify-center rounded-full border border-amber-500/30 bg-amber-500/10 px-4 leading-none align-middle text-amber-100"
          : "inline-flex h-8 items-center justify-center rounded-full border border-amber-200 bg-amber-50 px-4 leading-none align-middle text-amber-900"
        : darkMode
          ? "inline-flex h-8 items-center justify-center rounded-full border border-slate-700 bg-slate-800 px-4 leading-none align-middle text-slate-200"
          : "inline-flex h-8 items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-4 leading-none align-middle text-slate-700";

  const previewWrapperClass =
    template === "executive"
      ? darkMode
        ? "mx-auto max-w-[800px] rounded-sm bg-[#111111] shadow-2xl min-h-[1000px] p-8 md:p-10 border border-amber-500/20"
        : "mx-auto max-w-[800px] rounded-sm bg-[#fffdf8] shadow-2xl min-h-[1000px] p-8 md:p-10 border border-amber-200"
      : template === "ats"
        ? darkMode
          ? "mx-auto max-w-[800px] rounded-sm bg-slate-950 shadow-2xl min-h-[1000px] p-8 md:p-10 border border-slate-700"
          : "mx-auto max-w-[800px] rounded-sm bg-white shadow-lg min-h-[1000px] p-8 md:p-10 border border-slate-200"
        : darkMode
          ? "mx-auto max-w-[800px] rounded-[28px] bg-slate-900 shadow-2xl min-h-[1000px] p-8 md:p-10 border border-slate-800"
          : "mx-auto max-w-[800px] rounded-[28px] bg-white shadow-2xl min-h-[1000px] p-8 md:p-10 border border-slate-100";

  return (
    <div className={appShell}>
      <div className="max-w-7xl mx-auto px-4 py-8 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm shadow-sm ${darkMode ? "border border-slate-800 bg-slate-900" : "border border-slate-200 bg-white"}`}>
                <Sparkles className="h-4 w-4" />
                Premium CV Builder
              </div>
              <h1 className="mt-4 text-3xl md:text-5xl font-bold tracking-tight">
                Create a polished CV with premium themes and ATS-ready templates
              </h1>
              <p className={`mt-3 max-w-3xl text-base md:text-lg ${mutedText}`}>
                Fill in your details, switch between premium templates, preview the layout instantly, and export a Word CV in one click.
              </p>
            </div>
            <Button
              onClick={() => setDarkMode((prev) => !prev)}
              variant="outline"
              className={`rounded-2xl ${darkMode ? "border-slate-700 bg-slate-900 hover:bg-slate-800" : "bg-white"}`}
            >
              {darkMode ? <Sun className="h-4 w-4 mr-2" /> : <Moon className="h-4 w-4 mr-2" />}
              {darkMode ? "Light Mode" : "Dark Mode"}
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
          <div className="space-y-6">
            <Card className={cardBase}>
              <CardHeader>
                <CardTitle className="text-xl">Design & Template</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div>
                  <Label className="mb-3 block">Choose a template</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {Object.values(templates).map((item) => {
                      const active = template === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setTemplate(item.id)}
                          className={`rounded-2xl border p-4 text-left transition-all ${
                            active
                              ? darkMode
                                ? "border-slate-500 bg-slate-800 shadow-lg"
                                : "border-slate-900 bg-slate-50 shadow-lg"
                              : darkMode
                                ? "border-slate-800 bg-slate-900 hover:bg-slate-800"
                                : "border-slate-200 bg-white hover:bg-slate-50"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="font-semibold flex items-center gap-2">
                                <LayoutTemplate className="h-4 w-4" />
                                {item.name}
                              </div>
                              <p className={`mt-2 text-sm ${mutedText}`}>{item.subtitle}</p>
                            </div>
                            {active && <CheckCircle2 className="h-5 w-5 shrink-0" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className={`rounded-2xl p-4 ${softPanel}`}>
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="h-5 w-5 mt-0.5" />
                    <div>
                      <h3 className="font-semibold">ATS optimization</h3>
                      <p className={`text-sm mt-1 ${mutedText}`}>
                        The ATS-friendly template uses simpler formatting, plain section titles, and keyword-friendly structure for screening systems.
                      </p>
                    </div>
                  </div>
                  {atsSuggestions.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {atsSuggestions.map((item, index) => (
                        <div key={index} className={`text-sm rounded-xl px-3 py-2 ${darkMode ? "bg-slate-800 text-slate-200" : "bg-slate-50 text-slate-700"}`}>
                          {item}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className={cardBase}>
              <CardHeader>
                <CardTitle className="text-xl">Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label>Full Name</Label>
                  <Input value={data.fullName} onChange={(e) => updateField("fullName", e.target.value)} />
                </div>
                <div>
                  <Label>Job Title</Label>
                  <Input value={data.title} onChange={(e) => updateField("title", e.target.value)} />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input value={data.email} onChange={(e) => updateField("email", e.target.value)} />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input value={data.phone} onChange={(e) => updateField("phone", e.target.value)} />
                </div>
                <div>
                  <Label>Address</Label>
                  <Input value={data.address} onChange={(e) => updateField("address", e.target.value)} />
                </div>
                <div>
                  <Label>LinkedIn</Label>
                  <Input value={data.linkedin} onChange={(e) => updateField("linkedin", e.target.value)} />
                </div>
                <div>
                  <Label>Website</Label>
                  <Input value={data.website} onChange={(e) => updateField("website", e.target.value)} />
                </div>
              </CardContent>
            </Card>

            <Card className={cardBase}>
              <CardHeader>
                <CardTitle className="text-xl">Professional Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  className="min-h-[120px]"
                  value={data.summary}
                  onChange={(e) => updateField("summary", e.target.value)}
                />
              </CardContent>
            </Card>

            <Card className={cardBase}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl">Work Experience</CardTitle>
                <Button onClick={addExperience} variant="outline" className="rounded-2xl">
                  <Plus className="h-4 w-4 mr-2" /> Add
                </Button>
              </CardHeader>
              <CardContent className="space-y-5">
                {data.experience.map((item, index) => (
                  <div key={index} className={`rounded-2xl border p-4 space-y-4 ${darkMode ? "border-slate-800 bg-slate-950" : "border-slate-200 bg-slate-50"}`}>
                    <div className="flex items-center justify-between">
                      <SectionTitle icon={Briefcase} darkMode={darkMode}>Experience {index + 1}</SectionTitle>
                      {data.experience.length > 1 && (
                        <Button variant="ghost" size="icon" onClick={() => removeExperience(index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Role</Label>
                        <Input value={item.role} onChange={(e) => updateExperience(index, "role", e.target.value)} />
                      </div>
                      <div>
                        <Label>Company</Label>
                        <Input value={item.company} onChange={(e) => updateExperience(index, "company", e.target.value)} />
                      </div>
                      <div>
                        <Label>Location</Label>
                        <Input value={item.location} onChange={(e) => updateExperience(index, "location", e.target.value)} />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>Start</Label>
                          <Input value={item.startDate} onChange={(e) => updateExperience(index, "startDate", e.target.value)} />
                        </div>
                        <div>
                          <Label>End</Label>
                          <Input value={item.endDate} onChange={(e) => updateExperience(index, "endDate", e.target.value)} />
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <Label>Achievements</Label>
                        <Textarea
                          className="min-h-[120px]"
                          placeholder="Write one achievement per line"
                          value={item.achievements}
                          onChange={(e) => updateExperience(index, "achievements", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className={cardBase}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl">Education</CardTitle>
                <Button onClick={addEducation} variant="outline" className="rounded-2xl">
                  <Plus className="h-4 w-4 mr-2" /> Add
                </Button>
              </CardHeader>
              <CardContent className="space-y-5">
                {data.education.map((item, index) => (
                  <div key={index} className={`rounded-2xl border p-4 space-y-4 ${darkMode ? "border-slate-800 bg-slate-950" : "border-slate-200 bg-slate-50"}`}>
                    <div className="flex items-center justify-between">
                      <SectionTitle icon={GraduationCap} darkMode={darkMode}>Education {index + 1}</SectionTitle>
                      {data.education.length > 1 && (
                        <Button variant="ghost" size="icon" onClick={() => removeEducation(index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Degree</Label>
                        <Input value={item.degree} onChange={(e) => updateEducation(index, "degree", e.target.value)} />
                      </div>
                      <div>
                        <Label>School / University</Label>
                        <Input value={item.school} onChange={(e) => updateEducation(index, "school", e.target.value)} />
                      </div>
                      <div>
                        <Label>Location</Label>
                        <Input value={item.location} onChange={(e) => updateEducation(index, "location", e.target.value)} />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>Start</Label>
                          <Input value={item.startDate} onChange={(e) => updateEducation(index, "startDate", e.target.value)} />
                        </div>
                        <div>
                          <Label>End</Label>
                          <Input value={item.endDate} onChange={(e) => updateEducation(index, "endDate", e.target.value)} />
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <Label>Details</Label>
                        <Textarea
                          value={item.details}
                          onChange={(e) => updateEducation(index, "details", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className={cardBase}>
              <CardHeader>
                <CardTitle className="text-xl">Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <Label>Comma-separated skills</Label>
                <Textarea value={data.skills} onChange={(e) => updateField("skills", e.target.value)} />
                <div className="flex flex-wrap gap-2 mt-4">
                  {skillList.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="rounded-full px-3 py-1 text-sm">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className={cardBase}>
              <CardHeader>
                <CardTitle className="text-xl">Certifications</CardTitle>
              </CardHeader>
              <CardContent>
                <Label>Comma-separated certifications</Label>
                <Textarea value={data.certifications} onChange={(e) => updateField("certifications", e.target.value)} />
                <div className="flex flex-wrap gap-2 mt-4">
                  {certificationList.map((certification, index) => (
                    <Badge key={index} variant="secondary" className="rounded-full px-3 py-1 text-sm">
                      {certification}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="xl:sticky xl:top-6 space-y-6">
            <Card className={cardBase + " overflow-hidden"}>
              <div className={`flex items-center justify-between border-b px-6 py-4 ${darkMode ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-white"}`}>
                <div className="flex items-center gap-3">
                  <div className={`rounded-2xl p-2 ${darkMode ? "bg-slate-800" : "bg-slate-100"}`}>
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-semibold">CV Preview</h2>
                    <p className={`text-sm ${mutedText}`}>
                      {templates[template].name} template
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button onClick={downloadWordCV} disabled={!!downloadMode} className="rounded-2xl">
                    <Download className="h-4 w-4 mr-2" />
                    {downloadMode === "word" ? "Preparing Word..." : "Download Word"}
                  </Button>
                </div>
              </div>

              <CardContent className={darkMode ? "bg-slate-950 p-4 md:p-6" : "bg-slate-100 p-4 md:p-6"}>
                <div className={previewWrapperClass}>
                  <div
                    className={`pb-5 mb-6 ${
                      template === "ats"
                        ? darkMode
                          ? "border-b border-slate-700"
                          : "border-b border-slate-300"
                        : template === "executive"
                          ? darkMode
                            ? "border-b border-amber-500/30"
                            : "border-b border-amber-300"
                          : darkMode
                            ? "border-b border-slate-700"
                            : "border-b border-slate-200"
                    } ${template === "modern" ? "text-left" : "text-center"}`}
                  >
                    <h1 className={`text-3xl font-bold tracking-tight ${template === "executive" ? (darkMode ? "text-amber-100" : "text-slate-900") : ""}`}>
                      {data.fullName || "Your Name"}
                    </h1>
                    <p className={`${template === "executive" ? (darkMode ? "text-amber-300" : "text-amber-700") : darkMode ? "text-slate-300" : "text-slate-600"} mt-1 text-lg`}>
                      {data.title || "Professional Title"}
                    </p>
                    <p className={`text-sm mt-3 leading-6 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                      {[data.email, data.phone, data.address, data.linkedin, data.website].filter(Boolean).join(" | ")}
                    </p>
                  </div>

                  {!!data.summary.trim() && (
                    <PreviewSection title={template === "ats" ? "Summary" : "Professional Summary"} darkMode={darkMode} template={template}>
                      <p className={`text-sm leading-7 ${darkMode ? "text-slate-300" : "text-slate-700"}`}>{data.summary}</p>
                    </PreviewSection>
                  )}

                  <PreviewSection title={template === "ats" ? "Experience" : "Work Experience"} darkMode={darkMode} template={template}>
                    <div className="space-y-5">
                      {data.experience.map((item, index) => (
                        <div key={index}>
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                            <div>
                              <h4 className={`font-semibold ${darkMode ? "text-slate-100" : "text-slate-900"}`}>{item.role || "Role"}</h4>
                              <p className={`text-sm ${darkMode ? "text-slate-300" : "text-slate-700"}`}>{item.company || "Company"}</p>
                            </div>
                            <div className={`text-sm md:text-right ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                              <p>{item.location}</p>
                              <p>{[item.startDate, item.endDate].filter(Boolean).join(" - ")}</p>
                            </div>
                          </div>
                          <ul className={`mt-3 list-disc pl-5 space-y-1 text-sm leading-6 ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                            {item.achievements
                              .split("\n")
                              .map((line) => line.trim())
                              .filter(Boolean)
                              .map((line, i) => (
                                <li key={i}>{line}</li>
                              ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </PreviewSection>

                  <PreviewSection title="Education" darkMode={darkMode} template={template}>
                    <div className="space-y-5">
                      {data.education.map((item, index) => (
                        <div key={index}>
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                            <div>
                              <h4 className={`font-semibold ${darkMode ? "text-slate-100" : "text-slate-900"}`}>{item.degree || "Degree"}</h4>
                              <p className={`text-sm ${darkMode ? "text-slate-300" : "text-slate-700"}`}>{item.school || "Institution"}</p>
                              {item.details && <p className={`text-sm mt-1 ${darkMode ? "text-slate-400" : "text-slate-600"}`}>{item.details}</p>}
                            </div>
                            <div className={`text-sm md:text-right ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                              <p>{item.location}</p>
                              <p>{[item.startDate, item.endDate].filter(Boolean).join(" - ")}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </PreviewSection>

                  <PreviewSection title="Skills" darkMode={darkMode} template={template}>
                    <div className="flex flex-wrap gap-2">
                      {skillList.length ? (
                        skillList.map((skill, index) => (
                          <span key={index} className={`preview-pill ${previewPillClass} text-sm`}>
                            <span className="preview-pill__text">{skill}</span>
                          </span>
                        ))
                      ) : (
                        <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Add your skills to display them here.</p>
                      )}
                    </div>
                  </PreviewSection>

                  <PreviewSection title="Certifications" darkMode={darkMode} template={template}>
                    <div className="flex flex-wrap gap-2">
                      {certificationList.length ? (
                        certificationList.map((certification, index) => (
                          <span key={index} className={`preview-pill ${previewPillClass} text-sm`}>
                            <span className="preview-pill__text">{certification}</span>
                          </span>
                        ))
                      ) : (
                        <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Add your certifications to display them here.</p>
                      )}
                    </div>
                  </PreviewSection>
                </div>
              </CardContent>
            </Card>

            <Card className={cardBase}>
              <CardHeader>
                <CardTitle className="text-xl">Tips for a stronger CV</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  "Use action verbs like led, delivered, improved, built, and managed.",
                  "Match your title and skills to the job description keywords.",
                  "Keep bullet points focused on results, not only responsibilities.",
                ].map((tip, index) => (
                  <div key={index} className={`rounded-2xl px-4 py-3 text-sm ${darkMode ? "bg-slate-950 border border-slate-800 text-slate-300" : "bg-slate-50 text-slate-700"}`}>
                    {tip}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
