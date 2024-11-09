"use client";
import { useActions, useUIState } from "ai/rsc";
import { Button } from "../ui/button";
import { TemplateDialog } from "./template-dialog";
import { useLocalStorage } from "@uidotdev/usehooks";
import { UserData } from "./types";
import { USER_DATA_STORAGE_KEY } from "./data";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { useState, ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface TemplateInfo {
  title: string;
  description: string | ReactNode;
  template: string;
}

const careerStageTemplates: TemplateInfo[] = [
  {
    title: "General cover letter",
    description: (
      <p className="text-xs">
        A versatile template suitable for customizing to a wide array of
        industries and positions. When personalized appropriately, this cover
        letter format can be adapted to showcase your unique skills,
        experiences, and qualifications for each role you target. Source:{" "}
        <a
          href="https://www.upwork.com/resources/cover-letter-template"
          target="_blank"
          className="underline"
        >
          template
        </a>
      </p>
    ),
    template: `\
[DATE]  

DEAR [HIRING MANAGER NAME],  

I am writing to express my strong interest in the [POSITION NAME] role at [COMPANY]. With my [MOST RELEVANT SKILL AND EXPERIENCE] and enthusiasm for [INDUSTRY], I am confident in my ability to make a significant contribution to your organization.  

Throughout my [EDUCATIONAL BACKGROUND AND/OR WORK EXPERIENCE], I have consistently demonstrated [KEY STRENGTH], which has led to [SPECIFIC ACCOMPLISHMENTS]. I possess a versatile skill set, including [SKILLS AND ABILITIES], which I believe will be highly valuable in the [POSITION NAME] role.  

I greatly admire [COMPANY'S] commitment to [SPECIFIC ASPECT OF ORGANIZATIONAL CULTURE OR VALUES], and I am excited about the prospect of contributing to an organization that [COMPANY OBJECTIVE].  

In my [CURRENT OR MOST RECENT ROLE] as [JOB TITLE] at [COMPANY], I [CONCISE DESCRIPTION OF MAIN RESPONSIBILITIES OR PROJECTS]. During this time, I successfully [ACHIEVEMENT], which resulted in [QUANTIFIABLE RESULT OR BENEFIT TO COMPANY].  

This experience has further honed my [SKILLS OR COMPETENCIES], which I believe will be directly applicable to the challenges and opportunities within the [POSITION NAME] role.  

Beyond my technical abilities and experience, I take pride in my [SOFT SKILLS], which have been instrumental to my success. I am a [ADJECTIVE DESCRIBING WORK STYLE], and I thrive in [TYPE OF WORK ENVIRONMENT]. I am confident that these qualities, combined with my passion for [INDUSTRY], will enable me to excel in the [POSITION NAME] role.  

Thank you for considering my application. I look forward to the possibility of contributing to your team and am eager to discuss how my skills and experience can benefit [COMPANY].  

Sincerely,  
[YOUR NAME]  
`,
  },
  {
    title: "Entry-level cover letter template",
    description: (
      <p className="text-xs">
        Ideal for recent college graduates or those with more limited work
        experience, focusing heavily on transferable skills and academic
        achievements. Source:{" "}
        <a
          href="https://www.upwork.com/resources/entry-level-cover-letter-template"
          target="_blank"
          className="underline"
        >
          template
        </a>
      </p>
    ),
    template: `\
[DATE]  

[DEAR HIRING MANAGER NAME],  

I'm writing to express my strong interest in the [POSITION NAME] role at [COMPANY]. As a highly motivated recent graduate from [COLLEGE NAME] with a degree in [MAJOR], I'm confident in my ability to apply my knowledge, skills, and passion to contribute to your organization's success.  

While I might not have extensive professional experience, I have actively sought opportunities to develop my skills and gain practical knowledge. Through [INTERNSHIPS, PART-TIME JOBS, OR VOLUNTEER WORK], I have successfully demonstrated my ability to [KEY STRENGTH OR ACHIEVEMENT]. These experiences have not only reinforced my enthusiasm for [INDUSTRY] but also prepared me to excel in an entry-level role.  

My coursework in [RELEVANT ACADEMIC AREA], coupled with my [PERTINENT EXTRACURRICULAR ACTIVITIES OR PROJECTS], has equipped me with a solid foundation that I'm eager to apply in a professional setting. In addition, I'm known for my strong work ethic and [SOFT SKILLS OR PERSONAL TRAITS]. As a highly driven self-starter who's deeply committed to learning and growing, I'm excited about the prospect of making a significant impact on your team.  

I'm particularly drawn to your organization's [SPECIFIC ASPECT OF COMPANY CULTURE OR KEY INITIATIVES] and believe that my [INTERESTS AND/OR PERSONAL ATTRIBUTES] align with your organization's values and mission. I'm thrilled about the opportunity to bring a fresh perspective, learn from experienced professionals, and hit the ground running to contribute to the ongoing success of your team.  

Thank you for considering my application for this exciting opportunity. I welcome the chance to discuss how my mix of skills, passion, and desire to make a meaningful difference could benefit [COMPANY].  

Sincerely,  
[YOUR NAME]  
`,
  },
  {
    title: "Mid-career cover letter template",
    description: (
      <p className="text-xs">
        Intended for professionals with at least several years of experience,
        emphasizing career progression and key achievements. Source:{" "}
        <a
          href="https://www.upwork.com/resources/mid-career-cover-letter-template"
          target="_blank"
          className="underline"
        >
          template
        </a>
      </p>
    ),
    template: `\
[DATE]  

[DEAR HIRING MANAGER NAME],  

As a highly motivated professional with [RELEVANT SKILLS AND EXPERIENCE] and a genuine passion for [INDUSTRY], I am thrilled at the possibility of joining [COMPANY] as [POSITION TITLE]. As a seasoned professional with more than [NUMBER] years of experience, I am confident that my proven track record of success makes me an ideal candidate for this role.  

Throughout my career, I have consistently demonstrated [KEY STRENGTH OR ACCOMPLISHMENT], which has led to [SPECIFIC RESULT].  

My diverse professional background, including [LIST OF RELEVANT POSITIONS], has equipped me with a comprehensive understanding of [INDUSTRY] and a robust skill set encompassing [RELEVANT SKILLS]. These skills, coupled with my extensive experience and knowledge, have enabled me to drive significant results and exceed expectations in my previous roles.  

In my current role as [JOB TITLE] at [COMPANY], I have been instrumental in [BRIEF DESCRIPTION OF MAJOR RESPONSIBILITIES AND ACHIEVEMENTS]. Most notably, I spearheaded [SPECIFIC ACCOMPLISHMENT OR PROJECT], which resulted in [QUANTIFIABLE OUTCOME OR BENEFIT TO COMPANY]. This experience exemplifies my abilities and commitment to driving tangible results.  

Prior to my current position, I held progressive roles at [PREVIOUS COMPANY], including [PREVIOUS JOB TITLE]. In this capacity, I [BRIEF DESCRIPTION OF CORE RESPONSIBILITIES AND ACHIEVEMENTS], further advancing my [RELEVANT ABILITIES]. My successful history, combined with my [EDUCATION OR PROFESSIONAL CERTIFICATIONS], has provided me with the depth and breadth of knowledge necessary to excel in the [POSITION NAME] role.  

Thank you for considering my application. I welcome the opportunity to discuss further how my unique combination of skills and experience can contribute to your organization's goals. I look forward to the possibility of joining your team and playing a key role in the continued success of [COMPANY].  

Sincerely,  
[YOUR NAME]  
`,
  },
];

const roleTemplates: TemplateInfo[] = [
  {
    title: "Virtual Assistant Cover Letter Template",
    description: (
      <p className="text-xs">
        This mid-career cover letter template is ideal for those looking for a
        new position in their current industry. It includes key areas to
        highlight. Source:{" "}
        <a
          href="https://www.upwork.com/resources/virtual-assistant-cover-letter-template"
          target="_blank"
          className="underline"
        >
          template
        </a>
      </p>
    ),
    template: `\
[DATE]  

[DEAR HIRING MANAGER NAME],  

I'm thrilled to apply for the virtual assistant position at [COMPANY]. My background in providing efficient administrative and support services aligns seamlessly with [COMPANY'S] commitment to [COMPANY'S STATED GOAL]. I'm eager to contribute to [COMPANY'S] success by streamlining operations and supporting your team as your next virtual assistant.  

In my previous roles, notably at [PREVIOUS COMPANY], I honed my skills in areas such as [SPECIFIC SKILLS OR EXPERIENCES, e.g., schedule management, email correspondence, data entry]. My experience in [KEY DUTIES, e.g., managing complex calendars, handling customer inquiries, and maintaining organized digital records] has been instrumental in enhancing productivity and efficiency. Furthermore, I'm proficient in various virtual collaboration tools and software, including [SPECIFIC SOFTWARE NAMES, e.g., Zoom, Slack, Microsoft Office, Asana, Salesforce], which I believe will be essential in this role.  

I am particularly drawn to this opportunity at [COMPANY] because of [SPECIFIC REASON RELATED TO COMPANY OR INDUSTRY]. What sets me apart is my unwavering commitment to delivering high-quality, personalized support. I understand the importance of anticipating needs, proactively addressing challenges, and maintaining a positive and professional demeanor in all interactions. I'm skilled at [RELEVANT SKILLS, e.g., building strong relationships, fostering trust, and effective communication]. With my meticulous attention to detail and ability to juggle multiple tasks simultaneously, I'm confident I will exceed expectations and contribute to the overall efficiency of your organization.  

Thank you for considering my application. I'm excited about the prospect of joining [COMPANY] and am eager to discuss how my experience and skills can contribute to the ongoing success of your team.  

Sincerely,  
[YOUR NAME]  
`,
  },
  {
    title: "AI Developer Cover Letter Template",
    description: (
      <p className="text-xs">
        Find our AI developer cover letter template, ready to modify for your
        next job application. Get a head start on finding an AI developer job.
        Source:{" "}
        <a
          href="https://www.upwork.com/resources/virtual-assistant-cover-letter-template"
          target="_blank"
          className="underline"
        >
          template
        </a>
      </p>
    ),
    template: `\
[DATE]  

[DEAR HIRING MANAGER NAME],  

In today's competitive business landscape, forward-thinking organizations must have an AI strategy in which innovation, technology, and people come together to create value. I firmly believe that my unique mix of skills makes me the ideal candidate for the open AI developer role at [COMPANY].  

In my role at [CURRENT EMPLOYER], I have been instrumental in [KEY ACCOMPLISHMENTS, e.g., developing and deploying deep learning models to predict customer behavior]. My expertise extends to [SPECIFIC AI DOMAINS, e.g., natural language processing, computer vision, reinforcement learning]. I am proficient in [PROGRAMMING LANGUAGES, e.g., Python, Java, C++] and frameworks such as [AI FRAMEWORKS, e.g., TensorFlow, PyTorch, Keras].

I believe what sets me apart is my ability to [RELEVANT SKILLS, e.g., bridge the gap between research and practical implementation, clearly communicate highly complex technical concepts to non-technical stakeholders]. I am particularly drawn to your organization's focus on [SPECIFIC REASON RELATED TO COMPANY OR INDUSTRY, e.g., leveraging new technologies to solve real-world challenges, developing ethical and responsible AI solutions].  

In addition to my technical skills, I pride myself on my elevated [SOFT SKILLS, e.g., strong problem-solving abilities, empathy, emotional intelligence]. I thrive in fast-paced, collaborative environments and am always eager to learn, grow, and share my knowledge about AI and technology. I believe that my combination of technical expertise and interpersonal skills would enable me to make a significant contribution to your AI initiatives.  

Thank you for considering my application. I am excited about the opportunity to bring my passion for technology to [COMPANY] and contribute to the advancement of innovative AI-driven solutions. I look forward to the possibility of discussing this exciting opportunity with you.  

Sincerely,  
[YOUR NAME]  
`,
  },
  {
    title: "UX Designer Cover Letter Template",
    description: (
      <p className="text-xs">
        Find our UX designer cover letter template, ready to modify for your
        next job application. Get a head start on applying to a UX design role.
        Source:{" "}
        <a
          href="https://www.upwork.com/resources/virtual-assistant-cover-letter-template"
          target="_blank"
          className="underline"
        >
          template
        </a>
      </p>
    ),
    template: `\
[DATE]  

[DEAR HIRING MANAGER NAME],  

I'm excited to submit my application for the UX designer position at [COMPANY]. With my strong background in user-centered design and my passion for creating intuitive and engaging user experiences, I'm confident that I would be an invaluable addition to your team.  

Throughout my career, I've honed my skills in [SPECIFIC SKILLS OR EXPERIENCES, e.g., user research, wireframing, prototyping, usability testing]. While working at [PREVIOUS COMPANY], I successfully [NOTE A KEY ACCOMPLISHMENT, e.g., led the redesign of a complex application resulting in a 70% increase in user satisfaction].  

I'm highly proficient in design tools such as [SPECIFIC SOFTWARE NAMES, e.g., Sketch, Figma, InVision, Adobe Creative Cloud], which allows me to efficiently collaborate with cross-functional teams and bring design concepts to life. Beyond my technical expertise, I possess a range of valuable soft skills, including [SOFT SKILLS, e.g. communication, collaboration, adaptability]. My approach to design is rooted in empathy for the end users and key stakeholders. This has enabled me to align user needs and technical feasibility, ensuring that my proposed solutions are both innovative and practical.  

What attracts me to [COMPANY] is your commitment to [SPECIFIC REASON RELATED TO COMPANY OR INDUSTRY, e.g., creating user-centric products to solve real-world problems, fostering a culture of innovation]. My approach to UX design aligns perfectly with your company's values, as I believe in [RELEVANT SKILLS OR PHILOSOPHIES, e.g., meaningfully connecting with users, iterating based on feedback, striving for simplicity in design].  

I'm thrilled about the opportunity to bring my skills and passion to [COMPANY] and contribute to the creation of exceptional user experiences. I encourage you to explore my portfolio at [LINK], which showcases my range and experience in solving design challenges and creating impactful user experiences. I look forward to the opportunity to discuss how I can contribute to the continued success of [COMPANY].  

Best regards,  
[YOUR NAME]  
`,
  },
  {
    title: "Bookkeeper Cover Letter Template",
    description: (
      <p className="text-xs">
        This bookkeeper cover letter template is a great starting point for
        applying for jobs. Find a professional cover letter template for your
        next bookkeeping role.Source:{" "}
        <a
          href="https://www.upwork.com/resources/virtual-assistant-cover-letter-template"
          target="_blank"
          className="underline"
        >
          template
        </a>
      </p>
    ),
    template: `\
[DATE]  

[DEAR HIRING MANAGER NAME],  

As a detail-oriented professional with [NUMBER] years of experience in financial record-keeping, I am excited about the prospect of joining [COMPANY] as a bookkeeper. With a solid foundation in bookkeeping best practices and a proven track record of ensuring accuracy and compliance, I am confident in my ability to make a positive impact on your organization.  

Throughout my career, I have honed my skills in [SPECIFIC SKILLS OR EXPERIENCES, e.g., accounts payable and receivable, bank reconciliations, financial reporting]. In my role at [CURRENT/PREVIOUS COMPANY], I successfully [KEY ACCOMPLISHMENTS, e.g., implemented a new accounting software system, reducing manual data entry by 50%].  

I am proficient in various accounting software tools, such as [SPECIFIC BOOKKEEPING SOFTWARE, e.g., QuickBooks, Xero, Microsoft Excel, FreshBooks], which allows me to streamline processes, manage general ledgers, maintain accurate records and help boost overall financial performance. [OPTIONAL: MENTION RELEVANT PROFESSIONAL CERTIFICATIONS, e.g., I hold a Certified Bookkeeper (CB) designation from the American Institute of Professional Bookkeepers (AIPB), demonstrating my commitment to professional development.]  

My approach to bookkeeping aligns perfectly with your company's values, as I believe in [RELEVANT ABILITIES OR PHILOSOPHIES, e.g., maintaining the highest level of integrity, displaying meticulous attention to detail, providing insightful financial information to support decision-making].  

I possess many key soft skills and have built a reputation as a [DESCRIPTIVE ADJECTIVE, e.g. strong communicator, proactive problem-solver, adaptable team player]. I fully understand the importance of meeting deadlines, respecting confidentiality, and building trust with colleagues and clients alike.  

I am truly excited about the opportunity to bring my bookkeeping expertise and dedication to [COMPANY] and contribute to your success. Thank you for considering my application. I would welcome the chance to discuss further how my skills and experience align with your organization's needs and goals.  

Best regards,  
[YOUR NAME]  
`,
  },
  {
    title: "SEO Specialist Cover Letter Template",
    description: (
      <p className="text-xs">
        This SEO specialist cover letter template is a great starting point for
        applying for jobs. Find a professional cover letter for your next SEO
        role. Source:{" "}
        <a
          href="https://www.upwork.com/resources/virtual-assistant-cover-letter-template"
          target="_blank"
          className="underline"
        >
          template
        </a>
      </p>
    ),
    template: `\
[DATE]  

[DEAR HIRING MANAGER NAME],  

After reviewing the job description for the [SEO JOB TITLE] role at [COMPANY], I'm confident that my skills, work style, achievements, and strategic mindset align closely with the requirements for success in this position.  

With [NUMBER] years of experience in the dynamic field of SEO, I have developed a deep understanding of the strategies and techniques required to improve online visibility and drive user engagement. My expertise encompasses keyword research, on-page optimization, link building, content strategy, and analytics.  

Throughout my career, I've honed these skills and consistently delivered quantifiable results. During my tenure at [CURRENT/PREVIOUS EMPLOYER], I successfully executed SEO campaigns that led to a [KEY ACCOMPLISHMENTS, e.g., developed SEO campaigns that led to a surge in organic traffic and a 35% increase in lead generation]. I'm highly proficient in a range of SEO tools, such as [SPECIFIC SEO TOOLS, e.g., Google Analytics, SEMrush, Ahrefs, Screaming Frog], which allow me to analyze data, identify opportunities, and develop strategies that drive results.  

What distinguishes me from others is my creative problem-solving approach and my ability to develop unique solutions to SEO challenges. [OPTIONAL: INCLUDE A BRIEF EXAMPLE OF A CREATIVE SOLUTION YOU DEVELOPED FOR A COMPLEX SEO ISSUE]. I'm constantly exploring the latest industry developments and algorithm updates to ensure that my strategies remain at the forefront of the field. My strong analytical skills enable me to uncover hidden opportunities and optimize campaigns for maximum impact.  

My approach to SEO aligns perfectly with your company's values and methodology, as I believe in [RELEVANT SKILLS OR PHILOSOPHIES, e.g., combining data-driven insights with creative strategies, collaborating with cross-functional teams, always prioritizing the user's needs].  

I'm excited about the opportunity to contribute to your continued success in the digital marketing realm. I would welcome the chance to discuss in greater detail how my skills and experience can contribute to [COMPANY'S] success. Thank you for considering my application, and I eagerly anticipate the opportunity to join your exceptional team.  

Best regards,  
[YOUR NAME]  
`,
  },
];

const influencersTemplates: TemplateInfo[] = [
  {
    title: "Josh Burns' template",
    description: (
      <p className="text-xs">
        Upwork Proposals will either make or break you as a freelancer and they
        are typically the #1 reason why freelancers struggle to win jobs on
        Upwork. Let&apos;s take a look at an Upwork proposal sample that landed
        me a <span className="font-bold">$167,000+ client</span>. Source:{" "}
        <a
          href="https://www.youtube.com/watch?v=dOVtO9JVLVY"
          target="_blank"
          className="underline"
        >
          video
        </a>
      </p>
    ),
    template: `\
**— Cover Letter Introduction —**  
Hi [insert name of client]!  
 
Thank you so much for providing detailed information about your job. It instantly grabbed my attention and aligns perfectly with my experience as a [insert your job title].  
 
**— Provide an example of your work —**  
As you can view on my Upwork profile, I've completed numerous [insert job title] jobs with 5-star reviews, including overly positive client feedback. Two specific examples that showcase the quality of my work and relate directly to your job post are attached to this proposal for you.  
 
**— Prove your credibility —**  
Here's what you should know about me:  
[List your best accomplishments, qualifications, and anything that makes you stand out among the crowd]  
 
**— List what you can bring to the project —**  
Here's what I can bring to your project:  
[Read over the job description again and tell the client how you can benefit their project]  
 
**— Include a call to action —**  
Let's schedule a quick 10-minute introduction call so that we can discuss your project in more detail and ensure that I will be the perfect fit. I have today open from [insert available times].  
 
If those times don't work for you, just let me know what works best and I will do my best to alter my schedule around your availability.  
 
Questions for the call:  
 
 - [Insert question]
 - [Insert question]
 - [Insert question]
 
I am looking forward to hearing more about your exciting project and how I can help you! : )  
 
**— Closing —**   
Best Regards,  
[Your Name]  
`,
  },
  {
    title: "Deya's template",
    description: (
      <p className="text-xs">
        Upwork proposals... what are you supposed to include in them? I&apos;ve
        sent over 250 proposals over the course of my time on Upwork, so in this
        video, let&apos;s talk through the template I used to land Upwork jobs
        and I&apos;ll wrap up the video with a few of my biggest lessons learned
        for writing Upwork proposals that actually land clients!. Source:{" "}
        <a
          href="https://www.youtube.com/watch?v=ztqpXW7alCg"
          target="_blank"
          className="underline"
        >
          video
        </a>
      </p>
    ),
    template: `\
- PART 1: SNAZZY INTRO   
    
    Hi [CLIENT_NAME],  
    
    My name is [NAME], and (if all goes well), I'd love to be your new [POSITION_TITLE]  
    
    [MENTION SOMETHING SPECIFIC OR RELATED TO THEIR PROJECT]  
    
- PART 2: THE BIG GUNS  
    
    I've been working as a [YOUR JOB POSITION] for [X] years, and in that time my work has primarily consisted of [A FEW BROAD FIELDS THAT ARE HIGHLY RELEVANT TO THE JO LISTING], and I'm very familiar with tools like [MENTION TOOLS THAT THEY MENTIONED + FEW OTHER].  
    
    - [2-4 SENTENCES ABOUT YOU RELEVANT HARD SKILLS + 1 RELEVANT EXAMPLE WITH METRICS]  
    - [1 SENTENCE ABOUT YOUR RELEVANT SOFT SKILLS IN AN SPECIFIC WAY]  
    
    I have attached my resume as well as my portfolio with 2 relevant samples for [THEIR TYPE OF BUSINESS].  
    
- PART 3: THE CALL TO ACTION  
    
    If you'd like, we can hop on a quick 20-minute chat to talk through any other follow-up questions.  
    
    All the best,  
    
    [YOUR NAME]  
    
    P.S. [ENGAGE THEM WITH A QUESTION OR PIQUE THEIR CURIOSITY IN SOME WAY]
`,
  },
];

function JobDescriptionPopover({
  template,
  userData,
}: {
  template: string;
  userData: UserData;
}) {
  const [jobDescription, setJobDescription] = useState("");
  const { submitUserMessage } = useActions();
  const [_, setMessages] = useUIState();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm">Use this one</Button>
      </PopoverTrigger>
      <PopoverContent className="w-[500px]">
        <div className="grid w-full gap-4">
          <Label htmlFor="message">Insert the job description</Label>
          <Textarea
            placeholder="Type the job description here."
            rows={5}
            id="message"
            onChange={(e) => {
              setJobDescription(e.target.value);
            }}
          />
          <Button
            className="w-52 mx-auto"
            onClick={async () => {
              const response = await submitUserMessage(
                `Important! Do not call any tool this is just a simple text prompt.
Generate a cover letter using this template: ${template}.
With my freelance profile information: 
-Name: ${userData.name}
-Job title: ${userData.jobTitle}
-Description: ${userData.description}
-Skills: ${userData.skills.join(", ")}
Use the job description as the context to improve the result: ${jobDescription}.
Note: Fill the square brackets using the freelancer information and the job description as context, leave the ones that you don't have enough information.`
              );

              setMessages((currentMessages: any[]) => [
                ...currentMessages,
                response,
              ]);
            }}
          >
            Generate cover letter
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function ListTemplates() {
  const [userData, _] = useLocalStorage<UserData | null>(USER_DATA_STORAGE_KEY);

  return (
    <div className="grid gap-4 w-full">
      <p>
        Here is a list of templates you can use to write your cover letter.
        Divided by career stage, roles and popular freelance influencers.
      </p>
      <h1 className="text-center font-semibold underline">
        Influencers cover letter templates
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 content-stretch gap-4">
        {influencersTemplates.map((templateInfo) => (
          <Card key={templateInfo.title}>
            <CardHeader>
              <CardTitle className="text-base">{templateInfo.title}</CardTitle>
              <CardDescription>{templateInfo.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 justify-center">
                <TemplateDialog
                  title={templateInfo.title}
                  template={templateInfo.template}
                />
                <JobDescriptionPopover
                  template={templateInfo.template}
                  userData={userData!}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <h1 className="text-center font-semibold underline">
        Cover letter templates by career stage
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 content-stretch gap-4">
        {careerStageTemplates.map((templateInfo) => (
          <Card key={templateInfo.title}>
            <CardHeader>
              <CardTitle className="text-base">{templateInfo.title}</CardTitle>
              <CardDescription>{templateInfo.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 justify-center">
                <TemplateDialog
                  title={templateInfo.title}
                  template={templateInfo.template}
                />
                <JobDescriptionPopover
                  template={templateInfo.template}
                  userData={userData!}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <h1 className="text-center font-semibold underline">
        Cover letter templates by career stage
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 content-stretch gap-4">
        {roleTemplates.map((templateInfo) => (
          <Card key={templateInfo.title}>
            <CardHeader>
              <CardTitle className="text-base">{templateInfo.title}</CardTitle>
              <CardDescription>{templateInfo.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 justify-center">
                <TemplateDialog
                  title={templateInfo.title}
                  template={templateInfo.template}
                />
                <JobDescriptionPopover
                  template={templateInfo.template}
                  userData={userData!}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
