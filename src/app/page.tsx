import { approachContent } from "@/content/approach-content";
import { capabilities } from "@/content/capabilities";
import { contactContent } from "@/content/contact-content";
import { footerContent } from "@/content/footer-content";
import { heroContent } from "@/content/hero-content";
import { projects } from "@/content/projects";
import { servicesContent } from "@/content/services-content";
import { teamContent } from "@/content/team-content";
import { primaryNavigation } from "@/content/site-navigation";
import { workContent } from "@/content/work-content";
import { ApproachSection } from "@/features/approach";
import { ContactSection, submitContactRequest } from "@/features/contact";
import { HeroSection } from "@/features/hero";
import { ServicesSection } from "@/features/services";
import { SiteFooter } from "@/features/site-footer";
import { TeamSection } from "@/features/team";
import { SiteHeader } from "@/features/site-header";
import { WorkSection } from "@/features/work";

/**
 * Landing page.
 *
 * A server component whose only responsibility is to resolve content and hand it
 * to the presentation layer, so features stay independent of where their copy
 * comes from.
 */
export default function HomePage() {
  return (
    <>
      <SiteHeader navigation={primaryNavigation} capabilities={capabilities} />
      <main id="main">
        <HeroSection content={heroContent} capabilities={capabilities} />
        <ServicesSection content={servicesContent} capabilities={capabilities} />
        <WorkSection content={workContent} projects={projects} />
        <ApproachSection content={approachContent} />
        <TeamSection content={teamContent} />
        <ContactSection content={contactContent} onSubmit={submitContactRequest} />
      </main>
      <SiteFooter content={footerContent} capabilities={capabilities} />
    </>
  );
}
