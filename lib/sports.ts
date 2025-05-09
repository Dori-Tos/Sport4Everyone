import { z } from "zod";

export const sportSchema = z.object({
    id: z.number().optional(),
    name: z.string(),
})

export type Sport = z.infer<typeof sportSchema>;

export async function getSports() {
    try {
        const res = await fetch("http://localhost:3000/api/sports");
        
        if (!res.ok) {
            console.error("Error fetching sports:", res.status);
            return [];
        }
        
        return (await res.json()) as Sport[];;
    } catch (error) {
        console.error("Error in getSports:", error);
        return [];
    }
}

export async function addSport(sport: Sport) {
    sport = sportSchema.parse(sport);

    const formData = new URLSearchParams();
    formData.append("name", sport.name);

    const res = await fetch("http://localhost:3000/api/sports", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
    });
    return (await res.json()) as Sport;
}

export async function removeSport(id: string) {
    const formData = new URLSearchParams();
    formData.append("id", String(id));

    const res = await fetch(`http://localhost:3000/api/sports/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formData.toString(),
    });      
    return (await res.json()) as Sport;
}