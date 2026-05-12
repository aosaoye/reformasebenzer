import { getAllProjects, getHomePage } from "@/lib/services/projects";
import { getAllTestimonials } from "@/lib/services/testimonials";
import HomeClient from "@/components/HomeClient";

export const dynamic = 'force-dynamic';

export default async function Home() {
    const [allProjects, homepageData, testimonialsData] = await Promise.all([
        getAllProjects(),
        getHomePage(),
        getAllTestimonials()
    ]);
    
    const projects = allProjects.slice(0, 6);

    return <HomeClient projects={projects} homepage={homepageData} testimonials={testimonialsData} />;
}



